<template>	
	<div>	
		<h1>People Index</h1>
		<p v-show='editable'><a v-bind:href="'/#/add_person/'">
			<span><img src='../static_images/add.png' class='plus'></span>
		Add person
		</a></p>
		<table class='index'>
			<tr>
				<th>Name</th>
				<th>Date of birth</th>
				<th>Date of death</th>
				<th>Biography</th>
				<th>Nation</th>
				<th>Principal role</th>
			</tr>
			<tr v-for='person in people'>
				<td><a v-bind:href="'/#/person/' + person.id">{{person.name}}</a></td>
				<td>{{person.dob}}</td>
				<td>{{person.dod}}</td>
				<td>{{person.bio}}</td>
				<td>{{person.nation}}</td>
				<td>{{person.role}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
module.exports = {

	data: function () {
		return{
			people: 'placeholder',
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
		//gets information for all people in database
		on_created: function(option){
			if (option == 'true'){
				console.log('editing enabled');
				this.editable = true;
				this.$emit('login');
			}	
			this.$http.get('api/people')
			.then(function(data) {
				this.people = data.body;
				console.log(this.people)
				numberToDate = this.numberToDate
				this.people.forEach(function(person){
					person.dob = this.numberToDate(person.dob);
					person.dod = this.numberToDate(person.dod);
				});
			})
			.catch(function(error){
				alert(error.body)
			})

		},
	}
}

</script>



