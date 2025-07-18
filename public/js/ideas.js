window.deleteIdea = function (id) {
  if (confirm("Are you sure you want to delete this idea?")) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/video-idea/delete/${id}`;
    document.body.appendChild(form);
    form.submit();
  }
};
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-idea-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.id;
      window.deleteIdea(id);
    });
  });
});
