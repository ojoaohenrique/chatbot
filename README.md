# 🤖 Chat IA - Assistente Inteligente

Chat profissional com Inteligência Artificial usando OpenAI GPT. Interface moderna, segura e responsiva.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.19-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-API-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---
Sistema: Chat Setores Laguna

Órgão: Prefeitura Municipal de Laguna

Desenvolvedor: João Henrique Fanfa

Licença: MIT
## ✨ Características

### 🎨 Interface
- ✅ **Design minimalista** inspirado em shadcn/ui
- ✅ **Sistema de cores neutro** com suporte a tema claro/escuro automático
- ✅ **Layout centralizado** (max-width 35rem) para melhor legibilidade
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Animações suaves e transições fluidas
- ✅ Indicador de status flutuante
- ✅ Notificações toast elegantes
- ✅ Contador de caracteres
- ✅ Auto-resize do textarea
- ✅ Tipografia otimizada e espaçamentos consistentes

### 🔒 Segurança
- ✅ API Key protegida no backend
- ✅ Variáveis de ambiente (.env)
- ✅ Rate limiting (proteção contra abuso)
- ✅ Helmet.js (headers de segurança)
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Tratamento de erros robusto

### ⚡ Performance
- ✅ Histórico de conversas salvo localmente
- ✅ Health check automático
- ✅ Respostas rápidas
- ✅ Otimização de requisições
- ✅ Compressão de dados

### 🛠️ Funcionalidades
- ✅ Conversas contextuais (mantém histórico)
- ✅ **Suporte a Markdown** (negrito, itálico, código, links)
- ✅ **Botão de copiar mensagens** com feedback visual
- ✅ **Exportar conversa** em formato Markdown (.md)
- ✅ Limpar conversa com confirmação
- ✅ Scroll automático inteligente
- ✅ Indicador de digitação animado
- ✅ Mensagens de erro amigáveis
- ✅ Suporte a Enter para enviar
- ✅ Limite de caracteres (4000)

