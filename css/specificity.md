此篇筆記也寫在我的[部落格](https://thisweb.tech/css-specificity/)中

# CSS 選擇器的優先級、權重 specificity

不知道你有沒有發生這種事情，你寫的 CSS 樣式沒有生效，於是就加上個 `!important` 搞定一切，但為什麼有時候寫的 CSS 樣是沒有效果呢，是因為優先級 specificity 的關係，今天我們就來看看 CSS 優先級，以後就不要一直加 `!important` 了。

## CSS 選擇器優先級順序
在 CSS 中優先級可以分成 0 ~ 5 共 6 個等級，數字越大的優先級越大，比如說 `!important` 就是 5 級優先級，所以他可以覆蓋所有的選擇器:
* 0 級: 通配選擇器、選擇符、邏輯偽類  
  * 通配選擇器寫作星號 `*`，功用是一次選取全部的元素
  * 選擇符是指 `+ > ~ 空格` 等等
  * 邏輯偽類是指 `:not()、:is()` 等等
  0 級優先級代表它不影響優先級順序

* 1 級: 元素選擇器，例如
```css
p {
  color: red;
}
```

* 2 級: 類選擇器、屬性選擇器、偽類
```css
.btn {
  color: blue;
}

[href] {
  color: red;
}

:hover {
  color: blue
}
```

* 3 級: ID 選擇器
```css
#myBtn {
  color: green;
}
```

* 4 級: inline style，就是在 HTML 標籤直接寫 style
```html
<button style="color: blue">click</button>
```

* 5 級: `!important`
基本上我們不會使用 `!important` ，因為它會造成維護的困難。

我來舉個例子讓你更了解優先級的概念:
```html
<p class="class-p" id="id-p">一段文字</p>

<style>

#id-p {
  color: red;
}

.class-p {
  color: blue;
}

p {
  color: green;
}

</style>
```
你覺得字是什麼顏色的呢？

答案是紅色喔，因為 id 的優先級比較高，所以會蓋過 class 和 p 選擇器。

## 組合優先級的計算
那如過是由一段選擇器組合的 CSS，要怎麼判斷優先級呢？例如:

```css
ul > li.my-list {
  color: red
}
```
我們可以給每個優先級一個分數來去計算:
* 0 級: 0分
* 1 級: 1分
* 2 級: 10分
* 3 級: 100分

每出現一個優先級就加相對的分數，至於 4、5 級就不用計算了，因為他們絕對是最優先的。

所以我們可以知道 `ul > li.my-list` 是 12 分，因為出現兩個標籤選擇器和一個類選擇器。接下來我來考考你:

```html
<div class="container">
  <p class="container-p">一段文字</p>
</div>

<style>

.container-p {
  color: red;
}

.container {
  color: blue;
}

.container .container-p {
  color: green;
}

.container > p {
  color: orange
}

</style>
```
這個字是什麼顏色的呢？

答案是綠色的喔，因為它的優先級分數是 20 分:
```css
/* 10分 */
.container-p {
  color: red;
}
/* 10分 */
.container {
  color: blue;
}
/* 20分 */
.container .container-p {
  color: green;
}
/* 11分 */
.container > p {
  color: orange
}
```

不過要注意的是，這個分數算法並不是非常嚴謹的，它**不能**代表說我用十個 class 選擇器就能蓋過 id 選擇器，基本上優先級的鴻溝是無法跨越的，你就算用 100 個 class 選擇器也比不過一個 id 或 `!important`。

但沒有人會在開發時連續寫十個以上的 class 選擇器，所以在 99.99% 的情況下都可以使用這套分數系統。(應該沒有人這樣寫吧...)

如果優先級分數相同的情況下，就會採取**後來居上**的原則，也就是寫在後面的優先級高於前面的:

```html
<p>一段文字</p>

<style>

p {
  color: blue;
}

/* 其他 css */

p {
  color: red;
}

</style>
```
這樣的情況下，文字顏色會是紅色的喔。

## 優先級跟 DOM 位置無關
先來看的例子:
```html
<div class="blue">
  <div class="red">
    <p>一段文字</p>
  </div>
</div>

<div class="red">
  <div class="blue">
    <p>一段文字</p>
  </div>
</div>

<style>

.blue > p {
  color: blue;
}

.red p {
  color: red;
}

</style>
```
你覺得字是什麼顏色的呢？一紅一籃嗎？

答案是都是紅色的，他們兩個優先級相同，但紅色寫在下面所以優先級較高，跟 DOM 位置一點關係都沒有。從這個例子你也可以發現，`>` **選擇符不影響優先級**。

## 小結
到這裡你應該就知道位什麼有時候你寫的 CSS 樣式不生效了，是因為優先級太低了。但這種時候不建議加 `!important`，這會讓後續的維護變更困難。(這樣就無人可以取代你了)

如果是個人的小專案，可以重新審視一下自己的 HTML 架構和 CSS 命名，看看到底哪裡出了問題。

如果是大專案難以更動 HTML，可以考慮這種寫法來增加優先級:

```css
.myClass.myClass {
  color: red
}
```
重複寫兩次相同的類名，就可以提高優先級，當然這是不好做法中比較好的做法了。
