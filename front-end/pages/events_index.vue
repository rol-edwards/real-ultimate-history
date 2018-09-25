<template>	
	<div>	
		<h1>Events Index</h1>
		<p v-show='editable'><a v-bind:href="'/#/add_event/'">
			<span><img src='../images/add.png' class='plus'></span>
		Add event</a></p>
		<table>
			<tr>
				<th>Name</th>
				<th>Date</th>
				<th>Location</th>
				<th>Description</th>
			</tr>
			<tr v-for='event in events'>
				<td><a v-bind:href="'/#/event/' + event.id">{{event.name}}</a></td>
				<td>{{event.date}}</td>
				<td>{{event.location}}</td>
				<td>{{event.description}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
module.exports = {

	data: function () {
		return{
			events: 'placeholder',
			editable: false,

			//imported modules
			numberToDate: require('../utilities/number_to_date_string.js'),
			authenticate: require('../authenticate.js'),
		};
	},

	created: function() {
		this.authenticate(this.on_created)
	},

	methods: {
		//gets information for all events in database
		on_created: function(option){
			if (option == 'true'){
				console.log('editing enabled');
				this.editable = true;
				this.$emit('login');
			}	
			this.$http.get('api/events')
			.then(function(data) {
				this.events = data.body;
				console.log(this.events)
				numberToDate = this.numberToDate
				this.events.forEach(function(event){
					event.date = this.numberToDate(event.date);
				});
			})
			.catch(function(error){
				alert(error.body)
			})

		},
	}
}

</script>