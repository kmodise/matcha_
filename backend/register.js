
var mailer = require("nodemailer")

if (req.body.username && req.body.firstname && req.body.lastname && req.body.email && req.body.password) {
    var username = escapehtml(req.body.username)
    var firstname = escapehtml(req.body.firstname)
    var lastname = escapehtml(req.body.lastname)
    var email = escapehtml(req.body.email)
    var password = escapehtml(req.body.password)
    var lowerCase = /[a-z]/
    var upperCase = /[A-Z]/
    if (password.length > 5) {
        if (password.search(lowerCase) !== -1) {
            if (password.search(upperCase) !== -1) {
                if (validator.isEmail(email)) {

                    sql = 'SELECT username FROM users WHERE username = ? OR email = ?'
                    conn.query(sql, [username, email],
                        (error, result) => {
                            if (error) throw error
                            if (result.length == 0) {
                                let Transport = mailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'kgosaneli@gmail.com',
                                        pass: 'Kmodise@1'
                                    }
                                });

                                key = rand.generateDigits(5)
                                mail =
                                {
                                    from: "kgosaneli@gmail.com", to: email, subject: "Matcha account activation",
                                    text: "Hi looking for love?",
                                    html: '<html><body><div align=center>  You are one step away from a hookup just click on the link: <a href=http://localhost:3000/activateAccount?username=' + username + '&key=' + key + '>activate</a> </div></body></html>'
                                }
                                Transport.sendMail(mail, (error, response) => {
                                    if (error) {
                                        var msg = "nodemailer fail"
                                        res.render('pages/register', { error: msg })
                                    }
                                    else {

                                        var msg = "Check your email for a validation link"
                                        res.render('pages/login', { success: msg })
                                    }

                                    Transport.close()
                                })
                                bcrypt.hash(password, 10, (err, hash) => {
                                    if (err) throw err
                                    sql = 'INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`, `password`,`vkey`) VALUES (?, ?, ?, ?, ?, ?)'
                                    variables = [username, firstname, lastname, email, hash, key]
                                    var promise = new Promise((resolve, reject) => { conn.query(sql, variables, (err, res) => { if (err) throw err }) })

                                    promise.then(conn.query('SELECT * FROM users WHERE username = ?', [username], (err, res) => {
                                        if (err) throw err
                                        fs.mkdir(__dirname + '/public/img/users/' + res[0].id, (err) => {
                                            if (err)
                                                throw err;
                                        })
                                    }))
                                });

                            }
                            else {
                                msg = 'username or email already exist'
                                res.render('pages/register', { error: msg })
                            }
                        })
                }
            }
            else {
                var msg = "add an uppercase character !"
                res.render('pages/register', { error: msg })
            }
        }
        else {
            var msg = "add a lowercase characters"
            res.render('pages/register', { error: msg })
        }
    }
    else {
        var msg = "too short....that's what she said"
        res.render('pages/register', { error: msg })
    }




}
else {
    var msg = "fill the whole form"
    res.render('pages/register', { error: msg })
}
