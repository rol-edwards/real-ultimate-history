<template>	
	<div>
		<div v-show='!changes_made'>
			<h1>Add new person</h1>
			<!--<button v-on:click='checkEra()'>Check era</button>
			<button v-on:click='checkDOB()'>Check DOB</button>-->
			<table>
				<tr>
					<td>Name</td>
					<td><input type='text' id='name' v-model='name' ></input></td>
					<td></td>
				</tr>
				<tr v-if='dod.era=="BC"'>
					<td>Date of birth</td>
					<td><input type='text' id='dob' v-model='dob.number'></input></td>
					<td>BC</td>
				</tr>
				<tr v-else>
					<td>Date of birth</td>
					<td><input type='text' id='dob' v-model='dob.number'></input></td>
					<td><input type='radio' v-model='dob.era' value='BC' id='BC' >BC</input>
						<input type='radio' v-model='dob.era' value='AD' id='AD' >AD</input></td>
				</tr>
				<tr v-if='dob.era=="AD"'>
					<td>Date of death</td>
					<td><input type='text' id='dod' v-model='dod.number'></input></td>
					<td>AD</td>
				</tr>
				<tr v-else>
					<td>Date of death</td>
					<td><input type='text' id='dod' v-model='dod.number'></input></td>
					<td><input type='radio' v-model='dod.era' value='BC' id='BC' >BC</input>
						<input type='radio' v-model='dod.era' value='AD' id='AD' >AD</input></td>
				</tr>
				<tr>
					<td>Biography</td>
					<td><input type='text' id='bio' v-model='bio' ></input></td>
					<td></td>
				</tr>
				<tr>
					<td>Nationality</td>
					<td><input type='text' id='nation' v-model='nation' ></input></td>
					<td></td>
				</tr>
				<tr>
					<td>Primary role</td>
					<td><select id='cat' v-model='cat' >
						<option value='Political'>Political</option>
						<option value='Military'>Military</option>
						<option value='Philosopher'>Philosophical</option>
						<option value='Religious'>Religious</option>
					</select></td>
				</tr>
			</table>
			
				<button v-on:click='date_checks(dateToNumber(dob), dateToNumber(dod), duplicateCheck)' v-show='!duplicates_visible'>Submit</button>
			
			<div v-show='duplicates_visible'>
				<button v-on:click='amend()'>Amend</button>
				<h2>Potential duplicates</h2>
				<p>The people below have similar details to the person you are trying to input. Please check that you are not adding a duplicate person</p>
				<table>
					<tr>
						<th>Name</th>
						<th>Date of birth</th>
						<th>Date of death</th>
						<th>Biography</th>
						<th>Nation</th>
						<th>Principal role</th>
					</tr>
					<tr v-for='duplicate in duplicates'>
						<td>{{duplicate.name}}</td>
						<td>{{duplicate.dob}}</td>
						<td>{{duplicate.dod}}</td>
						<td>{{duplicate.bio}}</td>
						<td>{{duplicate.nation}}</td>
						<td>{{duplicate.role}}</td>
					</tr>
				</table>

				<button v-on:click='submit_person' v-show='!list_visible'>Confirm new person</button>
			</div>
			<div v-show='list_visible'>
		 		<h2>Events for {{person.id}}</h2>
		 		<p>Select from existing events during this person's lifetime, or add new events</p>
		 		<div v-for='event in events'>
		 			<input type='checkbox' v-model='boxes[event.id]'>{{event.name}}</input>
		 			<input type='text' id='role' v-show='boxes[event.id]' v-model='roles[event.id]'></input>
		 			<label for='role' v-show='boxes[event.id]'>Role</label>
				</div>	
				<button v-on:click='submit_events'>Submit</button>	
			</div>
			<div v-show='events_updated'>
				<p>Upload an image, or click to finish</p>
			    <form ref='uploadForm' 
			      id='uploadForm' 
			      method='post' 
			      encType="multipart/form-data">
			        <input id='picture' type="file" name='pic'/>
			        <input type='submit' value='Upload!' v-on:click='changes_made'/>
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
			events: 'placeholder',
			person: 'placeholder',
			list_visible: false,
			duplicates_visible: false,
			dob: {era: 'BC'},
			dod: {era: 'AD'},
			name: 'Tamerlane',
			id_list: [],
		    boxes: {},
			roles: {},
			dob_AD: true,
			duplicates: '',
			dupes1: [],
			dupes2: [],
			pic: 'placeholder',
			events_updated: false,
			changes_made: false,

			//imported modules
			date_checks: require('../modules/date_checks.js'),
			dateToNumber: require('../modules/date_to_number.js'),
			authenticate: require('../authenticate.js'),
			numberToDate: require('../modules/number_to_date.js'),
		}
	},

	created: function(){
		this.authenticate(this.check_login)
	},

	methods: {
		//redirects user to login if not logged in
		check_login: function(logged_in){
			if (logged_in == 'true'){
				console.log('upload should have changed')
				this.$emit('login');
				
				return
			}	
			else {
				this.$router.push('/login');
			};
		},		

		//creates list of possible duplicates, consisting of existing people with same name and/or same dob and dod
		duplicateCheck: function(){
			console.log('duplicate button pressed');
			
			//document.getElementById('picture').setAttribute('name', 'this.pic');

			//get people with same name and put into dupes1
			this.$http.get('api/people/?name=' + this.name)
				.then(function(data){
					this.dupes1 = data.body;

					//get people with same dob and dod and put into dupes2
					this.$http.get('api/people/?dob=' + this.dateToNumber(this.dob) + '&dod=' + this.dateToNumber(this.dod))
					.then(function(data){
						this.dupes2 = data.body;
						
						//concatenate dupes lists and remove repeated people
						this.duplicates = this.dupes1.concat(this.dupes2);
						id_list = [];
						submit_person = this.submit_person;
						clone = this.duplicates;
						this.duplicates.forEach(function(duplicate){
							if(!id_list[duplicate.id]){
								id_list.push(duplicate.id)
							}
							else{
								this.clone.shift(duplicate);
							}
						})
						this.duplicates = clone;
						console.log('these are the duplicates' + this.duplicates);

						//if there are duplicates, produce a list and reveal a button for next method, otherwise 
						//call next method
						if (!this.duplicates){
							console.log('duplicate check: nothing returned')
							this.submit_person();
						}
						else {
							//need to sort dates
							console.log('duplicate check: something returned')
							this.duplicates_visible = true;
						}
					})
				})
			
		},

		//submits information to create new person record, and gets an array of events within their lifetime
		submit_person: function(){
			this.$http.post('api/person', {name: this.name, dob: this.dateToNumber(this.dob), dod: this.dateToNumber(this.dod), bio: this.bio, nation: this.nation, role: this.cat})
				.then(function(data){
				this.person = data.body[0];
				console.log('new id? ' + this.person.id)
				console.log('post worked' + this.person);
				document.getElementById('uploadForm').setAttribute('action', 'http://localhost:3000/api/upload/person/' + this.person.id);
			})
			this.$http.get('api/events/?dob=' + this.dateToNumber(this.dob) + '&dod=' + this.dateToNumber(this.dod))
			.then(function(data){
				this.events = data.body;
				console.log(this.events);
				this.list_visible = true;
			})//not asynchronous?
		},

		//submits ticked events
		submit_events: function(){

			//takes an object 'boxes' consisting of event ids with booleans (provided by the user ticking associated
			//boxes), and pulls out an array of the 'true' ids
				for (var box in this.boxes){
				if(box) {
					this.id_list.push(Number(box));
				};
			};
			console.log('id_list is' + this.id_list)
			person = this.person;
			roles = this.roles;
			$http = this.$http;

			//creates person-event records, including the person's role in the event

			this.id_list.forEach(function(event_id){
				console.log('submitting an event')
				console.log('role: ' + this.roles[event_id] + ', person_id: ' + this.person.id)
				this.$http.post('api/people_events', {person_id: this.person.id, event_id: event_id, role: this.roles[event_id]})
				.then(function(data){
					console.log('events added to person');
				});
				
			});
			this.events_updated = true;
		},

		//
		amend: function(){
			this.duplicates_visible = false;
		},

		check_dob: function(dod, dob){
			if (dod.era == 'BC'){
				dob.era = 'BC'
			}

		},

		check_dod: function(dob, dod){
			if (dob.era == 'AD'){
				dod.era = 'AD'
			};
		},

		finish: function(){
			this.changes_made = true;
		}
	}
}


</script>

