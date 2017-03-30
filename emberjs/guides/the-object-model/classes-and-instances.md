# 클래스와 인스턴스(Classes and Instances) (원본)[https://guides.emberjs.com/v2.10.0/object-model/classes-and-instances/]

Ember에 대해 공부할때, `Ember.Component.extend()`와 `DS.Model.extend()`를 보았을 것이다. 이제 Ember 객체 모델의 주요 기능으로 알려진 `extend()`메소드에 대해 공부할 것이다.

## 클래스 정의하기
새 Ember 클래스를 정의하기 위해서, [`Ember.Object`](http://emberjs.com/api/classes/Ember.Object.html)에서 [`extend()`](http://emberjs.com/api/classes/Ember.Object.html#method_extend)함수를 부른다.

```javascript
const Person = Ember.Object.extend({
  say(thing) {
    alert(thing);
  }
});
```

이 코드는 `say()` 메소드를 가진 `Person`클래스를 정의한다.

그리고 `extend()` 메소드를 호출해서 존재하는 클래스로부터 서브클래스(자식클래스)를 만들 수 있다. 예를 들어 Ember의 빌트인 클래스인 [`Ember.Component`](http://emberjs.com/api/classes/Ember.Component.html)의 서브클래스(자식클래스)를 만든다고 하면 아래와 같다.

```javascript
//app/components/todo-item.js

export default Ember.Component.extend({
  classNameBindings: ['isUrgent'],
  isUrgent: true
});
```

## 부모 클래스의 메소드를 오버라이드하기

서브클래스(자식클래스)를 정의할 때, 부모클래스의 메소드를 오버라이드 할 수 있지만, 여전히 `_super()` 메소드를 호출해서 부모클래스에 구현된 메소드에 접근할 수 있다.

```javascript
const Person = Ember.Object.extend({
  say(thing) {
    alert(`${this.get('name')} says: ${thing}`);
  }
});

const Soldier = Person.extend({
  say(thing) {
    // 이 코드는 넘겨 받은 thing 변수에  ', sir!' 문자열을 붙인 뒤,
    // 부모 클래스에 있는 메소드(Person#say)를 호출할 것이다.
    this._super(`${thing}, sir!`);
  }
});

let yehuda = Soldier.create({
  name: 'Yehuda Katz'
});

yehuda.say('Yes'); // alerts "Yehuda Katz says: Yes, sir!"
```

어떨 때에는, 오버라이딩하기 전후로 `_super()`에 패러미터를 넘기고 싶을 것이다.

이렇게 하면 기존 메소드(오버라이딩 전 메소드)가 원래 하던 연산을 이어할 수 있다.

일반적인 예로는 Ember-Data의 시리얼라이저(serializer)중 하나에서  [`normalizeResponse()`](http://emberjs.com/api/data/classes/DS.JSONAPISerializer.html#method_normalizeResponse)를 오버라이드하는 경우가 있다.

이것을 위한 손쉬운 방법으은 `...arguments`와 같은 "전개 연산자(spread operator)"를 사용하는 것이다.

```javascript
normalizeResponse(store, primaryModelClass, payload, id, requestType)  {
  // Ember-Data위한 커스텀 JSON 페이로드 정의
  return this._super(...arguments);
}
```

위의 예제는 기존 패러미터(커스터마이즈 한 이후)를 부모 클래스에게 넘겨줘서, 기존 연산(오버라이드 전)을 계속할 수 있다.

## 인스턴스 생성하기

클래스를 한번 생성하면, [`create()`](http://emberjs.com/api/classes/Ember.Object.html#method_create) 메소드를 호출하여 해당 클래스의 새 인스턴트를 생성할 수 있다. 당신이 클래스에서 정의한 모든 메소드, 프로퍼티, 계산된 프로퍼티는 인스턴스에서 사용 가능하다.

```javascript
const Person = Ember.Object.extend({
  say(thing) {
    alert(`${this.get('name')} says: ${thing}`);
  }
});

let person = Person.create();

person.say('Hello'); // alerts " says: Hello"
```

인스턴스를 생성할때, `create()` 메소드에 부가적으로 해쉬를 넘김으로써 인스턴스의 프로퍼티의 값을 초기화 할 수 있다.

```javascript
const Person = Ember.Object.extend({
  helloWorld() {
    alert(`Hi, my name is ${this.get('name')}`);
  }
});

let tom = Person.create({
  name: 'Tom Dale'
});

tom.helloWorld(); // alerts "Hi, my name is Tom Dale"
```

성능적인 이유로, `create()`를 부르는 동안 인스턴스의 계산된 프로퍼티를 재정의할 수 없고, 정의된 메소드를 재정의하거나 새 메서드를 정의해서는 안된다. `create()`를 호출할 때는 일반 프로퍼티만 설정해야한다. 만약 메소드나 계산된 프로퍼티를를 정의 혹은 재정의해야한다면 새로운 서브클래스(자식클래스)를 만들어서 그것의 인스턴스를 만들어라.

컨벤션에 따라, 클래스가 가지는 프로퍼티나 변수는 PascalCased로 작성되고, 인스턴스는 그렇지 않다. 예를 들어, `Person` 변수는 클래스를 가리키며, `person`은 인스턴스(보통 `Person`클래스의 인스턴스)를 가리킨다. Ember에서는 이런 네이밍 컨벤션을 지켜야한다.

## 인스턴스 초기화하기
새 인스턴스가 만들어질때, [`init()`](http://emberjs.com/api/classes/Ember.Object.html#method_init) 메소드가 자동적으로 호출된다. 이 메소드는 새로운 인스턴스의 초기 설정을 구현하기에 적합하다.

```javascript
const Person = Ember.Object.extend({
  init() {
    alert(`${this.get('name')}, reporting for duty!`);
  }
});

Person.create({
  name: 'Stefan Penner'
});

// alerts "Stefan Penner, reporting for duty!"
```

만약 `Ember.Component`와 같은 프레임워크 클래스의 서브클래스(자식클래스)를 만들고 `init()` 메소드를 오버라이드한다면, `this._super(...arguments)`를 호출해라! 만약 그러지 않으면 부모클래스는 중요한 초기 설정을 하지 못해, 이상한 동작이 생길 수 있다.

모든 `Ember.Object`에서 직접 선언한 배열과 객체는 그 객체의 모든 인스턴스가 공유한다.

```javascript
const Person = Ember.Object.extend({
  shoppingList: ['eggs', 'cheese']
});

Person.create({
  name: 'Stefan Penner',
  addItem() {
    this.get('shoppingList').pushObject('bacon');
  }
});

Person.create({
  name: 'Robert Jackson',
  addItem() {
    this.get('shoppingList').pushObject('sausage');
  }
});

// Stefan 과 Robert 둘다 각자의 addItem을 작동시켰다.
// 둘 다 ['eggs', 'cheese', 'bacon', 'sausage']를 가질 것이다.
```

이러한 동작을 피하려면, `init()` 안에서 배열과 객체 프로퍼티를 초기화하는 것이 좋다. 이렇게하면 각 인스턴스가 고유하게 유지된다.

```javascript
const Person = Ember.Object.extend({
  init() {
    this.set('shoppingList', ['eggs', 'cheese']);
  }
});

Person.create({
  name: 'Stefan Penner',
  addItem() {
    this.get('shoppingList').pushObject('bacon');
  }
});

Person.create({
  name: 'Robert Jackson',
  addItem() {
    this.get('shoppingList').pushObject('sausage');
  }
});

// Stefan ['eggs', 'cheese', 'bacon']
// Robert ['eggs', 'cheese', 'sausage']
```

## 오브젝트 프로퍼티 접근하기

오브젝트의 프로퍼티에 접근할때, `get()`과 `set()` 접근자(accesor) 메소드를 사용해라.

```javascript
const Person = Ember.Object.extend({
  name: 'Robert Jackson'
});

let person = Person.create();

person.get('name'); // 'Robert Jackson'
person.set('name', 'Tobias Fünke');
person.get('name'); // 'Tobias Fünke'
```

이런 접근자 메소드를 사용해야 한다. 그렇지 않으면 계산된 프로퍼티가 다시 계산되지 않아서 관찰자(obeserver)가 실행되지 않고, 템플릿이 업데이트 되지 않는다.
