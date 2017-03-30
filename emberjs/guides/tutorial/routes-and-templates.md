# 라우트와 템플릿(Routes and Templates) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/routes-and-templates/)

Super Rentals에서는 렌탈 목록을 보여주는 홈을 만들기를 원한다. 홈에서는 about 페이지와 contact 페이지로 이동 할 수 있어야 한다.

Ember는 애플리케이션 내에서 논리적이고 주소지정이 가능한 페이지를 정의하는 [강력한 라우트 매커니즘](guides/routing/introduction.md)을 사용한다.

## About 라우트

우리의 about 페이지를 만들어 보자. 애플리케이션에서 URL 주소를 지정가능한 새 페이지를 만들려면, Ember CLI를 이용하여 라우트를 생성해야한다.

`ember help generate`를 실행시키면, 다양한 Ember 리소스에 대한 파일을 자동으로 생성하기 위해 Ember와 함께 제공되는 도구를 볼 수 있다. `about` 라우트를 시작하기 위해 라우트 제너레이터를 사용하자.

```
ember generate route about
```

혹은 짧게,

```
ember g route about
```

제너레이터가 수행한 작업을 했는지 볼 수 있다:
```
installing route
  create app/routes/about.js
  create app/templates/about.hbs
updating router
  add route about
installing route-test
  create tests/unit/routes/about-test.js
```

라우트는 다음과 같은 파트로 구성된다:
1. `/app/router.js`의 엔트리, 라우트의 이름을 특정 URI에 맵핑한다.`(app/router.js)`
2. 라우트 핸들러 자바스크립트 파일, 라우트가 로드될때 어떤 동작이 실행 되어야하는지 지시한다. `(app/routes/about.js)`
3. 라우트가 나타내는 페이지를 설명하는 라우트 템플릿. `(app/templates/about.hbs)`

`/app/router.js`파일을 열면 `map`함수 안에 `this.route('about')`라는 *about* 라우트에 대한 한 줄을 추가한 것을 볼 수 있다.
`this.route(routeName)` 함수를 호출하면 사용자가 동일한 이름의 URI로 이동할 때 지정된 라우트 핸들러를 로드하도록 Ember 라우터에 지시한다. 이 경우 사용자가 `/about`으로 이동하면 `app/route/about.js` 라우트 핸들러가 사용된다. 자세한 내용은 [라우트 정의](guides/routing/defining-your-routes.md) 가이드를 참조하라.

```javascript
// app/router.js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
});

export default Router;
```

기본적으로 `about`라우트 핸들러는 `about.hbs`라는 템플릿을 로드한다. 즉, 우리가 원하는대로 `about.hbs` 템플릿을 렌더링하기 위해 `app/routes/about.js`의 어떤 것도 변경하지 않아도 된다는 뜻이다.

제너레이터를 통해 나온 모든 라우팅을 통해 우리는 템플릿을 코딩할 수 있다. `about` 페이지에는 사이트에 대한 약간의 정보가 담긴 HTML이 추가된다:

```hbs
<!-- app/templates/about.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
</div>
```

쉘에서 Ember 개발 서버를 시작하기 위해 `ember server`(혹은 `ember serve` 또는 짧게 `ember s`)를 실행하고, `http://localhost:4200/about`로 가서 새로운 애플리케이션이 실제로 작동하는지 확인할 수 있다.

## Contact 라우트

회사에 연락하기 위한 세부정보가 있는 다른 라우트를 만들어보자. 다시 한번 라우트 핸들러와 템플릿을 생성하는 것으로 시작한다.

```
ember g route contact
```

이 명렁어의 결과로 새로운 `app/router.js`에 `contact` 라우트와, 그에 해당하는 라우트 핸들러를 `app/routes/contact.js`에서 볼 수 있다.

라우트 템플릿 `app/templates/contact.hbs`에서 우리의 Super Rentals HQ에 연락하기 위한 세부 정보를 추가할 수 있다.

```hbs
<!-- app/templates/contact.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contact Us</h2>
  <p>Super Rentals Representatives would love to help you<br>choose a destination or answer
    any questions you may have.</p>
  <p>
    Super Rentals HQ
    <address>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </address>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </p>
</div>
```

이제 우리는 두번째 라우트를 완성했다. `http://localhost:4200/contact`로 이동하면 우리의 연락처 페이지를 볼 수 있다.

## 링크를 이용한 탐색(navigating)과 {{link-to}} 헬퍼
사용자가 우리의 사이트를 돌아다니기 위해 URL에 대해 알아야하는 상황을 피하고 싶으므로 각 페이지의 하단에 네비게이션 링크를 추가해보자. about 페이지에 contact 링크와, contact 페이지에 about 링크를 만들어 보자.

Ember에는 프레임웍과 인터렉션할 수 있는 기능을 제공하는 빌트인 템플릿 헬퍼가 있다. [`{{link-to}}`](guides/templates/links.md) 헬퍼는 Ember 라우트에 링크를 연결할 때 특별한 사용 편의 기능을 제공한다. 이 코드에서는 `{{link-to}}` 헬퍼를 사용하여 라우트간의 기본 링크를 수행한다.

```hbs
<!-- app/templates/about.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  {{#link-to 'contact' class="button"}}
    Contact Us
  {{/link-to}}
</div>
```

`{{link-to}}` 헬퍼는 링크할 라우트의 이름을 인수로 받아야한다. 현재 케이스에서는 `contact`이다. 이제  `http://localhost:4200/about`에 있는 about 페이지는 contact 페이지에 대한 링크를 가지고 있다.

이제 about과 contact 사이를 이리저리 탐색할 수 있도록 contact 페이지에 링크를 추가한다.


