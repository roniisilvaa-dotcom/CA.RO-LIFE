import { useState, useRef, useEffect } from "react";
import { UserProfile } from "../types";
import { Send, Sparkles, MessageSquare, Bot, User } from "lucide-react";

interface AIAssistantProps {
  profile: UserProfile;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AIAssistant({ profile }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Olá, ${profile.name}! Sou o seu assistente de performance inteligente do **CA.RO LIFE**.\n\nAnalisei seu sono de hoje (${profile.checkins[0]?.sleepHours || 8}h), sua disposição (${profile.checkins[0]?.energyLevel || 8}/10) e seu treino atual de **${profile.workoutPlans[0]?.name || "musculação"}**.\n\nComo posso ajudar você a otimizar sua rotina hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileName: profile.name,
          gender: profile.gender,
          currentWeight: profile.currentWeight,
          sleepHours: profile.checkins[0]?.sleepHours || 8,
          energyLevel: profile.checkins[0]?.energyLevel || 8,
          lastActivities: profile.activities.slice(0, 3).map((a) => ({
            type: a.type,
            distance: a.distance,
            duration: a.duration,
            pace: a.avgPace,
          })),
          lastWorkouts: profile.workoutPlans.slice(0, 2).map((w) => ({
            name: w.name,
            exercises: w.exercises.map((e) => e.name),
          })),
          targetGoal: profile.targetGoal,
          userMessage: textToSend,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error(data.error || "Erro ao gerar resposta");
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Desculpe, tive um contratempo de conexão com a nave-mãe. Por favor, verifique se sua chave API está ativa nos segredos do projeto e tente novamente.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = profile.gender === "male" 
    ? [
        "Como aumentar as cargas no supino com segurança?",
        "Qual o melhor ritmo de caminhada para queima de gordura?",
        "Analise meu sono e recuperação de hoje.",
        "Monte uma sugestão de alimentação pré-treino de força."
      ]
    : [
        "Como focar mais na ativação de glúteos na elevação pélvica?",
        "Qual a postura correta para o Stiff com halteres?",
        "Estou me sentindo um pouco cansada hoje, devo treinar?",
        "Dicas para manter o ritmo constante em Alphaville."
      ];

  const formatText = (text: string) => {
    // Basic formatting helper for simple markdown styling
    return text.split("\n").map((line, i) => {
      let formatted = line;
      // Bold **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#c7ff4a] font-semibold">$1</strong>');
      // Bullet points
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <li key={i} className="ml-4 list-disc text-sm text-[#f5f6f4] mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, "") }} />
        );
      }
      return (
        <p key={i} className="text-sm text-[#f5f6f4] leading-relaxed mb-2.5" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="flex flex-col h-[520px] bg-gradient-to-b from-[#181d19] to-[#111411] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#121513] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c7ff4a] to-[#8ce600] flex items-center justify-center text-[#0b0d0c] shadow-[0_0_15px_rgba(199,255,74,0.2)]">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wide text-white uppercase font-sans">Treinador IA CA.RO</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c7ff4a] animate-pulse"></span>
              <span className="text-[10px] text-[#9ca39d] font-mono uppercase">Online e Sincronizado</span>
            </div>
          </div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#9ca39d] font-medium font-sans">
          Perfil: {profile.name}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-[#252b26] text-[#c7ff4a]"
                  : "bg-[#151916] text-[#9ca39d] border border-white/5"
              }`}
            >
              {msg.sender === "user" ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className="flex flex-col">
              <div
                className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#c7ff4a] text-[#0b0d0c] rounded-tr-none font-medium"
                    : "bg-[#121513] border border-white/5 rounded-tl-none text-[#f5f6f4]"
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                ) : (
                  <div>{formatText(msg.text)}</div>
                )}
              </div>
              <span
                className={`text-[9px] text-[#9ca39d] font-mono mt-1 ${
                  msg.sender === "user" ? "text-right mr-1" : "ml-1"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-[#151916] text-[#c7ff4a] border border-white/5 flex items-center justify-center shrink-0">
              <Bot size={15} className="animate-spin" />
            </div>
            <div className="flex flex-col">
              <div className="px-4 py-3 bg-[#121513] border border-white/5 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5 items-center justify-center py-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c7ff4a] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#c7ff4a] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#c7ff4a] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 pb-2 pt-1 bg-[#111411] overflow-x-auto flex gap-2 no-scrollbar border-t border-white/5">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="shrink-0 text-[11px] px-3 py-1.5 rounded-xl bg-[#171b18] border border-white/5 hover:border-[#c7ff4a]/40 hover:bg-[#182019] text-[#9ca39d] hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-4 bg-[#121513] border-t border-white/5 flex gap-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Pergunte ao seu treinador IA, ${profile.name}...`}
          disabled={loading}
          className="flex-1 bg-[#171b18] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#9ca39d] focus:outline-none focus:border-[#c7ff4a]/50 focus:ring-1 focus:ring-[#c7ff4a]/20 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="w-12 h-12 bg-[#c7ff4a] text-[#0b0d0c] rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-lg"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
