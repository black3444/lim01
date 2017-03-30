# 중첩 라우트 추가하기(Adding Nested Routes) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/subroutes/)

지금까지 4개의 상위 라우트를 만들었다.

* `about` 라우트, 우리의 애플리케이션에 대한 정보를 제공한다.
* `contact` 라우트, 회사에 연락하는 방법에 대한 정보가 있다.
* `rental` 라우트, 사용자가 렌탈 주택을 둘러 볼 수 있다.
* `index` 라우트, `rentals` 라우트로 리디렉션하도록 설정했다.

`rentals` 라우트가 여러 기능을 제공할 예정이다. 우리의 [수용 테스트](guides/tutorial/setting-up-tests/)에서, 우리는 사용자가 렌탈을 검색하고 둘러보고 그뿐 아니라 개별 렌탈에 대한 자세한 정보를 볼 수 있도록 하고 있다. 이 요구사항을 충족시키기 위해 Ember의 [중첩 라우트 기능](guides/routing/defining-your-routes.md)을 사용하려고 한다.

이 섹션이 끝날 때까지 다음과 같은 새로운 경로를 만들려고합니다.
* `rentals/index` 라우트는 렌탈 페이지의 일반적인 정보를 표시하고, 또한 가능한 렌탈 목록을 표시한다. 사용자가 `rentals` URL을 방문하면 기본적으로 보여주는 중첩 라우트이다.
* `rentals/show` 라우트는 렌탈 페이지의 일반적인 정보도 표시하고, 또한선택한 렌탈에 대한 디테일 정보를 표시한다. `show` 라우트는 표시되는 렌탈의 id(예: `rentals/grand-old-mansion`)로 대체된다.

## 부모 라우트
이전에, [라우트 및 템플릿 튜토리얼](guides/tutorial/routes-and-templates.md)에서 `rentals` 라우트 설정을 했다.

이 라우트의 템플릿을 열면 라우트 일반 페이지 정보 아래에 outlet이 나타난다. 템플릿 맨 아래에 `{{outlet}}` 헬퍼가 있다. 이것은 활성화된 중첩 라우트가 렌더링 되는 곳이다.

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
{{#list-filter
   filter=(action 'filterByCity')
   as |rentals|}}
  <ul class="results">
    {{#each rentals as |rentalUnit|}}
      <li>{{rental-listing rental=rentalUnit}}</li>
    {{/each}}
  </ul>
{{/list-filter}}
{{outlet}}
```

상위 라우트를 사용한다는 것은 부모 라우트 템플릿의 모든 콘텐츠가 자식 경로를 탐색할 때 표시되므로 일반적인 지침, 내비게이션, 푸터나 사이드바를 추가할 수 있음을 의미한다.

## 중첩 인덱스 라우트 생성하기

생성할 첫번째 중첩 라우트는 인덱스 라우트이다. 인덱스 중첩 라우트는 기본 인덱스 라우트와 비슷하게 작동한다. 라우트가 제공되지 않을 때 렌더링하는 기본 라우트이다. 따라서 우리가 `/rentals`로 이동하려고 할 때, Ember는 렌탈 인덱스 루트를 중첩된 루트로써 로드하려고 시도한다.

인덱스 중첩 라우트를 만들려면 다음 명령을 실행한다:
```
ember g route rentals/index
```

만약 라우터(`app/router.js`)를 여는 경우, 대여부분 라인이 변경 된 것을 볼 수 있다. 이 추가된 `function() {}`은 자식 라우트(`this.route('index', {path: '/'});`를 함축하고 있음)를 필요하기때문에 필요하다.
```javascript
// app/router.js
Router.map(function() {
  this.route('about');
  this.route('contact');
  this.route('rentals', function() {});
});
```

애플리케이션의 `index`라우트가 라우터에 표시되지 않는거처럼 서브 라우트의 `index` 라우트도 라우터에 명시적으로 표시되지 않는다. Ember는 기본 동작이 사용자를 `index` 라우트로 이동시키는 것임을 알고 있다. 하지만, 사용자가 커스터마이즈하려는 경우 `index` 라우트를 추가할 수 있다. 예를들어 `this.route('index', {path: '/custom-path'})`처럼 지정하여 `index`라우트의 경로를 수정할 수 있다.

[Ember Data 사용하기](guides/tutorial/using-ember-data.md) 섹션에서 모든 렌탈항목을 가져오기 위한 호출을 추가했다. 새로이 `findAll`호출을 부모인 `rental` 라우트에서 새로운 서브 라우트로 옮김김으로써 `rentals/index`라우트를 구현해보자.

```javascript
// app/routes/rentals.js
export default Ember.Route.extend({
});
```

```javascript
// app/routes/rentals/index.js
export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('rental');
  }
});
```

이제 모든 렌탈 항목을 중첩된 라우트의 모델로 돌려놓았으므로, 렌탈 목록 마크업을 기본 라우트 템플릿에서 중첩된 라우트 index 템플릿으로 옮긴다.

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
{{outlet}}
```

```hbs
<!-- app/templates/rentals/index.hbs -->
{{#list-filter
   filter=(action 'filterByCity')
   as |rentals|}}
  <ul class="results">
    {{#each rentals as |rentalUnit|}}
      <li>{{rental-listing rental=rentalUnit}}</li>
    {{/each}}
  </ul>
{{/list-filter}}
{{outlet}}
```

마지막으로 새 중첩된 인덱스 라우트에 필터 동작을 사용할 수 있도록 컨트롤러를 만들어야 한다.

`ember g controller rentals/index` 명령으로 중첩된 라우트에 대한 index 컨트롤러를 만든다.

`app/controllers/rentals.js`의 파일을 `app/controllers/rentals/index.js`로 전체 컨트롤러 파일을 복사하는 것 대신, 자바스크립트의 가져오기/내보내기 기능을 활용하여 렌탈 컨트롤러를 rental/index 컨트롤러로 다시 내보낸다.

```javascript
// app/controllers/rentals/index.js
import RentalsController from '../rentals';

export default RentalsController;
```

## 중첩 디테일 라우트를 위한 데이터 설정
다음으로 특정 렌탈에 대한 정보를 나열 할 하위 라우트를 만들려고 한다. 이렇게 하려면 몇가지 파일을 업데이트해야한다. 특정한 렌탈을 찾기 위해 Ember Data의 `findRecord` 함수([자세한 내용은 "레코드 찾기"에서 보라](guides/models/finding-records.md))를 사용 해야한다. `findRecord` 함수는 유니크 키로 검색해야한다.

`show` 라우트에 있는 동안, 특정 렌탈에 대한 추가 정보를 표시하려고 한다.

이를 위해 [애드온 설치](guides/tutorial/installing-addons.md)섹션에서 추가했던 Mirage `config.js` 파일을 수정해야한다. 특정 렌탈을 반환하는 새로운 라우트 핸들러를 추가할 것이다:

```javascript
// mirage/config.js
export default function() {
  this.namespace = '/api';

  let rentals = [
    {
      type: 'rentals',
      id: 'grand-old-mansion',
      attributes: {
        title: "Grand Old Mansion",
        owner: "Veruca Salt",
        city: "San Francisco",
        type: "Estate",
        bedrooms: 15,
        image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
        description: "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
      }
    },
    {
      type: 'rentals',
      id: 'urban-living',
      attributes: {
        title: "Urban Living",
        owner: "Mike Teavee",
        city: "Seattle",
        type: "Condo",
        bedrooms: 1,
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg",
        description: "A commuters dream. This rental is within walking distance of 2 bus stops and the Metro."
      }
    },
    {
      type: 'rentals',
      id: 'downtown-charm',
      attributes: {
        title: "Downtown Charm",
        owner: "Violet Beauregarde",
        city: "Portland",
        type: "Apartment",
        bedrooms: 3,
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg",
        description: "Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet."
      }
    }
  ];

  this.get('/rentals', function(db, request) {
    if (request.queryParams.city !== undefined) {
      let filteredRentals = rentals.filter(function (i) {
        return i.attributes.city.toLowerCase().indexOf(request.queryParams.city.toLowerCase()) !== -1;
      });
      return { data: filteredRentals };
    } else {
      return { data: rentals };
    }
  });

  // 위의 렌탈 리스트에서 제공된 렌탈을 찾아 반환하라.
  this.get('/rentals/:id', function (db, request) {
    return { data: rentals.find((rental) => request.params.id === rental.id) };
  });
}
```

## 중첩된 디테일 라우트 생성하기

API가 개별 렌탈을 리턴할 준비가 되었으므로, `show` 서브 라우트를 생성할 수 있다. `rentals` 라우트를 생성하는 것과 마찬가지로, 우리는 `ember g`를 이용하여 중첩된 경로를 생성할 것이다.

```
ember g route rentals/show=
```

다음과 같은 출력이 표시된다:

```
installing route
  create app/routes/rentals/show.js
  create app/templates/rentals/show.hbs
updating router
  add route rentals/show
installing route-test
  create tests/unit/routes/rentals/show-test.js
```

라우터(`app/router.js`)의 변경 사항부터 살펴보자.

