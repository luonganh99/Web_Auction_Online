const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');
const router = express.Router();


router.get('/register', (req, res) => {
    res.render('main/account/register');
});

router.post('/register', async (req,res) => {
    const N = 5;
    const hash = bcrypt.hashSync(req.body.Raw_Password, N); 
    const date = moment(req.body.Date_of_Birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = req.body;
    entity.Password = hash;
    entity.DoB = date;
    entity.Fullname = req.body.Lastname + ' ' + req.body.Firstname;
    entity.RateNumber = 10;

    delete entity.Raw_Password;
    delete entity.Date_of_Birth;
    delete entity.Firstname;
    delete entity.Lastname;

    const result = await userModel.add(entity);
    res.render('main/account/login');
});

router.get('/login', (req, res) => {
    res.render('main/account/login');
});

router.post('/login', async (req,res) => {
    const username = req.body.Username;
    const password = req.body.Password;
    const user = await userModel.singleByUsername(username);

    if(user === null)
    {
        return res.render('main/account/view',{
            err_message: 'Invalid username or password.'
        });
        //  throw new Error("Invalid username or password.");
    }
       
    const rs = bcrypt.compareSync(password, user.Password);
    if(rs === false) {
        return res.render('main/account/login',{
            err_message: 'Login failed'
        });
    }

    // isAuthenticated = 0 : tài khoản admin
    // isAuthenticated = 1 : tài khoản người mua
    // isAuthenticated = 2 : tài khoản người bán

    req.session.isAuthenticated = user.Permission;
    req.session.authUser = user;

    
    if(req.session.isAuthenticated === 0){
        return res.redirect('/admin/categories');
    }
    let url = req.query.retUrl || '/';
    if(url.includes('/wishlist') === true) {
        url = url.replace('/wishlist','');
    }
    

    res.redirect(url);
});

router.post('/logout', (req,res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    console.log(req.headers.referer);
    res.redirect(req.headers.referer);
});

module.exports = router;