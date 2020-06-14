// --- Day 14: Cheapest Flights Within K Stops ---

// There are n cities connected by m flights. Each flight starts from city u and arrives at v with a price w.

// Now given all the cities and flights, together with starting city src and the destination dst, your task is to find the cheapest price from src to dst with up to k stops. If there is no such route, output -1.

// Example 1:
// Input: 
// n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
// src = 0, dst = 2, k = 1
// Output: 200
// Explanation: 
// The graph looks like this:


// The cheapest price from city 0 to city 2 with at most 1 stop costs 200, as marked red in the picture.

// Example 2:
// Input: 
// n = 3, edges = [[0,1,100],[1,2,100],[0,2,500]]
// src = 0, dst = 2, k = 0
// Output: 500
// Explanation: 
// The graph looks like this:


// The cheapest price from city 0 to city 2 with at most 0 stop costs 500, as marked blue in the picture.
 
// Constraints:

// The number of nodes n will be in range [1, 100], with nodes labeled from 0 to n - 1.
// The size of flights will be in range [0, n * (n - 1) / 2].
// The format of each flight will be (src, dst, price).
// The price of each flight will be in the range [1, 10000].
// k is in the range of [0, n - 1].
// There will not be any duplicated flights or self cycles.

// ----------

// this solution is theoretically correct, but fails leetcode because of a large input. the only way i was able to tweak this solution and get it to work on leetcode was to add an edge case specifically
// tailored to the large test case, hard coded to return the correct answer.
// we first parse `flights` into the `flightsData` object so we can quickly look up which cities you can go to from any city, at what price. we then initialize a record-keeping variable, `minPrice`, which
// starts at Infinity and will ultimately be returned (unless it stays at Infinity, in which case -1 will be returned). we run DFS with a stack, where each element is [city, moves, paid] (`city` is the
// current city you're starting from, `moves` is the number of stops you have left, and `paid` is the amount of money spent so far). we also need a `visited` object which keeps track, for every city,
// the minimum price spent so far to get to that city for each possible number of moves. for each iteration of the DFS, we look at all cities we could possibly fly to, calculate the cost, and as long as
// we haven't already found a way to get to that city in that number of moves for cheaper, we will push this to the stack.
function solution_1 (n, flights, src, dst, K) {

  // PARSE `flights`
  const flightsData = {};
  for (const flight of flights) {
    const [src, dst, price] = flight;
    if (!(src in flightsData)) flightsData[src] = {};
    flightsData[src][dst] = price;
  }
    
  // INITIALIZE `minPrice`
  let minPrice = Infinity;

  // DFS
  const stack = [[src, K, 0]];
  const visited = {};
  while (stack.length) {
    const [city, moves, paid] = stack.pop();

    if (city in visited && moves in visited[city] && visited[city][moves] <= paid) continue;
    if (!(city in visited)) visited[city] = {};
    visited[city][moves] = paid;

    for (const destinationStr in flightsData[city]) {
      const destination = +destinationStr;
      if (destination === dst) {
        minPrice = Math.min(minPrice, paid + flightsData[city][dst]);
      } else if (moves) {
        stack.push([destination, moves - 1, paid + flightsData[city][destination]]);
      }
    }
  }
  return minPrice === Infinity ? -1 : minPrice;
}

// this solution is adopted from the fastest javascript submission as of the time of this writing. use dynamic programming to create a table with rows from 0 to `K`, and columns for all cities 0 to
// `n - 1`. each data point represents the best price you can pay to get to that city in K (or fewer!) moves, originating from `src`. at the very end, just look at the table at row `K`, at the column
// corresponding to `dst`.
function solution_2 (n, flights, src, dst, K) {
  const dp = Array(K + 1).fill(0).map(() => Array(n).fill(Infinity));   // dp grid: rows go from 0 to `K`, and columns go from 0 to `n - 1`. all data points initialized at Infinity
  for (let i = 0; i <= K; ++i) {                                        // ITERATE through all rows from 0 to `K`
    dp[i][src] = 0;                                                     // since we originate from `src`, the cost to get to `src` is always 0, no matter how many moves we have made so far
    for (const flight of flights) {                                     // ITERATE through all flights...
      const [cityA, cityB, price] = flight;                             // i.e. the cost of flying directly from `cityA` to `cityB` is `price`
      if (i === 0) {
        if (cityA === src) dp[0][cityB] = price;                        // ...for `K` === 0, set the prices for all direct flights away from `src`
      } else {
        if (
          dp[i - 1][cityA] !== Infinity &&                              // ...for all higher values of `K`, check if `cityA` was reachable in `K - 1` moves...
          dp[i - 1][cityA] + price < dp[i][cityB]                       // ...and compare the cost of reaching `cityB` directly from `cityA` on this move to the lowest known price of reaching `cityB`...
        ) dp[i][cityB] = dp[i - 1][cityA] + price;                      // ...and update accordingly
      }
    }
  }
  return dp[K][dst] === Infinity ? -1 : dp[K][dst];                     // can you reach `dst` in at most `K` stops? if not, `dp` will have price as `Infinity`, so return -1. else, return price.
}

// one-liner - basically the above
var solution_3=(n,F,s,d,K,A=Array,I=Infinity,g=A(K+1).fill(0).map(()=>A(n).fill(I)))=>{for(i=0;i<=K;++i){g[i][s]=0;for(f of F){[a,b,p]=f;i?g[i-1][a]!=I&&g[i-1][a]+p<g[i][b]?g[i][b]=g[i-1][a]+p:0:a==s?g[0][b]=p:0}}return g[K][d]==I?-1:g[K][d]}

const findCheapestPrice = solution_3;

// const specialTest = (...args) => {
// };

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findCheapestPrice;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

// Test case 1
input = {
  n: 3,
  flights: [
    [0, 1, 100],
    [1, 2, 100],
    [0, 2, 500],
  ],
  src: 0,
  dst: 2,
  K: 1,
};
expected = 200;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  n: 3,
  flights: [
    [0, 1, 100],
    [1, 2, 100],
    [0, 2, 500],
  ],
  src: 0,
  dst: 2,
  K: 0,
};
expected = 500;
test(func, input, expected, testNum, lowestTest, highestTest);

// INITIALLY FAILED THESE TEST CASES:

