// --- Day 7: Coin Change 2 ---

// You are given coins of different denominations and a total amount of money.Write a function to compute the number of combinations that make up that amount.You may assume that you have infinite number of each kind of coin.

// Example 1:

// Input: amount = 5, coins = [1, 2, 5]
// Output: 4
// Explanation: there are four ways to make up the amount:
// 5 = 5
// 5 = 2 + 2 + 1
// 5 = 2 + 1 + 1 + 1
// 5 = 1 + 1 + 1 + 1 + 1

// Example 2:

// Input: amount = 3, coins = [2]
// Output: 0
// Explanation: the amount of 3 cannot be made up just with coins of 2.

// Example 3:

// Input: amount = 10, coins = [10]
// Output: 1

// Note:

// You can assume that

// 0 <= amount <= 5000
// 1 <= coin <= 5000
// the number of coins is less than 500
// the answer is guaranteed to fit into signed 32 - bit integer

// ----------

// how would you solve the companion question, https://leetcode.com/problems/coin-change/ ?
// - instead of column 0 always mapping to 1, map it to 0.
// - instead of totals that you can't compose mapping to 0, map them to -Infinity.
// - instead of finding the sum of value at the current column from the previous row, plus the value in the current row looking back by coin amount,
//   look at the MIN of the value at the current column from the previous row, and 1 + the value in the current row looking back by coin amount

// set up a DP grid. columns go from 0 to `amount`. every row represents another coin denomination (the order in which we analyze them doesn't
// matter). each row should start with the value 1 at column 0 (because there is 1 way to have amount 0). for the first row, the value should be
// 1 if the column is divisible by the coin amount, or 0 otherwise (because you only have the one coin, so there is 1 way to compose totals that
// are multiples of that coin, or 0 otherwise). for all subsequent rows, add together: (1) the number in the previous row at the same column, and
// (2) the number in the current row, if you look back N spaces, where N is the coin denomination. why? because the number of ways given the new
// coin is the number of ways without using the coin + the number of ways using the coin. and if you use the coin, that's equal to the number of
// ways to make up current total - coin amount.
function solution_1 (amount, coins) {
  if (!coins.length) return +!amount;                 // EDGE CASE: no coins. if amount is 0, return 1, else, 0
  const dp = [];
  for (const coin of coins) {
    const row = [1];
    for (let col = 1; col <= amount; ++col) {
      row.push(
        (dp.length ? dp[dp.length - 1][col] : 0) +
        (col >= coin ? row[col - coin] : 0)
      );
    }
    dp.push(row);
  }
  return dp[dp.length - 1][amount];
}

// one-liner - basically the above
var solution_2=(a,C,d=[],l='length')=>C[0]?C.map(c=>{r=[1];for(n=1;n<=a;++n){r.push((d[l]?d[d[l]-1][n]:0)+(n>=c?r[n-c]:0))}d.push(r)})&&d[d[l]-1][a]:+!a

// thomas luo's one-liner - instead of using an entire grid, he just uses one row. this way, he can just add the current val to the "look back" val
var solution_3=(a,c,d=Array(a+1).fill(0))=>(d[0]=1)|c.map(z=>{for(i=z;i<=a;d[i]+=d[i++-z]);})&&d[a]

const change = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = change;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  amount: 5,
  coins: [1, 2, 5],
};
expected = 4;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  amount: 3,
  coins: [2],
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  amount: 10,
  coins: [10],
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 4
input = {
  amount: 0,
  coins: [],
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  amount: 7,
  coins: [],
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);