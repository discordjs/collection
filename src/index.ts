/* eslint-disable no-dupe-class-members */
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Collection<K, V> extends Map<K, V> {
	private _array!: V[] | null;
	private _keyArray!: K[] | null;
	public static readonly default: typeof Collection = Collection;

	public constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
		super(entries);

		/**
		 * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
		 * @name Collection#_array
		 * @type {?Array}
		 * @private
		 */
		Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

		/**
		 * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
		 * @name Collection#_keyArray
		 * @type {?Array}
		 * @private
		 */
		Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
	}

	public set(key: K, value: V): this {
		this._array = null;
		this._keyArray = null;
		return super.set(key, value);
	}

	public delete(key: K): boolean {
		this._array = null;
		this._keyArray = null;
		return super.delete(key);
	}

	/**
	 * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
	 * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
	 * itself. If you don't want this caching behavior, use `[...collection.values()]` or
	 * `Array.from(collection.values())` instead.
	 * @returns {Array}
	 */
	public array(): V[] {
		if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
		return this._array;
	}

	/**
	 * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
	 * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
	 * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
	 * `Array.from(collection.keys())` instead.
	 * @returns {Array}
	 */
	public keyArray(): K[] {
		if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
		return this._keyArray;
	}

	/**
	 * Obtains the first value(s) in this collection.
	 * @param {number} [amount] Amount of values to obtain from the beginning
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
	 * amount is negative
	 */
	public first(): V | undefined;
	public first(amount: number): V[];
	public first(amount?: number): V | V[] | undefined {
		if (typeof amount === 'undefined') return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.values();
		return Array.from({ length: amount }, (): V => iter.next().value);
	}

	/**
	 * Obtains the first key(s) in this collection.
	 * @param {number} [amount] Amount of keys to obtain from the beginning
	 * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
	 * amount is negative
	 */
	public firstKey(): K | undefined;
	public firstKey(amount: number): K[];
	public firstKey(amount?: number): K | K[] | undefined {
		if (typeof amount === 'undefined') return this.keys().next().value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.keys();
		return Array.from({ length: amount }, (): K => iter.next().value);
	}

	/**
	 * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
	 * mechanism applies here as well.
	 * @param {number} [amount] Amount of values to obtain from the end
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
	 * amount is negative
	 */
	public last(): V | undefined;
	public last(amount: number): V[];
	public last(amount?: number): V | V[] | undefined {
		const arr = this.array();
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
	 * mechanism applies here as well.
	 * @param {number} [amount] Amount of keys to obtain from the end
	 * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the start if
	 * amount is negative
	 */
	public lastKey(): K | undefined;
	public lastKey(amount: number): K[];
	public lastKey(amount?: number): K | K[] | undefined {
		const arr = this.keyArray();
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains unique random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
	 * mechanism applies here as well.
	 * @param {number} [amount] Amount of values to obtain randomly
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values
	 */
	public random(): V;
	public random(amount: number): V[];
	public random(amount?: number): V | V[] {
		let arr = this.array();
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (arr.length === 0 || !amount) return [];
		arr = arr.slice();
		return Array.from({ length: amount }, (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
	}

	/**
	 * Obtains unique random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
	 * mechanism applies here as well.
	 * @param {number} [amount] Amount of keys to obtain randomly
	 * @returns {*|Array<*>} A single key if no amount is provided or an array
	 */
	public randomKey(): K;
	public randomKey(amount: number): K[];
	public randomKey(amount?: number): K | K[] {
		let arr = this.keyArray();
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (arr.length === 0 || !amount) return [];
		arr = arr.slice();
		return Array.from({ length: amount }, (): K => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
	}

	/**
	 * Searches for a single item where the given function returns a truthy value. This behaves like
	 * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
	 * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
	 * should use the `get` method. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {*}
	 * @example collection.find(user => user.username === 'Bob');
	 */
	public find(fn: (value: V, key: K, collection: this) => boolean): V | undefined;
	public find<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): V | undefined;
	public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		}
		return undefined;
	}

	/**
	 * Searches for the key of a single item where the given function returns a truthy value. This behaves like
	 * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
	 * but returns the key rather than the positional index.
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {*}
	 * @example collection.findKey(user => user.username === 'Bob');
	 */
	public findKey(fn: (value: V, key: K, collection: this) => boolean): K | undefined;
	public findKey<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): K | undefined;
	public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): K | undefined {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return key;
		}
		return undefined;
	}

	/**
	 * Removes entries that satisfy the provided filter function.
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {number} The number of removed entries
	 */
	public sweep(fn: (value: V, key: K, collection: this) => boolean): number;
	public sweep<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): number;
	public sweep(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): number {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [key, val] of this) {
			if (fn(val, key, this)) this.delete(key);
		}
		return previousSize - this.size;
	}

	/**
	 * Identical to
	 * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * but returns a Collection instead of an Array.
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example collection.filter(user => user.username === 'Bob');
	 */
	public filter(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V>;
	public filter<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): Collection<K, V>;
	public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): Collection<K, V> {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		// @ts-ignore
		const results = new this.constructor[Symbol.species]();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection[]}
	 * @example const [big, small] = collection.partition(guild => guild.memberCount > 250);
	 */
	public partition(fn: (value: V, key: K, collection: this) => boolean): [Collection<K, V>, Collection<K, V>];
	public partition<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): [Collection<K, V>, Collection<K, V>];
	public partition(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): [Collection<K, V>, Collection<K, V>] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		// @ts-ignore
		const results: [Collection<K, V>, Collection<K, V>] = [new this.constructor[Symbol.species](), new this.constructor[Symbol.species]()];
		for (const [key, val] of this) {
			if (fn(val, key, this)) {
				results[0].set(key, val);
			} else {
				results[1].set(key, val);
			}
		}
		return results;
	}

	/**
	 * Maps each item to another value into an array. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param {Function} fn Function that produces an element of the new array, taking three arguments
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Array}
	 * @example collection.map(user => user.tag);
	 */
	public map<T>(fn: (value: V, key: K, collection: this) => T): T[];
	public map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
	public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const iter = this.entries();
		return Array.from({ length: this.size }, (): T => {
			const [key, value] = iter.next().value;
			return fn(value, key, this);
		});
	}

	/**
	 * Maps each item to another value into a collection. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param {Function} fn Function that produces an element of the new collection, taking three arguments
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example collection.mapValues(user => user.tag);
	 */
	public mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T>;
	public mapValues<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): Collection<K, T>;
	public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): Collection<K, T> {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		// @ts-ignore
		const coll = new this.constructor[Symbol.species]();
		for (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}

	/**
	 * Checks if there exists an item that passes a test. Identical in behavior to
	 * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {boolean}
	 * @example collection.some(user => user.discriminator === '0000');
	 */
	public some(fn: (value: V, key: K, collection: this) => boolean): boolean;
	public some<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): boolean;
	public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return true;
		}
		return false;
	}

	/**
	 * Checks if all items passes a test. Identical in behavior to
	 * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {boolean}
	 * @example collection.every(user => !user.bot);
	 */
	public every(fn: (value: V, key: K, collection: this) => boolean): boolean;
	public every<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): boolean;
	public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false;
		}
		return true;
	}

	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
	 * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
	 * and `collection`
	 * @param {*} [initialValue] Starting value for the accumulator
	 * @returns {*}
	 * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
	 */
	public reduce<T>(fn: (accumulator: any, value: V, key: K, collection: this) => T, initialValue?: T): T {
		let accumulator!: T;

		if (typeof initialValue !== 'undefined') {
			accumulator = initialValue;
			for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
			return accumulator;
		}
		let first = true;
		for (const [key, val] of this) {
			if (first) {
				accumulator = val as unknown as T;
				first = false;
				continue;
			}
			accumulator = fn(accumulator, val, key, this);
		}

		// No items iterated.
		if (first) {
			throw new TypeError('Reduce of empty collection with no initial value');
		}

		return accumulator;
	}

	/**
	 * Identical to
	 * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
	 * but returns the collection instead of undefined.
	 * @param {Function} fn Function to execute for each element
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example
	 * collection
	 *  .each(user => console.log(user.username))
	 *  .filter(user => user.bot)
	 *  .each(user => console.log(user.username));
	 */
	public each(fn: (value: V, key: K, collection: Map<K, V>) => void): this;
	public each<T>(fn: (this: T, value: V, key: K, collection: Map<K, V>) => void, thisArg: T): this;
	public each(fn: (value: V, key: K, collection: Map<K, V>) => void, thisArg?: unknown): this {
		this.forEach(fn, thisArg);
		return this;
	}

	/**
	 * Runs a function on the collection and returns the collection.
	 * @param {Function} fn Function to execute
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example
	 * collection
	 *  .tap(coll => console.log(coll.size))
	 *  .filter(user => user.bot)
	 *  .tap(coll => console.log(coll.size))
	 */
	public tap(fn: (collection: this) => void): this;
	public tap<T>(fn: (this: T, collection: this) => void, thisArg: T): this;
	public tap(fn: (collection: this) => void, thisArg?: unknown): this {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		fn(this);
		return this;
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 * @returns {Collection}
	 * @example const newColl = someColl.clone();
	 */
	public clone(): Collection<K, V> {
		// @ts-ignore
		return new this.constructor[Symbol.species](this);
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 * @param {...Collection} collections Collections to merge
	 * @returns {Collection}
	 * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 */
	public concat(...collections: Collection<K, V>[]): Collection<K, V> {
		const newColl = this.clone();
		for (const coll of collections) {
			for (const [key, val] of coll) newColl.set(key, val);
		}
		return newColl;
	}

	/**
	 * Checks if this collection shares identical key-value pairings with another.
	 * This is different to checking for equality using equal-signs, because
	 * the collections may be different objects, but contain the same data.
	 * @param {Collection} collection Collection to compare with
	 * @returns {boolean} Whether the collections have identical contents
	 */
	public equals(collection: Collection<K, V>): boolean {
		if (!collection) return false;
		if (this === collection) return true;
		if (this.size !== collection.size) return false;
		for (const [key, value] of this) {
			if (!collection.has(key) || value !== collection.get(key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * The sort() method sorts the elements of a collection and returns it.
	 * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
	 * @param {Function} [compareFunction] Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @returns {Collection}
	 * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 */
	public sort(compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number => Number(x > y) || Number(x === y) - 1): this {
		const entries = [...this.entries()];
		entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));
		this.clear();
		for (const [k, v] of entries) {
			this.set(k, v);
		}
		return this;
	}
}

export = Collection as typeof Collection & {
	default: typeof Collection;
};
