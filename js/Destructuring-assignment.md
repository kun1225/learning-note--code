# 解構賦值 Destructuring assignment
### 解構賦值可以幹嘛

先來看一個情況，假設我們有一個購買商品使用者，你可能會有一些資料像是，姓名年齡地址以及購買的訂單(order)之類的，就會像下面這樣

```jsx
const user1 = {
	name: 'thisWeb',
	age: 18,
	addr: {
		city: 'Taipei',
		street: "123 Main St",
	},
	orders: {
      items: [
          "Shirt",
          "Pants"
      ],
      total: 50.0
    },
}
```

如果我們要知道他買的產品或是可能就要

```jsx
function showUserInfo(user) {
	console.log(`
  使用者${user.name}花了${user.orders.total}元，
  購買${user.orders.items}
  `)
}
showUserInfo(user1)
// 使用者thisWeb花了50元，購買Shirt,Pants
```

可以看到我們重複地打了很多 `user`，既不好看打的時候又麻煩

為了解決這個問題，解構附值誕生了

### 解構賦值是甚麼

解構附值可以將屬性或變亮從物件提取出來賦值給其他變量，可能有點難理解，我們直接來改寫上面的範例

```jsx
function showUserInfo(user) {
	const {name, orders: {items, total}} = user
	console.log(`使用者${name}花了${total}元，購買${items}`)
}

showUserInfo(user1)
// 使用者thisWeb花了50元，購買Shirt,Pants
```

是不是簡潔很多，簡單說，我們把 user 裡的屬性提取出來賦值給 name、total、items

這就是解構賦值在做的事情

好處是變量的名字簡短了很多，也更容易閱讀，那到底要怎麼使用呢？

### 給物件解構
最常見的用法是將物件解構
```jsx
const user = {
	name: 'thisWeb',
	age: 18,
}

const {name, age} = user
console.log(name, age) // thisWeb, 18
```

上面程式碼是把 user.name 和 user.age 提取出來賦值給了全局變量 name 和 age

等於下面這種寫法

```jsx
const name = user.name;
const age = user.age;
```

要注意的是 `const {name, age} = user` 大括號裡面的變量名字要跟 user 屬性裡的一樣，不然會 undefined

```jsx
const {yourName, age} = user
console.log(yourName, age) // undefined, 18
```

那如果我就是想要自己宣告不一樣的變量名字怎麼辦，可以這樣做

```jsx
const {name: yourName, age} = user
console.log(yourName, age) // thisWeb, 18
```

### 解構物件的初始值

也可以加上初始值來避免物件裡面沒有某些屬性

```jsx
// 沒有加初始值
const {name, age, gender} = user
console.log(name ,age ,gender) // thisWeb, 18, undefined

// 加上初始值
const {name, age, gender = 'male'} = user
console.log(name, age, gender) // thisWeb, 18, male
```

### 巢狀物件的解構

當物件裡面又有其他物件時，就可以像下面這樣來解構出來

```jsx
const user = {
	name: 'thisWeb',
	age: 18,
	addr: {
		city: 'Taipei',
		street: "123 Main St",
	}
}

const {name, age, addr: {city, street}} = user
console.log(city) // Taipei
```

看起來複雜一點，但其實就只是把物件的key值(屬姓名)這著打出來

### 陣列的解構

除了物件以外，陣列也是可以被解構的

和物件不同的地方是，解構的語法是中括號，還有變數的名字可以自己取，且變數的值取決於位置，不能和物件一樣，根據 key 值來直接取值

```jsx
const arr = [1, 2, 3];
const [num1, num2] = arr;

console.log(num1, num2); // 1, 2
```

如果我們只想取得第二個值，想忽略第一個值，可以直接這樣

```jsx
const [, num2] = arr;

console.log(num2); // 2
```

### 陣列解構的初始值

和物件一樣，陣列也可以有初始值

```jsx
const [, , , num4 = 4] = arr;
console.log(num4) // 4
```

### 巢狀陣列的解構

```jsx
const user = ['thisWeb', 24, ['擼貓', '寫程式', '打籃球']];
const [ name, age, [firstHobby, secondHobby] ] = user;

console.log(name, firstHobby, secondHobby); // thisWeb 櫓貓 寫程式

```

### 物件和陣列的混和解構

有時候物件裡面會包含陣列，陣列裡面又有物件，這種情況一樣可以解構，注意物件用大括號，陣列有中括號  

```jsx
const person = {
	name: 'thisWeb',
	age: 18,
	hobbies: [
		'擼貓',
		'打程式',
		'打籃球'
	]
};

const {name, age, hobbies: [firstHobby, secondHobby]} = person;
console.log(name, age, firstHobby); 
// thisWeb 18 擼貓
```

### 解構的五種用法

除了一開始將物件的屬性取值出來的用法外，還有幾種好用的解構方法

**交換變數**
利用陣列解構的方法可以很方便的交換變數

```jsx
let num1 = 100; let num2 = 200;
[num1, num2] = [num2, num1];

console.log(num1, num2); // 100, 200
```


**搭配剩餘運算子做複製、切割、組合**
剩餘運算子可以將物件或是陣列的值展開

```jsx
const hobbies = ['擼貓', '打程式', '打籃球'];
// 複製陣列
const [...copyHobbies] = hobbies;

const user1 = {
	name: 'thisWeb',
	age: 18,
}
// 複製物件
const {...copyUser} = user
```

稍加變化可以切割陣列或物件
```jsx
const [firstHobby, ...remainHobbies] = hobbies;
console.log(firstHobby, remainHobbies); // 擼貓, [打程式, 打籃球]

const {name, ...remainVal} = user;
console.log(name, remainVal)
// thisWeb, {name: 18}
```

當然也可以把兩個陣列或物件組合在一起
```jsx
const arr1 = [1, 2], arr2 = [3];
const arr3 = [...arr1, ...arr2] // [1, 2, 3]

const userWithHobbies = {...user, hobbies}
// name: 'thisWeb', age: 18, hobbies:[...]
```


**動態屬性解構**
我們也可以依據傳入的參數來取得特定的值
```jsx
const getUserInfo = (key) => {
  const {[key]: value} = user;
  console.log(value);
}

getUserInfo('name'); // thisWeb  
getUserInfo('age'); // 18
```
不過要注意傳入的值要是字串


**函數解構**
可以在函數的參數中解構

```jsx
const userArr = ['thisWeb', 18];
const userObj = {
  name: 'thisWeb',
  age: 18,
}
function arrGetUser([name, age]) {
  console.log(name, age);
}
arrGetUser(userArr); // thisWeb 18

function objGetUser({name, age}) {
  console.log(name, age)
}
objGetUser(userObj); // thisWeb 18

```

若返回的是物件，也可以在返回值時解構
```jsx
function getStudentInfo() {
    return {
        name: 'thisWeb',
        age: 18,
        scores: {
            math: 19,
            english: 28,
            chinese: 0
        }
    };
}
const { name, scores: {math, english, chinese} } = getStudentInfo();
console.log(name, math, english, chinese);
// thisWeb 19 28 0
```

**迴圈中的解構**
在使用 for...of 時也可使用解構

```jsx
const users = [
    {
        name: 'Rose',
        age: 18
    },
    {
        name: 'Jason',
        age: 20
    },
    {
        name: 'Jack',
        age: 30
    }
];

for(let {name, age} of users){
    console.log(name, age);
}
// Rose 18
// Jason 20
// Jack 30
```