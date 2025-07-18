const db = require("../db/database");

exports.index = (req, res) => {
  // ✅ کل تعداد ایده‌ها
  db.get(`SELECT COUNT(*) as ideas FROM video_ideas`, [], (err, ideaRow) => {
    if (err) throw err;

    // ✅ کل تعداد ویدیوها
    db.get(`SELECT COUNT(*) as videos FROM videos`, [], (err2, videoRow) => {
      if (err2) throw err2;

      // ✅ آماده برای آپلود (وضعیت‌ها کامل + هنوز Scheduled یا Done نیست)
      db.get(
        `
        SELECT COUNT(*) as readyToUpload
        FROM videos
        LEFT JOIN planners ON planners.video_id = videos.id
        WHERE en_long_status = 1 AND fr_long_status = 1 AND ar_long_status = 1
          AND en_short_status = 1 AND fr_short_status = 1 AND ar_short_status = 1
          AND (planners.publish_status IS NULL OR (planners.publish_status != 'Scheduled' AND planners.publish_status != 'Done'))
        `,
        [],
        (err3, readyRow) => {
          if (err3) throw err3;

          // ✅ Scheduled
          db.get(
            `SELECT COUNT(*) as scheduled FROM planners WHERE publish_status = 'Scheduled'`,
            [],
            (err4, schedRow) => {
              if (err4) throw err4;

              // ✅ Uploaded (Done)
              db.get(
                `SELECT COUNT(*) as uploaded FROM planners WHERE publish_status = 'Done'`,
                [],
                (err5, doneRow) => {
                  if (err5) throw err5;

                  // ✅ In Progress (ویدیوهایی که هنوز کامل نشده‌اند)
                  db.get(
                    `
                    SELECT COUNT(*) as inProgress
                    FROM videos
                    WHERE NOT (
                      en_long_status = 1 AND fr_long_status = 1 AND ar_long_status = 1
                      AND en_short_status = 1 AND fr_short_status = 1 AND ar_short_status = 1
                    )
                    `,
                    [],
                    (err6, progressRow) => {
                      if (err6) throw err6;

                      // ✅ لیست آماده برای آپلود با جزئیات
                      db.all(
                        `
                        SELECT videos.*,
                               video_ideas.viral_title,
                               planners.publish_date,
                               planners.publish_status
                        FROM videos
                        LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
                        LEFT JOIN planners ON planners.video_id = videos.id
                        WHERE en_long_status = 1 AND fr_long_status = 1 AND ar_long_status = 1
                          AND en_short_status = 1 AND fr_short_status = 1 AND ar_short_status = 1
                          AND (planners.publish_status IS NULL OR (planners.publish_status != 'Scheduled' AND planners.publish_status != 'Done'))
                        `,
                        [],
                        (err7, readyList) => {
                          if (err7) throw err7;

                          // ✅ موجودی کیف پول
                          db.get(
                            `SELECT COALESCE(SUM(amount), 0) as payments FROM payments`,
                            [],
                            (err8, paymentsRow) => {
                              if (err8) throw err8;

                              db.get(
                                `SELECT COALESCE(SUM(total_amount), 0) as receipts FROM financial_receipts`,
                                [],
                                (err9, receiptsRow) => {
                                  if (err9) throw err9;

                                  const walletBalance =
                                    parseFloat(paymentsRow.payments || 0) -
                                    parseFloat(receiptsRow.receipts || 0);

                                  res.render("dashboard/index", {
                                    title: "Dashboard",
                                    stats: {
                                      ideas: ideaRow.ideas,
                                      videos: videoRow.videos,
                                      readyToUpload: readyRow.readyToUpload,
                                      scheduled: schedRow.scheduled,
                                      uploaded: doneRow.uploaded,
                                      inProgress: progressRow.inProgress,
                                    },
                                    readyVideos: readyList,
                                    walletBalance: walletBalance,
                                    user: req.session.user,
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};
