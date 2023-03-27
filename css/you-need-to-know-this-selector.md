# 你不能不知道的 5 種 CSS 選擇器用法
## 前言
相信 CSS 選擇器對寫網頁的人都不陌生，除了常用的 `:hover`、`:actived`、`::after` 之外，還有其它超很好用的 CSS 選擇器，用的好的話甚至可以取代部份的 JS 程式碼，今天我就整理了 5 個我覺得一定要知道的選擇器用法給你:

## 1. child
第一種是 child 家族，他可以選中特定的子元素，常用的用法有下面幾種
1. first-child / last-child: first-child / last-child: 選出第一個或最後一個子元素
2. nth-child(n): 選出第 n 個子元素
3. only-child: 只有一個子元素時


### first-child / last-child
如果我們想針對第一個或最後一個子元素做選取時，可以使用這個選擇器，比如我想更改第一個 p 的顏色
```html
 <div>
    <p>first paragraph</p>
    <p>second paragraph</p>
    <p>third paragraph</p>
    <p>fourth paragraph</p>
    <p>fifth paragraph</p>
    <p>sixth paragraph</p>
    <p>seventh paragraph</p>
  </div>
```
```css
a {
  color: lightpink;
}
```
```css
div p:first-child {
  color: lightblue;
}
```

或是更改最後一個 p 的顏色
```css
div p:last-child {
  color: lightgreen;
}
```

這個選擇器在列表時非常有用，比如我們希望在每個 p 之間都加一條分隔線
```css
div > p {
  border-bottom: 1px solid gray
}
```
但會發現最後一個元素下面也會有分隔線，這樣蠻突兀的，此時就可以用 last-child 來改變樣式
```css
div p:last-child {
  border: none
}
```
### nth-child
有時候我們會想針對中間的子元素去做選取，比如說我想選取第四個子元素，就可以使用 `:nth-child(4)`
```css
div p:nth-child(4) {
  color: lightgreen
}
```

也可以用 3n 這種特殊的作法來獲取第 3、6、9...個子元素
```css
div p:nth-child(3n) {
  color: lightgreen
}
```
當然也可以更進階的使用 `3n+1` 獲取第 4、7、10...個子元素
```css
div p:nth-child(3n+1) {
  color: lightgreen
}
```
如果想要獲取奇數或使偶數個子元素，可以使用 css 內建的 `odd`、`even`
```css 
div p:nth-child(odd) {
  color: lightgreen
}
```
### only-child 
這個選擇器比較特別，只有一個子元素時才會被選取
```html
<div>
  <p>first paragraph</p>
</div>
```
```css
div p:only-child {
  color: orange
}
```

### child 的侷限
雖然 child 好用，不過若子元素有多個類型時，選取就會變得很複雜，比如說
```html
 <div>
    <p>first paragraph</p>
    <p>second paragraph</p>
    <p>third paragraph</p>
    <a>first link</a>
    <p>fourth paragraph</p>
    <p>fifth paragraph</p>
    <p>sixth paragraph</p>
    <p>seventh paragraph</p>
  </div>
```
```css
div p:nth-child(4) {
  color: lightgreen
}
```
會發現沒有效果，是因為第四個子元素類型是 `a`，而不是 `p`，解決辦法有兩個，第一種是不要選取特定的子元素 `div :nth-child(4)`，第二種是直接用 `nth-of-type()`，也就是接下來要說的 

## 2. of-type
type 家族和 child 家族有點類似，差別在於 child 不會區分元素的類型，type 可以針對元素類型來做選取，和 child 一樣有三種用法:
1. first-of-type / last-of-type
2. nth-of-type
3. only-of-type

我們稍微更改 html 樣式
```html
    <div>
      <p>first paragraph</p>
      <p>second paragraph</p>
      <a href="#">first link</a>
      <p>third paragraph</p>
      <p>fourth paragraph</p>
      <a href="#">second link</a>
      <p>fifth paragraph</p>
    </div>
```

### first-of-type / last-of-type
如果我們想要選取第一個 a 元素，就可以使用 first-of-type
```css
div a:first-of-type {
  color: lightgreen
}
```

### nth-of-type 
```css
div p:nth-of-type(2n) {
  color: lightgreen
}
```

### only-of-type

## 3. :is
:is 可以一次組合多種選擇器，有點類似 `,` (逗號) 的功能
```css
:is(h1, h2, h3)::before {
  content: '👉'
}
```
等於
```css
h1::before, h2::before, h3::before {
  content: '👉'
}
```

特別的是，這種選擇器也可以搭配其它選擇器做出各種變化，這在選擇器非常長的情況下，相當好用，例如  
```css
form ul li input:is(:hover, :focus) {
  color: lightgreen
}
```
## 4. :not
:not() 可以選取不符合的元素，比如說我們可以這樣來選取不是 `p` 的元素
```css
div:not(p) {
  color: lightgreen
}
```
或是可以這樣來不選取特定的元素
```html
<div>
  <p>first paragraph</p>
  <p>second paragraph</p>
  <p class="p3">third paragraph</p>
  <p>fourth paragraph</p>
</div>
```

```css
div p:not(.p3) {
  color: lightgreen;
}
```
搭配 `:last-child` 也可以做出前面提到的分隔線效果
```css
div > :not(:last-child) {

}
```

## 5. :has
`:has` 是超強的選擇器，他可以用來判斷符不符合括號裡面的情況，比如說
```css
div:has(a) {
  border: 1px solid white
}
```
如果 `div` 裡有 `a` 就增加 border

我們甚至可以用來當作父選取器，比如當 a 被 hover 時，增加 div 的 border
```css
div:has(a:hover) {
  border: 1px solid white
}
```
善用 `has` 可以做到許多意想不到的效果喔

##　補充 [屬性]