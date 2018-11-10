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
	event.find(query, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

//separated from above to keep search function efficient
router.route('/event_byName/:name')
.get(function(req, res, next){
	event.getByName(req.params.name, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

///////

router.route('/event')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	input = req.body;
	event.create(input, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

router.route('/event/:id')
.get(function (req, res, next) {
	event.findById (req.params.id, function (data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
})

.put(gatekeeper, bodyParser.json(), function(req, res, next){
	input = req.body;
	event.update(input, req.params.id, function(data){
		res.send('event updated');
	});
})

.delete(function(req, res, next){
	event.delete(req.params.id, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
})

router.route('/upload/event/:id')
.post(function(req, res, next){
	console.log('beginning upload?')
	var id = req.params.id;
	let pic = req.files.pic;
	pic.mv(path.join(__dirname, '../../front-end/images/event' + id + '.jpg'), function(err){
		if (err)
			return res.status(500).send(err);
		console.log('image uploaded?')
		res.send('file uploaded');
	});
});


module.exports = router;