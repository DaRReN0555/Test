import { Application, Assets, Sprite, Graphics, Text, Container } from "pixi.js";
import './style.css';
import { spawnItems } from "./items";
import { itemsToCrop, positions, GAME_DATA, checkMobile } from "./data";

import backUrl from '/back_lv0.webp?url';

const app = new Application();
await app.init({ background: "white", resizeTo: window });
document.body.appendChild(app.canvas);

const gameContainer = new Container()
const uiContainer = new Container();
app.stage.addChild(gameContainer);
app.stage.addChild(uiContainer);

let isDragging = false;
let startX = 0;

const background = await Assets.load(backUrl);
const backSprite = new Sprite(background);
const ratio = app.screen.height / background.height;
backSprite.scale.set(ratio, ratio);
gameContainer.addChild(backSprite);

const score = new Graphics();
score.roundRect(0, 0, 250, 50, 23);
score.fill("#ffffff");
score.stroke({ width: 5, color: "#6d6d6d" });
score.x = 10;
score.y = 10;
score.alpha = 0.7;
score.zIndex = 1;
uiContainer.addChild(score);

const scoreText = new Text() 
scoreText.text = `Осталось ${GAME_DATA.remainItems}`;
scoreText.style.fill = "#000000";
scoreText.style.fontSize = 40;
scoreText.style.fontFamily = "Source Code Pro";
scoreText.style.fontWeight = "bold";
scoreText.x = 14;
scoreText.y = 12;
scoreText.zIndex = 2;
uiContainer.addChild(scoreText);

let mousePos = {x: 0, y: 0}
let items = await spawnItems(app, itemsToCrop, positions, scoreText, score, gameContainer, uiContainer);

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
    if(gameContainer.x + dx < 0 && gameContainer.x + dx >= -(backSprite.width - app.screen.width)) {
      gameContainer.x += dx;
    }
    
  });

  window.addEventListener('pointerup', () => isDragging = false);
} else {
  app.ticker.add(() => {
    if(mousePos.x < 150 && gameContainer.position.x !== 0) {
      gameContainer.x += 5;
    }
    if(mousePos.x > app.screen.width - 150 && gameContainer.position.x >= -(gameContainer.width - app.screen.width)) {
      gameContainer.x -= 5;
    }
  });
  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });
}

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight)
  gameContainer.scale.set(ratio, ratio);
  uiContainer.scale.set(ratio, ratio);
});


