import mysql from "mysql";


export const db = mysql.createConnection({
  port: "8889",
  host: "localhost",
  user: "root",
  password: "root",
  database: "test",
});
