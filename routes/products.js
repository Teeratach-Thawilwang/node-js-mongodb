var express = require('express');
var router = express.Router();
var url = require('url');
var path = require('path')

// check form validator
const { check, validationResult } = require('express-validator')

// import Product model
var Product = require('../models/product');

// import multer : upload file
var multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // file location
        callback(null, './public/images/products')
    },
    filename: function (req, file, callback) {
        // rename file
        callback(null, Date.now() + ".jpg")
    }
})
var upload = multer({ storage: storage })

/*********************** Route ************************/

/* GET users listing. */
router.get('/', function (req, res, next) {
    var msg = req.query.Status
    Product.find().exec((err, doc) => {
        res.render('products', { Status: msg, products: doc });
    })
});

router.get('/add', function (req, res, next) {
    res.render('products_add');
});

router.post('/add', upload.single("productimage"), [
    check('productname', "กรุณาป้อนชื่อสินค้า").not().isEmpty(),
    check('productdetail', "กรุณาป้อนรายละเอียดสินค้า").not().isEmpty(),
    check('productprice', "กรุณากำหนดราคาสินค้า").not().isEmpty()
], (req, res) => {
    const result = validationResult(req)
    var errMsg = result.errors
    if (!result.isEmpty()) {
        // if valadation is false, send error message
        res.render('products_add', { errors: errMsg })
    } else {
        // if not, insert to db
        var imgPath = ''
        if (typeof req.file !== 'undefined') {
            imgPath = req.file.filename
        }
        // rename image
        let data = new Product({
            "name": req.body.productname,
            "detail": req.body.productdetail,
            "image": imgPath,
            "price": req.body.productprice
        })
        Product.saveProduct(data, (err) => {
            console.log(err)
            res.location('/manage')
            res.redirect('/manage/?Status=บันทึกข้อมูลสำเร็จ')
        })
    }
});

module.exports = router