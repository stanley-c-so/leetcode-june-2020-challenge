// --- Day 11: Sort Colors ---

// Given an array with n objects colored red, white or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white and blue.

// Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

// Note: You are not suppose to use the library's sort function for this problem.

// Example:

// Input: [2,0,2,1,1,0]
// Output: [0,0,1,1,2,2]

// Follow up:

// A rather straight forward solution is a two-pass algorithm using counting sort.
// First, iterate the array counting number of 0's, 1's, and 2's, then overwrite array with total number of 0's, then 1's and followed by 2's.
// Could you come up with a one-pass algorithm using only constant space?

// ----------

// this is the two-pass solution suggested in the problem: track the number of 0s, 1s, and 2s, and then rebuild the array
function solution_1 (nums) {
  let a = b = c = 0;
  for (const num of nums) {
    if (num === 0) ++a;
    if (num === 1) ++b;
    if (num === 2) ++c;
  }
  nums.length = 0;
  for (let i = 0; i < a; ++i) nums.push(0);
  for (let i = 0; i < b; ++i) nums.push(1);
  for (let i = 0; i < c; ++i) nums.push(2);
  
  // no need to return anything
}

// one-pass solution - use `left` and `right` pointers, and then an `i` pointer as you iterate from `left` to `right`. (we have optional optimizations where instead of starting `left` and
// `right` at the ends of the array, we move them inward to skip over 0s and 2s that already in the right place.) we iterate while `i <= right` (note that `left` will never overtake `i`)
// and we look at the num at `i`: if 0, then we swap the nums at `i` and `left` if they are different; else we simply increment `i`. in either case, we increment `left` since a 0 is now
// properly sorted. if 2, then it is even simpler: we swap the nums at `i` and `right`, and we decrement `right`, since a 2 is now properly sorted. and finally, if 1, then we simply
// increment `i`, since we don't need to sort it (for now - it may be swapped in the future).
function solution_2 (nums) {
  let left = 0;
  // OPTIONAL OPTIMIZATIONS FOR `left`
  while (left < nums.length && nums[left] === 0) ++left;      // INITIALIZE `left` at the first non-0 (from the left)
  if (left === nums.length) return;                           // EDGE CASE: all nums are 0

  let right = nums.length - 1;
  // OPTIONAL OPTIMIZATIONS FOR `right`
  while (right >= 0 && nums[right] === 2) --right;            // INITIALIZE `right` at the first non-2 (from the right)
  if (right < 0) return;                                      // EDGE CASE: all nums are 2

  // RUN `i` FROM `left` TO `right`. ONLY INCREMENT `i` WHEN ITS VALUE IS 1, OR `i === left` AND ITS VALUE IS 0
  let i = left;                                               // note that `i` will always be equal to or ahead of `left`
  while (i <= right) {
    if (nums[i] === 0) {                                      // if current num is 0, then swap with `left`...
      if (i === left) ++i;                                      // if `i` is currently in line with `left`, increment `i` (no swap needed)
      else [nums[i], nums[left]] = [nums[left], nums[i]];       // else, swap (since `i` and `left` are different)
      ++left;                                                   // always increment `left` in this block
    } else if (nums[i] === 2) {                               // else if current num is 2, then swap with `right`...
      [nums[i], nums[right]] = [nums[right], nums[i]];
      --right;                                                  // always decrement `right` in this block
    } else {                                                  // else current num is 1, so just increment `i`
      ++i;
    }
  }
}

// one-liner - basically the above
var solution_3=(n,l=i=0,r=n.length-1)=>{while(i<=r){if(!n[i]){i==l?++i:[n[i],n[l]]=[n[l],n[i]];++l}else if(n[i]==2){[n[i],n[r]]=[n[r],n[i]];--r}else ++i}}

// one-liner - the two-pass solution above (switching around `a`, `b`, and `c` in the first for loop to save characters)
var solution_4=(N,a=b=c=0,r='repeat')=>(N.map(n=>n?n-1?++c:++b:++a),N.length=0,N.push(...('0'[r](a)+'1'[r](b)+'2'[r](c)).split('').map(e=>+e)))

// thomas luo's one-liner (includes trolly URL) - keep a hash table count of 0s and 1s. count up 0s and 1s, and then overwrite the data as long as the counts from the hash table have not been exhausted
var solution_5=n=>(h={0:0,1:0},'rb.gy/anfcea')|n.map(e=>h[e]++)|n.map((e,i)=>n[i]=0<h[0]--?0:0<h[1]--?1:2)

// alex mok's one-liner - use `c` as an array of counts of 0, 1, and 2. `j` is initialized as 0. count up the 0s, 1s, and 2s, and then overwrite `n` using your array of counts (write each `i`, `e` times)
var solution_6=n=>{c=[j=0,0,0];n.map(e=>c[e]++);c.map((e,i)=>{while(e--)n[j++]=i})}

const sortColors = solution_6;

const specialTest = (nums, sorted) => {
  sortColors(nums);
  const equals = require('./_equality-checker');
  const result = equals(nums, sorted);
  if (!result) console.log('GOT:', nums);
  return result;
};

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = specialTest;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: [2, 0, 2, 1, 1, 0],
  sorted: [0, 0, 1, 1, 2, 2],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 2
input = {
  nums: [1, 2, 0],
  sorted: [0, 1, 2],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);