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

function buildPrompt(p){
  return `Return ONLY HTML with inline CSS and JS.\n${p}`;
}

function clean(html){
  return html.replace(/```html|```/g,"");
}

/* ⚠️ IMPORTANT FIX:
   Browser cannot call OpenAI / Claude directly
   So we use OpenRouter (works in frontend)
*/

async function generate(){

  const input = document.getElementById("prompt");
  const userPrompt = input.value.trim();
  if(!userPrompt) return;

  addMsg("🧑 " + userPrompt);
  loading.classList.remove("hidden");

  try{

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"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"
      },
      body:JSON.stringify({
        model:"openai/gpt-4o-mini",
        messages:[
          {role:"user", content: buildPrompt(userPrompt)}
        ]
      })
    });

    const data = await res.json();

    let code = data.choices?.[0]?.message?.content || "";

    code = clean(code);

    if(!code.includes("<html")){
      throw new Error("Invalid HTML");
    }

    frame.srcdoc = code;

    saveHistory(userPrompt, code);

    addMsg("🤖 Done");

  }catch(e){
    addMsg("❌ Error: " + e.message);
  }

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