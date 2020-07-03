UploadImage()

function updateuser(column, change)
{
    var sql = 'UPDATE users SET ' + column + ' = ? WHERE id = ?'
    conn.query(sql, [change, req.session.profile.id], function (err) { if (err) throw err })
    req.session.profile[column] = change
    functions.getlikes(conn, req.session.profile.id, function (like) {
        functions.getvisits(conn, req.session.profile.id, function (visit) {
            var success = 'image changed';
    res.render('pages/profile',{success: success,profile: req.session.profile, notif: notifs, visit: visit, like: like})})})
}

function UploadImage(){
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, field, files) { if (err) throw err;
        if (field.profileImg !== 'Upload Image')
        {
            console.log('image server problem');
            return ;
        }
        
        var name = 'profileImg';
        var dir =  __dirname + '/public/img/users/' + req.session.profile.id;
        
         var oldpath = files.file.path;
            newpath = dir + '/' + name;
            fs.readFile(oldpath, function (err, data) { if (err) throw err; 
            fs.writeFile(newpath, data, function (err) { if (err) throw err; }); });
            updateuser(name, '/img/users/' + req.session.profile.id + '/' + name);
    })
}