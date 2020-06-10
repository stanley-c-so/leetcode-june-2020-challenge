// --- Day 10: Search Insert Position ---

// Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

// You may assume no duplicates in the array.

// Example 1:

// Input: [1,3,5,6], 5
// Output: 2

// Example 2:

// Input: [1,3,5,6], 2
// Output: 1

// Example 3:

// Input: [1,3,5,6], 7
// Output: 4

// Example 4:

// Input: [1,3,5,6], 0
// Output: 0

// ----------

// this is similar to regular binary search. however, in regular binary search, it is possible for the "window" of possible values to close (when left > right) and so you need to have a `return -1`
// outside of the while loop. here, however, if the target number cannot be found in the array, we can detect it by observing that `target < nums[left]` or `target > nums[right]`. this might happen
// when, on the previous iteration, `target` was either higher or lower than the middle number, and when `left` or `right` was adjusted, `target` is no longer in range, because it should have belonged
// between the previous middle number and the new end number. thus we can check for this at the top of the while loop, and we can make our condition `while (true)` since we are guaranteed to hit one
// of the return statements eventually (either the number gets found and we `return middle`, or the number is out of range and we `return left` or `return right + 1`).
function solution_1 (nums, target) {
  if (!nums.length) return 0;                               // UNNECESSARY EDGE CASE HANDLING: no test cases have empty `nums`
  let left = 0;
  let right = nums.length - 1;
  while (true) {                                            // we can do `while (true)` because we are guaranteed to hit one of the return statements in here
    if (target < nums[left]) return left;                   // if `target` is out of range of left number, return `left` (if `target` would normally go b/w previous `middle` and current `left`)
    if (target > nums[right]) return right + 1;             // if `target` is out of range of right number, return `right + 1` (if `target` would normally go b/w previous `middle` and current `right`)
    const middle = Math.floor((right - left) / 2) + left;
    if (target < nums[middle]) right = middle - 1;          // if middle number is too big, adjust `right`
    else if (target > nums[middle]) left = middle + 1;      // if middle number is too small, adjust `left`
    else return middle;                                     // if middle number is target, return `middle` (if `target` is in our array, this statement will eventually be reached)
  }
}

var solution_2=(n,t,l=0,r=n.length-1,R=-1)=>{while(R<0){m=((r+l)/2)|0;if(t<n[l])R=l;else if(t>n[r])R=r+1;else if(t<n[m])r=m-1;else if(t>n[m])l=m+1;else R=m}return R}

// thomas luo's non-binary search one-liner
var solution_3=(n,t,z=0)=>n.map(e=>z+=e<t)|z

const searchInsert = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = searchInsert;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: [1, 3, 5, 6],
  target: 5,
};
expected = 2;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: [1, 3, 5, 6],
  target: 2,
};
expected = 1;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  nums: [1, 3, 5, 6],
  target: 7,
};
expected = 4;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  nums: [1, 3, 5, 6],
  target: 0,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 5
input = {
  nums: [1, 3],
  target: 0,
};
expected = 0;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  nums: [3, 5, 7, 9, 10],
  target: 8,
};
expected = 3;
test(func, input, expected, testNum, lowestTest, highestTest);