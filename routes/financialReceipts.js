const express = require("express");
const router = express.Router();
const controller = require("../controllers/financialReceiptsController");

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "Admin") {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/", ensureAdmin, controller.listReceipts);
router.post("/delete/:id", ensureAdmin, controller.deleteReceipt); // ✔️ حذف رسید
router.post("/recalculate", ensureAdmin, controller.recalculate); // ✔️ رفرش

module.exports = router;
