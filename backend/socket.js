socket.on('send-chat-message', message => {
    console.log(message)
})

socket.on('setUserId', function (userId) {
    user[userId] = socket;
    socket.myid = userId;
})

socket.on('room', function (user_id, secondUsrId) {
    if (user_id > secondUsrId)
        room = user_id + secondUsrId;
    else
        room = secondUsrId + user_id;
    socket.join(room);
});

socket.on('connectedUser', function(userName, user_id, secondUsrId) {
    socket.userName = userName;
    socket.user_id = user_id;
    socket.secondUsrId = secondUsrId;
    io.to(room).emit('connectedUser', userName);
});


function notifmsg(user_id, secondUsrId, name) {
    conn.query('SELECT * FROM block WHERE user_id = ? AND secondUsrId = ?', [secondUsrId, user_id], function (err, block) { if (err) throw err 
        if (block.length == 0)
        {
            var msg = name +' HAS SENT YOU A NEW MESSAGE'
            conn.query('INSERT INTO notifs (user_id, secondUsrId, notif) VALUES (?, ?, ?) ', [secondUsrId, user_id, msg], function (err) { if (err) throw err })
            if (user[secondUsrId])
            {
                conn.query('SELECT date FROM notifs WHERE user_id=? AND secondUsrId=? AND notif=?', [secondUsrId, user_id, msg], function (err, date) { if (err) throw err 
                user[secondUsrId].emit('notification', {secondUsrId: user_id, not: msg, date:date[0].date}); })
            }
        }
    })
}

socket.on('message', function (message, room) {
    message = escapehtml(message);
    conn.query("INSERT INTO `chat` (message, user_id, secondUsrId) VALUES (?,?,?)", [message, socket.user_id, socket.secondUsrId], function (err) { 
        if (err) throw err;
        notifmsg(socket.user_id, socket.secondUsrId, socket.userName)
        io.to(room).emit('message', {userName: socket.userName, message: message}); 
    });
});

socket.on('disconnect', function(){
    conn.query('UPDATE users SET active=CURRENT_TIMESTAMP WHERE id=?', [socket.myid], function (err) { if (err) throw err })
    delete user[socket.myid];
});