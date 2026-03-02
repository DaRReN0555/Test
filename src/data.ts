import { Sprite, Application } from "pixi.js";

export interface DataItem {
    name: string;
    rect: [number, number, number, number];
    rotate: boolean;
    isSpawned: boolean
}

export interface Positions {
    canSpawn: Array<string>;
    x: number;
    y: number;
    isOccupied: boolean
}

// Items
export const itemsToCrop: DataItem[] = [
    { name: 'obj_1',  rect: [0, 0, 122, 111], rotate: false, isSpawned: false },
    { name: 'obj_2', rect: [120, 0, 122, 80], rotate: false, isSpawned: false },
    { name: 'obj_3', rect: [0, 80, 400, 220],  rotate: false, isSpawned: false },
    { name: 'obj_4', rect: [398, 16, 113, 100], rotate: false, isSpawned: false },
    { name: 'obj_5', rect: [1125, 897, 75, 116], rotate: false, isSpawned: false },
    { name: 'obj_6',  rect: [1, 292, 335, 284], rotate: true, isSpawned: false },
    { name: 'obj_7', rect: [524, 71, 169, 242], rotate: false, isSpawned: false },
    { name: 'obj_8', rect: [0, 574, 100, 62], rotate: false, isSpawned: false },
    { name: 'obj_9', rect: [333, 504, 60, 66], rotate: false, isSpawned: false },
    { name: 'obj_10', rect: [543, 595, 117, 217], rotate: false, isSpawned: false },
    { name: 'obj_11', rect: [321, 570, 220, 279], rotate: false, isSpawned: false },
    { name: 'obj_12', rect: [321, 849, 170, 168], rotate: false, isSpawned: false },
    { name: 'obj_13', rect: [805, 66, 175, 104], rotate: false, isSpawned: false },
    { name: 'obj_14', rect: [1110, 94, 89, 111], rotate: true, isSpawned: false },
    { name: 'obj_15', rect: [1066, 205, 90, 122], rotate: true, isSpawned: false },
    { name: 'obj_16', rect: [1038, 327, 87, 122], rotate: true, isSpawned: false },
    { name: 'obj_17', rect: [541, 821, 180, 194], rotate: true, isSpawned: false },
    { name: 'obj_18', rect: [1125, 371, 76, 125], rotate: false, isSpawned: false },
    { name: 'obj_19', rect: [1125, 496, 81, 118], rotate: false, isSpawned: false },
    { name: 'obj_20', rect: [1109, 7, 99, 80], rotate: false, isSpawned: false },
    { name: 'obj_21', rect: [1036, 451, 86, 130], rotate: false, isSpawned: false },
    { name: 'obj_22', rect: [1040, 607, 110, 95], rotate: false, isSpawned: false },
    { name: 'obj_23', rect: [1058, 704, 84, 86], rotate: false, isSpawned: false },
    { name: 'obj_24', rect: [1143, 769, 71, 128], rotate: true, isSpawned: false },
    { name: 'obj_25', rect: [1039, 891, 87, 123], rotate: false, isSpawned: false },
    { name: 'obj_26', rect: [937, 897, 94, 113], rotate: false, isSpawned: false },
    { name: 'obj_27', rect: [693, 51, 112, 195], rotate: true, isSpawned: false },
    { name: 'obj_28', rect: [976, 44, 134, 93], rotate: false, isSpawned: false },
    { name: 'obj_29', rect: [977, 135, 86, 121], rotate: false, isSpawned: false },
    { name: 'obj_30', rect: [921, 265, 118, 122], rotate: true, isSpawned: false },
    { name: 'obj_31', rect: [928, 588, 112, 108], rotate: false, isSpawned: false },
    { name: 'obj_32', rect: [914, 384, 118, 126], rotate: false, isSpawned: false },
    { name: 'obj_33', rect: [806, 507, 125, 140], rotate: false, isSpawned: false },
    { name: 'obj_34', rect: [716, 833, 129, 184], rotate: true, isSpawned: false },
    { name: 'obj_35', rect: [846, 812, 88, 203], rotate: false, isSpawned: false },
    { name: 'obj_36', rect: [959, 734, 80, 158], rotate: true, isSpawned: false },
    { name: 'obj_37', rect: [803, 701, 161, 121], rotate: false, isSpawned: false },
    { name: 'obj_38', rect: [692, 509, 115, 305], rotate: false, isSpawned: false },
    { name: 'obj_39', rect: [806, 173, 101, 157], rotate: false, isSpawned: false },
    { name: 'obj_40', rect: [794, 344, 116, 162], rotate: true, isSpawned: false },
    { name: 'obj_41', rect: [695, 250, 100, 270], rotate: false, isSpawned: false },
    { name: 'obj_42', rect: [521, 311, 171, 262], rotate: true, isSpawned: false },
    { name: 'obj_43', rect: [400, 121, 120, 453], rotate: false, isSpawned: false },
];

// Positions
export const positions: Positions[] = [
    { canSpawn: ["obj_1", "obj_2", "obj_8", "obj_9", "obj_13", "obj_14", "obj_15", "obj_19", "obj_20", "obj_21", "obj_23"], x: 680, y: 800, isOccupied: false },
    { canSpawn: ["obj_4", "obj_5", "obj_15", "obj_16", "obj_18", "obj_19", "obj_21", "obj_22", "obj_25"], x: 870, y: 670, isOccupied: false },
    { canSpawn: ["obj_4", "obj_5", "obj_26", "obj_27", "obj_28", "obj_29", "obj_30"], x: 3000, y: 630, isOccupied: false },
    { canSpawn: ["obj_3", "obj_7", "obj_11", "obj_12", "obj_17", "obj_28", "obj_31", "obj_32", "obj_33", "obj_34", "obj_42"], x: 2800, y: 1130, isOccupied: false },
    { canSpawn: ["obj_6"], x: 200, y: 130, isOccupied: false },
    { canSpawn: ["obj_6"], x: 1700, y: 100, isOccupied: false },
    { canSpawn: ["obj_10"], x: 2000, y: 440, isOccupied: false },
    { canSpawn: ["obj_15"], x: 2230, y: 400, isOccupied: false },
    { canSpawn: ["obj_23", "obj_32", "obj_15", "obj_35", "obj_36", "obj_39", "obj_40"], x: 1480, y: 1180, isOccupied: false },
    { canSpawn: ["obj_37", "obj_24", "obj_25", "obj_26"], x: 2600, y: 850, isOccupied: false },
    { canSpawn: ["obj_41"], x: 2745, y: 840, isOccupied: false },
    { canSpawn: ["obj_43"], x: 1600, y: 880, isOccupied: false },
]

// Handle click on item
export function handleClick(item: Sprite, spawnedItems: Array<Sprite>, app: Application, availableItem: DataItem) {
    console.log(`Нашли: ${availableItem.name}`);
    const index = spawnedItems.indexOf(item);
    if (index > -1) spawnedItems.splice(index, 1);
    item.eventMode = 'none';
    const tick = () => {
        item.alpha -= 0.05;
        item.scale.set(item.scale.x + 0.02, item.scale.y + 0.02);
        if (item.alpha <= 0) {
            app.ticker.remove(tick);
            item.destroy();
        }
    };
    app.ticker.add(tick);
}