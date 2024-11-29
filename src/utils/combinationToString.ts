export default function combinationToString(comb: Array<any>): string {
	return comb.map(([count, direction]) => `${count} ${direction}`).join(", ")
}
