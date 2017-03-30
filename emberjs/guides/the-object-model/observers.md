# 관찰자(Observers) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/observers/)

Ember는 계산된 프로퍼티를 포함해서 모든 프로퍼티를 관찰하는 기능을 지원한다.

관찰자는 다른 프로퍼티의 변화에 반응하는 행동을 가지고 있다. 관찰자는 특히 바인딩이 동기화를 끝낸 후에 어떤 동작을 수행해야할 때 유용하다.

Ember 개발자들은 종종 관찰자를 남용한다. 관찰자가 Ember 프레임워크 자체적으로도 많이 사용되긴 하지만, Ember 앱 개발자들이 직면한 문제는 대부분 계산된 프로퍼티가 적절한 해결책이다.

관찰자는 `Ember.observer`를 이용하여 설정 할 수 있다:

```javascript
Person = Ember.Object.extend({
  // 이 두개는 `create`에서 설정할 것이다.
  firstName: null,
  lastName: null,

  fullName: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),

  fullNameChanged: Ember.observer('fullName', function() {
    // 변경 된 것을 대응한다
    console.log(`fullName changed to: ${this.get('fullName')}`);
  })
});

var person = Person.create({
  firstName: 'Yehuda',
  lastName: 'Katz'
});

// 관찰자는 `fullName`이 맨 처음 변경 되기 전까지는 작동하지 않는다
person.get('fullName'); // "Yehuda Katz"
person.set('firstName', 'Brohuda'); // fullName changed to: Brohuda Katz
```

계산된 속성, `fullName`은 `firstName`에 따라 달라지므로, `firstName`을 업데이트하면 `fullName`에 대한 관찰자도 동작한다.

## 관찰자와 비동기

Ember에서 관찰자는 동기식이다. 즉, 관찰한 속성 하나가 변경되면 즉시 실행된다. 이것때문에, 아직 동기화 되지 않은 프로퍼티를 쉽게 찾을 수 있다.

```javascript
Person.reopen({
  lastNameChanged: Ember.observer('lastName', function() {
    // 관찰자는 lastName, fullName에 의존한다.
    // 관찰자는 동기식이므로, 이 함수를 호출했을 때 fullName의 값이 업데이트 되지 않았으므로 fullName의 이전 값이 출력된다.
    console.log(this.get('fullName'));
  })
});
```

이런 동기식 동작은 여러 프로퍼티를 관찰할때 여러번 실행 될 수 있다.

```javascript
Person.reopen({
  partOfNameChanged: Ember.observer('firstName', 'lastName', function() {
    // firstName 과 lastName 모두 설정되었으므로, 이 관찰자는 두번 실행된다.
  })
});

person.set('firstName', 'John');
person.set('lastName', 'Smith');
```

이러한 문제를 해결하려면 [`Ember.run.once()`](http://emberjs.com/api/classes/Ember.run.html#method_once)을 사용해야한다. 이렇게 하면 모든 프로세스가 한번만 처리되고, 모든 바인딩이 동기화 되면 다음 실행 루프에서 실행된다.

```javascript
Person.reopen({
  partOfNameChanged: Ember.observer('firstName', 'lastName', function() {
    Ember.run.once(this, 'processFullName');
  }),

  processFullName() {
    // 두 프로퍼티가 동시에 설정되면 단 한번만 실행되고,
    // 모든 프로퍼티가 동기화 되면 다음 실행 루프에서 실행된다.
    console.log(this.get('fullName'));
  }
});

person.set('firstName', 'John');
person.set('lastName', 'Smith');
```

## 관찰자와 객체 초기화

관찰자는 객체 초기화가 완료될때까지 절대 실행되지 않는다.

관찰자가 초기화 프로세스에서 동작하게 하고 싶을 때에, `set`의 사이드이펙트만 의존할 수 없다(= 초기화 프로세스에서 `set`을 사용함으로써 일어나는 사이드이펙트로써 관찰자를 동작하게 할 수 없다.). 대신, [`Ember.on()`](http://emberjs.com/api/classes/Ember.html#method_on)를 이용하여 `init`이후에 발생하도록 작성한다:

```javascript
Person = Ember.Object.extend({
  init() {
    this.set('salutation', 'Mr/Ms');
  },

  salutationDidChange: Ember.on('init', Ember.observer('salutation', function() {
    // salutation이 바뀌면서 실행할 것들
  }))
});
```

## 계산된 프로퍼티가 사용되지 않아 관찰자 트리거가 발생하지 않음.
계산된 프로퍼티가 전혀 `get()`되지 않는다면, 그 프로퍼티의 종속키가 변경되더라도 관찰자는 실행되지 않는다. 알려지지 않은 어떤 값에서 또 다른 알려지지 않음 값으로 바뀐다고 생각하면 된다.

계산된 속성은 거의 항상 가져오는 것과 동시에 관찰되기 때문에, 일반적으로 어플리케이션 코드에는 영향을 주지 않는다. 예를 들어 계산된 프로퍼티의 값을 가져와 DOM에 저장하거나 D3로 그린 이후, 프로퍼티가 변경되면 DOM을 업데이트할 수 있다.

만약 계산된 속성을 관찰해야하지만, 당신이 현재 그 속성을 가져오지 않았다면, `init()` 함수에서 `get()`한다.

## 클래스 정의의 바깥에서
클래스가 정의된 곳의 밖에서, [`addObserver()`](http://emberjs.com/api/classes/Ember.Object.html#method_addObserver)를 이용하여 관찰자를 추가할 수 있다.
```javascript
person.addObserver('fullName', function() {
  // deal with the change
});
```
