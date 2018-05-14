
<template>
	<div>
		<div v-show='!changes_made'>
			<div>
				<h1>Add an event</h1>
				<div>
					<input type='text' v-model='name' id='name'>Name of event</input>
					<label for='event'></label>
				</div>
				<div>
					<input type='text' v-model='date.number' id='date'>Date</input>
					<label for='date'></label>
					<div>
						<input type='radio' v-model='date.era' value='BC' id='BC'>BC</input>
						<input type='radio' v-model='date.era' value='AD' id='AD'>AD</input>
					</div>		
				</div>
				<div>
					<input type='text' v-model='location' id='location'>Location</input>
					<label for='location'></label>
				</div>
				<div>
					<input type='text' v-model='description' id='description'>Description</input>
					<label for='description'></label>
				</div>
				<div>
					<button v-on:click='get_duplicates'>Submit</button>
				</div>
			</div>
			<div v-show='dupes_checked'>
				<h2>Potential duplicates</h2>
				<p>The following events have the same name. Please check that you are not submitting a duplicate</p>
				<table>
					<tr v-for='d in duplicates'>
						<td>{{d.event}}</td>
						<td>{{d.date}}</td>
						<td>{{d.description}}</td>
					</tr>
				</table>
				<button v-on:click='submit_event'>Submit</button>


				<div v-show='submitted'>
					<h2>People</h2>
					<p>Please select the people involved in this event, or add new people</p>
					<div v-for='person in people'>
						<input type='checkbox' v-model='boxes[person.id]'>{{person.name}}</input>
						<input type='text' v-show='boxes[person.id]' v-model='roles[person.id]' id='role'>
						<label for='role' v-show='boxes[person.id]'>Role</label>

					</div>
					<button v-on:click='submit_people'>Submit</button>

				</div>
				<div v-show='events_updated'>
				    <form ref='uploadForm' 
				      id='uploadForm' 
				      method='post' 
				      encType="multipart/form-data">
				        <input id='picture' type="file" name='pic'/>
				        <input type='submit' value='Upload!' v-on:click='picture_submitted'/>
				    </form>     
				</div>
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
				list_returned: false,
				changes_made: false,
				boxes: {},
				roles: {},
				submitted: false,
				id: '',
				duplicates: '',
				dupes_checked: false,
				date: {},
				location: '',
				description: '',
				eventx: 'placeholder',

				//imported modules:
				dateToNumber: require('../modules/date_to_number.js'),
				authenticate: require('../authenticate.js')
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
					this.dupes_checked = true;
					console.log(this.duplicates)
				})
			},

			submit_event: function(){
			console.log('event create button pressed');
			this.$http.post('api/event', {name: this.name, date: this.dateToNumber(this.date), location: this.location, description: this.description})
			.then(function(data){
				document.getElementById('uploadForm').setAttribute('action', 'http://localhost:3000/api/upload/event' + this.event.id);
				console.log('new event created');
				this.event = data.body[0];
				console.log('event id is: '  + this.event.id);
			
				this.$http.get('api/people/?date=' + this.dateToNumber(this.date))
				.then(function(data){
					this.people = data.body;
				});
			});
			this.submitted = true;
			},	
		
			submit_people: function(){
			
				var id_list = [];
				for (box in this.boxes){
					if (box) {
						id_list.push(Number(box));
					};
				};
				id = this.id
				roles = this.roles
				$http = this.$http;
				event = this.event;
					id_list.forEach(function(person){
						this.$http.post('api/people_events', {person_id: person, event_id: this.event.id, role: this.roles[person]})
						.then(function(data){
							console.log('people added');
						})
					})
				this.changes_made = true;

			},
		}
	}
		
</script>

