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
        let Transport = nodemailer.createTransport({
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
            html: '<html><body>  hello '+result[0].username+' here is your new password :  '+newpass+'</body></html>'
        }
        Transport.sendMail(mail, function(error, response){
            if (error) { 
                res.render('pages/login.ejs', {req: req, error: "Mail failed"}) 
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
                res.render('pages/login.ejs', {req: req, success: msg})
             }
             Transport.close()})
    }
    else {
        res.render('pages/login.ejs',{req: req})
    }
})