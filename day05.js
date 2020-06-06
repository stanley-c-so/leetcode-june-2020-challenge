// --- Day 5: Random Pick With Weight ---

// Given an array w of positive integers, where w[i] describes the weight of index i, write a function pickIndex which randomly picks an index in proportion to its weight.

// Note:

// 1 <= w.length <= 10000
// 1 <= w[i] <= 10 ^ 5
// pickIndex will be called at most 10000 times.

// Example 1:

// Input:
// ["Solution", "pickIndex"]
// [[[1]], []]
// Output: [null, 0]

// Example 2:

// Input:
// ["Solution", "pickIndex", "pickIndex", "pickIndex", "pickIndex", "pickIndex"]
// [[[1, 3]], [], [], [], [], []]
// Output: [null, 0, 1, 1, 1, 0]

// Explanation of Input Syntax:

// The input is two lists: the subroutines called and their arguments.Solution's constructor has one argument, the array w. pickIndex has no arguments. Arguments are always wrapped with a list, even if there aren't any.

// ----------

// as we iterate through `w` we track the cumulative total, and create a `memo` array to hold the number that is 1 less than the total up to that
// point. this is because when our weighted random algorithm needs to weight every index as a proportion of the cumulative weight. the random num
// that gets generated, then, will map to a corresponding index based on the information from memo: when the memo value at `i` is not less than
// the random num, then the random num "maps" to `i`.
class solution_1 {
  constructor (w) {
    this.memo = [];
    this.total = 0;
    for (const num of w) {
      this.total += num;
      this.memo.push(this.total - 1);
    }
  }
  pickIndex (seed) {
    const random = seed !== undefined ? seed : Math.floor(Math.random() * this.total);
    for (let i = 0; i < this.memo.length; ++i) {
      if (this.memo[i] >= random) return i;
    }
  }
}

// alex mok's one-liner - alex basically uses the same idea as above. he creates an array of cumulative totals and then uses the same `memo` i use 
class solution_2{constructor(w,t=this){t.s=0;t.a=w.map(e=>t.s+=e)}pickIndex(r=Math.random()*this.s,i=0){while(r>this.a[i])i++;return i}}

const Solution = solution_2;

const specialTest = (w, n) => {
  const total = w.reduce((total, curr) => curr + total);
  const randomSeed = [];
  for (let i = 0; i < n; ++i) {
    randomSeed.push(Math.floor(Math.random() * total));
  }
  const instance = new Solution(w);
  const bigMemo = [];
  for (let i = 0; i < w.length; ++i) {
    bigMemo.push(...Array(w[i]).fill(i));
  }
  return randomSeed.every(random => bigMemo[random] === instance.pickIndex(random));
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
  w: [1],
  n: 1,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  w: [1, 3],
  n: 5,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: