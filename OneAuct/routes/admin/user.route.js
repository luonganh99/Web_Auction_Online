const express = require('express');
const userModel = require('../../models/user.model');
const router = express.Router();

router.get('/', async (req,res) => {
    const users = await userModel.all();
    res.render('admin/user',{
        layout: 'admin',
        users,
    })
});

router.post('/post', async (req,res) => {
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    if(isEmpty(req.body)) {
        return res.redirect('/admin/user');
    } else {
        const entity = {
            Permission: '0'
        };
        //Xử lý nếu có 2 check
        if(Array.isArray(req.body.UserID)){
            req.body.UserID.forEach(async UserID => {
                const condition = {
                    UserID: UserID
                }
                const results = await userModel.patchPermission(entity,condition);
            });
            return res.redirect('/admin/user');
        }
        else { //Có 1 check 
            const condition = {
                UserID: req.body.UserID
            }
            const results = await userModel.patchPermission(entity,condition);
            return res.redirect('/admin/user');
        }
        
    }
    res.redirect('/admin/user');
});

module.exports = router;
