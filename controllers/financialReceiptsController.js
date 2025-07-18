const db = require("../db/database");

exports.listReceipts = (req, res) => {
  db.all(
    `SELECT financial_receipts.*, videos.folder_link, video_ideas.viral_title
     FROM financial_receipts
     LEFT JOIN videos ON financial_receipts.video_id = videos.id
     LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("financialReceipts/list", {
        receipts: rows,
        user: req.session.user,
      });
    }
  );
};

exports.recalculate = (req, res) => {
  db.run(`DELETE FROM financial_receipts`, [], (err) => {
    if (err) throw err;

    db.get(
      `SELECT long_price, short_price FROM settings WHERE id = 1`,
      [],
      (err2, settings) => {
        if (err2) throw err2;

        const longPrice = parseFloat(settings.long_price);
        const shortPrice = parseFloat(settings.short_price);

        db.all(
          `
        SELECT *
        FROM videos
        WHERE en_long_status = 1 AND fr_long_status = 1 AND ar_long_status = 1
          AND en_short_status = 1 AND fr_short_status = 1 AND ar_short_status = 1
      `,
          [],
          (err3, videos) => {
            if (err3) throw err3;

            const insertStmt = db.prepare(`
          INSERT OR REPLACE INTO financial_receipts (video_id, total_amount)
          VALUES (?, ?)
        `);

            videos.forEach((video) => {
              // ✅ محاسبه هزینه جدید فقط بر اساس زمان
              const longAmount = (video.long_duration * longPrice) / 60;
              const shortAmount = (video.short_duration * shortPrice) / 60;
              const totalAmount = longAmount + shortAmount;

              insertStmt.run([video.id, totalAmount]);
            });

            insertStmt.finalize();
            res.redirect("/financial-receipts");
          }
        );
      }
    );
  });
};

// DELETE Receipt
exports.deleteReceipt = (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM financial_receipts WHERE id = ?`, [id], (err) => {
    if (err) throw err;
    res.redirect("/financial-receipts");
  });
};
