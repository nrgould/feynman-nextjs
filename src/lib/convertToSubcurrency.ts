export default function convertToSubcurrency(
	amount: number,
	factor: number = 100
) {
	return Math.round(amount * factor);
}
