function updateuser(column, change) {
        var sql = 'UPDATE users SET ' + column + ' = ? WHERE id = ?'
        conn.query(sql, [change, req.session.profile.id], function (err) { if (err) throw err })
        req.session.profile[column] = change
        var success = column + ' was successfully changed'
        functions.getlikes(conn, req.session.profile.id, function (like) {
                functions.getvisits(conn, req.session.profile.id, function (visit) {
                        res.render("pages/profile", { success: success, profile: req.session.profile, notif: notifs, like: like, visit: visit })
                })
        })
}



function settags(i, msg) {
        sql = 'SELECT * FROM `tags` WHERE user_id = ?'
        conn.query(sql, [req.session.profile.id], function (err, result) {
                if (err) throw err
                req.session.profile.tag = result;
                functions.getlikes(conn, req.session.profile.id, function (like) {
                        functions.getvisits(conn, req.session.profile.id, function (visit) {
                                if (i == 1) {
                                        res.render('pages/profile', { success: msg, visit: visit, like: like, profile: req.session.profile, notif: notifs })
                                }
                                else if (i == 0) {
                                        res.render('pages/profile', { error: msg, visit: visit, like: like, profile: req.session.profile, notif: notifs })
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
                conn.query(sql, [change], function (err, result) {
                        if (err) throw err
                        if (result.length === 0)
                                updateuser('username', change)
                        else
                                msg = "username already exists"
                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
                                })
                        })
                })
        }
        else if (req.body.edit === '2')
                updateuser('firstname', change)
        else if (req.body.edit === '3')
                updateuser('name', change)
        else if (req.body.edit === '4') {
                if (validator.isEmail(change)) {
                        sql = 'SELECT * FROM `users` WHERE email = ?'
                        conn.query(sql, [change], function (err, result) {
                                if (err) throw err
                                if (result.length === 0)
                                        updateuser('email', change)
                                else {
                                        msg = "email already exists"
                                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
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
                        msg = "password is too short"
                                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
                                                })
                                        })
                }
                else if (change.search(regLow) === -1)
                {
                        msg = "Password must contain a lowercase"
                                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
                                                })
                                        })
                }
                else if (change.search(regUp) === -1)
                {
                        msg = "Password must contain an uppercase"
                                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
                                                })
                                        })
                }
                else {
                        bcrypt.hash(change, 10, function (erroo, hash) {
                                if (erroo) throw erroo
                                updateuser('password', hash)
                        })
                }
        }
}
else if (req.body.gender && req.body.sub_gender === 'update') {
        if (req.body.gender == 'Man' || 'Woman')
                updateuser('gender', req.body.gender)
}

else if (req.body.orientation && req.body.sub_orientation === 'update') {
        if (req.body.orientation == "Heterosexual" || "Homosexual" || "Bisexual") {
                updateuser('orientation', req.body.orientation)
        }
}

else if (req.body.age && req.body.sub_age === 'update') {
        if (!(req.body.age < 1)) {
                updateuser('age', req.body.age)
        }
        else {
                res.render('pages/profile', { profile: req.session.profile, notif: notifs })
        }
}

else if (req.body.bio && req.body.sub_bio === 'update') {
        bio = req.body.bio
        updateuser('bio', bio)
}

else if (req.body.newtag) {


        if (!req.body.newtag.trim())
                res.render('pages/profile', { profile: req.session.profile, notif: notifs })
        else {
                var newtag = escapehtml(req.body.newtag)
                if (newtag.length < 41) {
                        sql = 'SELECT * FROM `tags` WHERE user_id = ? AND tag = ?'
                        conn.query(sql, [req.session.profile.id, newtag], function (err, result) {
                                if (err) throw err
                                if (result.length === 0) {
                                        sql = 'INSERT INTO tags (tag, user_id) VALUES (?,?)'
                                        conn.query(sql, [newtag, req.session.profile.id], function (err, result) { if (err) throw err })
                                        settags(1, "tag added");

                                }
                                else {
                                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                                        var msg = "tag not added"
                                                        res.render('pages/profile', { error: msg, like: like, visit: visit, profile: req.session.profile, notif: notifs })
                                                })
                                        })
                                }
                        })
                }
                else
                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                        var msg = "Error"
                                        res.render('pages/profile', { like: like, visit: visit, profile: req.session.profile, notif: notifs, error: msg })
                                })
                        })
        }
}


else if (req.body.deltag) {

        sql = 'DELETE FROM `tags` WHERE user_id = ? AND id = ?'
        conn.query(sql, [req.session.profile.id, req.body.deltag], function (err, result) {
                if (err) throw err
                if (result.length !== 0) {
                        settags(1, 'tag is successful deleted');
                }
                else
                        functions.getlikes(conn, req.session.profile.id, function (like) {
                                functions.getvisits(conn, req.session.profile.id, function (visit) {
                                        var msg = "Error"
                                        res.render('pages/profile', { profile: req.session.profile, notif: notifs, visit: visit, like: like, error: msg })
                                })
                        })

        })
}


else {
        functions.getlikes(conn, req.session.profile.id, function (like) {
                functions.getvisits(conn, req.session.profile.id, function (visit) {
                        res.render('pages/profile', { profile: req.session.profile, notif: notifs, like: like, visit: visit })
                })
        })
}


