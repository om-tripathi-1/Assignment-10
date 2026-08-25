export function initSettingsModal() {
  const settingsTrigger = document.querySelector("#settingsTrigger");
  const settingsModal = document.querySelector("#settingsModal");
  const settingsOverlay = document.querySelector("#settingsOverlay");
  const settingsClose = document.querySelector("#settingsClose");

  if (!settingsTrigger || !settingsModal) {
    console.error("Settings modal or trigger was not found");
    return;
  }

  function openSettingsModal() {
    settingsModal.hidden = false;

    settingsTrigger.setAttribute("aria-expanded", "true");

    document.body.classList.add("body--settings-open");
  }

  function closeSettingsModal() {
    settingsModal.hidden = true;

    settingsTrigger.setAttribute("aria-expanded", "false");

    document.body.classList.remove("body--settings-open");
  }

  settingsTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    openSettingsModal();
  });

  settingsClose?.addEventListener("click", closeSettingsModal);

  settingsOverlay?.addEventListener("click", closeSettingsModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !settingsModal.hidden) {
      closeSettingsModal();
    }
  });
}