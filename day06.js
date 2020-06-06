// --- Day 6: Queue Reconstruction by Height ---

// Suppose you have a random list of people standing in a queue.Each person is described by a pair of integers(h, k), where h is the height of the person and k is the number of people in front of this person who have a height greater than or equal to h.Write an algorithm to reconstruct the queue.

// Note:
// The number of people is less than 1, 100.


// Example

// Input:
// [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]

// Output:
// [[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]

// ----------

// anyone shorter than a person is "invisible" to that person. therefore, if we first insert the tallest people into the index positions given
// by their `k` values (because they can see each other), they will be in the correct order relative to each other, and future inserts of shorter
// people will not disturb the validity of these taller people (as the shorter people are invisible). NOTE: we do need to sort people of the same
// height by `k` values in ascending order, to allow them to see each other. after performing the initial sort, we just need to splice each person
// into the output, at the position given by `k`. this will always be valid, because `k` represents the number of people (same or taller height) in
// front of the person - based on our algorithm, all of these people have already been previously inserted, so the `k` index is a valid insertion
// point.
function solution_1 (people) {
  people.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);   // sort in descending height (taller people first), but ascending `k`
  const output = [];
  for (const [h, k] of people) {
    output.splice(k, 0, [h, k]);
  }
  return output;
}

// alex mok's one-liner
var solution_2=(p,r=[])=>p.sort(([a,A],[b,B])=>a==b?A-B:b-a).map(e=>r.splice(e[1],0,e))&&r

const reconstructQueue = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = reconstructQueue;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  people: [ [7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2] ],
};
expected = [ [5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1] ];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  people: [ [9, 0], [7, 0], [1, 9], [3, 0], [2, 7], [5, 3], [6, 0], [3, 4], [6, 2], [5, 2] ],
};
expected = [ [3, 0], [6, 0], [7, 0], [5, 2], [3, 4], [5, 3], [6, 2], [2, 7], [9, 0], [1, 9] ];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: