const bcrypt = require("bcrypt");
const db = require("../db/database");

exports.loginPage = (req, res) => {
  res.render("login", {
    layout: false, // ⬅ بدون Layout چون نیازی به Sidebar نداره
    title: "Login", // ⬅ برای جلوگیری از ReferenceError
  });
};

exports.registerPage = (req, res) => {
  res.render("register", {
    layout: false, // ⬅ بدون Layout
    title: "Register",
  });
};

exports.register = (req, res) => {
  const { username, password, role } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.send("Error hashing password.");
    db.run(
      `INSERT INTO users(username, password, role) VALUES (?, ?, ?)`,
      [username, hash, role],
      (err) => {
        if (err) {
          return res.send("User already exists.");
        }
        res.redirect("/auth/login");
      }
    );
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.send("Database error.");
    if (!user) return res.send("User not found.");
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { username: user.username, role: user.role };
        res.redirect("/dashboard"); // ⬅ پیشنهاد بهتر: برو مستقیم به داشبورد
      } else {
        res.send("Invalid password.");
      }
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
