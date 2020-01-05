const express = require('express');
const productModel = require('../../models/product.model');
const bidModel = require('../../models/user-bid-product.model');
const userModel = require('../../models/user.model');
const categoryModel = require('../../models/category.model');
const wishModel = require('../../models/wishlist.model');
const rateModel = require('../../models/user-rate-user.model');
const upgradeModel = require('../../models/users-upgrade-sellers.model');
const restrictSeller = require('../../middlewares/authSeller.mdw');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../../config/default.json');
const multer = require('multer');
const fs = require('fs');
const N = config.hash.N;

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, file.originalname);
    },
    destination: function(req,file,cb){
        cb(null, `./public/images/product/upload`);
    },
});
const upload = multer({storage});

const router = express.Router();


router.get('/profile', async (req,res) => {
    const user = await userModel.single(req.session.authUser.UserID);
    res.render('user/profile', {
        layout: 'user',
        user
    });
});

router.get('/edit', async (req,res) => {
    const user = await userModel.single(req.session.authUser.UserID);
    res.render('user/edit', {
        layout: 'user',
        user
    });
});

router.post('/edit', async (req,res) => {
    const date = moment(req.body.Date_of_Birth, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const entity = req.body;
    entity.DoB = date;
    delete entity.Date_of_Birth;
    const condition = {
        UserID: req.session.authUser.UserID
    }
    const results = await userModel.patch(entity,condition);
    res.redirect('/user/profile');
});

router.get('/password', (req,res) => {
    res.render('user/password',{
        layout: 'user',
    });
});

router.post('/password', async (req,res) => {
    // Kiểm tra mật khẩu cũ đúng k
    const oldPassword = req.body.Old_Password;
    const rawPassword = req.body.Raw_Password;
    const user = await userModel.singleByUsername(req.session.authUser.Username);
    const rs = bcrypt.compareSync(oldPassword, user.Password);
   
    if(rs === false) {
        return res.render('user/password',{
            layout: 'user',
            err_message: 'Sai mật khẩu. bui lòng thử lại !'
        });
    }
    
    //Cập nhật lại mật khẩu
    const hash = bcrypt.hashSync(rawPassword, N); 
    const entity = {
        Password: hash
    }
    const condition = {
        UserID: user.UserID
    }
    const results = userModel.patch(entity,condition);
    res.render('user/password', {
        layout: 'user',
        err_message: 'Đổi mật khẩu thành công'
    })
});

router.get('/post', restrictSeller,  (req,res) => {
    res.render('user/post', {
        layout: 'user'
    });
});



router.post('/post', restrictSeller, upload.array('Images', 7), async (req,res) => {
    const entity = req.body;
    entity.SellerID = req.session.authUser.UserID;
    entity.SellerName = req.session.authUser.Username;
    entity.CurrentPrice = entity.StartPrice;
    entity.StartDate = moment().format('YYYY-MM-DD HH:mm:ss'),
    entity.ExpiryDate = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
    const results = await productModel.add(entity);
    const proID = await productModel.singlebyName(entity.ProName);
    const uploadPath = './public/images/product/upload';
    const proPath = `./public/images/product/${proID}`;
    fs.rename(uploadPath,proPath, () => {
        let i = 0;
        fs.readdirSync(proPath).forEach(file => {
            const extension = file.split('.').pop();
            fs.renameSync(proPath + '/' + file,  proPath + '/' + i + '.' + extension);
            i++;
        });
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        return res.redirect('/user/auctionlist');
    });
});

router.get('/joininglist', async(req,res) => {
    const products = await productModel.joininglist(req.session.authUser.UserID);
    res.render('user/joiningList', {
        layout: 'user',
        products
    });
});

router.get('/joinedlist', async(req,res) => {
    const products = await productModel.joinedlist(req.session.authUser.UserID);
    res.render('user/joinedList', {
        layout: 'user',
        products
    });
});

router.get('/wonlist', async(req,res) => {
    const products = await productModel.wonlist(req.session.authUser.UserID);
    res.render('user/wonList', {
        layout: 'user',
        products
    });
});

router.get('/wishlist', async (req, res) => {
    const products = await productModel.wishlist(req.session.authUser.UserID);
    res.render('user/wishList', {
        layout: 'user',
        products
    });
});

router.get('/review', async (req,res) => {
    const [products, goodRate, badRate] = await Promise.all([
        productModel.reviewlist(req.session.authUser.UserID),
        rateModel.goodReview(req.session.authUser.UserID),
        rateModel.badReview(req.session.authUser.UserID)
    ]);
    //Tính phần trăm điểm đánh giá
    const checkRate = goodRate / (goodRate + badRate);
    let check = true;
    if(checkRate < 0.8){
        check = false;
    }
    res.render('user/review', {
        layout: 'user',
        products,
        goodRate,
        badRate,
        check
    });
});

router.get('/upgrade', (req,res) => {
    res.render('user/upgrade', {
        layout: 'user'
    })
})

router.get('/postupgrade', async (req,res) => {
    //Cập nhật bảng upgrade
    const entity = {
        UserID: req.session.authUser.UserID,
        Username: req.session.authUser.Username
    }
    const results = await upgradeModel.add(entity);
    res.render('user/upgrade', {
        layout: 'user',
        upgrade: true
    });
});

router.get('/auctionlist', async (req,res) => {
    const products = await productModel.auctionlist(req.session.authUser.UserID);
    res.render('user/auctionlist', {
        layout: 'user',
        products
    });
})

router.get('/successlist', async (req,res) => {
    const products = await productModel.successlist(req.session.authUser.UserID);
    res.render('user/successlist', {
        layout: 'user',
        products
    });
})

router.get('/rate', (req,res) => {
    res.render('user/rate', {
        layout: 'user',
        product: req.query
    })
})

router.post('/rate', async (req,res) => {

    const entity = {
        UserID: req.session.authUser.UserID,
        Username: req.session.authUser.Username,
        Rated_UserID: req.body.Rated_UserID,
        Rated_Username: req.body.Rated_Username,
        ProID: +req.body.ProID,
        Message: req.body.Message,
    }

    if( req.body.Grade === 'true')
        entity.Grade = true;
    else 
        entity.Grade = false;

    const results = await rateModel.add(entity);
     //Thêm điểm vào bảng người dùng
    const [goodRate,badRate] = await Promise.all([
        rateModel.goodReview(userID), 
        rateModel.badReview(userID)
    ]);

    const rateNumber = goodRate / (goodRate + badRate) * 100;
    const updateUser = await userModel.patch('users', {RateNumber: rateNumber}, {UserID: req.body.Rated_UserID});
    res.redirect('/user/profile');
})

router.get('/delete', async (req,res) => {
    console.log(req.query.ProID);
    const results = await wishModel.del_2(req.query.ProID, req.session.authUser.UserID);
    res.redirect('/user/wishlist');
})

module.exports = router;

