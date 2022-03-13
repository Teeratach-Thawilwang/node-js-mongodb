var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

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

// check form validator
const { check, validationResult } = require('express-validator')


/*********************** Route ************************/

/* GET users listing. */
router.get('/', function (req, res) {
    var msg = req.query.Status
    Product.find().exec((err, doc) => {
        res.render('manage', { Status: msg, products: doc });
    })
})

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

router.get('/edit', function (req, res) {
    // console.log(req.query)
    Product.findById(req.query.id).exec((err, doc) => {
        if (err) console.log(err)
        res.render('products_edit', { product: doc })
    })
});

router.post('/update', upload.single("productimage"), [
    check('productname', "กรุณาป้อนชื่อสินค้า").not().isEmpty(),
    check('productdetail', "กรุณาป้อนรายละเอียดสินค้า").not().isEmpty(),
    check('productprice', "กรุณากำหนดราคาสินค้า").not().isEmpty()
], (req, res) => {
    const result = validationResult(req)
    var errMsg = result.errors
    if (!result.isEmpty()) {
        // if valadation is false, send error message
        res.render('products_edit', { errors: errMsg })
    } else {
        // if not, insert to db
        var imgPath = ''
        if (typeof req.file !== 'undefined') {
            imgPath = req.file.filename
            // rename image
            var data = {
                "name": req.body.productname,
                "detail": req.body.productdetail,
                "image": imgPath,
                "price": req.body.productprice
            }
        } else {
            var data = {
                // "_id": req.body.id,
                "name": req.body.productname,
                "detail": req.body.productdetail,
                "price": req.body.productprice
            }
        }

        Product.findByIdAndUpdate(req.body.id, data, {
            useFindAndModify: false
        }).exec((err, doc) => {
            if (err) console.log(err)
            if (imgPath != '') {
                const filePath = path.join(__dirname, '../public/images/products/' + doc.image)
                fs.unlinkSync(filePath);
            }
            res.location('/manage')
            res.redirect('/manage/?Status=แก้ไขข้อมูลสินค้าเรียบร้อย')
        })
    }
});

module.exports = router;