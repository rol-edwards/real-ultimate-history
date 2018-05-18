<template>	
	<div>
		<div v-show='!changes_made'>
			<h1>Edit person</h1>
			<figure>
				<img v-bind:src="'../images/' + id + '.jpg'">
			</figure>
			<div v-show='!event_list_visible'>
				<div>
					<input type='text' id='name' v-model='name' ></input>
					<label for='name'>Name</label>
				</div>
				<div>
					<label for='dob'>Date of birth</label>
					<input type='text' id='dob' v-model='dob.number' ></input>
					<div>
						<input type='radio' v-model='dob.era' value='BC' id='BC' >BC</input>
						
						<input type='radio' v-model='dob.era' value='AD' id='AD' >AD</input>
					</div>				
				</div>
				<div v-if="dob.era=='AD'">
					<label for='dod'>Date of death (AD)</label>
					<input type='text' id='dod' v-model='dod.number'></input>
				
				</div>
				<div v-else>
					<label for='dod'>Date of death </label>
					<input type='text' id='dod' v-model='dod.number'></input>
					<div>
						<input type='radio' v-model='dod.era' value='BC' id='BC'>BC</input>
						<input type='radio' v-model='dod.era' value='AD' id='AD'>AD</input>
					</div>
				</div>
				<div>
					<input type='text' id='bio' v-model='bio' ></input>
					<label for='bio'>Biography</label>
				</div>
				<div>
					<input type='text' id='nation' v-model='nation' ></input>
					<label for='nation'>Nationality</label>
				</div>
				<div>
					<select id='cat' v-model='role' >
						<option value='Political'>Political</option>
						<option value='Military'>Military</option>
						<option value='Philosopher'>Philosophical</option>
						<option value='Religious'>Religious</option>
					</select>
					<label for='cat'>Primary role</label>
				</div>
				<div>
					<button v-on:click='date_checks(dateToNumber(dob), dateToNumber(dod), update_person)' v-show='!event_list_visible'>Submit</button>
					<button v-show='event_list_visible' v-on:click='amend'>Amend</button>
				</div>
			</div>

			<div v-show='event_list_visible'>
		 		<h2>Events</h2>
		 		<p>Select from existing events during this person's lifetime</p>
		 		<div v-for='event in events'>
		 			<input type='checkbox' v-model='ticked_events[event.id]'>{{event.name}} {{event.id}}</input>
		 			<input type='text' id='role' v-show='ticked_events[event.id]' v-model='roles[event.id]'></input>
		 			<label for='role' >Role</label>
				</div>	
				<button v-on:click='update_events'>Submit</button>
			</div>
			<div v-show='events_updated'>
			    <form ref='uploadForm' 
			      id='uploadForm' 
			      method='post' 
			      encType="multipart/form-data">
			        <input id='picture' type="file" name='pic'/>
			        <input type='submit' value='Upload!' />
			    </form>     
			</div>
		</div>
		<div v-show='changes_made'>
			<h1>Changes made!</h1>
			<p><a v-bind:href='"/#/person/" + id'>Return to person</a></p>
		</div>
	</div>
</template>

<script>


module.exports = {

	data: function () {
		return{
			id: this.$route.params.id,
			ticked_events: {},
			//existing_ids: [],
			roles: {},
			existing_events: [],
			events: [],
			event_list_visible: false,
			changes_made: false,
			events_updated: false,

			//person details:
			name: 'placeholder',
			dob: 'placeholder',
			dod: 'placeholder',
			nation: 'placeholder',
			bio: 'placeholder',
			role: 'placeholder',
			person: 'placeholder',
			

			//imported modules:
			date_checks: require('../utilities/date_checks.js'),
			dateToNumber: require('../utilities/date_to_number.js'),
			authenticate: require('../authenticate.js'),
			numberToDate: require('../utilities/number_to_date_object.js')
		};
	},
	
	created: function() {
		this.authenticate(this.on_created)
	},

	methods: {
		
		//populates input fields with current information
		on_created: function(option){
		if (option == 'false'){
			this.$router.push('/login');
		}
		this.$emit('login');
		this.$http.get('/api/person/' + this.id)
		.then(function(data){
			console.log('info requested for editing');
			console.log(data.body[0] + 'for editing');
			this.person = data.body[0];
			this.name = this.person.name;
			this.nation = this.person.nation;
			this.bio = this.person.bio;
			this.role = this.person.role;
			this.dob = this.numberToDate(this.person.dob);
			this.dod = this.numberToDate(this.person.dod);
			})
		},

		//submits ammended person information and creates a checklist of events within person's lifetime, with already
		//associated events pre-ticked
		update_person: function(){
			this.$http.put('api/person/' + this.id, {name: this.name, dob: this.dateToNumber(this.dob), dod: this.dateToNumber(this.dod), bio: this.bio, nation: this.nation, role: this.role})
			.then(function(data){
				console.log('person data.body submitted');
				console.log('getting list of possible events between ' + this.dateToNumber(this.dob) + ' and ' + this.dateToNumber(this.dod));

				//create an array of events within the person's lifetime
				this.$http.get('api/events/?dob=' + this.dateToNumber(this.dob) + '&dod=' + this.dateToNumber(this.dod))
				.then(function(data){
					console.log('event list created');
					this.events = data.body;
					console.log('Possible events are...')
					//console.log them for reference
					this.events.forEach(function(event){
						console.log(event);
					});

					//get an array of events already associated with person
					this.$http.get('/api/people_events/?id=' + this.id + '&table=events')
					.then(function(data) {
						console.log('getting ids and roles already associated');
						this.existing_events = data.body;
						ticked_events = {};
						roles = {};
						this.existing_events.forEach(function(event){
							this.ticked_events[event.id] = true;
								this.roles[event.id] = event.role;
						})
						this.ticked_events = ticked_events;
						this.roles = roles;
						this.event_list_visible = true;

						
					});
				})
			});
		},

		amend: function(){
			this.event_list_visible = false;
		},

		//submits ammended list of events and the person's role in them
		update_events: function(){
			ticked_ids = [];

			//create an array of ticked events from the 'true' properties of 'ticked_events'
			for(var box in ticked_events){
				if (ticked_events[box]) {
					ticked_ids.push(Number(box));
				};
			};

			//delete all existing event associations for this person
			console.log('id-list is: ' + ticked_ids);
			this.$http.delete('api/people_events/?table=events&id=' + this.id)
			.then(function(data){
				console.log('deletions made');
				
				//create new event associations for the person, including roles
				roles = this.roles;
				$http = this.$http;
				id = this.id;
				count = 0;
				if (ticked_ids.length > 0){
					ticked_ids.forEach(function(eventId){
						this.$http.post('api/people_events', {person_id: this.id, event_id: eventId, role: roles[eventId]})
						.then(function(data){
							console.log('event added to person' + ticked_ids.length + count);
							count += 1;//why doesn't it have to be this.count?
							if(count >= ticked_ids.length){
								console.log('changes made');
								this.events_updated = true;
							}
						})
					})
				}
				else {
					this.events_updated = true;
				}
				document.getElementById('uploadForm').setAttribute('action', 'http://localhost:3000/api/upload/person/' + this.id);

			})
		}
	}
}
</script>
