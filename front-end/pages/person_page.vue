
<template>
	<div>
		<div v-show='!person_deleted'>	
			<div class='titlebar'>
				<h1>{{ person.name }}</h1>
				<p class='dob'>{{person.dob}} - {{person.dod}}</p>
			</div>
			<figure>
				<img v-bind:src="'../images/' + person.id + '.jpg'">
			</figure>
			<p>{{person.id}}</p><!--development only-->
			<p>{{person.nation}}</p>
			<h2>Biography</h2>
			<p>{{ person.bio }}</p>
			<p>{{person.role}}</p>
			<h2>Key Events</h2>
			<table class='table'>
				<tr>
					<th style='text-align:left'>Event</th>
					<th style='text-align:left'>Date</th>
					<th style='text-align:left'>Role</th>
				</tr>
				<tr v-for='event in person_event'>
					<td><a v-bind:href="'/#/event/' + event.id">{{event.name}}</a></td>
					<td>{{event.date}}</td>
					<td>{{event.role}}</td>
				</tr>
			</table>
			<button v-show='editable'><a v-bind:href='"/#/edit_person/" + id'>Edit</a></button>
			<p v-show='editable'><button v-on:click='delete_person'>Delete</button></p>
		</div>
		<div v-show='person_deleted'>
			<h1>Person deleted</h1>
		</div>
	</div>
</template>

<script>

	

module.exports = {

	data: function () {
		return{
			person: 'placeholder',
			person_event: 'placeholder',
			id: this.$route.params.id,
			editable: false,
			deleted_data: '',
			person_deleted: false,
			//imported modules:
			numberToDate: require('../utilities/number_to_date_string.js'),
			authenticate: require('../authenticate.js'),
		}
	},

	created: function() {
		this.authenticate(this.on_created)
	},

	methods: {
		//gets information for person and associated events
		on_created: function(option){
			if (option == 'true'){
				console.log('authentication successful')
				this.editable = true;
				this.$emit('login');
			
			}	
			this.$http.get('/api/person/' + this.id)
			.then(function(data) {
				this.person = data.body[0];
				console.log(this.person);
				this.person.dob = this.numberToDate(this.person.dob);
				this.person.dod = this.numberToDate(this.person.dod);
			
				this.$http.get('/api/people_events/?id=' + this.id + '&table=events')//could try var that = this?
				.then( function(data) {
					console.log('events for person: ' + data);
					this.person_event = data.body;
					numberToDate = this.numberToDate;
					this.person_event.forEach(function(event){
					event.date = this.numberToDate(event.date);
					})
				});
			})
			.catch(function(error){
				alert(error.body)
			})
		},

		//first removes person's associated events then removes person, including their image
		delete_person: function(){
			if(confirm('Are you sure you want to delete this person?')){
				console.log('delete button pressed')
				this.$http.delete('api/people_events/?table=events&id=' + this.id)
				.then(function(data){
					this.$http.delete('api/person/' + this.id)
					.then(function(data){
						this.deleted_data = data;
						console.log('person deleted' + this.deleted_data)
						this.person_deleted = true;
					});
				})
				.catch(function(error){
					alert(error.body)
				})
			};
		}
	}
}

</script>