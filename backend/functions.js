module.exports = {

    myLikes: (conn, user_id, callback) => {
        conn.query('SELECT * FROM likes WHERE secondUsrId = ?', [user_id], (err, row) => {
            if (err) throw err
            if (row.length == 0)
                return callback('none')
            var i = 0; ids = '(';
            while (row[i]) {
                ids += row[i].user_id;
                i++;
                if (row[i])
                    ids += ', ';
            } ids += ')'
            conn.query("SELECT * from `users` where `id` IN " + ids, (err, like) => {
                if (err) throw err
                return callback(like);
            })
        })
    },

    myNotifications: (conn, id, callback) => {
        conn.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY date DESC LIMIT 20', [id], (err, notifications) => {
            if (err) throw err
            if (notifications.length == 0)
                return callback(id);
            else
                return callback(notifications);
        })
    },

    myVisitors: (conn, user_id, callback) => {
        conn.query('SELECT * FROM `visits` WHERE secondUsrId = ? ',[user_id], (err, row) => {
            if (err) throw err
            if (row.length == 0)
                return callback('none')
            var i = 0; ids = '(';
            while (row[i]){
                ids += row[i].user_id
                i++;
                if (row[i])
                    ids += ', '
            } 
            ids += ')'
            conn.query("SELECT * FROM `users` WHERE `id` IN" + ids, (err, visit) => {
                if (err) throw err
                return callback(visit);
            })
            })
        }, 
 checkmatch: (con, user_id, secondUsrId, callback) => {
    var a = 0
    var b = 0
     con.query('SELECT * FROM likes WHERE user_id = ? AND secondUsrId = ?', [user_id, secondUsrId], (err, rows) => { if (err) throw err 
        if (rows.length == 1)
            a = 1;       
        con.query('SELECT * FROM likes WHERE user_id = ? AND secondUsrId = ?', [secondUsrId, user_id], (err, rows) => { if (err) throw err 
        if (rows.length == 1)
            b = 1;
        if (a == 1 && b == 1)
            return callback(1);
        else
            return callback(0);
     }) })
}}

