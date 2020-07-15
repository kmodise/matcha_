function isActivated(result) {
    var i = 0;
    while (result[i]) {
        if ((result[i].activate !== 1))
            result[i].valid = 0;
        else if ((!result[i].gender || !result[i].bio || result[i].profileImg == '/img/default.jpg' || result[i].age <= 0 || !result[i].orientation))
            result[i].valid = 0;
        else
            result[i].valid = 1;
        i++;
    }
    result = result.filter((val) => {
        return (val.valid == 1)
    })
    return (result);
}

function isBlocked(result, myid, callback) {
    console.log(myid);
    conn.query('SELECT * FROM `block` WHERE user_id = ?', [myid], (err, block) => {
        if (err) throw err;
        var i = 0;
        if (block.length > 0) {
            while (block[i]) {
                result = result.filter((val) => { return (val.id != block[i].secondUsrId) })
                i++;
            }
        }
        return callback(result)
    })
}
function lookFor(gender, orientation1, orientation2, myid, callback) {
    sql = 'SELECT * FROM users WHERE orientation = ? AND gender = ? AND id != ?';
    vars = [orientation1, gender, myid]
    conn.query(sql, vars, (err, result) => {
        if (err) throw err
        sql = 'SELECT * FROM users WHERE orientation = ? AND gender = ? AND id != ?';
        vars = [orientation2, gender, myid]
        conn.query(sql, vars, (err, result2) => {
            if (err) throw err
            result = result.concat(result2)
            isBlocked(result, myid, (result) => { return callback(result); });
        })
    })
}

function sexPreference(orientation, gender, callback) {
    if (orientation == "Heterosexual") {
        if (gender == "Man") {
            lookFor('Woman', 'Heterosexual', 'Bisexual', req.session.profile.id, (result) => { return callback(result) })
        }
        else if (gender == "Woman") {
            lookFor('Man', 'Heterosexual', 'Bisexual', req.session.profile.id, (result) => { return callback(result) })
        }
    }

    else if (orientation == 'Bisexual') {
        if (gender == 'Man') {
            lookFor('Man', 'Homosexual', 'Bisexual', req.session.profile.id, (result1) => {
                lookFor('Woman', 'Heterosexual', 'Bisexual', req.session.profile.id, (result2) => {
                    result = result1.concat(result2)
                    return callback(result);
                })
            })
        }
        else if (gender == 'Woman') {
            lookFor('Woman', 'Homosexual', 'Bisexual', req.session.profile.id, (result1) => {
                lookFor('Man', 'Heterosexual', 'Bisexual', req.session.profile.id, (result2) => {
                    result = result1.concat(result2)
                    return callback(result);
                })
            })
        }
    }

    else if (orientation == 'Homosexual') {
        if (gender == 'Man') {
            lookFor('Man', 'Homosexual', 'Bisexual', req.session.profile.id, (result) => { return callback(result); })
        }
        else if (gender == 'Woman') {
            lookFor('Woman', 'Homosexual', 'Bisexual', req.session.profile.id, (result) => { return callback(result); })
        }
    }
}
function compleAccount(req, res, profile) {

    if (!profile.gender || !profile.bio || !profile.orientation || profile.age <= 0 || profile.profileImg == '/img/default.jpg') {
        res.render('pages/profile', { notif: notifications, error: 'Complete profile first', profile: profile, like: 'none', visit: 'none' })
        return 0
    }
    else
        return 1
}
if (!compleAccount(req, res, req.session.profile) == 0) {
    sexPreference(req.session.profile.orientation, req.session.profile.gender, (result) => {
    
    isActivated(result)
    res.render('pages/loveField', { profile: req.session.profile, users: result, notif: notifications })
})
}
