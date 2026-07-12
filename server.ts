import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: any = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini API Client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not set or contains the default placeholder. AI suggestions will run on smart static fallbacks.");
}

// Endpoint to chat with the profile assistant (Roni or Camila)
app.post("/api/gemini/chat", async (req, res) => {
  const { profileName, gender, currentWeight, sleepHours, energyLevel, lastActivities, lastWorkouts, userMessage, targetGoal } = req.body;

  if (!aiClient) {
    // Elegant fallback response when API key is missing
    return res.json({
      success: true,
      text: `Olá, ${profileName}! (Modo Demonstração Ativo - Chave API não configurada). Como seu assistente IA, analisei seus dados de hoje: Sono (${sleepHours}h), Energia (${energyLevel}/10). Recomendo focar na constância e hidratação. Complete seu treino planejado com atenção à postura e cadência. Quando configurar sua chave API Gemini no painel lateral de Segredos, poderei te fornecer análises profundas e em tempo real para seu objetivo de ${targetGoal || "condicionamento"}!`
    });
  }

  try {
    const systemPrompt = `Você é o assistente IA ultra-personalizado do CA.RO LIFE para o perfil de ${profileName} (${gender}).
Seu objetivo é ajudá-lo(a) a atingir as metas de: ${targetGoal}.
Você analisa sono, humor, energia, treinos de musculação e caminhadas/corridas feitas em tempo real.

DADOS DE HOJE:
- Peso Atual: ${currentWeight || "Não informado"}
- Sono: ${sleepHours || "Não informado"} horas
- Nível de Energia/Disposição: ${energyLevel || "Não informado"}/10
- Atividades de Corrida/Caminhada Recentes: ${JSON.stringify(lastActivities || [])}
- Treinos Recentes: ${JSON.stringify(lastWorkouts || [])}

DIRETRIZES:
1. Responda de forma motivadora, direta, técnica e empática.
2. Forneça conselhos acionáveis de progressão de carga, ritmo de caminhada e recuperação muscular.
3. Se o usuário relatar dores severas ou persistentes, recomende avaliação médica. Nunca faça diagnósticos de saúde.
4. Mantenha as respostas elegantes e fáceis de ler no painel de conversa do aplicativo. Responda em Português do Brasil.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userMessage || "Gere um resumo diário com dicas personalizadas com base no meu estado de hoje.",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "Sem resposta gerada."
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro de comunicação com o servidor Gemini."
    });
  }
});

// Endpoint to get automated AI Insights
app.post("/api/gemini/insights", async (req, res) => {
  const { profileName, gender, currentWeight, sleepHours, energyLevel, lastActivities, lastWorkouts, targetGoal } = req.body;

  if (!aiClient) {
    // Dynamic fallback mock insights
    const fallbackText = profileName === "Roni"
      ? `**Análise IA Semanal — Roni**\n\n• **Progresso de Cardio:** Seu ritmo nas caminhadas em Alphaville melhorou 7% nas últimas sessões. Excelente constância!\n• **Musculação:** Se você conseguiu completar todas as repetições de supino com 22 kg, experimente subir para 24 kg na primeira série do próximo Treino A.\n• **Dica de Recuperação:** Com ${sleepHours || 7} horas de sono, seu corpo está se recuperando de forma moderada. Tente deitar-se 30 minutos mais cedo para apoiar a regeneração muscular e nível de energia.`
      : `**Análise IA Semanal — Camila**\n\n• **Progresso de Cardio:** Constância fantástica! Suas caminhadas em Alphaville estão em ritmo excelente e estável.\n• **Membros Inferiores:** Mantenha a carga de 45 kg na elevação pélvica, mas tente focar na contração isométrica de 2 segundos no pico do movimento.\n• **Equilíbrio diário:** Ótimo aproveitamento de sono de ${sleepHours || 8} horas. Seu nível de disposição está propício para um treino focado em pernas e glúteos de alta intensidade hoje.`;

    return res.json({ success: true, text: fallbackText });
  }

  try {
    const prompt = `Analise as estatísticas e gere um breve resumo semanal com 3 tópicos em formato Markdown contendo dicas de progresso e recuperação de saúde.
Nome: ${profileName}
Sexo/Perfil: ${gender}
Peso Atual: ${currentWeight}
Sono médio recente: ${sleepHours}h
Disposição: ${energyLevel}/10
Metas: ${targetGoal}
Atividades recentes: ${JSON.stringify(lastActivities || [])}
Treinos recentes: ${JSON.stringify(lastWorkouts || [])}

Seja objetivo e direto.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é o especialista em performance do CA.RO LIFE. Forneça análises em markdown concisas, sem rodeios e inspiradoras para o atleta.",
        temperature: 0.6,
      }
    });

    res.json({
      success: true,
      text: response.text || "Nenhum insight gerado."
    });
  } catch (error: any) {
    console.error("Gemini Insights Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Vite integration middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CA.RO LIFE] Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer();
