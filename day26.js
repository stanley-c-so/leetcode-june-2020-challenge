// --- Day 26: Sum Root to Leaf Numbers ---

// Given a binary tree containing digits from 0-9 only, each root-to-leaf path could represent a number.

// An example is the root-to-leaf path 1->2->3 which represents the number 123.

// Find the total sum of all root-to-leaf numbers.

// Note: A leaf is a node with no children.

// Example:

// Input: [1,2,3]
//     1
//    / \
//   2   3
// Output: 25
// Explanation:
// The root-to-leaf path 1->2 represents the number 12.
// The root-to-leaf path 1->3 represents the number 13.
// Therefore, sum = 12 + 13 = 25.

// Example 2:

// Input: [4,9,0,5,1]
//     4
//    / \
//   9   0
//  / \
// 5   1
// Output: 1026
// Explanation:
// The root-to-leaf path 4->9->5 represents the number 495.
// The root-to-leaf path 4->9->1 represents the number 491.
// The root-to-leaf path 4->0 represents the number 40.
// Therefore, sum = 495 + 491 + 40 = 1026.

// ----------

// we do a DFS through the tree using a simple helper function with a `prefix` parameter to aggregate the string of all digits encountered up to that particular root. when a leaf is found, we
// convert the string to a number and add it to a running total.
function solution_1 (root) {
  if (!root) return 0;                                        // EDGE CASE: empty input (see note about helper beloe)
  let total = 0;
  function helper (root, prefix = '') {
    if (!root.left && !root.right) {                          // we want the base case to be when the current valid node has no children - NOT when input node is null, since there could be...
      total += Number(prefix + root.val);                     // ...a node with only one child, and thus that node is NOT a leaf and we should NOT be adding the number up to that point to the total
    } else {
      if (root.left) helper(root.left, prefix + root.val);    // either one or both of these recursive calls will run
      if (root.right) helper(root.right, prefix + root.val);
    }
  }
  helper(root);                                               // kick start the DFS traversal
  return total;
}

// one-liner - basically the above. note that `r&&h(r)|t` will kickstart helper only if initial `r` exists; otherwise, it will shortcircuit to `t` which coincidentally is initialized at 0
var solution_2=(r,t=0,h=(r,p='',L=r.left,R=r.right,x=p+r.val)=>L||R?(L?h(L,x):0,R?h(R,x):0):t+=+x)=>r&&h(r)|t

// thomas luo's one-liner - here, the recursive helper function, `f`, actually returns the total. in all cases, prefix, `d`, tacks on current root value, and only if leaf node, it returns `+d`
var solution_3=(r,f=(r,d='')=>r?(d+=r.val)&&!r.left&!r.right?+d:f(r.left,d)+f(r.right,d):0)=>f(r)

const sumNumbers = solution_3;

// const specialTest = (...args) => {
// };

// NOTE: I developed the following BinaryTree and Batch classes for easy creation of binary trees with arbitrary values.

class BinaryTree {
  constructor (val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
  insert (left, right, firstInsert = false) {
    if (left !== null) this.left = new BinaryTree(left);
    if (right !== null) this.right = new BinaryTree(right);
    return firstInsert ? new Batch(this, [this.left, this.right]) : [this.left, this.right];
  }
}

class Batch {
  constructor (root, nodes) {
    this.root = root;
    this.batch = nodes;
  }
  insert (lastInsert, ...values) {
    const nextBatch = [];
    for (let i = 0; i < this.batch.length; i++) {
      if (this.batch[i] !== null) {
        nextBatch.push(...(this.batch[i].insert(
          values[2 * i] === undefined ? null : values[2 * i],
          values[2 * i + 1] === undefined ? null : values[2 * i + 1],
        )));
      } else {
        nextBatch.push(null, null);
      }
    }
    return lastInsert ? this.root : new Batch (this.root, nextBatch);
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = sumNumbers;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  nums: new BinaryTree(1)
    .insert(2, 3, true)
    .insert(true),
};
expected = 25;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: new BinaryTree(4)
    .insert(9, 0, true)
    .insert(true, 5, 1, null, null),
};
expected = 1026;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: