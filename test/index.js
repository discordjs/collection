/* eslint-disable no-console, @typescript-eslint/no-var-requires */

const Collection = require('..');
const assert = require('assert');
function test(desc, fn) {
	try {
		fn();
	} catch (e) {
		console.error(`Failed to ${desc}`);
		throw e;
	}
}

test('do basic map operations', () => {
	const coll = new Collection();
	coll.set('a', 1);
	assert.strictEqual(coll.size, 1);
	assert.ok(coll.has('a'));
	assert.strictEqual(coll.get('a'), 1);
	coll.delete('a');
	assert.ok(!coll.has('a'));
	assert.strictEqual(coll.get('a'), undefined);
	coll.clear();
	assert.strictEqual(coll.size, 0);
});

test('convert collection to array with caching', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const array1 = coll.array();
	assert.deepStrictEqual(array1, [1, 2, 3]);
	assert.ok(array1 === coll.array());
	coll.set('d', 4);
	const array2 = coll.array();
	assert.deepStrictEqual(array2, [1, 2, 3, 4]);
	assert.ok(array2 === coll.array());
});

test('get the first item of the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	assert.strictEqual(coll.first(), 1);
});

test('get the first 3 items of the collection where size equals', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	assert.deepStrictEqual(coll.first(3), [1, 2, 3]);
});

test('get the first 3 items of the collection where size is less', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	assert.deepStrictEqual(coll.first(3), [1, 2]);
});

test('get the last item of the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	assert.deepStrictEqual(coll.last(), 2);
});

test('get the last 3 items of the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	assert.deepStrictEqual(coll.last(3), [1, 2, 3]);
});

test('get the last 3 items of the collection where size is less', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	assert.deepStrictEqual(coll.last(3), [1, 2]);
});

test('find an item in the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	assert.strictEqual(coll.find(x => x === 1), 1);
	assert.strictEqual(coll.find(x => x === 10), undefined);
});

test('sweep items from the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const n1 = coll.sweep(x => x === 2);
	assert.strictEqual(n1, 1);
	assert.deepStrictEqual(coll.array(), [1, 3]);
	const n2 = coll.sweep(x => x === 4);
	assert.strictEqual(n2, 0);
	assert.deepStrictEqual(coll.array(), [1, 3]);
});

test('filter items from the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const filtered = coll.filter(x => x % 2 === 1);
	assert.strictEqual(coll.size, 3);
	assert.strictEqual(filtered.size, 2);
	assert.deepStrictEqual(filtered.array(), [1, 3]);
});

test('partition a collection into two collections', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	coll.set('d', 4);
	coll.set('e', 5);
	coll.set('f', 6);
	const [even, odd] = coll.partition(x => x % 2 === 0);
	assert.deepStrictEqual(even.array(), [2, 4, 6]);
	assert.deepStrictEqual(odd.array(), [1, 3, 5]);
});

test('map items in a collection into an array', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const mapped = coll.map(x => x + 1);
	assert.deepStrictEqual(mapped, [2, 3, 4]);
});

test('map items in a collection into a collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const mapped = coll.mapValues(x => x + 1);
	assert.deepStrictEqual(mapped.array(), [2, 3, 4]);
});

test('flatMap items in a collection into a single collection', () => {
  const coll = new Collection();
  const coll1 = new Collection();
  const coll2 = new Collection();
  coll1.set('z', 1);
  coll1.set('x', 2);
  coll2.set('c', 3);
  coll2.set('v', 4);
  coll.set('a', { a: coll1 });
  coll.set('b', { a: coll2 });
  const mapped = coll.flatMap(x => x.a);
  assert.deepStrictEqual(mapped.array(), [1, 2, 3, 4]);
});

test('check if some items pass a predicate', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	assert.ok(coll.some(x => x === 2));
});

test('check if every items pass a predicate', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	assert.ok(!coll.every(x => x === 2));
});

test('reduce collection into a single value with initial value', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const sum = coll.reduce((a, x) => a + x, 0);
	assert.strictEqual(sum, 6);
});

test('reduce collection into a single value without initial value', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const sum = coll.reduce((a, x) => a + x);
	assert.strictEqual(sum, 6);
});

test('reduce empty collection without initial value', () => {
	const coll = new Collection();
	assert.throws(() => coll.reduce((a, x) => a + x), /^TypeError: Reduce of empty collection with no initial value$/);
});

