function userprofilevalidate(result) {
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
    result = result.filter(function (val, a, result) { return (val.valid == 1) })
    return (result);
}


function    blocked(result, myid, callback)
{
    conn.query('SELECT * FROM `block` WHERE user_id = ?', [myid], function(err, block) { if (err) throw err;
        var i = 0;
        if (block.length > 0)
        {
            while (block[i])
            {
                result = result.filter(function(val, a, result){return (val.id != block[i].secondUsrId)})
                i++;
            }
        }
        return callback(result)
    })
}
function finder(gender, orientation1, orientation2, myid, callback) {
    sql = 'SELECT * FROM users WHERE orientation = ? AND gender = ? AND id <> ?';
    vars = [orientation1, gender, myid]
    conn.query(sql, vars, function (err, result) {
        if (err) throw err
        sql = 'SELECT * FROM users WHERE orientation = ? AND gender = ? AND id <> ?';
        vars = [orientation2, gender, myid]
        conn.query(sql, vars, function (err, result2) {
            if (err) throw err
            result = result.concat(result2)
            blocked(result, myid, function(result){ return callback(result); });
        })
    })
}
////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function orientation(orientation, gender, callback) {
    if (orientation == "Heterosexual") {
        if (gender == "Man"){
            finder('Woman', 'Heterosexual', 'Bisexual', req.session.profile.id, function (result) { return callback(result) })
        }
        else if (gender == "Woman"){
            finder('Man', 'Heterosexual', 'Bisexual', req.session.profile.id, function (result) { return callback(result) })}
    }

    else if (orientation == 'Bisexual') {
        if (gender == 'Man') {
            finder('Man', 'Homosexual', 'Bisexual', req.session.profile.id, function (result1) {
                finder('Woman', 'Heterosexual', 'Bisexual', req.session.profile.id, function (result2) {
                    result = result1.concat(result2)
                    return callback(result);
                })
            })
        }
        else if (gender == 'Woman') {
            finder('Woman', 'Homosexual', 'Bisexual', req.session.profile.id, function (result1) {
                finder('Man', 'Heterosexual', 'Bisexual', req.session.profile.id, function (result2) {
                    result = result1.concat(result2)
                    return callback(result);
                })
            })
        }
    }

    else if (orientation == 'Homosexual') {
        if (gender == 'Man') {
            finder('Man', 'Homosexual', 'Bisexual', req.session.profile.id, function (result) { return callback(result); })
        }
        else if (gender == 'Woman') {
            finder('Woman', 'Homosexual', 'Bisexual', req.session.profile.id, function (result) { return callback(result); })
        }
    }
}





if (req.session.profile == undefined){
    res.redirect('/')
}
    
else {

    orientation(req.session.profile.orientation, req.session.profile.gender, (result) => { userprofilevalidate(result)
        
            res.render('pages/loveField', {profile: req.session.profile, users: result, notif: notifications })
        
    })
}