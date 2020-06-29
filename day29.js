// --- Day 29: Unique Paths ---

// A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).

// The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

// How many possible unique paths are there?

// Above is a 7 x 3 grid. How many possible unique paths are there?

// Example 1:

// Input: m = 3, n = 2
// Output: 3
// Explanation:
// From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
// 1. Right -> Right -> Down
// 2. Right -> Down -> Right
// 3. Down -> Right -> Right

// Example 2:

// Input: m = 7, n = 3
// Output: 28

// ----------

// we will use combinatorics to solve this problem. if the dimensions are `m` wide x `n` high, then the robot needs to make `m - 1` moves to the right and `n - 1` moves down, in some order. the
// answer, then, will be (m - 1 + n - 1)! / (m - 1)! / (n - 1)!. the problem with writing this solution directly is that with large inputs, the factorials are too high. thus we can do a bit of
// simplification: depending on whether `m` or `n` is bigger, we can simplify the numerator and denominator - let's pretend `m` is bigger. then (m + n - 2)! / (m - 1)! / (n - 1)! becomes
// (product of all numbers from `m` to `m + n - 2`) / (n - 1)!
function solution_1 (m, n) {

  // ASSIGN big AND small BASED ON RELATIVE VALUES OF m AND n
  const [big, small] = m >= n ? [m, n] : [n, m];
      
  // TOP = (big + small - 2)! / (big - 1)! = product of all numbers from big to (big + small - 2)
  let top = 1;
  for (let i = big; i <= big + small - 2; i++) top *= i;

  // BOTTOM = (small - 1)!
  let bottom = 1;
  for (let i = 1; i < small; i++) bottom *= i;

  return top / bottom;
}

// one-liner - basically the above
var solution_2=(m,n,t=b=1)=>{[B,S]=m>n?[m,n]:[n,m];for(i=B;i<=B+S-2;++i)t*=i;for(i=1;i<S;++i)b*=i;return t/b}

// thomas luo's one-liner - he fills an array of length `m` with 0 (and then reassigns first element to 1) and then he does the following `n` times: every element in the array (except the first)
// increases by whatever the previous number is. thus if `m` and `n` are both 5, the array goes from [1,0,0,0,0] -> [1,2,3,4,5] -> [1,3,6,10,15] -> [1,4,10,20,35] -> [1,5,15,35,70] and ultimately
// the final number, 70, is the answer. why does this work? because he's emulating a 2d memo solution. in the grid, there is only 1 way to get to the top left square. for any other position
// (other than top or left edge), the answer becomes the sum of the number above and to the left (because you get to that position either from above or from the left). what this algorithm is doing,
// then, is to emulate the filling out of that grid but with only one array: the number already existing in a position stands in for the number "above", and the previous number is the number from
// the left. by overwriting the array `n` times it is like filling out the `n` rows of the grid.
var solution_3=(m,n,z=Array(m).fill(0),l='rb.gy/4iyrdu')=>{z[0]=1;while(n--)z.map((_,j)=>z[j]+=j&&z[j-1]);return z[m-1]}

const uniquePaths = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = uniquePaths;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  m: 3,
  n: 2,
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  m: 7,
  n: 3,
};
expected = 28;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: