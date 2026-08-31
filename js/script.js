import { renderChatHistory } from "./history.js";
import { createChatFromPrompt, renderConversation } from "./chat.js";
import { appState } from "./data.js";
import { initSidebar, closeSidebar } from "./sidebar.js";
import { submitOnEnter } from "./utils.js";
import { initSettingsModal } from "./settings-modal.js";

const landingView = document.querySelector("#landingView");
const chatView = document.querySelector("#chatView");
const contentMiddle = document.querySelector(".content__middle");
const landingComposer = document.querySelector("#landingComposer");
const landingInput = document.querySelector("#landingInput");

const uploadTrigger = document.querySelector("#uploadTrigger");
const uploadModal = document.querySelector("#uploadModal");
const fileInput = document.querySelector("#fileInput");
const uploadFiles = document.querySelector("#uploadFiles");

const modelSelectorTrigger = document.querySelector("#modelSelectorTrigger");
const modelSelectorMenu = document.querySelector("#modelSelectorMenu");
const selectedModel = document.querySelector("#selectedModel");
const modelOptions = document.querySelectorAll(".model-selector__option");

function createToggleableMenu(trigger, menu) {
  function open() {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function close() {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function toggle() {
    menu.hidden ? open() : close();
  }

  function isOpen() {
    return !menu.hidden;
  }

  function closeIfClickedOutside(event) {
    const clickedInside = menu.contains(event.target) || trigger.contains(event.target);
    if (!clickedInside && isOpen()) close();
  }

  function closeOnEscape(event) {
    if (event.key === "Escape" && isOpen()) close();
  }

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    toggle();
  });

  document.addEventListener("click", closeIfClickedOutside);
  document.addEventListener("keydown", closeOnEscape);

  return { open, close, toggle };
}

function updateViews() {
  const isChatOpen = Boolean(appState.activeChatId);

  if (landingView) landingView.hidden = isChatOpen;
  if (chatView) chatView.hidden = !isChatOpen;

  contentMiddle?.classList.toggle("content__middle--chat", isChatOpen);
}

function setActiveChat(chatId) {
  appState.activeChatId = chatId || null;
  updateViews();

  if (window.matchMedia("(max-width: 900px)").matches) {
    closeSidebar();
  }

  if (appState.activeChatId) {
    renderConversation();
  }
}

document.addEventListener("conversation:changed", (event) => {
  setActiveChat(event.detail?.chatId ?? "");
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".sidebar__top .chat")) {
    setActiveChat("");
  }
});

landingComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const newChatId = createChatFromPrompt(landingInput?.value || "");
  if (!newChatId) return;

  renderChatHistory();
  setActiveChat(newChatId);

  if (landingInput) {
    landingInput.value = "";
    landingInput.style.height = "auto";
  }
});

if (landingInput) {
  submitOnEnter(landingInput, landingComposer);
}

initSidebar();
initSettingsModal();
renderChatHistory();
updateViews();

const uploadMenu = createToggleableMenu(uploadTrigger, uploadModal);

uploadFiles.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const files = [...event.target.files];
  if (!files.length) return;

  files.forEach((file) => {
    console.log({ name: file.name, type: file.type, size: file.size });
  });

  uploadMenu.close();
  fileInput.value = "";
});

const modelSelectorMenuControl = createToggleableMenu(modelSelectorTrigger, modelSelectorMenu);

modelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const model = option.dataset.model;
    selectedModel.textContent = model;

    modelOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");

    modelSelectorMenuControl.close();
    console.log("Selected model:", model);
  });
});