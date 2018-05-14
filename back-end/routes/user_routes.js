
var express = require('express'),
	path = require('path'),
	user = require(path.join(__dirname, '../models/user_model.js'));
	bodyParser = require('body-parser');
	gatekeeper = require('../gatekeeper.js')
	router = new express.Router();

router.route('/login')
.post(bodyParser.json(), function(req, res, next){
	console.log('login router reache');

	user.findByUsername(req.body.username, function(data){
		if (!data) {
			res.send('username not found');
		}
		else { 
			userData = data[0];
			user.authenticate(req.body.password, userData, function(data){
				if (!data.pw) {
					res.send('Password incorrect. You have ' + data.loginAttempts + ' attempts left');
				}
				else{
					console.log('user_routes: ready to do stuff with sessions!')
					req.session.regenerate(function(){
						req.session.userId = userData.id;
						console.log('session id is: ' + req.session.userId);
						//res.json(data); //this is pointless except to make it work; does this give the front-end access to too much
						//info? Should I add a model function for deleting this?
						res.send('logged in');
					})
				}
			})
		}
	})
})

router.route('/logout')
.get(function(req, res, next){
	req.session.destroy(function(data){
		console.log('session ended')
		res.json(data)
	})
})

router.route('/user/new')
.post(bodyParser.json(), function(req, res, next){
	console.log('new user: router reached')
	user.isUsernameTaken(req.body.username, function(data){
		console.log('this is the data: ' + data.length)
		if (data.length == 0){
			console.log('name not taken')
			user.create(req.body.username, req.body.password, function(data){
				res.json(data);
			})
		}
		else {
			console.log('name taken')
		}
	})
})

router.route('/user/me')
.get(gatekeeper, function(req, res, next){
	console.log('user_routes: request made to authenticate');
	console.log('this is the session id: ' + req.session.userid)
	user.findById(req.session.userId, function(data){
		res.json(data)
	})
})

module.exports = router;