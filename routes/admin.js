// routes/admin.js

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const db = require("../services/pgdb");
const loginsDal = require("../services/pg.logins.db");
const userQueriesDal = require("../services/pg.user_queries.db");

// GET /admin
router.get('/', async (req, res) => {
    try {
        let theLogins = await loginsDal.getLogins();
        let theUserQueries = await userQueriesDal.getUserQueries();

        // Check if theLogins is null or undefined
        if (!theLogins) {
            res.render('503');
            return;
        }

        if (DEBUG) {
            console.table(theLogins);
            console.table(theUserQueries);
        }
        
        // Check if no user is logged in
        if (!req.session.user || !req.session.user.username) {
            res.send("You must be logged in to view this page. <br> <a href='/login'>Login</a>");
            return;
        }

        // Check if the logged-in user is the administrator
        if (req.session.user.username === "NatLane2002") {
            res.render('admin', { logins: theLogins, user: req.session.user, userQueries: theUserQueries });
        } else {
            res.send("You must be logged in as the administrator to view this page. <br> <a href='/'>Home</a>");
        }
    } catch (err) {
        console.error(err);
        res.render('503');
    }
});

module.exports = router;
