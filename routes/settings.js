const express = require("express");
const router = express.Router();
const controller = require("../controllers/settingsController");

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "Admin") {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/", ensureAdmin, controller.showSettings);
router.post("/", ensureAdmin, controller.updateSettings);

module.exports = router;
