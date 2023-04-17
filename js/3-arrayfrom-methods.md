# Array.from() 好用的三種方法

## Array.from() 是甚麼
Array.from 可以將很像陣列的物件轉換成一個真正的新陣列，像是參數物件 arguments、DOM 元素集合或字串。

語法為:
```js
Array.from(arrayLike, mapFn, thisArg)
```
* arrayLike: 類陣列
* mapFn: 在每個元素上調用的函數
* thisArg: mapFn 執行時的 this 對象

舉例來說:
```js
let arr1 = [1, 2, 3];
Array.from(arr1, (val) => val + 1) // [2, 3, 4]
```

### 為甚麼要轉換成真正的陣列？
因為這些類似陣列的物件沒有陣列的一些方法，例如 reverse()、map()...等等，當我們需要使用這些方法時就可以用 Array.from() 來轉換，比如:

```html
<div>0</div>
<div>0</div>
<div>0</div>
<div>0</div>
<div>0</div>

<script>
const divs = document.querySelectorAll('div');
divs.forEach((div, i) => div.innerHTML = i); 
// 在舊版瀏覽器會報錯
// 因為 divs 並不是真正的陣列，沒有 forEach 方法
</script>

```
這樣的寫法會在舊版的瀏覽器報錯，因為 divs 並不是真正的陣列，沒有 forEach 方法，所以要先將 divs 轉換成陣列。

註:這個問題在新版瀏覽器中解決了，可以使用 `forEach()`，不過仍然沒有其它陣列的方法可以使用。
```js
const divs = document.querySelectorAll('div');
Array.from(divs).forEach((div, i) => div.innerHTML = i); 
```
這樣寫就不會有問題。

## 1. 陣列去重
有時候我們想把陣列裡重複的值去掉，這時候就可以搭配 Set 來實現。

(Set 是集合的意思，可以把它想像成不能重複元素的陣列)

```js
function uniqueArr(array) {
  return Array.from(new Set(array));
}

uniqueArr([1, 1, 2, 3, 3]); // => [1, 2, 3]
```

## 2. 深淺拷貝陣列
有時候我們需要複製一個陣列，也可以使用 `Array.from()`
```js
let arr1 = [1, 2, 3];
let arr2 = Array.from(arr1);
```
但若只是這樣，也可以使用 `arr2 = [...arr1]` 做到一樣的效果， Array.from() 更厲害的地方是可以用來製作深拷貝:

```js
function deepCopyArr(val) {
    return Array.isArray(val) 
      ? Array.from(val, deepCopyArr) 
      : val;
}

const numbers = [[0, 1, 2], ['one', 'two', 'three']];
const numbersClone = deepCopyArr(numbers);

console.log(numbersClone); 
// [[0, 1, 2], ['one', 'two', 'three']]

numbers[0] === numbersClone[0] // false
```
判斷 val 是否為陣列，不是的話直接返回，是的話用 `Array.from()` 複製一份，並對每個元素都執行一遍 `deepCopyArr()` 函式。 
若元素還是一個陣列，就會在用 `Array.from()` 複製一份，這樣就達到深拷貝的效果了。

## 3. 將物件填入陣列
利用 `Array.from()` 可以製作一個指定長度的陣列，並填充指定的內容給每個元素，例如:
```js
let arr = Array.from({length: 3}, () => 0) // [0, 0, 0]
```
這樣的場景也可以使用 `fill()` 代替，語法上更容易理解
```js
let arr = Array(3).fill(0) // [0, 0, 0]
```

不過若是當陣列中，每個填充物是物件時，使用 `Array.from()` 是更好的做法:
```js
const resultA = Array.from({ length: 3 }, () => ({}));
const resultB = Array(3).fill({});

console.log(resultA); // [{}, {}, {}]
console.log(resultB); // [{}, {}, {}]

resultA[0] === resultA[1]; // false
resultB[0] === resultB[1]; // true
```
會這樣是因為使用 `fill()` 方法創建的 resultB，會使用相同的空物件進行初始化，所以每個物件的指向會是一樣的。


## 小結
今天介紹了 `Array.from` 的用法和應用，他可以將類陣列轉換成真正的陣列，搭配上 set 也可以陣列去重，利用遞迴也可以做深拷貝。

我個人覺得這兩個方法都很實用，你覺得呢？