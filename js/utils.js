export function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function flattenMessageContentToText(content) {
  if (!Array.isArray(content)) return String(content || "");

  return content
    .map((block) => {
      if (block.type === "list") return (block.items || []).join("\n");
      if (block.type === "code") return String(block.code || "");

      if (block.type === "table") {
        const headers = (block.headers || []).join(" | ");
        const rows = (block.rows || []).map((row) => row.join(" | ")).join("\n");
        return `${headers}\n${rows}`;
      }

      return String(block.text || "");
    })
    .join("\n\n")
    .trim();
}

export async function copyTextToClipboard(text) {
  const value = String(text || "").trim();
  if (!value) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch(error) {
    console.log(error);
    
  }

  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = value;
  tempTextArea.setAttribute("readonly", "");
  tempTextArea.style.position = "absolute";
  tempTextArea.style.left = "-9999px";
  document.body.appendChild(tempTextArea);
  tempTextArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  return copied;
}

export function showCopyFeedback(button) {
  if (!button) return;

  const originalLabel = button.getAttribute("aria-label") || "Copy";
  button.setAttribute("aria-label", "Copied");
  button.classList.add("message-action--copied");

  window.setTimeout(() => {
    button.setAttribute("aria-label", originalLabel);
    button.classList.remove("message-action--copied");
  }, 900);
}

export function autoResizeTextarea(textarea, maxHeight = 180) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
}

export function submitOnEnter(textarea, form) {
  textarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    if (!textarea.value.trim()) return;

    form?.requestSubmit();
  });

  textarea.addEventListener("input", () => autoResizeTextarea(textarea));
}
