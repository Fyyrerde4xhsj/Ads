/**
 * AI Code Studio - Core Logic
 */

const APIs = [
    { 
        name: "OpenRouter", 
        url: "https://openrouter.ai/api/v1/chat/completions", 
        key: "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",
        type: "openai"
    },
    { 
        name: "OpenAI", 
        url: "https://api.openai.com/v1/chat/completions", 
        key: "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",
        type: "openai"
    },
    { 
        name: "Anthropic", 
        url: "https://api.anthropic.com/v1/messages", 
        key: "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",
        type: "anthropic"
    },
    { 
        name: "Gemini", 
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCy_lE_5GXusVXNo9zyOoCTd6VeCChLUs4", 
        type: "gemini"
    }
];

// State Management
let buildHistory = JSON.parse(localStorage.getItem('buildHistory') || '[]');

// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const btnText = document.querySelector('.btn-text');
const chatDisplay = document.getElementById('chatDisplay');
const previewIframe = document.getElementById('previewIframe');
const historyList = document.getElementById('historyList');
const statusIndicator = document.getElementById('statusIndicator');

/**
 * Build System Prompt
 */
function constructSystemPrompt(userPrompt) {
    return `Create a professional, modern web component or page based on this request: "${userPrompt}". 
    Requirements:
    1. Return ONLY valid HTML with internal CSS (in <style> tags) and internal JS (in <script> tags).
    2. Do NOT include any explanations, markdown code blocks (like \`\`\`html), or text outside the HTML.
    3. Use modern UI practices (Flexbox/Grid, clean typography, responsive design).
    4. Ensure it looks complete and high-quality.`;
}

/**
 * Clean AI Output
 */
function cleanResponse(text) {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```html/gi, '').replace(/```/g, '').trim();
    // Basic validation check
    if (!cleaned.toLowerCase().includes('<html') && !cleaned.toLowerCase().includes('<div')) {
        return `<html><body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
                <p>Error: AI returned invalid code. Please try again.</p>
                </body></html>`;
    }
    return cleaned;
}

/**
 * API Callers
 */
async function callAPI(api, systemPrompt) {
    try {
        const headers = { "Content-Type": "application/json" };
        let body = {};

        if (api.type === "openai") {
            headers["Authorization"] = `Bearer ${api.key}`;
            body = {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: systemPrompt }],
                temperature: 0.7
            };
        } else if (api.type === "anthropic") {
            headers["x-api-key"] = api.key;
            headers["anthropic-version"] = "2023-06-01";
            body = {
                model: "claude-3-sonnet-20240229",
                max_tokens: 4000,
                messages: [{ role: "user", content: systemPrompt }]
            };
        } else if (api.type === "gemini") {
            body = { contents: [{ parts: [{ text: systemPrompt }] }] };
        }

        const response = await fetch(api.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        // Extract result based on API type
        if (api.type === "openai") return data.choices[0].message.content;
        if (api.type === "anthropic") return data.content[0].text;
        if (api.type === "gemini") return data.candidates[0].content.parts[0].text;
        
        return null;
    } catch (err) {
        console.error(`API ${api.name} failed:`, err);
        return null;
    }
}

/**
 * UI & History Helpers
 */
function updatePreview(code) {
    const blob = new Blob([code], { type: 'text/html' });
    previewIframe.src = URL.createObjectURL(blob);
}

function addToChat(text, type = 'user') {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatDisplay.appendChild(msg);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function saveToHistory(prompt, code) {
    const entry = { id: Date.now(), prompt, code };
    buildHistory.unshift(entry);
    if (buildHistory.length > 10) buildHistory.pop();
    localStorage.setItem('buildHistory', JSON.stringify(buildHistory));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    buildHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = item.prompt;
        div.onclick = () => updatePreview(item.code);
        historyList.appendChild(div);
    });
}

/**
 * Main Generation Logic
 */
async function generateCode() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    // UI Feedback
    generateBtn.disabled = true;
    loader.style.display = 'block';
    btnText.textContent = 'Coding...';
    statusIndicator.textContent = 'Generating...';
    addToChat(prompt, 'user');

    const systemPrompt = constructSystemPrompt(prompt);
    
    // Try all APIs and take the first successful one (or logic can be adjusted to "longest")
    try {
        const results = await Promise.allSettled(APIs.map(api => callAPI(api, systemPrompt)));
        
        // Filter successful results
        const validResults = results
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value)
            .sort((a, b) => b.length - a.length); // Pick longest (usually most detailed)

        if (validResults.length > 0) {
            const bestCode = cleanResponse(validResults[0]);
            updatePreview(bestCode);
            saveToHistory(prompt, bestCode);
            statusIndicator.textContent = 'Success';
            addToChat("Code generated successfully!", "system");
        } else {
            throw new Error("All APIs failed");
        }
    } catch (error) {
        addToChat("Error: Failed to connect to AI services. Check console or API keys.", "system");
        statusIndicator.textContent = 'Error';
    } finally {
        generateBtn.disabled = false;
        loader.style.display = 'none';
        btnText.textContent = 'Generate';
        promptInput.value = '';
    }
}

// Events
generateBtn.addEventListener('click', generateCode);
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateCode();
    }
});

// Init
renderHistory();
if (buildHistory.length > 0) {
    updatePreview(buildHistory[0].code);
}