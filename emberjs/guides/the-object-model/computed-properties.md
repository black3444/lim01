# 계산된 프로퍼티(Computed Properties) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/computed-properties/)

## 계산된 프로퍼티란 무엇인가?

간단히 말해서, 계산된 프로퍼티을 사용하면 사용자가 함수를 프로퍼티로 정의할 수 있다. 계산 된 프로퍼티를 함수로 정의하여 Ember가 해당 프로퍼티를 요청할 때 자동으로 호출하는 함수를 만든다. 계산된 프로퍼티는 일반 프로퍼티와 정적 프로퍼티과 동일한 방법으로 사용할 수 있다.

하나 혹은 그이상의 일반 프로퍼티를 가져와 데이터를 변환하거나 조작하여 새로운 값을 만들기 매우 편하다.

## 액션에서 계산된 프로퍼티

간단한 예제로 시작한다.

```javascript
Person = Ember.Object.extend({
  // 아래 프로퍼티는 `create`에 의해 정의 될 것이다.
  firstName: null,
  lastName: null,

  fullName: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  })
});

let ironMan = Person.create({
  firstName: 'Tony',
  lastName:  'Stark'
});

ironMan.get('fullName'); // "Tony Stark"
```

위 코드에서는 `firstName`과 `lastName`에 종속된 계산된 프로퍼티, `fullName`을 정의한다. 맨 처음에 `fullName` 프로퍼티에 접근하면, 계산된 프로퍼티를 리턴하는 함수(즉, 마지막 인자)가 실행되고, 그 결과는 캐시된다. 그 이후 `fullName`에 접근하면 함수를 부르지 않고 캐시에서 읽어온다. 종속 프로퍼티를 변경하면 캐시가 무효화되므로, 그 이후 접근에서는 계산된 함수가 다시 실행된다.

객체 내의 프로퍼티에 종속되기를 원할땐, 중괄호({})를 이용하여 여러 종속 키(프로퍼티 이름)를 설정할 수 있다.

```javascript
let obj = Ember.Object.extend({
  baz: {foo: 'BLAMMO', bar: 'BLAZORZ'},

  something: Ember.computed('baz.{foo,bar}', function() {
    return this.get('baz.foo') + ' ' + this.get('baz.bar');
  })
});
```

(`something` 이)종속하는 키들(`foo`, `bar`)이 거의 유사할 때, (위와 같은 방법으로)중복을 훨씬 줄이면서 `baz`의 `foo`, `bar` 둘 다 관찰(observe)할 수 있다.

## 계산된 프로퍼티 체이닝
새로운 계산된 프로퍼티를 만들기 위해 다른 계산된 프로퍼티를 값으로 사용할 수 있다. 이전 예제에서 기존의 `fullName` 프로퍼티와 새로 만든 다른 프로퍼티를 사용하여 `description`이라는 계산된 프로퍼티를 추가해보자.

```javascript
Person = Ember.Object.extend({
  firstName: null,
  lastName: null,
  age: null,
  country: null,

  fullName: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),

  description: Ember.computed('fullName', 'age', 'country', function() {
    return `${this.get('fullName')}; Age: ${this.get('age')}; Country: ${this.get('country')}`;
  })
});

let captainAmerica = Person.create({
  firstName: 'Steve',
  lastName: 'Rogers',
  age: 80,
  country: 'USA'
});

captainAmerica.get('description'); // "Steve Rogers; Age: 80; Country: USA"
```

## 동적 업데이트
기본적으로 계산 된 프로퍼티은 의존하는 프로퍼티에 대한 모든 변경 사항을 감지하고, 호출 될 때 동적으로 업데이트된다. 계산된 프로퍼티를 사용해보 동적으로 업데이트 해보자.

```javascript
captainAmerica.set('firstName', 'William');

captainAmerica.get('description'); // "William Rogers; Age: 80; Country: USA"
```

위에서  `firstName`의 변경을 계산된 프로퍼티 `fullName`이 감지하고, `fullName`의 변경을 `description`프로퍼티가 감지했다.

종속 프로퍼티를 설정하면 그 프로퍼티에 종속된 계산된 프로퍼티를 통해 변경 사항을 전파하고, 생성된 계산된 프로퍼티 체인을 따라 변경 한다.

## 계산된 프로퍼티 설정
계산된 프로퍼티를 설정(set)할 때, Ember에서 수행할 작업을 정의할 수도 있다. 만약 계산된 프로퍼티를 설정하려고 한다면, 키(프로퍼티 이름)와 설정하려는 값으로 함께 호출된다. setter 함수에서 계산 된 프로퍼티의 새 값을 반환해야한다.

```javascript
Person = Ember.Object.extend({
  firstName: null,
  lastName: null,

  fullName: Ember.computed('firstName', 'lastName', {
    get(key) {
      return `${this.get('firstName')} ${this.get('lastName')}`;
    },
    set(key, value) {
      let [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName',  lastName);
      return value;
    }
  })
});


let captainAmerica = Person.create();
captainAmerica.set('fullName', 'William Burnside');
captainAmerica.get('firstName'); // William
captainAmerica.get('lastName'); // Burnside
```

## 계산된 프로퍼티 매크로
몇몇 유형의 계산된 프로퍼티는 매우 보편적으로 사용한다. Ember는 그런 유형의 계산된 프로퍼티를 짧게 표현하는 계산된 프로퍼티 매크로를 많이 제공한다.

아래 예시에서, 두개의 계산된 프로퍼티는 동일하다:
```javascript
Person = Ember.Object.extend({
  fullName: 'Tony Stark',

  isIronManLongWay: Ember.computed('fullName', function() {
    return this.get('fullName') === 'Tony Stark';
  }),

  isIronManShortWay: Ember.computed.equal('fullName', 'Tony Stark')
});
```

계산된 프로퍼티 매크로의 전체 목록을 보려면, [API 문서](http://emberjs.com/api/classes/Ember.computed.html)를 살펴보라.
