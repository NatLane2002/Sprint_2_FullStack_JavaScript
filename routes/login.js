// routes/login.js

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const db = require("../services/pgdb")
const loginsDal = require("../services/pg.logins.db");

// GET /login
router.get('/', async (req, res) => {
    try {
        // Dont render the page if the user is already logged in
        if (req.session.user) {
            res.redirect('/');
            return;
        } else {
            res.render('login', { message: "" });
        }
    } catch (err) {
        res.render('503');
    }
});

// POST /login
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the provided credentials exists
        const user = await loginsDal.getUserByCredentials(username, email, password);

        if (user) {
            // User exists, proceed with the login
            // For example, you might set a session variable and redirect to the home page
            req.session.user = user;
            res.redirect('/');
        } else {
            // User not found, display an error message
            res.render('login', { message: "Invalid username, email, or password." });
        }
    } catch (error) {
        // Handle other errors, log them, and render a 503 page
        console.error(error);
        res.render('503');
    }
});

// GET /login/:id
router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get user by id
        const user = await loginsDal.getLogin(id);

        // DEBUG
        if (DEBUG) console.log("user:", user);

        // Render the edit page with the user data
        res.render('editUser', { user });
    } catch (error) {
        console.error(error);
        res.render('503');
    }
});

// PATCH /login/:id
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Update user information
        const updatedUser = await loginsDal.patchLogin(id, username, email, password);

        // Save this updated user in the session variable
        req.session.user = updatedUser;
        
        res.json({ message: 'User successfully updated', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.render('503');
    }
});

// DELETE /login/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user and set session variable in parallel
        const [result] = await Promise.all([
            loginsDal.deleteLogin(id),
            new Promise(resolve => {
                // Set session variable to null after a short delay
                setTimeout(() => {
                    // Only set session variable to null if the user being deleted matches the logged-in user
                    if (req.session.user && req.session.user.userid === id) {
                        req.session.user = null;
                    }
                    resolve();
                }, 100);
            })
        ]);

    } catch (error) {
        console.error(error);
        res.render('503');
    }
});

module.exports = router;
