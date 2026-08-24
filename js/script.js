import { renderChatHistory } from "./history.js";
import { createChatFromPrompt, renderConversation } from "./chat.js";
import { appState } from "./data.js";
import { initSidebar, closeSidebar } from "./sidebar.js";
import { submitOnEnter } from "./utils.js";

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

function updateViews() {
  const isChatOpen = Boolean(appState.activeChatId);

  if (landingView) {
    landingView.hidden = isChatOpen;
  }

  if (chatView) {
    chatView.hidden = !isChatOpen;
  }

  contentMiddle?.classList.toggle(
    "content__middle--chat",
    isChatOpen
  );
}

function setActiveChat(chatId) {
  appState.activeChatId = chatId || null;

  updateViews();

  if (appState.activeChatId) {
    renderConversation();
  }

  closeSidebar();
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
renderChatHistory();
updateViews();


function openUploadModal() {
  uploadModal.hidden = false;
  uploadTrigger.setAttribute("aria-expanded", "true");
}

function closeUploadModal() {
  uploadModal.hidden = true;
  uploadTrigger.setAttribute("aria-expanded", "false");
}

function toggleUploadModal() {
  if (uploadModal.hidden) {
    openUploadModal();
  } else {
    closeUploadModal();
  }
}

uploadTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleUploadModal();
});

uploadFiles.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const files = [...event.target.files];

  if (!files.length) return;

  console.log("Selected files:", files);

  files.forEach((file) => {
    console.log({
      name: file.name,
      type: file.type,
      size: file.size,
    });
  });

  closeUploadModal();

  fileInput.value = "";
});

document.addEventListener("click", (event) => {
  const clickedInsideModal = uploadModal.contains(event.target);
  const clickedTrigger = uploadTrigger.contains(event.target);

  if (!clickedInsideModal && !clickedTrigger && !uploadModal.hidden) {
    closeUploadModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !uploadModal.hidden) {
    closeUploadModal();
  }
});


modelSelectorTrigger.addEventListener("click", (event) => {
  event.stopPropagation();

  const isHidden = modelSelectorMenu.hidden;

  modelSelectorMenu.hidden = !isHidden;

  modelSelectorTrigger.setAttribute("aria-expanded", String(isHidden));
});

modelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const model = option.dataset.model;

    selectedModel.textContent = model;

    modelOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    modelSelectorMenu.hidden = true;

    modelSelectorTrigger.setAttribute("aria-expanded", "false");

    console.log("Selected model:", model);
  });
});

document.addEventListener("click", (event) => {
  const selector = document.querySelector(".model-selector");

  if (
    selector &&
    !selector.contains(event.target) &&
    !modelSelectorMenu.hidden
  ) {
    modelSelectorMenu.hidden = true;

    modelSelectorTrigger.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modelSelectorMenu.hidden) {
      modelSelectorMenu.hidden = true;

      modelSelectorTrigger.setAttribute("aria-expanded", "false");
    }
  }
});
