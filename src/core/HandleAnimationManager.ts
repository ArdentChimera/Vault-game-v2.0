import { BitmapText, FederatedPointerEvent, Sprite, Ticker } from "pixi.js"
import { gsap } from "gsap"
import checkCombination from "../utils/combinationChecker"
import { Scene } from "./Scene"

export class HandleAnimation {
	handle: Sprite
	handleShadow: Sprite
	currentAngle: number
	userInput: Array<any>
	currentRotations: string
	numberOfMovements: number
	static combinationIsCorrect: boolean
	ticker: Ticker
	startTime: number
	elapsedTime: number
	timerText: BitmapText

	constructor(handle: Sprite, handleShadow: Sprite, timerText: BitmapText) {
		this.handle = handle
		this.handleShadow = handleShadow
		this.currentAngle = 0
		this.userInput = []
		this.currentRotations = ""
		this.numberOfMovements = 0
		HandleAnimation.combinationIsCorrect = false

		this.startTime = 0
		this.elapsedTime = 0
		this.timerText = timerText
		this.ticker = new Ticker()

		this.handle.interactive = true

		// Set anchors to center for both sprites so they rotate around their center
		this.handle.anchor.set(0.5, 0.5)

		this.handle.on("pointerdown", (event: FederatedPointerEvent) => {
			this.handleClick(event)
		})
	}

	private animate(direction: number) {
		const rotationAmount = (Math.PI / 3) * direction
		const newAngle = this.currentAngle + rotationAmount

		// Animate rotation for handle and handleShadow together
		gsap.to([this.handle, this.handleShadow], {
			rotation: newAngle,
			duration: 0.5,
			ease: "power2.inOut",
			onComplete: () => {
				this.currentAngle = newAngle // Update currentAngle after animation completes
			},
		})
	}

	private handleClick(event: FederatedPointerEvent) {
		if (!this.ticker.started) {
			// Start the ticker and timer when the handle is clicked for the first time
			this.startTime = performance.now()
			this.ticker.add(this.update.bind(this))
			this.ticker.start()
		}

		const localPosition = event.getLocalPosition(this.handle)
		const clickedOnRightSide = localPosition.x > 0
		this.numberOfMovements++
		let rotationDirection = clickedOnRightSide ? 1 : -1

		this.animate(rotationDirection)

		if (rotationDirection === 1) {
			this.currentRotations = "clockwise"
		} else {
			this.currentRotations = "counterclockwise"
		}

		if (
			this.numberOfMovements === Scene.combination[this.userInput.length][0]
		) {
			this.userInput.push([this.numberOfMovements, this.currentRotations])

			this.numberOfMovements = 0

			if (this.userInput.length === 3) {
				HandleAnimation.combinationIsCorrect = checkCombination(
					this.userInput,
					Scene.combination
				)

				if (HandleAnimation.combinationIsCorrect) {
					// Stop the timer when the combination is guessed correctly
					this.ticker.stop()
					console.log(
						`Combination guessed in: ${(this.elapsedTime / 1000).toFixed(
							2
						)} seconds`
					)
				}
			}
		}
	}

	private update(): void {
		// Calculate elapsed time since start
		this.elapsedTime = performance.now() - this.startTime

		// Update the timer text
		const timeInSeconds = (this.elapsedTime / 1000).toFixed(2) // Convert to seconds with two decimal places
		this.timerText.text = `${timeInSeconds}`
	}
}
