const express = require('express');
const upgradeModel = require('../../models/users-upgrade-sellers.model');
const userModel = require('../../models/user.model');

const router = express.Router();

router.get('/', async (req,res) => {
    const users = await upgradeModel.all();
    res.render('admin/upgrade',{
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
        return res.redirect('/admin/upgrade');
    } else {
        const entity = {
            Permission: '1'
        };
        //Xử lý nếu có 2 check
        if(Array.isArray(req.body.UserID)){
            req.body.UserID.forEach(async UserID => {
                const condition = {
                    UserID: UserID
                }
                const[results_upgrade,results_user] = await Promise.all([
                    upgradeModel.del(UserID),
                    userModel.patchPermission(entity,condition),
                ]);
            });
            return res.redirect('/admin/upgrade');
        }
        else { //Có 1 check 
            const condition = {
                UserID: req.body.UserID
            }
            const[results_upgrade,results_user] = await Promise.all([
                upgradeModel.del(req.body.UserID),
                userModel.patchPermission(entity,condition),
            ]);
            return res.redirect('/admin/upgrade');
        }
        
    }
    res.redirect('/admin/upgrade');
});

module.exports = router;