```hbs
<!-- app/templates/contact.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contact Us</h2>
  <p>Super Rentals Representatives would love to help you<br>choose a destination or answer
    any questions you may have.</p>
  <p>
    Super Rentals HQ
    <address>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </address>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </p>
  {{#link-to 'about' class="button"}}
    About
  {{/link-to}}
</div>
```

## Rentals 라우트
우리의 애플리케이션에서 사용자가 탐색할 수 있는 렌탈 목록을 표시하길 원한다. 이를 위해 세번째 라우트, `rentals`를 추가하자.

```
ember g route rentals
```

새롭게 생성된 `app/templates/rentals.hbs`에 렌탈 리스트 페이지의 몇 가지 기본 컨텐츠와 기본 마크업을 업데이트 하자. 나중에 이 페이지로 돌아와 실제 주택 렌탈 프로퍼티를 추가할 것이다.

```hbs
<!-- app/templates/rentals.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  {{#link-to 'about' class="button"}}
    About Us
  {{/link-to}}
</div>
```

## index 라우트
세가지 라우트를 추가해, 우리는 사이트의 루트 URI(`/`)에 대한 요청을 처리할 index 라우트를 만들 준비가 되었다. 렌탈 페이지를 애플리케이션의 메인 페이지로 만들고 싶고, 우리는 이미 그 라우트를 만들었다. 따라서, 우리는 index 라우트를 이미 만든 `rentals` 라우트로 포워드 하고싶다.

about과 contact 페이지를 만들었던 것 과 같은 프로세스로 `index`라는 새 라우트를 생성한다.

```
ember g route index
```

그럼 라우트 제너레이터가 만든 친숙한 결과물을 볼 수 있다:
```
installing route
  create app/routes/index.js
  create app/templates/index.hbs
installing route-test
  create tests/unit/routes/index-test.js
```

지금까지 만들었떤 다른 라우트 핸들러와 달리 `index` 라우트는 특별하다: 라우터에 매핑 엔트리가 필요로 하지 않는다. Ember에서 [중첩 라우트](guides/tutorial/adding-nested-routes.md)를 볼 때 엔트리가 필요하지 않은 이유에 대해 더 자세히 알아볼 것이다.

새로운 index 라우트에 대한 유닛 테스트를 구현하는 것으로 시작하자.

우리는 `/`로 방문하는 사람들이 `rentals`로 이동하게 만드는 것을 원한다. 유닛테스트는 원하는 라우트로 가기위해 라우트의 [`replaceWith`](http://emberjs.com/api/classes/Ember.Route.html#method_replaceWith) 메소드가 불려지는지 확인해야한다.

`replaceWith`는 라우트의 [`transitionTo`](guides/routing/redirecting.md) 함수와 비슷하다. 차이점은 `transitionTo`가 브라우저의 기록에 추가되고, `replaceWith`가 브라우저의 기록에서 현재 URL을 대체한다는 점이다. 우리는 `rentals` 경로를 홈으로 사용하고 싶기 때문에 `replaceWith` 함수를 사용할 것이다.

이 테스트에서는, 경로의 `replaceWith` 메소드를 스텁하고 호출할 때 `rentals`의 라우트가 전달된다고 assert하여 index 경로가 리다이렉션 되는지 확인한다.

`stub(스텁)`은 우리가 테스트하고 있는 객체에 제공하는 가짜 함수이다. 이미 존재하는 객체를 대신 한다. 이 경우 `replaceWith` 함수를 스텁하여 예상한대로 호출되는지 확인한다.

```javascript
// tests/unit/routes/index-test.js
import { moduleFor, test } from 'ember-qunit';

moduleFor('route:index', 'Unit | Route | index');

test('should transition to rentals route', function(assert) {
  let route = this.subject({
    replaceWith(routeName) {
      assert.equal(routeName, 'rentals', 'replace with route name rentals');
    }
  });
  route.beforeModel();
});
```

인덱스 라우트에는, 실제 `replaceWith` 호출을 추가한다.

```javascript
// app/routes/index.js
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    this.replaceWith('rentals');
  }
});
```

이제 루트 라우트 `/`를 방문하면 `/rentals`로 URL이 로드된다.

## 네이베이션에 배너 추가
애플리케이션의 각 경로에 버튼 스타일 링크를 제공하는 것 이외에도 애플리케이션의 제목과 기본 페이지를 모두 표시하는 공통 배너를 만들고자 한다.

애플리케이션 내의 모든 페이지에 무언가 보여주기 위해 애플리케이션 템플릿을 사용할 수 있다. 새 프로젝트를 만들 때 애플리케이션 템플릿이 생성된다. `app/templates/application.hbs`에 있는 어플리케이션 템플릿을 열고, 아래의 배너 네비게이션 마크업을 추가한다.

```hbs
<!-- app/templates/application.hbs -->
<div class="container">
  <div class="menu">
    {{#link-to 'index'}}
      <h1 class="left">
        <em>SuperRentals</em>
      </h1>
    {{/link-to}}
    <div class="left links">
      {{#link-to 'about'}}
        About
      {{/link-to}}
      {{#link-to 'contact'}}
        Contact
      {{/link-to}}
    </div>
  </div>
  <div class="body">
    {{outlet}}
  </div>
</div>
```

body의 `div` 엘리먼트에 `{{outlet}}`이 포함되어있는지 확인 해라. [`{{outlet}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_outlet)는 이 경우에 *about* 이나 *contact* 같은 현재 라우트에 의해 렌더링되는 내용의 placeholder이다.

이제 라우트와 링크를 추가했으므로, 라우트를 탐색하기 위해 만든 세가지 수용 테스트가 통과해야한다.

![인수 테스트 통과 이미지](guides/images/passing-navigation-tests.png)
