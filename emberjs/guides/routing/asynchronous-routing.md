# 비동기 라우팅(Asynchronous Routing) [(원본)](https://guides.emberjs.com/v2.11.0/routing/asynchronous-routing/)

이 섹션에서는 라우터의 고급 기능과 앱의 복잡한 비동기 로직을 처리하는 기능에 대해 설명한다.

## 프로미스에 대하여...

라우터에서 비동기 로직을 처리하는 Ember의 접근 방식은 프로미스 개념을 많이 사용한다. 즉, 프로미스는 최종 값을 나타내는 대상이다. 프로미스는 *fulfill(이행)* (값을 성공적으로 결정) 혹은 *reject(거부)* (값을 결정하지 못함)을 할 수 있다. 이 최종 값을 확정하거나 약속이 거부 되는 경우를 처리하는 방법은 프로미스의 [`then()`](http://emberjs.com/api/classes/RSVP.Promise.html#method_then) 메소드를 사용하는 것이다. 이 메서드는 두개의 선택적 콜백(하나는 이행, 다른 하나는 거부)를 허용한다. 프로미스가 이행되면 이행된 값을 유일한 인자로 하여 이행 핸들러가 호출되고, 프로미스가 거부되면 거절 이유를 호출하는 거부 핸들러가 호출된다. 예를 들어:

```javascript
let promise = fetchTheAnswer();

promise.then(fulfill, reject);

function fulfill(answer) {
  console.log(`The answer is ${answer}`);
}

function reject(reason) {
  console.log(`Couldn't get the answer! Reason: ${reason}`);
}
```

프로미스의 힘은 순차적으로 비동기 작업을 수행하기 위해 함께 묶일 수 있다는 점에서 비롯된다:

```javascript
// 참고: jQuery AJAX 함수는 프로미스를 반환
let usernamesPromise = Ember.$.getJSON('/usernames.json');

usernamesPromise.then(fetchPhotosOfUsers)
                .then(applyInstagramFilters)
                .then(uploadTrendyPhotoAlbum)
                .then(displaySuccessMessage, handleErrors);
```

위의 예에서, `fetchPhotosOfUsers`, `applyInstagramFilters`, 또는 `uploadTrendyPhotoAlbum` 메소드가 거부하는 프로미스를 반환하면 `handleErrors`가 실패 이유와 함께 호출 된다. 이런 식으로, 프로미스는 중첩된 콜백 후 중첩된 콜백의 오른쪽(확인 필요) 흐름을 방지하는 try-catch 문의 비동기 형태에 가깝고, 애플리케이션에서 복잡한 비동기 로직을 관리하는데 필요한 유연성을 높일 수 있다.

이 가이드에서 프로미스를 사용할 수 있는 여러가지 방법을 모두 조사하지는 않겠지만, 더 자세한 소개를 원한다면 Ember가 사용하는 프로미스 라이브러리인 [RSVP]('https://github.com/tildeio/rsvp.js')에 대한 추가 정보를 살펴보라.

## 라우터의 프로미스를 위한 일시 중지
경로간의 트랜지션을 할 때, Ember 라우터는 트랜지션이 끝날 때 라우트 컨트롤러에 전달되는 모든 모델을 (`model` 훅을 통해) 수집한다. 만약 `model` 훅(혹은 관련된 `beforeModel` 또는 `afterModel)`)이 일반적인(프로미스가 아닌) 객체나 배열을 돌려주는 경우 트랜지션은 즉시 완료된다. 하지만 `model` 훅(혹은 관련된 `beforeModel` 또는 `afterModel)`)이 프로미스를 반환하면 (또는 프로미스가 `transitionTo`에 대한 인수로 제공된 경우) 해당 프로미스가 충족되거나 거부 될때까지 트랜지션이 일시 중지된다.

라우터는 그것에 정의된 `then()` 메소드가 있는 객체를 프로미스로 간주한다.

프로미스가 이행되면 트랜지션은 중단 된 지점부터 시작하여 다음(자녀) 라우트 모델을 확정하기 시작하고, 프로미스인 경우 일시 중지하는등 모든 목적지 라우트 모델이 확정될 때 까지 계속한다.

간단한 예제:
```javascript
// app/routes/tardy.js
import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve({ msg: 'Hold Your Horses' });
      }, 3000);
    });
  },

  setupController(controller, model) {
    console.log(model.msg); // "Hold Your Horses"
  }
});
```

`route:tardy`로 트랜지션할 때, `model()`훅이 호출되어 3초 후까지 확정되지 않은 프로미스를 반환한다. 그동안 라우터는 중간 트랜지션에서 일시 중지된다. 프로미스가 이행되면 라우터는 트랜지션을 계속 수행하고 결국 `route:tardy`의 `setupController()`훅을 확정한 객체와 함께 호출한다.

이 pause-on-promise 동작은 새 템플릿을 표시하기 전에 라우트의 데이터가 완전히 로드 되도록 보장해야할 때 매우 유용하다.

## 프로미스가 거부 될 때...

모델 프로미스가 이행될 때의 케이스를 다루었지만, 거부하게 되면 어떻게 해야하는가?

기본적으로, 트랜지션 중에 모델 프로미스가 거부되면 트랜지션이 중단 되고 대상 라우트 템플릿이 렌더링 되지 않으며, 콘솔에 오류가 기록된다.

라우트의 `actions` 해시에서 `error` 핸들러를 통해 이 오류 처리 로직을 설정할 수 있다. 약속이 거부되면, 해당 라우트의 `error` 이벤트가 발생하고, 사용자 정의 에러 핸들러에 의해 처리 되지 않는한 `route:application`의 기본 에러 핸들러로 버블링된다. 예:
```javascript
// app/routes/good-for-nothing.js
import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.reject("FAIL");
  },

  actions: {
    error(reason) {
      alert(reason); // "FAIL"

      // 여기에서 다른 라우트로 트랜지션 될 수 있다., 예:
      // this.transitionTo('index');

      // 이 오류 이벤트를 버블링 하려면 아래 줄의 주석 처리를 제거하라:
      // return true;
    }
  }
});
```

위의 예시에서, 에러 이벤트는 `route:good-for-nothing`의 에러핸들러에서 멈추고 버블링을 계속하지 않는다. 이벤트가 `route:application`까지 계속 버블링 되게 하려면 에러 핸들러에서 true를 반환하면 된다.

## 거부에서 복구하기
거부 된 모델은 트랜지션을 중지한다. 하지만 프로미스는 체이닝가능하기 때문에 `model` 훅 내에서 프로미스 거부를 포착할 수 있고, 이행으로 바꾸어 트랜지션을 중단시키지 않을 수 있다.

```javascript
// app/routes/funky.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return iHopeThisWorks().catch(function() {
      // 프로미스가 거부되고, 라우트의 모델로 사용할 일부 기본 값으로 이행하고, 트랜지션을 계속 진행한다.
      return { msg: 'Recovered from rejected promise' };
    });
  }
});
```
