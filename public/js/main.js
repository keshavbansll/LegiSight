document.addEventListener("DOMContentLoaded", () => {
  // Modal buttons and elements
  const uploadBtn = document.querySelector(".btn-upload");
  const showSignInHeaderBtn = document.getElementById("showSignInHeader");
  const showSignUpBtn = document.getElementById("showSignUp");
  const showSignInBtn = document.getElementById("showSignIn");
  const closeButtons = document.querySelectorAll(".close-button");
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");

  const signInModal = document.getElementById("signInModal");
  const signUpModal = document.getElementById("signUpModal");
  const uploadModal = document.getElementById("uploadModal");

  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  // --- Dark Mode Logic ---
  const applyTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark-mode");
    if (theme === "dark-mode") {
      darkModeToggle.classList.remove("fa-moon");
      darkModeToggle.classList.add("fa-sun");
    } else {
      darkModeToggle.classList.remove("fa-sun");
      darkModeToggle.classList.add("fa-moon");
    }
  };

  // Check for saved theme preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    applyTheme(currentTheme);
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      let newTheme = document.body.classList.contains("dark-mode")
        ? "light-mode"
        : "dark-mode";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // --- Modal Functions ---
  const showModal = (modal) => {
    modal.style.display = "flex";
  };

  const hideModal = (modal) => {
    modal.style.display = "none";
  };

  // Event listeners for modal triggers
  if (uploadBtn) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal(uploadModal);
    });
  }

  if (showSignInHeaderBtn) {
    showSignInHeaderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal(signInModal);
    });
  }

  if (showSignUpBtn) {
    showSignUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(signInModal);
      showModal(signUpModal);
    });
  }

  if (showSignInBtn) {
    showSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(signUpModal);
      showModal(signInModal);
    });
  }

  // Event listeners to close modals
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = e.target.closest(".modal");
      if (modal) {
        hideModal(modal);
      }
    });
  });

  // Hide modal if user clicks outside of it
  window.addEventListener("click", (e) => {
    if (e.target === signInModal) {
      hideModal(signInModal);
    } else if (e.target === signUpModal) {
      hideModal(signUpModal);
    } else if (e.target === uploadModal) {
      hideModal(uploadModal);
    }
  });

  // --- File Type Validation ---
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ];
      const file = fileInput.files[0];
      if (file && !allowedTypes.includes(file.type)) {
        alert(
          "Invalid file type. Please upload a PDF, DOCX, XLSX, PPTX, or TXT file."
        );
        fileInput.value = ""; // Clear the file input
      }
    });
  }

  // --- Upload Form Submission Logic ---
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("File uploaded successfully!");
          hideModal(uploadModal);
        } else {
          const result = await response.text();
          alert("Upload failed: " + result);
        }
      } catch (error) {
        console.error("Error during upload:", error);
        alert("An error occurred during upload.");
      }
    });
  }
});

// Animate "Ready to Simplify" section on scroll
const readyContent = document.querySelector(".ready-content");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.3, // Trigger when 30% of the element is visible
  }
);

if (readyContent) {
  observer.observe(readyContent);
}
