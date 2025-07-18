const db = require("../db/database");

// لیست همه ایده‌ها
exports.list = (req, res) => {
  db.all(`SELECT * FROM video_ideas`, [], (err, rows) => {
    if (err) throw err;
    res.render("videoIdeas/list", {
      title: "Video Ideas",
      ideas: rows,
      user: req.session.user,
    });
  });
};

// فرم افزودن
exports.createForm = (req, res) => {
  res.render("videoIdeas/add", {
    title: "Add Video Idea",
    user: req.session.user,
  });
};

// ذخیره ایده جدید
exports.create = (req, res) => {
  const { details, why, category, viral_title, thumbnail_desc } = req.body; // ✅ تغییر نام فیلدها
  db.run(
    `INSERT INTO video_ideas (details, why, category, viral_title, thumbnail_desc)
     VALUES (?, ?, ?, ?, ?)`,
    [details, why, category, viral_title, thumbnail_desc],
    (err) => {
      if (err) throw err;
      res.redirect("/video-idea");
    }
  );
};

// فرم ویرایش
exports.editForm = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM video_ideas WHERE id = ?`, [id], (err, idea) => {
    if (err) throw err;
    res.render("videoIdeas/edit", {
      title: "Edit Video Idea",
      idea: idea,
      user: req.session.user,
    });
  });
};

// بروزرسانی ایده
exports.update = (req, res) => {
  const id = req.params.id;
  const { details, why, category, viral_title, thumbnail_desc } = req.body; // ✅ تغییر نام فیلدها
  db.run(
    `UPDATE video_ideas 
     SET details = ?, why = ?, category = ?, viral_title = ?, thumbnail_desc = ?
     WHERE id = ?`,
    [details, why, category, viral_title, thumbnail_desc, id],
    (err) => {
      if (err) throw err;
      res.redirect("/video-idea");
    }
  );
};

// حذف ایده
exports.delete = (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM video_ideas WHERE id = ?`, [id], (err) => {
    if (err) throw err;
    res.redirect("/video-idea");
  });
};
