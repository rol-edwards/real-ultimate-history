
<template>
	<div>
		<div v-show='!changes_made'>
			<h1>Add an event</h1>
			<div v-show='show_details'>
				<div>
					<table>
						<tr>
							<td>Name</td>
							<td><input type='text' id='name' v-model='name' ></input></td>
							<td></td>
						</tr>
						<tr>
							<td>Date</td>
							<td><input type='text' id='date' v-model='date.number'></input></td>
							<td><input type='radio' v-model='date.era' value='BC' id='BC' >BC</input>
								<input type='radio' v-model='date.era' value='AD' id='AD' >AD</input></td>
						</tr>
						<tr>
							<td>Location</td>
							<td><input type='text' id='location' v-model='location' ></input></td>
							<td></td>
						</tr>
					</table>
				<div>
					<h3>Description</h3>
					<textarea id='description' v-model='description'></textarea>
				</div>
				
					<div>
						<button v-on:click='get_duplicates'>Submit</button>
					</div>
				</div>
			</div>
			<div v-show='show_dupes'>
				<h2>Potential duplicates</h2>
				<p>The following events have the same name. Please check that you are not submitting a duplicate</p>
				<table>
					<tr v-for='d in duplicates'>
						<td>{{d.name}}</td>
						<td>{{d.date}}</td>
						<td>{{d.description}}</td>
					</tr>
				</table>
				<button v-on:click='submit_event'>Submit</button>

			</div>
			<div v-show='show_ppl'>
				<h2>People</h2>
				<p>Please select the people involved in this event, or add new people</p>
				<div v-for='person in people'>
					<input type='checkbox' v-model='boxes[person.id]'>{{person.name}}</input>
					<input type='text' v-show='boxes[person.id]' v-model='roles[person.id]' id='role'>
					<label for='role' v-show='boxes[person.id]'>Role</label>

				</div>
				<button v-on:click='submit_people'>Submit</button>

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
		</div>
	</div>
</template>

<script>

	module.exports = {

		data: function () {
			return{
				event: '',
				people: '',
				boxes: {},
				roles: {},
				id: '',
				duplicates: '',
				date: {},
				location: '', 
				description: '',
				eventx: 'placeholder',

				//imported modules:
				dateToNumber: require('../utilities/date_to_number.js'),
				authenticate: require('../authenticate.js'),
				config: require('../config.js'),

				show_details: true,
				show_ppl: false,
				show_image: false,
				show_dupes: false,
			}
		},

		created: function(){
			this.authenticate(this.check_login)
		},
	
		methods: {

			check_login: function(loggedin){
				if (loggedin == 'true'){
				console.log('show button called')
				this.$emit('login');
				return
				}	
				else {
					
					this.$router.push('/login');

				};
			},	
			//finds anything with the same name or date
			get_duplicates: function(){
				console.log('this.name is: ' + this.name)
				this.$http.get('api/events/?name=' + this.name + '&date=' + this.dateToNumber(this.date))
				.then(function(data){
					this.duplicates = data.body;
					if (this.duplicates.length == 0){
						console.log('there were no duplicates')
						this.show_details = false;
						this.submit_event(); 
					}
					else {
						this.show_details = false;
						this.show_dupes = true;
						
					}
				})
			},

			submit_event: function(){
				console.log('event create button pressed');
				this.$http.post('api/event', {name: this.name, date: this.dateToNumber(this.date), location: this.location, description: this.description})
				.then(function(data){
					this.event = data.body[0];
					document.getElementById('uploadForm').setAttribute('action', 'http://' + this.config.upload + '/api/upload/event/' + this.event.id);
					console.log('new event created');
					this.event = data.body[0];
					console.log('event id is: '  + this.event.id);
				
					this.$http.get('api/people/?date=' + this.dateToNumber(this.date))
					.then(function(data){
						this.people = data.body;
						console.log(this.people)
						this.show_dupes = false;
						this.show_ppl = true;
						console.log('submitted should be true now' + this.submitted)
					});
				});
			},	
			
			submit_people: function(){
			
				var ticked_ids = [];
				for (box in this.boxes){
					if (box) {
						ticked_ids.push(Number(box));
					};
				};
				id = this.id;
				roles = this.roles;
				$http = this.$http;
				event = this.event;
				count = 0;
				if (ticked_ids.length > 0){
					ticked_ids.forEach(function(person){
						this.$http.post('api/people_events', {person_id: person, event_id: this.event.id, role: this.roles[person]})
						.then(function(data){
							count += 1;
							if (count == ticked_ids.length){
								this.show_ppl = false;
								this.show_image = true;
								console.log('people added');
							}
							
						})
					})
				}

				else {
					this.show_ppl = false;
					this.show_image = true;
					console.log('people added');
				}	
			},

			finish: function(){
			this.changes_made = true;
			}
		}
	}
		
</script>

