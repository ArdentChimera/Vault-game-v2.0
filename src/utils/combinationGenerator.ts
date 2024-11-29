export default function generateCombination() {
	const directions = ["clockwise", "counterclockwise"]
	const combination = Array(3)
		.fill(null)
		.map(() => [
			Math.floor(Math.random() * 9) + 1,
			directions[Math.floor(Math.random() * 2)],
		]) as [number, string][]

	return combination
}
