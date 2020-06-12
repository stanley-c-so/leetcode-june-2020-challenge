// --- Day 12: Insert Delete GetRandom O(1) ---

// Design a data structure that supports all following operations in average O(1) time.

// insert(val): Inserts an item val to the set if not already present.
// remove(val): Removes an item val from the set if present.
// getRandom: Returns a random element from current set of elements.Each element must have the same probability of being returned.

// Example:

// // Init an empty set.
// RandomizedSet randomSet = new RandomizedSet();

// // Inserts 1 to the set. Returns true as 1 was inserted successfully.
// randomSet.insert(1);

// // Returns false as 2 does not exist in the set.
// randomSet.remove(2);

// // Inserts 2 to the set, returns true. Set now contains [1,2].
// randomSet.insert(2);

// // getRandom should return either 1 or 2 randomly.
// randomSet.getRandom();

// // Removes 1 from the set, returns true. Set now contains [2].
// randomSet.remove(1);

// // 2 was already in the set, so return false.
// randomSet.insert(2);

// // Since 2 is the only number in the set, getRandom always return 2.
// randomSet.getRandom();

// ----------

class solution_1 {
  constructor () {
    this.arr = [];
    this.hash = {};
  }
  insert (val) {
    if (val in this.hash) return false;
    this.arr.push(val);
    this.hash[val] = this.arr.length - 1;
    return true;
  }
  remove (val) {
    if (!(val in this.hash)) return false;
    const idx = this.hash[val];
    const last = this.arr[this.arr.length - 1];
    this.arr[idx] = last;
    this.hash[last] = idx;
    this.arr.pop();
    delete this.hash[val];
    return true;
  }
  getRandom () {
    return this.arr[Math.floor(Math.random() * this.arr.length)];
  }
}

class solution_2{constructor(){this.a=[];this.h={}}insert(v){let T=this;return v in T.h?!6:(T.a.push(v),T.h[v]=T.a.length-1,!0)}remove(v){let T=this;if(!(v in T.h))return !9;let[i,l]=[T.h[v],T.a[T.a.length-1]];T.a[i]=l;T.h[l]=i;T.a.pop();delete T.h[v];return !0}getRandom(){return this.a[Math.floor(Math.random()*this.a.length)]}}

const RandomizedSet = solution_2;

const specialTest = (commands, inputs, expected) => {
  const randomizedSet = new RandomizedSet();
  const ref = {                                   // this object holds references to the RandomizedSet methods...
    insert: randomizedSet.insert,
    remove: randomizedSet.remove,
    getRandom: randomizedSet.getRandom,
  };
  const [ARR, HASH] = Object.values(randomizedSet);
  const output = [];
  for (let i = 0; i < commands.length; i++) {
    output.push(
      commands[i] !== 'getRandom'
        ? ref[commands[i]].bind(randomizedSet)(...inputs[i])  // ...but each method still needs to be given `randomizedSet` as its `this` context
        : ARR.length > 1                                      // if command is `getRandom`, and the data structure currently has more than one value...
        ? (randomizedSet.getRandom() in HASH)                 // ...check whether `HASH` actually has the randomly generated value
        : ARR[0]                                              // ...else, return the one value
    );
  }
  const result = output.every((e, i) => e === expected[i]);
  if (!result) console.log('GOT:', output);
  return result;
};
// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = specialTest;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  commands: ['insert', 'remove', 'insert', 'getRandom', 'remove', 'insert', 'getRandom'],
  inputs: [
    [1],
    [2],
    [2],
    [],
    [1],
    [2],
    [],
  ],
  expected: [
    true,
    false,
    true,
    true,           // since the data structure has more than 1 item at this point, `specialTest` will push whether the random number is actually in the structure
    true,
    false,
    2,              // here, since the data structure will only have 1 item at this point, the result of calling .getRandom should always grab that number
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: