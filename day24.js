// --- Day 24: Unique Binary Search Trees ---

// Given n, how many structurally unique BST's (binary search trees) that store values 1 ... n?

// Example:

// Input: 3
// Output: 5
// Explanation:
// Given n = 3, there are a total of 5 unique BST's:

//    1         3     3      2      1
//     \       /     /      / \      \
//      3     2     1      1   3      2
//     /     /       \                 \
//    2     1         2                 3

// ----------

// imagine laying out the numbers from 1 to `n` in sorted order, in a line. there are `n` ways to choose a number as a root. once a root has been selected at, say, position `i` (0-index), there are
// now `i` numbers to the left of the root, and `n - 1 - i` numbers to the right. the structure of one side has no effect on the other, and we can figure out how many unique substructures there are
// on any given side simply by recursing our function. this is where memoization comes in to help avoid repeated work. the `memo` will start as `[1, 1]` (or it can just as easily start with just `[1]`)
// to represent the base case that for n = 0 (or n = 1), there is only 1 solution. from there, we run a for loop for `i` from 0 to `n - 1` representing the root selection. we recurse on both sides
// of the root, multiply together (as they are independent), and add to a running total.
function solution_1 (n, memo) {
  if (!memo) memo = [1, 1];                           // arguments.callee does not play nice with default parameters
  if (n in memo) return memo[n];
  let total = 0;
  for (let i = 0; i < n; ++i) {
    const left = arguments.callee(i, memo);
    const right = arguments.callee(n - 1 - i, memo);
    total += left * right;
  }
  return memo[n] = total;
}

// one-liner - basically the above, but with a recursive helper function. note that `[...Array(n).keys()]` produces an array containing `n` numbers, from 0 to `n - 1`
var solution_2=(n,m=[1],h=n=>m[n]?m[n]:m[n]=[...Array(n).keys()].reduce((t,i)=>t+=h(i,m)*h(n-1-i,m),0))=>h(n)

// alex mok's one-liner - similar idea, but using well crafted for loops to do this iteratively
var solution_3=n=>{m=[1,1];for(i=2;i<=n;i++){m[i]=0;for(j=1;j<=i;)m[i]+=m[j-1]*m[i-j++]}return m[n]}

// my improvement on alex mok's one-liner - starting the memo at `[1]` instead of `[1,1]` (and starting the for loop at `i=1`) to save characters
var solution_4=n=>{m=[1];for(i=1;i<=n;i++){m[i]=0;for(j=1;j<=i;)m[i]+=m[j-1]*m[i-j++]}return m[n]}

const numTrees = solution_4;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = numTrees;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  n: 3,
};
expected = 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 2
input = {
  n: 19,
};
expected = 1767263190;
test(func, input, expected, testNum, lowestTest, highestTest);