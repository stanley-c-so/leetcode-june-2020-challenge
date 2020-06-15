// --- Day 15: Search in a Binary Search Tree ---

// Given the root node of a binary search tree (BST) and a value. You need to find the node in the BST that the node's value equals the given value. Return the subtree rooted with that node. If such node doesn't exist, you should return NULL.

// For example, 

// Given the tree:
//         4
//        / \
//       2   7
//      / \
//     1   3

// And the value to search: 2
// You should return this subtree:

//       2     
//      / \   
//     1   3
// In the example above, if we want to search the value 5, since there is no node with value 5, we should return NULL.

// Note that an empty tree is represented by NULL, therefore you would see the expected output (serialized tree format) as [], not null.

// ----------

// very straightforward recursive solution
function solution_1 (root, val) {
  if (!root || root.val === val) return root;                     // also nicely handles base case of null root!
  if (root.val > val) return arguments.callee(root.left, val);    // recurse left
  else return arguments.callee(root.right, val);                  // recurse right
}

// one-liner - basically the above (for leetcode, obviously replace `solution_2` with the name of the function)
var solution_2=(r,v,R=solution_2)=>r&&r.val!=v?r.val>v?R(r.left,v):R(r.right,v):r

// thomas luo's one-liner - he defines a recursive helper function. note, however, that it does recurse on both left and right (i.e. it is not true binary search)
var solution_3=(r,v,z=r=>r?r.val-v?z(r.right)||z(r.left):r:null)=>z(r)

// alex mok's O(log n) one-liner - recursive helper function
var solution_4=(r,v,z=r=>!r||r.val==v?r:r.val<v?z(r.right):z(r.left))=>z(r)

// alex mok's O(n) one-liner
var solution_5=(r,v,z=r=>!r||r.val==v?r:z(r.right)||z(r.left))=>z(r)

// my improvement on alex's O(n) one-liner (shaving a character)
var solution_6=(r,v,z=r=>r&&r.val!=v?z(r.right)||z(r.left):r)=>z(r)

const searchBST = solution_6;

// const specialTest = (...args) => {
// };

// NOTE: I developed the following BinaryTree and Batch classes for easy creation of binary trees with arbitrary values.
// first .insert must END with 'true' argument
// subsequent .inserts must START with 'false' argument...
// ...except the last .insert which must START with 'true' argument

class BinaryTree {
  constructor (value) {
    this.val = value;
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
const func = searchBST;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  root: new BinaryTree(4)
    .insert(2, 7, true)
    .insert(true, 1, 3, null, null),
  val: 2,
};
expected = new BinaryTree(2)
  .insert(1, 3, true)
  .insert(true);
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: