<template>
	<div>
		<div v-show='!changes_made'>
			<h1>Edit event</h1>
			<div>
				<input type='text' v-model='event.name' id='name' >Name of event</input>
				<label for='event'></label>
			</div>
				<div>
				<input type='text' v-model='event.date.number' id='date' placeholder='date' >Date</input>
				<label for='date'></label>
				<div>
					<input type='radio' v-model='event.date.era' value='BC' id='BC'>BC</input>
					<input type='radio' v-model='event.date.era' value='AD' id='AD'>AD</input>
				</div>		
			</div>
				<div>
				<input type='text' v-model='event.location' id='location' placeholder='location' >Location</input>
				<label for='location'></label>
			</div>
				<div>
				<input type='text' v-model='event.description' id='description' placeholder='description' >Description</input>
				<label for='description'></label>
			</div>
			<div>
				<button v-on:click='submit1()' v-show='!list_returned'>Submit</button>
			</div>
			<div v-show='list_returned'>
				<h2>People to add</h2>
				<p>Select people involved or add new people</p>
				<div v-for='person in people'>
					<input type='checkbox' v-model='ticked_events[person.id]'>{{person.name}}</input>
					<input type='text' id='role' v-show='ticked_events[person.id]' v-model='roles[person.id]'>
					<label for='role'>Role</label>
				</div>
				<button v-on:click='submit2()'>Submit</button>
			</div>
		</div>
		<div v-show='changes_made'>
			<h1>Changes made!</h1>
			<p><a v-bind:href="'/#/event/' + id">Return to event</a></p>
		</div>
	</div>
</template>

<script>

	module.exports = {

		data: function () {
			return{
				event: '',
				people: [],
				id: this.$route.params.id,
				list_returned: false,
				changes_made: false,
				ticked_events: {},
				roles: {},
				existing_people: [],
				existing_ids: [],
				dateToNumber: require('../modules/date_to_number.js'),
				authenticate: require('../authenticate.js'),
				get_era_date: require('../modules/get_era_date.js')
			}
		},

		created: function() {
			this.authenticate(this.on_created)
		},

		methods: {

			on_created: function(option){
				if (option == 'false'){
					this.$router.push('/login');
				}
				this.$emit('login');
				console.log('edit-event page: at least something is happening');
				this.$http.get('/api/event/' + this.id)
				.then(function(data){
					console.log('event info for editing requested');
					this.event = data.body[0];
					console.log(this.event.date)
					this.event.date = this.get_era_date(this.event.date);
				});
			},

			submit1: function(){
				
				this.$http.put('api/event/' + this.id, {name: this.event.name, date: this.dateToNumber(this.event.date), location: this.event.location, description: this.event.description})
				.then(function(data){
					console.log('event updated');
				})
				//get 'people', an array of person data for people alive during event.
				this.$http.get('/api/people/?date=' + this.dateToNumber(this.event.date))
				.then(function(data){
					console.log('request made to router to get people');
					this.people = data.body;
					console.log(this.people);

					//get 'existing_people', an array of person data for people already associated with event
					this.$http.get('/api/people_events/?table=people&id=' + this.id)
					.then(function(data) {
						this.existing_people = data.body;
						console.log('existing_people: ' + data.body)
						
						//tick boxes and add roles
						roles = {};
						existing_ids = [];
						this.existing_people.forEach(function(person){
							this.roles[person.id] = person.role;
							this.existing_ids.push(Number(person.id));
							console.log('person id is: ' + person.id);

						});
						console.log('existing ids: ' + existing_ids) 
						this.existing_people = existing_people;
						roles = this.roles;
						ticked_events = {};
						console.log('existing_ids: ' + this.existing_ids)
						this.existing_people.forEach(function(person){
						console.log(person.id);
							this.ticked_events[person.id] = true;
							this.roles[person.id] = person.role
						});
						
						this.ticked_events = ticked_events;
						this.roles = roles;
					})
				})
				this.list_returned = true;
			},
			
			submit2: function(){
			
				var id_list = []; 
				for (event in this.ticked_events){
					if (ticked_events[event]) {
						id_list.push(Number(event));
					};
				console.log('id_list is: ' + id_list)
				};
				
				this.$http.delete('api/people_events/?event_id=' + this.id)
				.then(function(){
					id = this.id;
					roles = this.roles;
					$http = this.$http;
					id_list.forEach(function(person){
						this.$http.post('api/people_events', {person_id: person, event_id: this.id, role: this.roles[person]})
						.then(function(data){
							console.log('people added');
						});
					});
				})
				this.changes_made = true;
			}
		}
	}
</script>