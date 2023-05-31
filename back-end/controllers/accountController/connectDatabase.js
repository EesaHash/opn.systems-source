const { Client } = require("pg");
// const db = {
//     host: "ec2-34-207-12-160.compute-1.amazonaws.com",
//     user: "fkqtzcrjkybizb",
//     port: 5432,
//     password: "041098df80146c8615cd856429f37d05afe722c42b88f5b728f790f4c6462746",
//     database: "d5daga22vac1v1",
//     ssl: {
//         rejectUnauthorized: false
//     }
// };

const db = {
    host: "database-1.ckidj0yff2bd.us-east-1.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "esa12345",
    database: "test",
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