require("dotenv").config();
const {Pool} = require("pg");
const pool = new Pool({user:process.env.DB_USER,host:process.env.DB_HOST,database:process.env.DB_NAME,password:process.env.DB_PASSWORD,port:process.env.DB_PORT});
module.exports = pool ;
console.log("DB_PASSWORD exits:",process.env.DB_PASSWORD !== undefined);
console.log("DB_PASSWORD type:",typeof process.env.DB_PASSWORD)