
  var i = 0;
  var firstname = 'testdummy'
  var username ='dummyyy'
  var password = '$2b$10$WvHZIu2deDVPyw8lyZPO8ee/ah1NsiWBYA37gzwaS28/O1ybtS70G'
  var    confirm = 1;
  var   name = 'dummy';
  var    email ='dummy@email.com';
  var    key = '88497';
  var    gender = 'female';
  var    orientation = 'Heterosexual';
  var    bio = 'dummy account';
  var    age = '21';
  var   score = 5;
  var  img1 = '/img/default.jpg'
      
  while (i < 500) {

      sql = 'INSERT INTO `users` (`username`, `firstname` , `name`, `password`, `email`, `confirmkey`, `confirm`, `gender`, `orientation`, `bio`, `age`, `score`, `img1`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      conn.query(sql, [username, firstname, name, password, email, key, confirm, gender, orientation, bio, age,
       score, img1], function (err, result) { if (err) throw err })
       i++;

  };
  res.render('pages/login.ejs', {req: req})