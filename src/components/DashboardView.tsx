import { UserProfile } from "../types";
import { Sparkles, Calendar, Play, Trophy, TrendingUp } from "lucide-react";

interface DashboardViewProps {
  profile: UserProfile;
  activeView: string;
  setActiveView: (view: string) => void;
  onSwitchProfileClick: () => void;
  totalKmThisWeek: number;
  totalWorkoutsThisWeek: number;
  totalActiveTimeThisWeek: string;
}

export default function DashboardView({
  profile,
  setActiveView,
  onSwitchProfileClick,
  totalKmThisWeek,
  totalWorkoutsThisWeek,
  totalActiveTimeThisWeek,
}: DashboardViewProps) {
  // Determine text based on gender/profile
  const isFemale = profile.gender === "female";
  
  const greeting = isFemale ? "Boa tarde, Camila." : "Bom dia, Roni.";
  const subtitleText = isFemale
    ? "Hoje é dia de pernas, glúteos e caminhada leve."
    : "Hoje é dia de peito, tríceps e caminhada leve.";

  const heroTitleText = isFemale
    ? "Pernas, glúteos e 2,5 km de caminhada."
    : "Peito, tríceps e 3 km de caminhada.";

  const heroParaText = isFemale
    ? "Seu treino foi personalizado para definição, força e progressão segura de membros inferiores."
    : "Seu treino está planejado para 18h30. A IA ajustou o volume de cargas com base no seu desempenho da última semana.";

  const weekProgressPercent = isFemale ? 68 : 72;

  // Calculate consistency based on completed routine tasks
  const completedTasks = profile.routine.filter((r) => r.completed).length;
  const totalTasks = profile.routine.length || 1;
  const taskPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            {greeting}
          </h2>
          <p className="text-[#9ca39d] text-sm mt-1">{subtitleText}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchProfileClick}
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-[#151916] text-[#f5f6f4] text-xs font-semibold hover:border-[#c7ff4a]/20 hover:text-white transition-all cursor-pointer"
          >
            Trocar perfil
          </button>
          <button
            onClick={() => setActiveView("activity")}
            className="px-4 py-2.5 rounded-xl bg-[#c7ff4a] text-[#0b0d0c] text-xs font-black hover:bg-[#b6f033] hover:shadow-[0_4px_20px_rgba(199,255,74,0.2)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Play size={13} fill="currentColor" /> Iniciar atividade
          </button>
        </div>
      </div>

      {/* Hero Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Workout Hero Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-tr from-[#111411] via-[#1b211c] to-[#121513] border border-white/5 p-6 relative overflow-hidden flex flex-col justify-between min-h-[290px] shadow-2xl">
          {/* Decorative Ring Elements */}
          <div className="absolute -right-14 -bottom-16 w-60 h-60 rounded-full border-[32px] border-[#c7ff4a]/5 pointer-events-none z-0"></div>
          <div className="absolute right-10 top-10 w-24 h-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(199,255,74,0.1)_0%,transparent_70%)] pointer-events-none z-0"></div>

          <div className="relative z-10 space-y-4">
            <span className="text-[10px] tracking-[0.16em] uppercase font-black text-[#c7ff4a] block font-mono">
              Planejamento Diário
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display max-w-xl leading-none mt-2">
              {heroTitleText}
            </h3>
            <p className="text-[#9ca39d] text-sm leading-relaxed max-w-lg">
              {heroParaText}
            </p>
          </div>

          <div className="relative z-10 space-y-5 mt-6">
            <div className="flex gap-2.5">
              <button
                onClick={() => setActiveView("workout")}
                className="px-5 py-3 rounded-xl bg-[#c7ff4a] text-[#0b0d0c] text-xs font-black hover:bg-[#b6f033] hover:shadow-[0_4px_15px_rgba(199,255,74,0.2)] transition-all cursor-pointer"
              >
                Começar treino
              </button>
              <button
                onClick={() => setActiveView("routine")}
                className="px-5 py-3 rounded-xl border border-white/5 bg-[#151916] text-[#f5f6f4] text-xs font-semibold hover:border-white/10 hover:bg-[#1c221e] transition-all cursor-pointer"
              >
                Ver rotina
              </button>
            </div>

            {/* Weekly Target Bar */}
            <div className="max-w-md pt-2">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-[#9ca39d] font-medium">Meta semanal de adesão</span>
                <strong className="text-[#c7ff4a] font-bold font-mono">{weekProgressPercent}%</strong>
              </div>
              <div className="h-2 w-full bg-[#282e29] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8ce600] to-[#c7ff4a]"
                  style={{ width: `${weekProgressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Consistency Ring Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#181d19] to-[#101311] border border-white/5 p-6 flex flex-col justify-between shadow-2xl min-h-[290px]">
          <div>
            <span className="text-[10px] tracking-[0.16em] uppercase font-black text-[#c7ff4a] block font-mono">
              Consistência
            </span>
            {/* Interactive Ring */}
            <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
              {/* Outer Conic Circle */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: `conic-gradient(#c7ff4a 0% ${taskPercent}%, #2a2f2b ${taskPercent}% 100%)`,
                }}
              >
                {/* Inner Cutout */}
                <div className="w-[114px] h-[114px] rounded-full bg-[#151916] flex flex-col items-center justify-center text-center">
                  <strong className="text-3xl font-black tracking-tight text-white font-mono leading-none">
                    {taskPercent}%
                  </strong>
                  <span className="text-[10px] text-[#9ca39d] uppercase tracking-wider mt-1 font-mono">
                    da rotina
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView("routine")}
            className="w-full py-3 rounded-xl bg-[#c7ff4a] text-[#0b0d0c] text-xs font-black hover:bg-[#b6f033] hover:shadow-[0_4px_15px_rgba(199,255,74,0.15)] transition-all cursor-pointer"
          >
            Ver rotina completa
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-b from-[#181d19]/90 to-[#101311]/90 border border-white/5 p-5 shadow-lg relative overflow-hidden group">
          <span className="text-xs text-[#9ca39d] block font-medium">Cardio Realizado</span>
          <strong className="text-2xl md:text-3xl font-black text-white block mt-2 font-mono tracking-tight">
            {totalKmThisWeek.toFixed(1).replace(".", ",")} km
          </strong>
          <div className="text-xs text-[#c7ff4a] font-semibold flex items-center gap-1 mt-2.5 font-mono">
            <span>↑</span> 12% esta semana
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-[#181d19]/90 to-[#101311]/90 border border-white/5 p-5 shadow-lg relative overflow-hidden group">
          <span className="text-xs text-[#9ca39d] block font-medium">Fichas Concluídas</span>
          <strong className="text-2xl md:text-3xl font-black text-white block mt-2 font-mono tracking-tight">
            {totalWorkoutsThisWeek}
          </strong>
          <div className="text-xs text-[#9ca39d] font-medium flex items-center gap-1 mt-2.5 font-mono">
            Meta: 5 treinos
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-[#181d19]/90 to-[#101311]/90 border border-white/5 p-5 shadow-lg relative overflow-hidden group">
          <span className="text-xs text-[#9ca39d] block font-medium">Tempo Ativo</span>
          <strong className="text-2xl md:text-3xl font-black text-white block mt-2 font-mono tracking-tight">
            {totalActiveTimeThisWeek}
          </strong>
          <div className="text-xs text-[#c7ff4a] font-semibold flex items-center gap-1 mt-2.5 font-mono">
            +28 min ontem
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-[#181d19]/90 to-[#101311]/90 border border-white/5 p-5 shadow-lg relative overflow-hidden group">
          <span className="text-xs text-[#9ca39d] block font-medium">Streak Consecutivo</span>
          <strong className="text-2xl md:text-3xl font-black text-white block mt-2 font-mono tracking-tight">
            {profile.streakDays} dias
          </strong>
          <div className="text-xs text-[#c7ff4a] font-semibold flex items-center gap-1 mt-2.5 font-mono">
            ★ Novo recorde
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Activities & IA Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Upcoming Routine List */}
        <div className="rounded-2xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-white font-bold text-base font-display">Próximas atividades</h4>
            <button
              onClick={() => setActiveView("routine")}
              className="text-xs font-semibold text-[#c7ff4a] hover:underline cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="divide-y divide-white/5">
            <div className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#232923] flex items-center justify-center text-[#c7ff4a] text-sm">
                  ↗
                </div>
                <div>
                  <b className="block text-white text-sm leading-tight">Caminhada em Alphaville</b>
                  <small className="text-[#9ca39d] text-xs block mt-1">Hoje · {isFemale ? "2.5" : "3.0"} km · ritmo leve</small>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full border border-[#c7ff4a]/20 text-[#c7ff4a] font-mono">
                19:30
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#232923] flex items-center justify-center text-[#c7ff4a] text-sm">
                  ◫
                </div>
                <div>
                  <b className="block text-white text-sm leading-tight">
                    {isFemale ? "Pernas e glúteos" : "Peito e tríceps"}
                  </b>
                  <small className="text-[#9ca39d] text-xs block mt-1">
                    {isFemale ? "5 exercícios · 55 minutos" : "6 exercícios · 50 minutos"}
                  </small>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full border border-white/5 bg-[#171b18] text-[#9ca39d] font-mono">
                18:30
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#232923] flex items-center justify-center text-[#c7ff4a] text-sm">
                  ◷
                </div>
                <div>
                  <b className="block text-white text-sm leading-tight">Recuperação ativa</b>
                  <small className="text-[#9ca39d] text-xs block mt-1">Amanhã · mobilidade e alongamento leve</small>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full border border-white/5 bg-[#171b18] text-[#9ca39d] font-mono">
                07:30
              </span>
            </div>
          </div>
        </div>

        {/* AI Trainer Smart Insights */}
        <div className="rounded-2xl bg-[#121513] border border-white/5 p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-white font-bold text-base font-display flex items-center gap-2">
              <Sparkles size={16} className="text-[#c7ff4a] animate-pulse" /> Leitura da IA
            </h4>
            <button
              onClick={() => setActiveView("evolution")}
              className="text-xs font-semibold text-[#c7ff4a] hover:underline cursor-pointer"
            >
              Histórico
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex gap-3.5 p-3.5 border border-white/5 rounded-xl bg-[#141815]">
              <time className="text-[#c7ff4a] font-bold text-xs uppercase tracking-wider font-mono">Hoje</time>
              <div>
                <b className="block text-white text-xs mb-1">Ritmo melhorando</b>
                <p className="text-[#9ca39d] text-[11.5px] leading-relaxed">
                  Seu ritmo médio de caminhada melhorou 7% nas últimas três sessões no condomínio.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 border border-white/5 rounded-xl bg-[#141815]">
              <time className="text-[#c7ff4a] font-bold text-xs uppercase tracking-wider font-mono">Ontem</time>
              <div>
                <b className="block text-white text-xs mb-1">Boa recuperação metabólica</b>
                <p className="text-[#9ca39d] text-[11.5px] leading-relaxed">
                  Você manteve o volume exato planejado sem extrapolar o estresse articular. Excelente.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 border border-white/5 rounded-xl bg-[#141815]">
              <time className="text-[#c7ff4a] font-bold text-xs uppercase tracking-wider font-mono">Meta</time>
              <div>
                <b className="block text-white text-xs mb-1">Próximo ajuste de progressão</b>
                <p className="text-[#9ca39d] text-[11.5px] leading-relaxed" id="aiNote">
                  {isFemale
                    ? "Tente manter a carga da elevação pélvica de 45 kg, mas estenda a contração no pico por 2 segundos."
                    : "Recomendado aumentar 2 kg no supino se conseguir completar todas as séries mantendo a cadência de descida de 3 segundos."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
