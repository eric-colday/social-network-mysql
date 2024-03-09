import { db } from "../connect.js";
import moment from "moment";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const addComment = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "INSERT INTO comments(`desc`, `img`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      user.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return next(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const getComments = (req, res, next) => {
  const q = "SELECT * FROM comments";
  db.query(q, (err, data) => {
    if (err) return next(err);

    return res.status(200).json(data);
  });
};

export const getComment = (req, res, next) => {
  const commentId = req.params.id; // Assurez-vous que votre route contient un paramètre commentId

  const q = "SELECT * FROM comments WHERE id = ?";
  db.query(q, [commentId], (err, data) => {
    if (err) return next(err);

    if (data.length === 0) {
      return next(createError(404, "Comment not found"));
    }

    const comment = data[0];
    return res.status(200).json(comment);
  });
};

export const updateComment = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "UPDATE comments SET `desc` = ?, `img` = ?, `updatedAt` = ? WHERE id = ? AND userId = ?";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.params.id,
      user.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return next(err);

      return res.status(200).json("Comment has been updated.");
    });
  });
};

export const deleteComment = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q = "DELETE FROM comments WHERE id = ? AND userId = ?";
    const values = [req.params.id, user.id];

    db.query(q, values, (err, data) => {
      if (err) return next(err);

      return res.status(200).json("Comment has been deleted.");
    });
  });
};
