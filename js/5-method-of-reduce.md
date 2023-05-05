# reduce 五種好用的用法

## reduce 是什麼
reduce() 是陣列的一種方法，它會針對每個元素做計算或處理，並把每個計算的結果加在一起後回傳。

reduce() 可以接受兩個參數
1. 回調函式
2. 初始值

而回調函數又可以接受四個參數
1. 累加值 (累加器)
2. 當前元素的值
3. 當前元素的索引
4. 數組本身

語法為:
```js
const arr = [1, 2, 3];
const initValue = 0;
arr.reduce((total, value, index, array) => {
  // your code
}, initValue)
```

直接來看用法吧：

## 1. 求和和乘法
這是 `reduce()` 最常見的用法，除了返回數字外，也可以對字串做拼接來返回字串:
```js
function Accumulation(...vals) {
    return vals.reduce((total, value) => total + value, 0);
}

function Multiplication(...vals) {
    return vals.reduce((total, value) => total + value, 1);
}

Accumulation(1, 2, 3, 4, 5); // 15
Multiplication(1, 2, 3, 4, 5); // 120
```
可以看出第一個參數是一個函式，函式裡的參數: `total` 就是總共的值，`value` 是當前元素的值; `reduce()` 第二個參數是 `total` 的初始值。

所以簡單說 `Accumulation()` 會將每個元素跑一遍，並把每個元素執行 `total + value` 這個運算，且 total 的初始值是 0。

## 2. 陣列分割
有時候我們想把一個陣列分割成多個陣列，就可以這樣使用:
```js
function chunk(array = [], chunkSize = 1) {
  if (array.length === 0) return []

  // 使用 reduce 方法來拆分數組，total 為累加器，value 為當前元素
  return array.reduce((total, value) => {
    // 如果當前子數組已滿，則創建一個新的空子數組
    const childIndex = total.length - 1;
    if (total[childIndex].length === chunkSize) {
      total.push([value]);
    } else {
    // 否則直接將當前元素添加到最後一個子數組中
      total[childIndex].push(value);
    }
      return total;
  }, [[]]);
  // 初始值為二維陣列
}

const arr = [1, 2, 3, 4, 5];
chunk(arr, 2); // [[1, 2], [3, 4], [5]]
```
如果我們想將一個陣列平分成多個陣列，`reduce` 就很適合這種比較複雜的陣列運算。

以下為簡化版:
```js
function chunk(arr = [], size = 1) {
    return 
      arr.length ? arr.reduce((total, value) => (total[total.length - 1].length === size ? total.push([value]) : total[total.length - 1].push(value), total), [[]]) : [];
}
```

## 3. 求最大最小值
若是一般的陣列要比大小可以用更簡單的 `Math.max()`:
```js
const arr = [1, 2, 3, 4, 5];
Math.max(...arr) // 5
```
但若陣列裡面的元素是物件，我們想根據指定的屬性來比大小，就可以使用 `reduce`

```js
function findMaxByProp(arr, prop) {
  return arr.reduce((total, value) => {
    // 如果累加器為空，則直接將當前元素賦值給累加器
    if (!total) {
      total = value;
      return total;
    }
    // 如果累加器中的屬性值小於當前元素中的屬性值
    // 則將當前元素賦值給累加器
    if (total[prop] < value[prop]) {
      total = value;
      return total;
    }
    return total;
  }, null);
}

const testArr = [{ age: 20 }, { age: 21 }, { age: 22 }];

findMaxByProp(testArr, "age"); // { age: 22 }
```

## 4. 陣列扁平化
若我們希望把多維陣列變成一維陣列，也可以使用 reduce

```js
function flattenArray(arr = []) {
  return arr.reduce((total, value) => {
    if (Array.isArray(value)) {
      // 如果當前元素是一個陣列
      // 則遞迴調用 flattenArray 函式，將它展開成一個一維陣列
      total = total.concat(flattenArray(value));
    } else {
      // 如果當前元素不是一個陣列，則將它直接添加到 total 中
      total.push(value);
    }
    return total;
  }, []);
}

const arr = 
  [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
console.log(flattenArray(arr)); 
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
簡化版:
```js
function flattenArray(arr = []) {
    return arr.reduce((total, value) => total.concat(Array.isArray(value) ? flattenArray(value) : value), [])
}
```


## 5. 陣列成員特性分組
有時候我們要將陣列裡的物件依照屬性來分類，就可以使用:
```js
function groupBy(arr = [], key) {
  // 如果沒有指定 key，則直接回傳一個空物件
  if (!key) {
    return {};
  }
  // 初始值設為空物件 {}
  return arr.reduce((grouped, item) => {
    // 取出當前元素的 key 值
    const keyValue = item[key];
    // 如果該 key 尚未被建立，則建立一個空陣列
    if (!grouped[keyValue]) {
      grouped[keyValue] = [];
    }
    // 將元素加入對應的陣列
    grouped[keyValue].push(item);
    // 回傳累加器
    return grouped;
  }, {});
}

const arr = [
  { area: "A", name: "Jack", age: 27 },
  { area: "A", name: "Rose", age: 25 },
  { area: "B", name: "Jason", age: 23 },
  { area: "C", name: "David", age: 21 },
  { area: "B", name: "Kevin", age: 19 }
]; 
groupBy(arr, "area"); 
// { A: Array(2), B: Array(2), C: Array(1) }
```

簡化版:
```js
function groupBy(arr = [], key) {
    return key ? arr.reduce((total, val) => (!total[val[key]] && (total[val[key]] = []), total[val[key]].push(val), total),  {}) : {};
}
```
在這個回調函式中，使用了逗號運算子將多個操作合併到一個表達式中，這已可以執行多個操作。包括：

1. 檢查 `total[val[key]]` 是否為假（即 undefined、null、0、空字符串等），如果是，則將它賦值為一個空陣列（[]）。
2. 將 val 加入 `total[val[key]]` 中。
4. 返回更新後的 total 物件。

## 小結
`reduce()` 是很強的方法，它可以寫出其他陣列的方法，例如 `forEach`、`map`、`filter` 的功能，但我覺得不用硬去取代其他陣列的方法，`reduce()` 的優勢是返回的值不限於函數，可以是數字、字串、物件...等等，所以非常靈活，希望這篇文章能幫助你學習 `reduce()` 的用法。

今天就這樣，下次見！