# 바인딩(Bindings) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/bindings/)

일종의 바인딩 구현을 갖고 있는 다른 대부분의 프레임와크와 달리, Ember.js의 바인딩은 모든 객체와 함께 사용할 수 있다. 즉, 바인딩은 Ember 프레임웍 자체에서 가장 많이 사용되고, 계산된 프로퍼티가 Ember 앱 개발자가 직면하는 대부분의 문제에 대한 해결책이다.

양방향 바인딩을 만드는 가장 쉬운 방법은 다른 객체에 대한 경로를 지정하는 [`computed.alias()`](http://emberjs.com/api/classes/Ember.computed.html#method_alias)를 사용하는 것이다.

```javascript
husband = Ember.Object.create({
  pets: 0
});

Wife = Ember.Object.extend({
  pets: Ember.computed.alias('husband.pets')
});

wife = Wife.create({
  husband: husband
});

wife.get('pets'); // 0

// 누가 pet을 가져 왔음.
husband.set('pets', 1);
wife.get('pets'); // 1
```

바인딩은 즉시 업데이트 되지 않는 것을 알아둬라. Ember는 모든 어플리케이션 코드가 완료될때까지 기다렸다가 변경사항을 동기화한다. 그러므로 값이 일시적일 때 바인딩 동기화의 오버헤드에 대해 걱정하지 않고 원하는 만큼 많이 바인딩된 프로퍼티를 바꿀 수 있다.

## 단방향 바인딩
단방향 바인딩은 [`computed.oneWay()`](http://emberjs.com/api/classes/Ember.computed.html#method_oneWay)를 이용하여 오직 한 방향으로만 변경 내용을 전파한다. 단방향 바인딩은 성능최적화되어 있기 때문에 양방향 바인딩(한쪽만 변경하면 사실상 단방향 바인딩임)을 안전하게 사용할 수 있다. 때로는 단방향 바인딩은 특정 속성을 얻는데 유용하다. 특정 속성에는 다른 속성과 동일하지만 오버라이드 가능한 기본 값(예:청구서 수신 주소와 동일하지만 나중에 변경할 수 있는 발송 주소)등 이 있다.

```javascript
user = Ember.Object.create({
  fullName: 'Kara Gates'
});

UserComponent = Ember.Component.extend({
  userName: Ember.computed.oneWay('user.fullName')
});

userComponent = UserComponent.create({
  user: user
});

// user 객체의 이름을 변경하면, view(컴포넌트)의 값도 바뀐다.
user.set('fullName', 'Krang Gates');
// userComponent.userName 은 "Krang Gates"가 된다.

// ...하지만 view(컴포넌트)를 변경해도 객체에 돌아가지는 않는다.
userComponent.set('userName', 'Truckasaurus Gates');
user.get('fullName'); // "Krang Gates"
```
