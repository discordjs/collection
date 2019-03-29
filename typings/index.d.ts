declare class Collection<K, V> extends Map<K, V> {
	private _array: V[];
	private _keyArray: K[];

	public array(): V[];
	public clone(): Collection<K, V>;
	public concat(...collections: Collection<K, V>[]): Collection<K, V>;
	public each(fn: (value: V, key: K, collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
	public equals(collection: Collection<any, any>): boolean;
	public every(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
	public filter(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): Collection<K, V>;
	public find(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): V;
	public findKey(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): K;
	public first(): V | undefined;
	public first(count: number): V[];
	public firstKey(): K | undefined;
	public firstKey(count: number): K[];
	public keyArray(): K[];
	public last(): V | undefined;
	public last(count: number): V[];
	public lastKey(): K | undefined;
	public lastKey(count: number): K[];
	public map<T>(fn: (value: V, key: K, collection: Collection<K, V>) => T, thisArg?: any): T[];
	public mapValues<T>(fn: (value: V, key: K, collection: Collection<K, V>) => T, thisArg?: any): Collection<K, T>;
	public partition(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): [Collection<K, V>, Collection<K, V>];
	public random(): V | undefined;
	public random(count: number): V[];
	public randomKey(): K | undefined;
	public randomKey(count: number): K[];
	public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: Collection<K, V>) => T, initialValue?: T): T;
	public some(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
	public sort(compareFunction?: (a: V, b: V, c?: K, d?: K) => number): Collection<K, V>;
	public sweep(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): number;
	public tap(fn: (collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
}

export default Collection;
