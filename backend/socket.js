socket.on('room', (user_id, secondUsrId) => {
    if (user_id > secondUsrId)
        room = user_id + secondUsrId;
    else
        room = secondUsrId + user_id;
    socket.join(room);
});

socket.on('connectedUser', (userName, user_id, secondUsrId) => {
    socket.userName = userName;
    socket.user_id = user_id;
    socket.secondUsrId = secondUsrId;
    io.to(room).emit('connectedUser', userName);
});


function messageContent(user_id, secondUsrId, name) {
    conn.query('SELECT * FROM block WHERE user_id = ? AND secondUsrId = ?', [secondUsrId, user_id], (err, block) => { if (err) throw err 
        if (block.length == 0)
        {
            var msg = 'message from ' + name
            conn.query('INSERT INTO notifications (user_id, secondUsrId, notif) VALUES (?, ?, ?) ', [secondUsrId, user_id, msg], (err) => { if (err) throw err })
        }
    })
}

socket.on('message', (message, room) => {
    message = escapehtml(message);
    conn.query("INSERT INTO `messages` (message, user_id, secondUsrId) VALUES (?,?,?)", [message, socket.user_id, socket.secondUsrId], (err) => { 
        if (err) throw err;
        messageContent(socket.user_id, socket.secondUsrId, socket.userName)
        io.to(room).emit('message', {userName: socket.userName, message: message});
    });
});

