const   express = require('express'),
        exhbs = require('express-handlebars'),
        morgan = require('morgan'),
        numeral = require('numeral'),
        hbs_sections = require('express-handlebars-sections'),
        session = require('express-session'),
        app = express();

const moment = require('moment');
require('express-async-errors');

moment.updateLocale('en', {
    relativeTime : {
        future: "trong %s",
        past:   "%s ago",
        s  : 'vài giây',
        ss : '%d giây',
        m:  "1 phút",
        mm: "%d phút",
        h:  "1 tiếng",
        hh: "%d giờ",
        d:  "1 ngày",
        dd: "%d ngày",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});

//app.use(morgan('dev')); 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     secure: true
    // }
  }))
    
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.engine('hbs', exhbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    helpers: {
        format: val => numeral(val).format('0,0') + ' đ',
        section: hbs_sections(),
        mask: user => {
            let i = 0;
            const mask = 4;
            let maskUser = '';
            for(let c of user){
                if(i < mask) {
                    maskUser += '*';
                } else {
                    maskUser += c;
                }
                i++;
            }
            return maskUser;
        },
        relative: (val) => {
           
             const expiryDate = moment(val);
             const currentDate = moment();
             const diffDate = expiryDate.diff(currentDate,'days');
             console.log(diffDate);
             
            if (diffDate < 3 && diffDate >= 0) {
                return currentDate.to(expiryDate);
            } else if (diffDate >= 3) {
                return expiryDate.format("DD-MM-YYYY");
            }
            const msg = 'Hết hạn';
            return msg;
        },
        date: (val) => moment(val).format("DD-MM-YYYY")
    },

}));

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

//Error handler
// app.use((err,req,res,next) => {
//     console.log(err.stack);
//     res.status(500).send('View error on console');
// });

app.use((req, res, next) => {
	next(createError(404));
})
app.use((err, req, res, next) => {
	var status = err.status || 500;
	var errorView = 'error';
	if (status === 404)
		errorView = '404';
    var msg = "Hiện tại chức năng này không hoạt động. Xin vui lòng thử lại sau!";
    console.log(err.stack);
	var error = err;
	res.status(status).render(errorView, {
		layout: false,
		msg,
		error
	})
})

app.listen(3000, () => {
    console.log("Server is running ...");
});