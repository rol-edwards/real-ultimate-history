<template>	
	<div>
		<div v-show='!changes_made'>
			<h1>Add new person</h1>
			<div v-show='show_details'>
				<div>
					<table>
						<tr>
							<td>Name</td>
							<td><input type='text' id='name' v-model='name' ></input></td>
							<td></td>
							<td v-show='empty_name' class='empty'>Required field</td>
						</tr>
						<tr v-if='dod.era=="BC"'>
							<td>Date of birth</td>
							<td><input type='text' id='dob' v-model='dob.number'></input></td>
							<td>BC</td>
							<td v-show='empty_dob' class='empty'>Required field</td>
						</tr>
						<tr v-else>
							<td>Date of birth</td>
							<td><input type='text' id='dob' v-model='dob.number'></input></td>
							<td><input type='radio' v-model='dob.era' value='BC' id='BC' >BC</input>
								<input type='radio' v-model='dob.era' value='AD' id='AD' >AD</input></td>
							<td v-show='empty_dob' class='empty'>Required field</td>
						</tr>
						<tr v-if='dob.era=="AD"'>
							<td>Date of death</td>
							<td><input type='text' id='dod' v-model='dod.number'></input></td>
							<td>AD</td>
							<td v-show='empty_dod' class='empty'>Required field</td>
						</tr>
						<tr v-else>
							<td>Date of death</td>
							<td><input type='text' id='dod' v-model='dod.number'></input></td>
							<td><input type='radio' v-model='dod.era' value='BC' id='BC' >BC</input>
								<input type='radio' v-model='dod.era' value='AD' id='AD' >AD</input></td>
							<td v-show='empty_dod' class='empty'>Required field</td>

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
				</div>
				<div>
					<h3>Biography</h3>
					<textarea id='bio' v-model='bio'></textarea>
				</div>
				<br>
				<div >
					<button class='square' v-on:click='fieldCheck' v-show='!show_dupes'>Submit</button>
				</div>
			</div>
			<div v-show='show_dupes'>
				<button v-on:click='amend()'>Amend</button>
				<h2>Potential duplicates</h2>
				<p>The people below have similar details to the person you are trying to input. Please check that you are not adding a duplicate person</p>
				<table class='duplicates'>
					<tr>
						<th>Name</th>
						<th>DOB</th>
						<th>DOD</th>
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

				<button class='square' v-on:click='submit_person' v-show='!list_visible'>Confirm new person</button>
			</div>
			<div v-show='show_events'>
		 		<h2>Possible Events</h2>
		 		<p>Select from existing events during this person's lifetime, or add new events</p>
		 		<div v-for='event in events'>
		 			<input type='checkbox' v-model='boxes[event.id]'>{{event.name}}</input>
		 			<input type='text' id='role' v-show='boxes[event.id]' v-model='roles[event.id]'></input>
		 			<label for='role' v-show='boxes[event.id]'>Role</label>
				</div>	
				<button class='square' v-on:click='submit_events'>Submit</button>	
			</div>
			<div v-show='show_image'>
				<p>Upload an image if you want, or click 'finish'</p>
			    <form ref='uploadForm' 
			      id='uploadForm' 
			      method='post' 
			      encType="multipart/form-data">
			      <table>
			      	<tr>
			      		<td>
			        <input id='picture' type="file" name='pic' class='inputfile' data-multiple-caption="{count} files selected" multiple/>
			        <label for='picture'><img src='static_images/download.png' class='plus'><span>Choose file</span></label></td></tr>
			       <tr><td>
			        <input class='input' type='submit' value='Upload!' v-on:click='changes_made'/>
			    </td></tr>
			</table>
			    </form>     
			    <button class='finish' v-on:click='finish'>Finish</button>
			</div>
		</div>
		<div v-show='changes_made'>
			<h1>Changes made!</h1>
			<p><a v-bind:href="'/#/person/' + person.id">Return to person</a></p>
		</div>
	</div>
</template>	

<script>

