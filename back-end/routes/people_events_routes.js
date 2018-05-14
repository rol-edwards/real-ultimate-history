var express = require('express'),
	path = require('path'),
	person = require(path.join(__dirname, '../models/person_model.js')),
	event = require(path.join(__dirname, '../models/event_model.js')),
	bodyParser = require('body-parser'),
	gatekeeper = require('../gatekeeper.js'),
	router = new express.Router();


router.route('/people_events')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	console.log('person_routes: reached router for second stage of submit2');
	var input = {};
	input.person_id = req.body.person_id;
	input.event_id = req.body.event_id;
	input.role = req.body.role;
	console.log(req.body);
	person.addEvents(input, function(data){
		console.log('person_routes: events added to person');
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	});
})

router.route('/people_events')
.get(function(req, res, next) {
	console.log('get pe router reached')
	var query = {};
	query.id = req.query.id;
	if (req.query.table == 'events'){
		console.log('people_events_routes: looking for events for person ' + query.id);
		person.findEvents(query.id, function(data){
			
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		});
	}
	else {
		console.log('people_events_routes: looking for people for event')
		event.findPeople(query.id, function(data){
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		})
	}
});

/*router.route('/event/people/:id').
	get(function(req, res, next) {
		console.log('event_routes: seeking people for event' + req.params.id);
		event.findPeople (req.params.id, function(data){
			
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		});
	});*/


///////////////////////

///This requires some changes to person model. It's not clear what model to use? Should people_events have its
//own model? Maybe I should get rid of these routes and follow convention as Bill said was a possibility.
router.route('/people_events')
.delete(function(req, res, next){
	console.log('people_events_routes: delete reached' + req.query.person_id)
	if (req.query.person_id){
		console.log('if clause worked')
		person.deleteEvents(req.query.person_id, function(data){
			console.log('person_event_routes: callback called, deletions made');
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);

		});
	}
	else {
		event.deletePeople(req.query.event_id, function(data){
			console.log('person_event_routes: callback called, deletions made');
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		});
	}
})


router.route('/add-people')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	console.log('router adding people to event');
	input = req.body;
	event.addPeople(input, function(data){
		if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
	})
})

module.exports = router;