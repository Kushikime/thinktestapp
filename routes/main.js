var express = require('express');
var router = express.Router();
const { pool } = require('../dbconfig');




router.get('/', checkNotAuth, async(req, res)=>{

    pool.query(`select * from products;`, (err, results)=>{
        if(err){
            throw err;
        }

        if(results.rows.length>0){
            let products = results.rows;
            res.render('main', { products: products  ,user:req.user.name, title: "Welcome,"+req.user.name, isMain: true});
        } else{
            res.render('main', { noProducts: "There is no products." ,user:req.user.name, title: "Welcome,"+req.user.name, isMain: true});
        }
        
    })




});


router.post('/', checkNotAuth, async(req, res)=>{

    function higherThan(product, min){
        let productPrice = parseInt(product.price.replace(/\D/g, ""), 10);
        return productPrice > parseInt(min, 10);
    }

    function lowerThan(product, max){
        let productPrice = parseInt(product.price.replace(/\D/g, ""), 10);
        return productPrice < parseInt(max, 10);
    }



    if(req.body.keyword.trim() != ''){
        let searchKeyword = '%'+req.body.keyword+'%';


        pool.query(`select * from products where LOWER(name) like LOWER($1)`, [searchKeyword], (err, results)=>{
            if(err){
                throw err;
            }
            
            let products = results.rows;


            let minPrice = req.body.min;
            let maxPrice = req.body.max;
            let sortBy = req.body.sortBy;

            if(minPrice){
                products = products.filter(product => parseInt(product.price.replace(/\D/g, ""), 10) > parseInt(minPrice, 10));
            }

            if(maxPrice){
                products = products.filter(product => parseInt(product.price.replace(/\D/g, ""), 10) < parseInt(maxPrice, 10));
            }

            if(sortBy){
                if(sortBy == 'lowPrice'){

                    
                    products.sort((a, b) => parseInt(a.price.replace(/\D/g, ""), 10) - parseInt(b.price.replace(/\D/g, ""), 10));
                } else if(sortBy == 'highPrice'){
                    products.sort((a, b) => parseInt(b.price.replace(/\D/g, ""), 10) - parseInt(a.price.replace(/\D/g, ""), 10));
                }
            }

            res.render('main', { products: products ,user:req.user.name, title: "Welcome,"+req.user.name, isMain: true});
        });

        
    } else {
        pool.query(`select * from products`, (err, results)=>{
            if(err){
                throw err;
            }
            
            let products = results.rows;

            let minPrice = req.body.min;
            let maxPrice = req.body.max;
            let sortBy = req.body.sortBy;

            if(minPrice){
                products = products.filter(product => parseInt(product.price.replace(/\D/g, ""), 10) > parseInt(minPrice, 10));
            }

            if(maxPrice){
                products = products.filter(product => parseInt(product.price.replace(/\D/g, ""), 10) < parseInt(maxPrice, 10));
            }


            if(sortBy){
                if(sortBy == 'lowPrice'){

                    
                    products.sort((a, b) => parseInt(a.price.replace(/\D/g, ""), 10) - parseInt(b.price.replace(/\D/g, ""), 10));
                } else if(sortBy == 'highPrice'){
                    products.sort((a, b) => parseInt(b.price.replace(/\D/g, ""), 10) - parseInt(a.price.replace(/\D/g, ""), 10));
                }
            }

            res.render('main', { products: products ,user:req.user.name, title: "Welcome,"+req.user.name, isMain: true});
        });
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