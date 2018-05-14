date_checks = function(dob, dod, callback){
	console.log('date_checks called')
	
	if (dob > dod){
		if(confirm('date of death is before date of birth!')){
			callback()
		}
	}
	else if ((dod-dob) > 120){
		if(confirm('Age of person is over 120 years. Continue?')){
			callback()
		}
	}
	else if ((dod-dob) < 10){
		if(confirm('Age of person is less than 10 years. Continue?')){
			callback()
		}
	}
	else {
		callback()
	}
}

module.exports = date_checks;