var express = require('express'),
	path = require('path'),
	person = require(path.join(__dirname, '../models/person_model.js')),
	bodyParser = require('body-parser'),
	gatekeeper = require('../gatekeeper.js'),
	router = new express.Router(),
	fileUpload = require('express-fileupload'),
	path = require('path'),
	AppError = require(path.join(__dirname, '../app_error.js'));

router.route('/people')
.get(function(req, res, next){
	var query = {};
	if (Object.keys(req.query) != 0){
		query.name = req.query.name;
		query.role = req.query.role;
		query.dob = req.query.dob;
		query.dod = req.query.dod;
		query.bio = req.query.bio;
		query.nation = req.query.nation
		query.number = req.query.number;
		query.date = req.query.date;
	}
	person.find(query, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

//separated from above to keep search function efficient
router.route('/person_byName/:name')
.get(function(req, res, next){
	person.getByName(req.params.name, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

router.route('/person')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	var input = {};
	input.name = req.body.name;
	input.dob = req.body.dob;
	input.dod = req.body.dod;
	input.bio = req.body.bio;
	input.nation = req.body.nation;
	input.role = req.body.role;

	person.create(input, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

router.route('/person/:id')
.put(bodyParser.json(), function(req, res, next){
	var input = {};
	input.name = req.body.name;
	input.dob = req.body.dob;
	input.dod = req.body.dod;
	input.bio = req.body.bio;
	input.nation = req.body.nation;
	input.role = req.body.role;
	console.log('bio is ' + input.bio)

	person.update(input, req.params.id, function(data){
		res.send('Edits made');
	});
})

.get(function(req, res, next) {
	person.findById(req.params.id, function(data) {
			if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
		}
	);
})

.delete(function(req, res, next){
	person.delete(req.params.id, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});

router.route('/people_count/')
.get(function(req, res, next){
	person.count(function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
});


router.route('/upload/person/:id')
.post(function(req, res, next){
	var id = req.params.id;
	let pic = req.files.pic;
	pic.mv(path.join(__dirname, '../../front-end/images/' + id + '.jpg'), function(err){
		if (err)
			return res.status(500).send(err);

		res.send('file uploaded');
	});
});

module.exports = router;
