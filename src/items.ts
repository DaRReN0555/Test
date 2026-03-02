import { Application, Assets, Sprite, Texture, Rectangle, ColorMatrixFilter, Text, Graphics, Container } from "pixi.js";
import { handleClick, type DataItem, type Positions } from "./data";

export async function spawnItems(app: Application, itemsToCrop: Array<DataItem>, positions: Array<Positions>, scoreText: Text, score: Graphics, gameContainer: Container, uiContainer: Container) {
    let spawnedItems: Array<Sprite> = [];
    const baseTexture = await Assets.load('/level0.webp');
    const ITEMS_COUNT = 6;
    
    positions.forEach(p => p.isOccupied = false);
    itemsToCrop.forEach(i => i.isSpawned = false);

    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    for (const pos of shuffledPositions) {
        if (spawnedItems.length >= ITEMS_COUNT) break;

        const availableItem = itemsToCrop
            .filter(item => !item.isSpawned && pos.canSpawn.includes(item.name))
            .sort(() => Math.random() - 0.5)[0];

        if (availableItem) {
            const region = new Rectangle(
                availableItem.rect[0], 
                availableItem.rect[1], 
                availableItem.rect[2], 
                availableItem.rect[3]
            );

            const croppedTexture = new Texture({
                source: baseTexture,
                frame: region
            });

            const item = new Sprite(croppedTexture);
            item.anchor.set(0.5);
            item.alpha = 0.8
            
            if (availableItem.rotate) {
                item.rotation = Math.PI / 2;
            }
            const currentRatio = app.screen.height / baseTexture.height;

            item.scale.set(currentRatio); 
            item.scale.x *= 0.8
            item.scale.y *= 0.8

            item.x = pos.x * currentRatio;
            item.y = pos.y * currentRatio;

            const filter = new ColorMatrixFilter();
            item.filters = [filter];
            item.eventMode = 'static';
            item.cursor = 'default';

            item.on('pointerdown', () => handleClick(item, spawnedItems, app, availableItem, scoreText, score, uiContainer));

            pos.isOccupied = true;
            availableItem.isSpawned = true;

            gameContainer.addChild(item);
            spawnedItems.push(item);
        }
    }
    return spawnedItems;
}