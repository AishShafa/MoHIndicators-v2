const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "Moh1234",
    host: "localhost",
    port: 5432,
    database: "health_indicators"


});
pool.connqueryect((err) => { 
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the PostgreSQL database");
    }               

});
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};