test('iterate over each item', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const a = [];
	coll.each((v, k) => a.push([k, v]));
	assert.deepStrictEqual(a, [['a', 1], ['b', 2], ['c', 3]]);
});

test('tap the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	coll.tap(c => assert.ok(c === coll));
});

test('shallow clone the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const clone = coll.clone();
	assert.deepStrictEqual(coll.array(), clone.array());
});

test('merge multiple collections', () => {
	const coll1 = new Collection();
	coll1.set('a', 1);
	const coll2 = new Collection();
	coll2.set('b', 2);
	const coll3 = new Collection();
	coll3.set('c', 3);
	const merged = coll1.concat(coll2, coll3);
	assert.deepStrictEqual(merged.array(), [1, 2, 3]);
	assert.ok(coll1 !== merged);
});

test('check equality of two collections', () => {
	const coll1 = new Collection();
	coll1.set('a', 1);
	const coll2 = new Collection();
	coll2.set('a', 1);
	assert.ok(coll1.equals(coll2));
	coll2.set('b', 2);
	assert.ok(!coll1.equals(coll2));
	coll2.clear();
	assert.ok(!coll1.equals(coll2));
});

test('sort a collection in place', () => {
	const coll = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);
	assert.deepStrictEqual(coll.array(), [3, 2, 1]);
	coll.sort((a, b) => a - b);
	assert.deepStrictEqual(coll.array(), [1, 2, 3]);
});

test('random select from a collection', () => {
	const coll = new Collection();
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

	for (let i = 0; i < chars.length; i++) coll.set(chars[i], numbers[i]);

	const random = coll.random(5);
	assert.ok(random.length === 5, "Random didn't return 5 elements");

	const set = new Set(random);
	assert.ok(set.size === random.length, 'Random returned the same elements X times');
});

test('random select with duplicate removal from a collection', () => {
    const coll = new Collection();

    for (const [index, char] of 'aaaaaaaaaaaaaaaaaaab'.split('').entries()) coll.set(index, char);

    const random = coll.random(2, false).sort();
    assert.ok(random.join(', ') === 'a, b', 'Random returned duplicate values');
});

test('sort a collection', () => {
  const coll = new Collection();
  coll.set('a', 3);
  coll.set('b', 2);
  coll.set('c', 1);
  assert.deepStrictEqual(coll.array(), [3, 2, 1]);
  const sorted = coll.sorted((a, b) => a - b);
  assert.deepStrictEqual(coll.array(), [3, 2, 1]);
  assert.deepStrictEqual(sorted.array(), [1, 2, 3]);
});

test('random thisArg tests', () => {
	const coll = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);

	const object = {};
	const string = 'Hi';
	const boolean = false;
	const symbol = Symbol('testArg');
	const array = [1, 2, 3];

	coll.set('d', object);
	coll.set('e', string);
	coll.set('f', boolean);
	coll.set('g', symbol);
	coll.set('h', array);

	coll.some(function thisArgTest1(value) {
		assert.deepStrictEqual(this.valueOf(), 1, 'thisArg is not the number');
		assert.ok(this instanceof Number, 'thisArg is not a Number class');
		return value === this;
	}, 1);

	coll.some(function thisArgTest2(value) {
		assert.deepStrictEqual(this, object, 'thisArg is not the object');
		assert.ok(this.constructor === Object, 'thisArg is not an Object class');
		return value === this;
	}, object);

	coll.some(function thisArgTest3(value) {
		assert.deepStrictEqual(this.valueOf(), string, 'thisArg is not the string');
		assert.ok(this instanceof String, 'thisArg is not a String class');
		return value === this;
	}, string);

	coll.some(function thisArgTest4(value) {
		assert.deepStrictEqual(this.valueOf(), boolean, 'thisArg is not the boolean');
		assert.ok(this instanceof Boolean, 'thisArg is not a Boolean class');
		return value === this;
	}, boolean);

	coll.some(function thisArgTest5(value) {
		assert.deepStrictEqual(this.valueOf(), symbol, 'thisArg is not the symbol');
		assert.ok(this instanceof Symbol, 'thisArg is not a Symbol class');
		return value === this;
	}, symbol);

	coll.some(function thisArgTest6(value) {
		assert.deepStrictEqual(this, array, 'thisArg has different elements than array');
		assert.ok(Array.isArray(this), 'thisArg is not an Array class');
		return value === this;
	}, array);
});
