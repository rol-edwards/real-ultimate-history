<template>
	<div >
		<div class='titlebar'>
			<h1>{{event.name}}</h1>
			<p class='dob'>{{event.date}}</p>
			<p class='dob'>{{event.location}}</p>
		</div>
		<figure>
			<img v-bind:src="'../images/event' + event.id + '.jpg'">
		</figure>
		<p>{{event.id}}</p>
		<p>{{event.description}}</p>
		<h2>Key people involved</h2>
		<table>
			<tr>
				<th>Name</th>
				<th>Role</th>
			<tr v-for='person in people'>
				<td><a v-bind:href="'/#/person/' + person.id">{{person.name}}</a></td>
				<td>{{person.role}}</td>
			</tr>
		</table>
		<p v-show='editable'><a v-bind:href='"/#/edit_event/" + event.id'>Edit</a></p>
		<p v-show='editable'><button v-on:click='delete_event'>Delete</button></p>
	</div>
</template>

<script>

	module.exports = {

		data: function () {
			return{
				event: 'placeholder',
				people: 'placeholder',
				id: this.$route.params.id,
				editable: false,
				event_deleted: false,

				//imported modules
				numberToDate: require('../utilities/number_to_date_string.js'),
				authenticate: require('../authenticate.js'),
			};
		},

		created: function() {
			this.authenticate(this.on_created)
		},

		methods: {
			//gets information for event and associated people
			on_created: function(option){
			if (option == 'true'){
					console.log('show button eventpage gone')
					this.editable = true;
					this.$emit('login');
					
			}	
			this.$http.get('/api/event/' + this.id)
			.then(function (data) {
				console.log(data.body);
				this.event = data.body[0];
				this.event.date = this.numberToDate(this.event.date);
				console.log('this is event.id: ' + this.event.id)
				
				this.$http.get('/api/people_events/?id=' + this.id + '&table=people')
				.then(function(data) {
					this.people = data.body;
					console.log(data.body)
					});
				});
			},

			//first removes events associated people then removes event
			delete_event: function(){
				if(confirm('Are you sure you want to delete this event?')){
					console.log('delete button pressed')
					this.$http.delete('api/people_events/?event_id=' + this.id)
					.then(function(data){
						this.$http.delete('api/event/' + this.id)
						.then(function(data){
							this.deleted_data = data;
							console.log('event deleted' + this.deleted_data)
							this.event_deleted = true;

						})
					})
				};
			},	
		},
	}
</script>