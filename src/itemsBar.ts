import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Application, Graphics, Container, Sprite, Texture, Rectangle, ColorMatrixFilter } from "pixi.js";
import { updateLayout } from "./data";

export async function createItemsBar(app: Application, items: Spine, uiContainer: Container, state: { items: string[], skin: string }) {
    const itemsBar = new Graphics();
    itemsBar.label = "itemsBar";
    itemsBar.roundRect(0, 0, 1000, 150, 23);
    itemsBar.fill("#f8d485");
    itemsBar.stroke({ width: 5, color: "#6d6d6d" });
    itemsBar.x = app.screen.width / 2 - itemsBar.width / 2;
    itemsBar.y = app.screen.height - itemsBar.height - 10;
    itemsBar.alpha = 0.7;
    itemsBar.zIndex = 1;

    const itemsContainer = new Container();
    itemsContainer.label = "itemsContainer";
    itemsBar.addChild(itemsContainer);

    const barWidth = 1000;
    const spacing = barWidth / (state.items.length + 1);
    const filter = new ColorMatrixFilter();
    itemsContainer.filters = [filter];

    state.items.forEach((itemName, index) => {
        const slot = items.skeleton.findSlot(itemName);
        if (!slot) return;
        
        const attachment = slot.getAttachment();
        if (!attachment) return;

        const region = (attachment as any).region;
        if (region) {
            const pixiTexture = region.texture?.texture || region.texture;
            const source = pixiTexture.source || pixiTexture;
            
            const bw = source.width;
            const bh = source.height;

            const u = Math.min(region.u, region.u2);
            const v = Math.min(region.v, region.v2);
            const u2 = Math.max(region.u, region.u2);
            const v2 = Math.max(region.v, region.v2);

            const frame = new Rectangle(
                u * bw,
                v * bh,
                (u2 - u) * bw,
                (v2 - v) * bh
            );
            
            const itemTexture = new Texture({
                source: source,
                frame: frame
            });

            const sprite = new Sprite(itemTexture);
            sprite.label = itemName;
            sprite.anchor.set(0.5);
            
            if (region.degrees) {
                sprite.angle = region.degrees;
            }

            const boundsW = sprite.width || 1;
            const boundsH = sprite.height || 1;
            
            const maxSize = 100;
            const scale = Math.min(maxSize / boundsW, maxSize / boundsH);
            sprite.scale.set(scale);

            sprite.x = spacing * (index + 1);
            sprite.y = 150 / 2;

            itemsContainer.addChild(sprite);
        }
    });

    uiContainer.addChild(itemsBar);
    updateLayout(app, uiContainer, new Container());
    return itemsBar;
}