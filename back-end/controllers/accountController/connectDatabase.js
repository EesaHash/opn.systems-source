require ("dotenv").config();
const { Client } = require("pg");

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

const connection = new Client(db);

const connectDatabase = _ => {
    connection.connect((err) => {
        if (err) console.log(err);
        else console.log("Connected to database! ", db.host);
    });
};

module.exports = { connection, connectDatabase }