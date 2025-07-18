const db = require("../db/database");

// Helper Query: JOIN همه دیتای لازم
const baseQuery = `
  SELECT videos.*, video_ideas.viral_title, video_ideas.category, 
         planners.publish_date, planners.publish_status
  FROM videos
  LEFT JOIN video_ideas ON videos.idea_id = video_ideas.id
  LEFT JOIN planners ON planners.video_id = videos.id
`;

exports.allVideos = (req, res) => {
  db.all(baseQuery, [], (err, rows) => {
    if (err) throw err;
    res.render("videoReports/list", { title: "All Videos", videos: rows });
  });
};

exports.readyToUpload = (req, res) => {
  db.all(
    `${baseQuery}
    WHERE videos.en_long_status = 1 AND videos.fr_long_status = 1 AND videos.ar_long_status = 1
      AND videos.en_short_status = 1 AND videos.fr_short_status = 1 AND videos.ar_short_status = 1`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("videoReports/list", {
        title: "Ready to Upload",
        videos: rows,
      });
    }
  );
};

exports.scheduled = (req, res) => {
  db.all(
    `${baseQuery}
    WHERE planners.publish_status = 'Scheduled'`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("videoReports/list", {
        title: "Scheduled Videos",
        videos: rows,
      });
    }
  );
};

exports.uploaded = (req, res) => {
  db.all(
    `${baseQuery}
    WHERE planners.publish_status = 'Done'`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("videoReports/list", {
        title: "Uploaded Videos",
        videos: rows,
      });
    }
  );
};

exports.inProgress = (req, res) => {
  db.all(
    `${baseQuery}
    WHERE NOT (
      videos.en_long_status = 1 AND videos.fr_long_status = 1 AND videos.ar_long_status = 1
      AND videos.en_short_status = 1 AND videos.fr_short_status = 1 AND videos.ar_short_status = 1
    )`,
    [],
    (err, rows) => {
      if (err) throw err;
      res.render("videoReports/list", {
        title: "In Progress Videos",
        videos: rows,
      });
    }
  );
};
