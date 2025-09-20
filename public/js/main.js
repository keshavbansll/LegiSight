document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.querySelector(".btn-upload");
  const signInModal = document.getElementById("signInModal");
  const signUpModal = document.getElementById("signUpModal");
  const uploadModal = document.getElementById("uploadModal");
  const showSignUpBtn = document.getElementById("showSignUp");
  const showSignInBtn = document.getElementById("showSignIn");
  const closeButtons = document.querySelectorAll(".close-button");
  const uploadBtn = document.querySelector(".btn-upload");
  const signInModal = document.getElementById("signInModal");
  const signUpModal = document.getElementById("signUpModal");
  const uploadModal = document.getElementById("uploadModal");
  const showSignUpBtn = document.getElementById("showSignUp");
  const showSignInBtn = document.getElementById("showSignIn");
  const showSignInHeaderBtn = document.getElementById("showSignInHeader"); // Add this line
  const closeButtons = document.querySelectorAll(".close-button");

  // Function to show a modal
  const showModal = (modal) => {
    modal.style.display = "flex";
  };

  // Function to hide a modal
  const hideModal = (modal) => {
    modal.style.display = "none";
  };

  // Show upload modal when 'Upload Document' is clicked
  if (uploadBtn) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal(uploadModal);
    });
  }

  // Handle modal closing
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = e.target.closest(".modal");
      if (modal) {
        hideModal(modal);
      }
    });
  });

  // Switch from Sign In to Sign Up
  if (showSignUpBtn) {
    showSignUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(signInModal);
      showModal(signUpModal);
    });
  }

  // Show Sign In modal from header
  if (showSignInHeaderBtn) {
    showSignInHeaderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal(signInModal);
    });
  }

  // Switch from Sign Up to Sign In
  if (showSignInBtn) {
    showSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(signUpModal);
      showModal(signInModal);
    });
  }

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
});

// Function to check if an element is in the viewport
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Function to handle the scroll animation
const handleScrollAnimation = () => {
  const readySectionContent = document.querySelector(".ready-content");
  if (readySectionContent) {
    if (isElementInViewport(readySectionContent)) {
      readySectionContent.classList.add("is-visible");
    }
  }
};

// Listen for scroll events
window.addEventListener("scroll", handleScrollAnimation);

// Run the function once on page load in case the element is already in view
handleScrollAnimation();
