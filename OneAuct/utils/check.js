const cron = require('cron');
const email = require('./email');

const productModel = require('../models/product.model');
const userModel = require('../models/user.model');


const Update = async () => {
    const [products, update] = await Promise.all([
        productModel.expired(),
        productModel.update()
    ])

    products.forEach(product => {
        const entity = {
            to: [
                product.SellerEmail,
                product.BidderEmail
            ],
            subject: 'Đấu giá hoàn thành',
            text: product.ProName + ' đã được đấu giá thành công với giá ' + product.CurrentPrice +  ' vnđ bởi tài khoản ' + product.BidderName
        }
        email(entity);
    });
    
} 


const job = new cron.CronJob({
    cronTime: '20 * * * * *', 
    onTick: function() {
        console.log('Cron jub runing...');
        Update();
    },
    start: true, 
    timeZone: 'Asia/Ho_Chi_Minh' 
});

module.exports = job;