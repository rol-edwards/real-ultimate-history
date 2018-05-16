//Turns negative/postive numbers into date objects with BC/AD era

get_era_date = function(x){
	if (x < 0){
		
		x = {era: 'BC', number: -x}
	}
	else {
		x = {era: 'AD', number: x}
	}
	return x;
}

module.exports = get_era_date;