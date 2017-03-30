# 서비스와 유틸리티(Services and Utilities) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/service/)

우리의 Super Rentals의 경우, 각 렌탈 위치가 표시된 지도를 표시할 수 있어야한다. 이 기능을 구현하기 위해 몇가지 Ember 개념을 사용한다:

1. 각 렌탈 목록에 지도를 표시하는 컴포넌트
2. 응용 프로그램의 다른 위치에서 랜더링 된 지도의 캐시를 유지하는 서비스
3. Google Maps API에서 지도를 만드는 유틸리티 함수

먼저 지도를 표시하고 Google Maps API를 사용하여 작업을 시작한다.

## 컴포넌트로 지도 보여주기

우선 지도에 렌탈 도시를 표시하는 컴포넌트를 추가한다.

```hbs
<!-- app/templates/components/rental-listing.hbs -->
<article class="listing">
  <a {{action 'toggleImageSize'}} class="image {{if isWide "wide"}}">
    <img src="{{rental.image}}" alt="">
    <small>View Larger</small>
  </a>
  <h3>{{rental.title}}</h3>
  <div class="detail owner">
    <span>Owner:</span> {{rental.owner}}
  </div>
  <div class="detail type">
    <span>Type:</span> {{rental-property-type rental.type}} - {{rental.type}}
  </div>
  <div class="detail location">
    <span>Location:</span> {{rental.city}}
  </div>
  <div class="detail bedrooms">
    <span>Number of bedrooms:</span> {{rental.bedrooms}}
  </div>
  {{location-map location=rental.city}}
</article>
```

그런 다음 Ember CLI를 이용하여 맵 컴포넌트를 만든다.

```
ember g component location-map
```

위의 커맨드를 입력하면 세 파일을 만든다: 컴포넌트 JavaScript 파일, 템플릿, 그리고 테스트 파일. 컴포넌트에서 수행할 작업을 생각해보기 위해 먼저 테스트를 구현한다.

이 경우 Google Maps 서비스가 지도를 표시하도록 처리할 계획이다. 우리 컴포넌트의 일은 지도 서비스의 결과(지도 엘리먼트)를 가져와서 컴포넌트의 템플릿 엘리먼트에 추가하는 것이다.

이 동작을 검증하는 테스트를 제한하기위해, 우리는 등록 API를 이용하여 지도 서비스의 스텁을 제공한다. 스텁은 애플리케이션의 실제 객체 대신 사용되며 동작을 시뮬레이트한다. 스텁 서비스에서 `getMapElement`라는 위치를 기반으로 지도를 가져오는 메소드를 정의한다.

```javascript
// tests/integration/components/location-map-test.js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

let StubMapsService = Ember.Service.extend({
  getMapElement(location) {
    this.set('calledWithLocation', location);
    // 여기에 div를 작성하여 맵 서비스를 시뮬레이트한다.
    // 맵서비스를 생성한 다음, 맵 엘리먼트를 캐시한다.
    return document.createElement('div');
  }
});

moduleForComponent('location-map', 'Integration | Component | location map', {
  integration: true,
  beforeEach() {
    this.register('service:maps', StubMapsService);
    this.inject.service('maps', { as: 'mapsService' });
  }
});

test('should append map element to container element', function(assert) {
  this.set('myLocation', 'New York');
  this.render(hbs`{{location-map location=myLocation}}`);
  assert.equal(this.$('.map-container').children().length, 1, 'the map element should be put onscreen');
  assert.equal(this.get('mapsService.calledWithLocation'), 'New York', 'a map of New York should be requested');
});
```

각 테스트 전에 실행되는 `beforeEach` 함수에서 우리는 암시적 함수 `this.register`를 사용하여 맵 서비스 대신 스텁 서비스를 등록 한다. 등록 하면 Ember 어플리케이션에서 템플릿에서 컴포넌트를 로드하거나, 이 경우처럼 서비스를 삽입(인젝션)하는 것과 같이 객체를 사용할 수 있다.

`this.inject.service` 함수를 호출하면 방금 등록한 서비스가 테스트의 컨텍스트(문맥)에 삽입되므로, 각 테스트는 `this.get('mapsService')`를 통해 서비스를 액세스할 수 있다. 이 예제에서 스텁의 `calledWithLocation`은 컴포넌트의 전달된 위치로 설정된다.

테스트를 통과하려면 컴포넌트 템플릿에 컨테이너 엘리먼트를 추가하라.

```hbs
<!-- app/templates/components/location-map.hbs -->
<div class="map-container"></div>
```

그런 다음 컴포넌트를 업데이트하여 맵 출력을 내부 컨테이너 요소에 추가하라. 지도 서비스 인젝션을 추가하고 제공된 위치를 인자로 `getMapElement`를 호출한다.

[컴포넌트 생명 주기(라이프 사이클)](guides/components/the-component-lifecycle.md) 훅인 `didInsertElement`을 구현하여 서비스에서 얻은 map요소를 추가한다. 이 함수는 컴포넌트의 마크업에 돔에 삽입 된 후에 렌더링 시간에 실행 된다.

