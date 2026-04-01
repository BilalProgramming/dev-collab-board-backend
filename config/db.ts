import mysql from 'mysql2/promise'

export const connectDb=mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "project_management",
})