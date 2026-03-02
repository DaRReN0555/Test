import { Application, Assets, Sprite, Graphics, Text } from "pixi.js";
import './style.css';
import { spawnItems } from "./items";
import { itemsToCrop, positions, GAME_DATA, checkMobile } from "./data";

import backUrl from '/back_lv0.webp?url';

const app = new Application();
await app.init({ background: "white", resizeTo: window });
document.body.appendChild(app.canvas);

let isDragging = false;
let startX = 0;

const background = await Assets.load(backUrl);
const backSprite = new Sprite(background);
const ratio = app.screen.height / background.height;
backSprite.scale.set(ratio, ratio);
app.stage.addChild(backSprite);

const score = new Graphics();
score.roundRect(0, 0, 250, 50, 23);
score.fill("#ffffff");
score.stroke({ width: 5, color: "#6d6d6d" });
score.x = 10;
score.y = 10;
score.alpha = 0.7;
score.zIndex = 1;
app.stage.addChild(score);

const scoreText = new Text() 
scoreText.text = `Осталось ${GAME_DATA.remainItems}`;
scoreText.style.fill = "#000000";
scoreText.style.fontSize = 40;
scoreText.style.fontFamily = "Source Code Pro";
scoreText.style.fontWeight = "bold";
scoreText.x = 14;
scoreText.y = 12;
scoreText.zIndex = 2;
app.stage.addChild(scoreText);

let mousePos = {x: 0, y: 0}
let items = await spawnItems(app, itemsToCrop, positions, scoreText, score);

if (checkMobile()) {
  items.forEach(item => item.position);
  window.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    startX = e.clientX;

    backSprite.x += dx;
    items.forEach(item => item.x += dx);
  });

  window.addEventListener('pointerup', () => isDragging = false);
} else {
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
  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });
}

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight)
  backSprite.scale.set(ratio, ratio);
});


