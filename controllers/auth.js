import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import { createError } from "../utils/error.js";

export const register = (req, res) => {
  //CHECK USER IF EXISTS
  const checkQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkQuery, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (`username`,`email`,`password`,`name`,`isAdmin`,`createdAt`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      req.body.isAdmin,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    ];

    db.query(insertQuery, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], async (err, rows) => {
    if (err) return next(err);

    if (rows.length === 0) {
      console.log(createError(404, "User not found!"));
      return next(createError(404, "User not found!"));
    } else {
      const user = rows[0];

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        console.log(createError(400, "Wrong password or username!"));
        return next(createError(400, "Wrong password or username!"));
      } else {
        const token = jwt.sign(
          { id: user.id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );

        const { password, isAdmin, ...otherDetails } = user;

        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ ...otherDetails });
      }
    }
  });
};

export const logout = (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json("User has been logged out.");
  } catch (err) {
    next(err);
  } 
};

