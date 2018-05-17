//turns negative/positive numbers to date strings with number and BC/AD era

numberToDate = function(x) {
	if (x < 0 ){
		x = -x + ' BC';
	}
	else x = 'AD ' + x;
	return x;
}

module.exports = numberToDate;