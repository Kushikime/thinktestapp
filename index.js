require('dotenv').config()
const express = require('express');
const { pool } = require('./dbconfig');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initPassport = require('./psConfig');



const app = express();





app.set('view engine', 'ejs');
app.set('views', 'views');


//Setting up static files
app.use(express.static(__dirname + '/public'));

//Setting up urlencoding
app.use(express.urlencoded({
    extended: false
}));


//CREATE USERS TABEL IF NOT EXIST
pool.query(`select * from users`, (err, results)=>{
    if(err){
        pool.query('create table users (id bigserial primary key not null, name varchar(200) not null, email varchar(200) not null, password varchar(200) not null, unique (email));')
    }

    console.log("Users table exist");
});



//CREATE PRODUCTS TABLE IF NNOT EXIST
pool.query(`select * from products`, (err, results)=>{
    if(err){
        pool.query('create table products (id bigserial primary key not null, name varchar(200) not null, price varchar(200) not null, description varchar(300) not null);')
    }

    console.log("Products table exist");
});




//SETTING UP NEEDED STUFF FOR AUTHORIZATION
initPassport(passport);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





//ROUTES
app.get('/', (req, res)=>{
    //CHECK IF USER IS LOGED IN IF NOT REDIRECT TO LOGIN PAGE
    res.redirect('/login');
});

app.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success_msg", "Successfuly logged out"),
    res.redirect('/login');
})


//ADDING CUSTOM ROUTERS
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const mainRouter = require('./routes/main');
const addRouter = require('./routes/add');

//SET APP TO USE THEM
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/main', mainRouter);
app.use('/add', addRouter);








//SETTING UP SERVER LSITENING
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server has been started on localhost: ${PORT}`);
});
