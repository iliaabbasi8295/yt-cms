document.addEventListener("DOMContentLoaded", () => {
  class Modal {
    constructor(modalId) {
      this.modal = document.getElementById(modalId);
      this.closeBtn = this.modal.querySelector(".modal-close");
      this.init();
    }

    init() {
      // بستن با کلیک روی X
      this.closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

      // بستن با کلیک بیرون
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });

      // بستن با کلید ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    }

    open() {
      this.modal.classList.add("active");
      document.body.classList.add("modal-open");
      this.modal.querySelectorAll(".form-group").forEach((group, index) => {
        group.style.setProperty("--order", index);
      });
    }

    close() {
      this.modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  const uploadModal = new Modal("uploadModal");

  document.querySelectorAll(".btn-upload").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const videoId = this.dataset.id;
      document.getElementById("modalVideoId").value = videoId;
      uploadModal.open();
    });
  });

  // اعتبارسنجی
  document
    .querySelector(".upload-form")
    .addEventListener("submit", function (e) {
      const inputs = this.querySelectorAll("input[required]");
      let valid = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = "#ff6b6b";
          valid = false;
        } else {
          input.style.borderColor = "#3a3a4a";
        }
      });
      if (!valid) e.preventDefault();
    });
});
