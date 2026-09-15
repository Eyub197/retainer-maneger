async function setNotification(amountOfRetainers: number): Promise<void> {
	const message: string = `Put on your retainer${amountOfRetainers < 1 ? "s" : ""}`;
	await Bun.$`notify-send -t 5000 ${amountOfRetainers} '${message}'`;
}
