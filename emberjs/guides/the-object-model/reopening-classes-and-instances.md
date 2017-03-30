# 클래스와 인스턴스 재개(Reopening Classes and Instances) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/reopening-classes-and-instances/)

클래스를 한번에 다 정의해야할 필요는 없다. [`reopen()`](http://emberjs.com/api/classes/Ember.Object.html#method_reopenClass) 메소드를 이용하여 클래스를 재개하고 새로운 프로퍼티를 정의할 수 있다.

```javascript
Person.reopen({
  isPerson: true
});

Person.create().get('isPerson'); // true
```

또한 `reopen()`을 사용할 때, 이미 존재하는 메소드를 오버라이드 하고, `this._super`를 부를 수 있다.

```javascript
Person.reopen({
  // `say`에 마지막에 ~를 추가하기위해 오버라이드
  say(thing) {
    this._super(thing + '!');
  }
});
```

클래스 재개는(`reopen()`) 클래스의 모든 인스턴스가 공유하는 메소드와 프로퍼티를 추가할 때 사용한다. 순수한 자바스크립트(prototype을 사용하지 않은)에서 처럼 클래스의 특정한 인스턴스에 메소드와 프로퍼티를 추가하지 않는다.

하지만 정적 메소드나 정적 프로퍼티를 클래스에 추가하고싶다면, [`reopenClass()`](http://emberjs.com/api/classes/Ember.Object.html#method_reopenClass)를 사용한다.

```javascript
// 클래스에 정적 프로퍼티 추가
Person.reopenClass({
  isPerson: false
});
// Person 인스턴스의 프로퍼티를 오버라이드
Person.reopen({
  isPerson: true
});

Person.isPerson; // false - `reopenClass`에 의해 생성된 정적 변수이므로
Person.create().get('isPerson'); // true
```
