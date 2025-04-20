
const mysql = require("mysql2")

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mahesh@1527',
    database: 'hospital_db'
})

db.connect((err) => {
    if(err){
        console.error(`MySql connection Failed - ${err}`)
        return
    }
    console.log(`MYSQL connection successful as ID - ${db.threadId}`)
})

module.exports = db



