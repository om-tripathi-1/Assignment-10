import { appState, chatHistory } from "./data.js";
import { buildMockAssistantBlocks } from "./mockResponses.js";

let messageCounter = Date.now();
let chatCounter = Math.max(
  ...chatHistory
    .map((chat) => Number(String(chat.id).replace("chat-", "")))
    .filter((value) => Number.isFinite(value)),
  0,
);

function nextMessageId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

function nextChatId() {
  chatCounter += 1;
  return `chat-${chatCounter}`;
}

export function getCurrentChatId() {
  return appState.activeChatId;
}

export function getCurrentChat() {
  if (!appState.activeChatId) return null;
  return chatHistory.find((chat) => chat.id === appState.activeChatId) || null;
}

export function getMessageById(messageId) {
  const currentChat = getCurrentChat();
  if (!currentChat?.messages) return null;

  return currentChat.messages.find((message) => message.id === messageId) || null;
}

export function toggleReaction(messageId, reactionType) {
  const message = getMessageById(messageId);
  if (!message || message.role !== "assistant") return;

  message.reactions = message.reactions || { liked: false, disliked: false };

  if (reactionType === "like") {
    message.reactions.liked = !message.reactions.liked;
    message.reactions.disliked = false;
  }

  if (reactionType === "dislike") {
    message.reactions.disliked = !message.reactions.disliked;
    message.reactions.liked = false;
  }
}

function appendExchange(chat, inputText) {
  const trimmed = inputText.trim();
  if (!chat || !trimmed) return;

  chat.messages = chat.messages || [];

  chat.messages.push({ id: nextMessageId(), role: "user", content: trimmed });

  chat.messages.push({
    id: nextMessageId(),
    role: "assistant",
    reactions: { liked: false, disliked: false },
    content: buildMockAssistantBlocks(trimmed),
  });
}

export function appendUserAndAssistantMessage(inputText) {
  appendExchange(getCurrentChat(), inputText);
}

export function createChatFromPrompt(promptText) {
  const trimmed = String(promptText || "").trim();
  if (!trimmed) return null;

  const newChat = {
    id: nextChatId(),
    title: trimmed.slice(0, 40),
    group: "Today",
    messages: [],
  };

  appendExchange(newChat, trimmed);
  chatHistory.unshift(newChat);

  return newChat.id;
}

export function regenerateAssistantMessage(messageId) {
  const currentChat = getCurrentChat();
  if (!currentChat?.messages) return;

  const targetIndex = currentChat.messages.findIndex(
    (message) => message.id === messageId && message.role === "assistant",
  );
  if (targetIndex < 0) return;

  const previousUser = [...currentChat.messages]
    .slice(0, targetIndex)
    .reverse()
    .find((message) => message.role === "user");

  currentChat.messages[targetIndex].content = buildMockAssistantBlocks(previousUser?.content || "");
}
