const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebarOverlay");
const mainWrapper = document.querySelector("#mainWrapper");
const openSidebarBtn = document.querySelector("#open-btn");
const mobileSidebarMedia = window.matchMedia("(max-width: 900px)");

function isMobileViewport() {
  return mobileSidebarMedia.matches;
}

export function openSidebar() {
  if (!sidebar) return;
  openSidebarBtn.hidden = true;

  if (isMobileViewport()) {
    mainWrapper?.classList.add("main-wrapper--sidebar-open");
    sidebar.classList.add("sidebar--open");
    sidebarOverlay.hidden = false;
    document.body.classList.add("body--sidebar-open");
    return;
  }

  mainWrapper?.classList.remove("main-wrapper--sidebar-collapsed");
  sidebar.classList.remove("sidebar--collapsed");
}

export function closeSidebar() {
  if (!sidebar) return;
  openSidebarBtn.hidden = false;

  if (isMobileViewport()) {
    mainWrapper?.classList.remove("main-wrapper--sidebar-open");
    sidebar.classList.remove("sidebar--open");

    if (sidebarOverlay) {
      sidebarOverlay.hidden = true;
    }

    document.body.classList.remove("body--sidebar-open");
    return;
  }

  mainWrapper?.classList.add("main-wrapper--sidebar-collapsed");
  sidebar.classList.add("sidebar--collapsed");
}

export function toggleSidebar() {
  if (!sidebar) return;

  if (isMobileViewport()) {
    sidebar.classList.contains("sidebar--open") ? closeSidebar() : openSidebar();
    return;
  }

  sidebar.classList.contains("sidebar--collapsed") ? openSidebar() : closeSidebar();
}

function syncSidebarWithViewport() {
  if (!sidebar) return;

  if (isMobileViewport()) {
    sidebar.classList.remove("sidebar--collapsed");
    mainWrapper?.classList.remove("main-wrapper--sidebar-collapsed");

    if (!sidebar.classList.contains("sidebar--open") && sidebarOverlay) {
      sidebarOverlay.hidden = true;
    }

    return;
  }

  sidebar.classList.remove("sidebar--open");
  mainWrapper?.classList.remove("main-wrapper--sidebar-open");

  if (sidebarOverlay) {
    sidebarOverlay.hidden = true;
  }

  document.body.classList.remove("body--sidebar-open");
}

export function initSidebar() {
  openSidebarBtn.hidden = true;

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-sidebar-open]")) openSidebar();
    if (event.target.closest("[data-sidebar-close]")) closeSidebar();
    if (event.target.closest("[data-sidebar-toggle]")) toggleSidebar();
  });

  sidebarOverlay?.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobileViewport()) {
      closeSidebar();
    }
  });

  syncSidebarWithViewport();
  mobileSidebarMedia.addEventListener("change", syncSidebarWithViewport);
}