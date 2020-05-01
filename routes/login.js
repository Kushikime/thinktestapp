var express = require('express');
var router = express.Router();
const passport = require('passport');



//LOGIN ROUTER
router.get('/', checkAuth, (req, res)=>{
    res.render('login', {title: "Login"});
});

router.post('/', passport.authenticate('local', {
        successRedirect: "/main",
        //IF ALL OK REDIRECT TO MAIN PAGE
        failureRedirect: "/login",
        failureFlash: true
    }) 
);




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