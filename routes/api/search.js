// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../../services/pgdb');
const personalComputersDal = require("../../services/pg.personal_computers.db");
const computerAccessoriesDal = require("../../services/m.computer_accessories.db");
const userQueriesDal = require("../../services/pg.user_queries.db");

// GET /api/personal_computers
router.get('/personal_computers', async (req, res) => {
    if (DEBUG) console.log("personal_computers.GET");
    try {
        // Make sure the user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const results = await personalComputersDal.getPersonalComputers();
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/search/personal_computers/:keyword
router.get('/search/personal_computers/:keyword', async (req, res) => {
    if (DEBUG) console.log("personal_computers.GET");
    try {

        // Make sure a user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const query = req.params.keyword;

        const results = await personalComputersDal.searchPersonalComputers(query);

        // Log the user query
        const userid = req.session.user ? req.session.user.userid : null;
        await userQueriesDal.addUserQuery(userid, query);

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/computer_accessories
router.get('/computer_accessories', async (req, res) => {
    if (DEBUG) console.log("computer_accessories.GET");
    try {
        // Make sure the user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const results = await computerAccessoriesDal.getComputerAccessories();
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/search/computer_accessories/:keyword
router.get('/search/computer_accessories/:keyword', async (req, res) => {
    if (DEBUG) console.log("computer_accessories.GET");
    try {

        // Make sure a user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const query = req.params.keyword;

        const results = await computerAccessoriesDal.searchComputerAccessories(query);

        // Log the user query
        const userid = req.session.user ? req.session.user.userid : null;
        await userQueriesDal.addUserQuery(userid, query);

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/search/:keyword (search both databases)
router.get('/search/:keyword', async (req, res) => {
    if (DEBUG) console.log("search.GET");
    try {

        // Make sure a user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const query = req.params.keyword;

        const postgresResults = await personalComputersDal.searchPersonalComputers(query);
        const mongoResults = await computerAccessoriesDal.searchComputerAccessories(query);

        // Log the user query
        const userid = req.session.user ? req.session.user.userid : null;
        await userQueriesDal.addUserQuery(userid, query);

        return res.json({ postgresResults, mongoResults });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;