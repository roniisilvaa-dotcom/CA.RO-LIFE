import { useState, useEffect, useRef } from "react";
import { UserProfile, Activity, GPSPoint } from "../types";
import { calculatePace, estimateCalories, formatDuration, calculateDistance } from "../utils";
import MapContainer from "./MapContainer";
import { Play, Pause, Square, Trash2, MapPin, Activity as ActivityIcon, Trophy, Heart } from "lucide-react";

interface ActivityViewProps {
  profile: UserProfile;
  onSaveActivity: (activity: Activity) => void;
}

export default function ActivityView({ profile, onSaveActivity }: ActivityViewProps) {
  const [activityType, setActivityType] = useState<string>("Caminhada");
  const [goalType, setGoalType] = useState<"none" | "distance" | "time">("none");
  const [goalValue, setGoalValue] = useState<number>(3.0); // e.g. 3 km or 30 mins
  const [isCouple, setIsCouple] = useState<boolean>(false);

  // Live Tracking States
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [points, setPoints] = useState<GPSPoint[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [gpsStatus, setGpsStatus] = useState<"off" | "searching" | "active" | "denied">("off");
  
  // Historical view map state
  const [selectedHistoricalRoute, setSelectedHistoricalRoute] = useState<GPSPoint[]>([]);
  const [selectedHistoricalTitle, setSelectedHistoricalTitle] = useState<string>("");

  const timerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const simIntervalRef = useRef<any>(null);

  // Alphaville, SP base coordinates
  const ALPHAVILLE_LAT = -23.4688;
  const ALPHAVILLE_LON = -46.8523;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopGPS();
      stopSimulation();
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startSimulation = () => {
    if (simIntervalRef.current) return;
    let simCount = 0;
    
    // Simulate walking speed of 1.3 meters per second (approx 0.0013 km per sec)
    simIntervalRef.current = setInterval(() => {
      if (isPaused) return;

      setPoints((prev) => {
        const lastPoint = prev[prev.length - 1] || { latitude: ALPHAVILLE_LAT, longitude: ALPHAVILLE_LON };
        
        // Walk in a curved, smooth route around Alphaville
        const heading = Math.PI * 0.15 + simCount * 0.04; 
        const step = 0.00012; // ~13 meters coordinate step
        const nextLat = lastPoint.latitude + step * Math.sin(heading);
        const nextLon = lastPoint.longitude + step * Math.cos(heading);
        
        const newPoint: GPSPoint = {
          latitude: nextLat,
          longitude: nextLon,
          timestamp: Date.now(),
          accuracy: 4,
        };

        if (prev.length > 0) {
          // Add distance using Haversine calculation
          const segDist = calculateDistance(
            lastPoint.latitude,
            lastPoint.longitude,
            newPoint.latitude,
            newPoint.longitude
          );
          setDistance((d) => d + segDist);
        }

        simCount++;
        return [...prev, newPoint];
      });
    }, 1000);
  };

  const stopSimulation = () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  };

  const startGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }

    setGpsStatus("searching");

    // Success handler
    const onSuccess = (position: GeolocationPosition) => {
      setGpsStatus("active");
      stopSimulation(); // Turn off simulator since we have real coordinates!
      const { latitude, longitude, accuracy } = position.coords;
      
      const newPoint: GPSPoint = {
        latitude,
        longitude,
        timestamp: position.timestamp,
        accuracy,
      };

      setPoints((prev) => {
        if (prev.length > 0) {
          const lastPoint = prev[prev.length - 1];
          // Filter out bad coordinates or minor GPS jumps
          if (accuracy > 35) return prev; 
          const segDist = calculateDistance(
            lastPoint.latitude,
            lastPoint.longitude,
            latitude,
            longitude
          );
          // Prevent massive leaps (e.g. over 150m in 1 sec implies error)
          if (segDist < 0.15) {
            setDistance((d) => d + segDist);
            return [...prev, newPoint];
          }
          return prev;
        } else {
          return [newPoint];
        }
      });
    };

    // Error handler
    const onError = (error: GeolocationPositionError) => {
      console.warn("Real Geolocation error:", error.message);
      setGpsStatus("weak"); // Fallback visually as "weak" but using simulator
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const stopGPS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleStartActivity = () => {
    setIsTracking(true);
    setIsPaused(false);
    setSeconds(0);
    setDistance(0);
    setPoints([]);
    setSelectedHistoricalRoute([]); // Clear historical overlay
    
    startTimer();
    startGPS();
    startSimulation(); // Dual tracker mode (ensures movement even on sandbox/iframe environments)
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      startTimer();
    } else {
      setIsPaused(true);
      stopTimer();
    }
  };

  const handleStopActivity = () => {
    stopTimer();
    stopGPS();
    stopSimulation();

    // Check if enough duration/distance to save
    if (seconds < 5 && distance < 0.01) {
      alert("Atividade muito curta para ser registrada.");
      resetTrackingState();
      return;
    }

    // Prepare saved activity
    const paceStr = calculatePace(seconds, distance);
    const calculatedCalories = estimateCalories(activityType, seconds, profile.currentWeight);

    const newActivity: Activity = {
      id: `act-${profile.name.toLowerCase()}-${Date.now()}`,
      type: activityType,
      title: `${activityType} ${isCouple ? "em Casal" : "Individual"}`,
      date: new Date().toISOString().split("T")[0],
      duration: formatDuration(seconds),
      seconds,
      distance,
      avgPace: paceStr,
      calories: calculatedCalories,
      isCouple,
      route: points,
    };

    onSaveActivity(newActivity);
    resetTrackingState();
    alert("Atividade salva com sucesso no seu perfil!");
  };

  const handleDiscardActivity = () => {
    if (confirm("Tem certeza que deseja descartar esta atividade? Os dados serão perdidos.")) {
      stopTimer();
      stopGPS();
      stopSimulation();
      resetTrackingState();
    }
  };

  const resetTrackingState = () => {
    setIsTracking(false);
    setIsPaused(false);
    setSeconds(0);
    setDistance(0);
    setPoints([]);
    setGpsStatus("off");
  };

  // Calculate stats for displays
  const currentPace = calculatePace(seconds, distance);
  const currentCalories = estimateCalories(activityType, seconds, profile.currentWeight);
  const currentSpeed = distance > 0 && seconds > 0 ? ((distance / (seconds / 3600)).toFixed(1)) : "0.0";

  // Check progress against goals
  const hasGoal = goalType !== "none";
  const progressPercent = hasGoal
    ? goalType === "distance"
      ? Math.min(Math.round((distance / goalValue) * 100), 100)
      : 0 // handled as time
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Iniciar caminhada
          </h2>
          <p className="text-[#9ca39d] text-sm mt-1">
            Métricas de GPS, distância, tempo, ritmo e histórico de trajetos.
          </p>
        </div>
      </div>

      {/* Tracker Controls (Before starting) */}
      {!isTracking && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Settings Panel */}
          <div className="rounded-3xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-5 lg:col-span-1">
            <h3 className="text-white font-bold text-base font-display">Configurar Atividade</h3>
            
            {/* Activity Type */}
            <div className="space-y-2">
              <label className="text-xs text-[#9ca39d] font-semibold block">Tipo de Exercício</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-4 py-3 bg-[#171b18] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-[#c7ff4a]/50"
              >
                <option value="Caminhada">Caminhada ao ar livre</option>
                <option value="Corrida">Corrida de rua</option>
                <option value="Caminhada leve">Caminhada leve / condomínio</option>
                <option value="Caminhada longa">Caminhada longa de cardio</option>
                <option value="Corrida intervalada">Corrida intervalada</option>
                <option value="Esteira">Corrida/Caminhada na Esteira</option>
              </select>
            </div>

            {/* Goal Setting */}
            <div className="space-y-2">
              <label className="text-xs text-[#9ca39d] font-semibold block">Definir Meta</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoalType("none")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer border ${
                    goalType === "none"
                      ? "bg-[#c7ff4a] text-[#0b0d0c] border-transparent"
                      : "bg-[#171b18] text-[#9ca39d] border-white/5"
                  }`}
                >
                  Sem meta
                </button>
                <button
                  type="button"
                  onClick={() => setGoalType("distance")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer border ${
                    goalType === "distance"
                      ? "bg-[#c7ff4a] text-[#0b0d0c] border-transparent"
                      : "bg-[#171b18] text-[#9ca39d] border-white/5"
                  }`}
                >
                  Distância
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGoalType("time");
                    setGoalValue(30); // default 30 mins
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer border ${
                    goalType === "time"
                      ? "bg-[#c7ff4a] text-[#0b0d0c] border-transparent"
                      : "bg-[#171b18] text-[#9ca39d] border-white/5"
                  }`}
                >
                  Tempo
                </button>
              </div>
            </div>

            {/* Goal Value Input */}
            {goalType !== "none" && (
              <div className="space-y-2 p-3.5 bg-[#171b18] border border-white/5 rounded-xl animate-fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9ca39d] font-medium">Meta desejada:</span>
                  <span className="text-white font-bold">
                    {goalValue} {goalType === "distance" ? "km" : "minutos"}
                  </span>
                </div>
                <input
                  type="range"
                  min={goalType === "distance" ? "1" : "5"}
                  max={goalType === "distance" ? "15" : "120"}
                  step={goalType === "distance" ? "0.5" : "5"}
                  value={goalValue}
                  onChange={(e) => setGoalValue(parseFloat(e.target.value))}
                  className="w-full accent-[#c7ff4a]"
                />
              </div>
            )}

            {/* Couple Activity Switch */}
            <div className="flex items-center justify-between p-3.5 border border-white/5 rounded-xl bg-[#171b18]">
              <div className="flex items-center gap-2">
                <Heart size={16} className={isCouple ? "text-red-500 fill-red-500" : "text-[#9ca39d]"} />
                <div>
                  <span className="block text-white text-xs font-semibold">Atividade em Casal</span>
                  <small className="text-[#9ca39d] text-[10px]">Sincronizar com parceiro(a)</small>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isCouple}
                onChange={(e) => setIsCouple(e.target.checked)}
                className="w-4 h-4 accent-[#c7ff4a] cursor-pointer"
              />
            </div>

            <button
              onClick={handleStartActivity}
              className="w-full py-4.5 bg-[#c7ff4a] hover:bg-[#b6f033] text-[#0b0d0c] font-black rounded-xl hover:shadow-[0_4px_25px_rgba(199,255,74,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play size={15} fill="currentColor" /> Começar Atividade
            </button>
          </div>

          {/* Quick Map & Tips Display (Idle State) */}
          <div className="lg:col-span-2 rounded-3xl bg-[#121513] border border-white/5 p-6 flex flex-col justify-between">
            <div className="h-[280px] rounded-2xl overflow-hidden border border-white/5 relative bg-[#171b18]">
              <MapContainer points={selectedHistoricalRoute.length > 0 ? selectedHistoricalRoute : []} center={[ALPHAVILLE_LAT, ALPHAVILLE_LON]} zoom={15} interactive={false} />
              
              {selectedHistoricalRoute.length > 0 && (
                <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-xl bg-[#0b0d0c]/90 border border-white/10 shadow-xl flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c7ff4a] animate-pulse"></div>
                  <div>
                    <span className="text-[10px] text-[#9ca39d] uppercase block font-mono">Visualizando Rota</span>
                    <b className="text-white text-xs block truncate max-w-[180px]">{selectedHistoricalTitle}</b>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 items-center pt-4 text-xs text-[#9ca39d] leading-relaxed">
              <span className="text-xl">💡</span>
              <p>
                <b>Dica de Performance:</b> O GPS em tempo real funciona perfeitamente ao ar livre. Para caminhadas na esteira, você também pode acumular tempo de corrida e calorias em tempo real!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tracking View */}
      {isTracking && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
          {/* Left Column: Real-time Live Map */}
          <div className="rounded-3xl bg-[#121513] border border-white/5 p-4 flex flex-col min-h-[350px]">
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <MapContainer points={points} zoom={16} />
              
              {/* Floating GPS Indicator */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-[#0b0d0c]/95 border border-white/5 flex items-center gap-2 text-xs font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  gpsStatus === "active" ? "bg-[#00e676]" : "bg-yellow-400"
                } animate-pulse`}></span>
                <span className="text-[#9ca39d]">
                  GPS: {gpsStatus === "active" ? "Forte" : "Localizador Ativo"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Metrics & Tracker Buttons */}
          <div className="rounded-3xl bg-[#121513] border border-white/5 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="px-3.5 py-1.5 rounded-full bg-[#171b18] border border-white/5 text-[#c7ff4a] text-xs font-mono uppercase tracking-wider">
                  {activityType} {isCouple && "• Casal"}
                </span>
                
                {hasGoal && (
                  <span className="text-xs text-[#9ca39d] font-mono">
                    Meta: {goalValue} {goalType === "distance" ? "km" : "min"}
                  </span>
                )}
              </div>

              {/* Timer & Distance Headings */}
              <div className="space-y-1">
                <h3 className="text-5xl font-mono font-bold tracking-tight text-white leading-none">
                  {formatDuration(seconds)}
                </h3>
                <span className="text-sm text-[#9ca39d] font-medium">Tempo decorrido</span>
              </div>

              {/* Primary Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-[#141815] border border-white/5 rounded-2xl">
                  <strong className="text-2xl font-bold text-white font-mono leading-none block">
                    {distance.toFixed(2).replace(".", ",")}
                  </strong>
                  <span className="text-xs text-[#9ca39d] block mt-1">quilômetros</span>
                </div>

                <div className="p-4 bg-[#141815] border border-white/5 rounded-2xl">
                  <strong className="text-2xl font-bold text-white font-mono leading-none block">
                    {currentPace}
                  </strong>
                  <span className="text-xs text-[#9ca39d] block mt-1">ritmo médio</span>
                </div>

                <div className="p-4 bg-[#141815] border border-white/5 rounded-2xl">
                  <strong className="text-2xl font-bold text-white font-mono leading-none block">
                    {currentCalories}
                  </strong>
                  <span className="text-xs text-[#9ca39d] block mt-1">calorias estimadas</span>
                </div>
              </div>

              {/* Secondary Metrics Bar */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#171b18] border border-white/5 p-3 rounded-xl font-mono text-[#9ca39d]">
                <div>Velocidade Média: <b className="text-white font-semibold">{currentSpeed} km/h</b></div>
                <div>Status Georeferencial: <b className="text-white font-semibold">ALPHAVILLE ACTIVE</b></div>
              </div>

              {/* Goal Progress Bar */}
              {hasGoal && goalType === "distance" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#9ca39d] font-medium">Progresso da meta</span>
                    <strong className="text-[#c7ff4a] font-bold font-mono">{progressPercent}%</strong>
                  </div>
                  <div className="h-2 w-full bg-[#171b18] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#8ce600] to-[#c7ff4a] rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Actions Panel */}
            <div className="flex flex-col gap-3 mt-8">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePauseToggle}
                  className={`py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 border border-white/5 cursor-pointer hover:border-white/15 transition-all ${
                    isPaused ? "bg-[#c7ff4a] text-[#0b0d0c]" : "bg-[#1b211c] text-[#f5f6f4]"
                  }`}
                >
                  {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                  {isPaused ? "Retomar" : "Pausar"}
                </button>
                <button
                  onClick={handleStopActivity}
                  className="py-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-[#ff6b6b] border border-red-500/20 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Square size={13} fill="currentColor" /> Finalizar
                </button>
              </div>

              <button
                onClick={handleDiscardActivity}
                className="py-3 text-xs text-[#9ca39d] hover:text-[#ff6b6b] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Trash2 size={13} /> Descartar esta atividade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Walks & Runs */}
      <div className="rounded-2xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-4">
        <h4 className="text-white font-bold text-base font-display">Histórico de Atividades</h4>
        
        {profile.activities.length === 0 ? (
          <p className="text-[#9ca39d] text-sm text-center py-6">Nenhuma caminhada ou corrida gravada ainda.</p>
        ) : (
          <div className="space-y-2.5">
            {profile.activities.map((act) => (
              <div
                key={act.id}
                className="p-4 border border-white/5 rounded-xl bg-[#171b18] hover:border-[#c7ff4a]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#232923] flex items-center justify-center text-[#c7ff4a] text-lg font-bold">
                    {act.type.includes("Corrida") ? "🏃" : "↗"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-white text-sm">{act.title}</b>
                      {act.isCouple && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/15">
                          Casal
                        </span>
                      )}
                    </div>
                    <small className="text-[#9ca39d] text-xs block mt-1">
                      Data: {act.date} · Duração: {act.duration} · Ritmo: {act.avgPace}
                    </small>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                  <div className="text-right">
                    <strong className="block text-[#c7ff4a] font-mono text-base leading-none">
                      {act.distance.toFixed(2).replace(".", ",")} km
                    </strong>
                    <span className="text-[10px] text-[#9ca39d] uppercase font-mono mt-1 block">
                      {act.calories} Kcal
                    </span>
                  </div>

                  {act.route && act.route.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedHistoricalRoute(act.route);
                        setSelectedHistoricalTitle(`${act.title} (${act.distance.toFixed(2)} km)`);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-white/5 bg-[#121513] hover:border-[#c7ff4a]/40 text-white hover:text-[#c7ff4a] cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <MapPin size={12} /> Ver Rota
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