module.exports = {
	
	data: function () {
		return{
			
			events: 'placeholder',
			person: '',
			name: '',
			list_visible: false,
			dob: {era: 'BC', number: ''},
			dod: {era: 'AD', number: ''},
			id_list: [],
		    boxes: {},
			roles: {},
			duplicates: '',
			dupes1: [],
			dupes2: [],
			pic: 'placeholder',
			events_updated: false,
			changes_made: false,

			show_details: true,
			show_events: false,
			show_image: false,
			show_dupes: false,

			empty_name: false,
			empty_dob: false,
			empty_dod: false,

			//imported modules
			date_checks: require('../utilities/date_checks.js'),
			dateToNumber: require('../utilities/date_to_number.js'),
			authenticate: require('../authenticate.js'),
			numberToDate: require('../utilities/number_to_date_object.js'),
			erafy: require('../utilities/number_to_date_string.js'),
			config: require('../config.js')
		}
	},

	created: function(){
		this.authenticate(this.check_login)
	},

	methods: {
		//redirects user to login if not logged in
		check_login: function(logged_in){
			if (logged_in == 'true'){
				this.$emit('login');
				
				return
				
			}	
			else {
				this.$router.push('/login');
			};
		},		

		fieldCheck: function(){
			if (this.name.length * this.dob.number.length * this.dod.number.length == 0){
				if (this.name.length == 0){
					this.empty_name = true;
				}
				else {
					this.empty_name = false;
				}
				if (this.dob.number.length == 0){
					this.empty_dob = true;
				}
				else {
					this.empty_dob = false;
				}
				if (this.dod.number.length == 0){
					this.empty_dod = true;
				}
				else {
					this.empty_dod = false;
				}
				return 
			}
			this.date_checks(this.dateToNumber(this.dob), this.dateToNumber(this.dod), this.duplicateCheck)
		},

		//creates list of possible duplicates, consisting of existing people with same name and/or same dob and dod
		duplicateCheck: function(){

			
			

			console.log('duplicate button pressed');

			//get people with same name and put into dupes1
			this.$http.get('api/people/?name=' + this.name)
				.then(function(data){
					this.dupes1 = data.body;

					//get people with same dob AND dod and put into dupes2
					this.$http.get('api/people/?dob=' + this.dateToNumber(this.dob) + '&dod=' + this.dateToNumber(this.dod))
					.then(function(data){
						this.dupes2 = data.body;
						
						//concatenate dupes lists and remove repeated people (and change date numbers into strings with BC/AD)
						this.duplicates = this.dupes1.concat(this.dupes2);
						
						id_list = [];
						submit_person = this.submit_person;
						clone = this.duplicates;
						erafy = this.erafy
						this.duplicates.forEach(function(duplicate){
							duplicate.dob = this.erafy(duplicate.dob)
							duplicate.dod = this.erafy(duplicate.dod)
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
						if (this.duplicates.length == 0){
							console.log('duplicate check: nothing returned')
							this.show_details = false;
							this.submit_person();
						}
						else {
							//need to sort dates
							console.log('duplicate check: something returned')
							this.show_details = false;
							this.show_dupes = true;
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
				
				//having got new id, photo upload form can be completed and styled:
				document.getElementById('uploadForm').setAttribute('action', 'http://' + config.upload + '/api/upload/person/' + this.person.id);
				var inputs = document.querySelectorAll( '.inputfile' );
				Array.prototype.forEach.call( inputs, function( input ){
					var label	 = input.nextElementSibling,
						labelVal = label.innerHTML;
					input.addEventListener( 'change', function(e){
						var fileName = '';
						if( this.files && this.files.length > 1 )
							fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
						else
							fileName = e.target.value.split( '\\' ).pop();

						if( fileName )
							label.querySelector( 'span' ).innerHTML = fileName;

						else
							label.innerHTML = labelVal;
					});
				});

			})
			this.$http.get('api/events/?dob=' + this.dateToNumber(this.dob) + '&dod=' + this.dateToNumber(this.dod))
			.then(function(data){
				this.events = data.body;
				console.log(this.events);
				if (this.events.length == 0){
					this.show_dupes = false;
					this.show_image = true;
				}
				else {
					this.show_dupes = false;
					this.show_events = true;
				}
				
			})//not asynchronous?
		},

		//submits ticked events
		submit_events: function(){

			//takes an object 'boxes' consisting of event ids with booleans (provided by the user ticking associated
			//boxes), and pulls out an array of the 'true' ids
			var ticked_ids = [];
				for (var box in this.boxes){
				if(box) {
					ticked_ids.push(Number(box));
				};
			};
			person = this.person;
			roles = this.roles;
			$http = this.$http;
			count = 0;

			//creates person-event records, including the person's role in the event
			if (ticked_ids.length > 0){
				ticked_ids.forEach(function(event_id){
					console.log('submitting an event')
					console.log('role: ' + this.roles[event_id] + ', person_id: ' + this.person.id)
					this.$http.post('api/people_events', {person_id: this.person.id, event_id: event_id, role: this.roles[event_id]})
					.then(function(data){
						count += 1;
						if (count == ticked_ids.length){
							console.log('events added to person');
							this.show_events = false;
							this.show_image = true;
						}
					});
				});
			}
			else{
				this.show_events = false;
				this.show_image = true;
			}
			
		},

		//
		amend: function(){
			this.show_dupes = false;
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

