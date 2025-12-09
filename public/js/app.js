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
    exportBtn: document.getElementById("exportBtn"),
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
    
    // Botão exportar
    elements.exportBtn.addEventListener("click", handleExportChat);
    
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
    
    // Container para conteúdo e ações
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("message-content");
    
    // Processar markdown se for mensagem do bot
    if (sender === "bot") {
        contentWrapper.innerHTML = formatMarkdown(text);
    } else {
        contentWrapper.textContent = text;
    }
    
    messageDiv.appendChild(contentWrapper);
    
    // Adicionar botão de copiar
    if (sender === "bot" || sender === "user") {
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("message-actions");
        
        const copyBtn = document.createElement("button");
        copyBtn.classList.add("copy-btn-msg");
        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyBtn.title = "Copiar mensagem";
        copyBtn.onclick = () => copyMessage(text, copyBtn);
        
        actionsDiv.appendChild(copyBtn);
        messageDiv.appendChild(actionsDiv);
    }
    
    elements.chatArea.appendChild(messageDiv);
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
// COPIAR MENSAGEM
// ========================================

function copyMessage(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        button.classList.add("copied");
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove("copied");
        }, 2000);
        
        showToast("Mensagem copiada!", "success");
    }).catch(() => {
        showToast("Erro ao copiar mensagem", "error");
    });
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
// EXPORTAR CONVERSA
// ========================================

function handleExportChat() {
    if (state.conversationHistory.length === 0) {
        showToast("Nenhuma conversa para exportar", "error");
        return;
    }
    
    // Criar conteúdo do arquivo
    let content = "# Conversa com Assistente IA\n\n";
    content += `Data: ${new Date().toLocaleString("pt-BR")}\n\n`;
    content += "---\n\n";
    
    state.conversationHistory.forEach((msg, index) => {
        const role = msg.role === "user" ? "👤 Você" : "🤖 Assistente";
        content += `### ${role}\n\n`;
        content += `${msg.content}\n\n`;
        content += "---\n\n";
    });
    
    // Criar e baixar arquivo
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversa-ia-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("Conversa exportada com sucesso!", "success");
}

// ========================================
// INICIAR APLICAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", init);

// Verificar saúde do servidor periodicamente
setInterval(checkServerHealth, 30000); // A cada 30 segundos
