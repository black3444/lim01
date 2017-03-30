# Ember Data 사용하기(Using Ember Data) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/ember-data/)

현재 우리의 앱은 렌탈 목록에 하드코딩된 데이터를 사용하고 있으며, 라우트 핸들러에 정의되어있다. 앱이 커짐에 따라, 우리는 렌탈 데이터를 서버에 보관하고 쿼리와 같은 데이터에 대한 고급 작업을 쉽게 수행하고자 한다.

Ember는 [Ember Data](https://github.com/emberjs/data)라고 하는 데이터 관리 라이브러리를 제공하여 지속적인 앱의 데이터 처리에 도움을 준다.

Ember Data는 [`DS.Model`](http://emberjs.com/api/data/classes/DS.Model.html)을 확장(상속)하여 응용프로그램에 제공하려는 데이터의 구조를 정의해야 한다.

Ember CLI를 이용하여 Ember Data를 생성할 수 있다. 우리는 모델을 `rental`이라 칭하고 아래와 같이 생성한다:

```
ember g model rental
```

결과적으로 모델 파일과 테스트 파일이 생성 된다:
```
installing model
  create app/models/rental.js
installing model-test
  create tests/unit/models/rental-test.js
```

모델 파일을 열면 [`DS.Model`](http://emberjs.com/api/data/classes/DS.Model.html)을 상속한 빈 클래스가 나타난다:
```javascript
// app/models/rental.js
import DS from 'ember-data';

export default DS.Model.extend({

});
```
[이전에 사용한 렌탈](guides/tutorial/the-model-hook.md)에서 하드코딩된 자바스크립트 객체와 동일한 속성을 사용하여 대여 객체의 구조를 정의한다. - 제목, 소유자, 도시, 타입, 이미지, 침실 및 설명. [`DS.attr`](http://emberjs.com/api/data/classes/DS.html#method_attr) 함수의 결과물을 가지고 속성을 정의하라. Ember Data 속성에 대한 자세한 내용은 가이드의 [속성 정의하기](guides/model/defining-models.md)를 참조하라.

```javascript
// app/models/rental.js
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  owner: DS.attr(),
  city: DS.attr(),
  type: DS.attr(),
  image: DS.attr(),
  bedrooms: DS.attr(),
  description: DS.attr()
});
```

이제 Ember Data 스토어(저장소)에 사용할 수 있는 모델 객체가 있다.

## 모델 훅 업데이트하기

새로운 Ember Data 모델 객체를 이용하려면 [이전에 라우트 핸들러에서 정의한](guides/tutorial/the-model-hook.md) `model` 함수를 업데이트해야 한다. 하드코딩된 자바스크립트 배열을 삭제하고, [Ember Data 스토어 서비스](guides/model/introduction.md)를 부르도록 교체한다. [스토어 서비스](http://emberjs.com/api/data/classes/DS.Store.html)는 Ember의 모든 라우트와 컴포넌트에 주입된다. 스토어서비스는 Ember Data와 상호 작용할 때 사용하는 기본 인터페이스이다. 이 경우, 스토어에서 [`findAll`](http://emberjs.com/api/data/classes/DS.Store.html#method_findAll)함수를 호출하고, 새로 만든 렌탈 모델 클래스의 이름을 적어라.

```javascript
// app/routes/rentals.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('rental');
  }
});
```

`findAll`을 호출하면, Ember Data는 `/rentals`에 GET 요청을 시도한다.

Ember Data에 대해서는 [모델 섹션](guides/model/introduction.md)에서 더 자세한 내용을 볼 수 있다. 개발 환경에서 Mirage를 사용하고 있기 때문에, Mirage가 우리가 적은 데이터를 리턴할 것이다. 앱을 실제 서버에 배포할 때는 Ember Data가 통신할 백엔드를 제공해야 한다.
