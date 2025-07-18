const db = require("../db/database");

// برو تمام ویدیوها رو چک کن ➜ اگر وضعیت‌ها کامل بود، رسید بساز یا بروزرسانی کن
exports.calculateReceipts = (req, res) => {
  db.get(`SELECT * FROM settings WHERE id = 1`, [], (err, settings) => {
    if (err) throw err;

    db.all(`SELECT * FROM videos`, [], (err2, videos) => {
      if (err2) throw err2;

      videos.forEach((video) => {
        const statuses = [
          video.en_long_status,
          video.fr_long_status,
          video.ar_long_status,
          video.en_short_status,
          video.fr_short_status,
          video.ar_short_status,
        ];

        const allDone = statuses.every((s) => s === 1);

        if (allDone) {
          const total =
            (video.long_duration * settings.long_price) / 60 +
            (video.short_duration * settings.short_price) / 60;

          db.run(
            `INSERT INTO financial_receipts (video_id, total_amount)
                  VALUES (?, ?)
                  ON CONFLICT(video_id) DO UPDATE SET total_amount = excluded.total_amount`,
            [video.id, total]
          );
        }
      });

      res.send("Receipts recalculated!");
    });
  });
};
exports.wallet = (req, res) => {
  db.get(
    `SELECT COALESCE(SUM(amount), 0) as payments FROM payments`,
    [],
    (err, payRow) => {
      if (err) throw err;
      db.get(
        `SELECT COALESCE(SUM(total_amount), 0) as receipts FROM financial_receipts`,
        [],
        (err2, receiptRow) => {
          if (err2) throw err2;
          const balance = payRow.payments - receiptRow.receipts;
          res.send(`Wallet Balance: $${balance.toFixed(2)}`);
        }
      );
    }
  );
};
