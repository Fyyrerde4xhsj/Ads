const APIs = [
    { name: "OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", key: "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", type: "openai" },
    { name: "OpenAI", url: "https://api.openai.com/v1/chat/completions", key: "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", type: "openai" },
    { name: "Anthropic", url: "https://api.anthropic.com/v1/messages", key: "sk-or-v1-52a56f096dc2c38f9da4c2492fe7b6cd9e12b5dffff7539624299faa802cdd8ea7", type: "anthropic" },
    { name: "Gemini", url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCy_lE_5GXusVXNo9zyOoCTd6VeCChLUs4", type: "gemini" }
];

const state = {
    history: JSON.parse(localStorage.getItem('vibe_history') || '[]'),
    isGenerating: false
};

const dom = {
    userInput: document.getElementById('userInput'),
    sendBtn: document.getElementById('sendBtn'),
    chat: document.getElementById('chatContainer'),
    iframe: document.getElementById('outputFrame'),
    history: document.getElementById('historyList'),
    spinner: document.getElementById('spinner'),
    status: document.getElementById('renderStatus'),
    overlay: document.getElementById('welcomeOverlay')
};

function init() {
    renderHistory();
    dom.sendBtn.addEventListener('click', handleGenerate);
    dom.userInput.addEventListener('input', () => {
        dom.userInput.style.height = 'auto';
        dom.userInput.style.height = dom.userInput.scrollHeight + 'px';
    });
}

async function handleGenerate() {
    const prompt = dom.userInput.value.trim();
    if (!prompt || state.isGenerating) return;

    toggleLoading(true);
    addMessage(prompt, 'user');
    dom.userInput.value = '';
    dom.userInput.style.height = 'auto';

    const systemPrompt = `Return ONLY a complete, single-file HTML/CSS/JS solution for: ${prompt}. 
    Use modern, professional design. No markdown markers, no explanations. 
    Wrap everything in <html> tags.`;

    try {
        const promises = APIs.map(api => callSingleAPI(api, systemPrompt));
        const results = await Promise.allSettled(promises);
        
        // Pick longest successful response (usually more detailed)
        const successfulCodes = results
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value)
            .sort((a, b) => b.length - a.length);

        if (successfulCodes.length > 0) {
            const finalCode = cleanCode(successfulCodes[0]);
            renderCode(finalCode);
            saveHistory(prompt, finalCode);
            addMessage("UI generated successfully.", "bot");
        } else {
            throw new Error("No valid response from APIs");
        }
    } catch (err) {
        addMessage("Failed to generate code. Please verify API keys or check CORS.", "bot");
        console.error(err);
    } finally {
        toggleLoading(false);
    }
}

async function callSingleAPI(api, prompt) {
    const headers = { "Content-Type": "application/json" };
    let body = {};

    if (api.type === "openai") {
        headers["Authorization"] = `Bearer ${api.key}`;
        body = { model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] };
    } else if (api.type === "anthropic") {
        headers["x-api-key"] = api.key;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        body = { model: "claude-3-haiku-20240307", max_tokens: 4096, messages: [{ role: "user", content: prompt }] };
    } else if (api.type === "gemini") {
        body = { contents: [{ parts: [{ text: prompt }] }] };
    }

    const res = await fetch(api.url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await res.json();

    if (api.type === "openai") return data.choices[0].message.content;
    if (api.type === "anthropic") return data.content[0].text;
    if (api.type === "gemini") return data.candidates[0].content.parts[0].text;
}

function cleanCode(code) {
    return code.replace(/```html/gi, '').replace(/```/g, '').trim();
}

function renderCode(code) {
    dom.overlay.style.display = 'none';
    dom.status.textContent = 'Rendering...';
    
    // Using srcdoc to avoid blob URL issues
    dom.iframe.srcdoc = code;
    
    dom.iframe.onload = () => {
        dom.status.textContent = 'Live';
    };
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.textContent = text;
    dom.chat.appendChild(div);
    dom.chat.scrollTop = dom.chat.scrollHeight;
}

function toggleLoading(isLoading) {
    state.isGenerating = isLoading;
    dom.sendBtn.disabled = isLoading;
    dom.spinner.style.display = isLoading ? 'block' : 'none';
    document.querySelector('.btn-label').style.display = isLoading ? 'none' : 'block';
    dom.status.textContent = isLoading ? 'Thinking...' : 'Idle';
}

function saveHistory(prompt, code) {
    const entry = { id: Date.now(), prompt, code };
    state.history.unshift(entry);
    if (state.history.length > 5) state.history.pop();
    localStorage.setItem('vibe_history', JSON.stringify(state.history));
    renderHistory();
}

function renderHistory() {
    dom.history.innerHTML = '';
    state.history.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.textContent = item.prompt;
        el.onclick = () => renderCode(item.code);
        dom.history.appendChild(el);
    });
}

init();