# 애드온 설치(Installing Addons) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/installing-addons/)

Ember는 손쉽게 프로젝트에 추가할수 있는 애드온이 있고, 풍부한 애드온의 생태계를 갖추고 있다. 애드온은 프로젝트에 다양한 기능을 제공하므로 시간을 절약하고 프로젝트에 집중할 수 있다.

애드온을 검색하려면 [Ember Observer](https://emberobserver.com/) 웹사이트에 방문하라. Ember Observer에서는 NPM에 게시된 Ember 애드온을 카탈로그화 하고 분류하여 다양한 기준에 따라 점수를 부여한다.

Super Rentals를 위해 우리는 두가지 애드온을 사용한다: [ember-cli-tutorial-style](https://github.com/toddjordan/ember-cli-tutorial-style)과 [ember-cli-mirage](http://www.ember-cli-mirage.com/)

## ember-cli-tutorial-style

Super Rentals에 CSS를 복사/붙여넣기 하는 대신, CSS를 튜토리얼에 즉시 추가해주는 [ember-cli-tutorial-style](https://github.com/ember-learn/ember-cli-tutorial-style)이라는 애드온을 만들었다. 애드온은 `ember-tutorial.css`라는 파일을 만들어 super-rentals의 `vendor` 디렉토리에 저장한다. Ember CLI가 실행되면, ember-tutorial의 CSS 파일을 가져와서 vendor.css(app/index.html에서 참조함)에 넣는다. `vendor/ember-tutorial.css`에 추가 스타일을 조정 할 수 있으며 변경 사항은 앱을 다시 시작할 때마다 적용 된다.

다음 명령을 실행해 애드온을 설치하라:

```
ember install ember-cli-tutorial-style
```

Ember 애드온은 npm 패키지이므로 `ember install`은 애드온을 `node_modules` 디렉토리에 설치하고, `package.json`에 엔트리를 만든다. 애드온이 성공적으로 설치 된 이후에 서버를 다시 시작하라. 재시작하면 새 CSS가 통합되어 브라우저를 새로고침하면 정상적으로 표시된다:

![새 CSS가 적용된 애플리케이션 스크린샷 이미지](guides/images/styled-super-rentals-basic.png)

## ember-cli-mirage

[Mirage](http://www.ember-cli-mirage.com/)는 Ember 수용 테스트에 종종 사용되는 클라이언트 HTTP 스터빙 라이브러리다. 이 튜토리얼의 경우에는 Mirage를 데이터 소스로 사용한다. Mirage를 사용하면 개발중인 앱에 임시 백엔드 서버를 두면서 가짜 데이터를 만들어 작업할 수 있다.

다음과 같이 Mirage 애드온을 설치하라:

```
ember install ember-cli-mirage
```

다른 쉘에서 `ember serve`를 실행 중이라면 Mirage를 빌드에 포함하도록 서버를 다시 시작하라.

`mirage/config.js`를 업데이트하여 이전에 정의한 렌탈을 리턴하도록 Mirage를 구성한다:

```javascript
// mirage/config.js
export default function() {
  this.namespace = '/api';

  this.get('/rentals', function() {
    return {
      data: [{
        type: 'rentals',
        id: 'grand-old-mansion',
        attributes: {
          title: 'Grand Old Mansion',
          owner: 'Veruca Salt',
          city: 'San Francisco',
          type: 'Estate',
          bedrooms: 15,
          image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
        }
      }, {
        type: 'rentals',
        id: 'urban-living',
        attributes: {
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          type: 'Condo',
          bedrooms: 1,
          image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg'
        }
      }, {
        type: 'rentals',
        id: 'downtown-charm',
        attributes: {
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          type: 'Apartment',
          bedrooms: 3,
          image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg'
        }
      }]
    };
  });
}
```

이렇게 설정하면 Ember Data가 `/api/rentals`에 GET 요청을 할때마다 Mirage가 이 Javascript 객체를 JSON으로 반환된다. 이 작업을 수행하려면 `/api`의 네임 스페이스에 요청을 하도록 어플리케이션에 기본 설정을 해야한다. 변경하지 않으면 애플리케이션의 `/rentals`에 대한 탐색에서 Mirage와 충돌한다.

설정 하기 위해, 애플리케이션 어댑터를 생성해야한다.

```
ember generate adapter application
```

이 어댑터는 Ember Data에서 [`JSONAPIAdapter`](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)를 확장했다.

```javascript
// app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api'
});
```
