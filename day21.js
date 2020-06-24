// --- Day 21: Dungeon Game ---

// The demons had captured the princess (P) and imprisoned her in the bottom-right corner of a dungeon. The dungeon consists of M x N rooms laid out in a 2D grid. Our valiant knight (K) was initially positioned in the top-left room and must fight his way through the dungeon to rescue the princess.

// The knight has an initial health point represented by a positive integer. If at any point his health point drops to 0 or below, he dies immediately.

// Some of the rooms are guarded by demons, so the knight loses health (negative integers) upon entering these rooms; other rooms are either empty (0's) or contain magic orbs that increase the knight's health (positive integers).

// In order to reach the princess as quickly as possible, the knight decides to move only rightward or downward in each step.

 

// Write a function to determine the knight's minimum initial health so that he is able to rescue the princess.

// For example, given the dungeon below, the initial health of the knight must be at least 7 if he follows the optimal path RIGHT-> RIGHT -> DOWN -> DOWN.

// -2(K)  -3    3
//
// -5     -10   1
//
// 10	    30	  -5 (P)
 

// Note:

// The knight's health has no upper bound.
// Any room can contain threats or power-ups, even the first room the knight enters and the bottom-right room where the princess is imprisoned.

// ----------

// WORK IN PROGRESS - DOESN'T WORK
function solution_1 (dungeon) {
  // if (!dungeon.length) return 1;
  // if (dungeon.length === 1) {
  //   let min = Infinity;
  //   let total = 0;
  //   for (const num of dungeon[0]) {
  //     total += num;
  //     min = Math.min(min, total);
  //   }
  //   return min < 0 ? Math.abs(min) + 1 : 1;
  // }
  // if (dungeon[0].length === 1) {
  //   let min = Infinity;
  //   let total = 0;
  //   for (const row of dungeon) {
  //     total += row[0];
  //     min = Math.min(min, total);
  //   }
  //   return min < 0 ? Math.abs(min) + 1 : 1;
  // }
  const h = dungeon.length;
  const w = dungeon[0].length;
  const dp = Array.from({length: h}, () => Array.from({length: w}, () => null));
  let HP = 0;
  for (let i = 0; i < w; ++i) {
    const [curr, min] = i ? dp[0][i - 1] : [HP, Infinity];
    HP = curr + dungeon[0][i];
    dp[0][i] = [HP, Math.min(min, HP)];
  }
  HP = dungeon[0];
  for (let i = 1; i < h; ++i) {
    const [curr, min] = dp[i - 1][0];
    HP = curr + dungeon[i][0];
    dp[i][0] = [HP, Math.min(min, HP)];
  }
  for (let row = 1; row < h; ++row) {
    for (let col = 1; col < w; ++col) {
      const [aboveHP, aboveMin] = dp[row - 1][col];
      const [leftHP, leftMin] = dp[row][col - 1];
      const curr = dungeon[row][col];
      const comeFromAbove = [aboveHP + curr, Math.min(aboveMin, aboveHP + curr)];
      const comeFromLeft = [leftHP + curr, Math.min(leftMin, leftHP + curr)];
      if (comeFromAbove[1] > comeFromLeft[1]) {
        dp[row][col] = comeFromAbove;
      } else if (comeFromAbove[1] < comeFromLeft[1]) {
        dp[row][col] = comeFromLeft;
      } else {
        dp[row][col] = comeFromAbove[0] > comeFromLeft[0] ? comeFromAbove : comeFromLeft;  
      }
    }
  }
  console.log(dp)
  const min = dp[h - 1][w - 1][1];
  return min < 0 ? Math.abs(min) + 1 : 1;
}

// alex mok's solution
function solution_2 (dungeon) {
  const rows = dungeon.length;
  const cols = dungeon[0].length;
  const dp = [];
  for (let i = 0; i <= rows + 1; i++) {
    dp[i] = new Array(cols + 1).fill(Infinity);
  }
  dp[rows-1][cols] = 1;
  dp[rows][cols-1] = 1;
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 0; c--) {
      dp[r][c] = Math.max(1, Math.min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c]);
    }
  }
  return dp[0][0];
}

const calculateMinimumHP = solution_1;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = calculateMinimumHP;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  dungeon: [
    [-2,-3,3],
    [-5,-10,1],
    [10,30,-5]
  ],
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 2
input = {
  dungeon: [
    [1,-3,3],
    [0,-2,0],
    [-3,-3,-3]
  ],
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);