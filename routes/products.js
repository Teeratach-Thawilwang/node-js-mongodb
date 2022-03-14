var express = require('express');
var router = express.Router();

// import Product model
var Product = require('../models/product');

/*********************** Route ************************/

/* GET users listing. */
router.get('/', function (req, res, next) {
    // check session
    console.log(req.session)

    var msg = req.query.Status
    Product.find().exec((err, doc) => {
        res.render('products', { Status: msg, products: doc });
    })
});

module.exports = router