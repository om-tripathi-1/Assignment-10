import { appState, chatHistory } from "./data.js";
import { escapeHTML } from "./utils.js";

const chatHistoryContainer = document.querySelector("#chatHistory");
const CHAT_GROUPS = ["Today", "Yesterday", "Previous 7 days", "Older"];

function renderGroup(groupName, chats) {
  const items = chats
    .map(
      (chat) => `
        <button type="button" class="chat-item ${chat.id === appState.activeChatId ? "chat-item--active" : ""}" data-chat-id="${chat.id}">
          <span>${escapeHTML(chat.title)}</span>
        </button>
      `,
    )
    .join("");

  return `
    <div class="chat-history-group">
      <p class="chat-title">${groupName}</p>
      ${items}
    </div>
  `;
}

export function renderChatHistory() {
  if (!chatHistoryContainer) return;

  chatHistoryContainer.innerHTML = CHAT_GROUPS.map((groupName) => {
    const chatsInGroup = chatHistory.filter((chat) => chat.group === groupName);
    return chatsInGroup.length ? renderGroup(groupName, chatsInGroup) : "";
  }).join("");
}

export function getActiveChatId() {
  return appState.activeChatId;
}

export function setActiveChatId(chatId) {
  appState.activeChatId = chatId;
  renderChatHistory();
  document.dispatchEvent(new CustomEvent("conversation:changed", { detail: { chatId } }));
}

chatHistoryContainer?.addEventListener("click", (event) => {
  const chatItem = event.target.closest(".chat-item");
  if (!chatItem) return;

  setActiveChatId(chatItem.dataset.chatId);
});
