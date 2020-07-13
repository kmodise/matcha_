if (req.query.username && req.query.key){
    
  	sql = 'SELECT * FROM users WHERE username = ? AND vkey = ' + req.query.key
	conn.query(sql, [req.query.username, req.query.key], (error, result) => {
		if (error) throw error
    	if (result.length !== 0)
    	{
    		sql = 'UPDATE users SET activate = 1 WHERE username = ?'
			conn.query(sql, [req.query.username], (err) => { if (err) throw err })
             req.session = req.session
             req.session.username = req.body.username
    		res.render('pages/login')
 		}
		else{
			res.render('pages/register',{error: "Error"})
		}
    })
}
else{
	res.render('pages/register',{error: "Error"})
}