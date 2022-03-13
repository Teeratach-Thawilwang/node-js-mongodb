var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// import Product model
var Product = require('../models/product');

/*********************** Route ************************/

/* GET users listing. */
router.get('/', function (req, res) {
    var msg = req.query.Status
    Product.find().exec((err, doc) => {
        res.render('manage', { Status: msg, products: doc });
    })
})


router.get('/delete', function (req, res, next) {
    // console.log(req.query)
    Product.findByIdAndDelete(req.query.id, {
        useFindAndModify: false
    }).exec((err) => {
        if (err) console.log(err)
        const filePath = path.join(__dirname, '../public/images/products/' + req.query.image)
        fs.unlinkSync(filePath);
        res.location('/manage')
        res.redirect('/manage/?Status=ลบสินค้าเรียบร้อย')
    })
});

router.get('/edit', function (req, res, next) {
    console.log(req.query)
    Product.findById(req.query.id).exec((err, doc) => {
        if (err) console.log(err)
        res.render('products_edit', { product: doc })
    })
});

router.post('/edit', function (req, res, next) {

})

module.exports = router;