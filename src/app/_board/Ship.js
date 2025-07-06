/* eslint-disable jsdoc/no-undefined-types */
import { REL_POS } from './BoardBuilder';

/**
 * The ship class for the board
 * @property {PlayType} playType - The play type of the ship
 * @property {GraphicalType} graphicalType - The graphical type of the ship
 * @property {InternalType} internalType = The internal type of the ship
 */
export default class Ship {
    #type = 0;

    /**
     * @param {AnyType} type The play or graphical type of the ship
     * @param {boolean} [pinned] Should the Ship's type change (used for presets)
     */
    constructor (type, pinned) {
        this.internalType = type;
        this.pinned = pinned;
    }

    toString () {
        switch (this.graphicalType) {
            case GRAPHICAL_TYPES.UNKNOWN:
                return ' ';
            case GRAPHICAL_TYPES.WATER:
                return '☵';
            case GRAPHICAL_TYPES.SHIP:
                return '◯';
            case GRAPHICAL_TYPES.DOWN:
                return '⯅';
            case GRAPHICAL_TYPES.HORIZONTAL:
                return '■';
            case GRAPHICAL_TYPES.LEFT:
                return '⯈';
            case GRAPHICAL_TYPES.RIGHT:
                return '⯇';
            case GRAPHICAL_TYPES.SINGLE:
                return '●';
            case GRAPHICAL_TYPES.UP:
                return '⯆';
            case GRAPHICAL_TYPES.VERTICAL:
                return '■';
        }
    }

    /**
     * Set the play type
     * @param {PlayType} type The new type
     */
    set playType (type) {
        if (type >= TYPE.SHIP && this.#type >= TYPE.SHIP) return;
        this.#type = type;
    }

    /**
     * Set the graphical type
     * @param {GraphicalType} type The new type
     */
    set graphicalType (type) {
        if (type >= TYPE.ORTHOGONAL && this.#type >= TYPE.ORTHOGONAL) return;
        this.#type = type;
    }

    /**
     * Set the internal type
     * @param {InternalType} type The new type
     */
    set internalType (type) {
        this.#type = type;
    }

    /**
     * Get the play type
     * @returns {PlayType} The play type
     */
    get playType () {
        if (this.#type >= TYPE.SHIP) return TYPE.SHIP;
        else return this.#type;
    }

    /**
     * Get the graphical type
     * @returns {GraphicalType} The graphical type
     */
    get graphicalType () {
        if (this.#type >= TYPE.ORTHOGONAL) return TYPE.ORTHOGONAL;
        else return this.#type;
    }

    /**
     * Get the internal type
     * @returns {InternalType} The internal type
     */
    get internalType () {
        return this.#type;
    }

    /**
     * Use this instead of ===, doesn't check for pins
     * @param {Ship} comparate The ship to compare with
     * @returns {boolean} true if internal types are equal
     */
    equals (comparate) {
        return comparate.internalType === this.internalType;
    }

    /**
     * Checks if the ship is cardinal
     * @returns {boolean} true if ship is left, right, up, or down
     */
    isCardinal () {
        return [TYPE.LEFT, TYPE.RIGHT, TYPE.UP, TYPE.DOWN].includes(this.graphicalType);
    }

    /**
     * Checks if the ship is an end piece
     * @returns {boolean} true if ship is left, right, up, down, or single
     */
    isEnd () {
        return [TYPE.LEFT, TYPE.RIGHT, TYPE.UP, TYPE.DOWN, TYPE.SINGLE].includes(this.graphicalType);
    }

    // -TODO make this use a spread argument instead of an array
    // so type first then all your arguments (but can still accept an array)
    /**
     * Returns true if all provided squares are a certain type
     * @param {PlayType} type The play type to check the square(s) for
     * @param {...Ship} squares The square(s) to check
     * @returns {boolean} True if the square is the given play type
     */
    static isPlayType (type, ...squares) {
        squares.forEach(square => {
            if (square.playType !== type) return false;
        });

        return true;
    }

    static isWater (...squares) {
        return Ship.isPlayType(TYPE.WATER, ...squares);
    }

    static isShip (...squares) {
        return Ship.isPlayType(TYPE.SHIP, ...squares);
    }

    static isUnknown (...squares) {
        return Ship.isPlayType(TYPE.UNKNOWN, ...squares);
    }

    // -TODO rename this
    /**
     * Convert a graphical type to its corresponding relative position
     * @param {AnyType} type The type to convert
     * @returns {number} The corresponding relative position
     * @throws If there's no single corresponding relative position
     */
    static typeToRelativePosition (type) {
        switch (type) {
            case TYPE.LEFT:
                return REL_POS.LEFT;
            case TYPE.RIGHT:
                return REL_POS.RIGHT;
            case TYPE.UP:
                return REL_POS.TOP;
            case TYPE.DOWN:
                return REL_POS.BOTTOM;
            default:
                throw new Error(`${type} has no single corresponding relative position`);
        }
    }
}

/**
 * Everything a square could be
 * @enum {number}
 */
export const TYPE = {
    /** @type {0} */
    UNKNOWN: 0,
    /** @type {1} */
    WATER: 1,
    /** @type {2} */
    SHIP: 2,

    /** @type {3} */
    SINGLE: 3,
    /** @type {4} */
    UP: 4,
    /** @type {5} */
    RIGHT: 5,
    /** @type {6} */
    DOWN: 6,
    /** @type {7} */
    LEFT: 7,
    /** @type {8} */
    ORTHOGONAL: 8,

    /** @type {9} */
    VERTICAL: 9,
    /** @type {10} */
    HORIZONTAL: 10,
};

// I know this is massive but trust it's worth it
// no I will not use typescript

/**
 * @typedef { typeof TYPE.UNKNOWN | typeof TYPE.WATER | typeof TYPE.SHIP } PlayType
 */

/**
 * @typedef { typeof TYPE.UNKNOWN | typeof TYPE.WATER | typeof TYPE.SHIP |
 *            typeof TYPE.SINGLE | typeof TYPE.UP | typeof TYPE.RIGHT |
 *            typeof TYPE.DOWN | typeof TYPE.LEFT | typeof TYPE.ORTHOGONAL } GraphicalType
 */

/**
 * @typedef { typeof TYPE.UNKNOWN | typeof TYPE.WATER | typeof TYPE.SHIP |
 *            typeof TYPE.SINGLE | typeof TYPE.UP | typeof TYPE.RIGHT |
 *            typeof TYPE.DOWN | typeof TYPE.LEFT | typeof TYPE.ORTHOGONAL |
 *            typeof TYPE.VERTICAL | typeof TYPE.HORIZONTAL } InternalType
 */

/**
 * @typedef {InternalType} AnyType
 */
