const   express = require('express'),
        exhbs = require('express-handlebars'),
        app = express();

app.use(express.static('public'));

app.engine('hbs', exhbs({
    defaultLayout: 'main.hbs',
    //layoutsDir: 'views/_layouts'
}));

app.set('view engine', 'hbs');



app.get('/',(req,res) => {
    res.render('home', {
        title: 'OneAunct',
        style: 'main_styles.css',
        style_responsive: 'responsive.css'
    });
});

app.get('/shop', (req,res) => {
    res.render('shop', {
        title: 'Shop',
        style: 'shop_styles.css',
        style_responsive: 'shop_responsive.css'
    });
});

app.get('/product', (req,res) => {
    res.render('product-detail', {
        title: 'Product Detail',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

app.get('/register', (req,res) => {
    res.render('register', {
        title: 'Register',
        style_specific: 'register.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

app.get('/blog', (req,res) => {
    res.render('blog', {
        title: 'Blog',
        style: 'blog_styles.css',
        style_responsive: 'blog_responsive.css'
    });
});

app.get('/blogdetail', (req,res) => {
    res.render('blog-detail');
});

app.get('/wishlist', (req,res) => {
    res.render('wish-list', {
        title: 'Wish List',
        style_specific: 'wishlist.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

app.get('/contact', (req,res) => {
    res.render('contact');
});

app.get('/account',(req,res) => {
    res.render('user-categories/user-account', {
        title: 'User Account',
        layout: 'user-categories',
        style_specific: 'account.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

app.listen(3000, () => {
    console.log("Server is running ...");
});