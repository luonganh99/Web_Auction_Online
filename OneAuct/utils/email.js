const nodemailer = require('nodemailer');


const sendEmail = async (entity) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service:'Gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'luonganhnguyen99@gmail.com', // generated ethereal user
            pass: 'luonganh' // generated ethereal password
        }, 
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"OneAuct 👻" <luonganhnguyen99@gmail.com>', // sender address
        to: entity.to, // list of receivers
        subject: entity.subject, // Subject line
        text: entity.text, // plain text body
        //html: "<b>Hello world?</b>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail;