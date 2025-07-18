window.deleteVideo = function (id) {
  if (confirm("Are you sure you want to delete this video?")) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/video/delete/${id}`;
    document.body.appendChild(form);
    form.submit();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-video-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.id;
      window.deleteVideo(id);
    });
  });
});

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
  document.querySelectorAll(".delete-plan-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      deletePlan(id);
    });
  });
});

function deletePayment(id) {
  if (confirm("Are you sure you want to delete this payment?")) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/payments/delete/${id}`;
    document.body.appendChild(form);
    form.submit();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-payment-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      deletePayment(id);
    });
  });
});

 document.querySelectorAll(".delete-idea-link").forEach((link) => {
   link.addEventListener("click", (e) => {
     e.preventDefault();
     if (confirm("Are you sure you want to delete this idea?")) {
       const form = document.createElement("form");
       form.method = "POST";
       form.action = `/video-idea/delete/${link.dataset.id}`;
       document.body.appendChild(form);
       form.submit();
     }
   });
 });