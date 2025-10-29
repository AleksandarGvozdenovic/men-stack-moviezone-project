
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const cart = require('../controllers/cartController');

//======================= View cart==================   
router.get('/', ensureAuth, cart.index);

//===========================Add to cart=================
router.post('/add/:id', ensureAuth, cart.add);

//=========================Update quantity==============
router.post('/update/:id', ensureAuth, cart.update);

//=========================Remove item================
router.post('/remove/:id', ensureAuth, cart.remove);

//==========================Checkout===================
router.post('/checkout', ensureAuth, cart.checkout);

module.exports = router;
