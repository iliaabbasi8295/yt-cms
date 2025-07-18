const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// ✅ پورت داینامیک برای محیط‌های ابری مثل Render
const PORT = process.env.PORT || 3000;

// تنظیمات عمومی
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// روترها
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const videoIdeaRoutes = require("./routes/videoidea");
const videoRoutes = require("./routes/video");
const plannerRoutes = require("./routes/planner");
const paymentsRoutes = require("./routes/payment");
const settingsRoutes = require("./routes/settings");
const financeRoutes = require("./routes/finance");
const receiptsRoutes = require("./routes/financialReceipts");
const dashboardRoutes = require("./routes/dashboard");
const videoReportsRoutes = require("./routes/videoReports");

// استفاده از روترها
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/video-idea", videoIdeaRoutes);
app.use("/video", videoRoutes);
app.use("/planner", plannerRoutes);
app.use("/payments", paymentsRoutes);
app.use("/settings", settingsRoutes);
app.use("/finance", financeRoutes);
app.use("/financial-receipts", receiptsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/videoReports", videoReportsRoutes);

// اجرای سرور
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
