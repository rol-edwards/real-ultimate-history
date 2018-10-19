<template>
	<div>
		<h1>Are YOU ready to get PUMPED???</h1>
		<p>Welcome to the best history site on the internet. Here you will find data on important people and events from the last two thousand years and more. Now thats what I call <span class='hyperbole'> <em>real, ultimate history</em></span>.</p>
		<div>
			<!--<button v-on:click='create_test_person'>Create test guy(development only)</button>-->
			<div class='people'>
				<h2>People</h2>
				<p v-show='editable'><a v-bind:href="'/#/add_person/'">
					<span><img src='../images/add.png' class='plus'></span>
				Add person
				</a></p>
				<p>Find out information on <span class='hyperbole'><em>important historical figures</em></span>, such as:</p>
				<div v-for='person in people'>
					<a v-bind:href="'/#/person/' + person.id">
					<figure style=' float: left; height: 150px; width: 75px'>
						<img v-bind:src="'../images/' + person.id + '.jpg'" style='height: 75%; width: 100%'>
						<caption style='height: 25%; width: 75px; font-size: 10px; text-align: center;'>{{person.name}},{{person.dob}}-{{person.dod}}</caption>
					</figure>
					</a>
				</div>
			</div>
			<div class='spotlight'>
				<h2>Spotlight</h2>
				<a v-bind:href="'/#/person/' + spotlight.id">
					
					<h3>{{spotlight.name}}</h3>
					<p>{{spotlight.dob}} - {{spotlight.dod}}</p>
					<img v-bind:src="'../images/' + spotlight.id + '.jpg'">
					<div><p>{{spotlight.bio}}</p></div>
					
				</a>
			</div>
		</div>
		<br>
		<div style='margin-left: 50px; width: 100%; float: left'>
					
			<h2>Events</h2>
			<p v-show='editable'><a v-bind:href="'/#/add_event/'">
				<span><img src='../images/add.png' class='plus'></span>
			Add event</a></p>
			<!--<p><a href='/#/view/new/event'>Add new event</a></p>-->
			<table>
				<tr v-for='event in events'>
					<td><a v-bind:href="'/#/event/' + event.id">{{event.name}}</a></td>
					<td>{{event.date}}</td>
				</tr>
			</table>
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
			spotlight: '{}',
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
				//this.$http.get('/api/people/?number=1')
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

		//development only, quick way to create a test person.
		create_test_person: function(){
			this.$http.post('api/person', {name: 'testguy', dob: -20000, dod: 100})
			.then(function(data){
			})
		}
	}
}


</script>
