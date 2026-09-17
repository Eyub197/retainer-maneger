async function setNotification(amountOfRetainers: number): Promise<void> {
	const message: string = `Put on your retainer${amountOfRetainers < 1 ? "s" : ""}`;
	await Bun.$`notify-send -t 5000 ${amountOfRetainers} '${message}'`;
}

function isRetainerTime(): boolean {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	if (hours === 14 && minutes === 21) {
		return true;
	}

	return false;
}

async function getValueFromStorege() {
	const path = "storage.json";
	const file = Bun.file(path);

	const { amount } = await file.json();
	return amount;
}

getValueFromStorege();
// every time switch it back
// ! edge case : what if the app is opened 2 times a day
