var express = require('express');
var router = express.Router();

// check form validator
const { check, validationResult } = require('express-validator')


/*********************** Route ************************/

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', [
  check('username', "กรุณาป้อน username").not().isEmpty(),
  check('password', "กรุณาป้อน password").not().isEmpty()
], (req, res) => {
  const result = validationResult(req)
  var errMsg = result.errors
  console.log(errMsg)
  if (!result.isEmpty()) {
    // if valadation is false, send error message
    res.render('login', { errors: errMsg })
  } else {
    const username = req.body.username;
    const password = req.body.password;
    const timeExpire = 20 * 60 * 1000;  // 20 minutes

    if (username === 'admin' && password === '1234') {
      // create session. this data will show on server side.
      req.session.username = username
      req.session.password = password
      req.session.login = true
      req.session.cookie.maxAge = timeExpire

      // create cookie. this data will show on client side.
      res.cookie('username', username, { maxAge: timeExpire })
      res.cookie('password', password, { maxAge: timeExpire })
      res.cookie('login', true, { maxAge: timeExpire })
      res.redirect('products')
    } else {
      const errmsg = [{
        msg: 'username หรือ password ไม่ถูกต้อง',
        location: 'body'
      }]
      res.render('login', { errors: errmsg })
    }
  }
})

router.get('/logout', (req, res) => {
  // clear cookie when user logout
  res.clearCookie('username')
  res.clearCookie('password')
  res.clearCookie('login')


  // clear session when user logout
  req.session.destroy(() => {
    res.redirect('products');
  })
})

module.exports = router;
