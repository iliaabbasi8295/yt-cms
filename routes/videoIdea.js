const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoIdeaController");

function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/auth/login");
}

router.get("/", ensureAuthenticated, controller.list);
router.get("/create", ensureAuthenticated, controller.createForm);
router.post("/create", ensureAuthenticated, controller.create);
router.get("/edit/:id", ensureAuthenticated, controller.editForm);
router.post("/edit/:id", ensureAuthenticated, controller.update);
router.post("/delete/:id", ensureAuthenticated, controller.delete);

module.exports = router;
