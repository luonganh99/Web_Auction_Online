const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main/account/view');
});

router.post('/register', async (req,res) => {
    const N = 5;
    const hash = bcrypt.hashSync(req.body.Raw_Password, N); 
    const date = moment(req.body.Date_of_Birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = req.body;
    entity.Password = hash;
    entity.Permission = 0;
    entity.DoB = date;
    entity.Fullname = req.body.Lastname + ' ' + req.body.Firstname;
    entity.Review = 10;

    delete entity.Raw_Password;
    delete entity.Date_of_Birth;
    delete entity.Firstname;
    delete entity.Lastname;

    const result = await userModel.add(entity);
    res.render('main/account/view');
});

router.post('account/login', async (req,res) => {
    
});


module.exports = router;