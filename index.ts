const now = Date.now();
const msInADay = 24 * 60 * 60 * 1000;
const dayNumber = Math.floor(now / msInADay);
const value = evenOrOdd(dayNumber) ? 1 : 2;

function evenOrOdd(number: number): boolean {
	return number % 2 === 0;
}

function isItTimeToShowBar() {
	const date = new Date();
	const hour = date.getHours();
	const minutes = date.getMinutes();

	return hour === 22 && minutes >= 30;
}

function barRun() {
	if (!isItTimeToShowBar()) {
		return;
	}

	// we need this becaouse this output its shown in the bar in my os
	console.log(value);
}

async function pushPhoneNotification() {
	const lastDateNotificationSend = await Bun.file(
		"last-time-notification-send.txt",
	).text();

	const date = new Date();
	const dayOfTheMonth = date.getDate();

	if (
		!isItTimeToShowBar() ||
		Number(lastDateNotificationSend) === dayOfTheMonth
	) {
		return;
	}

	await fetch(`https://ntfy.sh/${Bun.env.NTFY_TOPIC}`, {
		method: "POST",
		body: `${value.toString()} today`,
	});

	await Bun.file("last-time-notification-send.txt").write(
		dayOfTheMonth.toString(),
	);
}

barRun();
await pushPhoneNotification();
