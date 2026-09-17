const today = new Date().getDate();

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

	const { amount, date } = await file.json();
	return { amount, date };
}

async function changeValueInStorege() {
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

changeValueInStorege();
