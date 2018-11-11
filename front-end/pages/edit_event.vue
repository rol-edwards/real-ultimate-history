<template>
	<div>
		<div v-show='!changes_made'>
			<h1>Edit event</h1>
			<div v-show='show_details'>
				<table>
					<tr>
						<td>Name of event</td>
						<td><input type='text' v-model='event.name' id='name' ></input></td>
					</tr>
					<tr>
						<td>Date</td>
						<td><input type='text' id='date' v-model='event.date.number'></input></td>
						<td><input type='radio' v-model='event.date.era' value='BC' id='BC' >BC</input>
							<input type='radio' v-model='event.date.era' value='AD' id='AD' >AD</input></td>
					</tr>
					<tr>
						<td>Location</td>
						<td><input type='text' v-model='event.location' id='location' placeholder='location' ></input></td>
					</tr>
				</table>
				<div>
					<h3>Description</h3>
					<td><textarea type='text' v-model='event.description' id='description' placeholder='description'></textarea></td>
				</div>
				<div>
					<button v-on:click='submit_event()'>Submit</button>
				</div>
			</div>
			<div v-show='show_ppl'>
				<h2>People to add</h2>
				<p>Select people involved or add new people</p>
				<div v-for='person in people'>
					<input type='checkbox' v-model='ticked_events[person.id]'>{{person.name}}</input>
					<input type='text' id='role' v-show='ticked_events[person.id]' v-model='roles[person.id]'>
					<label for='role' v-show='ticked_events[person.id]'>Role</label>
				</div>
				<button v-on:click='submit_people()'>Submit</button>
			</div>
			<div v-show='show_image'>
				<p>Upload an image or click to finish
			    <form ref='uploadForm' 
			      id='uploadForm' 
			      method='post' 
			      encType="multipart/form-data">
			        <input id='picture' type="file" name='pic'/>
			        <input type='submit' value='Upload!' />
			    </form>    
			    <button v-on:click='finish'>Finish</button> 
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
				people_updated: false,

				//imported modules:
				dateToNumber: require('../utilities/date_to_number.js'),
				authenticate: require('../authenticate.js'),
				numberToDate: require('../utilities/number_to_date_object.js'),
				config: require('../config.js'),

				show_details: true,
				show_ppl: false,
				show_image: false,
			}
		},

		created: function() {
			this.authenticate(this.on_created)
		},

		methods: {

			//gets existing information for event to populate form
			on_created: function(option){
				if (option == 'false'){
					this.$router.push('/login');
				}
				this.$emit('login');
				//document.getElementById('uploadForm').setAttribute('action', 'http://' + this.config.upload + '/api/upload/event/' + this.id);
				console.log('edit-event page: at least something is happening');
				this.$http.get('/api/event/' + this.id)
				.then(function(data){
					console.log('event info for editing requested');
					this.event = data.body[0];
					console.log(this.event.date);
					this.event.date = this.numberToDate(this.event.date);
				});
			},

			//submits information from form, and creates a checklist of people alive at the time, with already
			//associated people checked and their roles stated.
			submit_event: function(){
				
				this.$http.put('api/event/' + this.id, {name: this.event.name, date: this.dateToNumber(this.event.date), location: this.event.location, description: this.event.description})
				.then(function(data){
					console.log('event updated');
				})
				document.getElementById('uploadForm').setAttribute('action', 'http://' + this.config.upload + '/api/upload/event/' + this.id);
				//get 'people', an array of data objects for people alive during event.
				this.$http.get('/api/people/?date=' + this.dateToNumber(this.event.date))
				.then(function(data){ 
					console.log('request made to router to get people');
					this.people = data.body;
					console.log(this.people);
					if (this.people.length == 0){
							this.show_details = false;
							this.show_image = true;
						}
					else {
						//get 'existing_people', an array of person data for people already associated with event
						this.$http.get('/api/people_events/?table=people&id=' + this.id)
						.then(function(data) {
							this.existing_people = data.body;
							console.log('existing_people: ' + data.body)
							
							//tick boxes and add roles
							
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
							this.show_details = false;
							this.show_ppl = true;
						})
					}
				})
			},
			
			//delete existing associations and submit all that are currently ticked
			submit_people: function(){
			
				var ticked_ids = []; 
				for (event in this.ticked_events){
					if (this.ticked_events[event]) {
						ticked_ids.push(Number(event));
					};
				console.log('ticked_ids is: ' + ticked_ids)
				};
				
				this.$http.delete('api/people_events/?table=people&id=' + this.id)
				.then(function(){
					id = this.id;
					roles = this.roles;
					$http = this.$http;
					count = 0;

					if (ticked_ids.length > 0){
						ticked_ids.forEach(function(person_id){
							this.$http.post('api/people_events', {person_id: person_id, event_id: this.id, role: this.roles[person_id]})
							.then(function(data){
								count += 1;
								if (count == ticked_ids.length){
									console.log('people added');
									this.show_ppl = false;
									this.show_image = true;
								}
								
							});
						});
					}
					else{
						this.show_ppl = false;
						this.show_image = true;
					}
					
				})
			},

			finish: function(){
				this.changes_made = true;
			}
		}
	}
</script>