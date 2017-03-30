# 당신의 앱 생성하기(Creating Your App) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/ember-cli/)

Ember 튜토리얼에 온 것을 환영한다. 이 자습서는 전문적인 어플리케이션을 만드는 동안 기본 Ember의 개념을 소개하기 위한 것이다. 만약 튜토리얼 중 어느 시점에라도 문제가 발생하면 https://github.com/ember-learn/super-rentals 를 방문하여 완성 앱 작동 예제를 참조하라.

Ember의 CLI(Ember의 커맨드 라인 인터페이스)는 표준 프로젝트 구조, 개발 도구 세트, 애드온 시스템을 제공한다. 이를 통해 Ember 개발자는 앱을 빌드하고 앱의 구조를 구축하는 것 대신 앱을 만드는 것에 집중할 수 있다. 커맨드 라인에서 `ember --help`를 통해 Ember CLI가 제공하는 명령을 빠르게 보여준다. 특정 명령에 대한 자세한 내용을 보려면 `ember help <명령어명>`을 입력하라.

## 새 앱 생성하기
새 프로젝트를 만들기 위해 Ember CLI를 이용하여 `new` 커맨드를 사용하라. 다음 섹션의 튜토리얼을 준비하면서 `super-rentals`라는 이름으로 앱을 만들 수도 있다.

```
ember new super-rentals
```

## 디렉토리 구조
위의 `new` 명령은 하단의 파일과 디렉토리가 있는 프로젝트 구조를 생성한다.
```
|--app
|--config
|--public
|--node_modules
|--tests
|--vendor

bower.json
ember-cli-build.js
package.json
README.md
testem.js
```

Ember CLI가 생성하는 폴더와 파일을 살펴보자.

**app**: 모델, 컴포넌트, 라우트, 템플릿과 스타일에 대한 폴더 및 파일이 저장되는 곳이다. Ember 프로젝트에서 대부분의 코딩은 이 폴더에서 발생한다.

**bower.json**: Bower는 의존성(Dependency) 관리 도구이다. Ember CLI에서 front-end 플러그인과 컴포넌트 의존성(HTML, CSS, JavaScript 등)을 관리하는데 사용된다. 모든 Bower 컴포넌트는 `bower_components` 디렉토리에 설치된다. `bower.json`을 열면 Ember, Ember CLI, Shims, QUnit(테스팅용)을 포함하여 자동으로 설치된 의존성 목록이 표시 된다. 만약 부트스트랩과 같은 추가 front-end 의존성을 추가하면 이 파일에 추가 되고, `bower_components` 디렉토리에 추가 된다.

**config**: config 디렉토리에는 앱의 설정을 구성할 수 있는 `environmnet.js`가 있다.

**node_modules / package.json**: 이 디렉토리와 파일은 npm으로부터 왔다. npm은 Node.js의 패키지 매니저이다. Ember는 Node로 제작되었으며, 다양한 Node.js 모듈을 사용하여 작동한다. `package.json` 파일을 통해 앱의 현재 npm의 의존성 목록을 관리한다. 설치한 모든 EMBER CLI 애드온도 여기에 있다. `package.json`에 나열된 패키지는 node_modules 디렉토리에 설치 된다.

**public**: 이 디렉토리는 이미지와 폰트같은 에셋이 포함 되어 있다.

**vendor**: 이 디렉토리는 Bower가 관리하지않는 front-end 의존성(JavaScript 나 CSS 같은)이 있는 곳이다.

**test / testem.js**: 어플리케이션에 대한 자동화된 테스트가 `tests` 폴더에 저장되며, Ember CLI의 테스트 러너(test runner)인 **testem** 은 `testem.js`에 설정 되어 있다.

**ember-cli-build.js**: 이 파일은 Ember CLI가 어떻게 앱을 빌드해야하는지 설명한다.

## ES6 모듈
`app/router.js`를 살펴보면 익숙하지 않은 구문이 있을 것이다.

```javascript
// app/router.js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
});

export default Router;
```

Ember CLI는 어플리케이션 코드를 구성하기 위해 ECMAScript2015(짧게 혹은 전에 알려진대로 ES6라고 부른다.) 모듈을 사용한다. 예를 들어, `import Ember from 'ember'`은 `Ember`변수로 실제 Ember.js 라이브러리에 액세스 할 수 있다. 그리고 `import config from './config/environment';`는 `config` 변수로 앱의 설정 데이터에 접근할 수 있게 한다. `const`는 읽기전용 변수로 선언하여 실수로 다른 곳으로 다시 할당 되지 않게 한다. 파일의 끝에 `export default Router;`를 통해 `Router`변수를 앱의 다른 부분에서 사용할 수 있도록 한다.

## Ember 업그레이드
튜토리얼 시작전에 Ember 및 Ember Data의 최신버전이 설치 되어있는지 확인 해라. `bower.json`의 `ember`의 버전이 이 가이드의 왼쪽 상단의 버전 넘버보다 낮으면, `bower.json`의 버전 넘버를 업데이트하고 `bower install`을 실행하라. 똑같이 `package.json`의 `ember-data`의 버전이 낮으면, 버전 넘버를 업데이트하고 `npm install`을 실행하라.

## 개발 서버
새로운 프로젝트가 준비되면 Ember 개발 서버를 시작하여 모든 것이 제대로 작동하는지 확인할 수 있다.

```
ember server
```

혹은 짧게:
```
ember s
```
http://localhost:4200 으로 이동하면 기본 시작화면이 표시된다. `app/templates/application.hbs` 파일을 추가하면 시작화면이 우리만의 콘텐츠로 변경 될 것이다.

![초기 화면](guides/images/default-welcome-page.png)
