export default function checkCombination(
	userInput: Array<any>,
	combination: Array<any>
): boolean {
	if (userInput.length !== combination.length) {
		return false
	}
	return combination.every((step, index) => {
		const result =
			step[0] === userInput[index][0] && step[1] === userInput[index][1]

		return result
	})
}
