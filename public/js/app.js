// ========================================
// CONFIGURAÇÕES
// ========================================

const CONFIG = {
    API_URL: "/api/chat",
    HEALTH_CHECK_URL: "/api/health",
    MAX_MESSAGE_LENGTH: 4000,
    TOAST_DURATION: 3000,
};

// ========================================
// ELEMENTOS DO DOM
// ========================================

const elements = {
    input: document.getElementById("userInput"),
    submitBtn: document.getElementById("submitBtn"),
    chatForm: document.getElementById("chatForm"),
    welcomeScreen: document.getElementById("welcomeScreen"),
    chatScreen: document.getElementById("chatScreen"),
    messagesContainer: document.getElementById("messagesContainer"),
    messagesList: document.getElementById("messagesList"),
    toast: document.getElementById("toast"),
};

// ========================================
// ESTADO DA APLICAÇÃO
// ========================================

const state = {
    conversationHistory: [],
    isLoading: false,
    isOnline: false,
};

// ========================================
// INICIALIZAÇÃO
// ========================================

function init() {
    setupEventListeners();
    checkServerHealth();
    loadConversationHistory();
    elements.input.focus();
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Form submit
    elements.chatForm.addEventListener("submit", handleSendMessage);
    
    // Input - Enter para enviar
    elements.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    });
    
    // Input - auto resize
    elements.input.addEventListener("input", handleInputResize);
}

// ========================================
// HEALTH CHECK
// ========================================

async function checkServerHealth() {
    try {
        const response = await fetch(CONFIG.HEALTH_CHECK_URL);
        state.isOnline = response.ok;
    } catch (error) {
        state.isOnline = false;
        console.error("Erro ao verificar servidor:", error);
    }
}

// ========================================
// ENVIAR MENSAGEM
// ========================================

async function handleSendMessage(e) {
    e.preventDefault();
    
    const text = elements.input.value.trim();
    
    // Validações
    if (!text) return;
    
    if (text.length > CONFIG.MAX_MESSAGE_LENGTH) {
        showToast(`Mensagem muito longa. Máximo ${CONFIG.MAX_MESSAGE_LENGTH} caracteres.`, "error");
        return;
    }
    
    if (state.isLoading) {
        showToast("Aguarde a resposta anterior", "error");
        return;
    }
    
    if (!state.isOnline) {
        showToast("Servidor offline. Tente novamente.", "error");
        return;
    }
    
    // Mostrar tela de chat se estiver na tela de boas-vindas
    showChatScreen();
    
    // Adiciona mensagem do usuário
    addMessage(text, "user");
    
    // Adiciona ao histórico
    state.conversationHistory.push({ role: "user", content: text });
    
    // Limpa input
    elements.input.value = "";
    handleInputResize();
    
    // Desabilita input durante envio
    setLoadingState(true);
    
    // Adiciona loader
    const loader = addTypingLoader();
    
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                message: text,
                conversationHistory: state.conversationHistory.slice(-10),
            }),
        });
        
        // Remove loader
        loader.remove();
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.reply) {
            throw new Error("Resposta inválida do servidor");
        }
        
        // Adiciona resposta da IA
        addMessage(data.reply, "bot");
        
        // Adiciona ao histórico
        state.conversationHistory.push({ role: "assistant", content: data.reply });
        
        // Salva histórico
        saveConversationHistory();
        
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        
        // Remove loader se ainda existir
        if (loader && loader.parentNode) {
            loader.remove();
        }
        
        // Adiciona mensagem de erro
        addMessage(error.message || "Erro ao conectar com o servidor. Tente novamente.", "error");
        showToast("Erro ao enviar mensagem", "error");
        
    } finally {
        setLoadingState(false);
    }
}

// ========================================
// ADICIONAR MENSAGEM
// ========================================

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    
    const bubbleDiv = document.createElement("div");
    bubbleDiv.classList.add("message-bubble");
    
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    
    // Processar markdown se for mensagem do bot
    if (sender === "bot") {
        contentDiv.innerHTML = formatMarkdown(text);
    } else {
        contentDiv.textContent = text;
    }
    
    bubbleDiv.appendChild(contentDiv);
    messageDiv.appendChild(bubbleDiv);
    
    elements.messagesList.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// ========================================
// FORMATAR MARKDOWN
// ========================================

function formatMarkdown(text) {
    // Escape HTML
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    // Code blocks (```)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code (`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold (**text**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic (*text*)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// ========================================
// TYPING LOADER
// ========================================

function addTypingLoader() {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot");
    
    const bubbleDiv = document.createElement("div");
    bubbleDiv.classList.add("message-bubble");
    
    bubbleDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messageDiv.appendChild(bubbleDiv);
    elements.messagesList.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// ========================================
// MOSTRAR TELA DE CHAT
// ========================================

function showChatScreen() {
    if (elements.welcomeScreen.style.display !== "none") {
        elements.welcomeScreen.style.display = "none";
        elements.chatScreen.style.display = "flex";
    }
}

// ========================================
// ESTADO DE CARREGAMENTO
// ========================================

function setLoadingState(isLoading) {
    state.isLoading = isLoading;
    elements.input.disabled = isLoading;
    elements.submitBtn.disabled = isLoading;
    
    if (!isLoading) {
        elements.input.focus();
    }
}

// ========================================
// AUTO RESIZE TEXTAREA
// ========================================

function handleInputResize() {
    elements.input.style.height = "auto";
    elements.input.style.height = elements.input.scrollHeight + "px";
}

// ========================================
// SCROLL
// ========================================

function scrollToBottom() {
    elements.messagesContainer.scrollTo({
        top: elements.messagesContainer.scrollHeight,
        behavior: "smooth",
    });
}

// ========================================
// TOAST NOTIFICATION
// ========================================

function showToast(message, type = "info") {
    elements.toast.textContent = message;
    elements.toast.className = "toast show";
    
    if (type === "error" || type === "success") {
        elements.toast.classList.add(type);
    }
    
    setTimeout(() => {
        elements.toast.classList.remove("show");
    }, CONFIG.TOAST_DURATION);
}

// ========================================
// LOCAL STORAGE - HISTÓRICO
// ========================================

function saveConversationHistory() {
    try {
        localStorage.setItem("chatHistory", JSON.stringify(state.conversationHistory));
    } catch (error) {
        console.error("Erro ao salvar histórico:", error);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem("chatHistory");
        if (saved) {
            state.conversationHistory = JSON.parse(saved);
            
            // Reconstruir chat visual
            if (state.conversationHistory.length > 0) {
                showChatScreen();
                
                state.conversationHistory.forEach(msg => {
                    const sender = msg.role === "user" ? "user" : "bot";
                    addMessage(msg.content, sender);
                });
            }
        }
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        state.conversationHistory = [];
    }
}

// ========================================
// INICIAR APLICAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", init);

// Verificar saúde do servidor periodicamente
setInterval(checkServerHealth, 30000); // A cada 30 segundos
