import React, { useState, useEffect } from "react";
import { UserProfile, CoupleChallenge } from "../types";
import { Heart, Plus, Trophy, MessageSquare, Send, Sparkles, Smile, Trash2 } from "lucide-react";

interface CoupleViewProps {
  roniProfile: UserProfile;
  camilaProfile: UserProfile;
  challenges: CoupleChallenge[];
  onUpdateChallenges: (ch: CoupleChallenge[]) => void;
  totalKmCombined: number;
}

interface CoupleMessage {
  id: string;
  sender: "Roni" | "Camila";
  text: string;
  timestamp: string;
}

export default function CoupleView({
  roniProfile,
  camilaProfile,
  challenges,
  onUpdateChallenges,
  totalKmCombined,
}: CoupleViewProps) {
  // Couple Messages Board states with local persistence
  const [messages, setMessages] = useState<CoupleMessage[]>(() => {
    try {
      const stored = localStorage.getItem("carolife_v1_couple_messages");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading couple messages:", e);
    }
    // Initial sample messages
    return [
      {
        id: "m-1",
        sender: "Camila",
        text: "Hoje o treino de pernas rendeu demais! Vamos caminhar mais tarde? ❤️",
        timestamp: "12/07, 10:15",
      },
      {
        id: "m-2",
        sender: "Roni",
        text: "Com certeza! Supino completado com 24kg hoje, ritmo de Alphaville tá garantido. Bora bater a meta dos 40km juntos!",
        timestamp: "12/07, 11:30",
      },
    ];
  });

  const [newMessageText, setNewMessageText] = useState<string>("");
  const [messageSender, setMessageSender] = useState<"Roni" | "Camila">("Roni");

  // Save couple messages on update
  useEffect(() => {
    localStorage.setItem("carolife_v1_couple_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: CoupleMessage = {
      id: `msg-${Date.now()}`,
      sender: messageSender,
      text: newMessageText,
      timestamp: new Date().toLocaleDateString([], { day: "2-digit", month: "2-digit" }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
  };

  const handleRemoveMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Helper calculation functions for Roni and Camila weekly stats
  const roniWeeklyKm = roniProfile.activities.reduce((sum, a) => sum + a.distance, 0);
  const camilaWeeklyKm = camilaProfile.activities.reduce((sum, a) => sum + a.distance, 0);
  
  const roniWeeklyWorkouts = roniProfile.activities.filter(a => a.type.includes("Treino") || a.type.includes("musculação")).length || 4;
  const camilaWeeklyWorkouts = camilaProfile.activities.filter(a => a.type.includes("Treino") || a.type.includes("musculação")).length || 3;

  // Joint targets progress
  const weeklyKmGoal = 40.0;
  const combinedKmProgress = Math.min(totalKmCombined, weeklyKmGoal);
  const combinedPercent = Math.min(Math.round((combinedKmProgress / weeklyKmGoal) * 100), 100);

  // Challenges manual progress editors (To make the prototipe interactive)
  const handleProgressChallenge = (id: string, amount: number) => {
    const updated = challenges.map((ch) => {
      if (ch.id === id) {
        const nextVal = Math.min(ch.currentValue + amount, ch.targetValue);
        return {
          ...ch,
          currentValue: parseFloat(nextVal.toFixed(1)),
          completed: nextVal >= ch.targetValue,
        };
      }
      return ch;
    });
    onUpdateChallenges(updated);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Nossa evolução
          </h2>
          <p className="text-[#9ca39d] text-sm mt-1">
            Espaço de desempenho compartilhado em casal, mantendo treinos e dados privados separados.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Roni Card */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1d221e] border border-white/5 flex items-center justify-center text-[#c7ff4a] font-black text-lg">
              R
            </div>
            <div>
              <h4 className="text-white font-bold text-base font-display">Roni</h4>
              <p className="text-[#9ca39d] text-xs">Perfil Masculino · Ativo</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-[#c7ff4a] font-mono">
                {roniWeeklyKm.toFixed(1).replace(".", ",")} km
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                caminhado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-white font-mono">
                {roniWeeklyWorkouts}
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                treinos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-white font-mono">
                {roniProfile.streakDays} dias
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                sequência
              </span>
            </div>
          </div>
        </div>

        {/* Camila Card */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1d221e] border border-white/5 flex items-center justify-center text-[#c7ff4a] font-black text-lg">
              C
            </div>
            <div>
              <h4 className="text-white font-bold text-base font-display">Camila</h4>
              <p className="text-[#9ca39d] text-xs">Perfil Feminino · Ativo</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-[#c7ff4a] font-mono">
                {camilaWeeklyKm.toFixed(1).replace(".", ",")} km
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                caminhado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-white font-mono">
                {camilaWeeklyWorkouts}
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                treinos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171b18] border border-white/5 text-center">
              <strong className="block text-lg font-bold text-white font-mono">
                {camilaProfile.streakDays} dias
              </strong>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#9ca39d] block mt-1">
                sequência
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Joint Weekly Kilometer Target (Big Hero Card Style) */}
      <div className="rounded-3xl border border-white/5 bg-gradient-to-tr from-[#1b211c] to-[#121513] p-6 relative overflow-hidden shadow-2xl min-h-[220px] flex flex-col justify-between">
        {/* Glowing concentric overlay */}
        <div className="absolute -right-10 -bottom-12 w-48 h-48 rounded-full border-[24px] border-[#c7ff4a]/5 pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <span className="text-[10px] uppercase font-black tracking-[0.16em] font-mono text-[#c7ff4a] block">
            Meta compartilhada da semana
          </span>
          <h3 className="text-3xl font-black text-white font-display leading-tight">
            {combinedKmProgress.toFixed(1).replace(".", ",")} de {weeklyKmGoal.toFixed(1).replace(".", ",")} km concluídos.
          </h3>
          <p className="text-[#9ca39d] text-sm max-w-xl">
            {combinedPercent >= 100
              ? "Parabéns! Vocês atingiram a meta semanal juntos. Sensacional trabalho de equipe! 🎉"
              : `Faltam apenas ${(weeklyKmGoal - combinedKmProgress).toFixed(1).replace(".", ",")} km para vocês completarem o alvo semanal em Alphaville.`}
          </p>
        </div>

        {/* Combined bar progress indicator */}
        <div className="pt-4 relative z-10 max-w-2xl">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono text-[#9ca39d]">
            <span>Progresso da meta</span>
            <strong className="text-[#c7ff4a]">{combinedPercent}%</strong>
          </div>
          <div className="h-2.5 w-full bg-[#282e29] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8ce600] to-[#c7ff4a] rounded-full"
              style={{ width: `${combinedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Interactive Challenges Checklist & Couples Message Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Couple Challenges */}
        <div className="rounded-2xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-4">
          <h4 className="text-white font-bold text-base font-display flex items-center gap-2">
            <Trophy size={16} className="text-[#c7ff4a]" /> Desafios em Casal (Nível Oura / Whoop)
          </h4>

          <div className="space-y-3 pt-1">
            {challenges.map((ch) => {
              const chPercent = Math.min(Math.round((ch.currentValue / ch.targetValue) * 100), 100);
              return (
                <div key={ch.id} className="p-4 border border-white/5 rounded-xl bg-[#171b18] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <b className="text-white text-xs md:text-sm block leading-tight">{ch.title}</b>
                      <small className="text-[#9ca39d] text-[10px] md:text-xs block mt-1">{ch.description}</small>
                    </div>

                    {/* Progress controller buttons to simulate milestones */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleProgressChallenge(ch.id, ch.unit === "kcal" ? 150 : 1)}
                        disabled={ch.completed}
                        className="px-2.5 py-1 text-[10px] bg-white/5 border border-white/10 hover:border-[#c7ff4a]/40 text-white hover:text-[#c7ff4a] rounded font-bold cursor-pointer transition-all disabled:opacity-20"
                      >
                        +{ch.unit === "kcal" ? "150" : "1"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-[#9ca39d] font-mono">
                      <span>
                        {ch.currentValue} de {ch.targetValue} {ch.unit}
                      </span>
                      <strong className={ch.completed ? "text-[#c7ff4a]" : "text-white"}>
                        {ch.completed ? "✓ Concluído" : `${chPercent}%`}
                      </strong>
                    </div>
                    <div className="h-1.5 w-full bg-[#121513] border border-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${ch.completed ? "bg-[#c7ff4a]" : "bg-gradient-to-r from-[#8ce600] to-[#c7ff4a]"}`}
                        style={{ width: `${chPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shared Message Board */}
        <div className="rounded-2xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-display flex items-center gap-2">
              <MessageSquare size={16} className="text-[#c7ff4a]" /> Quadro do Casal
            </h4>

            {/* Messages box */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {messages.map((m) => {
                const isRoni = m.sender === "Roni";
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 border border-white/5 rounded-2xl relative ${
                      isRoni ? "bg-[#182019]/60 border-[#c7ff4a]/10" : "bg-[#20181b]/50 border-pink-500/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isRoni ? "text-[#c7ff4a]" : "text-pink-400"}`}>
                        {m.sender}
                      </span>
                      <div className="flex items-center gap-2">
                        <time className="text-[9px] text-[#9ca39d] font-mono">{m.timestamp}</time>
                        <button
                          onClick={() => handleRemoveMessage(m.id)}
                          className="text-[#9ca39d] hover:text-[#ff6b6b] transition-all cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-xs leading-relaxed font-sans">{m.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form to leave message */}
          <form onSubmit={handleSendMessage} className="space-y-3 pt-3 border-t border-white/5 mt-4">
            <div className="flex items-center justify-between text-xs text-[#9ca39d]">
              <span>Escrever recado como:</span>
              <div className="flex gap-1.5 font-bold">
                <button
                  type="button"
                  onClick={() => setMessageSender("Roni")}
                  className={`px-2.5 py-0.5 rounded cursor-pointer ${
                    messageSender === "Roni" ? "bg-[#c7ff4a] text-[#0b0d0c]" : "bg-[#171b18]"
                  }`}
                >
                  Roni
                </button>
                <button
                  type="button"
                  onClick={() => setMessageSender("Camila")}
                  className={`px-2.5 py-0.5 rounded cursor-pointer ${
                    messageSender === "Camila" ? "bg-pink-500 text-white" : "bg-[#171b18]"
                  }`}
                >
                  Camila
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={`Deixe um recado motivador para seu amor...`}
                className="flex-1 bg-[#171b18] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#9ca39d] focus:outline-none focus:border-[#c7ff4a]/50"
              />
              <button
                type="submit"
                className="p-3 bg-[#c7ff4a] hover:bg-[#b6f033] text-[#0b0d0c] rounded-xl flex items-center justify-center cursor-pointer hover:shadow-[0_4px_10px_rgba(199,255,74,0.2)] transition-all"
              >
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
