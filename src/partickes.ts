import { Application, Graphics } from "pixi.js";
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export function createParticles(app: Application, spineItem: Spine, clickedSlotName: string) {
    const slot = spineItem.skeleton.findSlot(clickedSlotName);
    if (!slot || !slot.attachment) return;

    const attachment = slot.getAttachment() as any;
    const particlesCount = 15;

    const vertices = new Float32Array(8);
    try {
        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength || 8, vertices, 0, 2);
    } catch (err) {
        attachment.computeWorldVertices(slot, vertices, 0, 2);
    }

    let centerX = (vertices[0] + vertices[2] + vertices[4] + vertices[6]) / 4;
    let centerY = (vertices[1] + vertices[3] + vertices[5] + vertices[7]) / 4;

    const globalPos = spineItem.toGlobal({ x: centerX, y: centerY });

    for (let i = 0; i < particlesCount; i++) {
        const particle = new Graphics();

        const size = Math.random() * 5 + 2;
        particle.circle(0, 0, size);
        particle.fill(Math.random() > 0.5 ? 0xfff000 : 0xffffff);
        
        particle.x = globalPos.x;
        particle.y = globalPos.y;

        app.stage.addChild(particle);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        const tick = (p: Graphics) => {
            p.x += velocityX;
            p.y += velocityY;
            p.alpha -= 0.02;
            p.scale.set(p.scale.x * 0.98);
            
            if (p.alpha <= 0) {
                app.ticker.remove(tickInstance);
                if (p.parent) p.parent.removeChild(p);
                p.destroy();
            }
        };

        const tickInstance = tick.bind(null, particle);
        app.ticker.add(tickInstance);
    }
}