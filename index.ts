type Amount = 1 | 2;

interface StoregeData {
	amount: Amount;
	date: number;
}

const today = new Date().getDate();
const { amount } = await getValueFromStorege();
let notified = false;

async function sendNotification(amountOfRetainers: Amount): Promise<void> {
	const message: string = `Put on your retainer${amountOfRetainers === 2 ? "s" : ""}`;
	await Bun.$`notify-send -t 5000 ${amountOfRetainers} '${message}'`;
	changeValueInStorege();
}

function isRetainerTime(): boolean {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	if (hours === 22 && minutes === 50) {
		return true;
	}

	return false;
}

async function getValueFromStorege(): Promise<StoregeData> {
	const path = "storage.json";
	const file = Bun.file(path);

	const { amount, date } = await file.json();
	if (amount === 1 && amount === 2) return { amount, date };
	throw new Error("amount is not a number");
}

async function changeValueInStorege(): Promise<void> {
	const { amount, date } = await getValueFromStorege();

	if (date === today) {
		return;
	}

	const newValue = amount === 1 ? 2 : 1;
	await Bun.write(
		"storage.json",
		JSON.stringify({ amount: newValue, date: today }, null, 2),
	);
}

function run(): void {
	const isItTime = isRetainerTime();

	if (isItTime && !notified) {
		notified = true;
		sendNotification(amount);
	}
}

setInterval(run, 30_000);

//TODO tests
//TODO make it run any time after the given tiem
