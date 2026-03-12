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

    let text = node.nodeValue;

    if (!text || text.trim().length < 3) continue;

    const result = await checkToxicity(text);

    if (result.severity !== "clean") {

      const span = document.createElement("span");

      span.textContent = "[Content Moderated]";
      span.style.background = "rgba(255,0,0,0.2)";
      span.style.padding = "2px 4px";
      span.style.borderRadius = "4px";

      node.parentNode.replaceChild(span, node);
    }
  }
}


window.addEventListener("load", () => {
  scanPage();
});