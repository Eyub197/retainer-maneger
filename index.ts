const STORAGE_FILE = "last-time-notification-send.txt";
const NOTIFY_HOUR = 22;
const NOTIFY_MINUTE = 30;
const MS_IN_A_DAY = 24 * 60 * 60 * 1000;
const mode = Bun.argv[2];
const value = getRetainerNumber();

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

	const res = await fetch(`https://ntfy.sh/${Bun.env.NTFY_TOPIC}`, {
		method: "POST",
		body: `${value} today`,
	});

	if (!res.ok) {
		console.error(`ntfy request is not successful: ${res.status}`);
		process.exit(1);
	}

	await Bun.file(STORAGE_FILE).write(today.toString());
}

async function run() {
	//  the the early returns are isndie of each case becaouse else it wont fail loudly. Aka if there is a typo it wont go into the default case
	switch (mode) {
		case "--bar":
			if (!isRetainerTime()) return;
			// need the console log to output the value in the bar
			console.log(value);
			break;
		case "--notify":
			if (!Bun.env.NTFY_TOPIC) {
				console.error("NTFY_TOPIC is not found");
				// old unix convention for config errors
				process.exit(78);
			}
			if (!isRetainerTime()) return;
			await pushPhoneNotification(value);
			break;
		default:
			console.error(`unknown mode: ${mode}`);
			// this means failure triggers restart=on-failure
			process.exit(1);
	}
}

run();