// Test case 3
input = {
  n: 5,
  flights: [
    [0, 1, 5],
    [1, 2, 5],
    [0, 3, 2],
    [3, 1, 2],
    [1, 4, 1],
    [4, 2, 1],
  ],
  src: 0,
  dst: 2,
  K: 2,
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  n: 17,
  flights: [
    [0,12,28],[5,6,39],[8,6,59],[13,15,7],[13,12,38],[10,12,35],[15,3,23],[7,11,26],[9,4,65],[10,2,38],[4,7,7],[14,15,31],[2,12,44],[8,10,34],[13,6,29],[5,14,89],[11,16,13],[7,3,46],[10,15,19],[12,4,58],[13,16,11],[16,4,76],[2,0,12],[15,0,22],[16,12,13],[7,1,29],[7,14,100],[16,1,14],[9,6,74],[11,1,73],[2,11,60],[10,11,85],[2,5,49],[3,4,17],[4,9,77],[16,3,47],[15,6,78],[14,1,90],[10,5,95],[1,11,30],[11,0,37],[10,4,86],[0,8,57],[6,14,68],[16,8,3],[13,0,65],[2,13,6],[5,13,5],[8,11,31],[6,10,20],[6,2,33],[9,1,3],[14,9,58],[12,3,19],[11,2,74],[12,14,48],[16,11,100],[3,12,38],[12,13,77],[10,9,99],[15,13,98],[15,12,71],[1,4,28],[7,0,83],[3,5,100],[8,9,14],[15,11,57],[3,6,65],[1,3,45],[14,7,74],[2,10,39],[4,8,73],[13,5,77],[10,0,43],[12,9,92],[8,2,26],[1,7,7],[9,12,10],[13,11,64],[8,13,80],[6,12,74],[9,7,35],[0,15,48],[3,7,87],[16,9,42],[5,16,64],[4,5,65],[15,14,70],[12,0,13],[16,14,52],[3,10,80],[14,11,85],[15,2,77],[4,11,19],[2,7,49],[10,7,78],[14,6,84],[13,7,50],[11,6,75],[5,10,46],[13,8,43],[9,10,49],[7,12,64],[0,10,76],[5,9,77],[8,3,28],[11,9,28],[12,16,87],[12,6,24],[9,15,94],[5,7,77],[4,10,18],[7,2,11],[9,5,41]
  ],
  src: 13,
  dst: 4,
  K: 13,
};
expected = 47;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  n: 83,
  flights: [
    [52,72,9299],[47,12,9609],[81,25,1667],[62,41,13],[46,60,3523],[72,21,3033],[73,82,239],[72,78,8695],[22,28,3795],[31,34,1632],[39,22,9340],[47,62,2435],[61,57,8532],[26,43,274],[76,28,4281],[19,27,7506],[44,71,2003],[44,6,2948],[29,25,3550],[67,3,2383],[33,38,75],[26,73,5222],[20,71,1073],[18,2,3016],[4,80,5315],[55,81,7167],[82,30,7916],[69,60,6139],[71,62,6305],[80,4,9543],[70,31,1939],[18,25,5236],[1,47,9578],[50,58,4477],[7,60,2345],[26,22,4988],[37,79,6876],[78,59,1010],[5,12,661],[57,0,4331],[43,47,1422],[45,20,9007],[5,55,8681],[9,36,548],[54,10,853],[27,49,2613],[57,81,1198],[35,58,3617],[67,70,6274],[36,71,28],[52,22,7144],[39,74,4118],[3,73,1191],[32,40,8694],[64,54,5612],[73,63,258],[45,66,6214],[23,55,9157],[13,71,1589],[74,51,1761],[41,24,5816],[75,66,4440],[57,70,8406],[28,37,2911],[61,42,136],[82,25,6914],[71,46,6829],[55,50,3436],[39,58,5584],[27,0,3313],[39,54,5099],[29,4,478],[16,50,4181],[3,35,579],[18,77,5818],[12,19,7057],[73,53,7359],[77,3,4995],[74,53,8958],[54,12,931],[22,41,7071],[39,27,6612],[34,37,9512],[82,39,2904],[4,14,7663],[45,61,8056],[23,42,2895],[45,29,5220],[9,48,3995],[2,34,3214],[80,49,4112],[30,66,3759],[54,38,9278],[35,40,3455],[16,5,5195],[50,5,4023],[61,30,6278],[63,30,152],[4,39,2920],[27,39,7472],[19,40,6208],[66,18,4608],[75,64,2319],[26,53,1557],[20,34,9704],[43,37,7307],[7,52,558],[45,26,8097],[57,43,9010],[49,5,1134],[45,27,7196],[72,9,1989],[69,3,9699],[49,4,8082],[55,65,2037],[24,8,399],[77,74,3350],[16,67,5824],[75,47,477],[27,56,1210],[37,47,5227],[63,70,1880],[31,72,2365],[60,3,4534],[30,12,1250],[63,21,8326],[76,70,424],[37,45,4426],[3,49,6760],[62,5,3411],[45,60,4125],[21,11,3315],[47,28,7438],[58,18,965],[0,26,8100],[75,50,3382],[48,41,4819],[67,57,3640],[19,45,4606],[74,28,7109],[57,21,4273],[43,22,5098],[40,54,5729],[12,24,4327],[81,76,5656],[77,62,6814],[56,19,3115],[9,59,1039],[28,82,522],[59,42,8459],[64,19,234],[82,19,6272],[53,66,9844],[70,82,9343],[41,61,385],[54,55,4580],[61,6,3964],[32,35,3507],[47,29,4813],[43,34,5950],[11,45,9658],[43,20,9333],[14,69,9703],[73,3,1444],[8,61,5381],[15,42,1266],[12,54,6529],[44,30,7763],[51,26,1762],[40,25,1614],[4,21,4567],[8,43,4277],[41,5,647],[27,35,8910],[59,41,6524],[68,44,904],[27,38,8893],[35,76,4166],[50,46,7678],[3,81,9533],[25,40,7266],[43,32,278],[50,64,1545],[2,4,6581],[47,82,1849],[44,49,8588],[24,34,7103],[48,70,4988],[29,78,5357],[1,29,965],[51,22,3108],[35,70,7877],[2,82,7080],[39,29,3834],[44,28,9246],[37,12,8435],[59,7,6009],[28,6,3136],[7,63,9852],[71,2,3824],[22,19,8100],[64,10,6626],[2,70,6965],[81,33,6141],[75,43,940],[5,3,4912],[11,81,3147],[1,79,2273],[58,12,3332],[31,6,7364],[51,0,8862],[79,68,6297],[70,18,7202],[9,57,4658],[22,0,5803],[2,18,2409],[7,14,9023],[6,7,1006],[79,26,300],[63,55,482],[57,78,3699],[33,63,4847],[76,80,2667],[31,1,1779],[70,77,3264],[23,82,3729],[74,8,2019],[41,31,5174],[69,43,4898],[52,24,7122],[21,59,5484],[45,65,4076],[32,17,668],[76,43,9083],[21,75,5033],[38,35,5631],[34,22,2740],[11,27,2183],[21,58,707],[59,58,4043],[9,73,8576],[12,32,2626],[38,5,5666],[23,50,5579],[71,77,2774],[70,21,658],[36,10,1563],[46,79,9140],[36,60,5401],[4,78,3738],[40,51,2383],[66,0,4534],[78,67,7242],[39,24,3198],[46,42,4925],[45,59,9230],[24,61,9336],[10,18,7179],[69,10,5273],[54,63,6834],[56,6,1618],[79,23,7288],[8,16,6402],[29,75,9303],[62,65,6060],[12,36,8681],[45,63,9386],[14,56,5810],[49,10,7667],[16,46,5190],[2,25,7476],[43,29,8983],[22,18,2427],[41,62,9525],[61,73,7735],[61,82,2075],[21,76,4990],[44,10,1884],[73,61,3514],[10,31,950],[38,15,790],[53,13,5152],[2,21,5869],[29,60,4269],[32,5,7092],[3,76,9530],[17,28,8859],[32,53,9944],[79,55,3192],[32,60,5213],[77,68,5270],[69,67,6502],[0,16,6598],[66,67,6506],[21,27,7845],[81,7,2213],[73,14,90],[73,70,2066],[6,58,6013],[75,60,7773],[33,51,7015],[53,38,570],[74,57,1571],[75,71,8334],[28,13,3501],[53,47,69],[37,46,6026],[51,71,2888],[25,26,1725],[35,63,7368],[67,19,462],[68,47,3757],[28,2,1923],[64,52,7091],[9,80,6599],[81,2,2674],[81,54,2027],[56,11,5011],[49,62,3650],[75,48,8423],[44,40,5878],[63,59,3165],[23,18,5306],[56,16,8629],[17,29,8792],[48,18,6632],[51,77,4709],[8,82,54],[49,52,9265],[49,11,3387],[44,55,1086],[10,39,5788],[36,79,8068],[72,47,9659],[43,66,4868],[17,39,6846],[79,44,7599],[34,6,8052],[54,8,8529],[46,9,7616],[31,68,871],[21,10,9762],[37,4,1256],[27,7,5122],[10,15,9305],[78,43,4023],[27,76,647],[23,72,7024],[1,9,9473],[24,69,183],[1,56,551],[58,48,6580],[25,75,138],[23,1,575],[75,18,6264],[9,50,5866],[5,29,6035],[0,76,3675],[74,33,6798],[28,3,6605],[69,4,2268],[82,33,3052],[58,54,1087],[77,12,9199],[77,66,3942],[11,82,7996],[60,64,9267],[33,79,2740],[77,57,8224],[25,74,9049],[20,32,8379],[33,69,5641],[71,40,8512],[26,76,8210],[58,51,6536],[22,17,12],[38,70,968],[17,4,9415],[55,9,4399],[9,27,5111],[76,36,1284],[24,55,2439],[39,60,6303],[82,10,1826],[17,44,6955],[30,5,9939],[60,29,3693],[48,31,6725],[72,82,5136],[73,51,2442],[2,3,5165],[2,12,7958],[6,35,5468],[6,25,3525],[25,34,5289],[50,51,4065],[10,77,6734],[32,27,6028],[81,14,2387],[61,22,5554],[33,19,7277],[17,74,5985],[3,44,9844],[62,56,4440],[56,18,8101],[80,44,9658],[13,6,2129],[18,78,9198],[81,71,8238],[55,34,9092],[41,67,510],[59,19,1394],[25,13,5406],[10,24,8291],[72,11,3966],[39,75,4546],[9,11,6083],[62,73,8482],[1,19,1694],[54,40,3241],[51,3,9375],[64,44,2472],[1,16,1846],[20,58,7139],[65,32,1620],[28,43,4703],[40,79,6590],[7,25,8915],[63,80,8445],[4,16,3716],[29,53,3095],[35,8,4844],[26,10,5518],[76,11,6559],[12,65,6272],[82,17,8241],[16,2,5063],[0,3,6087],[47,23,6981],[81,66,6038],[32,43,8448],[50,32,9160],[80,15,1213],[15,3,5221],[81,53,301],[62,63,3589],[2,71,2447],[3,52,6428],[71,5,2476],[5,0,1303],[35,72,408],[11,30,4821],[10,53,9905],[76,65,4669],[50,24,8721],[76,60,9867],[57,6,8927],[70,80,6223],[36,65,5144],[31,59,8224],[53,55,8867],[80,42,2034],[22,12,7870],[40,1,56],[24,56,3352],[64,4,4864],[34,5,9549],[57,38,3122],[79,70,9689],[13,74,7092],[49,44,2236],[53,17,7421],[56,48,3932],[42,79,5015],[71,44,2101],[35,64,9521],[49,72,5616],[81,0,6448],[2,60,5299],[69,73,6635],[54,0,294],[22,11,7769],[70,25,5820],[4,38,6103],[53,60,4462],[67,72,4990],[76,23,8387],[9,21,4264],[55,73,4048],[7,55,5141],[19,24,7879],[58,7,7246],[26,20,2754],[8,70,9878],[34,41,5006],[73,17,2676],[59,64,8433],[1,30,9301],[31,35,5671],[43,50,2610],[29,32,8309],[17,78,3090],[52,42,7920],[72,17,2428],[20,49,590],[14,71,4852],[74,79,6471],[8,15,7747],[71,60,4432],[44,59,418],[5,25,8937],[37,76,2854],[54,44,7395],[12,9,486],[39,37,5752],[56,71,5479],[25,55,8491],[77,41,8181],[13,40,564],[59,54,1364],[26,56,5469],[31,20,5431],[24,29,5594],[5,82,8661],[11,41,8055],[16,69,5076],[77,25,5997],[40,72,8617],[79,48,8649],[73,74,1380],[67,11,5443],[54,30,8383],[43,24,5711],[1,67,8614],[14,0,3921],[73,30,7828],[50,47,9325],[50,39,725],[42,46,7110],[40,27,3660],[54,28,1968],[37,42,7448],[33,46,213],[77,17,3974],[31,2,3151],[66,7,7350],[6,14,2617],[77,16,4559],[48,68,570],[26,1,4519],[33,35,4778],[3,62,2251],[36,68,635],[82,42,4380],[62,54,3804],[2,10,6011],[39,17,3726],[4,8,7442],[2,79,2961],[81,60,6214],[53,76,5377],[39,9,8245],[9,58,4004],[55,74,1597],[74,23,3526],[24,6,9802],[45,79,795],[47,76,3994],[67,61,6850],[57,40,7106],[15,9,168],[16,31,1116],[20,38,8897],[22,78,6031],[26,24,8730],[21,25,6356],[30,15,1217],[74,42,2946],[32,74,7636],[20,57,1625],[34,39,2631],[34,44,8052],[35,48,8417],[67,53,2337],[3,5,8911],[65,3,8213],[12,81,7850],[3,68,7554],[75,62,3724],[35,75,3640],[48,40,2193],[71,12,7762],[14,21,8965],[22,43,912],[45,30,2185],[69,15,5820],[32,15,1218],[33,16,9795],[16,77,8260],[58,35,6479],[55,5,7206],[19,74,6998],[28,23,9731],[20,16,3555],[9,16,2588],[37,14,5659],[16,8,364],[49,56,8379],[70,36,9255],[19,82,7611],[69,44,5440],[39,64,6722],[28,25,7060],[76,69,9578],[66,32,9355],[72,12,8817],[15,4,7756],[32,49,3577],[42,30,1949],[53,77,6914],[20,66,7047],[3,33,4963],[47,42,3049],[71,43,6635],[18,46,5033],[70,63,7276],[36,17,3144],[82,31,341],[52,75,6552],[73,49,7874],[6,12,3938],[51,17,7391],[54,59,916],[22,30,2334],[13,12,4042],[42,80,5179],[72,58,3867],[2,0,2828],[50,69,2022],[13,49,382],[13,73,9214],[25,23,5652],[35,29,9628],[72,53,7440],[25,1,8751],[52,34,970],[44,45,6210],[14,22,7592],[71,30,7503],[72,3,2903],[71,80,6241],[43,40,477],[59,25,2990],[30,78,7033],[61,43,7762],[76,5,7983],[40,37,7460],[12,49,791],[18,43,7606],[64,14,6527],[57,77,7772],[41,13,1599],[71,35,1553],[33,4,6905],[46,27,3971],[81,28,9066],[69,27,6436],[51,70,65],[57,33,7355],[55,70,7360],[53,12,490],[9,39,7290],[82,29,5385],[38,47,2735],[33,28,1351],[22,34,8809],[59,50,3867],[66,20,7176],[82,62,1656],[14,47,5754],[64,48,6627],[13,22,3578],[14,25,9568],[67,26,2156],[34,72,9505],[47,4,7293],[69,64,6918],[7,46,7244],[25,11,1000],[19,21,4993],[8,1,1301],[60,25,8594],[31,65,9899],[82,66,6642],[66,49,7141],[65,58,7314],[22,25,9825],[44,54,174],[41,75,2842],[5,42,8098],[79,57,3229],[16,34,9700],[69,21,7412],[63,17,3692],[46,4,5757],[75,19,1724],[29,0,4132],[42,41,8417],[34,68,9105],[14,40,4363],[81,23,2398],[81,6,5357],[51,5,2931],[52,76,4552],[23,7,671],[3,63,3518],[9,34,8742],[71,22,1610],[82,74,4072],[38,26,3201],[24,17,4785],[46,80,4446],[3,40,5591],[49,14,1519],[44,70,1160],[81,30,6197],[71,81,3219],[18,53,8014],[43,30,877],[34,61,5359],[20,21,3481],[67,9,3824],[31,40,6379],[49,26,287],[15,10,605],[64,79,6155],[0,39,7452],[71,0,7686],[25,63,1495],[25,28,4508],[40,4,2607],[30,22,7874],[74,46,6116],[28,32,6926],[43,70,3765],[33,20,4442],[29,45,5882],[51,81,8055],[1,51,9992],[70,59,5040],[45,6,8057],[65,51,6656],[55,2,6530],[30,8,9792],[15,23,2372],[78,62,7665],[76,44,9984],[21,18,6431],[52,47,2421],[47,74,463],[60,57,5732],[58,27,1479],[48,69,5250],[52,62,9659],[32,30,1422],[41,15,9545],[17,35,4506],[38,31,5438],[70,4,7718],[8,63,7884],[78,71,8060],[80,74,6661],[53,69,2832],[50,57,7923],[62,19,4013],[4,12,3535],[2,51,6397],[35,11,1343],[55,27,1292],[51,4,5130],[28,4,7760],[82,60,6463],[25,32,8530],[38,27,9993],[11,48,7655],[45,71,13],[29,55,3174],[31,57,8007],[34,46,1576],[42,65,1549],[7,66,4997],[15,53,1447],[28,12,4964],[60,42,9722],[65,74,6862],[53,5,3358],[32,3,5731],[4,57,8068],[79,20,889],[25,50,2443],[43,5,8358],[78,19,2715],[38,80,546],[39,21,2379],[79,14,3089],[74,68,9945],[60,39,4283],[44,20,5272],[63,62,6539],[42,22,6995],[22,51,2018],[72,59,276],[16,15,326],[47,63,9151],[48,72,1144],[51,78,7470],[50,23,2598],[21,45,334],[2,47,6055],[40,5,1345],[79,54,890],[62,12,7256],[53,71,7936],[46,18,3551],[41,37,5415],[81,72,2280],[27,22,8819],[41,20,8643],[5,63,1901],[33,67,7396],[18,82,8830],[36,55,2935],[44,21,9317],[8,48,4536],[48,5,3513],[23,75,566],[81,44,4758],[43,25,5043],[45,40,6282],[3,51,7313],[4,31,7367],[82,53,8887],[27,15,5143],[9,24,8743],[30,13,3570],[60,12,4184],[42,21,8421],[10,67,5780],[20,41,8537],[8,80,3545],[51,46,866],[26,62,115],[26,13,8108],[14,54,8606],[76,10,3377],[80,78,2581],[2,9,9062],[67,39,3022],[58,9,783],[20,73,9593],[73,67,3964],[65,80,4897],[75,23,5160],[81,3,7258],[15,57,4406],[43,10,5205],[63,2,4064],[20,52,8183],[46,77,8066],[12,78,6592],[46,26,1098],[12,14,9594],[21,65,2925],[81,37,389],[61,78,6874],[41,64,2937],[26,70,9568],[17,9,4675],[48,43,970],[59,20,3504],[65,26,7875],[19,32,8309],[16,29,3063],[82,34,1858],[2,38,9619],[12,53,2533],[78,80,2789],[28,33,748],[18,8,8725],[21,2,5441],[80,65,2115],[64,69,7301],[39,36,8027],[52,41,6592],[11,20,5480],[77,39,662],[3,43,1708],[34,60,3859],[50,82,8648],[63,28,7100],[30,24,7638],[45,73,4424],[45,9,5391],[0,27,7077],[6,38,7328],[5,49,2786],[57,25,7432],[64,9,7687],[26,28,1217],[64,45,5929],[37,59,9077],[66,39,8275],[29,58,4522],[25,16,3580],[67,69,2504],[72,36,9447],[73,69,5168],[60,27,3825],[15,51,22],[5,27,8688],[29,26,5823],[13,43,6284],[3,23,4649],[58,28,992],[27,34,673],[28,0,5889],[62,58,3371],[4,42,7325],[19,65,2108],[25,81,6084],[61,63,8533],[15,5,2431],[43,55,9341],[24,76,6461],[43,11,7689],[66,12,3144],[44,14,5058],[80,47,1324],[19,59,934],[44,35,1776],[64,29,6139],[64,13,3135],[3,4,205],[12,11,1158],[73,21,3336],[50,3,9909],[31,63,7203],[32,41,4284],[48,44,9254],[11,5,6661],[21,5,5082],[44,81,8225],[82,54,6565],[13,46,2962],[57,27,9010],[79,31,590],[48,11,1176],[0,20,693],[55,57,3545],[13,9,4759],[54,71,4741],[28,75,2029],[43,3,5474],[72,51,7154],[19,35,3704],[71,55,4328],[76,2,3878],[67,17,8082],[77,50,9641],[41,45,1330],[9,54,9099],[55,51,125],[57,31,9321],[53,35,3916],[31,43,9972],[43,72,3049],[16,49,9693],[49,38,8340],[80,40,5049],[45,31,4619],[79,29,3234],[76,32,2797],[29,69,2225],[34,79,4129],[78,49,9980],[50,17,4113],[31,71,8495],[46,34,1695],[23,5,8604],[3,58,6260],[38,78,3300],[54,47,2415],[50,44,8095],[46,61,3000],[6,9,8952],[0,64,9638],[8,81,6113],[23,33,7623],[65,53,9611],[75,78,693],[71,78,2684],[53,0,977],[29,19,8162],[27,25,8503],[35,13,7711],[61,3,9018],[57,55,2520],[36,37,5943],[80,11,8846],[57,53,6605],[3,9,8072],[62,8,3827],[1,63,7130],[74,41,1090],[38,34,1438],[70,34,2948],[29,23,9084],[55,8,8331],[13,57,100],[56,51,9981],[71,27,8387],[22,2,8960],[74,64,8622],[54,36,7909],[41,21,1171],[6,60,2470],[0,13,9374],[39,0,3503],[71,50,3149],[38,14,3120],[22,55,3191],[44,25,5924],[30,51,1579],[11,4,2999],[25,15,3858],[62,25,4151],[58,25,3432],[61,20,465],[3,12,4166],[52,16,9983],[6,29,7628],[39,16,553],[4,74,4105],[53,48,2156],[38,55,596],[78,16,6368],[6,18,3861],[27,45,9960],[6,34,4358],[20,65,1812],[72,81,6155],[78,27,9538],[34,47,6407],[36,35,8520],[37,5,957],[79,28,7205],[67,18,4796],[36,53,720],[18,16,1851],[6,28,7085],[30,64,7881],[9,60,4653],[63,20,9993],[31,66,5022],[26,39,5989],[66,42,8394],[76,40,4805],[56,40,6670],[11,42,5656],[25,27,7560],[50,48,399],[52,15,4729],[24,19,5484],[14,8,1496],[64,38,5288],[30,6,9152],[9,79,7395],[32,6,9525],[77,14,320],[38,48,2168],[1,57,6499],[25,70,6827],[82,77,8398],[29,46,4373],[52,29,2256],[60,77,7568],[21,60,9463],[69,76,8739],[18,47,9214],[8,11,438],[35,36,1702],[65,21,4612],[34,4,878],[8,31,9457],[39,78,5413],[66,53,4243],[43,79,8255],[62,30,1191],[61,70,2580],[17,76,5742],[28,40,8120],[34,76,8675],[13,78,9562],[56,34,1270],[6,49,3009],[71,34,3064],[11,59,6051],[5,41,7001],[42,1,303],[47,16,9143],[19,17,3644],[77,73,9635],[69,38,4509],[42,76,2559],[7,24,6222],[7,8,1985],[59,40,1873],[70,5,7325],[4,75,7568],[27,16,6543],[37,58,4814],[26,17,4555],[33,10,3374],[40,80,4924],[17,43,7453],[4,13,1660],[68,43,6524],[7,78,5059],[11,60,9490],[66,23,9556],[36,81,3936],[19,52,7874],[19,73,6807],[40,68,6731],[70,26,1582],[79,39,1079],[45,33,6050],[81,35,7153],[20,50,8448],[2,73,2341],[65,11,8711],[42,62,4610],[32,57,7297],[36,3,5384],[11,26,7340],[4,35,1319],[82,11,8260],[34,50,9251],[25,64,7107],[42,44,4057],[42,2,6807],[53,23,3921],[5,52,4944],[60,47,9400],[46,57,3550],[67,78,7234],[81,20,4454],[77,23,4874],[72,67,6691],[1,17,4573],[24,33,738],[41,38,7692],[36,64,8542],[57,39,1982],[71,36,7526],[79,33,5755],[73,81,3219],[75,58,5823],[27,36,9863],[7,17,6005],[35,24,4405],[10,51,2909],[41,60,1164],[31,56,2887],[40,30,5881],[5,57,1318],[45,47,4602],[0,59,4575],[64,17,6869],[73,43,6749],[46,31,4922],[47,52,5265],[6,62,3231],[32,81,258],[24,79,3272],[2,44,1893],[40,58,1669],[21,55,3423],[59,32,1149],[68,20,8559],[52,11,4474],[65,78,6757],[37,38,7937],[45,4,5139],[67,45,7972],[41,47,5328],[43,63,6797],[42,36,9356],[27,70,8074],[4,28,3321],[80,62,4411],[77,19,16],[49,77,1341],[66,70,6850],[28,29,1409],[49,73,3085],[7,79,9800],[64,53,449],[76,71,3468],[56,58,5658],[76,54,6827],[68,3,4172],[30,37,3201],[3,29,5055],[35,2,3694],[42,61,7773],[23,13,8215],[25,68,1135],[18,10,3881],[47,0,2316],[27,33,9263],[15,27,2824],[35,21,6739],[52,71,2015],[41,30,6185],[35,5,2077],[56,78,3448],[34,28,9557],[28,34,4364],[17,18,690],[58,62,5650],[20,27,1272],[44,13,2870],[10,70,7138],[62,76,3608],[10,73,4402],[62,61,3312],[14,2,6570],[82,7,9166],[43,75,9319],[71,59,2163],[81,74,6703],[77,45,1339],[16,71,735],[79,46,9050],[25,58,7631],[7,44,3587],[78,33,7602],[23,16,7968],[23,73,8758],[7,31,6340],[81,64,3342],[60,36,7475],[42,38,1955],[9,72,4789],[50,49,8078],[4,67,6324],[17,49,2515],[38,64,5952],[63,5,2203],[77,75,8429],[56,81,4451],[32,33,7873],[78,55,2524],[15,13,5810],[38,33,9813],[11,44,4783],[62,39,3835],[36,63,3837],[25,45,5028],[14,70,8067],[75,39,4561],[68,51,4957],[5,64,321],[62,51,7553],[77,24,5590],[33,68,9864],[71,58,426],[22,74,8416],[50,56,1572],[68,26,9627],[68,79,8797],[73,29,8304],[0,21,6632],[41,0,9816],[44,48,2416],[61,49,8956],[73,60,7710],[19,56,3919],[50,43,5896],[48,55,5286],[65,4,1836],[9,56,2456],[29,20,3215],[75,22,6942],[7,61,9726],[76,62,9737],[13,36,4605],[58,76,1620],[1,0,6426],[16,70,3089],[37,35,2006],[43,62,7242],[37,32,6926],[11,1,5409],[20,59,5471],[10,32,8948],[80,10,3987],[4,3,8755],[14,1,8948],[78,44,3458],[31,14,4041],[80,59,7761],[32,70,7700],[46,13,5049],[77,4,1651],[39,51,8522],[78,54,9416],[1,24,9848],[81,27,6074],[2,20,5091],[77,59,7146],[27,41,3987],[3,39,7940],[49,74,5226],[44,12,8785],[67,5,8381],[17,21,2565],[1,52,5107],[6,45,2246],[55,71,8726],[34,16,4414],[34,53,253],[4,70,1158],[82,8,4442],[6,70,9191],[6,81,6507],[4,69,94],[37,40,1055],[19,9,3736],[48,42,4476],[41,7,2480],[38,56,4691],[51,12,6172],[48,36,8753],[15,66,1214],[42,8,4947],[4,61,8708],[69,25,1976],[67,82,7370],[29,13,4447],[77,26,1783],[63,66,9122],[74,70,7345],[32,22,2018],[64,6,7352],[69,61,8118],[35,60,3018],[29,15,7674],[31,46,6849],[49,39,1800],[36,72,8686],[8,67,5294],[68,58,87],[74,18,8989],[70,37,3315],[28,61,8896],[30,50,3191],[24,63,5501],[63,58,3357],[40,50,8717],[69,17,6123],[65,41,242],[77,38,9775],[25,53,3959],[12,64,242],[29,35,7036],[5,75,1953],[24,2,5253],[66,52,3964],[14,53,4741],[45,52,1143],[51,62,1119],[66,46,5489],[66,33,6523],[39,4,7531],[65,79,6766],[48,47,8977],[43,46,8447],[23,79,8723],[69,23,1693],[51,64,7741],[17,68,2905],[9,28,3451],[9,46,4904],[42,51,7462],[58,1,1577],[56,28,6462],[2,23,1711],[20,51,1466],[44,58,5529],[3,38,379],[7,45,5978],[17,14,4833],[76,20,2460],[30,0,4536],[2,35,1939],[76,46,6001],[44,0,7476],[54,67,6793],[19,57,2152],[17,19,5938],[35,25,7194],[6,16,7175],[72,55,7709],[6,69,1527],[8,23,5789],[10,21,8572],[10,22,4274],[73,36,2043],[6,56,7548],[66,35,40],[29,28,2111],[55,14,8508],[31,38,4509],[35,45,6377],[9,51,6207],[11,51,4798],[3,48,7496],[61,66,6551],[56,46,1157],[61,14,2749],[75,31,6774],[57,67,6286],[11,23,5627],[21,49,1417],[78,29,6027],[24,57,3632],[24,32,4691],[48,65,9077],[30,10,6222],[81,50,6364],[60,7,3098],[39,44,2166],[50,68,8737],[25,72,1440],[31,70,2905],[52,26,560],[81,12,6018],[80,64,5784],[68,82,8715],[9,66,8514],[39,56,751],[0,57,1639],[56,39,4250],[33,66,1185],[56,29,6601],[33,9,8390],[70,76,6287],[50,34,6457],[29,44,3712],[18,80,1465],[50,25,7023],[32,1,4557],[31,52,8446],[42,13,9490],[45,75,937],[11,29,5701],[62,43,8856],[43,39,5693],[67,62,666],[44,38,5177],[27,30,609],[17,64,1222],[70,38,7152],[5,16,6072],[57,58,7690],[44,11,2790],[20,12,7392],[66,36,6706],[36,8,6285],[70,44,5380],[21,72,7580],[79,58,2078],[82,28,2976],[24,82,1533],[41,22,6545],[50,37,6561],[64,51,7689],[28,59,8172],[45,54,506],[39,48,3906],[54,80,330],[3,70,2454],[39,3,4729],[65,64,4699],[62,49,6601],[2,26,4551],[47,72,9324],[13,75,6614],[70,56,3826],[68,65,3899],[63,10,2603],[45,69,1516],[66,26,5966],[35,31,9395],[49,20,3924],[13,3,848],[70,9,6871],[68,69,5662],[37,81,2317],[71,8,8176],[7,74,1324],[51,36,7744],[22,32,6371],[15,35,2857],[59,27,1107],[18,65,3190],[6,54,8452],[61,19,4063],[54,45,1837],[80,32,5650],[74,19,4325],[53,73,7498],[2,31,9087],[41,2,1900],[74,77,234],[76,64,7383],[79,69,1418],[28,80,6484],[37,74,9344],[47,38,1806],[73,76,2925],[16,45,1972],[25,19,992],[46,36,7559],[62,20,9093],[50,15,995],[33,70,2937],[20,1,7588],[19,7,3327],[64,40,2],[41,10,6221],[43,7,807],[23,71,1787],[76,0,6663],[55,12,1445],[82,73,7391],[19,64,305],[14,43,2874],[14,4,3936],[81,82,2094],[14,78,8630],[78,36,9776],[80,23,4968],[52,27,2004],[57,45,4528],[76,73,6062],[54,16,5470],[45,19,3933],[44,76,490],[30,53,8067],[0,55,4009],[34,64,9962],[10,43,2832],[33,62,5323],[47,22,3001],[78,3,8046],[17,53,7771],[54,2,9477],[66,31,8986],[31,29,6264],[32,48,2068],[32,10,806],[71,69,572],[31,49,606],[58,38,4737],[5,38,6890],[35,65,5459],[75,9,2866],[8,18,8723],[22,44,8797],[11,58,8084],[64,80,2],[35,16,8024],[65,76,9177],[77,42,3449],[74,63,1248],[10,27,9223],[65,67,2853],[21,17,8610],[41,55,4257],[3,72,920],[68,6,9502],[1,81,5973],[61,12,6482],[30,41,9093],[47,49,3217],[81,59,6912],[21,1,937],[56,62,8704],[39,59,8401],[38,66,9604],[4,11,212],[2,76,8878],[5,31,4566],[68,80,4788],[13,44,935],[46,64,6619],[27,75,1650],[43,78,6855],[9,37,487],[14,73,5908],[21,78,4346],[21,32,6027],[8,32,9722],[80,8,8389],[69,19,6321],[62,29,1785],[1,77,6931],[10,9,9453],[68,71,5800],[37,27,2605],[24,78,1050],[65,63,3488],[32,34,475],[77,63,6957],[17,79,4788],[45,8,6068],[27,60,9122],[43,17,2662],[41,9,463],[6,42,4939],[68,40,8754],[19,81,5395],[82,15,2487],[15,38,6175],[47,67,9323],[63,54,4596],[64,0,3303],[53,3,2977],[50,26,6263],[29,34,7404],[36,82,4670],[60,0,3866],[19,66,5119],[11,53,1987],[9,0,2555],[22,1,1255],[57,82,674],[62,69,7991],[67,60,8625],[36,51,6874],[59,5,4908],[1,76,2821],[5,81,1208],[63,14,5052],[25,65,2863],[20,39,8569],[74,59,267],[10,1,7023],[71,16,6027],[59,15,1325],[44,61,1354],[36,42,3159],[74,30,6502],[22,80,7439],[60,1,6404],[41,25,8317],[76,78,9934],[35,10,5075],[5,26,9676],[11,69,3014],[15,48,7820],[52,9,332],[26,4,9154],[11,16,5610],[73,39,3535],[36,57,7223],[49,46,9435],[63,48,5075],[55,59,6488],[13,8,3816],[61,74,980],[46,16,3774],[37,15,2469],[22,62,5990],[59,56,3301],[19,14,4682],[24,77,5546],[55,44,9679],[55,41,3344],[76,34,3484],[36,4,602],[71,63,1252],[8,2,4745],[29,62,4542],[58,46,8433],[80,41,9922],[3,57,8025],[19,30,3243],[19,2,3060],[6,82,8079],[19,63,3595],[22,42,5620],[12,17,9741],[17,36,3242],[2,52,4851],[52,57,1435],[58,43,4595],[70,15,9747],[28,73,5270],[25,82,8995],[48,12,6954],[58,40,8934],[4,49,3923],[77,8,8717],[4,34,7910],[82,9,5583],[70,49,9684],[37,65,1001],[2,77,965],[45,53,8679],[76,58,1241],[3,37,8355],[59,10,184],[51,19,491],[82,41,3513],[47,53,4384],[8,35,8972],[0,17,4713],[30,75,3086],[8,21,8585],[73,44,8376],[21,54,2274],[7,54,484],[60,38,2520],[7,67,6347],[63,36,9161],[79,63,7832],[54,42,4098],[19,75,1193],[29,10,9947],[5,69,6839],[63,71,4395],[21,43,2699],[10,36,4],[70,47,2514],[53,63,4430],[19,58,6101],[10,71,2496],[52,46,862],[74,22,5949],[16,75,1677],[21,61,7696],[52,51,8101],[75,3,8520],[65,20,4572],[75,68,7294],[67,56,3578],[38,72,2220],[60,11,4562],[30,49,1107],[43,49,9509],[75,15,8997],[11,74,7942],[14,67,2281],[80,39,8586],[80,71,3950],[68,16,3010],[81,16,7138],[15,39,738],[30,76,8207],[56,30,4584],[60,56,1497],[14,45,7976],[80,31,1896],[7,35,7359],[55,29,3169],[48,4,4192],[30,65,5103],[44,52,1833],[46,73,3779],[65,73,9253],[13,14,4885],[2,49,3719],[54,27,3219],[51,40,957],[1,40,783],[82,79,719],[78,79,1890],[66,50,5580],[33,2,8385],[11,79,9053],[32,72,2153],[21,19,8861],[5,13,945],[32,38,8155],[60,24,7510],[26,64,9340],[76,56,9733],[34,74,5371],[81,32,7723],[31,0,6022],[31,18,1831],[21,15,2825],[32,66,7052],[14,34,5884],[49,18,4525],[69,34,3892],[35,27,1170],[64,39,6569],[34,38,6049],[61,38,1371],[16,12,6393],[42,53,5273],[14,7,5086],[55,32,1713],[63,8,204],[81,15,9635],[33,60,3232],[49,2,1434],[31,10,2522],[17,52,4008],[9,32,7425],[51,33,9255],[74,75,8001],[29,40,4293],[47,15,1281],[37,48,673],[81,70,9268],[49,80,2886],[34,82,9134],[74,17,7858],[45,56,4065],[79,15,9222],[29,68,2738],[60,55,4973],[75,55,8973],[61,18,7800],[55,48,5335],[23,36,7510],[53,39,8759],[51,60,5832],[60,68,9603],[25,14,9463],[45,49,402],[68,0,8566],[40,23,7341],[35,56,3200],[59,31,8508],[49,15,9647],[55,11,4746],[26,49,4808],[59,0,7146],[55,79,8070],[15,32,2735],[76,66,1743],[32,12,1530],[43,71,6185],[42,14,2038],[17,71,1147],[74,14,7485],[7,69,4321],[15,26,3622],[16,41,1532],[50,66,6268],[44,79,2553],[65,9,8869],[14,80,8023],[14,64,7273],[78,31,9940],[34,62,9720],[36,14,4454],[82,44,6109],[82,46,4713],[21,22,4115],[56,79,3002],[7,36,5886],[27,12,3082],[10,11,4277],[74,25,9139],[2,65,8851],[60,59,2398],[57,41,9701],[75,46,4806],[34,0,228],[39,1,7977],[7,18,4992],[17,10,2753],[7,65,4625],[8,58,1074],[30,17,7292],[18,19,7288],[44,66,8366],[79,9,4207],[53,16,5099],[75,41,951],[1,78,1289],[0,52,765],[18,13,2323],[58,52,4880],[65,10,996],[40,10,2697],[7,33,6611],[58,81,2800],[43,74,7326],[5,78,7711],[68,37,4539],[11,22,7399],[72,29,2560],[65,52,3627],[69,31,9541],[27,59,7013],[20,17,7843],[44,78,7583],[79,6,4783],[15,64,1994],[13,77,7658],[56,43,1819],[17,22,896],[72,44,9933],[21,52,8599],[42,77,2083],[48,50,2564],[29,71,6167],[9,23,4750],[36,20,3085],[2,72,5331],[20,23,7957],[5,45,3911],[55,7,9584],[72,41,7278],[26,27,5056],[68,54,4897],[62,32,1972],[20,79,7206],[58,22,7574],[17,66,1755],[45,80,5383],[60,13,6484],[59,39,9691],[60,76,843],[42,75,4518],[37,28,270],[26,30,6918],[29,47,622],[28,53,9699],[27,52,6959],[38,69,3075],[74,80,1668],[28,60,5894],[21,64,2063],[26,79,5646],[31,9,5685],[58,5,9554],[43,73,2027],[38,71,9204],[47,61,8094],[0,2,275],[5,39,6253],[53,65,674],[40,8,124],[74,21,6143],[1,12,425],[65,77,2047],[67,63,4064],[72,7,7871],[76,61,1487],[20,18,1579],[52,80,9329],[1,34,6938],[38,50,4623],[58,23,7752],[72,34,7641],[68,64,3647],[31,26,8780],[0,5,3035],[4,53,1183],[38,68,7975],[34,31,5400],[45,70,5985],[10,25,161],[33,39,6718],[13,11,9591],[76,27,6188],[75,20,5870],[7,5,8895],[31,55,8067],[22,16,7815],[62,44,1832],[58,64,5472],[42,72,7483],[74,31,8999],[36,40,7071],[18,37,6560],[48,38,1595],[77,79,5628],[19,48,1614],[35,55,8881],[1,59,2572],[8,49,2955],[62,80,4479],[23,45,308],[67,13,8568],[6,61,6652],[80,18,2985],[79,30,9552],[48,29,3581],[82,63,3490],[60,45,3887],[64,50,748],[22,52,3440],[45,1,8408],[41,66,9569],[26,42,9677],[64,35,2626],[30,14,4425],[64,15,7533],[6,59,3005],[57,8,7411],[29,30,1420],[36,24,2231],[21,44,1656],[48,6,6940],[40,48,1770],[38,20,5556],[41,74,1639],[35,22,4218],[68,56,6664],[75,77,5201],[17,65,3222],[82,78,2306],[68,78,2022],[68,52,8022],[54,50,2988],[79,50,4806],[37,57,6037],[27,43,7331],[16,63,8389],[36,75,9784],[15,25,6889],[47,68,5653],[17,27,6562],[43,81,131],[67,10,7732],[12,67,344],[60,49,6951],[21,3,2350],[52,74,4287],[63,12,7463],[26,55,6735],[15,52,9244],[71,4,4189],[79,27,8712],[38,16,2727],[23,56,7261],[76,63,5591],[79,34,8527],[76,45,2469],[2,30,2856],[43,28,8010],[55,80,100],[81,39,2985],[73,54,9880],[15,73,5247],[81,43,8452],[28,27,6097],[55,45,3755],[64,21,3067],[14,32,7962],[49,41,260],[28,48,8593],[23,59,6759],[45,62,8315],[16,82,4948],[44,2,4899],[74,13,5449],[60,61,9094],[61,64,4928],[77,76,4029],[39,57,5428],[78,45,3704],[71,23,1223],[24,15,870],[5,46,7197],[4,7,146],[13,79,2654],[61,34,7345],[57,59,887],[11,38,2124],[33,82,6520],[16,56,7283],[44,16,5481],[67,44,2701],[79,1,533],[36,58,4957],[68,14,8562],[58,2,1218],[50,28,3585],[28,18,5666],[77,56,6279],[17,51,6711],[6,19,2968],[56,32,6154],[47,2,8654],[26,68,7343],[23,41,2313],[38,54,6626],[55,62,6133],[42,68,312],[78,26,6222],[48,67,1963],[18,9,7868],[36,32,6218],[11,76,2844],[23,39,5213],[14,72,8127],[23,43,1785],[43,60,8073],[50,13,3629],[1,5,6263],[19,4,5881],[37,68,2867],[43,68,2947],[48,66,5672],[28,26,1461],[35,33,5877],[34,43,7413],[64,12,9139],[5,18,6294],[8,73,802],[14,33,2507],[17,62,8229],[36,48,3185],[78,58,3434],[57,52,4718],[43,59,6659],[67,55,6301],[44,43,2817],[40,11,9180],[3,6,2246],[2,41,4005],[12,66,2376],[63,53,3784],[30,27,4740],[24,71,9361],[69,47,7710],[39,30,1005],[19,68,8556],[38,79,9858],[42,16,9418],[15,11,1406],[47,54,1901],[46,22,7824],[31,53,5277],[4,64,9555],[37,70,3538],[32,26,6545],[59,80,8418],[50,81,2656],[35,49,6385],[35,9,6984],[16,1,3560],[53,62,2438],[13,45,2439],[48,21,3413],[69,2,2059],[50,60,6231],[2,27,8301],[82,26,2991],[61,37,3491],[15,7,2235],[28,58,7189],[24,74,6297],[79,22,4067],[20,53,6708],[46,24,6476],[53,19,2049],[69,58,1833],[22,79,2058],[48,58,1715],[36,19,9732],[72,80,4570],[9,43,5447],[19,5,2095],[17,50,921],[18,40,9227],[8,62,3422],[11,54,3961],[64,65,1042],[41,3,6471],[40,7,2623],[21,38,4537],[7,82,5706],[79,45,3884],[24,81,5160],[1,22,1463],[79,76,287],[14,29,4788],[65,44,9108],[4,20,2491],[14,38,6476],[56,5,3858],[45,35,6424],[75,13,4922],[82,76,468],[79,77,5419],[9,78,8001],[9,1,3564],[0,53,5211],[12,75,8741],[31,21,2218],[28,22,655],[29,51,9791],[59,82,8473],[38,49,5867],[75,24,8801],[33,81,5029],[55,17,2351],[12,39,2797],[57,73,5191],[74,69,8448],[41,49,9945],[5,44,7546],[39,33,3337],[39,62,7244],[71,6,4338],[77,64,636],[58,42,7451],[13,28,5898],[21,14,2608],[9,5,1738],[15,24,3050],[76,81,8214],[5,15,4073],[54,31,1069],[33,43,9548],[31,67,9462],[1,69,6167],[73,55,536],[24,7,7683],[41,32,4968],[25,62,8292],[47,37,3538],[44,32,3251],[79,52,8399],[38,21,7740],[46,25,2329],[61,33,6347],[28,79,8722],[61,40,6125],[39,12,6160],[68,67,1538],[7,43,1137],[60,43,3695],[5,23,5643],[68,30,5871],[43,61,9956],[12,71,8050],[48,75,6752],[0,81,2048],[9,55,9274],[19,22,5083],[37,54,8472],[37,36,5516],[21,24,4],[34,14,3016]
  ],
  src: 82,
  dst: 19,
  K: 81,
};
expected = 2119;
test(func, input, expected, testNum, lowestTest, highestTest);