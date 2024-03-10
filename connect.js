import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });


export const db = mysql.createConnection({
  port: Number(process.env.DB_PORT),
  host: String(process.env.DB_HOST),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
});

// export const db = mysql.createConnection({
//   port: "8889",
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "test",
// });
