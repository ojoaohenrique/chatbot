import dotenv from "dotenv";

// Carrega o .env
dotenv.config();

console.log("╔════════════════════════════════════════╗");
console.log("║   🔍 Diagnóstico do arquivo .env      ║");
console.log("╚════════════════════════════════════════╝\n");

// Verifica OPENAI_API_KEY
if (!process.env.OPENAI_API_KEY) {
  console.log("❌ OPENAI_API_KEY: NÃO ENCONTRADA");
  console.log("   → Adicione no .env: OPENAI_API_KEY=sk-proj-...\n");
} else {
  const key = process.env.OPENAI_API_KEY;
  const maskedKey = key.substring(0, 10) + "..." + key.substring(key.length - 4);
  console.log("✅ OPENAI_API_KEY: ENCONTRADA");
  console.log(`   → Valor: ${maskedKey}`);
  
  if (!key.startsWith("sk-")) {
    console.log("   ⚠️  AVISO: A chave não começa com 'sk-'");
  }
  
  if (key.includes(" ")) {
    console.log("   ❌ ERRO: A chave contém espaços!");
  }
  
  if (key === "sua-chave-openai-aqui") {
    console.log("   ❌ ERRO: Você precisa substituir pela chave real!");
  }
  console.log("");
}

// Verifica OPENAI_MODEL
console.log(`${process.env.OPENAI_MODEL ? "✅" : "⚠️ "} OPENAI_MODEL: ${process.env.OPENAI_MODEL || "não definido (usará gpt-4o-mini)"}`);

// Verifica PORT
console.log(`${process.env.PORT ? "✅" : "⚠️ "} PORT: ${process.env.PORT || "não definido (usará 3000)"}`);

// Verifica NODE_ENV
console.log(`${process.env.NODE_ENV ? "✅" : "⚠️ "} NODE_ENV: ${process.env.NODE_ENV || "não definido (usará development)"}`);

console.log("\n════════════════════════════════════════");
console.log("📋 Resumo:");

if (!process.env.OPENAI_API_KEY) {
  console.log("❌ Configure a OPENAI_API_KEY no arquivo .env");
  console.log("   Obtenha sua chave em: https://platform.openai.com/api-keys");
} else if (process.env.OPENAI_API_KEY === "sua-chave-openai-aqui") {
  console.log("❌ Substitua 'sua-chave-openai-aqui' pela chave real");
} else {
  console.log("✅ Configuração parece OK! Tente iniciar o servidor.");
}
console.log("════════════════════════════════════════\n");
