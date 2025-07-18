const db = require("../db/database");

// ✅ لیست همه ویدیوها
exports.list = (req, res) => {
  db.all(
    `SELECT videos.*, video_ideas.viral_title 
     FROM videos 
     LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("videos/list", {
        title: "Videos",
        videos: rows,
        user: req.session.user,
      });
    }
  );
};

// ✅ فرم افزودن ویدیو (همه ایده‌ها)
exports.createForm = (req, res) => {
  db.all(
    `
    SELECT id, viral_title 
    FROM video_ideas
    WHERE id NOT IN (
      SELECT idea_id FROM videos WHERE idea_id IS NOT NULL
    )
  `,
    [],
    (err, ideas) => {
      if (err) throw err;
      res.render("videos/add", {
        title: "Add Video",
        ideas: ideas,
        user: req.session.user,
      });
    }
  );
};

// ✅ ذخیره‌سازی ویدیو جدید
exports.create = (req, res) => {
  const { idea_id, folder_link, long_duration, short_duration } = req.body;
  db.run(
    `INSERT INTO videos 
     (idea_id, folder_link, long_duration, short_duration,
      en_long_status, fr_long_status, ar_long_status,
      en_short_status, fr_short_status, ar_short_status)
     VALUES (?, ?, ?, ?, 0, 0, 0, 0, 0, 0)`,
    [idea_id, folder_link, long_duration, short_duration],
    (err) => {
      if (err) throw err;
      res.redirect("/video");
    }
  );
};

// ✅ فرم ویرایش — ایده ویدیو «قفل شده»
exports.editForm = (req, res) => {
  const id = req.params.id;

  db.get(
    `SELECT videos.*, video_ideas.viral_title 
     FROM videos 
     LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
     WHERE videos.id = ?`,
    [id],
    (err, video) => {
      if (err) throw err;
      res.render("videos/edit", {
        title: "Edit Video",
        video: video,
        user: req.session.user,
      });
    }
  );
};

// ✅ بروزرسانی
exports.update = (req, res) => {
  const id = req.params.id;
  const {
    idea_id,
    folder_link,
    long_duration,
    short_duration,
    en_long_status,
    fr_long_status,
    ar_long_status,
    en_short_status,
    fr_short_status,
    ar_short_status,
  } = req.body;

  db.run(
    `UPDATE videos 
     SET idea_id = ?, folder_link = ?, long_duration = ?, short_duration = ?,
         en_long_status = ?, fr_long_status = ?, ar_long_status = ?,
         en_short_status = ?, fr_short_status = ?, ar_short_status = ?
     WHERE id = ?`,
    [
      idea_id,
      folder_link,
      long_duration,
      short_duration,
      en_long_status ? 1 : 0,
      fr_long_status ? 1 : 0,
      ar_long_status ? 1 : 0,
      en_short_status ? 1 : 0,
      fr_short_status ? 1 : 0,
      ar_short_status ? 1 : 0,
      id,
    ],
    (err) => {
      if (err) throw err;
      res.redirect("/video");
    }
  );
};

// ✅ حذف
exports.delete = (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM videos WHERE id = ?`, [id], (err) => {
    if (err) throw err;
    db.run(
      `DELETE FROM financial_receipts WHERE video_id = ?`,
      [id],
      (err2) => {
        if (err2) throw err2;
        res.redirect("/video");
      }
    );
  });
};

