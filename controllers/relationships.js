import { db } from "../connect.js";
import moment from "moment";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const addRelationships = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "INSERT INTO relationships(`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [user.id, req.body.followedUserId];

    db.query(q, [values], (err, data) => {
      if (err) return next(err);
      return res.status(200).json("following");
    });
  });
};

export const deleteRelationships = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [user.id, req.body.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};

export const getRelationships = (req, res, next) => {
  const q = "SELECT * FROM relationships";
  db.query(q, (err, data) => {
    if (err) return next(err);

    return res.status(200).json(data); 
  });
};
