// main.js

document.addEventListener("DOMContentLoaded", () => {
  // Modal buttons and elements
  const joinNowBtn = document.querySelector(".btn-sign-in");
  const showSignUpBtn = document.getElementById("showSignUp");
  const showSignInBtn = document.getElementById("showSignIn");
  const showJoinNowBtn = document.getElementById("showJoinNow");
  const closeButtons = document.querySelectorAll(".close-button");

  const signInModal = document.getElementById("signInModal");
  const signUpModal = document.getElementById("signUpModal");

  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  const chatInput = document.querySelector(".chat-input");
  const chatFileInput = document.getElementById("chatFileInput");

  const headerOptions = document.getElementById("header-options");
  const sidebarNav = document.getElementById("sidebar-nav");
  const sidebarProfile = document.querySelector(".sidebar-profile");
  const sidebarMenu = document.getElementById("sidebar-menu");

  const initialViewContainer = document.getElementById(
    "initial-view-container"
  );
  const documentViewContainer = document.getElementById(
    "document-view-container"
  );
  const documentPreviewContainer = document.getElementById(
    "document-preview-container"
  );
  const documentPreviewBoxes = document.querySelectorAll(
    ".document-preview-box"
  );
  const deletePreviewBtns = document.querySelectorAll(".delete-preview-btn");
  const resultsContent = document.getElementById("results-content");
  const documentNameDisplay = document.getElementById("document-name");

  const documentPreviewSection = document.getElementById(
    "document-preview-section"
  );
  const documentPreviewCanvas = document.getElementById(
    "document-preview-canvas"
  );
  const documentPreviewName = document.querySelector(".document-preview-name");
  let isPreviewAnimating = false;

  const chatModes = document.querySelectorAll(".chat-mode-option");

  // Add event listener for Join Now link
  if (showJoinNowBtn) {
    showJoinNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/pricing";
    });
  }

  // Custom Alert Modal Elements
  const customAlert = document.getElementById("customAlert");
  const customAlertMessage = document.getElementById("customAlertMessage");
  const customAlertClose = document.querySelector(".custom-alert-close");

  // Sidebar elements
  const sidebarClose = document.getElementById("sidebar-close");

  // Resizable Panels
  const resizer = document.getElementById("resizer");
  const documentViewer = document.querySelector(".document-viewer");
  const analysisResults = document.querySelector(".analysis-results");

  // New elements
  const animatedWord = document.getElementById("animated-word");
  const closeDocumentViewBtn = document.getElementById(
    "close-document-view-btn"
  );
  const heroTextHighlight = document.querySelector(".fading-text-highlight");

  let uploadedFiles = [];
  let currentMode = "summarize";
  let isResizing = false;
  let typingEffectTimeout = null;
  let summarySection = null;

  // PDF.js worker setup
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

  const typingWords = ["simplified", "LegiSight.."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentWord = typingWords[wordIndex];
    if (isDeleting) {
      animatedWord.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      animatedWord.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      if (wordIndex === 0) {
        // Only delete after the first word
        isDeleting = true;
        setTimeout(type, 1500); // Pause before deleting
      } else {
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        setTimeout(type, 500); // Pause before typing next word
      }
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      setTimeout(type, 500); // Pause before typing
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  };

  // Delay the start of the typing animation until the fade-up animation is done
  if (heroTextHighlight) {
    heroTextHighlight.addEventListener(
      "animationend",
      () => {
        type();
      },
      { once: true }
    );
  }

  const hideUIElements = () => {
    if (headerOptions) headerOptions.classList.add("hidden");
    if (sidebarNav) sidebarNav.classList.add("hidden");
    if (sidebarProfile) sidebarProfile.classList.add("hidden");
    if (sidebarMenu) {
      // Completely hide sidebar instead of just resizing
      sidebarMenu.style.transform = "translate(-100%, -50%)";
      sidebarMenu.style.width = "280px";
    }
    // Also hide the sidebar trigger
    const sidebarTrigger = document.querySelector(".sidebar-trigger");
    if (sidebarTrigger) {
      sidebarTrigger.style.display = "none";
    }
  };

  const showUIElements = () => {
    if (headerOptions) headerOptions.classList.remove("hidden");
    if (sidebarNav) sidebarNav.classList.remove("hidden");
    if (sidebarProfile) sidebarProfile.classList.remove("hidden");
    if (sidebarMenu) {
      sidebarMenu.style.width = "280px";
      sidebarMenu.style.transform = "translate(-100%, -50%)";
    }
    // Show the sidebar trigger again
    const sidebarTrigger = document.querySelector(".sidebar-trigger");
    if (sidebarTrigger) {
      sidebarTrigger.style.display = "block";
    }
  };

  // --- Modal Functions ---
  const showModal = (modal) => {
    if (modal) {
      modal.style.display = "flex";
    }
  };

  const hideModal = (modal) => {
    if (modal) {
      modal.style.display = "none";
    }
  };

  // Fixed: Use the correct button selector
  if (joinNowBtn) {
    joinNowBtn.addEventListener("click", (e) => {
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

  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = e.target.closest(".modal");
      if (modal) {
        hideModal(modal);
      }
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === signInModal) {
      hideModal(signInModal);
    } else if (e.target === signUpModal) {
      hideModal(signUpModal);
    } else if (e.target === customAlert) {
      hideModal(customAlert);
    }
  });

  // Custom Alert Handler
  const showAlert = (message) => {
    if (customAlertMessage && customAlert) {
      customAlertMessage.textContent = message;
      customAlert.classList.remove("hidden");
    }
  };

  if (customAlertClose) {
    customAlertClose.addEventListener("click", () => {
      customAlert.classList.add("hidden");
    });
  }

  // --- Chat Modes Logic ---
  const defaultTexts = {
    summarize: "summarise this document",
    compare: "compare both of them",
    "contract-check": "check the contract for any discrepancies",
  };

  // Remove default active state on load
  document.addEventListener("DOMContentLoaded", () => {
    chatModes.forEach((m) => m.classList.remove("active"));
  });

  chatModes.forEach((mode) => {
    mode.addEventListener("click", () => {
      chatModes.forEach((m) => m.classList.remove("active"));
      mode.classList.add("active");
      currentMode = mode.dataset.mode;
      if (chatInput) {
        chatInput.value = defaultTexts[currentMode] || "";
      }
      updatePreviewBoxes();
    });
  });

  const updatePreviewBoxes = () => {
    documentPreviewBoxes.forEach((box, index) => {
      if (index < (currentMode === "compare" ? 2 : 1)) {
        box.classList.remove("hidden");
        if (uploadedFiles[index]) {
          const nameElement = box.querySelector(".document-name");
          if (nameElement) {
            nameElement.textContent = uploadedFiles[index].file.name;
          }
          const canvas = box.querySelector(".pdf-preview-canvas");
          if (canvas) {
            renderPDFPreview(uploadedFiles[index].file, canvas);
          }
        } else {
          const nameElement = box.querySelector(".document-name");
          if (nameElement) {
            nameElement.textContent = "";
          }
        }
      } else {
        box.classList.add("hidden");
      }
    });
  };

  // --- Document and Chat Logic ---
  const showDocumentView = () => {
    hideUIElements();
    if (initialViewContainer) initialViewContainer.classList.add("hidden");
    if (documentViewContainer) documentViewContainer.classList.remove("hidden");
  };

  const resetToHomeView = () => {
    if (documentViewContainer) {
      documentViewContainer.classList.add("hidden");
      documentViewContainer.classList.remove("full-screen"); // Add this line
    }
    if (initialViewContainer) initialViewContainer.classList.remove("hidden");

    // Reset chat interfaces
    const chatInterfaceContainer = document.getElementById(
      "chat-interface-container"
    );
    const analysisChatInterface = document.getElementById(
      "analysis-chat-interface"
    );

    if (chatInterfaceContainer)
      chatInterfaceContainer.classList.remove("hidden");
    if (analysisChatInterface) analysisChatInterface.classList.add("hidden");

    // Reset integrated preview
    if (documentPreviewSection) {
      documentPreviewSection.classList.remove("show", "animate-to-side");
      documentPreviewSection.classList.add("hidden");
    }
    isPreviewAnimating = false;

    // Reset chat modes
    chatModes.forEach((m) => m.classList.remove("active"));
    if (chatInput) chatInput.value = "";

    showUIElements();
    uploadedFiles = [];

    documentPreviewBoxes.forEach((box) => {
      box.classList.add("hidden", "fade-in");
      box.style.width = "";
      box.style.transform = "";
      box.classList.remove("animate-to-side");
      const nameElement = box.querySelector(".document-name");
      if (nameElement) {
        nameElement.textContent = "";
      }
      const deleteBtn = box.querySelector(".delete-preview-btn");
      if (deleteBtn) {
        deleteBtn.classList.add("hidden");
      }
    });

    if (resultsContent) {
      resultsContent.innerHTML = "";
    }
    if (typingEffectTimeout) {
      clearTimeout(typingEffectTimeout);
    }
    if (summarySection) {
      summarySection.innerHTML = "";
      summarySection = null;
    }
  };

  if (closeDocumentViewBtn) {
    closeDocumentViewBtn.addEventListener("click", resetToHomeView);
  }

  const renderPDFPreview = async (file, canvas) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const pdfData = new Uint8Array(fileReader.result);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error("Error rendering PDF preview:", error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const renderFullDocument = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const pdfData = new Uint8Array(fileReader.result);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        const pdfViewer = document.getElementById("pdf-viewer");
        if (pdfViewer) {
          pdfViewer.innerHTML = "";

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            // Calculate scale based on container width
            const containerWidth = pdfViewer.offsetWidth - 20; // Account for padding
            const viewport = page.getViewport({ scale: 1 });
            const scale = containerWidth / viewport.width;

            const scaledViewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            pdfViewer.appendChild(canvas);

            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport,
            };
            await page.render(renderContext).promise;
          }
        }
      } catch (error) {
        console.error("Error rendering full document:", error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const typeTextEffect = (element, text, delay = 50) => {
    let i = 0;
    const words = text.split(" ");
    element.innerHTML = "";

    function type() {
      if (i < words.length) {
        element.innerHTML += (i > 0 ? " " : "") + words[i];
        i++;
        typingEffectTimeout = setTimeout(type, delay);
      }
    }
    type();
  };

  const showAnalysisResults = async () => {
    if (resultsContent) {
      resultsContent.innerHTML = ""; // Clear previous content
    }
    const analysisData = [
      {
        title: "Document Type",
        content: `<p>This is a legal document, specifically a Lease Agreement.</p>`,
      },
      {
        title: "Summarization",
        fullText:
          "This is a detailed summarization of the provided document. The document outlines a comprehensive lease agreement between a landlord and a tenant. It specifies the duration of the lease, the exact amount of monthly rent, and the payment schedule. Furthermore, it clarifies the responsibilities for property maintenance and repairs, ensuring both parties are aware of their obligations. The agreement also includes clauses related to the security deposit, specifying the conditions under which it can be used or refunded. A crucial section is dedicated to the rules and regulations regarding the use of the property, including any restrictions on subleasing or modifications. This summary is intended to provide a thorough overview of the document's key provisions, helping the user understand the core terms without having to read the entire text.",
      },
      {
        title: "Details",
        content: `<p><b>Parties:</b> Landlord (Jane Doe), Tenant (John Smith)</p><p><b>Property Address:</b> 123 Main Street, Anytown, USA</p><p><b>Lease Term:</b> 12 months, starting October 1, 2024</p><p><b>Monthly Rent:</b> $1500, due on the 1st of each month</p>`,
      },
      {
        title: "Pros & Cons",
        content: `<p><b>Pros:</b></p><ul><li>Clearly defines responsibilities.</li><li>Standard, fair market terms.</li></ul><p><b>Cons:</b></p><ul><li>No early termination clause.</li><li>Pet policy is not explicitly mentioned.</li></ul>`,
      },
      {
        title: "Security Check",
        content: `<p><b>Risk Level:</b> Low</p><p>No unusual or predatory clauses were found. The document appears to be standard and fair. Always consult a legal professional for final review.</p>`,
      },
      {
        title: "Proof",
        content: `<p>All analysis is based on the provided document content. The summarization and details are derived directly from the clauses in the lease agreement.</p>`,
      },
    ];

    for (let i = 0; i < analysisData.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for effect
      const section = document.createElement("div");
      section.className = "analysis-section";

      if (analysisData[i].title === "Summarization") {
        section.innerHTML = `<h3>${analysisData[i].title}</h3><p class="summary-text"></p>`;
        if (resultsContent) {
          resultsContent.appendChild(section);
        }
        summarySection = section.querySelector(".summary-text");
        if (summarySection) {
          typeTextEffect(summarySection, analysisData[i].fullText);
        }
      } else {
        section.innerHTML = `<h3>${analysisData[i].title}</h3>${analysisData[i].content}`;
        if (resultsContent) {
          resultsContent.appendChild(section);
        }
      }
      section.style.animationDelay = `${i * 0.2}s`;
    }
  };

  const showIntegratedPreview = async (file) => {
    if (
      documentPreviewSection &&
      documentPreviewCanvas &&
      documentPreviewName
    ) {
      documentPreviewName.textContent = file.name;
      documentPreviewSection.classList.remove("hidden");

      // Small delay for smooth appearance
      setTimeout(() => {
        documentPreviewSection.classList.add("show");
      }, 100);

      await renderPDFPreview(file, documentPreviewCanvas);
    }
  };

  const hideIntegratedPreview = () => {
    if (documentPreviewSection) {
      documentPreviewSection.classList.remove("show");
      setTimeout(() => {
        documentPreviewSection.classList.add("hidden");
      }, 500);
    }
  };

  const animatePreviewToSide = () => {
    return new Promise(async (resolve) => {
      if (documentPreviewSection && !isPreviewAnimating) {
        isPreviewAnimating = true;
        documentPreviewSection.classList.add("animate-to-side");

        setTimeout(async () => {
          hideUIElements();
          if (initialViewContainer)
            initialViewContainer.classList.add("hidden");
          if (documentViewContainer) {
            documentViewContainer.classList.remove("hidden");
            documentViewContainer.classList.add("full-screen"); // Add this line
          }

          // Clear the animated preview canvas and render full document in pdf-viewer
          if (uploadedFiles[0]) {
            // Clear the preview canvas
            if (documentPreviewCanvas) {
              const ctx = documentPreviewCanvas.getContext("2d");
              ctx.clearRect(
                0,
                0,
                documentPreviewCanvas.width,
                documentPreviewCanvas.height
              );
            }

            // Render full document in the main pdf viewer
            await renderFullDocument(uploadedFiles[0].file);
          }

          resolve();
        }, 1200);
      } else {
        resolve();
      }
    });
  };

  if (chatFileInput) {
    chatFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const allowedTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (allowedTypes.includes(file.type)) {
          if (currentMode === "compare" && uploadedFiles.length >= 2) {
            showAlert("You can only upload two documents for comparison.");
            return;
          }
          uploadedFiles.push({ file });
          showIntegratedPreview(file);
          updatePreviewBoxes();
        } else {
          showAlert("Invalid document. Please upload a PDF or DOCX file.");
        }
      }
    });
  }

  deletePreviewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const previewBox = e.target.closest(".document-preview-box");
      const index = previewBox.dataset.index;
      uploadedFiles.splice(index, 1);
      if (uploadedFiles.length === 0) {
        resetToHomeView();
      } else {
        updatePreviewBoxes();
      }
    });
  });

  documentPreviewBoxes.forEach((box) => {
    box.addEventListener("mouseenter", () => {
      if (!box.classList.contains("hidden")) {
        const deleteBtn = box.querySelector(".delete-preview-btn");
        if (deleteBtn) {
          deleteBtn.classList.remove("hidden");
        }
      }
    });
    box.addEventListener("mouseleave", () => {
      const deleteBtn = box.querySelector(".delete-preview-btn");
      if (deleteBtn) {
        deleteBtn.classList.add("hidden");
      }
    });
  });

  if (chatInput) {
    chatInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        if (uploadedFiles.length === 0) {
          showAlert("Please upload a document first.");
          return;
        }
        if (currentMode === "compare" && uploadedFiles.length < 2) {
          showAlert("Please upload a second document for comparison.");
          return;
        }

        // Hide original chat interface and show analysis interface
        const chatInterfaceContainer = document.getElementById(
          "chat-interface-container"
        );
        const analysisChatInterface = document.getElementById(
          "analysis-chat-interface"
        );

        if (chatInterfaceContainer)
          chatInterfaceContainer.classList.add("hidden");
        if (analysisChatInterface)
          analysisChatInterface.classList.remove("hidden");

        // Clear the input
        chatInput.value = "";

        // Animate preview to side first
        await animatePreviewToSide();

        // Then show analysis results and render full document
        showAnalysisResults();
        if (uploadedFiles[0]) {
          renderFullDocument(uploadedFiles[0].file);
        }
        if (documentNameDisplay && uploadedFiles[0]) {
          documentNameDisplay.textContent = uploadedFiles[0].file.name;
        }
      }
    });
  }

  // Resizable Panels Logic
  if (resizer) {
    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      document.body.style.cursor = "col-resize";
    });
  }

  window.addEventListener("mousemove", (e) => {
    if (
      !isResizing ||
      !documentViewContainer ||
      !documentViewer ||
      !analysisResults
    )
      return;
    const containerWidth = documentViewContainer.offsetWidth;
    const newDocViewerWidth =
      e.clientX - documentViewer.getBoundingClientRect().left;
    const newDocViewerPercentage = (newDocViewerWidth / containerWidth) * 100;

    if (newDocViewerPercentage > 10 && newDocViewerPercentage < 90) {
      documentViewer.style.flexBasis = `${newDocViewerPercentage}%`;
      analysisResults.style.flexBasis = `${100 - newDocViewerPercentage}%`;
    }
  });

  window.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.cursor = "default";
  });
});
