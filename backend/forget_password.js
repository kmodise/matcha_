var nodemailer = require('nodemailer')
var rand = require("random-key")
var bcrypt = require('bcrypt')



email = req.body.email
sql = 'SELECT * FROM users WHERE email = ?'
    conn.query(sql, [email],
    function (error, result) 
    { 
    if (error) throw error
    if (result.length > 0)
    {
        let smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kgosaneli@gmail.com',
                pass: 'Kmodise@1'
            }
         });
         newpass = rand.generate(10)
         mail = 
        {
            from: "kgosaneli@gmail.com", to: email, subject: "Matcha password resset",
            html: '<html><body><div align=center> \
            YOUR LOGIN : <BR />\
            '+result[0].username+'<BR /><BR />\
            NEW PASSWORD : <BR />\
            '+newpass+'<BR />\
            </div></body></html>'
        }
        smtpTransport.sendMail(mail, function(error, response){
            if (error) { 
                res.render('login', {req: req, error: "Mail failed"}) 
            }
            else {
                bcrypt.hash(newpass, 10, function(err, hash) { 
                    if (err) throw err
                    sql = 'UPDATE users SET password = ? WHERE email = ?'
                    conn.query(sql, [hash, email],
                    function (error, result) 
                    { 
                    if (error) throw error }) })
                        var msg = "check your email"
                res.render('login', {req: req, success: msg})
             }
             smtpTransport.close()})
    }
    else {
        res.render('login',{req: req})
    }
})