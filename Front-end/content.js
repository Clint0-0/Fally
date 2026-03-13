async function checkToxicity(text) {

  const response = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text
    })
  });

  return await response.json();
}


function walkTextNodes(root) {

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  return nodes;
}


/* -------------------- */
/* WEBSITE BLOCKING */
/* -------------------- */

const blockedSites = [
  "4chan.org",
  "examplebadsite.com"
];

function blockWebsite(){

  chrome.storage.local.get(["parentalControl"], (settings)=>{

    if(!settings.parentalControl) return;

    const host = window.location.hostname;

    for(let site of blockedSites){

      if(host.includes(site)){

        document.body.innerHTML = `
        <div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:Arial;flex-direction:column">
        <h1>🚫 Website Blocked</h1>
        <p>This site is blocked by ToxiGuard parental controls.</p>
        </div>
        `;

      }

    }

  });

}


async function scanPage() {

  const nodes = walkTextNodes(document.body);

  for (let node of nodes) {

    if (!node.parentElement) continue;

    if (
      ["SCRIPT","STYLE","INPUT","TEXTAREA","NOSCRIPT"].includes(node.parentElement.tagName)
    ) continue;

    if (node.parentElement.closest("input, textarea, button")) continue;

    let text = node.nodeValue;

    if (!text || text.trim().length < 3) continue;

    const result = await checkToxicity(text);

    if (result.severity !== "clean") {

      const replacement =
        `<span class="toxiguard-moderated">[Content Moderated: ${result.severity}]</span>`;

      const wrapper = document.createElement("span");
      wrapper.innerHTML = replacement;

      node.parentNode.replaceChild(wrapper, node);
    }
  }
}


window.addEventListener("load", () => {

  blockWebsite();

  chrome.storage.local.get(["kidMode"], (settings) => {

    if(settings.kidMode){
      scanPage();
    }

  });

});


/* -------------------- */
/* MESSAGE PROTECTION */
/* -------------------- */

document.addEventListener("submit", async function (event) {

  const form = event.target;

  const inputs = form.querySelectorAll("textarea, input[type='text']");

  const settings = await new Promise(resolve =>
    chrome.storage.local.get(["kidMode"], resolve)
  );

  for (let input of inputs) {

    const text = input.value;

    if (!text || text.trim().length < 3) continue;

    const result = await checkToxicity(text);

      if (result.severity !== "clean") {

      const span = document.createElement("span");

      span.className = "toxiguard-moderated";

      span.textContent = `[Content Moderated: ${result.severity}]`;

      node.parentNode.replaceChild(span, node);

}

      const confirmSend = confirm(
        "⚠️ This message may contain harmful language.\n\nDo you still want to send it?"
      );

      if (!confirmSend) {
        event.preventDefault();
        return;
      }
    }
  }

);


document.addEventListener("input", async function (event) {

  const target = event.target;

  if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {

    const text = target.value;

    if (!text || text.trim().length < 3) return;

    const result = await checkToxicity(text);

    if (result.severity !== "clean") {

      if (!target.dataset.warned) {

        target.dataset.warned = "true";

        alert("⚠️ Warning: Your message may contain harmful language.");

      }

    } else {

      target.dataset.warned = "";

    }

  }

});