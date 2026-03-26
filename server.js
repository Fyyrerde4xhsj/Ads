// app.js - PERFECTLY SMOOTH
class CodeStudio {
    constructor() {
        this.isDemo = true;
        this.history = JSON.parse(localStorage.getItem('studioHistory') || '[]');
        this.templates = {
            portfolio: `<!DOCTYPE html><html><head><title>Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}.hero{max-width:800px;text-align:center;color:white;}.hero h1{font-size:clamp(2.5rem,8vw,5rem);margin-bottom:1rem;background:linear-gradient(135deg,#fff,#f0f0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;}.subtitle{font-size:1.3rem;margin-bottom:2rem;opacity:0.9;}.cta{display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#ff6b6b,#ee5a52);color:white;text-decoration:none;border-radius:50px;font-weight:600;font-size:1.1rem;box-shadow:0 10px 30px rgba(255,107,107,0.4);transition:all 0.3s ease;}.cta:hover{transform:translateY(-5px) scale(1.05);box-shadow:0 20px 40px rgba(255,107,107,0.6);}</style></head><body><div class="hero"><h1>John Doe</h1><p class="subtitle">Full-Stack Developer & Designer</p><a href="#" class="cta">View My Work →</a></div></body></html>`,

            calculator: `<!DOCTYPE html><html><head><title>Calculator</title><style>body{font-family:Inter;background:linear-gradient(135deg,#a8edea 0%,#fed6e3 100%);height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:20px;}.calc{width:320px;background:#1a1a2e;border-radius:24px;padding:30px;box-shadow:0 25px 50px rgba(0,0,0,0.25);}.display{width:100%;height:80px;background:#16213e;color:#fff;font-size:2rem;text-align:right;padding:0 20px;border-radius:16px;border:none;margin-bottom:20px;font-weight:500;box-sizing:border-box;}.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}.key{padding:20px;border:none;border-radius:16px;font-size:1.3rem;font-weight:600;cursor:pointer;transition:all 0.2s ease;backdrop-filter:blur(10px);}.key.num{background:#0f3460;color:#fff;}.key.op{background:linear-gradient(135deg,#ff6b6b,#ee5a52);color:#fff;font-weight:700;}.key:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,0,0,0.2);}.key:active{transform:translateY(-1px);}</style></head><body><div class="calc"><input type="text" class="display" id="display" readonly><div class="keys"><button class="key op" onclick="clearDisplay()">C</button><button class="key" onclick="deleteLast()">⌫</button><button class="key op" onclick="appendToDisplay('/')">÷</button><button class="key op" onclick="appendToDisplay('*')">×</button><button class="key num" onclick="appendToDisplay('7')">7</button><button class="key num" onclick="appendToDisplay('8')">8</button><button class="key num" onclick="appendToDisplay('9')">9</button><button class="key op" onclick="appendToDisplay('-')">-</button><button class="key num" onclick="appendToDisplay('4')">4</button><button class="key num" onclick="appendToDisplay('5')">5</button><button class="key num" onclick="appendToDisplay('6')">6</button><button class="key op" onclick="appendToDisplay('+')">+</button><button class="key num" onclick="appendToDisplay('1')">1</button><button class="key num" onclick="appendToDisplay('2')">2</button><button class="key num" onclick="appendToDisplay('3')">3</button><button class="key op" style="grid-row:span 2;height:116px;" onclick="calculate()">=</button><button class="key num" style="grid-column:span 2;" onclick="appendToDisplay('0')">0</button><button class="key num" onclick="appendToDisplay('.')">.</button></div></div><script>let display=document.getElementById('display');function appendToDisplay(val){display.value=display.value==='0'?val:display.value+val;}function clearDisplay(){display.value='0';}function deleteLast(){display.value=display.value.slice(0,-1)||'0';}function calculate(){try{display.value=eval(display.value.replace('×','*'));}catch{display.value='Error';}}</script></body></html>`,

            todo: `<!DOCTYPE html><html><head><title>Todo App</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Inter;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);min-height:100vh;padding:40px 20px;display:flex;align-items:center;justify-content:center;}.app{max-width:500px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.2);}.header{padding:40px 40px 20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-align:center;}.header h1{font-size:2.2rem;margin-bottom:8px;font-weight:800;}.input-group{display:flex;margin-bottom:30px;padding:0 40px;}.input-group input{flex:1;padding:18px 24px;border:none;border-radius:16px 0 0 16px;font-size:16px;font-weight:500;background:#f8fafc;}.input-group button{padding:18px 28px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:0 16px 16px 0;color:#fff;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s;}.input-group button:hover{transform:translateX(4px);}.todos{max-height:500px;overflow-y:auto;padding:0 40px 40px;}.todo-item{display:flex;align-items:center;padding:20px 24px;margin-bottom:12px;background:#f8fafc;border-radius:16px;cursor:pointer;transition:all 0.3s;border-left:4px solid transparent;}.todo-item:hover{border-left-color:#667eea;transform:translateX(8px);}.todo-item.completed{opacity:0.6;text-decoration:line-through;}.todo-checkbox{width:20px;height:20px;border:2px solid #d1d5db;border-radius:50%;margin-right:16px;cursor:pointer;position:relative;transition:all 0.2s;}.todo-checkbox.checked{background:#667eea;border-color:#667eea;}.todo-checkbox.checked::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:12px;font-weight:700;}.delete-btn{background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;margin-left:auto;padding:0 8px;transition:color 0.2s;}.delete-btn:hover{color:#ef4444;}</style></head><body><div class="app"><div class="header"><h1>✨ Todo</h1></div><div class="input-group"><input type="text" id="newTodo" placeholder="What needs to be done?"><button onclick="addTodo()">Add</button></div><div class="todos" id="todoList"></div></div><script>const todos=JSON.parse(localStorage.getItem('todos')||'[]');function saveTodos(){localStorage.setItem('todos',JSON.stringify(todos));}function render(){document.getElementById('todoList').innerHTML=todos.map((t,i)=>\`<div class="todo-item \${t.done?'completed':''}" onclick="toggle(\${i})"><div class="todo-checkbox \${t.done?'checked':''}"></div><span>\${t.text}</span><button class="delete-btn" onclick="event.stopPropagation();remove(\${i})">×</button></div>\`).join('');}function addTodo(){const input=document.getElementById('newTodo');if(input.value.trim()){todos.push({text:input.value,done:false});saveTodos();render();input.value='';}}function toggle(i){todos[i].done=!todos[i].done;saveTodos();render();}function remove(i){todos.splice(i,1);saveTodos();render();}document.getElementById('newTodo').addEventListener('keypress',e=>e.key==='Enter'&&addTodo());render();</script></body></html>`
        };
        this.init();
    }

