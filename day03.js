// --- Day 3: Two City Scheduling ---

// There are 2N people a company is planning to interview. The cost of flying the i-th person to city A is costs[i][0], and the cost of flying the i-th person to city B is costs[i][1].

// Return the minimum cost to fly every person to a city such that exactly N people arrive in each city.

// Example 1:

// Input: [[10,20],[30,200],[400,50],[30,20]]
// Output: 110
// Explanation: 
// The first person goes to city A for a cost of 10.
// The second person goes to city A for a cost of 30.
// The third person goes to city B for a cost of 50.
// The fourth person goes to city B for a cost of 20.

// The total minimum cost is 10 + 30 + 50 + 20 = 110 to have half the people interviewing in each city.
 
// Note:

// 1 <= costs.length <= 100
// It is guaranteed that costs.length is even.
// 1 <= costs[i][0], costs[i][1] <= 1000

// ----------

// the difference between the cost of going to city B vs city A could be said to be the marginal cost of going to city B. if we sort by this marginal cost for each person, it would make sense to
// send that half of our people with the lower marginal cost to city B, and the other half to city A.
function solution_1 (costs) {
  costs.sort((a, b) => (a[1] - a[0]) - (b[1] - b[0]));    // sort by marginal cost of going to city B (low to high)
  let total = 0;
  for (let i = 0; i < costs.length; ++i) {
    if (i < costs.length / 2) {
      total += costs[i][1];                               // those people with lower marginal cost of going to city B should go to city B
    } else {
      total += costs[i][0];                               // the other half should go to city A
    }
  }
  return total;
}

// one-liner - basically the above
var solution_2=c=>c.sort(([a,b],[x,y])=>b-a-y+x).reduce((t,p,i)=>t+p[+(i<c.length/2)],0)

const twoCitySchedCost = solution_2;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = twoCitySchedCost;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  costs: [ [10,20], [30,200], [400,50], [30,20] ],
};
expected = 110;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: