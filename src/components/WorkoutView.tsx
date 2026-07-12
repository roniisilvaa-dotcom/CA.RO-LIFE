import React, { useState, useEffect, useRef } from "react";
import { UserProfile, WorkoutPlan, Exercise, ExerciseSet } from "../types";
import { formatDuration, sendNotification } from "../utils";
import { Play, Check, Clock, Plus, Trash2, ArrowLeft, Trophy, AlertCircle, Sparkles } from "lucide-react";

interface WorkoutViewProps {
  profile: UserProfile;
  onSaveWorkoutSession: (planId: string, durationSeconds: number, completedSetsCount: number) => void;
  onUpdateWorkoutPlans: (plans: WorkoutPlan[]) => void;
}

export default function WorkoutView({
  profile,
  onSaveWorkoutSession,
  onUpdateWorkoutPlans,
}: WorkoutViewProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Set initial selected tab based on profile
  useEffect(() => {
    if (profile.workoutPlans.length > 0) {
      setSelectedPlanId(profile.workoutPlans[0].id);
    }
  }, [profile.id]);

  const activePlan = profile.workoutPlans.find((p) => p.id === selectedPlanId) || profile.workoutPlans[0];

  // Active workout states
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({}); // key: "exerciseId-setIndex"
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [reps, setReps] = useState<Record<string, number>>({});
  
  // Rest Timer States
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);
  const [customRestValue, setCustomRestValue] = useState<number>(60); // 60 seconds rest

  // Editing mode states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlans, setEditingPlans] = useState<WorkoutPlan[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [newExerciseDesc, setNewExerciseDesc] = useState<string>("3 séries de 12 repetições");

  const sessionTimerRef = useRef<any>(null);
  const restTimerRef = useRef<any>(null);

  // Sync edit states
  useEffect(() => {
    setEditingPlans(JSON.parse(JSON.stringify(profile.workoutPlans)));
  }, [profile.workoutPlans]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      stopSessionTimer();
      stopRestTimer();
    };
  }, []);

  // Session Timer
  const startSessionTimer = () => {
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopSessionTimer = () => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // Rest Timer
  const startRestTimer = (duration: number) => {
    stopRestTimer();
    setRestTimerSeconds(duration);
    setRestTimerActive(true);

    restTimerRef.current = setInterval(() => {
      setRestTimerSeconds((prev) => {
        if (prev <= 1) {
          stopRestTimer();
          // Visual beep feedback (using standard Web Audio API simple beep)
          try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);
            osc.frequency.value = 880; // High pitch beep
            osc.type = "sine";
            gain.gain.setValueAtTime(0.08, context.currentTime);
            osc.start();
            osc.stop(context.currentTime + 0.25);
          } catch (e) {
            // Suppress Web Audio autoplay policy restriction error
          }
          sendNotification("CA.RO LIFE — Descanso Concluído", "Hora de iniciar a próxima série!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
    setRestTimerActive(false);
  };

  const handleStartWorkout = () => {
    setIsSessionActive(true);
    setSessionSeconds(0);
    setCompletedSets({});
    stopRestTimer();

    // Prepopulate weights and reps from exercise setup
    const initialWeights: Record<string, number> = {};
    const initialReps: Record<string, number> = {};
    activePlan.exercises.forEach((ex) => {
      ex.sets.forEach((set, idx) => {
        const key = `${ex.id}-${idx}`;
        initialWeights[key] = set.weight;
        initialReps[key] = set.reps;
      });
    });
    setWeights(initialWeights);
    setReps(initialReps);

    startSessionTimer();
  };

  const handleToggleSet = (exId: string, setIdx: number) => {
    const key = `${exId}-${setIdx}`;
    const wasCompleted = completedSets[key];
    
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !wasCompleted,
    }));

    if (!wasCompleted) {
      // Trigger rest timer
      startRestTimer(customRestValue);
    }
  };

  const handleWeightChange = (exId: string, setIdx: number, val: number) => {
    setWeights((prev) => ({ ...prev, [`${exId}-${setIdx}`]: val }));
  };

  const handleRepsChange = (exId: string, setIdx: number, val: number) => {
    setReps((prev) => ({ ...prev, [`${exId}-${setIdx}`]: val }));
  };

  const handleEndWorkout = () => {
    stopSessionTimer();
    stopRestTimer();

    // Calculate stats
    const totalSetKeys = Object.keys(weights);
    const completedSetsCount = Object.keys(completedSets).filter((k) => completedSets[k]).length;

    if (completedSetsCount === 0) {
      if (confirm("Você não concluiu nenhuma série. Deseja fechar o treino sem salvar no histórico?")) {
        setIsSessionActive(false);
      } else {
        startSessionTimer();
      }
      return;
    }

    onSaveWorkoutSession(activePlan.id, sessionSeconds, completedSetsCount);
    setIsSessionActive(false);
    alert(`Sensacional! Treino concluído com sucesso. Você completou ${completedSetsCount} de ${totalSetKeys.length} séries planejadas!`);
  };

  const handleSaveEditPlans = () => {
    onUpdateWorkoutPlans(editingPlans);
    setIsEditing(false);
    alert("Fichas de treino atualizadas com sucesso!");
  };

  const handleAddExercise = (planId: string) => {
    if (!newExerciseName.trim()) return;

    const newEx: Exercise = {
      id: `ex-added-${Date.now()}`,
      name: newExerciseName,
      defaultDescription: newExerciseDesc,
      sets: [
        { weight: 10, reps: 12, completed: false },
        { weight: 10, reps: 12, completed: false },
        { weight: 10, reps: 12, completed: false },
      ],
    };

    setEditingPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return { ...p, exercises: [...p.exercises, newEx] };
        }
        return p;
      })
    );

    setNewExerciseName("");
  };

  const handleRemoveExercise = (planId: string, exId: string) => {
    setEditingPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return { ...p, exercises: p.exercises.filter((e) => e.id !== exId) };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      {!isSessionActive && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
              {isEditing ? "Editar fichas de treino" : "Meus treinos"}
            </h2>
            <p className="text-[#9ca39d] text-sm mt-1">
              {isEditing
                ? "Adicione, remova ou personalize exercícios para Roni ou Camila."
                : `Treinos de musculação ajustados para o seu perfil.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-white/5 bg-[#151916] text-[#9ca39d] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEditPlans}
                  className="px-4 py-2 rounded-xl bg-[#c7ff4a] text-[#0b0d0c] text-xs font-black cursor-pointer hover:bg-[#b6f033]"
                >
                  Salvar Mudanças
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl border border-white/5 bg-[#151916] text-white text-xs font-semibold hover:border-white/10 cursor-pointer"
              >
                Editar Fichas
              </button>
            )}
          </div>
        </div>
      )}

      {/* Normal View (Not Active Session) */}
      {!isSessionActive && (
        <div className="space-y-6">
          {/* Tabs header selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(isEditing ? editingPlans : profile.workoutPlans).map((p) => {
              const isSelected = p.id === selectedPlanId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`px-5 py-3 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#c7ff4a] text-[#0b0d0c] border-transparent shadow-[0_4px_15px_rgba(199,255,74,0.15)]"
                      : "bg-[#121513] text-[#9ca39d] border-white/5 hover:bg-[#171b18] hover:text-white"
                  }`}
                >
                  {p.name.split(" — ")[0]} {/* Short code like "Treino A" */}
                </button>
              );
            })}
          </div>

          {/* Active plan card */}
          {activePlan && (
            <div className="rounded-3xl bg-[#121513] border border-white/5 p-6 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    {isEditing
                      ? editingPlans.find((p) => p.id === selectedPlanId)?.name
                      : activePlan.name}
                  </h3>
                  <p className="text-[#9ca39d] text-xs mt-1">
                    {isEditing
                      ? editingPlans.find((p) => p.id === selectedPlanId)?.description
                      : activePlan.description}
                  </p>
                </div>

                {!isEditing && activePlan && activePlan.exercises.length > 0 && (
                  <button
                    onClick={handleStartWorkout}
                    className="px-5 py-3 bg-[#c7ff4a] hover:bg-[#b6f033] text-[#0b0d0c] text-xs font-black rounded-xl hover:shadow-[0_4px_15px_rgba(199,255,74,0.2)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Play size={13} fill="currentColor" /> Iniciar Treino Agora
                  </button>
                )}
              </div>

              {/* Exercises Checklist */}
              {!isEditing && activePlan && activePlan.exercises.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-3xl bg-[#171b18] text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#c7ff4a]/10 flex items-center justify-center text-[#c7ff4a]">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="text-white text-lg font-bold">Dia de Descanso & Recuperação</h4>
                  <p className="text-[#9ca39d] text-sm max-w-md mx-auto">
                    Hoje é dia de permitir que as fibras musculares se recuperem e se fortaleçam. Foque na hidratação, alimentação saudável e boa qualidade de sono!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(isEditing
                    ? editingPlans.find((p) => p.id === selectedPlanId)?.exercises || []
                    : activePlan?.exercises || []
                  ).map((ex, exIdx) => (
                  <div
                    key={ex.id}
                    className="p-4 border border-white/5 rounded-2xl bg-[#171b18] flex items-center justify-between gap-4"
                  >
                    <div>
                      <b className="text-white text-sm md:text-base font-semibold block">
                        {exIdx + 1}. {ex.name}
                      </b>
                      <span className="text-[#9ca39d] text-xs mt-1 block">
                        {ex.defaultDescription}
                      </span>
                    </div>

                    {isEditing ? (
                      <button
                        onClick={() => handleRemoveExercise(selectedPlanId, ex.id)}
                        className="p-2 bg-red-600/10 text-[#ff6b6b] border border-red-500/10 rounded-lg hover:bg-red-600/20 cursor-pointer transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-[#121513] border border-white/5 rounded-full text-[#9ca39d] font-mono">
                        {ex.sets.length} séries
                      </span>
                    )}
                  </div>
                ))}

                {/* Add new exercise form in editing mode */}
                {isEditing && (
                  <div className="p-4 border border-dashed border-white/10 rounded-2xl bg-[#141815] space-y-3">
                    <span className="text-xs text-[#c7ff4a] font-bold uppercase tracking-wider block font-mono">
                      ＋ Adicionar Exercício à Ficha
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nome do Exercício (Ex: Crossover Polia Alta)"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        className="px-3.5 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Descrição de Séries (Ex: 4 séries de 12 repetições)"
                        value={newExerciseDesc}
                        onChange={(e) => setNewExerciseDesc(e.target.value)}
                        className="px-3.5 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleAddExercise(selectedPlanId)}
                      disabled={!newExerciseName.trim()}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#c7ff4a]/40 text-white hover:text-[#c7ff4a] text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-40"
                    >
                      Incluir Exercício
                    </button>
                  </div>
                )}
              </div>)}
            </div>
          )}
        </div>
      )}

      {/* Immersive Workout Session Overlay (Fullscreen-like active state) */}
      {isSessionActive && (
        <div className="fixed inset-0 bg-[#0b0d0c] z-50 overflow-y-auto px-4 py-8 md:p-8 animate-fade-in">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Session Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm("Abandonar treino em andamento? O progresso desta sessão será perdido.")) {
                      setIsSessionActive(false);
                      stopSessionTimer();
                    }
                  }}
                  className="p-2 rounded-lg bg-[#121513] border border-white/5 text-[#9ca39d] hover:text-white cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white font-display">
                    Executando: {activePlan.name.split(" — ")[0]}
                  </h2>
                  <span className="text-[#c7ff4a] text-xs font-semibold font-mono uppercase block mt-1">
                    Atividade Muscular Monitorada
                  </span>
                </div>
              </div>

              {/* Timer metrics */}
              <div className="flex items-center gap-4 bg-[#121513] border border-white/5 px-5 py-3 rounded-2xl">
                <div className="text-right">
                  <span className="text-[10px] text-[#9ca39d] uppercase block font-mono leading-none mb-1">
                    Duração
                  </span>
                  <strong className="text-xl font-bold text-white font-mono">
                    {formatDuration(sessionSeconds)}
                  </strong>
                </div>
                <div className="h-6 w-px bg-white/5"></div>
                <div className="text-right">
                  <span className="text-[10px] text-[#9ca39d] uppercase block font-mono leading-none mb-1">
                    Séries Feitas
                  </span>
                  <strong className="text-xl font-bold text-[#c7ff4a] font-mono">
                    {Object.keys(completedSets).filter((k) => completedSets[k]).length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Rest Timer Widget */}
            {restTimerSeconds > 0 && (
              <div className="p-4 border border-[#c7ff4a]/20 rounded-2xl bg-[#141815] flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(199,255,74,0.06)] animate-pulse-slow">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#c7ff4a] animate-spin" size={18} />
                  <div>
                    <strong className="text-white text-sm block">Cronômetro de descanso ativo</strong>
                    <span className="text-[#9ca39d] text-xs mt-0.5 block">Respire fundo e recupere</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-[#c7ff4a]">
                    {restTimerSeconds}s
                  </span>
                  <button
                    onClick={stopRestTimer}
                    className="px-2.5 py-1 text-[10px] uppercase font-bold text-[#9ca39d] hover:text-white border border-white/5 bg-[#121513] rounded-lg cursor-pointer"
                  >
                    Pular
                  </button>
                </div>
              </div>
            )}

            {/* Rest Setting Slider */}
            <div className="px-5 py-3 border border-white/5 bg-[#121513] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#9ca39d] font-medium">Configuração de Descanso:</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="15"
                  value={customRestValue}
                  onChange={(e) => setCustomRestValue(parseInt(e.target.value))}
                  className="w-32 accent-[#c7ff4a]"
                />
                <span className="text-white font-bold font-mono">{customRestValue} segundos</span>
              </div>
            </div>

            {/* Exercise execution cards list */}
            <div className="space-y-4">
              {activePlan.exercises.map((ex, exIdx) => (
                <div key={ex.id} className="rounded-2xl border border-white/5 bg-[#121513] p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-bold text-base md:text-lg font-display">
                        {exIdx + 1}. {ex.name}
                      </h4>
                      <small className="text-[#9ca39d] text-xs mt-0.5 block">{ex.defaultDescription}</small>
                    </div>
                  </div>

                  {/* Sets grid list */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-[#9ca39d] uppercase font-bold px-2">
                      <div>Série</div>
                      <div>Carga (kg)</div>
                      <div>Reps</div>
                      <div>Concluído</div>
                    </div>

                    {ex.sets.map((set, setIdx) => {
                      const key = `${ex.id}-${setIdx}`;
                      const isDone = completedSets[key] || false;
                      const weightVal = weights[key] !== undefined ? weights[key] : set.weight;
                      const repsVal = reps[key] !== undefined ? reps[key] : set.reps;

                      return (
                        <div
                          key={setIdx}
                          className={`grid grid-cols-4 gap-2 items-center text-center p-2 rounded-xl transition-all border ${
                            isDone
                              ? "bg-[#181d19]/40 border-[#c7ff4a]/20"
                              : "bg-[#171b18] border-white/5"
                          }`}
                        >
                          <span className="text-xs font-bold text-white font-mono">#{setIdx + 1}</span>

                          {/* Weight changer input */}
                          <div className="flex justify-center">
                            <input
                              type="number"
                              value={weightVal}
                              onChange={(e) =>
                                handleWeightChange(ex.id, setIdx, parseFloat(e.target.value) || 0)
                              }
                              disabled={isDone}
                              className="w-14 px-1.5 py-1 text-center bg-[#121513] border border-white/5 rounded text-xs text-white font-bold font-mono"
                            />
                          </div>

                          {/* Reps changer input */}
                          <div className="flex justify-center">
                            <input
                              type="number"
                              value={repsVal}
                              onChange={(e) =>
                                handleRepsChange(ex.id, setIdx, parseInt(e.target.value) || 0)
                              }
                              disabled={isDone}
                              className="w-12 px-1.5 py-1 text-center bg-[#121513] border border-white/5 rounded text-xs text-white font-bold font-mono"
                            />
                          </div>

                          {/* Completion checkpoint button */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSet(ex.id, setIdx)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                isDone
                                  ? "bg-[#c7ff4a] text-[#0b0d0c] scale-105"
                                  : "bg-[#121513] hover:bg-[#202520] border border-white/10 text-[#9ca39d] hover:text-white"
                              }`}
                            >
                              <Check size={14} className={isDone ? "stroke-[3px]" : ""} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* End session action block */}
            <div className="pt-4">
              <button
                onClick={handleEndWorkout}
                className="w-full py-4 bg-gradient-to-r from-[#8ce600] to-[#c7ff4a] text-[#0b0d0c] font-black rounded-xl hover:opacity-90 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Trophy size={16} /> Finalizar Treino e Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
