# 如何有效減少 if else 

## 前言
每次寫程式碼最討厭看到一大串的 if else，所以就想記錄如何減少 if else 的使用  
不過並不是說 if else 不好，而是可以根據情況去選擇相應的寫法

## 1. JS 的 `||(or)` 和 `&& (and)` 運算子
JS 裡的
* `||` 返回第一個不為空的值，若都為空則返回最後一個值
* `&&` 返回第一個為空的值，若都不為空則返回最後一個值
於是我們可以把下面這個
```js
let c;
if(a) {
  c = a;
} else {
  a = b
}
```
改寫成
```js
let c = a || b
```
而這個
```js
let c;
if(!a) {
  c = a;
} else {
  c = b;
}
```
可以寫成
```js
let c = a && b;
```

## 三元運算子
我個人很喜歡三元運算子，但只推薦一層的三元運算子，之前寫 codewar 的題目，看過有人用了超多層，雖然他一行寫完答案，但超難理解

三元運算子的寫法為
1. 問號前面放判斷
2. 問號後面前半部分返回 `true` 的情況；後半部分返回 `false` 的情況
```JS
let result = (isSuccess) {
  if(isSuccess) {
    return 'Yes' 
  } else {
    return 'No'
  }
}
// 改寫成

let result = isSuccess ? 'Yes' : 'No';
```
## switch case
邏輯運算子和三元運算子在簡單的情況下都蠻好用的，但如果情況比較複雜的話就可以考慮用 `switch`
```js
let type = 'A'

if (type === 'A' || type === 'B') {
    console.log(1);
} else if (type === 'C') {
    console.log(2);
} else if(type === 'D') {
    console.log(3);
} else {
    console.log(0)
}

// 改寫成
switch (type) {
    case 'A':
    case 'B':
        console.log(1)
        break
    case 'C':
        console.log(2)
        break
    case 'D':
        console.log(3);
        break;
    default:
        console.log(0)
}
```
不過 switch 寫起來我覺得蠻麻煩的　
　
且在更複雜的情況時，`if-else`可能更易閱讀，所以還是要看情況。

## 物件配置法 / 策略模式
若不想用 `switch` 可以試試用物件的方式來表示情況
```js
let type = 'A'

let tactics = {
    'A': 1,
    'B': 1,
    'C': 2,
    'D': 3,
    default: 0
}
console.log(tactics[type]) // 1
```
這樣的好處是易於維護、修改  
舉個例子：
有個購物網站給各種會員打的折扣不一樣，就可以這樣去寫

```js
const getDiscount = (memberLevel) => {
  let discounts = {
    '普通會員': 0.9,
    '年費會員': 0.85,
    'VIP會員': 0.75,
    'default': 1
  }
  return discounts[memberLevel] || discounts['default'];
}
```
當然也可以用 `Map` 去管理
```js
const getDiscount = (memberLevel) => {
  let discounts = new Map([
    ['普通會員', 0.9],
    ['年費會員', 0.85],
    ['VIP會員', 0.75],
    ['default', 1],
  ])
  return discounts.get(memberLevel) || discounts.get('default');
}
```

## 結尾
這裡提供幾種可以代替`if-else`的方法  
我覺得在適合的情況用出適合的寫法才是最好的  
有時候 `if-else` 就是比較直觀　　

### 後記
後來在網路上看到很多網友說公司是看程式碼的多寡判斷有沒有做事的，所以瘋狂寫 `if-else`

也有人說你的程式碼可讀性越高，隨便來個人就看得懂，老闆大概率會覺得你替代性高，如果你的程式碼有些問題且只有你能解決的時候，你就是獨一無二的存在了  

看到這些問題我也蠻無言的，就看你是為了自己學習，還是為了別人學習吧。
 
記得之前大學的時候幫學校維護網頁， 那個程式碼一打開來幾千行，一個函數幾百行，命名完全看不懂，每次打開程式碼都很痛苦完全不想看，結果做半年就被換掉了，我個人覺得是因為沒甚麼產出的關係(雖然他說只要有問題時在維護就好)，希望以後不會遇到這樣的工作了。  

不過我覺得我學習這些是為了自己的實力，可以有更多選擇，如果因為上面的理由就不學習，那永遠只能待在同一個地方，一起加油吧！