// --- Day 13: Largest Divisible Subset ---

// Given a set of distinct positive integers, find the largest subset such that every pair (Si, Sj) of elements in this subset satisfies:

// Si % Sj = 0 or Sj % Si = 0.

// If there are multiple solutions, return any subset is fine.

// Example 1:

// Input: [1, 2, 3]
// Output: [1, 2] (of course, [1, 3] will also be ok)

// Example 2:

// Input: [1, 2, 4, 8]
// Output: [1, 2, 4, 8]

// ----------

// first, realize that if a group of numbers have the property that every pair (Si, Sj) satisfies either Si % Sj = 0 or Sj % Si = 0, then that
// group of numbers, if sorted in increasing order, would also have the property that every number is a multiple of the one directly before it.
// we first sort `nums` in increasing order, so that for every number we process, all numbers already in our `memo` are guaranteed to be smaller.
// what we will do is iterate through `nums`, and for each num, we will create a `memo` entry for the largest collection of numbers up to that num
// that satisfy the property Si % Sj = 0 or Sj % Si = 0, which, again, means that the collection written in order would also have the property that
// each number is a multiple of the one directly before it. how can we do this easily? if we are currently looking at `nums[i]`, then we run
// another for loop with `j = i - 1` decreasing all the way to 0 (i.e. we iterate through all prior nums), and if any of the previous nums divides
// into the current one, then we can potentially adopt its `memo` entry, adding the current num to the end of its "chain". note that is possible
// to get multiple results from different chains (consider, e.g., `nums` is [4, 8, 10, 240] - then 240 extends [4, 8] as well as [10]). thus, we
// simply need a variable to track the longest chain seen so far, to guarantee that we find the best one for the current num. eventually, we just
// need to return the longest chain from the `memo` object. this ends up being a O(n^2) solution because of the nested for loops.
function solution_1 (nums) {
  nums.sort((a, b) => a - b);                               // it is critical that we sort the numbers in increasing order!
  const memo = {};
  for (let i = 0; i < nums.length; ++i) {
    let maxLowerNumLength = 0;                              // record-keeping variable
    for (let j = i - 1; j >= 0; --j) {
      if (
        nums[i] % nums[j] === 0 &&                          // if a previous num is a factor of the current num, and
        memo[nums[j]].length > maxLowerNumLength            // its `memo` entry is the longest we have seen so far...
      ) {
        maxLowerNumLength = memo[nums[j]].length;
        memo[nums[i]] = memo[nums[j]].concat(nums[i]);      // ...copy its entry for the current num, with current num added to the end
      }
    }
    if (!maxLowerNumLength) memo[nums[i]] = [nums[i]];      // if no previous num is a factor of the current num, start a new chain
  }
  return Object.values(memo).reduce((output, set) => output.length > set.length ? output : set, []);    // initial value [] handles empty input
}

// one-liner - basically the above
var solution_2=(N,M={},l='length')=>{N.sort((a,b)=>a-b);for(i=0;i<N[l];++i){n=N[i];m=0;for(j=i-1;j>=0;--j){x=N[j];X=M[x][l];!(n%x)&&X>m?(m=X,M[n]=[...M[x],n]):0}m?0:M[n]=[n]}return Object.values(M).reduce((o,s)=>o[l]>s[l]?o:s,[])}

const largestDivisibleSubset = solution_2;

