import { BitmapText, Container, Sprite, Ticker } from "pixi.js"
import { HandleAnimation } from "./HandleAnimationManager"
import generateCombination from "../utils/combinationGenerator"
import combinationToString from "../utils/combinationToString"
import BlinksGenerator from "./BlinksManager"

export class Scene {
	sceneContainer: Container
	ticker: Ticker
	timerText: BitmapText
	background: Sprite
	door: Sprite
	doorOpen: Sprite
	doorOpenShadow: Sprite
	handle: Sprite
	handleShadow: Sprite
	blinksGenerator: BlinksGenerator
	animation: HandleAnimation
	static combination: Array<any>

	constructor(width: number, height: number) {
		this.sceneContainer = new Container()

		Scene.combination = generateCombination()
		console.log(combinationToString(Scene.combination))

		this.background = Sprite.from("background")
		this.background.anchor.set(0.5, 0.5)
		this.sceneContainer.addChild(this.background)

		this.blinksGenerator = new BlinksGenerator(this.sceneContainer)
		this.blinksGenerator.animateBlinks()

		this.door = Sprite.from("door")
		this.door.anchor.set(0.45, 0.5)
		this.sceneContainer.addChild(this.door)

		this.doorOpen = Sprite.from("door-opened")
		this.doorOpen.anchor.set(-0.7, 0.5)

		this.doorOpenShadow = Sprite.from("door-opened-shadow")
		this.doorOpenShadow.anchor.set(-0.65, 0.45)

		this.handleShadow = Sprite.from("handle-shadow")
		this.handleShadow.anchor.set(0.45, 0.49)
		this.sceneContainer.addChild(this.handleShadow)

		this.handle = Sprite.from("handle")
		this.handle.anchor.set(0.5, 0.57)
		this.sceneContainer.addChild(this.handle)

		this.timerText = new BitmapText({
			text: "0.00",
			style: {
				fontFamily: "Garamond",
				fontSize: 60,
			},
		})

		this.timerText.x = -1230
		this.timerText.y = -180

		this.sceneContainer.addChild(this.timerText)

		this.animation = new HandleAnimation(
			this.handle,
			this.handleShadow,
			this.timerText
		)

		this.ticker = new Ticker()
		this.ticker.add(this.update.bind(this))
		this.ticker.start()

		// Initial sizing and centering
		this.setBackgroundAndAssetsSize(width, height)

		window.addEventListener("resize", () => {
			this.setBackgroundAndAssetsSize(window.innerWidth, window.innerHeight)
		})
	}

	private update(): void {
		// Calculate elapsed time since start

		// Check if the combination is correct
		if (HandleAnimation.combinationIsCorrect) {
			// Remove the handle and door from the sceneContainer
			if (this.sceneContainer.getChildIndex(this.handle) !== -1) {
				this.sceneContainer.removeChild(this.handle)
			}

			if (this.sceneContainer.getChildIndex(this.door) !== -1) {
				this.sceneContainer.removeChild(this.door)
			}

			if (this.sceneContainer.getChildIndex(this.handleShadow) !== -1) {
				this.sceneContainer.removeChild(this.handleShadow)
			}

			this.sceneContainer.addChild(this.doorOpenShadow)
			this.sceneContainer.addChild(this.doorOpen)

			// Stop the ticker if removal is complete
			if (
				this.sceneContainer.getChildIndex(this.handle) === -1 &&
				this.sceneContainer.getChildIndex(this.door) === -1
			) {
				this.ticker.stop()
			}
		}
	}

	private setBackgroundAndAssetsSize(width: number, height: number): void {
		const originalWidth = this.background.texture.width
		const originalHeight = this.background.texture.height

		// Calculate the scale factors to fit the window without distorting the aspect ratio
		const scaleX = width / originalWidth
		const scaleY = height / originalHeight
		const scale = Math.min(scaleX, scaleY) // Use the smaller scale to ensure it fully fits in the window

		// Set the new scale while maintaining aspect ratio
		this.sceneContainer.scale.set(scale)

		// Center the scene container in the middle of the screen
		this.sceneContainer.x = width / 2
		this.sceneContainer.y = height / 2

		// Center the background and door inside the scene container
		this.background.x = 0 // Since it's centered, it will stay at 0 in the container
		this.background.y = 0

		this.door.x = 0
		this.door.y = 0

		this.doorOpen.x = 0
		this.doorOpen.y = 0

		this.handle.x = 0
		this.handle.y = 0

		this.handleShadow.x = 0
		this.handleShadow.y = 0
	}
}
