const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Serve static files from the `public` folder
app.use(express.static('public'));

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, }));
app.use(methodOverride('_method'));

// Set up the session middleware
app.use(session({
    secret: 'super_secret',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to set common variables
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Home page
app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('home', { message: "", user: user });
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
    });

// Logout POST
app.post('/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});

// Routers

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// // api routers

const searchApiRouter = require('./routes/api/search');
app.use('/api', searchApiRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});