const specialTest = (nums, answers) => {
  const equals = require('./_equality-checker')
  const sortedAnswer = largestDivisibleSubset(nums);
  const result = answers.some(e => equals(e, sortedAnswer));
  if (!result) console.log('GOT:', sortedAnswer);
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
  nums: [1, 2, 3],
  answers: [
    [1, 2],
    [1, 3],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  nums: [1, 2, 4, 8],
  answers: [
    [1, 2, 4, 8],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  nums: [],
  answers: [
    [],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  nums: [3, 4, 16, 8],
  answers: [
    [4, 8, 16],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  nums: [2, 3, 5, 7, 11, 13, 17, 19, 23, 31, 1000000007],
  answers: [
    [2],
    [3],
    [5],
    [7],
    [11],
    [13],
    [17],
    [19],
    [23],
    [31],
    [1000000007],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  nums: [
    849, 61, 224, 453, 433, 257, 282, 93, 826, 441, 164, 854, 195, 506, 628, 916, 197, 340, 482, 305, 721, 412, 542, 719, 947, 333, 472, 48, 514, 168, 64, 362, 580, 288, 814, 364, 544, 448, 809, 888, 972, 927, 434, 830, 554, 349, 26, 894, 682, 966, 594, 36, 540, 556, 508, 587, 69, 27, 651, 782, 958, 290, 596, 321, 185, 395, 129, 258, 634, 184, 67, 737, 415, 11, 982, 597, 692, 190, 915, 335, 81, 470, 842, 668, 538, 868, 670, 320, 825, 311, 267, 497, 495, 13, 626, 752, 646, 430, 935, 63, 24, 73, 5, 426, 764, 304, 967, 31, 638, 400, 500, 831, 419, 390, 698, 88, 874, 398, 679, 370, 244, 691, 347, 996, 688, 776, 751, 657, 932, 614, 14, 710, 730, 317, 28, 760, 306, 427, 611, 136, 845, 352, 284, 58, 681, 90, 277, 132, 126, 624, 171, 253, 905, 273, 443, 914, 205, 408, 489, 243, 293, 600, 900, 720, 211, 35, 564, 562, 219, 848, 326, 880, 767, 54, 899, 531, 131, 421, 784, 694, 578, 949, 898, 985, 875, 163, 469, 455, 425, 368, 526, 635, 754, 442, 549, 324, 641, 226, 951, 520, 992, 356, 242, 887, 158, 663, 545, 599, 605, 583, 71, 119, 891, 573, 610, 451, 363, 892, 686, 532, 296, 988, 51, 344, 529, 582, 940, 543, 603, 836, 201, 33, 135, 103, 895, 346, 897, 79, 955, 249, 318, 238, 355, 769, 615, 695, 254, 953, 783, 971, 325, 925, 575, 125, 111, 428, 566, 505, 263, 648, 217, 994, 886, 231, 503, 593, 999, 287, 521, 723, 676, 473, 857, 998, 716, 533, 922, 795, 107, 8, 174, 513, 436, 285, 447, 653, 630, 890, 860, 484, 210, 768, 203, 235, 792, 270, 65, 462, 673, 464, 846, 101, 334, 780, 286, 718, 762, 175, 577, 245, 138, 901, 867, 571, 161, 714, 280, 106, 592, 778, 968, 413, 420, 746, 225, 153, 883, 372, 62, 422, 281, 265, 358, 209, 206, 677, 621, 181, 367, 437, 978, 530, 693, 683, 417, 547, 183, 609, 689, 463, 823, 440, 861, 745, 1000, 418, 620, 598, 338, 34, 581, 704, 110, 55, 738, 595, 380, 744, 45, 743, 471, 817, 52, 632, 815, 264, 742, 222, 353, 396, 765, 386, 486, 360, 766, 567, 980, 310, 664, 404, 841, 118, 906, 876, 169, 800, 525, 700, 893, 98, 53, 859, 493, 330, 528, 945, 511, 173, 747, 576, 758, 939, 15, 725, 250, 601, 302, 50, 354, 116, 522, 872, 402, 777, 49, 30, 202, 930, 40, 631, 822, 796, 130, 47, 82, 699, 303, 25, 833, 248, 678, 481, 444, 384, 75, 666, 127, 705, 749, 948, 240, 941, 991, 804, 394, 452, 828, 23, 636, 866, 799, 633, 917, 759, 665, 707, 501, 608, 492, 454, 411, 237, 590, 541, 16, 856, 862, 843, 9, 476, 539, 929, 586, 946, 644, 684, 755, 6, 260, 124, 438, 516, 713, 409, 728, 546, 771, 753, 877, 834, 697, 869, 675, 165, 60, 934, 289, 801, 1, 896, 496, 339, 100, 128, 642, 827, 943, 504, 154, 21, 565, 309, 806, 661, 660, 741, 969, 824, 460, 507, 379, 407, 120, 990, 43, 272, 918, 337, 239, 331, 669, 790, 152, 791, 97, 658, 643, 902, 750, 572, 793, 327, 650, 625, 855, 936, 498, 458, 156, 207, 727, 920, 510, 445, 536, 38, 230, 294, 871, 708, 779, 218, 908, 315, 179, 873, 142, 724, 524, 907, 416, 802, 431, 191, 76, 960, 241, 385, 348, 259, 187, 7, 853, 923, 397, 810, 359, 560, 405, 952, 91, 449, 973, 299, 913, 485, 674, 414, 266, 149, 84, 942, 208, 588, 993, 680, 4, 392, 166, 612, 839, 95, 712, 619, 275, 772, 702, 931, 247, 818, 735, 561, 711, 557, 151, 864
  ],
  answers: [
    [1, 4, 8, 16, 64, 128, 384, 768],
    [1, 5, 15, 30, 60, 120, 240, 960],
    [1, 5, 15, 30, 60, 120, 360, 720],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  nums: [
    889, 27, 652, 25, 468, 164, 417, 98, 163, 564, 4, 287, 586, 947, 138, 753, 756, 105, 975, 993, 203, 879, 775, 764, 229, 448, 132, 473, 529, 751, 988, 777, 992, 793, 596, 155, 210, 45, 318, 125, 49, 956, 62, 347, 93, 167, 454, 549, 141, 447, 103, 371, 573, 866, 599, 372, 349, 71, 900, 451, 411, 317, 579, 402, 461, 175, 908, 22, 219, 577, 147, 619, 532, 560, 976, 726, 771, 876, 218, 569, 979, 588, 196, 186, 512, 897, 609, 763, 79, 926, 124, 892, 452, 31, 913, 608, 641, 491, 971, 309, 819, 48, 694, 266, 999, 24, 853, 220, 391, 2, 351, 117, 814, 721, 547, 91, 438, 542, 226, 185, 113, 556, 676, 83, 864, 846, 131, 295, 539, 748, 645, 915, 600, 136, 134, 342, 489, 601, 692, 605, 766, 152, 857, 959, 589, 750, 291, 313, 369, 404, 396, 838, 436, 241, 320, 730, 67, 46, 19, 861, 531, 360, 350, 483, 52, 954, 248, 457, 456, 126, 398, 558, 310, 688, 222, 30, 443, 442, 778, 633, 877, 370, 952, 958, 683, 898, 741, 896, 780, 245, 262, 503, 550, 862, 359, 669, 808, 795, 189, 238, 966, 469, 525, 426, 540, 895, 460, 790, 987, 355, 439, 951, 183, 293, 314, 211, 64, 642, 267, 112, 89, 701, 681, 773, 922, 149, 574, 352, 693, 385, 680, 92, 709, 470, 394, 243, 762, 598, 638, 428, 54, 887, 477, 695, 506, 135, 289, 815, 85, 563, 963, 9, 888, 53, 624, 740, 732, 715, 800, 553, 43, 315, 58, 742, 733, 980, 779, 837, 634, 275, 41, 834, 197, 280, 433, 249, 904, 172, 981, 970, 323, 885, 430, 365, 199, 840, 397, 292, 409, 481, 102, 260, 88, 524, 961, 362, 603, 546, 643, 731, 746, 923, 994, 178, 686, 326, 8, 929, 725, 761, 768, 176, 953, 28, 629, 839, 716, 799, 429, 690, 344, 978, 684, 723, 717, 625, 42, 282, 252, 329, 181, 769, 504, 485, 796, 484, 200, 177, 128, 860, 554, 32, 170, 493, 304, 118, 142, 937, 745, 498, 810, 109, 826, 165, 874, 658, 361, 537, 921, 749, 36, 918, 319, 788, 628, 373, 50, 833, 216, 94, 802, 339, 202, 985, 237, 356, 655, 724, 682, 75, 500, 388, 321, 308, 405, 393, 482, 499, 635, 973, 544, 296, 884, 535, 607, 977, 538, 10, 384, 389, 917, 957, 368, 180, 425, 169, 850, 816, 160, 51, 264, 378, 240, 268, 602, 656, 697, 610, 659, 919, 708, 528, 253, 881, 215, 392, 831, 593, 17, 646, 332, 159, 941, 353, 859, 82, 534, 29, 414, 281, 813, 734, 377, 567, 156, 15, 400, 832, 166, 718, 647, 471, 380, 322, 948, 797, 14, 254, 399, 5, 354, 872, 938, 906, 305, 496, 303, 34, 35, 518, 673, 817, 336, 557, 613, 37, 421, 231, 236, 424, 490, 406, 146, 420, 805, 572, 441, 257, 445, 221, 886, 198, 893, 789, 341, 100, 182, 505, 327, 758, 960, 909, 121, 122, 729, 949, 209, 630, 996, 711, 786, 145, 650, 570, 848, 759, 440, 7, 153, 912, 302, 450, 894, 232, 791, 462, 772, 217, 767, 263, 543, 552, 787, 408, 358, 519, 755, 754, 407, 565, 653, 858, 699, 1000, 346, 720, 566, 81, 662, 674, 239, 73, 60, 179, 193, 111, 143, 616, 760, 348, 99, 792, 476, 812, 871, 523, 585, 357, 338, 962, 882, 820, 474, 555, 677, 488, 561, 212, 841, 69, 1, 950, 250, 983, 70, 234, 639, 580, 794, 559, 190, 945, 752, 843, 935, 247, 705, 328, 722, 873, 863, 672, 902, 637, 623, 578, 453, 910, 984, 844, 230, 171, 823, 271, 943, 928, 782, 72, 376, 520, 495
  ],
  answers: [
    [1, 2, 4, 8, 32, 64, 128, 384, 768],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  nums: [4, 8, 10, 240],
  answers: [
    [4, 8, 240],
  ],
};
expected = true;
test(func, input, expected, testNum, lowestTest, highestTest);