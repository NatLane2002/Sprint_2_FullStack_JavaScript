// routes/search.js

const express = require('express');
const router = express.Router();
const db = require("../services/pgdb")
const personalComputersDal = require("../services/pg.personal_computers.db");
const userQueriesDal = require("../services/pg.user_queries.db");
const mongoDal = require("../services/m.computer_accessories.db");

// GET /search
router.get('/', (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            const user = req.session.user;
            res.render('search', { user: user });
        }
    } catch (err) {
        res.render(503);
    }
});

// POST /search
router.post('/', async (req, res) => {
    try {
        if (DEBUG) console.log("searching...");

        const { query, databaseType } = req.body;

        let postgresResults;
        let mongoResults;

        if (databaseType === 'postgresql' || databaseType === 'both') {
            // PostgreSQL search
            postgresResults = await personalComputersDal.searchPersonalComputers(query);
            if (DEBUG) console.log("searching postgresql...");
        }

        if (databaseType === 'mongodb' || databaseType === 'both') {
            // MongoDB search
            mongoResults = await mongoDal.searchComputerAccessories(query);
            if (DEBUG) console.log("searching mongodb...");
        }

        // Log the user query
        const userid = req.session.user ? req.session.user.userid : null;
        await userQueriesDal.addUserQuery(userid, query);

        // Render the search results page with the obtained search results
        const totalResults = (postgresResults ? postgresResults.length : 0) + (mongoResults ? mongoResults.length : 0);
        if (DEBUG) console.log("searchResults:", totalResults);
        res.render('searchResults', { postgresResults, mongoResults, databaseType, totalResults });
    } catch (error) {
        console.error(error);
        res.render('503'); // Render an error page if something goes wrong
    }
});

module.exports = router;
