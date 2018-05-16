<template>
	<div>
		<h1>Are YOU ready to get PUMPED???</h1>
		<p>Welcome to the best history site on the internet. Here you will find data on important people and events from the last two thousand years and more. Now thats what I call <span > <em>real, ultimate history</em></span>.</p>
		<div>
			<button v-on:click='create_test_person'>Create test guy</button>
			<div style='width: 50%; float: left;'>
				<h2>People</h2>
				<p v-show='editable'><a v-bind:href="'/#/add_person/'">Add person</a></p>
				<p>Find out information on <span><em>important historical figures</em></span>, such as:</p>
				<div v-for='person in people'>
					<a v-bind:href="'/#/person/' + person.id">
					<figure style=' float: left; height: 150px; width: 75px'>
						<img v-bind:src="'../images/' + person.id + '.jpg'" style='height: 75%; width: 100%'>
						<caption style='height: 25%; width: 75px; font-size: 10px; text-align: center;'>{{person.name}},{{person.dob}}-{{person.dod}}</caption>
					</figure>
					</a>
				</div>
			</div>
			<div style='width: 50%; float: left;'>
				<a v-bind:href="'/#/person/' + spotlight.id">
					<h2>Spotlight</h2>
					<p style='font-size: 2em;'>{{spotlight.name}}</p>
					<p>{{spotlight.dob}} - {{spotlight.dod}}</p>
					
					<p style='font-size: 2em;'>{{spotlight.bio}}</p>
					<img v-bind:src="'../images/' + spotlight.id + '.jpg'">
				</a>
			</div>
		</div>
		<br>
		<div style='width: 100%; float: left'>
			<label for='search_option'>Search for:</label>
			<select id='search_option' v-model='search_option'>
				<option value='person'>People</option>
				<option value='event'>Events</option>
			</select>
		
			<h2>Search</h2>
			<input v-model='search_term' v-on:input='search(search_option)' id='search'>
			<label for='search'>Search</label>
			
			<div v-if='!input_empty'>
				<div v-for='r in search_results'>
					<p><a v-bind:href="'/#/' + search_option + '/' + r.id">{{r.name}}</a></p>
				</div>
			</div>
		</div>
		<div style='margin-left: 50px; width: 100%; float: left'>
					
			<h2>Events</h2>
			<!--<p><a href='/#/view/new/event'>Add new event</a></p>-->
			<table>
				<tr v-for='event in events'>
					<td><a v-bind:href="'/#/event/' + event.id">{{event.name}}</a></td>
					<td>{{event.date}}</td>
				</tr>
			</table>
			<p v-show='editable'><a v-bind:href="'/#/add_event/'">Add event</a></p>
		</div>
	</div>
</template>

<script>

module.exports = {
	//props: ['id'],
	data: function () {
		return{
			people: 'placeholder',
			events: 'placeholder',
			search_results: 'placeholder',
			search_term: '',
			search_option: 'person',
			spotlight: '{}',
			input_empty: false,
			editable: false,
			//imported modules:
			authenticate: require('../authenticate.js'),
			numberToDate: require('../utilities/number_to_date_string.js'),
		}
	},
	created: function() {
		this.authenticate(this.on_created)
	},

	methods: {
		//gets data for home page, including random sample of people, random spotlight person, and all events
		on_created: function (option){
			console.log('on_created function activated');
			if (option == 'true'){
				this.editable = true;
				this.$emit('login');
			}
	 		this.$http.get('/api/people/?number=12')
			.then(function(data) {
				this.people = data.body;
				numberToDate = this.numberToDate;
				this.people.forEach(function(person){
					person.dob = this.numberToDate(person.dob);
					person.dod = this.numberToDate(person.dod);
				})

				this.$http.get('/api/people/?number=1')
				.then(function(data) {
					this.spotlight = data.body[0];
					console.log(this.spotlight)
					numberToDate = this.numberToDate;
					this.spotlight.dob = this.numberToDate(this.spotlight.dob);
					this.spotlight.dod = this.numberToDate(this.spotlight.dod);
				
					this.$http.get('/api/events/?number=12')
					.then(function(data) {
						this.events = data.body;
						numberToDate = this.numberToDate;
						this.events.forEach(function(event){
							event.date = this.numberToDate(event.date)
						});
					});
				});
			})
			.catch(function(error){
				alert(error.body)
			});
		},

		//Searches for people and events, autocompleting and presenting in a list with links.
		//The conditional makes sure autocomplete suggestions for first character disappear if it is deleted.
		search: function(search_option){
		console.log('search function working for ' + this.search_term);
			if (this.search_term == ''){
				this.input_empty = true;
			}
			else {
				this.input_empty = false;
				
				this.$http.get('/api/' + this.search_option + '_byName/' + this.search_term)
				.then(function(data){
					this.search_results = data.body;
					console.log(data.body);
				})
				.catch(function(error){
					alert(error.body)
				});
			}
		},

		//development only, quick way to create a test person.
		create_test_person: function(){
			this.$http.post('api/person', {name: 'testguy', dob: -20000, dod: 100})
			.then(function(data){
				console.log('test_guy created' + data)
			})
		}
	}
}
</script>
