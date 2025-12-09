// ========================================
// CONFIGURAÇÕES
// ========================================

const CONFIG = {
    API_URL: "/api/chat",
    HEALTH_CHECK_URL: "/api/health",
    MAX_MESSAGE_LENGTH: 4000,
    TYPING_DELAY: 500,
    TOAST_DURATION: 3000,
    AUTO_RESIZE_TEXTAREA: true,
};

// ========================================
// ELEMENTOS DO DOM
// ========================================

const elements = {
    input: document.getElementById("userInput"),
    sendBtn: document.getElementById("sendBtn"),
    clearBtn: document.getElementById("clearBtn"),
    chatArea: document.getElementById("chatArea"),
    scrollBottomBtn: document.getElementById("scrollBottomBtn"),
    charCount: document.getElementById("charCount"),
    statusDot: document.getElementById("statusDot"),
    statusText: document.getElementById("statusText"),
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
    setupQuickActions();
    
    // Foco automático no input
    elements.input.focus();
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Botão enviar
    elements.sendBtn.addEventListener("click", handleSendMessage);
    
    // Botão limpar
    elements.clearBtn.addEventListener("click", handleClearChat);
    
    // Input - Enter para enviar
    elements.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Input - auto resize
    if (CONFIG.AUTO_RESIZE_TEXTAREA) {
        elements.input.addEventListener("input", handleInputResize);
    }
    
    // Input - contador de caracteres
    elements.input.addEventListener("input", updateCharCount);
    
    // Scroll - mostrar botão de voltar ao fim
    elements.chatArea.addEventListener("scroll", handleScroll);
    
    // Botão scroll to bottom
    elements.scrollBottomBtn.addEventListener("click", scrollToBottom);
}

// ========================================
// QUICK ACTIONS
// ========================================

function setupQuickActions() {
    const quickBtns = document.querySelectorAll(".quick-btn");
    quickBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const message = btn.getAttribute("data-message");
            if (message) {
                elements.input.value = message;
                elements.input.focus();
                handleSendMessage();
            }
        });
    });
}

// ========================================
// HEALTH CHECK
// ========================================

async function checkServerHealth() {
    try {
        const response = await fetch(CONFIG.HEALTH_CHECK_URL);
        if (response.ok) {
            updateStatus(true, "Online");
        } else {
            updateStatus(false, "Servidor com problemas");
        }
    } catch (error) {
        updateStatus(false, "Offline");
        console.error("Erro ao verificar servidor:", error);
    }
}

function updateStatus(isOnline, text) {
    state.isOnline = isOnline;
    elements.statusDot.classList.toggle("online", isOnline);
    elements.statusDot.classList.toggle("offline", !isOnline);
    elements.statusText.textContent = text;
}

// ========================================
// ENVIAR MENSAGEM
// ========================================

async function handleSendMessage() {
    const text = elements.input.value.trim();
    
    // Validações
    if (!text) {
        showToast("Digite uma mensagem", "error");
        return;
    }
    
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
    
    // Remove mensagem de boas-vindas
    removeWelcomeMessage();
    
    // Adiciona mensagem do usuário
    addMessage(text, "user");
    
    // Adiciona ao histórico
    state.conversationHistory.push({ role: "user", content: text });
    
    // Limpa input
    elements.input.value = "";
    updateCharCount();
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
    messageDiv.textContent = text;
    
    elements.chatArea.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// ========================================
// TYPING LOADER
// ========================================

function addTypingLoader() {
    const loaderDiv = document.createElement("div");
    loaderDiv.classList.add("message", "bot");
    loaderDiv.innerHTML = `
        <div class="typing">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    
    elements.chatArea.appendChild(loaderDiv);
    scrollToBottom();
    
    return loaderDiv;
}

// ========================================
// LIMPAR CHAT
// ========================================

function handleClearChat() {
    if (state.isLoading) {
        showToast("Aguarde a resposta atual", "error");
        return;
    }
    
    if (state.conversationHistory.length === 0) {
        showToast("Nenhuma conversa para limpar", "error");
        return;
    }
    
    if (confirm("Deseja limpar toda a conversa?")) {
        elements.chatArea.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">👋</div>
                <h2>Olá! Como posso ajudar?</h2>
                <p>Faça qualquer pergunta ou inicie uma conversa</p>
                
                <div class="quick-actions">
                    <button class="quick-btn" data-message="Explique o que é inteligência artificial">
                        💡 O que é IA?
                    </button>
                    <button class="quick-btn" data-message="Me conte uma curiosidade interessante">
                        🎯 Curiosidade
                    </button>
                    <button class="quick-btn" data-message="Me ajude a resolver um problema">
                        🔧 Resolver problema
                    </button>
                </div>
            </div>
        `;
        
        state.conversationHistory = [];
        saveConversationHistory();
        setupQuickActions();
        showToast("Conversa limpa com sucesso", "success");
    }
}

// ========================================
// REMOVER MENSAGEM DE BOAS-VINDAS
// ========================================

function removeWelcomeMessage() {
    const welcomeMsg = document.querySelector(".welcome-message");
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
}

// ========================================
// ESTADO DE CARREGAMENTO
// ========================================

function setLoadingState(isLoading) {
    state.isLoading = isLoading;
    elements.input.disabled = isLoading;
    elements.sendBtn.disabled = isLoading;
    elements.clearBtn.disabled = isLoading;
    
    if (isLoading) {
        elements.sendBtn.style.opacity = "0.5";
    } else {
        elements.sendBtn.style.opacity = "1";
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
// CONTADOR DE CARACTERES
// ========================================

function updateCharCount() {
    const count = elements.input.value.length;
    elements.charCount.textContent = `${count} / ${CONFIG.MAX_MESSAGE_LENGTH}`;
    
    if (count > CONFIG.MAX_MESSAGE_LENGTH * 0.9) {
        elements.charCount.style.color = "var(--accent-red)";
    } else {
        elements.charCount.style.color = "var(--text-secondary)";
    }
}

// ========================================
// SCROLL
// ========================================

function scrollToBottom(smooth = true) {
    elements.chatArea.scrollTo({
        top: elements.chatArea.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
    });
}

function handleScroll() {
    const isNearBottom = elements.chatArea.scrollHeight - elements.chatArea.scrollTop - elements.chatArea.clientHeight < 100;
    
    if (isNearBottom) {
        elements.scrollBottomBtn.style.display = "none";
    } else {
        elements.scrollBottomBtn.style.display = "flex";
    }
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
                removeWelcomeMessage();
                
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
