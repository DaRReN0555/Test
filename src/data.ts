import { Sprite, Application, Text, Graphics, Container, Assets } from "pixi.js";
import { Spine } from '@esotericsoftware/spine-pixi-v8';

import backUrl from '/back_lv0.webp?url';

import { createParticles } from "./particles";

import { createSingleItem } from "./items";
import { createItemsBar } from "./itemsBar";


export const GAME_DATA = {
    remainItems: 6,
    score: 0,
    isPlaying: false
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
    const width = 700;
    const height = 200;
    const itemsBar = uiContainer.getChildByLabel("itemsBar") as Container;

    const winBackground = new Graphics();
    winBackground.label = "winBackground";
    winBackground.roundRect(-width / 2, -height / 2, width, height, 23);
    winBackground.fill("#8ddb75");
    winBackground.stroke({ width: 5, color: "#58c04a" });

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
    updateLayout(app, uiContainer, new Container());
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
    const scoreContainer = new Container();
    scoreContainer.label = "scoreContainer";

    const score = new Graphics();
    score.roundRect(0, 0, 250, 50, 23);
    score.fill("#f8d485");
    score.stroke({ width: 5, color: "#6d6d6d" });
    score.alpha = 0.7;
    scoreContainer.addChild(score);
    
    const scoreText = new Text({
        text: `Осталось ${GAME_DATA.remainItems}`,
        style: {
            fill: "#000000",
            fontSize: 36,
            fontFamily: "Source Code Pro",
            fontWeight: "bold"
        }
    });
    scoreText.x = 14;
    scoreText.y = 12;
    scoreContainer.addChild(scoreText);

    scoreContainer.zIndex = 2;
    uiContainer.addChild(scoreContainer);

    updateLayout(app, uiContainer, new Container()); 

    return { score, scoreText };
}

export async function createGame(app: Application, uiContainer: Container, gameContainer: Container) {
    const background = await Assets.load(backUrl);
    const backSprite = new Sprite(background);
    backSprite.zIndex = -1;
    gameContainer.addChild(backSprite);

    const clampCameraX = (newX: number) => {
        const minX = Math.min(0, app.screen.width - backSprite.width);
        const maxX = 0;
        return Math.max(minX, Math.min(maxX, newX));
    };

    let isDragging = false;
    let startX = 0;
    let mousePos = { x: app.screen.width / 2, y: app.screen.height / 2 };

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
            if (!GAME_DATA.isPlaying) return;
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
        updateLayout(app, uiContainer, gameContainer, backSprite);
    });

    updateLayout(app, uiContainer, gameContainer, backSprite);
};

export function createWelcomeScreen(app: Application, uiContainer: Container, gameContainer: Container) {
    const welcomeBg = new Graphics();
    welcomeBg.label = "welcomeBg";
    welcomeBg.roundRect(0, 0, 900, 300, 20);
    welcomeBg.stroke({ width: 5, color: "#6d6d6d" });
    welcomeBg.fill("#f8d485");
    welcomeBg.x = app.screen.width / 2 - welcomeBg.width / 2;
    welcomeBg.y = app.screen.height / 2 - welcomeBg.height / 2;
    welcomeBg.zIndex = 999;

    const welcomeText = new Text({
        text: 'Найдите все спрятанные предметы',
        style: {
            fill: "#000000",
            fontSize: 45,
            fontFamily: "Source Code Pro",
            fontWeight: 'bold',
        }
    });
    welcomeText.x = welcomeBg.width / 2 - welcomeText.width / 2;
    welcomeText.y = 15;
    welcomeText.zIndex = 999;
    welcomeBg.addChild(welcomeText);

    const playButton = new Graphics();
    playButton.roundRect(0, 0, 300, 100, 15);
    playButton.fill("#d3b247");
    playButton.x = welcomeBg.width / 2 - playButton.width / 2;
    playButton.y = welcomeBg.height - playButton.height - 70;
    playButton.zIndex = 999;
    welcomeBg.addChild(playButton);

    const playText = new Text({
        text: 'Играть',
        style: {
            fill: "#000000",
            fontSize: 40,
            fontFamily: "Source Code Pro",
            fontWeight: 'bold',
        }
    });
    playText.x = playButton.width / 2 - playText.width / 2;
    playText.y = playButton.height / 2 - playText.height / 2 - 14;
    const firstY = playText.y;
    playText.zIndex = 999;
    playButton.addChild(playText);

    const playBg = new Graphics();
    playBg.roundRect(0, 0, playButton.width, playButton.height, 15);
    playBg.fill("#f0c361");
    playBg.x = 0;
    playBg.y = -10;
    playBg.zIndex = 998;
    playBg.interactive = true;
    playBg.on('pointerdown', () => {
        playBg.y = 0;
        playText.y = firstY + 10;
    });
        playBg.on('pointerup', () => {
        GAME_DATA.isPlaying = true;
        playBg.y = -10;
        playText.y = firstY;
        uiContainer.removeChild(welcomeBg);
        initGame(app, uiContainer, gameContainer);
    });
    playButton.addChild(playBg);



    uiContainer.addChild(welcomeBg);
    updateLayout(app, uiContainer, gameContainer);
}

export async function initGame(app: Application, uiContainer: Container, gameContainer: Container) {
    
    const UI = createUI(app, uiContainer);
    let state = pickRandomItems(6);
    let items = await createSingleItem(app, UI.scoreText, UI.score, uiContainer, gameContainer, state);
    await createItemsBar(app, items, uiContainer, state);
}

export function updateLayout(app: Application, uiContainer: Container, gameContainer: Container, backSprite?: Sprite) {
    const sw = app.screen.width;
    const sh = app.screen.height;
    const isPortrait = sh > sw;

    let currentBgScale = 1;
    if (backSprite && backSprite.texture) {
        const scaleX = sw / backSprite.texture.width;
        const scaleY = sh / backSprite.texture.height;
        currentBgScale = Math.max(scaleX, scaleY); 
        backSprite.scale.set(currentBgScale);
    }

    const spineItem = gameContainer.getChildByLabel("spineSceneItem");
    const lightEffect = gameContainer.getChildByLabel("spineLightEffect");

    [spineItem, lightEffect].forEach(obj => {
        if (obj) {
            obj.scale.set(1.2 * currentBgScale);
        }
    });

    const scoreContainer = uiContainer.getChildByLabel("scoreContainer");
    if (scoreContainer) {
        const scale = isPortrait && checkMobile() ? 0.7 : 1;
        scoreContainer.scale.set(scale);
        scoreContainer.x = 10;
        scoreContainer.y = 10;
    }

    const itemsBar = uiContainer.getChildByLabel("itemsBar");
    if (itemsBar) {
        const baseW = 1000;
        const maxW = sw * 0.95;
        let scale = Math.min(1, maxW / baseW);
        
        itemsBar.scale.set(scale);
        itemsBar.x = sw / 2 - (baseW * scale) / 2;
        itemsBar.y = sh - (150 * scale) - (isPortrait ? 30 : 15);

    const welcomeBg = uiContainer.getChildByLabel("welcomeBg");
    if (welcomeBg) {
        const baseW = 900;
        const maxW = sw * 0.9;
        const scale = Math.min(1, maxW / baseW);
        welcomeBg.scale.set(scale);
        welcomeBg.x = sw / 2 - (baseW * scale) / 2;
        welcomeBg.y = sh / 2 - (300 * scale) / 2;
    }

    const winBackground = uiContainer.getChildByLabel("winBackground");
    if (winBackground) {
        winBackground.x = sw / 2;
        winBackground.y = sh / 2;

    }
}    
}