import { expect, test } from 'vitest';

import { REL_POS } from './Board';
import Ship, { TYPES } from './Ship';

test('toString', () => {
    const ship = new Ship(TYPES.SHIP);

    expect(typeof ship.toString()).toBe('string');
    expect(typeof ('' + ship)).toBe('string');
});

test('setters/getters', () => {
    const ship = new Ship(TYPES.UNKNOWN);

    ship.playType = TYPES.SHIP;
    expect(ship.graphicalType).toBe(TYPES.SHIP);
    expect(ship.internalType).toBe(TYPES.SHIP);

    ship.graphicalType = TYPES.LEFT;
    expect(ship.playType).toBe(TYPES.SHIP);
    expect(ship.internalType).toBe(TYPES.LEFT);

    ship.internalType = TYPES.VERTICAL;
    expect(ship.playType).toBe(TYPES.SHIP);
    expect(ship.graphicalType).toBe(TYPES.ORTHOGONAL);

    ship.internalType = TYPES.WATER;
    expect(ship.playType).toBe(TYPES.WATER);
    expect(ship.graphicalType).toBe(TYPES.WATER);

    expect(ship.initialType).toBe(TYPES.UNKNOWN);
});

test('equals', () => {
    const ship1 = new Ship(TYPES.HORIZONTAL);
    const ship2 = new Ship(TYPES.HORIZONTAL);
    const ship3 = new Ship(TYPES.LEFT);

    expect(ship1.equals(ship2)).toBeTruthy();
    expect(ship1.equals(ship3)).toBeFalsy();
    expect(ship3.equals(ship1)).toBeFalsy();
    expect(ship3.equals(ship2)).toBeFalsy();
});

test('isCardinal', () => {
    const left = new Ship(TYPES.LEFT);
    const up = new Ship(TYPES.DOWN);
    const horiztonal = new Ship(TYPES.HORIZONTAL);
    const ship = new Ship(TYPES.SHIP);

    expect(left.isCardinal()).toBeTruthy();
    expect(up.isCardinal()).toBeTruthy();
    expect(horiztonal.isCardinal()).toBeFalsy();
    expect(ship.isCardinal()).toBeFalsy();
});

test('isEnd', () => {
    const left = new Ship(TYPES.LEFT);
    const up = new Ship(TYPES.DOWN);
    const single = new Ship(TYPES.SINGLE);
    const horiztonal = new Ship(TYPES.HORIZONTAL);
    const ship = new Ship(TYPES.SHIP);

    expect(left.isEnd()).toBeTruthy();
    expect(up.isEnd()).toBeTruthy();
    expect(single.isEnd()).toBeTruthy();
    expect(horiztonal.isEnd()).toBeFalsy();
    expect(ship.isEnd()).toBeFalsy();
});

test('isPlayType', () => {
    const comparate1 = TYPES.SHIP;
    const comparate2 = TYPES.WATER;
    const comparate3 = TYPES.UNKNOWN;

    const ship1 = new Ship(TYPES.SHIP);
    const ship2 = new Ship(TYPES.WATER);
    const ship3 = new Ship(TYPES.UNKNOWN);
    const ship4 = new Ship(TYPES.SHIP);

    const combo1 = [ship1, ship2, ship3];
    const combo2 = [ship1, ship4];
    const combo3 = [ship2, ship3, ship4];

    expect(Ship.isPlayType(comparate1, ship1)).toBeTruthy();
    expect(Ship.isPlayType(comparate2, ship1)).toBeFalsy();
    expect(Ship.isPlayType(comparate1, ship2)).toBeFalsy();
    expect(Ship.isPlayType(comparate2, ship2)).toBeTruthy();
    expect(Ship.isPlayType(comparate3, ship3)).toBeTruthy();
    expect(Ship.isPlayType(comparate1, ship3)).toBeFalsy();

    expect(Ship.isPlayType(comparate1, ...combo1)).toBeFalsy();
    expect(Ship.isPlayType(comparate2, ...combo1)).toBeFalsy();
    expect(Ship.isPlayType(comparate1, ...combo2)).toBeTruthy();
    expect(Ship.isPlayType(comparate3, ...combo2)).toBeFalsy();
    expect(Ship.isPlayType(comparate2, ...combo3)).toBeFalsy();
    expect(Ship.isPlayType(comparate3, ...combo3)).toBeFalsy();
});

test('isWater', () => {
    const ship1 = new Ship(TYPES.SHIP);
    const ship2 = new Ship(TYPES.WATER);
    const ship3 = new Ship(TYPES.UNKNOWN);

    expect(Ship.isWater(ship1)).toBeFalsy();
    expect(Ship.isWater(ship2)).toBeTruthy();
    expect(Ship.isWater(ship3)).toBeFalsy();
});

test('isShip', () => {
    const ship1 = new Ship(TYPES.SHIP);
    const ship2 = new Ship(TYPES.WATER);
    const ship3 = new Ship(TYPES.UNKNOWN);

    expect(Ship.isShip(ship1)).toBeTruthy();
    expect(Ship.isShip(ship2)).toBeFalsy();
    expect(Ship.isShip(ship3)).toBeFalsy();
});

test('isUnknown', () => {
    const ship1 = new Ship(TYPES.SHIP);
    const ship2 = new Ship(TYPES.WATER);
    const ship3 = new Ship(TYPES.UNKNOWN);

    expect(Ship.isUnknown(ship1)).toBeFalsy();
    expect(Ship.isUnknown(ship2)).toBeFalsy();
    expect(Ship.isUnknown(ship3)).toBeTruthy();
});

test('typeToRelPos', () => {
    const ship1 = TYPES.LEFT;
    const ship2 = TYPES.RIGHT;
    const ship3 = TYPES.UP;
    const ship4 = TYPES.DOWN;
    const ship5 = TYPES.HORIZONTAL;
    const ship6 = TYPES.SHIP;

    expect(Ship.typeToRelPos(ship1)).toBe(REL_POS.LEFT);
    expect(Ship.typeToRelPos(ship2)).toBe(REL_POS.RIGHT);
    expect(Ship.typeToRelPos(ship3)).toBe(REL_POS.TOP);
    expect(Ship.typeToRelPos(ship4)).toBe(REL_POS.BOTTOM);

    expect(() => { Ship.typeToRelPos(ship5); }).toThrow('has no single corresponding relative position');
    expect(() => { Ship.typeToRelPos(ship6); }).toThrow('has no single corresponding relative position');
});
