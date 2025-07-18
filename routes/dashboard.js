const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");

function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/auth/login");
}

router.get("/", ensureAuthenticated, controller.index);

module.exports = router;
