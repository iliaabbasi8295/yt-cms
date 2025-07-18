const db = require("../db/database");

// ✔️ لیست پرداخت‌ها
exports.list = (req, res) => {
  db.all(`SELECT * FROM payments ORDER BY date DESC`, [], (err, rows) => {
    if (err) throw err;
    res.render("payment/list", {
      // <--- دقیقاً همون فولدر: payment
      title: "Payments",
      payments: rows,
      user: req.session.user,
    });
  });
};

// ✔️ فرم افزودن پرداخت
exports.createForm = (req, res) => {
  res.render("payment/add", {
    // <--- دقیقاً همون فولدر: payment
    title: "Add Payment",
    user: req.session.user,
  });
};

// ✔️ ثبت پرداخت جدید
exports.create = (req, res) => {
  const { date, amount, note } = req.body;
  db.run(
    `INSERT INTO payments (date, amount, note) VALUES (?, ?, ?)`,
    [date, amount, note],
    (err) => {
      if (err) throw err;
      res.redirect("/payments");
    }
  );
};

// ✔️ فرم ویرایش پرداخت
exports.editForm = (req, res) => {
  db.get(
    `SELECT * FROM payments WHERE id = ?`,
    [req.params.id],
    (err, payment) => {
      if (err) throw err;
      res.render("payment/edit", {
        // <--- دقیقاً همون فولدر: payment
        title: "Edit Payment",
        payment: payment,
        user: req.session.user,
      });
    }
  );
};

// ✔️ بروزرسانی پرداخت
exports.update = (req, res) => {
  const { date, amount, note } = req.body;
  db.run(
    `UPDATE payments SET date = ?, amount = ?, note = ? WHERE id = ?`,
    [date, amount, note, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect("/payments");
    }
  );
};

// ✔️ حذف پرداخت
exports.delete = (req, res) => {
  db.run(`DELETE FROM payments WHERE id = ?`, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect("/payments");
  });
};
