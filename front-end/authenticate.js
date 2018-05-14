var authenticate = function(callback){
	console.log('authentication pending')
	this.$http.get('/api/user/me')
	.then(function(){
		console.log('authentication successful')
		callback('true')
	})
	.catch(function(error){
		callback('false')
		
	})
};

module.exports = authenticate;