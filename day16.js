// --- Day 16: Validate IP Address ---

// Write a function to check whether an input string is a valid IPv4 address or IPv6 address or neither.

// IPv4 addresses are canonically represented in dot-decimal notation, which consists of four decimal numbers, each ranging from 0 to 255, separated by dots ("."), e.g.,172.16.254.1;

// Besides, leading zeros in the IPv4 is invalid. For example, the address 172.16.254.01 is invalid.

// IPv6 addresses are represented as eight groups of four hexadecimal digits, each group representing 16 bits. The groups are separated by colons (":"). For example, the address 2001:0db8:85a3:0000:0000:8a2e:0370:7334 is a valid one. Also, we could omit some leading zeros among four hexadecimal digits and some low-case characters in the address to upper-case ones, so 2001:db8:85a3:0:0:8A2E:0370:7334 is also a valid IPv6 address(Omit leading zeros and using upper cases).

// However, we don't replace a consecutive group of zero value with a single empty group using two consecutive colons (::) to pursue simplicity. For example, 2001:0db8:85a3::8A2E:0370:7334 is an invalid IPv6 address.

// Besides, extra leading zeros in the IPv6 is also invalid. For example, the address 02001:0db8:85a3:0000:0000:8a2e:0370:7334 is invalid.

// Note: You may assume there is no extra space or special characters in the input string.

// Example 1:
// Input: "172.16.254.1"
// Output: "IPv4"

// Explanation: This is a valid IPv4 address, return "IPv4".

// Example 2:
// Input: "2001:0db8:85a3:0:0:8A2E:0370:7334"
// Output: "IPv6"

// Explanation: This is a valid IPv6 address, return "IPv6".

// Example 3:
// Input: "256.256.256.256"
// Output: "Neither"

// Explanation: This is neither a IPv4 address nor a IPv6 address.

// ----------

// note: i have verified that while there are no test specs that include both '.' and ':', there is at least one test spec that contains neither.

// i split the logic based on whether the input includes a period or a colon. (even though there are no test specs that contain both '.' and ':', i
// thought it would be prudent to handle that possibility anyway.) then, depending on which punctuation i'm dealing with, i split the input into
// `blocks`, and i run a series of tests on the `blocks` array.
function solution_1 (IP) {
  const includesPeriod = IP.includes('.');
  const includesColon = IP.includes(':');
  if (includesPeriod && includesColon) return 'Neither';                                // EDGE CASE: `IP` contains both characters
  if (includesPeriod) {
    const blocks = IP.split('.');
    if (
      blocks.length !== 4 ||                                                            // must be exactly 4 blocks
      blocks.some(num => !num.length) ||                                                // no empty blocks
      blocks.some(num => num.length > 1 && num[0] === '0') ||                           // no leading 0s (but '0' by itself is allowed)
      blocks.some(num => num.split('').some(digit => digit < '0' || digit > '9')) ||    // no non-digit characters
      blocks.some(num => +num > 255)                                                    // each block must be a number 0-255
    ) return 'Neither';
    return 'IPv4';
  }
  if (includesColon) {
    const blocks = IP.split(':');
    if (
      blocks.length !== 8 ||                                                            // must be exactly 8 blocks
      blocks.some(num => num.length < 1 || num.length > 4) ||                           // all blocks must be 1-4 digits
      blocks.some(num => num.split('').some(digit => {
        digit = digit.toLowerCase();
        return !(digit >= '0' && digit <= '9' || digit >= 'a' && digit <= 'f');         // all characters must be a digit OR a letter from A-F (any case)
      }))
    ) return 'Neither';
    return 'IPv6';
  }
  return 'Neither';                                                                     // EDGE CASE: `IP` contains neither periods nor colons
}

// same solution, with helpers for validating blocks, and constants for the strings
function solution_2 (IP) {
  const includesPeriod = IP.includes('.');
  const includesColon = IP.includes(':');
  const [IPv4, IPv6, NEITHER] = ['IPv4', 'IPv6', 'Neither'];
  if (includesPeriod === includesColon) return NEITHER;                                 // EDGE CASE: `IP` contains both characters, or neither
  if (includesPeriod) {
    const blocks = IP.split('.');
    function validateIPv4Block (num) {
      return (
        num.length &&
        !(num.length > 1 && num[0] === '0') &&
        num.split('').every(digit => digit >= '0' && digit <= '9') &&
        +num < 256
      )
    }
    return blocks.length === 4 && blocks.every(num => validateIPv4Block(num)) ? IPv4 : NEITHER;
  } else {
    const blocks = IP.split(':');
    function validateIPv6Block (num) {
      return (
        num.length >= 1 && num.length <= 4 &&
        num.split('').every(digit => {
          digit = digit.toLowerCase();
          return digit >= '0' && digit <= '9' || digit >= 'a' && digit <= 'f'
        })
      )
    }
    return blocks.length === 8 && blocks.every(num => validateIPv6Block(num)) ? IPv6 : NEITHER;
  }
}

// one-liner - basically the above, with a few self-explanatory tricks thrown in
var solution_3=(I,[l,s,e,i]=['length','split','every','includes'],P=I[i]('.'),C=I[i](':'),A=n=>n[l]&&!(n[l]>1&&n[0]=='0')&&n[s]('')[e](d=>d>='0'&&d<='9')&&+n<256,B=n=>n[l]>=1&&n[l]<=4&&n[s]('')[e](d=>(d=d.toLowerCase())&&(d>='0'&&d<='9'||d>='a'&&d<='f')))=>(P&&(x=I[s]('.'))&&x[l]==4&&x[e](A))?'IPv4':(C&&(x=I[s](':'))&&x[l]==8&&x[e](B))?'IPv6':'Neither'

const validIPAddress = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = validIPAddress;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  IP: '172.16.254.1',
};
expected = 'IPv4';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  IP: '2001:0db8:85a3:0:0:8A2E:0370:7334',
};
expected = 'IPv6';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  IP: '256.256.256.256',
};
expected = 'Neither';
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 4
input = {
  IP: '20EE:FGb8:85a3:0:0:8A2E:0370:7334',
};
expected = 'Neither';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  IP: '20EE:Fb8:85a3:0:0:8A2E:0370:7334',
};
expected = 'IPv6';
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  IP: '3204989084338912748932647812689708923sdjlkch9 i389273012380009832437218947389-7534iodu',
};
expected = 'Neither';
test(func, input, expected, testNum, lowestTest, highestTest);