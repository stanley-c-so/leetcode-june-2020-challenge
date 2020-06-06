// --- Day 4: Reverse String ---

// Write a function that reverses a string. The input string is given as an array of characters char[].

// Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.

// You may assume all the characters consist of printable ascii characters.

// Example 1:

// Input: ["h","e","l","l","o"]
// Output: ["o","l","l","e","h"]

// Example 2:

// Input: ["H","a","n","n","a","h"]
// Output: ["h","a","n","n","a","H"]

// ----------

// is this problem a joke?
function solution_1 (s) {
  return s.reverse();
}

// one-liner
var solution_2=s=>s.reverse()

// joke solution - times out, obviously :)
var solution_3=(s,x=[...s].reverse().join(''),S=a=>{for(i=a.length-1;i>0;--i){r=Math.floor(Math.random()*(i+1));[a[r],a[i]]=[a[i],a[r]]}return a})=>{while(s.join('')!=x)S(s);return s}

const reverseString = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = reverseString;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s: ['h', 'e', 'l', 'l', 'o'],
};
expected = ['o', 'l', 'l', 'e', 'h'];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s: ['H', 'a', 'n', 'n', 'a', 'h'],
};
expected = ['h', 'a', 'n', 'n', 'a', 'H'];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: