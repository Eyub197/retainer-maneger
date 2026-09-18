const now = Date.now();
const msInADay = 24 * 60 * 60 * 1000;
const dayNumber = Math.floor(now / msInADay);

function evenOrOdd(number: number): boolean {
	return number % 2 === 0;
}

function isItTimeToShow() {
	const date = new Date();
	const hour = date.getHours();
	const minutes = date.getMinutes();

	return hour === 22 && minutes >= 30;
}

function run() {
	if (!isItTimeToShow()) {
		return;
	}

	if (evenOrOdd(dayNumber)) {
		console.log(1);
	} else {
		console.log(2);
	}
}

run();
