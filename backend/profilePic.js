uploadPic()

function updatePic(column, change)
{
    var sql = 'UPDATE users SET ' + column + ' = ? WHERE id = ?'
    conn.query(sql, [change, req.session.profile.id], (err) => { if (err) throw err })
    req.session.profile[column] = change
    functions.myLikes(conn, req.session.profile.id, (like) => {
        functions.myVisitors(conn, req.session.profile.id, (visit) => {
    res.render('pages/profile',{profile: req.session.profile, notif: notifications, visit: visit, like: like})})})
}

function uploadPic(){
    var form = new formidable.IncomingForm()
    form.parse(req, (err, field, files) => { if (err) throw err;
        if (field.profileImg !== 'Upload Image')
        {
            console.log('image server problem');
            return ;
        }
        
        var name = 'profileImg';
        var dir =  __dirname + '/public/img/users/' + req.session.profile.id;
        
         var oldpath = files.file.path;
            newpath = dir + '/' + name;
            fs.readFile(oldpath, (err, data) => { if (err) throw err; 
            fs.writeFile(newpath, data, (err) => { if (err) throw err; }); });
            updatePic(name, '/img/users/' + req.session.profile.id + '/' + name);
    })
}