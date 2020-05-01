var express = require('express');
var router = express.Router();
const { pool } = require('../dbconfig');


router.get('/',  (req, res)=>{
    res.render('add', {  user:req.user.name, title: "Add new product", isAdd: true});
});

router.post('/', (req, res)=>{
    pool.query(`insert into products (name, price, description) values ($1, $2, $3);`, [req.body.name, req.body.price, req.body.description], (err, results)=>{
        if(err){
            throw err;
        } else{
            res.redirect('/main');
        }
    })
})





module.exports = router;