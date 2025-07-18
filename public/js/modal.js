document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("uploadModal");
  const closeBtn = document.querySelector(".close-modal");

  document.querySelectorAll(".btn-upload").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const videoId = this.dataset.id;
      document.getElementById("modalVideoId").value = videoId;
      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.remove("active");
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});
