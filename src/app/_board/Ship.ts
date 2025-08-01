import { REL_POS } from './Board';
import type { RelativePosition } from './Board';

/**
 * Ships on the Board
 * @property {PlayType} playType The play type of the ship
 * @property {GraphicalType} graphicalType The graphical type of the ship
 * @property {InternalType} internalType The internal type of the ship
 * @property {boolean} pinned Should the ship's type change (useful for presets)
 */
export default class Ship {
    readonly #initialType: AnyType;
    #type: AnyType = 0;
    pinned: boolean;

    constructor (type: AnyType, pinned = false) {
        this.#initialType = type;
        this.internalType = type;
        this.pinned = pinned;
    }

    set playType (type: PlayType) {
        if (type > TYPE.SHIP) throw new Error('Expected type to be a PlayType (0-2), got ' + type);
        if (type !== TYPE.SHIP || this.#type < TYPE.SHIP) this.#type = type;
    }

    set graphicalType (type: GraphicalType) {
        if (type > TYPE.ORTHOGONAL) throw new Error('Expected type to be a GraphicalType (0-8), got ' + type);
        if (type !== TYPE.ORTHOGONAL || this.#type < TYPE.ORTHOGONAL) this.#type = type;
    }

    set internalType (type: InternalType) {
        if (type > TYPE.HORIZONTAL) throw new Error('Expected type to be an InternalType (0-10), got ' + type);
        this.#type = type;
    }

    get playType (): PlayType {
        if (this.#type >= TYPE.SHIP) return TYPE.SHIP;
        else return this.#type as PlayType;
    }

    get graphicalType (): GraphicalType {
        if (this.#type >= TYPE.ORTHOGONAL) return TYPE.ORTHOGONAL;
        else return this.#type as GraphicalType;
    }

    get internalType (): InternalType {
        return this.#type;
    }

    get initialType (): AnyType {
        return this.#initialType;
    }

    // I want the string literals without effort
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    toString () {
        switch (this.graphicalType) {
            case TYPE.UNKNOWN: return ' ';
            case TYPE.WATER: return '~';
            case TYPE.SHIP: return '?';
            case TYPE.DOWN: return '⯅';
            case TYPE.LEFT: return '⯈';
            case TYPE.RIGHT: return '⯇';
            case TYPE.UP: return '⯆';
            case TYPE.SINGLE: return '●';
            case TYPE.ORTHOGONAL: return '■';
            default: throw new Error('this.graphicalType is not a graphicalType.');
        }
    }

    /**
     * Use this instead of ===, doesn't check for pins
     */
    equals (comparate: Ship): boolean {
        return comparate.internalType === this.internalType;
    }

    /**
     * Checks if the ship is cardinal
     */
    isCardinal (): boolean {
        return CARDINALS.has(this.internalType);
    }

    /**
     * Checks if the ship is an end piece
     */
    isEnd (): boolean {
        return ENDS.has(this.internalType);
    }

    /**
     * Returns true if all provided squares are a certain type
     */
    static isPlayType (type: PlayType, ...squares: Ship[]): boolean {
        for (const square of squares) {
            if (square.playType !== type) return false;
        }

        return true;
    }

    static isWater (...squares: Ship[]): boolean {
        return Ship.isPlayType(TYPE.WATER, ...squares);
    }

    static isShip (...squares: Ship[]): boolean {
        return Ship.isPlayType(TYPE.SHIP, ...squares);
    }

    static isUnknown (...squares: Ship[]): boolean {
        return Ship.isPlayType(TYPE.UNKNOWN, ...squares);
    }

    /**
     * Converts a graphical type to its corresponding relative position
     * @throws If there's no single corresponding relative position
     */
    static typeToRelPos (type: AnyType): RelativePosition {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (type) {
            case TYPE.LEFT: return REL_POS.LEFT;
            case TYPE.RIGHT: return REL_POS.RIGHT;
            case TYPE.UP: return REL_POS.TOP;
            case TYPE.DOWN: return REL_POS.BOTTOM;
            default: throw new Error(`${type} has no single corresponding relative position`);
        }
    }
}

/**
 * Everything a square could be
 * @enum {number}
 */
export const TYPE = {
    UNKNOWN: 0,
    WATER: 1,
    SHIP: 2,

    SINGLE: 3,
    UP: 4,
    RIGHT: 5,
    DOWN: 6,
    LEFT: 7,
    ORTHOGONAL: 8,

    VERTICAL: 9,
    HORIZONTAL: 10,
} as const;

const CARDINALS = new Set<AnyType>([
    TYPE.UP, TYPE.RIGHT, TYPE.DOWN, TYPE.LEFT,
]);

const ENDS = new Set<AnyType>([
    TYPE.UP, TYPE.RIGHT, TYPE.DOWN, TYPE.LEFT, TYPE.SINGLE,
]);

export type PlayType = typeof TYPE['UNKNOWN' | 'WATER' | 'SHIP'];
export type GraphicalType = typeof TYPE['UNKNOWN' | 'WATER' | 'SHIP' | 'SINGLE' | 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' | 'ORTHOGONAL'];
export type InternalType = typeof TYPE[keyof typeof TYPE];
export type AnyType = typeof TYPE[keyof typeof TYPE];
