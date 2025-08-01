import { expect, test } from 'vitest';

import { REL_POS } from './Board';
import Ship, { TYPE } from './Ship';

test('toString', () => {
    const ship = new Ship(TYPE.SHIP);

    expect(typeof ship.toString()).toBe('string');
    expect(typeof ('' + ship)).toBe('string');
});

test('setters/getters', () => {
    const ship = new Ship(TYPE.UNKNOWN);

    ship.playType = TYPE.SHIP;
    expect(ship.graphicalType).toBe(TYPE.SHIP);
    expect(ship.internalType).toBe(TYPE.SHIP);

    ship.graphicalType = TYPE.LEFT;
    expect(ship.playType).toBe(TYPE.SHIP);
    expect(ship.internalType).toBe(TYPE.LEFT);

    ship.internalType = TYPE.VERTICAL;
    expect(ship.playType).toBe(TYPE.SHIP);
    expect(ship.graphicalType).toBe(TYPE.ORTHOGONAL);

    ship.internalType = TYPE.WATER;
    expect(ship.playType).toBe(TYPE.WATER);
    expect(ship.graphicalType).toBe(TYPE.WATER);

    expect(ship.initialType).toBe(TYPE.UNKNOWN);
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

test('typeToRelPos', () => {
    const ship1 = TYPE.LEFT;
    const ship2 = TYPE.RIGHT;
    const ship3 = TYPE.UP;
    const ship4 = TYPE.DOWN;
    const ship5 = TYPE.HORIZONTAL;
    const ship6 = TYPE.SHIP;

    expect(Ship.typeToRelPos(ship1)).toBe(REL_POS.LEFT);
    expect(Ship.typeToRelPos(ship2)).toBe(REL_POS.RIGHT);
    expect(Ship.typeToRelPos(ship3)).toBe(REL_POS.TOP);
    expect(Ship.typeToRelPos(ship4)).toBe(REL_POS.BOTTOM);

    expect(() => { Ship.typeToRelPos(ship5); }).toThrow('has no single corresponding relative position');
    expect(() => { Ship.typeToRelPos(ship6); }).toThrow('has no single corresponding relative position');
});
