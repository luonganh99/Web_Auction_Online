const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');
const request = require('request');
const router = express.Router();


router.get('/register', (req, res) => {
    res.render('main/account/register'); 
});

router.post('/register', async (req,res) => {
    if(
        req.body['g-recaptcha-response'] === undefined || 
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
    ) {
        return res.render('main/account/register', {
            err_message: 'Please fill captcha',
        });
    }

    const secretKey = '6LdMCMsUAAAAAHPmuiQECcsC4_vxby2ERUtBRPwZ';
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip${req.connection.remoteAddress}`;
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        //Không thành công
        if(body.success !==  undefined && !body.success) {
            return res.render('main/account/register', {
                err_message: 'Failed captcha verification',
            });
        }
    });

     //Thành công
     const entity = req.body;

     const isExists = await userModel.isExists(entity.Email);
     if(isExists.length === 0){
        const N = 5;
        const hash = bcrypt.hashSync(req.body.Raw_Password, N); 
        const date = moment(req.body.Date_of_Birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
        
        console.log(entity);
        entity.Password = hash;
        entity.DoB = date;
        entity.Fullname = req.body.Lastname + ' ' + req.body.Firstname;
        entity.RateNumber = 10;
    
        delete entity.Raw_Password;
        delete entity.Date_of_Birth;
        delete entity.Firstname;
        delete entity.Lastname;
        delete entity['g-recaptcha-response'];
        const result = await userModel.add(entity);
        return res.render('main/account/login');
     }
     else {
        return res.render('main/account/register', {
            err_message: 'Email exists !',
        });
     }
    
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
        return res.render('main/account/login',{
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

    // isAuthenticated = 2 : tài khoản admin
    // isAuthenticated = 0 : tài khoản người mua
    // isAuthenticated = 1 : tài khoản người bán

    req.session.isAuthenticated = user.Permission;
    req.session.authUser = user;

    
    if(req.session.isAuthenticated === 2){
        return res.redirect('/admin/categories');
    }
    let url = req.query.retUrl || '/';
    if(url.includes('/wishlist') === true) {
        url = url.replace('/wishlist','');
    }
    

    res.redirect(url);
});

router.post('/logout', (req,res) => {
    if(req.session.authUser.Permission === 2)
    {
        req.session.isAuthenticated = false;
        req.session.authUser = null;
        res.redirect('/account/login');
    } else {
        req.session.isAuthenticated = false;
        req.session.authUser = null;
        res.redirect(req.headers.referer);
    }
});

module.exports = router;