    init() {
        this.el = {
            input: document.getElementById('promptInput'),
            btn: document.getElementById('generateBtn'),
            preview: document.getElementById('preview'),
            history: document.getElementById('historyList'),
            loading: document.getElementById('loading'),
            toggle: document.getElementById('modeToggle'),
            download: document.getElementById('downloadBtn'),
            status: document.getElementById('status'),
            clear: document.getElementById('clearBtn')
        };
        this.bind();
        this.renderHistory();
        this.updateStatus('Studio ready ✨');
    }

    bind() {
        this.el.btn.onclick = () => this.generate();
        this.el.toggle.onclick = () => this.toggleMode();
        this.el.clear.onclick = () => this.clearHistory();
        this.el.download.onclick = () => this.download();
        this.el.input.onkeydown = e => e.ctrlKey && e.key === 'Enter' && this.generate();
    }

    toggleMode() {
        this.isDemo = !this.isDemo;
        this.el.toggle.textContent = this.isDemo ? 'Demo Mode' : 'Live API';
        this.el.toggle.className = this.isDemo ? 'mode-btn demo' : 'mode-btn live';
        this.updateStatus(this.isDemo ? 'Instant demo results ✨' : 'Connecting to AI...');
    }

    async generate() {
        const prompt = this.el.input.value.trim();
        if (!prompt) return;

        this.startGenerate();
        let code = this.isDemo ? await this.demoGenerate(prompt) : await this.liveGenerate(prompt);
        
        if (code) {
            this.currentCode = code;
            this.saveHistory(prompt, code);
            this.updatePreview();
            this.updateStatus('✅ Code generated perfectly!');
        }
        this.stopGenerate();
        this.el.input.value = '';
    }

    startGenerate() {
        this.el.btn.disabled = true;
        this.el.btn.innerHTML = '<span class="btn-text">Creating...</span><span class="btn-icon">⚡</span>';
        this.el.loading.classList.add('active');
    }

    stopGenerate() {
        this.el.btn.disabled = false;
        this.el.btn.innerHTML = '<span class="btn-text">Generate</span><span class="btn-icon">✨</span>';
        this.el.loading.classList.remove('active');
    }

    demoGenerate(prompt) {
        return new Promise(resolve => {
            setTimeout(() => {
                const type = prompt.toLowerCase().includes('port') ? 'portfolio' :
                           prompt.toLowerCase().includes('calc') ? 'calculator' :
                           'todo';
                resolve(this.templates[type]);
            }, 2000);
        });
    }

    async liveGenerate(prompt) {
        return this.demoGenerate(prompt); // Placeholder
    }

    updatePreview() {
        const doc = this.el.preview.contentDocument || this.el.preview.contentWindow.document;
        doc.open();
        doc.write(this.currentCode || this.placeholderHTML());
        doc.close();
    }

    placeholderHTML() {
        return `<div style="height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;font-family:Inter;text-align:center;background:linear-gradient(135deg,#1e3c72,#2a5298);color:white;"><div><h1 style="font-size:3rem;margin-bottom:1rem;font-weight:800;">✨ AI Code Studio</h1><p style="font-size:1.2rem;opacity:0.9;">Type a prompt to generate beautiful web apps instantly!</p><p style="margin-top:2rem;font-size:1.1rem;opacity:0.8;">Try: "portfolio website", "calculator", "todo app"</p></div></div>`;
    }

    saveHistory(prompt, code) {
        this.history.unshift({prompt, code, time: Date.now()});
        this.history = this.history.slice(0, 15);
        localStorage.setItem('studioHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.el.history.innerHTML = this.history.slice(0, 8).map((h, i) => 
            `<div class="history-item" onclick="studio.loadHistory(${i})" title="${h.prompt}">${h.prompt.slice(0, 60)}${h.prompt.length>60?'...':''}</div>`
        ).join('');
    }

    loadHistory(i) {
        const h = this.history[i];
        this.el.input.value = h.prompt;
        this.currentCode = h.code;
        this.updatePreview();
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('studioHistory');
        this.renderHistory();
    }

    download() {
        if (!this.currentCode) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([this.currentCode], {type: 'text/html'}));
        a.download = 'ai-generated-app.html';
        a.click();
    }

    updateStatus(msg) {
        this.el.status.textContent = msg;
    }
}

let studio;
document.addEventListener('DOMContentLoaded', () => {
    studio = new CodeStudio();
    window.studio = studio;
});