import React, { useState } from "react";
import { UserProfile, RoutineItem } from "../types";
import { Plus, Trash2, Droplets, Check, Calendar, Clock, Smile, Sparkles } from "lucide-react";

interface RoutineViewProps {
  profile: UserProfile;
  onToggleRoutineItem: (itemId: string) => void;
  onAddRoutineItem: (newItem: Omit<RoutineItem, "id">) => void;
  onRemoveRoutineItem: (itemId: string) => void;
}

export default function RoutineView({
  profile,
  onToggleRoutineItem,
  onAddRoutineItem,
  onRemoveRoutineItem,
}: RoutineViewProps) {
  const daysOfWeek = [
    { key: "Seg", name: "Segunda-feira" },
    { key: "Ter", name: "Terça-feira" },
    { key: "Qua", name: "Quarta-feira" },
    { key: "Qui", name: "Quinta-feira" },
    { key: "Sex", name: "Sexta-feira" },
    { key: "Sáb", name: "Sábado" },
    { key: "Dom", name: "Domingo" },
  ];

  const [selectedDay, setSelectedDay] = useState<string>("Seg");

  // Hydration states (persisted locally within the widget)
  const [waterDrunk, setWaterDrunk] = useState<number>(1000); // starts with 1000ml (1L)
  const waterTarget = profile.gender === "male" ? 3500 : 2500; // 3.5L for male, 2.5L for female

  // Custom task form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [taskTime, setTaskTime] = useState<string>("18:30");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");
  const [taskCategory, setTaskCategory] = useState<"workout" | "cardio" | "health" | "other">("workout");

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddRoutineItem({
      time: taskTime,
      title: taskTitle,
      description: taskDesc,
      completed: false,
      category: taskCategory,
    });

    // Reset
    setTaskTitle("");
    setTaskDesc("");
    setShowAddForm(false);
  };

  const addWater = (amount: number) => {
    setWaterDrunk((prev) => Math.min(prev + amount, 5000));
  };

  const resetWater = () => {
    setWaterDrunk(0);
  };

  const waterPercent = Math.min(Math.round((waterDrunk / waterTarget) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Minha rotina
          </h2>
          <p className="text-[#9ca39d] text-sm mt-1">
            Cronograma semanal completo com acompanhamento de treinos, descanso e hábitos saudáveis.
          </p>
        </div>
      </div>

      {/* Interactive Weekly Planner */}
      <div className="space-y-4">
        {/* Days Row selector */}
        <div className="flex gap-2 justify-between overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
          {daysOfWeek.map((day) => {
            const isSelected = day.key === selectedDay;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`flex-1 py-3 px-3 rounded-2xl flex flex-col items-center justify-center min-w-[55px] cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-[#c7ff4a] text-[#0b0d0c] border-transparent font-bold shadow-[0_4px_15px_rgba(199,255,74,0.15)]"
                    : "bg-[#121513] text-[#9ca39d] border-white/5 hover:bg-[#171b18] hover:text-white"
                }`}
              >
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-85">
                  {day.key}
                </span>
                <span className="text-xs mt-1">Ativo</span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Agenda Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-white text-base font-bold font-display flex items-center gap-2">
            <Calendar size={16} className="text-[#c7ff4a]" /> Agenda de{" "}
            {daysOfWeek.find((d) => d.key === selectedDay)?.name}
          </h3>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-lg border border-white/5 bg-[#171b18] hover:border-[#c7ff4a]/30 text-[#c7ff4a] hover:text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
          >
            {showAddForm ? "Cancelar" : "＋ Adicionar Tarefa"}
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddNewItem}
            className="p-5 border border-white/5 bg-[#121513] rounded-2xl shadow-xl space-y-4 animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#9ca39d] block">Horário</label>
                <input
                  type="time"
                  required
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase font-mono text-[#9ca39d] block">Título do Compromisso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Treino de Pernas e Glúteos"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase font-mono text-[#9ca39d] block">Instruções / Observações</label>
                <input
                  type="text"
                  placeholder="Ex: Academia Alphaville · Foco em carga e isometria"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#9ca39d] block">Categoria</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#171b18] border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="workout">Musculação / Treino</option>
                  <option value="cardio">Aeróbico / Cardio</option>
                  <option value="health">Saúde / Check-in</option>
                  <option value="other">Outros Hábitos</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c7ff4a] hover:bg-[#b6f033] text-[#0b0d0c] text-xs font-black cursor-pointer transition-all"
            >
              Confirmar e Adicionar
            </button>
          </form>
        )}

        {/* Tasks List */}
        <div className="rounded-2xl border border-white/5 bg-[#121513] p-5 shadow-lg space-y-3">
          {profile.routine.length === 0 ? (
            <p className="text-[#9ca39d] text-sm text-center py-6">Nenhum compromisso agendado para este dia.</p>
          ) : (
            <div className="divide-y divide-white/5 space-y-1">
              {profile.routine.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <time className="text-[#c7ff4a] font-mono font-bold text-sm w-12 shrink-0">
                      {item.time}
                    </time>
                    <div>
                      <b
                        className={`text-white text-sm md:text-base leading-snug block ${
                          item.completed ? "line-through opacity-50" : ""
                        }`}
                      >
                        {item.title}
                      </b>
                      <small className="text-[#9ca39d] text-xs block mt-0.5">{item.description}</small>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleRoutineItem(item.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                        item.completed
                          ? "bg-[#c7ff4a]/25 border-[#c7ff4a]/40 text-[#c7ff4a]"
                          : "bg-[#171b18] hover:bg-[#202520] border-white/5 text-[#9ca39d]"
                      }`}
                    >
                      <Check size={15} className={item.completed ? "stroke-[3px]" : ""} />
                    </button>

                    <button
                      onClick={() => onRemoveRoutineItem(item.id)}
                      className="p-1.5 text-[#9ca39d] hover:text-[#ff6b6b] transition-all cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hydration Widget & Quick Health Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-3">
        {/* Water Hydration */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl flex flex-col justify-between lg:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" /> Registro de Hidratação
              </h4>
              <button
                onClick={resetWater}
                className="text-[10px] text-[#9ca39d] hover:text-[#ff6b6b] font-mono cursor-pointer"
              >
                Resetar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Progress Text */}
              <div className="space-y-1.5">
                <span className="text-4xl font-black text-white font-mono leading-none">
                  {(waterDrunk / 1000).toFixed(1)}L
                </span>
                <span className="text-[#9ca39d] text-xs block font-medium">
                  Alcançado de <b className="text-white">{(waterTarget / 1000).toFixed(1)}L</b> de meta diária
                </span>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="flex justify-between items-center text-[10px] text-[#9ca39d] mb-1 font-mono">
                    <span>Meta diária</span>
                    <span>{waterPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#171b18] border border-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${waterPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water buttons container */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addWater(250)}
                  className="py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span className="text-base">💧</span> +250 ml
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="py-3 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span className="text-base">🥛</span> +500 ml
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Checklist */}
        <div className="rounded-3xl border border-white/5 bg-[#121513] p-6 shadow-xl space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display">Sabor da Rotina</h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#171b18] border border-white/5 rounded-xl text-[#9ca39d] leading-relaxed">
              🔑 <b>Consistência Diária:</b> Fazer check-in corporal todos os dias às 7:00 da manhã ajuda a IA do CA.RO LIFE a calibrar com segurança as intensidades e volumes das cargas recomendadas!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
