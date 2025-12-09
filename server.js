import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Configuração de variáveis de ambiente
dotenv.config();

// Configuração de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validação de variáveis de ambiente
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERRO: OPENAI_API_KEY não configurada no arquivo .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do cliente OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitado para permitir inline scripts
}));

// Configuração CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting para prevenir abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: { error: "Muitas requisições. Tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rota principal - serve o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rota de chat com IA
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validação de entrada
    if (!message || typeof message !== "string") {
      return res.status(400).json({ 
        error: "Mensagem inválida. Por favor, envie uma mensagem válida." 
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        error: "Mensagem vazia. Por favor, digite algo." 
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({ 
        error: "Mensagem muito longa. Limite de 4000 caracteres." 
      });
    }

    // Construir histórico de mensagens
    const messages = [
      { 
        role: "system", 
        content: "Você é um assistente inteligente, prestativo e amigável. Responda de forma clara, concisa e profissional. Use formatação markdown quando apropriado." 
      },
      ...conversationHistory.slice(-10), // Limita a 10 últimas mensagens
      { role: "user", content: message.trim() }
    ];

    // Chamada à API da OpenAI
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const reply = completion.choices[0].message.content;

    // Resposta bem-sucedida
    res.json({ 
      reply,
      model: completion.model,
      usage: {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens,
      }
    });

  } catch (err) {
    console.error("❌ Erro na rota /api/chat:", err);

    // Tratamento de erros específicos
    if (err.code === "insufficient_quota") {
      return res.status(429).json({ 
        error: "Limite de uso da API atingido. Tente novamente mais tarde." 
      });
    }

    if (err.code === "invalid_api_key") {
      return res.status(500).json({ 
        error: "Erro de configuração do servidor. Contate o administrador." 
      });
    }

    if (err.status === 429) {
      return res.status(429).json({ 
        error: "Muitas requisições à IA. Aguarde alguns segundos." 
      });
    }

    // Erro genérico
    res.status(500).json({ 
      error: "Erro ao processar sua mensagem. Tente novamente." 
    });
  }
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error("❌ Erro não tratado:", err);
  res.status(500).json({ 
    error: "Erro interno do servidor" 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   🚀 Servidor Chat IA Iniciado!       ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`🤖 Modelo: ${process.env.OPENAI_MODEL || "gpt-4o-mini"}`);
  console.log("════════════════════════════════════════");
});

// Tratamento de sinais de encerramento
process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM recebido. Encerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT recebido. Encerrando servidor...");
  process.exit(0);
});
