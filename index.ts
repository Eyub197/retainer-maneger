const STORAGE_FILE = "last-time-notification-send.txt";
const NOTIFY_HOUR = 22;
const NOTIFY_MINUTE = 30;
const MS_IN_A_DAY = 24 * 60 * 60 * 1000;

function getRetainerNumber(): 1 | 2 {
	const dayNumber = Math.floor(Date.now() / MS_IN_A_DAY);
	return dayNumber % 2 === 0 ? 1 : 2;
}

function isRetainerTime(): boolean {
	const now = new Date();
	return now.getHours() === NOTIFY_HOUR && now.getMinutes() >= NOTIFY_MINUTE;
}

async function readLastNotifiedDay(): Promise<number | null> {
	const file = Bun.file(STORAGE_FILE);
	if (!(await file.exists())) return null;
	return Number(await file.text());
}

async function pushPhoneNotification(value: number) {
	const today = new Date().getDate();

	if ((await readLastNotifiedDay()) === today) return;

	await fetch(`https://ntfy.sh/${Bun.env.NTFY_TOPIC}`, {
		method: "POST",
		body: `${value} today`,
	});

	await Bun.file(STORAGE_FILE).write(today.toString());
}

if (isRetainerTime()) {
	const value = getRetainerNumber();

	// we need the comment becaouse it shows its output int the bar
	console.log(value);
	await pushPhoneNotification(value);
}
