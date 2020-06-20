// --- Day 20: Permutation Sequence ---

// The set [1,2,3,...,n] contains a total of n! unique permutations.

// By listing and labeling all of the permutations in order, we get the following sequence for n = 3:

// "123"
// "132"
// "213"
// "231"
// "312"
// "321"
// Given n and k, return the kth permutation sequence.

// Note:

// Given n will be between 1 and 9 inclusive.
// Given k will be between 1 and n! inclusive.
// Example 1:

// Input: n = 3, k = 3
// Output: "213"
// Example 2:

// Input: n = 4, k = 9
// Output: "2314"

// ----------

// brute force: we use a helper function which takes in `n` and produces an array of all possible string permutations for digits 1 through `n`. then, we simply sort the output, and grab the kth element.
function solution_1 (n, k) {
  function helper (n) {
    if (n === 1) return ['1'];
    const prevSolution = helper(n - 1);
    const output = [];
    for (const str of prevSolution) {
      for (let i = 0; i < n; ++i) {
        output.push(str.slice(0, i) + n + str.slice(i));    // insert new digit into every possible position of `str`
      }
    }
    return output;
  }
  return helper(n).sort()[k - 1];
}

// one-liner - basically the above, but note the weird trick when using .map to replace for loops: `[...s,8].map((_,i)=>...)` is our way of copying the for loop with the correct `i` values
var solution_2=(n,k,h=n=>n-1?(p=h(n-1),o=[],p.map(s=>[...s,8].map((_,i)=>o.push(s.slice(0,i)+n+s.slice(i)))),o):['1'])=>h(n).sort()[k-1]

const getPermutation = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = getPermutation;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  n: 3,
  k: 3,
};
expected = '213';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  n: 4,
  k: 9,
};
expected = '2314';
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  n: 9,
  k: 214267,
};
expected = '635749128';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  n: 9,
  k: 25996,
};
expected = '173284695';
test(func, input, expected, testNum, lowestTest, highestTest);