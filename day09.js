// --- Day 9: Is Subsequence ---

// Given a string s and a string t, check if s is subsequence of t.

// A subsequence of a string is a new string which is formed from the original string by deleting some(can be none) of the characters without disturbing the relative positions of the remaining characters. (ie, "ace" is a subsequence of "abcde" while "aec" is not).

// Follow up:
// If there are lots of incoming S, say S1, S2, ... , Sk where k >= 1B, and you want to check one by one to see if T has its subsequence.In this scenario, how would you change your code ?

//   Credits :
//   Special thanks to @pbrother for adding this problem and creating all test cases.

// Example 1:

// Input: s = "abc", t = "ahbgdc"
// Output: true

// Example 2:

// Input: s = "axc", t = "ahbgdc"
// Output: false


// Constraints:

// 0 <= s.length <= 100
// 0 <= t.length <= 10 ^ 4
// Both strings consists only of lowercase characters.

// ----------

// for each letter of `s`, greedily run through `t` until you find that letter. then move on to the next letter of `s` and keep running forward.
// you never have to move backward in `t`.
function solution_1 (s, t) {
  if (s.length > t.length) return false;          // EDGE CASE: `t` is longer than `s` - then false
  if (s.length === t.length) return s === t;      // EDGE CASE: input strings match - then check for equality
  let pointerS = 0;
  let pointerT = 0;
  while (pointerS < s.length) {                   // iterate through `s`
    if (pointerT === t.length) return false;      // check if `pointerT` is out of bounds (final letter of `t` may match `s` before `s` is done)
    while (t[pointerT] !== s[pointerS]) {         // while letter at `pointerT` does not match letter at `pointerS`...
      ++pointerT;                                 // ...increment `pointerT`
      if (pointerT === t.length) return false;    // (if out of bounds, return false)
    }
    ++pointerT;                                   // when a match is found, increment both pointers
    ++pointerS;                                   // (loop will repeat if `s` is not done)
  }
  return true;                                    // if we get through `s`, return true
}

// thomas luo's one-liner - uses a recursive function `p` that takes in two pointer positions (`a` and `b`) for `s` and `t`. base cases are FALSE
// if `s` runs out, and TRUE if `t` runs out. otherwise, we recurse, and we increment `a` only if the current letters match, and we always increment
// `b`. with that helper recursive function defined, we kick start the process by finding the OPPOSITE of `p(0,0)`. (why is this flipped? so that
// the solution actually returns a boolean instead of 0 or 1, which node would need to succeed, even though leetcode accepts 0 or 1.)
var solution_2=(s,t,p=(a,b)=>a-s.length?b-t.length?p(a+(s[a]==t[b]),b+1):1:0)=>!p(0,0)

const isSubsequence = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = isSubsequence;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  s: 'abc',
  t: 'ahbgdc',
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  s: 'axc',
  t: 'ahbgdc',
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  s: 'abc',
  t: '',
};
expected = false;
test(func, input, expected, testNum, lowestTest, highestTest);