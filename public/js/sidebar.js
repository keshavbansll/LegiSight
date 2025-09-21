// sidebar.js

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar elements
  const sidebarMenu = document.getElementById("sidebar-menu");
  const sidebarTrigger = document.querySelector(".sidebar-trigger");
  const sidebarProfile = document.querySelector(".sidebar-profile");
  const homeLink = document.querySelector(".sidebar-nav a[href='/']");

  // Sidebar hover functionality
  if (sidebarTrigger && sidebarMenu) {
    let hoverTimeout;

    const showSidebar = () => {
      clearTimeout(hoverTimeout);
      sidebarMenu.style.transform = "translate(0, -50%)";
    };

    const hideSidebar = () => {
      hoverTimeout = setTimeout(() => {
        sidebarMenu.style.transform = "translate(-100%, -50%)";
      }, 300); // Small delay to prevent flickering
    };

    // Show sidebar on trigger hover
    sidebarTrigger.addEventListener("mouseenter", showSidebar);

    // Keep sidebar visible when hovering over it
    sidebarMenu.addEventListener("mouseenter", showSidebar);

    // Hide sidebar when leaving both trigger and menu
    sidebarTrigger.addEventListener("mouseleave", hideSidebar);
    sidebarMenu.addEventListener("mouseleave", hideSidebar);
  }

  // Profile click functionality
  if (sidebarProfile) {
    sidebarProfile.addEventListener("click", () => {
      window.location.href = "/profile";
    });
  }

  // Home link functionality (will work on all pages)
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/";
    });
  }

  // Dark mode functionality (global)
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  const applyTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark-mode");
    if (darkModeToggle) {
      if (theme === "dark-mode") {
        darkModeToggle.classList.remove("fa-moon");
        darkModeToggle.classList.add("fa-sun");
      } else {
        darkModeToggle.classList.remove("fa-sun");
        darkModeToggle.classList.add("fa-moon");
      }
    }
  };

  // Apply theme immediately
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    applyTheme(currentTheme);
  }

  // Dark mode toggle functionality
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      let newTheme = document.body.classList.contains("dark-mode")
        ? "light-mode"
        : "dark-mode";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
});
