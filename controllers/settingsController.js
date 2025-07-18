const db = require("../db/database");

exports.showSettings = (req, res) => {
  db.get(`SELECT * FROM settings WHERE id = 1`, [], (err, row) => {
    if (err) throw err;

    if (!row) {
      db.run(
        `INSERT INTO settings (id, long_price, short_price) VALUES (1, 13, 9)`,
        [],
        (err2) => {
          if (err2) throw err2;
          res.redirect("/settings");
        }
      );
    } else {
      res.render("settings/index", { settings: row, user: req.session.user });
    }
  });
};

exports.updateSettings = (req, res) => {
  const { long_price, short_price } = req.body;
  db.run(
    `UPDATE settings SET long_price = ?, short_price = ? WHERE id = 1`,
    [long_price, short_price],
    (err) => {
      if (err) throw err;
      res.redirect("/settings");
    }
  );
};
