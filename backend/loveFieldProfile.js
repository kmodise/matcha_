function	check(table, user_id, secondUsrId, result)
{
	conn.query('SELECT * FROM ' + table + ' WHERE user_id = ? AND secondUsrId = ?', [user_id, secondUsrId], (err, rows) => { if (err) throw err 
		if (rows.length == 0){
			return result(0);
		}
		else{
			return result(1);
		}
	})
}

function	makeNotification(table)
{
	var name = req.session.profile.username;
	if (table == 'likes')
	{
		checklike(req.session.profile.id, req.params.id, (like) => {
			if (like == 1){
				notif(name +' LIKES YOU!');
			}
			else if (like == 3){
				notif('YOU MATCHED WITH ' + name + '!');
			}
		})
	}
	else if (table == 'dislike')
	{
		checklike(req.session.profile.id, req.params.id, (like) => {
			if (like == 2)
				notif('THIS USER IS NO LONGER A MATCH ' + name);
		})
	}
	else if (table == 'visits')
		notif(name + ' CHECKED YOU OUT :)');
}
function	notif(msg)
{
	
		conn.query('INSERT INTO notifications (user_id, secondUsrId, notif) VALUES (?, ?, ?) ', [req.params.id, req.session.profile.id, msg])
		
}

function score(val) {
	conn.query('SELECT `score` FROM `users` WHERE id = ?', [req.params.id], (err, score) => {
		if (err) throw err;
		score = score[0].score;
		if (val == 'add')
			score += 10;
		else if (val == 'subtract')
			score -= 10
		conn.query('UPDATE `users` SET score=?  WHERE id = ?', [score, req.params.id], (err, score) => { if (err) throw err; })
	})
}

function insertInto(table) {
	conn.query('INSERT INTO ' + table + ' (user_id, secondUsrId) VALUES (?,?) ', [req.session.profile.id, req.params.id], (err) => { if (err) throw err })
	makeNotification(table);
}
function removeFrom(table) {
	conn.query('DELETE FROM ' + table + ' WHERE user_id = ? AND secondUsrId = ?', [req.session.profile.id, req.params.id], (err) => { if (err) throw err })
	makeNotification('dislike');
}

function checklike(user_id, secondUsrId, result) {
	var a = 0
	var b = 0
	conn.query('SELECT * FROM likes WHERE user_id = ? AND secondUsrId = ?', [user_id, secondUsrId], (err, rows) => {
		if (err) throw err
		if (rows.length == 1)
			a = 1;

		conn.query('SELECT * FROM likes WHERE user_id = ? AND secondUsrId = ?', [secondUsrId, user_id], (err, rows) => {
			if (err) throw err
			if (rows.length == 1)
				b = 1;
			if (user_id == secondUsrId)
				return result(-1);
			else if (a == 0 && b == 0)
				return result(0);
			else if (a == 1 && b == 0)
				return result(1);
			else if (a == 0 && b == 1)
				return result(2);
			else if (a == 1 && b == 1)
				return result(3);
		})
	})
}

if (req.body.like == '') {
	checklike(req.session.profile.id, req.params.id, (like) => {
		if (like == -1 || like == 1 || like == 3)
			return;
		else {
			score('add')
			insertInto('likes')
		}
	})
}
if (req.body.dislike == '') {
	checklike(req.session.profile.id, req.params.id, (like) => {
		if (like == 0 || like == 2)
			return;
		else {

			score('subtract')
			removeFrom('likes')
		}
	})
}

if (req.body.block)
{
	check('block', req.session.profile.id, req.params.id, (block) => {
		if (block == 0)
			insertInto('block')
		else
			removeFrom('block')
	})
}

if ((req.session.profile.id != req.params.id) && !req.body.like && !req.body.dislike)
	insertInto('visits')

conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
	if (err) throw err
	if (result.length == 0)
		res.redirect('/')

	else {
		conn.query('SELECT * FROM tags WHERE user_id = ?', [req.params.id], (err, resultag) => {
			if (err) throw err
			checklike(req.session.profile.id, req.params.id, (like) => {
				check('block', req.session.profile.id, req.params.id, (block) => {
					
				res.render('pages/loveFieldProfile', {notif: notifications, block: block, req: req, like: like, profile: result[0], tag: resultag})
			})})
		})
	}
})




