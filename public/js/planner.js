
  function deletePlan(id) {
    if (confirm("Are you sure you want to delete this plan?")) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/planner/delete/${id}`;
      document.body.appendChild(form);
      form.submit();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-plan-link").forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const id = this.dataset.id;
        deletePlan(id);
      });
    });
  });
