<template>
	<div>
		<h1>Welcome</h1>
		<p>Please log-in or sign-up</p>
		<h2>Log-in</h2>
		<div>
			<input type='text' v-model='username' id='username'>
			<label for='username'>User Name</label>
			<input type='text' v-model='password' id='password' autocomplete='off'>
			<label for='password'>Password</label>
			<button v-on:click='login'>Submit</button>
		</div>
		<h2>Sign-up</h2>
		<form>
			<input type='text' v-model='new_UN' id='username'>
			<label for='username'>User Name</label>
			<input type='text' v-model='new_PW' id='password' autocomplete='off'>
			<label for='password'>Password</label>
			<input type='text' v-model='new_PW_check' id='password2' autocomplete='off'>
			<label for='password2'>Re-enter Password</label>
			<input type='submit' v-on:click='signup'>Submit</input>
		</form>
		<table>
			<tr>
				<th>id</th>
				<th>username</th>
				<th>password</th>
			</tr><tr v-for='result in results'>
				<td>{{result.id}}</td>
				<td>{{result.username}}</td>
				<td>{{result.password}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
	module.exports = {

		data: function (){
			return{

				username: 'jethro_tull',
				password: 'seeddrill',
				new_UN: '',
				new_PW: '',
				new_PW_check: '',
				results: 'placeholder',
				logins: 'placeholder',

			}
		},
			
		methods: {

			//submits username and password to back-end, if correct emits 'login' to make changes to index
			//and redirects to home.
			login: function(){
				console.log('login function activated')
				this.$http.post('api/login', {username: this.username, password: this.password})
				.then(function(data){
					console.log('data is: ' + data.body)
					if (data.body == 'logged in') {
						//this.$emit('login')
						this.$router.push('/')
					}
					else alert(data.body)

				});
			},

			
			signup: function(){
				console.log('signup function called');
				if (this.new_PW != this.new_PW_check){
					this.new_PW = '',
					this.new_PW_check = '',
					alert('Confirmation does not match initial entry. Please try again');
					return
				}
				this.$http.post('api/user/new', {username: this.new_UN, password: this.new_PW})
				.then(function(data){
					this.results = data.body;
					console.log('user ID is ' + this.results)
					//this.$router.push('/#/home')
				});
			}
		}
	}

</script>