const db = require("./pgdb");

// Get all logins.
const getLogins = function () {
  if (DEBUG) console.log("logins.pg.db.getLogins()");
  return new Promise(function (resolve, reject) {
    const sql = `SELECT userid, username, email, password FROM users;`;
    db.query(sql, [], (err, result) => {
      if (err) {
        console.error("Error in getLogins:", err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// Get login by userid.
const getLogin = function (userid) {
  if (DEBUG) console.log("logins.pg.db.getLogin()");
  return new Promise(function (resolve, reject) {
    const sql = `SELECT userid, username, email, password FROM users WHERE userid = $1`;
    db.query(sql, [userid], (err, result) => {
      if (err) {
        console.error("Error in getLogin:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

// Get user by credentials (username, email, password).
const getUserByCredentials = function (username, email, password) {
  if (DEBUG) console.log("logins.pg.db.getUserByCredentials()");
  return new Promise(function (resolve, reject) {
    const sql = `SELECT userid, username, email, password FROM users WHERE username = $1 AND email = $2 AND password = $3`;
    db.query(sql, [username, email, password], (err, result) => {
      if (err) {
        console.error("Error in getUserByCredentials:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

// Add a new login.
const addLogin = function (username, email, password) {
  if (DEBUG) console.log("logins.pg.db.addLogin()");
  return new Promise(function (resolve, reject) {
    const sql = `INSERT INTO users(username, email, password) \
        VALUES ($1, $2, $3) RETURNING *;`;
    db.query(sql, [username, email, password], (err, result) => {
      if (err) {
        console.error("Error in addLogin:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

// Update an existing login.
const patchLogin = function (userid, username, email, password) {
  if (DEBUG) console.log("logins.pg.db.patchLogin()");
  return new Promise(function (resolve, reject) {
    const sql = `UPDATE users SET username=$2, email=$3, password=$4 WHERE userid=$1 RETURNING *;`;
    db.query(sql, [userid, username, email, password], (err, result) => {
      if (err) {
        console.error("Error in patchLogin:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

// Delete a login by userid.
const deleteLogin = function (userid) {
  if (DEBUG) console.log("logins.pg.db.deleteLogin()");
  return new Promise(function (resolve, reject) {
    const sql = `DELETE FROM users WHERE userid = $1 RETURNING *;`;
    db.query(sql, [userid], (err, result) => {
      if (err) {
        console.error("Error in deleteLogin:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

module.exports = {
  getLogins,
  getLogin,
  getUserByCredentials,
  addLogin,
  deleteLogin,
  patchLogin,
};
