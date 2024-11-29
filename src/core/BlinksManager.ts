import { Container, Sprite } from "pixi.js"
import { gsap } from "gsap"

export default class BlinksGenerator {
	container: Container
	blinks: Sprite[] = [] // Store each blink sprite for scaling later

	constructor(container: Container) {
		this.container = container
		this.generateBlinks()
	}

	private generateBlinks(): void {
		const blinkPositions = [
			{ x: 250, y: 150 }, // Adjust these positions as needed
			{ x: -250, y: -70 },
			{ x: 20, y: 250 },
		]

		for (const position of blinkPositions) {
			// Create a new sprite for each blink
			const blink = Sprite.from("blink")
			blink.anchor.set(0.5, 0.5)
			blink.position.set(position.x, position.y) // Adjust positioning accordingly

			// Add each blink to the container and store a reference
			this.container.addChild(blink)
			this.blinks.push(blink)
		}
	}

	public animateBlinks(): void {
		this.blinks.forEach(blink => {
			gsap.to(blink, {
				rotation: (360 * Math.PI) / 180, // Rotate 360 degrees
				duration: 10, // Adjust duration as needed
				repeat: -1,
				ease: "none",
			})
		})
	}

	public getBlinks(): Sprite[] {
		return this.blinks
	}
}
