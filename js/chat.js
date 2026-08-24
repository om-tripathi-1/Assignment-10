import {
  getCurrentChat,
  getCurrentChatId,
  getMessageById,
  toggleReaction,
  appendUserAndAssistantMessage,
  createChatFromPrompt,
  regenerateAssistantMessage,
} from "./messageStore.js";
import {
  renderMessage,
  renderComposer,
  renderWelcomePanel,
} from "./messageRenderer.js";
import {
  escapeHTML,
  flattenMessageContentToText,
  copyTextToClipboard,
  showCopyFeedback,
  submitOnEnter,
} from "./utils.js";

let isInteractionBound = false;

async function handleCodeCopy(button) {
  const codeValue = decodeURIComponent(button.dataset.code || "");
  const copied = await copyTextToClipboard(codeValue);
  if (copied) showCopyFeedback(button);
}

async function handleMessageAction(button) {
  const assistantMessage = button.closest(".message.message--assistant");
  const messageId = assistantMessage?.dataset.messageId;
  if (!messageId) return;

  const action = button.dataset.action;

  if (action === "copy-message") {
    const message = getMessageById(messageId);
    const copied = await copyTextToClipboard(
      flattenMessageContentToText(message?.content),
    );
    if (copied) showCopyFeedback(button);
    return;
  }

  if (action === "like" || action === "dislike") {
    toggleReaction(messageId, action);
    renderConversation();
    return;
  }

  if (action === "regenerate") {
    regenerateAssistantMessage(messageId);
    renderConversation();
  }
}

function bindChatInteractions(chatWindow) {
  if (isInteractionBound || !chatWindow) return;

  chatWindow.addEventListener("submit", (event) => {
    const form = event.target.closest("#chatComposer");
    if (!form) return;

    event.preventDefault();
    event.stopPropagation();

    const textarea = form.querySelector(".chat-composer__input");
    if (!textarea) return;

    appendUserAndAssistantMessage(textarea.value || "");
    renderConversation();
  });

  chatWindow.addEventListener("click", (event) => {
    const codeCopyButton = event.target.closest(".code-block__copy");
    if (codeCopyButton) {
      handleCodeCopy(codeCopyButton);
      return;
    }

    const actionButton = event.target.closest(".message-action");
    if (actionButton) handleMessageAction(actionButton);
  });

  isInteractionBound = true;
}

function bindComposer(chatWindow) {
  const textarea = chatWindow.querySelector(".chat-composer__input");
  if (!textarea) return;

  submitOnEnter(textarea, textarea.closest("form"));
}

export function renderConversation() {
  const chatWindow = document.querySelector("#chatWindow");
  if (!chatWindow) return;

  bindChatInteractions(chatWindow);

  const currentChat = getCurrentChat();
  if (!currentChat) {
    chatWindow.innerHTML = "";
    return;
  }

  const messages = currentChat.messages || [];

  chatWindow.innerHTML = `
    <div class="chat-window__inner">
      <header class="chat-window__header">
        <h1 class="chat-window__title">${escapeHTML(currentChat.title)}</h1>
      </header>
      <section class="chat-window__messages" id="chatMessages" aria-label="Chat conversation">
        ${messages.length ? messages.map(renderMessage).join("") : renderWelcomePanel()}
      </section>
      ${renderComposer()}
    </div>
  `;

  bindComposer(chatWindow);
}

export { createChatFromPrompt, getCurrentChatId };
