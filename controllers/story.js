import { db } from "../connect.js";
import moment from "moment";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const addStory = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "INSERT INTO stories(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      user.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return next(err);
      return res.status(200).json("Story has been created.");
    });
  });
};

export const deleteStory = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const storyId = req.params.id;

    const q = "DELETE FROM stories WHERE id = ? AND userId = ?";
    db.query(q, [storyId, user.id], (err, data) => {
      if (err) return next(err);

      if (data.affectedRows === 0) {
        return next(createError(404, "Story not found"));
      }

      return res.status(200).json("Story has been deleted.");
    });
  });
};

// export const getStories = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return next(createError(401, "You are not authenticated!"));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(createError(403, "Token is not valid!"));

//     // const q = "SELECT * FROM stories";
//     const q =
//       "SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId) LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`";
//     db.query(q, [user.id], (err, data) => {
//       if (err) return next(err);

//       return res.status(200).json(data);
//     });
//   });
// };

export const getAllStories = (req, res, next) => {
  const q = "SELECT * FROM stories";
  db.query(q, (err, data) => {
    if (err) return next(err);

    return res.status(200).json(data);
  });
};


