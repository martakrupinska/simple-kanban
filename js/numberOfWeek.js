function checkCurrentWeekNumber() {
	let currentWeekNumber;

	const currentDay = new Date();
	const currentYear = currentDay.getFullYear();
	const firstJanuary = new Date(`${currentYear}-01-01`);

	const currentDayOfYear = parseInt(
		Math.round(
			(currentDay.getTime() - firstJanuary.getTime()) / (3600 * 24 * 1000)
		)
	);
	// console.log(currentDayOfYear);
	//console.log(`modulo: ` + (currentDayOfYear % 7));

	if (currentDayOfYear % 7 === 0) {
		currentWeekNumber = parseInt(currentDayOfYear / 7) - 1;
	} else {
		currentWeekNumber = Math.floor(currentDayOfYear / 7);
	}
	if (firstJanuary.getDay() < 5) {
		currentWeekNumber += 1;
	}

	//console.log(currentWeekNumber);
	return currentWeekNumber;
}
