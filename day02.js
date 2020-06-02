// --- Day 2: Delete Node in a Linked List ---

// Write a function to delete a node(except the tail) in a singly linked list, given only access to that node.

// Given linked list -- head = [4, 5, 1, 9], which looks like following:
// 4 --> 5 --> 1 --> 9

// Example 1:

// Input: head = [4, 5, 1, 9], node = 5
// Output: [4, 1, 9]
// Explanation: You are given the second node with value 5, the linked list should become 4 -> 1 -> 9 after calling your function.

// Example 2:

// Input: head = [4, 5, 1, 9], node = 1
// Output: [4, 5, 9]
// Explanation: You are given the third node with value 1, the linked list should become 4 -> 5 -> 9 after calling your function.

// Note:

// The linked list will have at least two elements.
// All of the nodes' values will be unique.
// The given node will not be the tail and it will always be a valid node of the linked list.
// Do not return anything from your function.

// ----------

// since we have no access to any nodes behind `node`, we cannot reconfigure the previous node's .next pointer to be anything other than `node`
// itself. the workaround, then, is to "absorb" the node after `node` (by copying its value), and to effectively delete that one instead by
// setting `node.next` to whatever comes after the absorbed node!
function solution_1 (node) {
  node.val = node.next.val;
  node.next = node.next.next;
}

// one-liner - basically the above. note that leetcode specifically checks to see that the function isn't returning anything, so i used curly braces
var solution_2=n=>{N=n.next;n.val=N.val;n.next=N.next}

const deleteNode = solution_2;

class ListNode {
  constructor(val, ...extraVals) {
    this.val = val;
    this.next = null;
    if (extraVals.length) this.insert(...extraVals);
  }
  insert(...vals) {
    let currentNode = this;
    for (const val of vals) {
      const nextNode = new ListNode(val);
      currentNode.next = nextNode;
      currentNode = nextNode;
    }
    return this;
  }
}

const specialTest = (head, node, expected) => {
  let currentNode = head;
  while (currentNode) {
    if (currentNode.val === node) {
      deleteNode(currentNode);
      break;
    }
    currentNode = currentNode.next;
  }
  const equals = require('./_equality-checker');
  return equals(head, expected);
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
  head: new ListNode(4, 5, 1, 9),
  node: 5,
  expected: new ListNode(4, 1, 9),
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  head: new ListNode(4, 5, 1, 9),
  node: 1,
  expected: new ListNode(4, 5, 9),
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: