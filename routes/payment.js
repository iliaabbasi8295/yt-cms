const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentsController");

function ensureAuthenticated(req, res, next) {
  if (
    req.session.user &&
    (req.session.user.role === "Admin" || req.session.user.role === "Moderator")
  ) {
    return next();
  }
  res.redirect("/auth/login");
}

// مسیرهای هماهنگ با فولدر payment
router.get("/", ensureAuthenticated, controller.list);
router.get("/create", ensureAuthenticated, controller.createForm);
router.post("/create", ensureAuthenticated, controller.create);
router.get("/edit/:id", ensureAuthenticated, controller.editForm);
router.post("/edit/:id", ensureAuthenticated, controller.update);
router.post("/delete/:id", ensureAuthenticated, controller.delete);

module.exports = router;
