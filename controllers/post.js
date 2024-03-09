import { db } from "../connect.js";
import moment from "moment";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const addPost = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      user.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return next(err);
      return res.status(200).json("Post has been created.");
    });
  });
}; 

export const getPosts = (req, res, next) => {
  const q = "SELECT * FROM posts";
  db.query(q, (err, data) => {
    if (err) return next(err);

    return res.status(200).json(data);
  });
};

// export const getPosts = (req, res, next) => {
//   const userId = req.query.userId;
//   const token = req.cookies.access_token;

//   if (!token) {
//     return next(createError(401, "You are not authenticated!"));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return next(createError(403, "Token is not valid!"));
//     }

//     let q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p 
//              JOIN users AS u ON (u.id = p.userId)`;

//     const values = [];

//     if (userId !== undefined) {
//       q += ` WHERE p.userId = ? ORDER BY p.createdAt DESC`;
//       values.push(userId);
//     } else {
//       q += ` LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
//              WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC`;
//       values.push(user.id, user.id);
//     }

//     db.query(q, values, (err, data) => {
//       if (err) {
//         return res.status(500).json(err);
//       }
//       return res.status(200).json(data);
//     });
//   });
// };

export const getPost = (req, res, next) => {
  const postId = req.params.id; // Assurez-vous que votre route contient un paramètre postId

  const q = "SELECT * FROM posts WHERE id = ?";
  db.query(q, [postId], (err, data) => {
    if (err) return next(err);

    if (data.length === 0) {
      return next(createError(404, "Post not found"));
    }

    const post = data[0];
    return res.status(200).json(post);
  });
};

export const updatePost = (req, res, next) => {
  {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));

      const postId = req.params.id;

      const q =
        "UPDATE posts SET `desc` = ?, `img` = ?, `updatedAt` = ? WHERE id = ? AND userId = ?";
      const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        postId,
        user.id,
      ];

      db.query(q, values, (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
          return next(
            createError(
              404,
              "Post not found or you don't have permission to update it"
            )
          );
        }

        return res.status(200).json("Post has been updated.");
      });
    });
  }
};

export const deletePost = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    const postId = req.params.id;

    const q = "DELETE FROM posts WHERE id = ? AND userId = ?";
    const values = [postId, user.id];

    db.query(q, values, (err, result) => {
      if (err) return next(err);

      if (result.affectedRows === 0) {
        return next(
          createError(
            404,
            "Post not found or you don't have permission to delete it"
          )
        );
      }

      return res.status(200).json("Post has been deleted.");
    });
  });
};


export const likePost = (req, res, next) => {
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
