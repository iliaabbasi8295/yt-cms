const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoReportsController");

function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/auth/login");
}

// /videoReports -> همه ویدیوها
router.get("/", ensureAuthenticated, controller.allVideos);

// مسیرهای گروه‌بندی
router.get("/all", ensureAuthenticated, controller.allVideos);
router.get("/ready", ensureAuthenticated, controller.readyToUpload);
router.get("/scheduled", ensureAuthenticated, controller.scheduled);
router.get("/uploaded", ensureAuthenticated, controller.uploaded);
router.get("/in-progress", ensureAuthenticated, controller.inProgress);

module.exports = router;
