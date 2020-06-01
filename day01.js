// --- Day 1: Invert Binary Tree ---

// Invert a binary tree.

// Example:

// Input:

//      4
//    /   \
//   2     7
//  / \   / \
// 1   3 6   9

// Output:

//      4
//    /   \
//   7     2
//  / \   / \
// 9   6 3   1

// Trivia:
// This problem was inspired by this original tweet by Max Howell:

// Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so f*** off.

// ----------

function solution_1 (root) {
  if (root) {
    [root.left, root.right] = [root.right, root.left];
    arguments.callee(root.left);
    arguments.callee(root.right);
  }
  return root;
}

// one-liner - basically the above
var solution_2=(r,i=invertTree)=>r?([r.left,r.right]=[r.right,r.left],i(r.left),i(r.right),r):r

const invertTree = solution_2;

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
const func = invertTree;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  root: new BinaryTree(4)
    .insert(2, 7, true)               // first .insert must END with 'true' argument
    .insert(true, 1, 3, 6, 9),        // subsequent .inserts must START with 'false' argument, except the last .insert which must START with 'true' argument
};
expected = new BinaryTree(4)
  .insert(7, 2, true)
  .insert(true, 9, 6, 3, 1);
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  root: null,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: