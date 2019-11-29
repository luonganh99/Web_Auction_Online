const   express = require('express'),
        exhbs = require('express-handlebars'),
        app = express(),
        path = require('path');

app.engine('hbs', exhbs({
    defaultLayout: 'main.hbs',
    layoutDir: 'views/layouts',

}));

app.set('view engine', 'hbs');
// app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

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
        style_responsive: 'shop_responsive.css'});
});

app.get('/product', (req,res) => {
    res.render('product-detail');
});

app.get('/register', (req,res) => {
    res.render('register');
});

app.get('/blog', (req,res) => {
    res.render('blog');
});

app.get('/blogdetail', (req,res) => {
    res.render('blog-detail');
});

app.get('/wishlist', (req,res) => {
    res.render('wish-list');
});

app.get('/contact', (req,res) => {
    res.render('contact');
});



app.listen(3000, () => {
    console.log("Server is running ...");
});