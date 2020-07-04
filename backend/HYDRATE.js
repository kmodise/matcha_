
  var   i = 1;
  var   firstname = 'testdummy'
  var   username ='dummyyy'
  var   password = '$2b$10$WvHZIu2deDVPyw8lyZPO8ee/ah1NsiWBYA37gzwaS28/O1ybtS70G'
  var   activate = 1;
  var   lastname = 'dummy';
  var   email ='dummy@email.com';
  var   key = '88497';
  var   gender = 'Woman';
  var   orientation = 'Heterosexual';
  var   bio = 'dummy account';
  var   age = '21';
  var   score = 5;
  var   profileImg = '/img/dummy.jpeg'

  while (i <= 500) {

      sql = 'INSERT INTO `users` (`username`, `firstname` , `lastname`, `password`, `email`, `vkey`, `activate`, `gender`, `orientation`, `bio`, `age`, `score`, `profileImg`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      conn.query(sql, [username, firstname, name, password, email, key, activate, gender, orientation, bio, age, score, profileImg], function (err, result) { if (err) throw err })
      sql = 'INSERT INTO `tags` (tag, user_id) VALUES (?,?)'
      conn.query(sql, ["gamming", i], function (err, result) { if (err) throw err })
      i++;

  };
  res.render('pages/login.ejs', {req: req})