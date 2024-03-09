import { db } from "../connect.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const addLike = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [user.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
}; 

export const getLikes = (req, res, next) => {
  const q = "SELECT * FROM likes";
  db.query(q, (err, data) => {
    if (err) return next(err);

    return res.status(200).json(data);
  });
};

export const deleteLike = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Token is not valid!");

    let likeId = req.params.id;

    const q = "DELETE FROM likes WHERE id = ? AND userId = ?";
    const values = [likeId, user.id];

    db.query(q, values, (err, data) => {
      if (err) return next(err);

      if (data.affectedRows === 0) {
        return res.status(404).json("Like not found");
      }

      return res.status(200).json("Like has been deleted.");
    });
  });
};
