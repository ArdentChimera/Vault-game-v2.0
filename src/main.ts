import { Scene } from "./core/Scene"
import manifest from "./utils/manifest"
import { Application, Assets } from "pixi.js"

async function main() {
	const app = new Application()

	await app.init({ background: "#1099bb", resizeTo: window })

	document.body.appendChild(app.canvas)
	document.body.style.margin = "0"
	document.body.style.padding = "0"
	document.body.style.overflow = "hidden"

	await Assets.load(manifest)

	const scene = new Scene(app.screen.width, app.screen.height)

	app.stage.addChild(scene.sceneContainer)
}

main()
