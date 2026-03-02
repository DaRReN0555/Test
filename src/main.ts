import { Application, Assets, Sprite } from "pixi.js";
import './style.css';
import { spawnItems } from "./items";
import { itemsToCrop, positions } from "./data";

import backUrl from '/back_lv0.webp?url';

const app = new Application();
await app.init({ background: "white", resizeTo: window });
document.body.appendChild(app.canvas);

// background
const background = await Assets.load(backUrl);
const backSprite = new Sprite(background);
const ratio = app.screen.height / background.height;
backSprite.scale.set(ratio, ratio);
app.stage.addChild(backSprite);

// Move background
let mousePos = {x: 0, y: 0}
window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});

let items = await spawnItems(app, itemsToCrop, positions);

app.ticker.add((delta) => {
  if(mousePos.x < 150 && backSprite.position.x !== 0) {
    backSprite.x += 5;
    items.forEach(item => item.x += 5);
  }
  if(mousePos.x > app.screen.width - 150 && backSprite.position.x >= -(backSprite.width - app.screen.width)) {
    backSprite.x -= 5;
    items.forEach(item => item.x -= 5);
  }
});


