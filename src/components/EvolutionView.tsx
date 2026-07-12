import React, { useState, useMemo } from "react";
import { UserProfile, DailyCheckin, BodyMeasurement } from "../types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import AIAssistant from "./AIAssistant";
import { Sparkles, Scale, Eye, TrendingUp, Compass, Plus, Trophy, Clock, Smile } from "lucide-react";

interface EvolutionViewProps {
  profile: UserProfile;
  onSaveCheckin: (checkin: DailyCheckin) => void;
  onSaveMeasurements: (meas: BodyMeasurement) => void;
}

export default function EvolutionView({
  profile,
  onSaveCheckin,
  onSaveMeasurements,
}: EvolutionViewProps) {
  // Check-in Form States
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [mood, setMood] = useState<string>("focado");
  const [musclePain, setMusclePain] = useState<number>(2);
  const [currentWeight, setCurrentWeight] = useState<number>(profile.currentWeight);
  const [notes, setNotes] = useState<string>("");

  // Physical Measurements Forms
  const [showMeasForm, setShowMeasForm] = useState<boolean>(false);
  const [chest, setChest] = useState<number>(profile.measurements[0]?.chest || 90);
  const [waist, setWaist] = useState<number>(profile.measurements[0]?.waist || 70);
  const [hips, setHips] = useState<number>(profile.measurements[0]?.hips || 95);
  const [armL, setArmL] = useState<number>(profile.measurements[0]?.armL || 30);
  const [armR, setArmR] = useState<number>(profile.measurements[0]?.armR || 30);
  const [thighL, setThighL] = useState<number>(profile.measurements[0]?.thighL || 55);
  const [thighR, setThighR] = useState<number>(profile.measurements[0]?.thighR || 55);

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheckin: DailyCheckin = {
      date: new Date().toISOString().split("T")[0],
      sleepHours,
      energyLevel,
      mood,
      musclePain,
      disposition: energyLevel,
      weight: currentWeight,
      notes,
    };
    onSaveCheckin(newCheckin);
    setNotes("");
    alert("Check-in corporal realizado com sucesso!");
  };

  const handleMeasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeas: BodyMeasurement = {
      date: new Date().toISOString().split("T")[0],
      weight: currentWeight,
      chest,
      waist,
      hips,
      armL,
      armR,
      thighL,
      thighR,
    };
    onSaveMeasurements(newMeas);
    setShowMeasForm(false);
    alert("Medidas corporais atualizadas com sucesso!");
  };

  // Prepare chart data for Recharts
  const weightData = useMemo(() => {
    const list = [...profile.checkins].reverse();
    if (list.length === 0) {
      return [{ date: "Hoje", weight: profile.currentWeight }];
    }
    return list.map((c) => ({
      date: c.date.split("-").slice(1).join("/"), // formats to MM/DD
      weight: c.weight,
    }));
  }, [profile.checkins]);

  const cardioData = useMemo(() => {
    const list = [...profile.activities].reverse().slice(-5);
    if (list.length === 0) {
      return [{ title: "Sem dados", km: 0 }];
    }
    return list.map((a) => ({
      title: a.title.split(" ").slice(0, 2).join(" "),
      km: parseFloat(a.distance.toFixed(1)),
    }));
  }, [profile.activities]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Evolução física
          </h2>
          <p className="text-[#9ca39d] text-sm mt-1">
            Análises de peso, evolução de desempenho e orientações do Treinador IA.
          </p>
        </div>
      </div>

      {/* Chart Section using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weight Evolution Area Chart */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <Scale size={16} className="text-[#c7ff4a]" /> Histórico de Peso Corporal
          </h4>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c7ff4a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c7ff4a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#9ca39d" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca39d" fontSize={11} domain={["auto", "auto"]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#171b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  labelClassName="text-white text-xs font-bold"
                  itemStyle={{ color: "#c7ff4a", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="weight" stroke="#c7ff4a" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kilometer Bar Chart */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <TrendingUp size={16} className="text-[#c7ff4a]" /> Distância Recente de Cardio (km)
          </h4>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cardioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="title" stroke="#9ca39d" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca39d" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#171b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  itemStyle={{ color: "#c7ff4a", fontSize: "12px" }}
                />
                <Bar dataKey="km" fill="#c7ff4a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Columns: Daily Check-in and Body Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily Check-in Form */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl lg:col-span-2 space-y-4">
          <h4 className="text-white font-bold text-base font-display">Registrar Check-in Corporal</h4>
          <form onSubmit={handleCheckinSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[#9ca39d] block font-semibold">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9ca39d] block font-semibold">Horas de Sono</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9ca39d] block font-semibold">Energia/Disposição (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9ca39d] block font-semibold">Musculatura Dolorida?</label>
                <select
                  value={musclePain}
                  onChange={(e) => setMusclePain(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                >
                  <option value={1}>1 - Muito leve / Sem dor</option>
                  <option value={3}>3 - Recuperação ativa</option>
                  <option value={5}>5 - Dor muscular moderada</option>
                  <option value={8}>8 - Fadiga muscular intensa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[#9ca39d] block font-semibold">Observações Rápidas</label>
                <input
                  type="text"
                  placeholder="Ex: Lombar levemente cansada após agachamento."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9ca39d] block font-semibold">Humor Predominante</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171b18] border border-white/5 rounded-xl text-white focus:outline-none"
                >
                  <option value="focado">Focado / Produtivo</option>
                  <option value="radiante">Radiante / Energizado</option>
                  <option value="estavel">Estável / Calmo</option>
                  <option value="cansado">Cansado / Exausto</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#c7ff4a] hover:bg-[#b6f033] text-[#0b0d0c] font-black cursor-pointer transition-all"
            >
              Salvar Check-In Corporal
            </button>
          </form>
        </div>

        {/* Body Measurements Overview */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display">
                Medidas Corporais
              </h4>
              <button
                onClick={() => setShowMeasForm(!showMeasForm)}
                className="text-xs font-semibold text-[#c7ff4a] hover:underline cursor-pointer"
              >
                {showMeasForm ? "Fechar" : "Atualizar"}
              </button>
            </div>

            {!showMeasForm ? (
              <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#171b18] border border-white/5 flex justify-between">
                  <span className="text-[#9ca39d]">Busto/Tórax:</span>
                  <b className="text-white font-mono">{profile.measurements[0]?.chest || 0} cm</b>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b18] border border-white/5 flex justify-between">
                  <span className="text-[#9ca39d]">Cintura:</span>
                  <b className="text-white font-mono">{profile.measurements[0]?.waist || 0} cm</b>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b18] border border-white/5 flex justify-between">
                  <span className="text-[#9ca39d]">Quadril:</span>
                  <b className="text-white font-mono">{profile.measurements[0]?.hips || 0} cm</b>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b18] border border-white/5 flex justify-between">
                  <span className="text-[#9ca39d]">Braço (L/R):</span>
                  <b className="text-white font-mono">
                    {profile.measurements[0]?.armL || 0}/{profile.measurements[0]?.armR || 0} cm
                  </b>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b18] border border-white/5 flex justify-between col-span-2">
                  <span className="text-[#9ca39d]">Coxas (L/R):</span>
                  <b className="text-white font-mono">
                    {profile.measurements[0]?.thighL || 0}/{profile.measurements[0]?.thighR || 0} cm
                  </b>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMeasSubmit} className="space-y-2 pt-2 text-[10px]">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[#9ca39d] block font-semibold mb-1">Tórax</label>
                    <input
                      type="number"
                      value={chest}
                      onChange={(e) => setChest(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-[#171b18] border border-white/5 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9ca39d] block font-semibold mb-1">Cintura</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-[#171b18] border border-white/5 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9ca39d] block font-semibold mb-1">Quadril</label>
                    <input
                      type="number"
                      value={hips}
                      onChange={(e) => setHips(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-[#171b18] border border-white/5 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#9ca39d] block font-semibold mb-1">Braço Esquerdo</label>
                    <input
                      type="number"
                      value={armL}
                      onChange={(e) => setArmL(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-[#171b18] border border-white/5 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9ca39d] block font-semibold mb-1">Braço Direito</label>
                    <input
                      type="number"
                      value={armR}
                      onChange={(e) => setArmR(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-[#171b18] border border-white/5 rounded text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#c7ff4a] text-[#0b0d0c] font-black rounded text-[11px] mt-2 cursor-pointer"
                >
                  Confirmar Medidas
                </button>
              </form>
            )}
          </div>
          
          <div className="p-3 bg-[#171b18] rounded-xl border border-white/5 text-[10px] text-[#9ca39d] mt-4 font-mono leading-relaxed">
            *Medições sincronizadas localmente. Para comparar o percentual de gordura estimado, preencha a cintura e quadril.
          </div>
        </div>
      </div>

      {/* Deep Gemini AI Trainer Chat Console Integration */}
      <div className="pt-2">
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-1 shadow-2xl">
          <AIAssistant profile={profile} />
        </div>
      </div>
    </div>
  );
}
