# 리다이렉트 하기(Redirecting) [(원본)](https://guides.emberjs.com/v2.11.0/routing/redirection/)

때로는 사용자가 요청한 것과 다른 페이지로 사용자를 리다이렉션 하는 경우가 있다.

예를 들어, 로그인 하지 않은 경우, 프로필 편집, 개인 정보 액세스, 장바구니 항목 체크를 막을 수 있다. 일반적으로 로그인 페이지로 리다이렉션 하고 성공적으로 로그인 한 후에 원래 액세스 하려는 페이지로 되돌린다.

사용자가 특정 페이지에 액세스 할 수 있는 여부를 알고싶은 여러 이유가 있을 것이다. 이유가 무엇이든 간에 Ember는 라우트에서 훅과 메소드를 조합하여 제어할 수 있다.

그중 하나가 [`transitionTo()`](http://emberjs.com/api/classes/Ember.Route.html#method_transitionTo)이다. 컨트롤러에서 라우트 또는 [`transitionToRoute()`](http://emberjs.com/api/classes/Ember.Controller.html#method_transitionToRoute)에서 `transitionTo()`호출하면 현재 진행중인 모든 트랜지션이 중지되고 새 트랜지션이 시작되어 디라이렉션한다. `transitionTo()`는  [link-to](https://guides.emberjs.com/v2.11.0/templates/links)헬퍼와 똑같이 동작한다.

또다른 방법은 `transitionTo()`와 동일하게 동작하는 [`replaceWith()`](http://emberjs.com/api/classes/Ember.Route.html#method_transitionTo). 유일한 다른점은 히스토리를 관리하는 방법이다. `replaceWith()`는 현재 라우트 엔트리를 리다이렉션할 라우트로 대체하고, `transitionTo()`는 현재 경로 항목을 남기고, 리다이렉션할 새로운 항목을 만든다.

새 라우트에 동적 세그먼트가 있는 경우, 각 세그먼트에 모델 또는 식별자를 넘겨야한다.모델을 전달하면 모델이 이미 로드 되어있으므로 `model()` 훅을 건너 뛴다.

## 모델을 알기 전에 트랜지션 하기

라우트의 [`beforeModel()`](http://emberjs.com/api/classes/Ember.Route.html#method_beforeModel)이 `model()`훅 전에 실행되기 때문에 모델에 포함된 정보가 필요하지 않은 경우, 리다이렉션을 수행하는 것이 좋다.

```javascript
// app/router.js
Router.map(function() {
  this.route('posts');
});
```

```javascript
// app/routes/index.js
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(/* transition */) {
    this.transitionTo('posts'); // 진행중이던 트랜지션을 암시적으로 중단한다.
  }
});
```

`beforeModel()` 는 현재 트랜지션을 인수로 받아, 저장하고 나중에 다시 시도할 수 있다. 이렇게하면 사용자를 원래의 경로로 되돌릴 수도 있다. 예를 들어, 사용자가 프로필을 편집하려고 시도 할 떄, 사용자를 로그인 페이지로 리다이렉션하고 성공적으로 로그인하면 편집 페이지로 즉시 리다이렉션 할 수 있다. 이것을 하려면 [트랜지션 저장 및 재전송](guides/routing/preventing-and-retrying-transitions.md)을 참조하라.

리다이렉션 할 위치를 파악하기 위해 일부 애플리케이션 상태를 검사해야하는 경우 [서비스](guides/application-concerns/services.md)를 이용할 수 있다.

## 모델을 알고 난 후에 트랜지션 하기

리다이렉션을 결정하기 위해 현재 모델에 대한 정보가 필요하다면 [`afterModel()`](http://emberjs.com/api/classes/Ember.Route.html#method_afterModel) 훅을 사용할 수 있다. 첫 번째 인자로 모델을 받고, 두번째 인자로 트랜지션을 받는다. 예:

```javascript
// app/router.js
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

```javascript
// app/routes/posts.js
import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model, transition) {
    if (model.get('length') === 1) {
      this.transitionTo('post', model.get('firstObject'));
    }
  }
});
```

`posts` 라우트로 전환할 때 게시물이 하나인 것으로 판명되면, 현재의 트랜지션은 단일 게시물 객체을 모델로 하는 `PostRoute` 로 리다이렉트 하기 위해 무시된다.

### 자식 라우트

위의 라우터를 다음과 같이 중첩된 라우트를 사용하도록 변경하라:
```javascript
// app/router.js
Router.map(function() {
  this.route('posts', function() {
    this.route('post', { path: '/:post_id' });
  });
});
```

`afterModel`훅에서 `posts.post`로 리다이렉션 하면, `afterModel`은 기본적으로 이 경로를 입력하려는 현재 시도를 무효화한다. 그러므로 `post` 라우트의 `beforeModel`, `model`, 그리고 `afterModel` 훅이 새 리다이렉션 내에서 다시 실행된다. 리다이렉트가 시작되기 전에는 비효율 적이다.

대신 [`redirect()`]() 메소드를 사용할 수 있다, 이 메서드는 원본 트랜지션을 유효하게 유지하고 부모 경로의 훅을 다시 시작하지 않는다:
```javascript
// app/routes/posts.js
import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (model.get('length') === 1) {
      this.transitionTo('posts.post', model.get('firstObject'));
    }
  }
});
```
