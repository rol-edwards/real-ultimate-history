var express = require('express'),
	path = require('path'),
	event = require(path.join(__dirname, '../models/event_model.js')),
	bodyParser = require('body-parser'),
	gatekeeper = require('../gatekeeper.js');
	router = new express.Router();



router.route('/events')
.get(function(req, res, next){
	var query = {};
	if (Object.keys(req.query) != 0){
		query.name = req.query.name;
		query.date = req.query.date;
		query.location = req.query.location;
		query.dob = req.query.dob;
		query.dod = req.query.dod;
		query.number = req.query.number;
	}
	console.log('event_routes: getting events');
	event.find(query, function(data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});

router.route('/event_byname/:name')
.get(function(req, res, next){
	event.getByName(req.params.name, function(data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});

//probably not needed
router.route('/event/duplicates/:event').
get(function(req, res, next){
	event.checkDuplicates(req.params.event, function(data){
		console.log('event_routes: duplicate list fetched');
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});

router.route('/person/events/:dob/:dod')
	.get(bodyParser.json(), function(req, res, next){
		console.log('find event router reached');
		var input = {dob: req.params.dob, dod: req.params.dod};
		person.findPossEvents(input, function(data){
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		});
	});

///////

router.route('/event')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	console.log('new event router working');
	input = req.body;
	event.create(input, function(data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});

router.route('/event/:id')
.get(function (req, res, next) {
	console.log('event_routes: searching for ' + req.params.id);
	event.findById (req.params.id, function (data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});
	
router.route('/event/:id')
.put(gatekeeper, bodyParser.json(), function(req, res, next){
	console.log('edit event router working ' + req.params.id);
	input = req.body;
	event.update(input, req.params.id, function(data){
		res.send('event updated');
	});
});

router.route('/event/:id')
.delete(function(req, res, next){
	event.delete(req.params.id, function(data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
});

router.route('/upload/event/:id')
.post(function(req, res, next){
	var id = req.params.id;
	let pic = req.files.pic;
	pic.mv(path.join(__dirname, '../../front-end/images/event' + id + '.jpg'), function(err){
		if (err)
			return res.status(500).send(err);

		res.send('file uploaded');
	});
});


module.exports = router;