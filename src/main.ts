import { Application, Assets, Container } from "pixi.js";
import './style.css';
import { createGame, createWelcomeScreen} from "./data";



Assets.add({ alias: 'spine-data', src: './level0.json' });
Assets.add({ alias: 'spine-atlas', src: './level0.atlas' });

const app = new Application();
await app.init({ background: "white", resizeTo: window });
document.body.appendChild(app.canvas);

const gameContainer = new Container()
const uiContainer = new Container();

app.stage.addChild(gameContainer);
app.stage.addChild(uiContainer);

createWelcomeScreen(app, uiContainer, gameContainer);

createGame(app, uiContainer, gameContainer);




