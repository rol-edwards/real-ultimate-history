<template>
	<div>
		<div v-show='!event_deleted'>
			<div class='titlebar'>
				<h1>
					<span>{{ event.name }}</span>
						<a v-bind:href='"/#/edit_event/" + id' v-show='editable'><img class='bin'  v-bind:src="'../images/pen.png'"></a>
						<img class='bin' v-on:click='delete_event' v-bind:src="'../images/bin.png'" v-show='editable'>
				</h1>
			</div>
			<figure>
				<img v-bind:src="'../images/event' + event.id + '.jpg'">
			</figure>
			<table class='info'>
				<tr>
					<td>Date:</td>
					<td>{{event.date}}</td>
				</tr>
				<tr>
					<td>Location:</td>
					<td>{{event.location}}</td>
				</tr>
			</table>
			<div v-show='show_ppl'>
				<h2>Key people involved</h2>
				<table>
					<tr>
						<th>Name</th>
						<th>Role</th>
					</tr>
					<tr v-for='person in people'>
						<td><a v-bind:href="'/#/person/' + person.id">{{person.name}}</a></td>
						<td>{{person.role}}</td>
					</tr>
				</table>
			</div>
			<h2>Description</h2>
			<p>{{event.description}}</p>
		</div>
		<div v-show='event_deleted'>
			<h1>Event deleted</h1>
		</div>
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
				show_ppl: false,

				//imported modules
				numberToDate: require('../utilities/number_to_date_string.js'),
				authenticate: require('../authenticate.js'),
				
			};
		},

		created: function() {
			this.authenticate(this.on_created)
		},

		watch: {
			'$route' (to, from){
				console.log('route changed' + to.params.id)
				this.id = to.params.id;
				this.authenticate(this.on_created)
			}
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
						if (this.people.length > 0){
							this.show_ppl = true;
						}
						console.log(data.body)
					});
				})
				.catch(function(error){
					alert(error.body)
				})
			},

			//first removes events associated people then removes event
			delete_event: function(){
				if(confirm('Are you sure you want to delete this event?')){
					console.log('delete button pressed')
					this.$http.delete('api/people_events/?table=people&id=' + this.id)
					.then(function(data){
						this.$http.delete('api/event/' + this.id)
						.then(function(data){
							this.deleted_data = data;
							console.log('event deleted' + this.deleted_data)
							this.event_deleted = true;
						})
					})
					.catch(function(error){
						alert(error.body)
					})
				};
			},	
		},
	}
</script>