---

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Chave da API OpenAI** ([obter aqui](https://platform.openai.com/api-keys))

---

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
cd setoreslg00
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da OpenAI:

```env
OPENAI_API_KEY=sua-chave-aqui
```

### 4. Inicie o servidor

```bash
npm start
```

O servidor estará rodando em: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
setoreslg00/
├── public/                 # Arquivos públicos (frontend)
│   ├── css/
│   │   └── style.css      # Estilos CSS
│   ├── js/
│   │   └── app.js         # JavaScript do frontend
│   └── index.html         # Página principal
├── server.js              # Servidor Node.js + Express
├── package.json           # Dependências e scripts
├── .env                   # Variáveis de ambiente (NÃO COMMITAR)
├── .env.example           # Exemplo de variáveis
├── .gitignore             # Arquivos ignorados pelo Git
└── README.md              # Documentação
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `OPENAI_API_KEY` | Chave da API OpenAI | - | ✅ Sim |
| `OPENAI_MODEL` | Modelo da IA | `gpt-4o-mini` | ❌ Não |
| `PORT` | Porta do servidor | `3000` | ❌ Não |
| `NODE_ENV` | Ambiente | `development` | ❌ Não |
| `FRONTEND_URL` | URL do frontend (produção) | - | ❌ Não |

### Modelos Disponíveis

- `gpt-4o-mini` (recomendado - rápido e econômico)
- `gpt-4o` (mais avançado)
- `gpt-4-turbo` (alta performance)
- `gpt-3.5-turbo` (econômico)

---

## 🔧 Scripts Disponíveis

```bash
# Iniciar servidor
npm start

# Iniciar em modo desenvolvimento (auto-reload)
npm run dev

# Executar testes
npm test
```

---

## 🌐 API Endpoints

### `POST /api/chat`
Envia uma mensagem para a IA

**Request:**
```json
{
  "message": "Olá, como você está?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "reply": "Olá! Estou bem, obrigado por perguntar...",
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 25,
    "total_tokens": 40
  }
}
```

### `GET /api/health`
Verifica o status do servidor

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

---

## 🎯 Uso

1. Abra o navegador em `http://localhost:3000`
2. Digite sua mensagem no campo de texto
3. Pressione **Enter** ou clique em **Enviar**
4. Aguarde a resposta da IA
5. Continue a conversa naturalmente

### Atalhos de Teclado

- **Enter**: Enviar mensagem
- **Shift + Enter**: Nova linha no texto

### Botões de Ação Rápida

Clique nos botões sugeridos para iniciar conversas rapidamente:
- 💡 O que é IA?
- 🎯 Curiosidade
- 🔧 Resolver problema

### Recursos Avançados

#### 📝 Suporte a Markdown
As respostas da IA suportam formatação Markdown:
- **Negrito**: `**texto**`
- *Itálico*: `*texto*`
- `Código inline`: \`código\`
- Blocos de código: \`\`\`código\`\`\`
- Links: `[texto](url)`

#### 📋 Copiar Mensagens
- Passe o mouse sobre qualquer mensagem
- Clique no ícone de copiar que aparece
- A mensagem será copiada para a área de transferência

#### 💾 Exportar Conversa
- Clique no botão de download no header
- A conversa será exportada como arquivo `.md`
- Formato compatível com editores Markdown

---

## 🔐 Segurança

### Boas Práticas Implementadas

1. **API Key protegida**: Nunca exposta no frontend
2. **Rate Limiting**: Máximo 100 requisições por 15 minutos
3. **Validação de entrada**: Limite de 4000 caracteres
4. **CORS configurado**: Apenas origens permitidas
5. **Helmet.js**: Headers de segurança HTTP
6. **Tratamento de erros**: Mensagens genéricas para o usuário

### ⚠️ IMPORTANTE

- **NUNCA** commite o arquivo `.env` no Git
- **NUNCA** exponha sua API Key publicamente
- **SEMPRE** use HTTPS em produção
- **SEMPRE** configure CORS adequadamente

---

## 🐛 Solução de Problemas

### Erro: "OPENAI_API_KEY não configurada"

**Solução**: Configure a chave no arquivo `.env`

```env
OPENAI_API_KEY=sk-...
```

### Erro: "Servidor offline"

**Solução**: Verifique se o servidor está rodando:

```bash
npm start
```

### Erro: "Muitas requisições"

**Solução**: Aguarde alguns minutos. O rate limit é de 100 requisições por 15 minutos.

### Erro: "Limite de uso da API atingido"

**Solução**: Verifique seu saldo na [plataforma OpenAI](https://platform.openai.com/usage)

---

## 📦 Dependências

### Backend
- **express**: Framework web
- **openai**: Cliente oficial da OpenAI
- **cors**: Middleware CORS
- **dotenv**: Variáveis de ambiente
- **helmet**: Segurança HTTP
- **express-rate-limit**: Rate limiting

### Frontend
- **Vanilla JavaScript**: Sem frameworks
- **CSS3**: Variáveis CSS e animações
- **HTML5**: Semântico e acessível

---

## 🚀 Deploy em Produção

### 1. Configure as variáveis de ambiente

```env
NODE_ENV=production
OPENAI_API_KEY=sua-chave
FRONTEND_URL=https://seudominio.com
PORT=3000
```

### 2. Instale apenas dependências de produção

```bash
npm install --production
```

### 3. Inicie o servidor

```bash
npm start
```

### Recomendações

- Use **PM2** para gerenciar o processo
- Configure **HTTPS** com certificado SSL
- Use **Nginx** como proxy reverso
- Configure **firewall** adequadamente
- Monitore logs e erros

---

## 📝 Changelog

### Versão 3.0.0 (Atual)

#### 🎨 Redesign Completo
- **Layout minimalista** inspirado em shadcn/ui e Next.js
- **Sistema de design neutro** com variáveis CSS HSL
- **Tema claro/escuro automático** via `prefers-color-scheme`
- **Interface centralizada** (35rem) para melhor UX
- **Tipografia otimizada** com espaçamentos consistentes
- **Animações suaves** e transições fluidas
- **Componentes simplificados** e código mais limpo

### Versão 2.1.0

#### ✨ Novidades
- 🎨 **Design modernizado** com gradientes roxo/azul
- 📝 **Suporte a Markdown** nas respostas da IA
- 📋 **Botão de copiar** em cada mensagem
- 💾 **Exportar conversa** em formato Markdown
- ✨ **Efeitos glassmorphism** e sombras com glow
- 🎭 **Animações aprimoradas** com cubic-bezier
- 🔘 **Botões com hover effects** 3D
- 📱 **Responsividade melhorada**

### Versão 2.0.0

#### ✨ Novidades
- Interface completamente redesenhada
- Sistema de notificações toast
- Histórico de conversas salvo localmente
- Indicador de status do servidor
- Botões de ação rápida
- Auto-resize do textarea
- Contador de caracteres
- Scroll automático inteligente

#### 🔒 Segurança
- API Key movida para o backend
- Rate limiting implementado
- Helmet.js adicionado
- Validações robustas

#### ⚡ Performance
- Health check automático
- Otimização de requisições
- Melhor tratamento de erros

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para demonstrar boas práticas de desenvolvimento web.

---

## 🔗 Links Úteis

- [Documentação OpenAI](https://platform.openai.com/docs)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 💡 Dicas

### Melhorando as Respostas

Edite o prompt do sistema em `server.js`:

```javascript
{
  role: "system",
  content: "Você é um assistente especializado em [sua área]..."
}
```

### Personalizando o Design

O projeto usa um sistema de design baseado em variáveis CSS HSL, inspirado em shadcn/ui:

```css
:root {
  /* Cores principais */
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(0, 0%, 3.9%);
  --primary: hsl(221, 83%, 53%);
  --muted: hsl(0, 0%, 96.1%);
  /* ... */
}
```

#### Tema Claro/Escuro

O tema escuro é ativado automaticamente via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: hsl(0, 0%, 3.9%);
    --foreground: hsl(0, 0%, 98%);
    /* ... */
  }
}
```

#### Estrutura do Layout

- **Container centralizado**: `max-width: 35rem` para melhor legibilidade
- **Mensagens**: Máximo 80% da largura, alinhadas à esquerda (bot) ou direita (user)
- **Input fixo**: Na parte inferior com auto-resize
- **Status badge**: Flutuante no canto superior direito

### Adicionando Funcionalidades

O código está bem documentado e modular. Explore os arquivos:
- `server.js`: Backend e rotas
- `public/js/app.js`: Lógica do frontend
- `public/css/style.css`: Estilos

---

## ❓ FAQ

**P: Quanto custa usar a API da OpenAI?**  
R: Depende do modelo. O `gpt-4o-mini` é o mais econômico. Veja os [preços aqui](https://openai.com/pricing).

**P: Posso usar outros modelos de IA?**  
R: Sim! Basta adaptar o código para usar outras APIs (Anthropic, Google, etc).

**P: O histórico é salvo no servidor?**  
R: Não, apenas no navegador (localStorage). Para salvar no servidor, implemente um banco de dados.

**P: Posso adicionar autenticação?**  
R: Sim! Recomendamos usar JWT ou OAuth2.

---

## 🎉 Pronto!

Seu chat com IA está configurado e rodando! 🚀

Se tiver dúvidas ou problemas, abra uma issue no repositório.

**Boas conversas com a IA! 🤖💬**
