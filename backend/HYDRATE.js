  var   i = 1;
  var   firstname = 'Dummy'
  var   password = '$2b$10$WvHZIu2deDVPyw8lyZPO8ee/ah1NsiWBYA37gzwaS28/O1ybtS70G'
  var   activate = 1;
  var   lastname = 'User';
  var   email ='dummy@email.com';
  var   key = '88497';
  var   gender = 'Woman';
  var   orientation = 'Heterosexual';
  var   bio = ' I don\'t reply to inbox ';
  var   age = ' 21 ';
  var   score = 50;
  


  while (i <= 100) {
      var   profileImg = '/img/str.png'
      username ='HeterosexualUser['+i+']'
      sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg],  (err, result) => { if (err) throw err })
      sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
      conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
      i++;
  };

  i = 0;

    while (i <= 100) {
    var   profileImg = '/img/lsb.jpg'
    username ='HomosexualUser[' + i + ']'
    gender = 'Woman';
    orientation = 'Homosexual';

    sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg], (err, result) => { if (err) throw err })
    sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
    conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
    i++;
};

i = 0;

while (i <= 50) {
  var   profileImg = '/img/bisex.png'
  username ='BisexualUser[' + i + ']'
  gender = 'Woman';
  orientation = 'Bisexual';

  sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg], (err, result) => { if (err) throw err })
  sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
  conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
  i++;
}

i = 0;

while (i <= 50) {
  var   profileImg = '/img/str.png'
  username ='HeteroUser[' + i + ']'
  gender = 'Man';
  orientation = 'Heterosexual';

  sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg], (err, result) => { if (err) throw err })
  sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
  conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
  i++;
}

i = 0;

while (i <= 100) {
  var   profileImg = '/img/gay.png'
  username ='HomosexualUser[' + i + ']'
  gender = 'Man';
  orientation = 'Homosexual';

  sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg], (err, result) => { if (err) throw err })
  sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
  conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
  i++;
}

i = 0;

while (i <= 100) {
  var   profileImg = '/img/bisex.png'
  username ='BisexualUser[' + i + ']'
  gender = 'Man';
  orientation = 'Bisexual';

  sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  conn.query(sql, [username, firstname, lastname, password, email, key, activate, gender, orientation, bio, age, score, profileImg], (err, result) => { if (err) throw err })
  sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
  conn.query(sql, ["gamming", i], (err, result) => { if (err) throw err })
  i++;
}

res.render('pages/login.ejs', {req: req})