```javascript
// app/components/location-map.js
import Ember from 'ember';

export default Ember.Component.extend({
  maps: Ember.inject.service(),

  didInsertElement() {
    this._super(...arguments);
    let location = this.get('location');
    let mapElement = this.get('maps').getMapElement(location);
    this.$('.map-container').append(mapElement);
  }
});
```

## 서비스로 맵을 가져오기

이 시점에서 우리는 통합테스트를 통과한 컴포넌트를 가지고 있어야 한다. 하지만 웹 페이지를 볼 때, 지도가 나타나지 않는다. 실제로 지도를 생성하기 위해 지도 서비스를 구현한다.

[서비스](guides/application-concerns/services.md)를 통해 지도 API에 액세스하면 몇가지 이점이 있다.

* [서비스 로케이터](https://en.wikipedia.org/wiki/Service_locator_pattern)로 주입된다. 즉, 맵 API를 사용하는 코드에서 맵 API를 추상화하여 쉽게 리팩터링 및 유지보수를 할 수 있다.
* 게으른 로드(lazy-load)이다. 즉, 처음 호출 될때까지 초기화 되지 않는다. 경우에 따라 앱의 프로세서 로드 및 메모리 사용량을 줄일 수 있다.
* 캐시 맵 데이터를 허용하는 싱글톤이다.
* 라이프 사이클을 따른다. 즉, 서비스가 중지되었을 떄 클린업 코드를 실행하여 메모리 누수나 불필요한 프로세싱같은 것을 방지한다.

Ember CLI를 통해 서비스를 생성하여 서비스 파일을 생성하고, 단위 테스트를 시작하자.
```
ember g service maps
```

이 서비스는 위치에따라 지도 요소의 캐시를 유지한다. 지도 요소가 캐시에 있으면 서비스에서 이를 반환하고, 그렇지 않으면 새로은 요소를 만들어 캐시에 추가한다.

서비스를 테스트하려면, 이전에 로드된 위치를 캐시에서 가져오고 유틸리티를 사용하여 새 위치를 생성한다고 어설트한다.
```javascript
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const DUMMY_ELEMENT = {};

let MapUtilStub = Ember.Object.extend({
  createMap(element, location) {
    this.assert.ok(element, 'createMap called with element');
    this.assert.ok(location, 'createMap called with location');
    return DUMMY_ELEMENT;
  }
});

moduleFor('service:maps', 'Unit | Service | maps', {
  needs: ['util:google-maps']
});

test('should create a new map if one isnt cached for location', function (assert) {
  assert.expect(4);
  let stubMapUtil = MapUtilStub.create({ assert });
  let mapService = this.subject({ mapUtil: stubMapUtil });
  let element = mapService.getMapElement('San Francisco');
  assert.ok(element, 'element exists');
  assert.equal(element.className, 'map', 'element has class name of map');
});

test('should use existing map if one is cached for location', function (assert) {
  assert.expect(1);
  let stubCachedMaps = Ember.Object.create({
    sanFrancisco: DUMMY_ELEMENT
  });
  let mapService = this.subject({ cachedMaps: stubCachedMaps });
  let element = mapService.getMapElement('San Francisco');
  assert.equal(element, DUMMY_ELEMENT, 'element fetched from cache');
});
```

이 테스트는 더미 객체를 반환된 map요소로 가정하고 사용한다. 이것은 캐시가 접근되었다는 것을 어설트할때에만 사용되기 때문에 모든 오브젝트가 될 수 있다. 또한 캐시 객체에서 위치가 `카멜케이스화(camelized)`되어 키로써 사용할 수 있다.

이제 다음과 같이 서비스를 구현하라. 지정된 위치에 대한 지도가 이미 있는지 확인하고 있으면 그 위치를 사용하고, 없으면 Google Maps 유틸리티를 호출하여 지도를 만든다. Ember 유틸리티 뒤에있는 Maps API와의 상호 작용을 추상화하여 Google에 네트워크 요청없이 서비스를 테스트할 수 있다.


```javascript
// app/services/maps.js
import Ember from 'ember';
import MapUtil from '../utils/google-maps';

export default Ember.Service.extend({

  init() {
    if (!this.get('cachedMaps')) {
      this.set('cachedMaps', Ember.Object.create());
    }
    if (!this.get('mapUtil')) {
      this.set('mapUtil', MapUtil.create());
    }
  },

  getMapElement(location) {
    let camelizedLocation = location.camelize();
    let element = this.get(`cachedMaps.${camelizedLocation}`);
    if (!element) {
      element = this.createMapElement();
      this.get('mapUtil').createMap(element, location);
      this.set(`cachedMaps.${camelizedLocation}`, element);
    }
    return element;
  },

  createMapElement() {
    let element = document.createElement('div');
    element.className = 'map';
    return element;
  }
});
```

## Google 지도 사용 가능하게 하기

지도 유틸리티를 구현하기 전에 Ember 앱에서 서드파티 지도 API를 사용할 수 있도록 해야한다. Ember에 서드파티 라비르러리를 포함하는 방법은 여러가지가 있다. 의존성을 추가 할 필요가 있을 때, [의존성 관리](guides/addons-and-dependencies/managing-dependencies.md)에 대한 가이드 섹션을 시작으로 참조하라.

Google은 지도 API를 리모트 스크립트로 제공하므로 curl을 사용하여 우리의 프로젝트 벤더 디렉토리에 다운로드 한다.

프로젝트의 루트 디렉토리에서 다음 명령을 실행하여, Google 맵 스크립트를 프로젝트 벤더 폴더에 `gmaps.js`로 저장하라. `Curl`은 UNIX 커맨드 이므로, Windows를 사용하는 경우 [Window bash 지원](https://msdn.microsoft.com/en-us/commandline/wsl/about)을 활용 하거나 대체 방법을 사용하여 스크립트를 벤더 디렉토리에 다운로드해야한다.

```
curl -o vendor/gmaps.js "https://maps.googleapis.com/maps/api/js?v=3.22"
```

밴더 디렉토리에 들어가면 스크립트를 앱에 내장할 수 있따. Ember CLI에게 빌드 파일을 사용하여 임포트하라고 하면 된다:

```javascript
// ember-cli-build.js

/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('vendor/gmaps.js');

  return app.toTree();
};
```

## Google Maps API에 액세스하기

이제 애플리케이션에서 사용할 수 있는 지도 API를 만들었으므로 지도 유틸리티를 만들 수 있다. 유틸리티 파일은 Ember CLI를 이용하여 생성할 수 있다.

```
ember g util google-maps
```

CLI `generate util` 커맨드는 유틸리티 파일과 단위 테스트를 생성한다. 단위 테스트코드는 Google 코드를 테스트할 것이 아니므로 삭제합니다. 우리의 애플리케이션은 지도요소를 만들기 위해 `google.maps.Map`을, 우리의 위치의 좌표를 찾기 위해`google.maps.Geocoder`을, 그리고 찾은 위치를 기반으로 우리의 지도를 핀을 꼽기위해 `google.maps.Marker`을 사용하는 `createMap`이라는 함수가 필요하다.

```javascript
// app/utils/google-maps.js
import Ember from 'ember';

const google = window.google;

export default Ember.Object.extend({

  init() {
    this.set('geocoder', new google.maps.Geocoder());
  },

  createMap(element, location) {
    let map = new google.maps.Map(element, { scrollwheel: false, zoom: 10 });
    this.pinLocation(location, map);
    return map;
  },

  pinLocation(location, map) {
    this.get('geocoder').geocode({address: location}, (result, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        let geometry = result[0].geometry.location;
        let position = { lat: geometry.lat(), lng: geometry.lng() };
        map.setCenter(position);
        new google.maps.Marker({ position, map, title: location });
      }
    });
  }
});
```

서버를 다시 시작한 후에 프론트 페이지에 표시되는 end to end 맵 기능을 볼 수 있다.

![결과 스크린샷](guides/images/styled-super-rentals-maps.png)

## 수용 테스트에서 서비스 스텁

마지막으로, 우리는 새로운 서비스를 고려하여 수용 테스트를 업데이트 한다. 지도가 표시되는지 확인하는 것도 좋지만, 매번 우리의 수용 테스트를 돌릴때마다 Google Maps API를 사용하고 싶지 않다. 이 튜토리얼에서는 맵 DOM이 화면에 붙도록 컴포넌트 통합 테스트를 사용할 것이다. 지도 요청 한도를 넘지 않기 위해 우리는 수락테스트에서 지도 서비스를 완성한다.

종종 서비스는 자동화된 테스트에 포함되지 않는 서드파티 API에 연결된다. 이러한 서비스를 스텁하기 위해서는 동일한 API를 구현하지만, 문제가되는 종속성은 없는 스텁 서비스를 등록하기만 하면 된다.

수용 테스트에 가져온 후 다음 코드를 추가하라:

```javascript
// /tests/acceptance/list-rentals-test.js
import { test } from 'qunit';
import moduleForAcceptance from 'super-rentals/tests/helpers/module-for-acceptance';
import Ember from 'ember';

let StubMapsService = Ember.Service.extend({
  getMapElement() {
    return document.createElement('div');
  }
});

moduleForAcceptance('Acceptance | list rentals', {
  beforeEach() {
    this.application.register('service:stubMaps', StubMapsService);
    this.application.inject('component:location-map', 'maps', 'service:stubMaps');
  }
});
```

여기서 일어나는 일은 단순히 비어있는 div를 만드는 스텁 맵 서비스를 추가하는 것이다. 그런 다음 Ember의 [레지스트리](guides/applications/dependency-injection.md)에 넣고 이를 사용하는 `location-map` 컴포넌트에 주입한다. 그 방법으로 컴포넌트가 생성될때마다 스텁 맵 서비스가 Google 맵 서비스를 대신 주입된다. 이제 수용 테스트를 실행하면 테스트가 실행될 때 지도가 렌더링 되지 않음을 알 수 있다.

![테스트 스크린샷](guides/images/acceptance-without-maps.png)
