// --- Day 30: Word Search II ---

// Given a 2D board and a list of words from the dictionary, find all words in the board.

// Each word must be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring.The same letter cell may not be used more than once in a word.

// Example:

// Input:
// board = [
//   ['o', 'a', 'a', 'n'],
//   ['e', 't', 'a', 'e'],
//   ['i', 'h', 'k', 'r'],
//   ['i', 'f', 'l', 'v']
// ]
// words = ["oath", "pea", "eat", "rain"]

// Output: ["eat", "oath"]

// Note:

// All inputs are consist of lowercase letters a - z.
// The values of words are distinct.

// ----------

// this backtracking solution uses a recursive DFS helper function that searches a clone of the board for a given word. the main function iterates through
// all words in the word list and searches the board for each one. the helper returns true/false for whether the given word can be found in the board. it
// searches a given set of coordinates for the `k`th letter of the given word. (thus, the helper gets kickstarted with `k` equal to 0.) if the letter at
// the given coordinates does not match the `k`th letter of the word, then return false. otherwise, if it matches: (1) we have a "base case true": if
// `k` is at its final position (i.e. it equals `word.length - 1`) we return true. (2) else, in the recursive case, we mark that letter as "visited" by
// changing it to, say, "*", and then we recurse in all 4 directions with the next value of `k`. (of course, at the top of the function, we handle out of
// bounds edge cases by making them return false.) we can simply say that if any of these recursive calls ultimately return true, then we will also return
// true at the current level (thus "propagating up" the true result). otherwise, if none of them return true, we have reached a dead end. we must return
// false - but NOT before we undo the marking of the current position as visited. we restore that character from '*' to the `k`th letter of the word.
function solution_1 (board, words) {

  // INITIALIZATIONS
  const h = board.length;
  if (!h) return [];                                                    // EDGE CASE: empty board
  const w = board[0].length;
  const output = [];

  // RECURSIVE DFS HELPER FUNCTION
  function helper (clone, word, row, col, k) {
    if (row < 0 || row === h || col < 0 || col === w) return false;     // EDGE CASE: out of bounds
    if (clone[row][col] !== word[k]) return false;                      // FALSE: letter mismatch
    if (k === word.length - 1) return true;                             // BASE CASE TRUE: word complete
    clone[row][col] = '*';                                              // RECURSIVE CASE: mark char as visited
    if (
      helper(clone, word, row + 1, col, k + 1) ||
      helper(clone, word, row - 1, col, k + 1) ||
      helper(clone, word, row, col + 1, k + 1) ||
      helper(clone, word, row, col - 1, k + 1)
    ) {
      return true;                                                      // propagate up the true result
    } else {
      clone[row][col] = word[k];                                        // DEAD END: restore char to unvisited
      return false;
    }
  }

  // MAIN FUNCTION: FOR EACH `word` OF `words`, CLONE THE `board` AND SEARCH IT WITH RECURSIVE HELPER FUNCTION
  for (const word of words) {
    const clone = Array(h).fill(0).map((_, i) => board[i].slice());
    let found = false;                                                // allows for early termination of searching this board once the word is found
    for (let row = 0; row < h; ++row) {
      if (found) break;                                               // breakpoint
      for (let col = 0; col < w; ++col) {
        if (found) break;                                             // breakpoint
        if (helper(clone, word, row, col, 0)) {
          output.push(word);
          found = true;                                               // stop searching this board for further instances of this word (prevents duplicates)
        }
      }
    }
  }

  return output;
}

const findWords = solution_1;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findWords;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  board: [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ],
  words: ['oath', 'pea', 'eat', 'rain'],
};
expected = ['eat', 'oath'];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: