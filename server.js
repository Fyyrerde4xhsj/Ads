const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generate");
const preview = document.getElementById("preview");
const historyList = document.getElementById("historyList");
const loader = document.getElementById("loader");

const APIs = [
  {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: "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"
  },
  {
    name: "OpenAI",
    url: "https://api.openai.com/v1/chat/completions",
    key: "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"
  },
  {
    name: "Anthropic",
    url: "https://api.anthropic.com/v1/messages",
    key: "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"
  },
  {
    name: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    key: "AIzaSyCy_lE_5GXusVXNo9zyOoCTd6VeCChLUs4"
  }
];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function buildPrompt(userPrompt) {
  return `Return ONLY HTML with inline CSS and JS. No explanation.\n${userPrompt}`;
}

function cleanHTML(text) {
  return text.replace(/```html|```/g, "").trim();
}

async function callAPI(api, prompt) {
  try {
    const res = await fetch(api.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api.key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch {
    return "";
  }
}

async function generateCode(prompt) {
  loader.classList.remove("hidden");

  const results = await Promise.all(APIs.map(api => callAPI(api, prompt)));

  loader.classList.add("hidden");

  let best = results.sort((a, b) => b.length - a.length)[0];
  return cleanHTML(best);
}

function saveHistory(prompt, code) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({ prompt, code });
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item.prompt;
    li.onclick = () => {
      preview.srcdoc = item.code;
    };
    historyList.appendChild(li);
  });
}

generateBtn.onclick = async () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  addMessage(userPrompt, "user");

  const finalPrompt = buildPrompt(userPrompt);

  const code = await generateCode(finalPrompt);

  if (code) {
    addMessage("Generated successfully!", "ai");
    preview.srcdoc = code;
    saveHistory(userPrompt, code);
  } else {
    addMessage("Error generating code", "ai");
  }

  promptInput.value = "";
};

loadHistory();