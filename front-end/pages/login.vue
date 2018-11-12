<template>
	<div>
		<h1>Welcome</h1>
		<p>Please log-in or sign-up</p>
		
		<div class='logfields'>
			<h2>Log-in</h2>
			<table >
				<tr>
					<td><input type='text' v-model='username' id='username' placeholder="username"></td>
				</tr>
				<tr>
					<td><input type='password' v-model='password' id='password' autocomplete='off' placeholder="password"></td>
				</tr>
				<tr>
					<td><input type='submit' v-on:click='login'></td>
				</tr>
			</table>
		</div>
		<div class='logfields'>
			<h2>Sign-up</h2>
			
			<table>
				<tr>
					<td><input type='text' v-model='new_UN' placeholder='username'></td>
				</tr>
				<tr>
					<td><input type='password' v-model='new_PW' autocomplete='off' placeholder="password"></td>
				</tr>
				<tr>
					<td><input type='password' v-model='new_PW_check' autocomplete='off' placeholder="repeat password"></td>
				</tr>
				<tr>
					<td><input type='submit' v-on:click='signup'></td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	module.exports = {

		data: function (){
			return{

				username: '',
				password: '',
				new_UN: '',
				new_PW: '',
				new_PW_check: '',
				results: 'placeholder',
				logins: 'placeholder',
				config: require('../config.js')

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
						this.$emit('login')
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
				if (this.new_PW.length > 10){
					alert('Password must be ten characters or less')
					return
				}
				if (this.new_UN.length > 10){
					alert('Username must be ten characters or less')
					return
				}
				this.$http.post('api/user/new', {username: this.new_UN, password: this.new_PW})
				.then(function(data){
					this.results = data.body;
					console.log('user ID is ' + this.results)
					//this.$router.push('/#/home')
				});
			},

			//production only, quick login:
			cheatLogin: function(){
				this.$http.post('api/login', {username: this.config.username, password: this.config.password})
				.then(function(data){
					console.log('data is: ' + data.body)
					if (data.body == 'logged in') {
						this.$emit('login')
						this.$router.push('/')
					}
					else alert(data.body)

				});

			}
		}
	}

</script>