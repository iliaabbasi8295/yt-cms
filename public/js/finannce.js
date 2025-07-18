// حذف رسید مالی
document.querySelectorAll(".delete-receipt-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this receipt?")) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/financial-receipts/delete/${link.dataset.id}`;
      document.body.appendChild(form);
      form.submit();
    }
  });
});
