# Ember에서의 객체 (Objects in Ember) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/)

Ember에서는 자바스크립트의 일반 클래스 패턴과 새로운 ES2015 클래스가 널리 사용되지 않는다. 하지만 여전히 일반 객체도 보이며, 때로는 그 객체를 "해쉬"로 부른다.

자바스크립트 객체는 프로퍼티 값 변경을 감지하지 않는다. 따라서, 어떤 객체에서 Ember.js의 값 바인딩 시스템을 사용하고 싶다면, 일반 객체가 아닌 `Ember.Object`를 봐야할 것이다.

[Ember.Object](http://emberjs.com/api/classes/Ember.Object.html)는 mixins과 생성자 메소드같은 기능을 지원하는 클래스 시스템을 제공한다. Ember의 객체 모델은 자바스크립트의 클래스나 일반적인 패턴에서 지원하지 않는 몇가지 기능이 있지만, 그러한 기능 모두 가능한 언어 및 제안됐던 추가 기능과 맞도록 했다.

또한, Ember는 [Ember.Enumerable](http://emberjs.com/api/classes/Ember.Enumerable.html) 인터페이스를 사용하여 자바스크립트 `Array` 프로토타입을 확장해 배열의 변화도 감지하는 기능을 제공한다.

마지막으로, Ember는 [몇가지 포맷팅과 로컬라이징 메소드](http://emberjs.com/api/classes/Ember.String.html)를 로 자바스크립트의 `String` 프로토타입을 확장했다.