```javascript
// app/router.js
Router.map(function() {
  this.route('about');
  this.route('contact');
  this.route('rentals', function() {
    this.route('show');
  });
});
```

새로운 라우트는 `rentals` 라우트에 대해 중첩되어있다. 이것은 Ember에게 서브 라우트이며 `localhost:4200/rentals/show`로 액세스 할 수 있음을 알려준다.

애플리케이션에 어떤 렌탈에 엑세스하려는지 알려면, `show` 라우트의 패스를 렌탈 목록의 ID로 변경해야한다. URL을 단순화하여 `localhost:4200/rentals/id-for-rental`과 같은 모양으로 만드려고 한다.

그렇게 하기 위해, 라우트를 다음과 같이 수정한다:
```javascript
// app/router.js
Router.map(function() {
  this.route('about');
  this.route('contact');
  this.route('rentals', function() {
    this.route('show', { path: '/:rental_id' });
  });
});
```

이제 `rental_id`가 라우트로 전달된다.

## ID로 찾기
다음으로, 우리는 `show` 라우트를 편집하여 요청한 렌탈을 검색하려고 한다:
```javascript
// app/routes/rentals/show.js
export default Ember.Route.extend({
  model(params) {
    return this.get('store').findRecord('rental', params.rental_id);
  }
});
```

우리의 라우터의 `show` 패스에 `:rental_id`를 추가했으므로 이제 `model` 훅에서 `rental_id`를 사용할 수 있다. `find.get('store').findRecord('rental', params.rental_id)`를 호출할 때, Ember Data는 HTTP GET request를 이용하여 `/rental/our-id`에 쿼리를 날린다.([자세히 알아보기](guides/model/introduction.md))

## 템플릿에 렌탈 추가하기

다음으로 show 라우트의 템플릿(`app/templates/rentals/show.hbs`)을 업데이트하고 우리의 렌탈 정보를 나열한다.

```hbs
<!-- app/templates/rentals/show.hbs -->
<div class="jumbo show-listing">
  <h2 class="title">{{model.title}}</h2>
  <div class="right detail-section">
    <div class="detail owner">
      <strong>Owner:</strong> {{model.owner}}
    </div>
    <div class="detail">
      <strong>Type:</strong> {{rental-property-type model.type}} - {{model.type}}
    </div>
    <div class="detail">
      <strong>Location:</strong> {{model.city}}
    </div>
    <div class="detail">
      <strong>Number of bedrooms:</strong> {{model.bedrooms}}
    </div>
    <p class="description">{{model.description}}</p>
  </div>
  <img src="{{model.image}}" class="rental-pic">
</div>
```

이제 `localhost:4200/rentals/grand-old-mansion`로 이동하면 특정한 렌탈 항목에 대한 정보가 표시된다.

## 특정 렌탈에 연결하기
이제 개별 렌탈에 대한 페이지를 로드할 수 있으므로, `rental-listing` 컴포넌트에서 개별 페이지로 이동하는 링크를 추가(`link-to` 헬퍼를 사용하여)할 것이다. 여기서, `link-to` 헬퍼는 라우트의 이름과 렌탈 모델 객체를 인수로 받는다. 두번째 인수로 `link-to` 블럭 헬퍼에 두번째 인자로서 객체를 넘기면, 기본적으로 오브젝트를 모델의 ID로 직렬화하여 URL에 넣는다. 또는 간단히 하기  위해 `rent.id`를 전달 할 수도 있다.

제목을 클릭하면 해당 렌탈에 대한 세부 정보 페이지가 노출된다.

```hbs
<!-- app/templates/components/rental-listing.hbs -->
<article class="listing">
  <a {{action 'toggleImageSize'}} class="image {{if isWide "wide"}}">
    <img src="{{rental.image}}" alt="">
    <small>View Larger</small>
  </a>
  <h3>{{#link-to "rentals.show" rental}}{{rental.title}}{{/link-to}}</h3>
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

![결과 스크린샷](guides/images/subroutes-super-rentals-index.png)

## 마지막 체크

이 시점에서 우리가 처음 요구사항으로 작성한 [수용테스트 목록](guides/tutorial/setting-up-tests.md)을 포함하여 모든 테스트과 통과되어야한다.

![인수 테스트 통과 이미지](guides/images/all-acceptance-pass.png)

이 시점에서 [배포](guides/tutorial/deploying.md)를 수행하고 Super Rentals 애플리케이션을 전세계에 공유하거나, 이것을 다른 Ember 기능이나 애드온의 기반으로 사용할 수 있다. 이에 관계 없이 Ember와 함께 야심찬 애플리케이션을 만드는데 도움이 되길 바란다.
