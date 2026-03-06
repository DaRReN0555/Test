import { Sprite, Application, Text, Graphics, Container, Assets } from "pixi.js";
import { Spine } from '@esotericsoftware/spine-pixi-v8';

import backUrl from '/back_lv0.webp?url';

import { createParticles } from "./partickes";

export const GAME_DATA = {
    remainItems: 6,
    score: 0
}

export const itemsNames: Array<string> = [
    "hogItem1",
    "hogItem2",
    "hogItem3",
    "hogItem4",
    "hogItem5",
    "decorItem1",
    "decorItem2",
    "decorItem3",
    "decorItem4",
    "decorItem5",
    "decorItem6",
    "decorItem7",
    "decorItem8",
    "decorItem9",
    "decorItem10",
    "decorItem11",
    "decorItem12",
    "decorItem13",
    "decorItem14",
    "decorItem15",
    "decorItem16",
    "decorItem17",
    "decorItem18",
    "decorItem19",
    "decorItem20",
    "decorItem21",
    "animations/anim0/lamp",
]

export const itemsSet: Array<string> = [
    "mode1/skin_mode1_v1",
    "mode1/skin_mode1_v2",
    "mode1/skin_mode1_v3",
    "mode1/skin_mode1_v4",
    "mode1/skin_mode1_v5"
]

function createWinAlert(app: Application, score: Graphics, scoreText: Text, uiContainer: Container) {
    let width = 700
    let height = 200
    if(checkMobile()) {
        width = 370
        height = 150
    }
    const itemsBar = uiContainer.getChildByName("itemsBar") as Container;

    const winBackground = new Graphics();
    winBackground.roundRect(-width / 2, -height / 2, width, height, 23);
    winBackground.fill("#8ddb75");
    winBackground.stroke({ width: 5, color: "#58c04a" });
    
    winBackground.x = (app.screen.width / 2) / uiContainer.scale.x;
    winBackground.y = (app.screen.height / 2) / uiContainer.scale.y;
    
    winBackground.alpha = 0;
    winBackground.scale.set(0); 
    uiContainer.addChild(winBackground);

    const winText = new Text({
        text: 'Поздравляем!\nВы победили',
        style: {
            fontFamily: 'Source Code Pro',
            fontSize: 40,
            fill: '#000000',
            fontWeight: 'bold',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 500, 
            lineHeight: 70
        }
    });
    winText.x = -winText.width / 2;
    winText.y = -winText.height / 2;
    winText.zIndex = 2;
    winBackground.addChild(winText);

    const tick = () => {
        
        scoreText.alpha -= 0.02;
        score.alpha -= 0.02;
        itemsBar.alpha -= 0.02;
        winBackground.alpha += 0.02;
        winBackground.scale.set(winBackground.scale.x + 0.02, winBackground.scale.y + 0.02);
        if (winBackground.alpha >= 1 || winBackground.scale.x >= 1) {
            app.ticker.remove(tick);
        }
    }
    app.ticker.add(tick);
}

export function handleClick(
    spineItem: Spine,
    clickedSlotName: string, 
    app: Application, 
    scoreText: Text, 
    score: Graphics, 
    uiContainer: Container,
    state: any 
) {
    const slot = spineItem.skeleton.findSlot(clickedSlotName);
    if (!slot || !slot.attachment) return;

    const itemIndex = state.items.indexOf(clickedSlotName);
    if (itemIndex > -1) {
        state.items.splice(itemIndex, 1);
    } else {
        return; 
    }

    const itemsBar = uiContainer.getChildByName("itemsBar") as Container;
    let uiIcon: Sprite | null = null;
    if (itemsBar) {
        const itemsContainer = itemsBar.getChildByName("itemsContainer") as Container;
        if (itemsContainer) {
            uiIcon = itemsContainer.getChildByName(clickedSlotName) as Sprite;
        }
    }
    createParticles(app, spineItem, clickedSlotName);
    let alpha = 1;

    const tick = () => {
        alpha -= 0.05;
        slot.color.a = Math.max(0, alpha);

        if (uiIcon) {
            uiIcon.alpha = Math.max(0, alpha);
        }

        if (alpha <= 0) {
            app.ticker.remove(tick);
            slot.attachment = null;
            slot.color.a = 1; 

            if (uiIcon) {
                uiIcon.visible = false;
            }

            GAME_DATA.remainItems--;
            scoreText.text = `Осталось ${GAME_DATA.remainItems}`;

            if (GAME_DATA.remainItems === 0) {
                createWinAlert(app, score, scoreText, uiContainer);
            }
        }
    };

    app.ticker.add(tick);
}

export const checkMobile = () => {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

export function pickRandomItems(count: number): { items: string[]; skin: string } {
    const shuffledItems = [...itemsNames].sort(() => 0.5 - Math.random());
    const shuffledItemsSet = [...itemsSet].sort(() => 0.5 - Math.random());

    const result = {
        items: shuffledItems.slice(0, count),
        skin: shuffledItemsSet[0]
    }

    return result
}

export function createUI(app: Application, uiContainer: Container) {
    const score = new Graphics();
    score.roundRect(0, 0, 250, 50, 23);
    score.fill("#f8d485");
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

    return { score, scoreText }
}

export async function createGame(app: Application, uiContainer: Container, gameContainer: Container) {
    const background = await Assets.load(backUrl);
    const backSprite = new Sprite(background);
    backSprite.zIndex = -1;
    const ratio = app.screen.height / background.height;
    backSprite.scale.set(ratio, ratio);
    gameContainer.addChild(backSprite);
    let isDragging = false;
    let startX = 0;
    let mousePos = { x: app.screen.width / 2, y: app.screen.height / 2 };
    const clampCameraX = (newX: number) => {
        const minX = Math.min(0, app.screen.width - backSprite.width);
        const maxX = 0;
        
        return Math.max(minX, Math.min(maxX, newX));
    };

    if (checkMobile()) {
        window.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            startX = e.clientX;
            gameContainer.x = clampCameraX(gameContainer.x + dx);
        });

        window.addEventListener('pointerup', () => isDragging = false);
        window.addEventListener('pointercancel', () => isDragging = false);
    } 
    else {
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        app.ticker.add(() => {
            const speed = 4;
            const edge = 150;
            
            if (mousePos.x < edge) {
                gameContainer.x = clampCameraX(gameContainer.x + speed);
            }
            else if (mousePos.x > app.screen.width - edge) {
                gameContainer.x = clampCameraX(gameContainer.x - speed);
            }
        });
    }

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const newRatio = app.screen.height / background.height;
        backSprite.scale.set(newRatio, newRatio);
        gameContainer.x = clampCameraX(gameContainer.x);
    });
}