const db = require("./pgdb");

// Get all personal computers.
const getPersonalComputers = function () {
return new Promise(function (resolve, reject) {
    const sql = `SELECT id, cpu, gpu, ram, hard_drive, ssd, motherboard, cpu_cooler FROM personal_computers;`;
    db.query(sql, [], (err, result) => {
    if (err) {
        console.error("Error in getPersonalComputers:", err);
        reject(err);
    } else {
        resolve(result.rows);
    }
    });
});
};

// Search personal computers by user query.
const searchPersonalComputers = function (query) {
return new Promise(function (resolve, reject) {
    const sql = `
    SELECT id, cpu, gpu, ram, hard_drive, ssd, motherboard, cpu_cooler
    FROM personal_computers
    WHERE
        cpu ILIKE $1 OR
        gpu ILIKE $1 OR
        ram ILIKE $1 OR
        hard_drive ILIKE $1 OR
        ssd ILIKE $1 OR
        motherboard ILIKE $1 OR
        cpu_cooler ILIKE $1;
    `;
    db.query(sql, [`%${query}%`], (err, result) => {
    if (err) {
        console.error("Error in searchPersonalComputers:", err);
        reject(err);
    } else {
        resolve(result.rows);
    }
    });
});
};

module.exports = {
    getPersonalComputers,
    searchPersonalComputers,
};
