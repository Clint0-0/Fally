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


async function scanPage() {

  const nodes = walkTextNodes(document.body);

  for (let node of nodes) {

    if (!node.parentElement) continue;

    // Skip sensitive elements
    if (
      ["SCRIPT","STYLE","INPUT","TEXTAREA","NOSCRIPT"].includes(node.parentElement.tagName)
    ) continue;

    // Skip links/buttons (prevents breaking site UI)
    if (node.parentElement.closest("input, textarea, button, a")) continue;

    let text = node.nodeValue;

    if (!text || text.trim().length < 3) continue;

    const result = await checkToxicity(text);

    if (result.severity !== "clean") {

      const span = document.createElement("span");

      span.className = "toxiguard-moderated";
      span.textContent = `[Content Moderated: ${result.severity}]`;

      node.parentNode.replaceChild(span, node);
    }
  }
}


window.addEventListener("load", () => {
  scanPage();
});


// Warn before sending toxic messages
document.addEventListener("submit", async function (event) {

  const form = event.target;

  const inputs = form.querySelectorAll("textarea, input[type='text']");

  for (let input of inputs) {

    const text = input.value;

    if (!text || text.trim().length < 3) continue;

    const result = await checkToxicity(text);

    if (result.severity !== "clean") {

      const confirmSend = confirm(
        "⚠️ This message may contain harmful language.\n\nDo you still want to send it?"
      );

      if (!confirmSend) {
        event.preventDefault();
        return;
      }
    }
  }

});


// Warn while typing
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