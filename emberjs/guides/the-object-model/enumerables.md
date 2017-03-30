# 열거형(Enumerables) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/enumerables/)

Ember.js에서 열거형은 여러 자식 객체를 포함하는 객체이고, [Ember.Enumerable](http://emberjs.com/api/classes/Ember.Enumerable.html) API를 이용하여 해당 자식과 작업할 수 있게 한다. 대부분의 앱에서 가장 많이 사용되는 열거형은 Ember.js에서 열거형 인터페이스를 준수하도록 확장한 네이티브 JavaScript 배열이다.

열거형을 처리하기 위해 표준화된 인터페이스를 제공함으로써, Ember.js는 접근 하는 애플리케이션의 다른 부분을 수정할 필요 없이 기본 데이터가 저장되는 방식을 완전히 바꿀 수 있다.

열거형 API는 ECMAScript의 스펙을 가능한 한 따른다. 이렇게 하면 다른 라이브러리와의 비호환성을 최소화 하고, Ember.js가 사용 가능한 배열의 네이티브 브라우저의 구현을 사용할 수 있다.

## 관찰 가능한 메소드와 프로퍼티의 사용
열거형을 변경할 때 Ember가 관찰하기 위해서는, `Ember.Enumerable`이 제공하는 특수한 메소드를 사용해야한다. 예를 들어, 표준 자바스크립트 메소드 `push()`를 사용하여 배열에 엘리먼트를 추가하는 경우, Ember는 변경 사항을 관찰할 수 없지만, 열거형 메소드인 `pushObject()`를 사용하면 변경사항이 어플리케이션 전체에 전파된다.

다음은 표준 JavaScript 배열 메소드 및 관찰 가능한 열거형 목록이다.

| 표준 메소드    | 관찰 가능한 동일한 메소드 |
| ----------- | -------------------- |
| pop         | popObject            |
| push        | pushObject           |
| reverse     | shiftObject          |
| shift       | shiftObject          |
| unshift     | unshiftObject        |

추가적으로, 관측 가능한 방식으로 배열의 첫번째와 마지막 객체를 검색하려면, `myArray.get('firstObject')` 와 `myArray.get('lastObject')`를 각각 사용해야한다.

## API 개요
이 가이드에서는, 열거형의 보편적인 편리한 정보를 알아 본다. 전체리스트를 보고싶으면, [Ember.Enumerable API 레퍼런스 문서](http://emberjs.com/api/classes/Ember.Enumerable.html)를 보라.

### 열거형 반복하기
열거형 객체의 모든 값을 열거하려면 [`forEach()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_forEach) 메소드를 사용하라.

```javascript
let food = ['Poi', 'Ono', 'Adobo Chicken'];

food.forEach((item, index) => {
  console.log(`Menu Item ${index+1}: ${item}`);
});

// Menu Item 1: Poi
// Menu Item 2: Ono
// Menu Item 3: Adobo Chicken
```

### 첫번째, 마지막 객체
모든 열거형은 바인딩 가능한 [`firstObject`](http://emberjs.com/api/classes/Ember.Enumerable.html#property_firstObject)와 [`lastObject`](http://emberjs.com/api/classes/Ember.Enumerable.html#property_lastObject) 속성을 가지고 있다.

```javascript
let animals = ['rooster', 'pig'];

animals.get('lastObject');
//=> "pig"

animals.pushObject('peacock');

animals.get('lastObject');
//=> "peacock"
```

### 맵
열거 형의 각 항목에 함수를 호출한 결과로 새 배열을 만드는 [`map()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_map) 메소드를 사용하여 열거형의 각 항목을 쉽게 변경할 수 있다.

```javascript
let words = ['goodbye', 'cruel', 'world'];

let emphaticWords = words.map(item => `${item}!`);
//=> ["goodbye!", "cruel!", "world!"]
```

열거 형이 객체로 구성되어있다면, 각 객체에서의 프로퍼티를 차례로 추출하여 새 배열을 반환하는 [`mapBy()`]() 메소드가 있다.
```javascript
let hawaii = Ember.Object.create({
  capital: 'Honolulu'
});

let california = Ember.Object.create({
  capital: 'Sacramento'
});

let states = [hawaii, california];

states.mapBy('capital');
//=> ["Honolulu", "Sacramento"]
```

### 필터링
열거형에 대해 수행할 또다른 일반적인 작업은 열거형을 입력으로 가져와 일부 조건에 따라 필터링 한 후 Array를 반환하는 것이다.

임의적인 필터링의 경우, [`filter()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_filter) 메소드를 사용하라. 필터 메소드는 Ember가 최종 배열에 포함해야하는 경우에는 콜백이 `true`를 반환하고, 그렇지 않으면 `false`나 `undefined`를 반환하도록 해라.

```javascript
let arr = [1, 2, 3, 4, 5];

arr.filter((item, index, self) => item < 4);

//=> [1, 2, 3]
```

Ember 객체의 컬렉션을 사용하여 작업 중일 때, 종종 일부 속성에 따라 객체의 집합을 필터링 해야 한다. [`filterBy()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_filterBy)를 이용하여 간단하게 할 수 있다.

```javascript
Todo = Ember.Object.extend({
  title: null,
  isDone: false
});

let todos = [
  Todo.create({ title: 'Write code', isDone: true }),
  Todo.create({ title: 'Go to sleep' })
];

todos.filterBy('isDone', true);

// `isDone == true`인 아이템만 가지고 있는 배열을 리턴한다.
```

만약 일치하는 값을 가진 모든 아이템을 포함하는 배열 대신, 일치하는 값을 가진 첫번째 아이템을 반환 하려는 경우, filter()와 filterBy()와 동일하게 작동하지만 하나의 아이템만 반환하는 [`find()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_find)와 [`findBy()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_findBy)를 사용한다.

### 집계 정보 (모든 혹은 어떤)

열거형의 모든 항목이 조건과 일치하는지 확인하려면 [`every()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_every) 메서드를 사용할 수 있다:

```javascript
Person = Ember.Object.extend({
  name: null,
  isHappy: false
});

let people = [
  Person.create({ name: 'Yehuda', isHappy: true }),
  Person.create({ name: 'Majd', isHappy: false })
];

people.every((person, index, self) => person.get('isHappy'));

//=> false
```

열거형의 항목 중 하나 이상이 어떤 조건과 일치하는지 확인하려면 [`any()`](http://emberjs.com/api/classes/Ember.Enumerable.html#method_any) 메서드를 사용할 수 있다.

```javascript
people.any((person, index, self) => person.get('isHappy'));

//=> true
```

필터링 메소드와 마찬가지로 `every()`와 `any()` 메소드도 `isEvery()`와 `isAny()` 메소드와 유사하다.

```javascript
people.isEvery('isHappy', true); // false
people.isAny('isHappy', true);  // true
```
