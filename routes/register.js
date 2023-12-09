// routes/register.js

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const db = require("../services/pgdb")
const loginsDal = require("../services/pg.logins.db");

// GET /register
router.get('/', (req, res) => {
    try {
        res.render('register');
    } catch (err) {
        res.render('503');
    }
});

// POST /register
router.post('/', async (req, res) => {
    if (DEBUG) console.log("register.POST");
    try {
        if (req.body.password == req.body.confirmPassword) {
            console.log("Passwords match");
            console.log(req.body.username, req.body.email, req.body.password);
            
            // Attempt to add the login
            await loginsDal.addLogin(req.body.username, req.body.email, req.body.password);
            
            // Redirect with success message
            res.redirect('/?message=You have successfully registered!');
        } else {
            res.send("Passwords do not match. <br> <a class='login' href='/register'>Back</a>");
        }
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'username') {
            // Unique constraint violation, handle accordingly
            res.send("Username already exists. Please choose a different username. <br> <a class='login' href='/register'>Back</a>");
        } else {
            // Other error, log it and render a 503 page
            console.error(error);
            res.render('503');
        }
    }
});


module.exports = router;
