const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "health_indicators"


});
pool.query ("CREATE DATABASE health_indicators;")
    .then ((Response) => {
    console.log("Database created successfully", Response);
})
.catch((err) => {
    console.error("Error creating database", err);
});

module.exports = pool;

