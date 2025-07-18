const db = require("../db/database");

// 📌 لیست برنامه‌ریزی‌ها (تغییر ندارد)
exports.list = (req, res) => {
  const sql = `
    SELECT 
      planners.id,
      planners.video_id,
      planners.publish_date,
      planners.publish_status,
      planners.youtube_long_en,
      planners.youtube_long_fr,
      planners.youtube_long_ar,
      planners.youtube_short_en,
      planners.youtube_short_fr,
      planners.youtube_short_ar,
      planners.extra_note,
      video_ideas.viral_title
    FROM planners
    LEFT JOIN videos ON planners.video_id = videos.id
    LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) throw err;
    res.render("planner/list", {
      title: "Planner List",
      planners: rows,
      user: req.session.user,
    });
  });
};

// 📌 فرم افزودن پلن آماده
exports.createForm = (req, res) => {
  const sql = `
    SELECT 
      videos.id, 
      video_ideas.viral_title
    FROM videos
    LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
    WHERE 
      en_long_status = 1 AND fr_long_status = 1 AND ar_long_status = 1 AND 
      en_short_status = 1 AND fr_short_status = 1 AND ar_short_status = 1
      AND videos.id NOT IN (SELECT video_id FROM planners WHERE video_id IS NOT NULL)
  `;
  db.all(sql, [], (err, videos) => {
    if (err) throw err;
    res.render("planner/add", {
      title: "Add Planner",
      videos: videos,
      user: req.session.user,
    });
  });
};

// 📌 ذخیره پلن
exports.create = (req, res) => {
  const {
    video_id,
    publish_date,
    publish_status,
    youtube_long_en,
    youtube_long_fr,
    youtube_long_ar,
    youtube_short_en,
    youtube_short_fr,
    youtube_short_ar,
    extra_note,
  } = req.body;

  db.run(
    `
    INSERT INTO planners (
      video_id, publish_date, publish_status,
      youtube_long_en, youtube_long_fr, youtube_long_ar,
      youtube_short_en, youtube_short_fr, youtube_short_ar,
      extra_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      video_id,
      publish_date,
      publish_status,
      youtube_long_en,
      youtube_long_fr,
      youtube_long_ar,
      youtube_short_en,
      youtube_short_fr,
      youtube_short_ar,
      extra_note,
    ],
    (err) => {
      if (err) throw err;
      res.redirect("/planner");
    }
  );
};

// 📌 فرم ویرایش (بدون تغییر)
exports.editForm = (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      planners.*,
      videos.id as video_id,
      video_ideas.viral_title
    FROM planners
    LEFT JOIN videos ON planners.video_id = videos.id
    LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
    WHERE planners.id = ?
  `;

  db.get(sql, [id], (err, planner) => {
    if (err) throw err;
    if (!planner) return res.redirect("/planner");

    res.render("planner/edit", {
      title: "Edit Planner",
      planner: planner,
      user: req.session.user,
    });
  });
};

// 📌 بروزرسانی
exports.update = (req, res) => {
  const id = req.params.id;
  const {
    publish_date,
    publish_status,
    youtube_long_en,
    youtube_long_fr,
    youtube_long_ar,
    youtube_short_en,
    youtube_short_fr,
    youtube_short_ar,
    extra_note,
  } = req.body;

  db.run(
    `
    UPDATE planners
    SET publish_date = ?, publish_status = ?,
        youtube_long_en = ?, youtube_long_fr = ?, youtube_long_ar = ?,
        youtube_short_en = ?, youtube_short_fr = ?, youtube_short_ar = ?,
        extra_note = ?
    WHERE id = ?
    `,
    [
      publish_date,
      publish_status,
      youtube_long_en,
      youtube_long_fr,
      youtube_long_ar,
      youtube_short_en,
      youtube_short_fr,
      youtube_short_ar,
      extra_note,
      id,
    ],
    (err) => {
      if (err) throw err;
      res.redirect("/planner");
    }
  );
};

// 📌 حذف
exports.delete = (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM planners WHERE id = ?`, [id], (err) => {
    if (err) throw err;
    res.redirect("/planner");
  });
};

// 📌 آپلود از طریق داشبورد
exports.upload = (req, res) => {
  const {
    video_id,
    youtube_long_en,
    youtube_long_fr,
    youtube_long_ar,
    youtube_short_en,
    youtube_short_fr,
    youtube_short_ar,
    publish_status,
  } = req.body;

  db.get(
    `SELECT id FROM planners WHERE video_id = ?`,
    [video_id],
    (err, row) => {
      if (err) throw err;

      if (row) {
        db.run(
          `UPDATE planners SET
          youtube_long_en = ?, youtube_long_fr = ?, youtube_long_ar = ?,
          youtube_short_en = ?, youtube_short_fr = ?, youtube_short_ar = ?,
          publish_status = ?
        WHERE video_id = ?`,
          [
            youtube_long_en,
            youtube_long_fr,
            youtube_long_ar,
            youtube_short_en,
            youtube_short_fr,
            youtube_short_ar,
            publish_status,
            video_id,
          ]
        );
      } else {
        db.run(
          `INSERT INTO planners (
          video_id, publish_date, publish_status,
          youtube_long_en, youtube_long_fr, youtube_long_ar,
          youtube_short_en, youtube_short_fr, youtube_short_ar
        ) VALUES (?, date('now'), ?, ?, ?, ?, ?, ?, ?)`,
          [
            video_id,
            publish_status,
            youtube_long_en,
            youtube_long_fr,
            youtube_long_ar,
            youtube_short_en,
            youtube_short_fr,
            youtube_short_ar,
          ]
        );
      }

      res.redirect("/dashboard");
    }
  );
};
