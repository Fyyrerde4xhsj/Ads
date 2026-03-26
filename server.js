const chat = document.getElementById("chat");
const frame = document.getElementById("frame");
const loading = document.getElementById("loading");
const historyEl = document.getElementById("history");

function addMsg(text){
  const div = document.createElement("div");
  div.innerText = text;
  div.style.margin = "5px 0";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function clean(html){
  return html.replace(/```html|```/g,"");
}

/* 🔥 LOCAL AI FALLBACK (ALWAYS WORKS) */
function generateLocalAI(prompt){

  return `
  <html>
  <head>
  <title>${prompt}</title>
  <style>
  body{
    margin:0;
    font-family:sans-serif;
    background:#0d1117;
    color:white;
  }
  header{
    padding:40px;
    text-align:center;
    background:linear-gradient(45deg,#238636,#2ea043);
  }
  section{
    padding:40px;
    text-align:center;
  }
  button{
    padding:12px 20px;
    border:none;
    background:#238636;
    color:white;
    border-radius:8px;
    cursor:pointer;
  }
  </style>
  </head>
  <body>

  <header>
    <h1>${prompt}</h1>
    <p>Generated Website</p>
  </header>

  <section>
    <h2>Welcome</h2>
    <p>This is an AI generated layout</p>
    <button>Get Started</button>
  </section>

  </body>
  </html>
  `;
}

async function generate(){

  const input = document.getElementById("prompt");
  const userPrompt = input.value.trim();
  if(!userPrompt) return;

  addMsg("🧑 " + userPrompt);
  loading.classList.remove("hidden");

  let code = "";

  try{
    /* TRY API */
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"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"
      },
      body:JSON.stringify({
        model:"openai/gpt-4o-mini",
        messages:[
          {role:"user", content:`Return ONLY HTML.\n${userPrompt}`}
        ]
      })
    });

    const data = await res.json();
    code = data.choices?.[0]?.message?.content || "";

    code = clean(code);

  }catch(e){
    console.log("API failed");
  }

  /* 🔥 IF API FAIL → USE LOCAL AI */
  if(!code || !code.includes("<html")){
    code = generateLocalAI(userPrompt);
    addMsg("⚠️ API failed → Using local AI");
  } else {
    addMsg("🤖 AI Generated");
  }

  frame.srcdoc = code;

  saveHistory(userPrompt, code);

  loading.classList.add("hidden");
  input.value = "";
}

/* HISTORY */
function saveHistory(p,c){
  let h = JSON.parse(localStorage.getItem("h")||"[]");
  h.push({p,c});
  localStorage.setItem("h", JSON.stringify(h));
  loadHistory();
}

function loadHistory(){
  historyEl.innerHTML="";
  let h = JSON.parse(localStorage.getItem("h")||"[]");

  h.forEach(i=>{
    let li = document.createElement("li");
    li.innerText = i.p;
    li.onclick=()=> frame.srcdoc = i.c;
    historyEl.appendChild(li);
  });
}

loadHistory();
