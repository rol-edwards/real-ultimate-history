//turns date objects with number and BC/AD era into negative/postive numbers

dateToNumber = function(date){
	if (date.era == 'BC'){

		return  Number(-date.number);
	}

	else if (date.era == 'AD'){
	return Number(date.number);
	}
	else {
		alert('No era selected for' + date)
	}
}

module.exports = dateToNumber;