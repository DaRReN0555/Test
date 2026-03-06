import { Application, Assets, ColorMatrixFilter, Text, Graphics, Container } from "pixi.js";
import { handleClick, itemsNames, pickRandomItems } from "./data";
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export async function createSingleItem(app: Application, scoreText: Text, score: Graphics, uiContainer: Container, gameContainer: Container, state: { items: Array<string>, skin: string }) {
    
    await Assets.load(['spine-data', 'spine-atlas']);

    const createSpineInstance = async () => {
        const s = await Spine.from({
            skeleton: 'spine-data',
            atlas: 'spine-atlas',
            autoUpdate: true
        });
        s.skeleton.setSkinByName(state.skin);
        s.state.setAnimation(0, 'idle', true);
        s.skeleton.setSlotsToSetupPose();
        s.scale.set(1.2);
        return s;
    };

    const item = await createSpineInstance();
    const lightEffect = await createSpineInstance();
    
    const lightSlotName = "animations/anim2/svet";
    const isLampSelected = state.items.includes("animations/anim0/lamp");

    item.skeleton.slots.forEach(slot => {
        const name = slot.data.name;
        if (name === lightSlotName || !state.items.includes(name)) {
            slot.attachment = null;
        }
    });

    lightEffect.skeleton.slots.forEach(slot => {
        const name = slot.data.name;
        if (name === lightSlotName && isLampSelected) {
            slot.data.blendMode = 3;
        } else {
            slot.attachment = null;
        }
    });

    const spineWrapper = new Container();
    const filter = new ColorMatrixFilter();
    spineWrapper.filters = [filter];
    
    spineWrapper.addChild(item);
    gameContainer.addChild(spineWrapper);
    gameContainer.addChild(lightEffect);

    item.eventMode = 'static';
    item.cursor = 'default';

    item.alpha = 0.75;

    item.on('pointerdown', (e) => {
        const localPos = item.toLocal(e.global);
        let clickedItemName: string | null = null;
        
        item.skeleton.slots.forEach(slot => {
            const slotName = slot.data.name;
            const attachment = slot.getAttachment();
            if (attachment && state.items.includes(slotName)) {
                const vertices = new Float32Array(8);
                try {
                    (attachment as any).computeWorldVertices(slot, 0, (attachment as any).worldVerticesLength || 8, vertices, 0, 2);
                } catch (err) {
                    (attachment as any).computeWorldVertices(slot, vertices, 0, 2);
                }
                let minX = Math.min(vertices[0], vertices[2], vertices[4], vertices[6]);
                let maxX = Math.max(vertices[0], vertices[2], vertices[4], vertices[6]);
                let minY = Math.min(vertices[1], vertices[3], vertices[5], vertices[7]);
                let maxY = Math.max(vertices[1], vertices[3], vertices[5], vertices[7]);

                if (localPos.x >= minX && localPos.x <= maxX && localPos.y >= minY && localPos.y <= maxY) {
                    clickedItemName = slotName;
                }
            }
        });

        if (clickedItemName) {
            handleClick(item, clickedItemName, app, scoreText, score, uiContainer, state);
        }
    });

    return item;
}