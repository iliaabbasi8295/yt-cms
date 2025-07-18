const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts"); // اضافه شد
const app = express();
const PORT = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts); // اضافه شد
app.set("layout", "layout"); // Layout پیش‌فرض
app.use(express.static("public"));
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
app.use("/payments", paymentsRoutes);
const settingsRoutes = require("./routes/settings");
const financeRoutes = require("./routes/finance");
const receiptsRoutes = require("./routes/financialReceipts");
const dashboardRoutes = require("./routes/dashboard");
const videoReportsRoutes = require("./routes/videoReports");

app.use("/dashboard", dashboardRoutes);
app.use("/videoReports", videoReportsRoutes);

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/video-idea", videoIdeaRoutes);
app.use("/video", videoRoutes);
app.use("/planner", plannerRoutes);
app.use("/settings", settingsRoutes);
app.use("/finance", financeRoutes);
app.use("/financial-receipts", receiptsRoutes);
app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
