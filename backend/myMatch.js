function isMatch(myId, callback) {
    conn.query('SELECT * FROM likes WHERE user_id = ?', [myId], (err, row1) => {
        if (err) throw err
        conn.query('SELECT * FROM likes WHERE secondUsrId = ?', [myId], (err, row2) => {
            if (err) throw err
            if (row1.length == 0 || row2.length == 0)
                return callback('none');
            var a = 0; i = 0;
            id = new Array();
            while (row1[a]) {
                var b = 0;
                while (row2[b]) {
                    if (row1[a].secondUsrId == row2[b].myId) {
                        id[i] = row1[a].secondUsrId;
                        i++;
                    }
                    b++;
                }
                a++;
            }
            if (!id[0])
                return callback('none')
            var i = 0; id_2 = '('
            while (id[i]) {
                id_2 += id[i];
                i++;
                if (id[i])
                    id_2 += ', ';

            } id_2 += ')'
            return callback(id_2)
        })
    })
}

isMatch(req.session.profile.id, (machedUsersId) => {
    if (machedUsersId == 'none') {
        res.render('pages/myMatch', { req: req, match: 'none', notif: notifications })
    }
    else {
        conn.query("SELECT * from `users` where `id` IN " + machedUsersId, (err, matchs) => {
            if (err) throw err
            res.render('pages/myMatch', { req: req, match: matchs, notif: notifications })
        })
    }
})