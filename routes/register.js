var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../dbconfig');





//REGISTER ROUTER
router.get('/', checkAuth, (req, res)=>{


    
    //RETURN REGISTER PAGE
    res.render('register', {title: "Registration"});
});

router.post('/', async (req, res)=>{
    //DATA VALIDATION
    
    

    let {name, email, password} = req.body;


    let errors = [];

    //Just check if all fields are filled
    if(!name || !email || !password){
        errors.push({message: "Enter all fields."});
    }



    //password(min 6 symbols)
    if(password.length < 6){
        errors.push({
            message: "Password should be at least 6 characters."
        })
    }

    if(errors.length > 0){
        res.render('register', {title: "Registration", errors})
    } else{
        let hashedPass = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results)=>{
                if(err){
                    throw err;
                }

                //email(must be unique)
                if(results.rows.length > 0){
                    errors.push({
                        message: "This email is already registered."
                    })

                    res.render('register', {title: "Registration", errors})
                } else{
                    pool.query(`INSERT INTO users (name, email, password)
                                VALUES ($1, $2, $3)
                                RETURNING id, password`,
                                [name, email, hashedPass],
                                (err, results)=>{
                                    if (err){
                                        throw err;
                                    }

                                    req.flash("success_msg", "You are registered now, please log in.");
                                    res.redirect('/login');
                                }
                    );
                }
            }
        )
    }
});



function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/main')
    }
    next();
}

function checkNotAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}




module.exports = router;