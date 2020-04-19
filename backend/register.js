


if (req.body.username && req.body.firstname && req.body.name && req.body.email && req.body.password){
    var username = eschtml(req.body.username)
    var firstname = eschtml(req.body.firstname)
    var name = eschtml(req.body.name)
    var email = eschtml(req.body.email)
    var password = eschtml(req.body.password)
    var lowerC = /[a-z]/
    var upperC = /[A-Z]/
    if (password.length > 5)
    {
        if (password.search(lowerC) !== -1){
            if (password.search(upperC) !== -1){
                if (validator.isEmail(email)){
                        
                    sql = 'SELECT username FROM users WHERE username = ? OR email = ?'
                    conn.query(sql,[username,email],
                        function (error, result)
                        {
                            if (error) throw error
                            if (result.length == 0)
                            {
                                let smtpTransport = mailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'kgosaneli@gmail.com',
                                        pass: 'Kmodise@1'
                                    }
                                 }); 
                                   
                                key = rand.generateDigits(5)
                                mail = 
                                {
                                    from: "kgosaneli@gmail.com", to: email, subject: "Confirm Matcha account",
                                    text: "Hi looking for love?",
                                    html: '<html><body><div align=center> \
                                     <BR />You are one step away from a hookup just click on the link: <BR />\
                                    <a href=http://localhost:3000/confirm?username='+ username + '&key=' + key + '>confirm</a>\
                                    </div></body></html>'
                                }
                                smtpTransport.sendMail(mail,function(error, response){
                                    if (error){
                                        var msg = "Email error try again"
                                        res.render('pages/register',{error: msg})
                                    }
                                    else {
                                        
                                        var msg = "Check your email for a validation link"
                                        res.render('pages/login',{success: msg})
                                    }
                                    

                                    smtpTransport.close()})
                                    bcrypt.hash(password,10,function(err, hash){if (err) throw err
                                    sql = 'INSERT INTO `users` (`username`, `firstname`, `name`, `email`, `password`,`confirmkey`, `api`) VALUES (?, ?, ?, ?, ?, ?, 1)'
                                    variables = [username, firstname, name, email, hash, key]
                                    var promise1 = new Promise(function(resolve, reject) { conn.query(sql, variables, function (err, res) { if (err) throw err }) }) 
                                        
                                        promise1.then(conn.query('SELECT * FROM users WHERE username = ?', [username], function (err, res) { if (err) throw err
                                            fs.mkdir(__dirname + '/public/img/users/' + res[0].id, function(err) {
                                            if (err) { if (err.code == 'EEXIST') { return ; } else { throw err; } }})})) });
                                    
                            }
                            else {
                                msg = 'username or email already exist'
                                res.render('pages/register',{error: msg}) 
                                }
                        })
                }
            }
            else {
                var msg ="add an uppercase character !"
                res.render('pages/register',{error: msg})
            }
        }
        else {
            var msg ="add a lowercase characters"
            res.render('pages/register',{error: msg})
        }
    }
    else {
        var msg = "too short....that's what she said"
        res.render('pages/register',{error: msg})
    }

    


}
else {
    var msg = "oops, forgot to fill full form"
    res.render('pages/register',{error: msg})
}
