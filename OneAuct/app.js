const   express = require('express'),
        exhbs = require('express-handlebars')
        app = express();  
const path = require('path');

app.engine('hbs', exhbs({
    defaultLayout: 'main.hbs',
    layoutDir: 'views/layouts',

}));

app.set('view engine', 'hbs');
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/',(req,res) => {
    res.render('home');
});


app.get('/shop', (req,res) => {
    res.render('shop');
});

app.listen(3000, () => {
    console.log("Server is running ...");
});