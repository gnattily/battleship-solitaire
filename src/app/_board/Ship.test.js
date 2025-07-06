import { expect, test } from 'vitest';

import { REL_POS } from './BoardBuilder';
import Ship, { TYPE } from './Ship';

test('toString', () => {
    const ship = new Ship(TYPE.UNKNOWN);
    ship.graphicalType = 11;

    expect(() => { ship.toString(); }).toThrow('graphicalType is not a valid graphical type');
});

test('setPlayType', () => {
    const ship = new Ship(TYPE.UNKNOWN);

    expect(() => { ship.setPlayType(TYPE.HORIZONTAL); }).toThrow('newType must be a play type');

    ship.setPlayType(TYPE.SHIP);
    expect(ship.graphicalType).toBe(TYPE.SHIP);

    ship.setGraphicalType(TYPE.HORIZONTAL);
    ship.setPlayType(TYPE.SHIP);
    expect(ship.graphicalType).toBe(TYPE.HORIZONTAL);

    expect(ship.playType).toBe(TYPE.SHIP);
    expect(ship.setPlayType(TYPE.WATER) instanceof Ship).toBeTruthy();
});

test('setGraphicalType', () => {
    const ship = new Ship(TYPE.HORIZONTAL);

    expect(() => { ship.setGraphicalType(20); }).toThrow('newType must be a graphical type');

    ship.setGraphicalType(TYPE.WATER);
    expect(ship.playType).toBe(TYPE.WATER);

    ship.setGraphicalType(TYPE.VERTICAL);
    expect(ship.playType).toBe(TYPE.SHIP);

    expect(ship.graphicalType).toBe(TYPE.VERTICAL);
    expect(ship.setGraphicalType(TYPE.RIGHT) instanceof Ship).toBeTruthy();
});

test('equals', () => {
    const ship1 = new Ship(TYPE.HORIZONTAL);
    const ship2 = new Ship(TYPE.HORIZONTAL);
    const ship3 = new Ship(TYPE.LEFT);

    expect(ship1.equals(ship2)).toBeTruthy();
    expect(ship1.equals(ship3)).toBeFalsy();
    expect(ship3.equals(ship1)).toBeFalsy();
    expect(ship3.equals(ship2)).toBeFalsy();
});

test('isCardinal', () => {
    const left = new Ship(TYPE.LEFT);
    const up = new Ship(TYPE.DOWN);
    const horiztonal = new Ship(TYPE.HORIZONTAL);
    const ship = new Ship(TYPE.SHIP);

    expect(left.isCardinal()).toBeTruthy();
    expect(up.isCardinal()).toBeTruthy();
    expect(horiztonal.isCardinal()).toBeFalsy();
    expect(ship.isCardinal()).toBeFalsy();
});

test('isOrthogonal', () => {
    const left = new Ship(TYPE.LEFT);
    const up = new Ship(TYPE.DOWN);
    const horiztonal = new Ship(TYPE.HORIZONTAL);
    const vertical = new Ship(TYPE.VERTICAL);
    const ship = new Ship(TYPE.SHIP);

    expect(left.isOrthogonal()).toBeFalsy();
    expect(up.isOrthogonal()).toBeFalsy();
    expect(horiztonal.isOrthogonal()).toBeTruthy();
    expect(vertical.isOrthogonal()).toBeTruthy();
    expect(ship.isOrthogonal()).toBeFalsy();
});

test('isEnd', () => {
    const left = new Ship(TYPE.LEFT);
    const up = new Ship(TYPE.DOWN);
    const single = new Ship(TYPE.SINGLE);
    const horiztonal = new Ship(TYPE.HORIZONTAL);
    const ship = new Ship(TYPE.SHIP);

    expect(left.isEnd()).toBeTruthy();
    expect(up.isEnd()).toBeTruthy();
    expect(single.isEnd()).toBeTruthy();
    expect(horiztonal.isEnd()).toBeFalsy();
    expect(ship.isEnd()).toBeFalsy();
});

