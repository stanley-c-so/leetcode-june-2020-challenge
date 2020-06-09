// --- Day 8: Power of Two ---

// Given an integer, write a function to determine if it is a power of two.

// Example 1:

// Input: 1
// Output: true 
// Explanation: 20 = 1

// Example 2:

// Input: 16
// Output: true
// Explanation: 24 = 16

// Example 3:

// Input: 218
// Output: false

// ----------

// keep dividing `n` by 2 until it is equal to or less than 1. then, check if it is equal to 1.
function solution_1 (n) {
  while (n > 1) n /= 2;
  return n === 1;
}

// check whether the binary representation of `n` is equal to '1' followed by only '0's
function solution_2 (n) {
  const binary = n.toString(2);
  return binary === '1' + '0'.repeat(binary.length - 1);
}

// this is leetcode's solution: "turn off the rightmost 1-bit". what happens when we take the binary representation of `n` and subtract 1? starting from the rightmost digit, as long as we are inside
// a string of 0s, these will all turn into 1s, and the first 1 will turn into 0. thus, when we take n & (n - 1), only digits to the left of that rightmost 1 will remain the same. the rightmost 1,
// and any digits below it, will all turn into 0. since a number that is a power of 2 is only a single 1 bit, then by applying this n & (n - 1) operation, it should result in 0. one edge case is 0
// itself (there are no 1 bits). another edge case is any negative numbers (no power of 2 ever results in a negative). we can tackle both of these by making sure that `n` is positive.
function solution_3 (n) {
  return n > 0 && ((n & (n - 1)) === 0);
}

// one-liner - basically the above
var solution_4=n=>n>0&&!(n&(n-1))

// thomas luo's one-liner - uses Math.log2, floors it, and checks if that is equal to 0
var solution_5=n=>Math.log2(n)%1==0

const isPowerOfTwo = solution_4;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = isPowerOfTwo;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  n: 1,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  n: 16,
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  n: 218,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 4
input = {
  n: 0,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  n: -2147483648,
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);