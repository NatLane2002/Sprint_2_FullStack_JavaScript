const db = require("./pgdb");

const addUserQuery = function (user_id, query) {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO user_queries (user_id, keyword) VALUES ($1, $2) RETURNING *;`;
        db.query(sql, [user_id, query], (err, result) => {
            if (err) {
                console.error("Error in addUserQuery:", err);
                reject(err);
            } else {
                resolve(result.rows[0]);
            }
        });
    });
}

const getUserQueries = function () {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM user_queries`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error in getUserQueries:", err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

module.exports = {
    addUserQuery,
    getUserQueries,
};