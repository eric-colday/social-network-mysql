import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import { createError } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return next(createError(err));
    return res.json(data);
  });
};

export const getUser = (req, res, next) => { 
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return next(createError(500, err));
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = async (req, res, next) => {
  const { username, email, name, city, profilePic, coverPic, bio } = req.body;
  const userId = req.params.id;

  try {
    // Vérifier si l'utilisateur, l'email ou le nom existent déjà dans la base de données
    const checkQuery =
      "SELECT * FROM users WHERE (username = ? OR email = ? OR name = ?) AND id != ?";
    db.query(checkQuery, [username, email, name, userId], (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "L'utilisateur, l'email ou le nom existe déjà." });
      } else {
        // Mettre à jour l'utilisateur s'il n'existe pas déjà dans la base de données
        const updateQuery =
          "UPDATE users SET username = ?, email = ?, name = ?,`city`=?,`profilePic`=?,`coverPic`=?,`bio`=?, updatedAt = ? WHERE id = ?";
        db.query(
          updateQuery,
          [
            username,
            email,
            name,
            city,
            profilePic,
            coverPic,
            bio,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userId,
          ],
          (updateErr, result) => {
            if (updateErr) {
              return next(updateErr);
            } else {
              if (result.affectedRows > 0) {
                res
                  .status(200)
                  .json({ message: "Utilisateur mis à jour avec succès." });
              } else {
                next(createError(404).json({
                  message: "Utilisateur non trouvé ou non mis à jour.",
                }));
              }
            }
          }
        );
      }
    });
  } catch (err) {
    next(err);
  } 
};

export const updatePassword = (req, res, next) => {
  const userId = req.params.id;
  const currentPassword = req.body.currentPassword; // Nouveau champ pour le mot de passe actuel
  const newPassword = req.body.newPassword;

  // Requête pour obtenir le mot de passe actuel de l'utilisateur depuis la base de données
  const getPasswordQuery = "SELECT password FROM users WHERE id = ?";
  db.query(getPasswordQuery, [userId], (err, rows) => {
    if (err) {
      return next(err);
    }

    if (rows.length === 0) {
      return next(createError(404, "User not found!"));
    }

    const user = rows[0];
    const storedPassword = user.password; // Mot de passe actuel stocké dans la base de données

    // Vérification si le mot de passe actuel correspond au mot de passe stocké
    const isPasswordCorrect = bcrypt.compareSync(
      currentPassword,
      storedPassword
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    } 
 
    // Hacher le nouveau mot de passe
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Mettre à jour le mot de passe dans la base de données
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateQuery, [hashedPassword, userId], (updateErr, result) => {
      if (updateErr) {
        return next(updateErr);
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Password updated successfully." });
        } else {
          res
            .status(404)
            .json({ message: "User not found or password not updated." });
        }
      }
    });
  });
};

export const deleteUser = (req, res, next) => {
  const userId = req.params.id;
  const deleteQuery = "DELETE FROM users WHERE id = ?";

  db.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      return next(err);
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "User deleted successfully." });
      } else {
        res.status(404).json({ message: "User not found or not deleted." });
      }
    }
  });
};
