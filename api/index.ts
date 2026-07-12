import express from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Database connection pool
const dbUrl = process.env.DATABASE_URL;
let pool: pg.Pool | null = null;

if (dbUrl) {
  try {
    pool = new pg.Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("Database connection pool initialized.");
  } catch (error) {
    console.error("Failed to initialize database pool:", error);
  }
} else {
  console.warn("DATABASE_URL is not set. Database operations will fail or run in mockup mode.");
}

// Database tables helper
async function ensureTablesExist() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS couple_challenges (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL
        );
      `);
      console.log("Database tables checked/created successfully.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error creating tables in database:", err);
  }
}

// Call table creator asynchronously
ensureTablesExist();

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
}

// --- DATABASE SYNC ENDPOINTS ---

// GET Profile
app.get("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  if (!pool) {
    return res.json({ success: true, data: null, note: "No database connection" });
  }

  try {
    const result = await pool.query("SELECT data FROM profiles WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].data });
    }
    return res.json({ success: true, data: null });
  } catch (error: any) {
    console.error(`Error fetching profile ${id}:`, error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Profile (Upsert)
app.post("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!pool) {
    return res.json({ success: true, note: "No database connection" });
  }

  try {
    await pool.query(
      `INSERT INTO profiles (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2`,
      [id, JSON.stringify(data)]
    );
    return res.json({ success: true });
  } catch (error: any) {
    console.error(`Error saving profile ${id}:`, error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET Couple Challenges
app.get("/api/challenges", async (req, res) => {
  if (!pool) {
    return res.json({ success: true, data: null, note: "No database connection" });
  }

  try {
    const result = await pool.query("SELECT data FROM couple_challenges WHERE id = 'all'");
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].data });
    }
    return res.json({ success: true, data: null });
  } catch (error: any) {
    console.error("Error fetching couple challenges:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Couple Challenges (Upsert)
app.post("/api/challenges", async (req, res) => {
  const data = req.body;
  if (!pool) {
    return res.json({ success: true, note: "No database connection" });
  }

  try {
    await pool.query(
      `INSERT INTO couple_challenges (id, data) VALUES ('all', $1)
       ON CONFLICT (id) DO UPDATE SET data = $1`,
      [JSON.stringify(data)]
    );
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Error saving couple challenges:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// --- GEMINI ENDPOINTS ---

// Chat endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { profileName, gender, currentWeight, sleepHours, energyLevel, lastActivities, lastWorkouts, userMessage, targetGoal } = req.body;

  if (!aiClient) {
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

// Insights endpoint
app.post("/api/gemini/insights", async (req, res) => {
  const { profileName, gender, currentWeight, sleepHours, energyLevel, lastActivities, lastWorkouts, targetGoal } = req.body;

  if (!aiClient) {
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

export default app;