test('isPlayType', () => {
    const comparate1 = TYPE.SHIP;
    const comparate2 = TYPE.WATER;
    const comparate3 = TYPE.UNKNOWN;

    const ship1 = new Ship(TYPE.SHIP);
    const ship2 = new Ship(TYPE.WATER);
    const ship3 = new Ship(TYPE.UNKNOWN);
    const ship4 = new Ship(TYPE.SHIP);

    const combo1 = [ship1, ship2, ship3];
    const combo2 = [ship1, ship4];
    const combo3 = [ship2, ship3, ship4];

    expect(Ship.isPlayType(ship1, comparate1)).toBeTruthy();
    expect(Ship.isPlayType(ship1, comparate2)).toBeFalsy();
    expect(Ship.isPlayType(ship2, comparate1)).toBeFalsy();
    expect(Ship.isPlayType(ship2, comparate2)).toBeTruthy();
    expect(Ship.isPlayType(ship3, comparate3)).toBeTruthy();
    expect(Ship.isPlayType(ship3, comparate1)).toBeFalsy();

    expect(Ship.isPlayType(combo1, comparate1)).toBeFalsy();
    expect(Ship.isPlayType(combo1, comparate2)).toBeFalsy();
    expect(Ship.isPlayType(combo2, comparate1)).toBeTruthy();
    expect(Ship.isPlayType(combo2, comparate3)).toBeFalsy();
    expect(Ship.isPlayType(combo3, comparate2)).toBeFalsy();
    expect(Ship.isPlayType(combo3, comparate3)).toBeFalsy();
});

test('isWater', () => {
    const ship1 = new Ship(TYPE.SHIP);
    const ship2 = new Ship(TYPE.WATER);
    const ship3 = new Ship(TYPE.UNKNOWN);

    expect(Ship.isWater(ship1)).toBeFalsy();
    expect(Ship.isWater(ship2)).toBeTruthy();
    expect(Ship.isWater(ship3)).toBeFalsy();
});

test('isShip', () => {
    const ship1 = new Ship(TYPE.SHIP);
    const ship2 = new Ship(TYPE.WATER);
    const ship3 = new Ship(TYPE.UNKNOWN);

    expect(Ship.isShip(ship1)).toBeTruthy();
    expect(Ship.isShip(ship2)).toBeFalsy();
    expect(Ship.isShip(ship3)).toBeFalsy();
});

test('isUnknown', () => {
    const ship1 = new Ship(TYPE.SHIP);
    const ship2 = new Ship(TYPE.WATER);
    const ship3 = new Ship(TYPE.UNKNOWN);

    expect(Ship.isUnknown(ship1)).toBeFalsy();
    expect(Ship.isUnknown(ship2)).toBeFalsy();
    expect(Ship.isUnknown(ship3)).toBeTruthy();
});

test('typeToRelativePosition', () => {
    const ship1 = TYPE.LEFT;
    const ship2 = TYPE.RIGHT;
    const ship3 = TYPE.UP;
    const ship4 = TYPE.DOWN;
    const ship5 = TYPE.HORIZONTAL;
    const ship6 = TYPE.SHIP;

    expect(Ship.typeToRelativePosition(ship1)).toBe(REL_POS.LEFT);
    expect(Ship.typeToRelativePosition(ship2)).toBe(REL_POS.RIGHT);
    expect(Ship.typeToRelativePosition(ship3)).toBe(REL_POS.TOP);
    expect(Ship.typeToRelativePosition(ship4)).toBe(REL_POS.BOTTOM);

    expect(() => { Ship.typeToRelativePosition(ship5); }).toThrow('has no single corresponding relative position');
    expect(() => { Ship.typeToRelativePosition(ship6); }).toThrow('has no single corresponding relative position');
});

test('doesn\'t delete attributes', () => {
    expect(new Ship(TYPE.SHIP).playType).toBeDefined();
    expect(new Ship(TYPE.WATER).playType).toBeDefined();
    expect(new Ship(TYPE.UNKNOWN).playType).toBeDefined();
});
