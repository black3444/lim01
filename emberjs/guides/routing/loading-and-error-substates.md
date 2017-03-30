# 로딩 / 에러 하위 상태(Loading / Error Substates) [(원본)](https://guides.emberjs.com/v2.11.0/routing/loading-and-error-substates/)

Ember 라우터를 사용하면 라우트 로드 중 오류가 발생 했을 때 뿐만 아니라 라우트가 로드 되고 있다는 피드백을 제공할 수 있다.

## `loading` 하위 상태
`beforeModel`, `model`, `afterModel` 훅 진행 중에, 데이터를 로드하는 데 약간의 시간이 걸릴 수 있다. 기술적으로 라우터는 각 훅에 반환된 프로미스가 완료 될때까지 트랜지션을 일시 중지한다.

다음을 고려해라:
```javascript
// app/router.js
Router.map(function() {
  this.route('slow-model');
});
```

```javascript
// app/routes/slow-model.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('slow-model');
  }
});
```

`slow-model`, 로 이동하는 경우 `model`훅에서 쿼리를 완료하는데 시간이 오래 걸릴 수 있다. 이 기간동안 UI는 실제로 어떤 일이 일어나고 있는지에 대한 피드백을 제공하지 않는다. 전체 페이지를 새로 고친 후에 이 라우트로 접속한 경우, 어떤 라우트도 완전히 접속하지 않고 아무 템플릿도 표시되지 않으므로, UI가 완전히 비어 있습니다. 다른 라우트에서 `slow-model`로 이동하는 경우, 모델 로딩이 완료 될때까지 이전 라우트의 템플릿을 계속 보다가, `slow-model` 로드에 대한 템플릿이 갑자기 쨘 하고 나타난다.

그렇다면 트랜지션 중에 시각적 피드백을 어떻게 제공할까?

Ember가 전환할 `loading`(선택적으로는 해당하는 라우트)라는 템플릿을 정의하기만 하면 된다. 로딩 하위 상태로의 중간 트랜지션이 즉시(동기적으로) 발생하고, URL이 업데이트 되지 않으며 다른 트랜지션과 달리 현재 활성 트랜지션이 중단되지 않는다.

`slow-model`로의 기본 트랜지션이 완료 되면 `loading` 라우트가 종료되고 `slow-model`로의 전환이 계속된다.

중첩된 라우트의 경우 다음과 같다:

```javascript
// app/router.js
Router.map(function() {
  this.route('foo', function() {
    this.route('bar', function() {
      this.route('slow-model');
    });
  });
});
```

`foo.bar.slow-model` 라우트에 액세스할 때, Ember는 `foo.bar.slow-model-loading`으로 시작해서 계층 구조에서 `routeName-loading`이나 `loading`를 찾는 시도를 한다.

1. `foo.bar.slow-model-loading`
2. `foo.bar.loading` 이나 `foo.bar-loading`
3. `foo.loading` 이나 `foo-loading`
4. `loading` 이나 `application-loading`

`slow-model`자체의 경우, Ember는 `slow-model.loading`을 찾진 않을 것이지만, 나머지 계층 구조에서는 해당 문법을 따를 수 있따는 점에 유의해야한다. `slow-model`처럼 라우트에 대한 사용자 지정 로드 스크린을 만드는데 유용할 수 있다.

`foo.bar` 라우트에 액세스하면 Ember는 다음을 검색한다.

1. `foo.bar-loading`
2. `foo.loading` 이나 `foo-loading`
3. `loading` 이나 `application-loading`

`foo.bar.loading`은 이제 고려되지 점에 유의해야한다.

## `loading` 이벤트
다양한 `beforeModel` / `model` / `afterModel` 훅이 즉시 해결되지 않으면, 라우트에서 [`loading`](http://emberjs.com/api/classes/Ember.Route.html#event_loading)이벤트가 시작된다.

```javascript
// app/routes/foo-slow-model.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('slow-model');
  },
  actions: {
    loading(transition, originRoute) {
      let controller = this.controllerFor('foo');
      controller.set('currentlyLoading', true);
    }
  }
});
```

특정 라우트에서 `loading` 핸들러가 정의 되지 않은 경우, 이벤트는 트랜지션의 부모 라우트 위로 버블링하여 `application`라우트가 관리할 기회를 제공한다.

`loading` 핸들러를 사용할 때, 로딩 이벤트가 끝난 시점을 알 수 있는 트랜지션 프로미스를 사용할 수 있다:

```javascript
// app/routes/foo-slow-model.js
import Ember from 'ember';

export default Ember.Route.extend({
  ...
  actions: {
    loading(transition, originRoute) {
      let controller = this.controllerFor('foo');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
          controller.set('currentlyLoading', false);
      });
    }
  }
});
```

## `error` 하위 상태
Ember는 트랜지션 중 발생하는 오류의 경우에 `loading` 하위 상태와 유사한 방식을 제공한다.

기본 `loading` 이벤트 핸들러가 구현 되는 것과 마찬가지로, 기본 `error`핸들러는 입력할 수 있는 적절한 오류 하위 상태를 찾는다.(찾을 수 있느 경우에)

```javascript
// app/router.js
Router.map(function() {
  this.route('articles', function() {
    this.route('overview');
  });
});
```

`loading` 하위 상태와 마찬가지로, throw된 오류 또는 `articles.overview` 라우트의 `model` 훅(또는 `beforeModel`이나 `afterModel`)에서 반환된 거부된 프로미스에 대해 Ember는 아래의 순서대로 오류 템플릿이나 라우트를 찾는다:

1. `articles.overview-error`
2. `articles.error` 이나 `articles-error`
3. `error` 이나 `application-error`

위의 중 하나가 발견 되면 라우터는 즉시 URL 업데이트를 하지 않고 해당 하위 상태로 트랜지션한다. 오류에 대한 "이유" (즉 throw 된 예외 또는 프로미스 거부 값)은 해당 오류 상태의 `model`로 오류상태에 전달 된다.

오류 하위 상태의 모델 훅(`beforeModel`, `model`, `afterModel`)은 호출되지 않는다. 오류 하위 상태의 `setupController` 메소드만 모델로써 `error`와 함께 호출된다. 아래 예를 참조하라:

```javascript
setupController: function(controller, error) {
  Ember.Logger.debug(error.message);
  this._super(...arguments);
}
```

실행 가능한 오류 하위 상태를 찾을 수 없으면, 오류 메세지가 기록된다.

## `error` 이벤트

`articles.overview` 라우트의 모델 훅이 거부하는 프로미스를 반환하면 (예: 서버에서 오류를 반환하고 사용자가 로그인하지 않은 경우) 오류 이벤트가 해당 라우트에서 발생하고 위쪽으로 버블링이 생긴다. 이 `error` 이벤트를 처리하여 오류 메세지를 표시하거나, 로그인 페이지로 리다이렉션하는 등의 작업을 할 수 있다.

```javascript
// app/routes/articles-overview.js
import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').findAll('privileged-model');
  },
  actions: {
    error(error, transition) {
      if (error.status === '403') {
        this.replaceWith('login');
      } else {
        // 상위의 라우트에서 오류를 처리하도록 한다.
        return true;
      }
    }
  }
});
```

`loading` 이벤트와 유사하게 여러 라우트에 대해 동일한 코드를 작성하지 않도록 애플리케이션 수준에서 `error` 이벤트를 관리할 수 있다.
