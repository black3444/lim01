# 트랜지션 방지 및 재시도(Preventing and Retrying Transitions) [(원본)](https://guides.emberjs.com/v2.11.0/routing/preventing-and-retrying-transitions/)

라우트 전환(트랜지션) 중에 Ember 라우터는 트랜지션과 관련된 라우트 다양한 훅으로 트랜지션 객체를 전달한다. 이 트랜지션 객체에 액세스 할 수 있는 모든 훅은 `transition.abort()`를 호출하여 트랜지션을 즉시 중단 할 수 있으며, 트랜지션 객체가 저장되어있는 경우 `transition.retry()`를 호출하여 다시 시도할 수 있다.

## `willTransition`을 통한 트랜지션 방지
`{{link-to}}`, `transitionTo`, 혹은 URL변경을 통해 트랜지션이 시도되면, 현재 활성화된 라우트의 `willTransition` 액션이 실행 된다. 이렇게하면 최하위 경로부터 시작하여 트랜지션이 발생할지 여부를 결정할 수 있는 기회가 각 활성화된 라우트에 제공된다.

라우트가 복잡한 양식을 표시하고 있고 유저가 작성하는 중에 유저가 실수로 뒤로 탐색했다고 생각해보자. 트랜지션이 방지되지 않는 이상 사용자는 양식에서 작성한 모든 내용을 잃어버릴 수 있어 매우 실망스러운 유저 경험을 만들 수 있다.

이 상황을 처리할 수 있는 방법은 다음과 같다:

```javascript
// app/routes/form.js
import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition(transition) {
      if (this.controller.get('userHasEnteredData') &&
          !confirm('Are you sure you want to abandon progress?')) {
        transition.abort();
      } else {
        // 부모 라우트가 중단 할지 여부를 결정할 수 있도록 `willTransition` 액션을 버블링 한다.
        return true;
      }
    }
  }
});
```

사용자가 `{{link-to}}` 헬퍼를 클릭하거나, `transitionTo`를 사용하여 앱이 트랜지션을 시작하면, 트랜지션은 중단되고 URL은 변경되지 않는다. 하지만, 브라우저 뒤로가기 버튼을 사용하여 `route:form`에서 이동하거나, 사용자가 수동으로 URL을 변경하면, `willTransition` 액션이 호출되기 전에 새 URL이 탐색 된다. `willTransition`이 `transition.abort()`를 호출하더라도 브라우저가 새 URL을 표시한다.

## `model`, `beforeModel`, `afterModel`내에서 트랜지션 중단

[비동기식 라우팅](guides/routing/asynchronous)에 설명된 `model`, `beforeModel`, `afterModel` 훅은 각각 트랜지션 객체로 호출된다. 이렇게 하면 대상 라우트가 트랜지션 시도를 중단할 수 있다.

```javascript
// app/routes/disco.js
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    if (new Date() > new Date('January 1, 1980')) {
      alert('Sorry, you need a time machine to enter this route.');
      transition.abort();
    }
  }
});
```

## 트랜지션 저장 및 재전송
중단된 트랜지션은 나중에 다시 시도할 수 있다. 이런 일반적인 사용 사례는 인증된 경로를 통해 사용자를 로그인 페이지로 리다이렉션 한 다음 로그인한 후 다시 인증된 경로로 리다이렉션하는 것이다.

```javascript
// app/routes/some-authenticated.js
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    if (!this.controllerFor('auth').get('userIsLoggedIn')) {
      let loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  }
});
```

```javascript
// app/controllers/login.js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login() {
      // Log the user in, then reattempt previous transition if it exists.
      let previousTransition = this.get('previousTransition');
      if (previousTransition) {
        this.set('previousTransition', null);
        previousTransition.retry();
      } else {
        // Default back to homepage
        this.transitionToRoute('index');
      }
    }
  }
});
```
