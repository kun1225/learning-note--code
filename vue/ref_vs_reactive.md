# Vue3 中，ref 和 reactive 的差別
這個問題困擾我一段時間了，有人說全部都用 ref 就好，也有人說 ref 是 reactive 的語法糖，底層原理還是用 reactive，於是我就花了一點時間整理了以下資料。

## reactive
在 Vue3 中，我們可以用 `reactive()` 定義一個響應式物件或陣列
```js
import {reactive} from 'vue';

const obj = reactive({
  id: 1
})

const arr = reactive([1,2,3])
```
而這個響應式物件或陣列的底層其實是一個 proxy 實例

(響應式的意思是指資料和畫面同步更新)
## reactive 的限制
reactive 雖然好用，不過他有以下限制
1. 只對物件類型有效(物件、陣列、Map、Set...)，對原始型別無效(String、Number、Boolean)
2. 若直接覆蓋響應式物件會讓響應式失效
```xml
<script setup>
import { reactive } from 'vue'

let counter = reactive({ count: 0 })
function change() {
  // 覆蓋
  counter = reactive({ count: 1 })
}
</script>

<template>
  <button @click="change">
    {{ counter }} 
    <!-- 點擊button時，始終顯示 { "count": 0 } -->
  </button>
</template>
```
3. 將響應式物件賦值或解構給其它變數時也會失去響應式
```js
const user = reactive({
  name: 'this.web',
  age: 18
})

// myName 和 user.name 失去響應性連結
let myName = user.name;

// 同理
let {name, age} = user
```
於是為了解決上面三個問題，`ref`出現了

## ref
`ref()` 可以創建任何類型的響應式ref
```js
import { ref } from 'vue';
const num = ref(1);
const str = ref('a');
const boolean = ref(true);
const obj = ref({
  id: 1
})
```
需要注意的是，若使用 `ref()` 創建響應式ref，在修改值的時候需要加上 .value  
```js
num.value = 2;
str.value = 'b';
boolean.value = false;
obj.value.id = 2;
```
ref 厲害的地方是可以將響應式物件賦值或解構給其它變數，且不會失去響應性
```js
import { ref } from 'vue';

const counter = ref({count: 0})
counter.value = ref({count: 1}) // 不失去響應性

const user = ref({
  name: 'this.web',
  age: 18
})

// 不失去響應性
let myName = user.value.name;

// 不失去響應性
let {name, age} = user.value
```
但你可能會覺得用 `ref()` 創建的響應式物件有點難用，要不斷記得加 value，寫起來也不太直觀，所以我們可以這樣改寫
```js
const user = {
  name: ref('thisWeb'),
  age: ref(18)
}

// 不失去響應性
{name, age} = user
age.value++
```
除此之外 ref 也可以再不丟失響應性的前提下傳遞這些物件，這在組合是函數中很常使用

```js
// mouse.js
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  // ...
  return { x, y }
}
```
```xml
<script>
import {useMouse} from './mouse.js'

// 不失去響應性
const { x, y } = useMouse()
</script>
```

## ref 的解構
解構

不過當 ref 在模板被當作**頂層屬性**訪問時，它們會自動解構，就不用再加上 value
```xml
<script>
import { ref } from 'vue';
const num = ref(1);
const str = ref('a');
const boolean = ref(true);
const obj = ref({
  id: 1
})
</script>

<template>
  <!-- 正確 -->
  <p>{{ num }}</p>
  <!-- 錯誤 -->
  <p>{{ num.value }}</p>
  <!-- 正確 -->
  <p>{{ obj.id }}</p>

</template>
```
不過下面這個狀況