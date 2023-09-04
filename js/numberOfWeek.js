let numberOfCurrentWeek;
let dayOfYear;

const countCurrentWeekNumber = () => {
	const currentDay = new Date();
	const currentYear = new Date().getFullYear();
	const firstJanuary = new Date(`${currentYear}-01-01`);
	if (firstJanuary.getDay() < 5) {
		numberOfCurrentWeek += 1;
	}

	dayOfYear = Math.round(
		(currentDay.getTime() - firstJanuary.getTime()) / (3600 * 24 * 1000)
	);

	numberOfCurrentWeek = Math.floor(dayOfYear / 7);

	if (firstJanuary.getDay() < 5) {
		numberOfCurrentWeek += 1;
	}
};
