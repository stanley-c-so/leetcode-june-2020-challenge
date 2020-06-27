// --- Day 27: Perfect Squares ---

// Given a positive integer n, find the least number of perfect square numbers (for example, 1, 4, 9, 16, ...) which sum to n.

// Example 1:

// Input: n = 12
// Output: 3 
// Explanation: 12 = 4 + 4 + 4.

// Example 2:

// Input: n = 13
// Output: 2
// Explanation: 13 = 4 + 9.

// ----------

function solution_1 (n) {

  // EDGE CASE: `n` IS A PERFECT SQUARE, SO RETURN 1
  const SQRT = Math.sqrt(n);
  if (SQRT % 1 === 0) return 1;

  // STEP 1: INITIALIZE `memo` AND CREATE AN ARRAY OF PERFECT SQUARES LESS THAN OR EQUAL TO `n`
  const memo = [null];                                  // dp memo: `memo[n]` is the number of squares you need to build up `n`. we will keep `null` at index 0, since we only need positives
  for (let i = 1; i < SQRT; ++i) {
    memo[i ** 2] = 1;                                   // save 1 into `memo` at `i` squared
  }

  // STEP 2: POPULATE THE REST OF `memo`
  for (let i = 2; i <= n; ++i) {
    if (memo[i]) continue;                              // skip perfect squares
    let lowest = Infinity;                              // this will be the lowest number of squares needed to build up the number
    for (let j = 1; i - j ** 2 > 0; ++j) {              // from `i`, attempt to subtract perfect squares to find a lower number. e.g. if `i` is 12: 12 = 11 + 1, or 8 + 4, or 3 + 9...
      lowest = Math.min(lowest, memo[i - j ** 2] + 1);  // ...so choose from the lowest of memo at the lower number, plus 1 - here, that would: `memo[11] + 1`, `memo[8] + 1`, or `memo[3] + 1`
    }
    memo[i] = lowest;
  }

  return memo[n];
}

// one-liner - basically the above. note that for step 2, instead of skipping when `i` is already in `memo`, we simply wrap the rest of the loop in a condition if `i` is NOT in `memo`
var solution_2=n=>{m=[1];for(i=1;i*i<=n;++i)m[i*i]=1;for(i=2;i<=n;++i)if(!m[i]){l=Infinity;for(j=1;i-j*j>0;++j)l=Math.min(l,m[i-j*j]+1);m[i]=l}return m[n]}

const numSquares = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = numSquares;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  n: 12,
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  n: 13,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: