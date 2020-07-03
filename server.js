var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var session = require('express-session')
var mysql = require('mysql')
var fs = require('fs')
var escapehtml = require('htmlspecialchars')
var bcrypt = require('bcrypt')
var validator = require('validator')
var mailer = require("nodemailer")
var rand = require("random-key")
var html = require('html')
var formidable = require('formidable')
http = require("http")
var server = http.createServer(app);
var io = require("socket.io").listen(server);
functions = require("./backend/functions.js")
var request = require('request');

app.set('view engine', 'ejs')

var conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "qwerty"
})

conn.connect( (err) => {
    if (err) throw err
    eval(fs.readFileSync(__dirname + "/backend/database.js") + '')
})

var user = new Array;

io.sockets.on('connection', (socket) => {
    eval(fs.readFileSync(__dirname + "/backend/socket.js") + '')
})

server.listen(3000, () => {
    console.log("port 3000 baybay");
})


urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))



app.get('/', (req, res) => {
    if (req.session.profile == undefined)
        res.render('pages/login')
    else
        res.redirect('/profile')
})
app.get('/login', (req, res) => {
        if (req.session.profile == undefined)
            res.render('pages/login')
        else
            res.redirect('/profile')
    })
app.get('/register', (req, res) => {
        if (req.session.profile == undefined) {
            res.render('pages/register')
        }
        else {
            res.redirect('/profile')
        }
    })
app.get('/forget_password', (req, res) => {
        if (req.session.profile == undefined) {
            res.render('pages/forget_password')
        }
        else {
            res.redirect('/profile')
        }
    })
app.get('/logout', (req, res) => {
        req.session.destroy()
        req.session = 0;
        res.redirect('/')
    })

app.get('/confirm', (req, res) => {
        eval(fs.readFileSync(__dirname + "/backend/confirm.js") + '')
    })

app.all('/loveField', urlencodedParser, (req, res) => {
        if (req.session.profile == undefined)
            res.redirect('/')
        else {
            functions.myNotifications(conn, req.session.profile.id, (notifs) => {
            eval(fs.readFileSync(__dirname + "/backend/loveField.js") + '')})
        }
    })

app.get('/seed' ,(req, res) => {
        eval(fs.readFileSync(__dirname + "/backend/seed.js") + '')
        console.log(res);
    })

app.get('/public_profile', (req, res) => {
        res.render('pages/public_profile.ejs', {tag: req.session.profile.tag, req: req, profile: req.session.profile, like: -1, online: 1 })
    })

app.get('/myMatch', (req, res) => {
        functions.myNotifications(conn, req.session.profile.id, (notifs) => {
        eval(fs.readFileSync(__dirname + "/backend/myMatch.js") + '')})
    })

app.get('/chat/:id', (req, res) => {
        if (req.session.profile == undefined) {
            res.redirect('/')
        }
        else {
            conn.query("SELECT * from `users` where id = ?", [req.params.id], ( err, user2 ) => { if (err) throw err
                conn.query('SELECT * FROM `chat` WHERE user_id = ? OR secondUsrId = ?', [req.params.id, req.params.id], (err, chat) => { if (err) throw err 
                functions.checkmatch(conn, req.session.profile.id, req.params.id, (match) => {
                    if (match == 0)
                        res.redirect('/')
                    else {
                        functions.myNotifications(conn, req.session.profile.id, (notifs) => {
                    res.render('pages/chat', { req: req, user2: user2[0], chat: chat, notif: notifs})
                })
            }
            })
        })
    })
}
    })
               // 6105010940089         8703175728089
app.post('/', (req, res) => {
    if (req.body.message === undefined || req.body.message === '') {
        res.redirect('/')
    }
})
app.post('/register', urlencodedParser, (req, res) => {
        eval(fs.readFileSync(__dirname + "/backend/register.js") + '')
    })
app.post('/forget_password', urlencodedParser, (req, res) => {
        eval(fs.readFileSync(__dirname + "/backend/forget_password.js") + '')
    })
app.all('/login', urlencodedParser, (req, res) => {
        if (req.session.profile != undefined) {
            res.redirect('/profile', { i: i })
        }
        else
            eval(fs.readFileSync(__dirname + "/backend/login.js") + '')
})
app.all('/profile', urlencodedParser, (req, res) => {
    functions.myNotifications(conn, req.session.profile.id, (notifs) => {
        eval(fs.readFileSync(__dirname + "/backend/profile.js") + '')
    })
})
app.post('/profilePic', (req, res) => {
        functions.myNotifications(conn, req.session.profile.id, (notifs) => {
        eval(fs.readFileSync(__dirname + "/backend/profilePic.js") + '')
        })
})
app.all('/user_profile/:id', urlencodedParser, (req, res) => {
        functions.myNotifications(conn, req.session.profile.id, (notifs) => {
        eval(fs.readFileSync(__dirname + "/backend/public_profile.js") + '')
        })
})