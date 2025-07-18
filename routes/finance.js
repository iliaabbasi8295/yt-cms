const express = require("express");
const router = express.Router();
const controller = require("../controllers/financeController");

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "Admin") {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/calculate", ensureAdmin, controller.calculateReceipts);
router.get("/wallet", ensureAdmin, controller.wallet);

module.exports = router;
