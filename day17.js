// --- Day 17: Surrounded Regions ---

// Given a 2D board containing 'X' and 'O' (the letter O), capture all regions surrounded by 'X'.

// A region is captured by flipping all 'O's into 'X's in that surrounded region.

// Example:

// X X X X
// X O O X
// X X O X
// X O X X

// After running your function, the board should be:

// X X X X
// X X X X
// X X X X
// X O X X

// Explanation:

// Surrounded regions shouldn’t be on the border, which means that any 'O' on the border of the board are not flipped to 'X'. Any 'O' that is not on the border and it is not connected to an 'O' on the border will be flipped to 'X'. Two cells are connected if they are adjacent cells connected horizontally or vertically.

// ----------

// the basic idea is travel along the border (top, bottom, left, and right edges) ONLY, and whenever a 'O' is found, run a recursive flood fill helper function on that 'O', converting it and all
// neighboring cells temporarily to a different character (e.g. 'V'). this is because any 'O' at or touching the border cannot possibly be a captured cell. conversely, once the conversion has been
// done, all remaining 'O' anywhere else inside the grid must logically be captured by virtue of being unreachable by flood fill along the edges. thus, we simply iterate through the grid, converting
// all 'O' to 'X'. finally, to restore all 'V' back to their original 'O' state, we iterate through the grid one last time. note that if either height or width is less than 3, no cells can be captured.
function solution_1 (board) {

  // INITIALIZATIONS
  const height = board.length;
  if (height < 3) return board;                                                 // EDGE CASE: if either dimension is less than 3, there cannot be a surrounded region
  const width = board[0].length;
  if (width < 3) return board;                                                  // EDGE CASE: ditto
  
  // HELPER FUNCTION: FLOOD FILL OUTER REGION OF 'O'
  function helper(row, col) {
    if (
      row < 0 || row === height ||                                              // `row` out of bounds
      col < 0 || col === width  ||                                              // `col` out of bounds
      board[row][col] !== 'O'                                                   // character is not 'O'
    ) return;
    board[row][col] = 'V';                                                      // temporarily convert 'O' to 'V' (for "visited")
    helper(row - 1, col);                                                       // recurse on 4 neighbors
    helper(row + 1, col);
    helper(row, col - 1);
    helper(row, col + 1);
  }

  // GO ALONG THE TOP AND BOTTOM EDGES OF `board` AND INVOKE `helper`
  for (let col = 0; col < width; ++col) {
    helper(0, col);                                                             // top edge
    helper(height - 1, col);                                                    // bottom edge
  }

  // GO ALONG THE LEFT AND RIGHT EDGES OF `board` AND INVOKE `helper
  for (let row = 1; row < height - 1; ++row) {
    helper(row, 0);                                                             // left edge
    helper(row, width - 1);                                                     // right edge
  }
  
  // ITERATE THROUGH `board` (EXCLUDING BORDER) AND CONVERT ALL 'O' INTO 'X"
  for (let row = 1; row < height - 1; ++row) {
    for (let col = 1; col < width - 1; ++col) {
      if (board[row][col] === 'O') board[row][col] = 'X';                       // convert any captured 'O' into 'X' (no need to check outer border for 'O')
    }
  }

  // ITERATE THROUGH `board` AND CONVERT ALL 'V' INTO 'O'
  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      if (board[row][col] === 'V') board[row][col] = 'O';                       // convert any visited 'V' back into 'O'
    }
  }
}

// one-liner - basically the above
var solution_2=(b,l='length',h=b[l],w=h&&b[0][l],H=(r,c)=>r<0||r==h||c<0||c==w||b[r][c]!=='O'?0:(b[r][c]='V',H(r-1,c),H(r+1,c),H(r,c-1),H(r,c+1)))=>{for(c=0;c<w;++c){H(0,c);H(h-1,c)}for(r=1;r<h-1;++r){H(r,0);H(r,w-1)}for(r=1;r<h-1;++r)for(c=1;c<w-1;++c)if(b[r][c]=='O')b[r][c]='X';for(r=0;r<h;++r)for(c=0;c<w;++c)if(b[r][c]=='V')b[r][c]='O'}

const solve = solution_2;

const specialTest = board => {
  solve(board);
  return board;
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
  board: [
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'X'],
  ],
};
expected = [
  ['X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X'],
  ['X', 'O', 'X', 'X'],
];
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES: