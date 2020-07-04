function dataUpdate(column, change) {
        var sql = 'UPDATE users SET ' + column + ' = ? WHERE id = ?'
        conn.query(sql, [change, req.session.profile.id], (err) => {
                if (err){
                        throw err;
                }
                 
        })
        req.session.profile[column] = change
        functions.myLikes(conn, req.session.profile.id, (like) => {
                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                        res.render("pages/profile", {profile: req.session.profile, notif: notifications, like: like, visit: visit })
                })
        })
}



function addTag(i) {
        sql = 'SELECT * FROM `tags` WHERE user_id = ?'
        conn.query(sql, [req.session.profile.id], (err, result) => {
                if (err){
                        throw err;
                }
                req.session.profile.tag = result;
                functions.myLikes(conn, req.session.profile.id, (like) => {
                        functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                if (i == 1) {
                                        res.render('pages/profile', {visit: visit, like: like, profile: req.session.profile, notif: notifications })
                                }
                                else if (i == 0) {
                                        res.render('pages/profile', {visit: visit, like: like, profile: req.session.profile, notif: notifications })
                                }
                        })
                })

        })
}



if (req.session.profile == undefined) {
        res.render('pages/login')
}

else if (req.body.edit && req.body.general === 'update') {
        var change = escapehtml(req.body.changement);

        if (req.body.edit === '1') {
                sql = 'SELECT * FROM `users` WHERE username = ?'
                conn.query(sql, [change], (err, result) => {
                        if (err){
                                throw err;
                        }
                        if (result.length === 0)
                                dataUpdate('username', change)
                        else
                                errorMessage = "username already exists"
                        functions.myLikes(conn, req.session.profile.id,(like) => {
                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications, error: errorMessage })
                                })
                        })
                })
        }
        else if (req.body.edit === '2')
                dataUpdate('firstname', change)
        else if (req.body.edit === '3')
                dataUpdate('name', change)
        else if (req.body.edit === '4') {
                if (validator.isEmail(change)) {
                        sql = 'SELECT * FROM `users` WHERE email = ?'
                        conn.query(sql, [change], (err, result) => {
                                if (err) throw err
                                if (result.length === 0)
                                        dataUpdate('email', change)
                                else {
                                        errorMessage = "email already exists"
                                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications, error: errorMessage })
                                                })
                                        })
                                }

                        })
                }
        }
        else if (req.body.edit === '5') {
                regLow = /[a-z]/
                regUp = /[A-Z]/
                if (change.length < 5)
                {
                        errorMessage = "password is too short"
                                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications, error: errorMessage })
                                                })
                                        })
                }
                else if (change.search(regLow) === -1)
                {
                        errorMessage = "Password must contain a lowercase"
                                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications, error: errorMessage })
                                                })
                                        })
                }
                else if (change.search(regUp) === -1)
                {
                        errorMessage = "Password must contain an uppercase"
                                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications, error: errorMessage })
                                                })
                                        })
                }
                else {
                        bcrypt.hash(change, 10, (error, hash) => {
                                if (error){
                                        throw error;
                                }
                                dataUpdate('password', hash)
                        })
                }
        }
}
else if (req.body.gender && req.body.sub_gender === 'update') {
        if (req.body.gender == 'Man' || 'Woman')
                dataUpdate('gender', req.body.gender)
}

else if (req.body.orientation && req.body.sub_orientation === 'update') {
        if (req.body.orientation == "Heterosexual" || "Homosexual" || "Bisexual") {
                dataUpdate('orientation', req.body.orientation)
        }
}

else if (req.body.age && req.body.sub_age === 'update') {
        if (!(req.body.age < 1)) {
                dataUpdate('age', req.body.age)
        }
        else {
                res.render('pages/profile', { profile: req.session.profile, notif: notifications })
        }
}

else if (req.body.bio && req.body.sub_bio === 'update') {
        bio = req.body.bio
        dataUpdate('bio', bio)
}

else if (req.body.newtag) {
        if (!req.body.newtag.trim())
                res.render('pages/profile', { profile: req.session.profile, notif: notifications })
        else {
                var newtag = escapehtml(req.body.newtag)
                if (newtag.length < 41) {
                        sql = 'SELECT * FROM `tags` WHERE user_id = ? AND tag = ?'
                        conn.query(sql, [req.session.profile.id, newtag], (err, result) => {
                                if (err) throw err
                                if (result.length === 0) {
                                        sql = 'INSERT INTO tags (tag, user_id) VALUES (?,?)'
                                        conn.query(sql, [newtag, req.session.profile.id], (err, result) => {
                                                if (err){
                                                        throw err;
                                                }
                                        })
                                        addTag(1);

                                }
                                else {
                                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                                        res.render('pages/profile', {like: like, visit: visit, profile: req.session.profile, notif: notifications })
                                                })
                                        })
                                }
                        })
                }
                else
                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifications})
                                })
                        })
        }
}


else if (req.body.deltag) {

        sql = 'DELETE FROM `tags` WHERE user_id = ? AND id = ?'
        conn.query(sql, [req.session.profile.id, req.body.deltag], (err, result) => {
                if (err) throw err
                if (result.length !== 0) {
                        addTag(1);
                }
                else
                        functions.myLikes(conn, req.session.profile.id, (like) => {
                                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                                        res.render('pages/profile', { profile: req.session.profile, notif: notifications, visit: visit, like: like})
                                })
                        })

        })
}


else {
        functions.myLikes(conn, req.session.profile.id, (like) => {
                functions.myVisitors(conn, req.session.profile.id, (visit) => {
                        res.render('pages/profile', { profile: req.session.profile, notif: notifications, like: like, visit: visit })
                })
        })
}