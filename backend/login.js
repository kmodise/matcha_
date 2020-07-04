if (!req.body.username && !req.body.password)
  res.render('pages/login', {req: req})
else if (req.body.username && req.body.password)
{
    sql = 'SELECT * FROM `users` WHERE username = ?'
    variables = [req.body.username]
    conn.query(sql, variables, function (err, result) { if (err) throw err
        if (result.length > 0)
        {
            
            bcrypt.compare(req.body.password, result[0].password, function(err, reso) {
                if (reso)
               {
                if (result[0].activate === 1){
                    
                        req.session.profile = result[0]
                        
                        sql = 'SELECT * FROM `tags` WHERE user_id = ?'
                        conn.query(sql, [req.session.profile.id], function (err, result){
                            if (err) throw err
                            i = 0;
                            req.session.profile.tag = result
                            res.redirect('/profile')

                        })
                }
                else 
                    res.render('pages/login',{error: "activate account first"})
                
            }
                else 
                    res.render('pages/login',{error: "Invalid password"})
                
            })
        
        }
        else 
            res.render('pages/login',{error: "Unknow login"})
    }) 

    
}
else {
    res.render('pages/login',{error: "Fill up the whole form"})
}




