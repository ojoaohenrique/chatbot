# 🤖 Chat IA - Assistente Inteligente

Chat profissional com Inteligência Artificial usando OpenAI GPT. Interface moderna, segura e responsiva.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.19-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-API-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Características

### 🎨 Interface
- ✅ Design moderno e profissional
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Tema escuro otimizado
- ✅ Animações suaves
- ✅ Indicador de status em tempo real
- ✅ Notificações toast
- ✅ Contador de caracteres
- ✅ Auto-resize do textarea
- ✅ Botões de ação rápida

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
- ✅ Limpar conversa
- ✅ Scroll automático
- ✅ Indicador de digitação
- ✅ Mensagens de erro amigáveis
- ✅ Suporte a Enter para enviar
- ✅ Limite de caracteres

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

### Versão 2.0.0 (Atual)

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

Edite as variáveis CSS em `public/css/style.css`:

```css
:root {
  --accent-blue: #0969da;
  --accent-green: #238636;
  /* ... */
}
```

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
