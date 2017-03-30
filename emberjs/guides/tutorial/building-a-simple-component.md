# 간단한 컴포넌트 만들기(Building a Simple Component) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/simple-component/)

사용자가 hbs 목록을 살펴볼 때, 결정을 내리는데 도움이 되는 인터렉션 가능한 옵션이 필요할 수 있다. 각 렌탈에 대한 이미지 사이즈를 토글할 수 있는 기능을 추가해보자. 이 기능을 추가 하기 위해 컴포넌트를 사용할 것이다.

각 렌탈의 동작을 관리하는 `rental-listing` 컴포넌트를 만들어 보자. 사용 가능한 HTML 엘리먼트 요소와 충돌하지 않도록 모든 컴포넌트에는 대쉬(-)를 필요로 한다. 그러므로 `rental`은 허용되지 않지만 `rental-listing`은 허용 된다.

```
ember g component rental-listing
```

Ember CLI는 다음과 같이 컴포넌트에 대한 몇가지 파일을 생성한다:
```
installing component
  create app/components/rental-listing.js
  create app/templates/components/rental-listing.hbs
installing component-test
  create tests/integration/components/rental-listing-test.js
```

우리가 원하는 이미지 토글 동작의 실패 테스트를 구현하는 것으로 시작한다.

통합 테스트를 위해 rental 모델의 프로퍼티를 모두 가진 스텁 rental을 만든다. 우리는 컴포넌트가 처음에 `wide` 클래스 없이 렌더링 된다고 가정한다. 이미지를 클릭하면 엘리먼트에 `wide` 클래스가 추가되고, 두번째로 클릭하면 `wide` 클래스가 사라진다. 우리는 이미지를 찾는데에 CSS 선택자 `.image`를 사용할 것이다.

```javascript
// tests/integration/components/rental-listing-test.js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('rental-listing', 'Integration | Component | rental listing', {
  integration: true
});

test('should toggle wide class on click', function(assert) {
  assert.expect(3);
  let stubRental = Ember.Object.create({
    image: 'fake.png',
    title: 'test-title',
    owner: 'test-owner',
    type: 'test-type',
    city: 'test-city',
    bedrooms: 3
  });
  this.set('rentalObj', stubRental);
  this.render(hbs`{{rental-listing rental=rentalObj}}`);
  assert.equal(this.$('.image.wide').length, 0, 'initially rendered small');
  this.$('.image').click();
  assert.equal(this.$('.image.wide').length, 1, 'rendered wide after click');
  this.$('.image').click();
  assert.equal(this.$('.image.wide').length, 0, 'rendered small after second click');
});
```

컴포넌트는 두가지 파트로 구성된다
* 모양을 정의하는 템플릿(`app/templates/components/rental-listing.hbs`)
* 동작을 정의하는 JavaScript 소스 파일(`app/components/rental-listing.js`)

새 `rental-listing` 컴포넌트는 사용자가 렌탈 내역을 보고 인터랙션하는 방식을 관리한다. 단일 렌탈 항목의 세부 정보 모양새를 `rentals.hbs` 템플릿에서 `rental-listing.hbs`로 이동하고, 이미지 필드를 추가한다.

```hbs
<!-- app/templates/components/rental-listing.hbs -->
<article class="listing">
  <img src="{{rental.image}}" alt="">
  <h3>{{rental.title}}</h3>
  <div class="detail owner">
    <span>Owner:</span> {{rental.owner}}
  </div>
  <div class="detail type">
    <span>Type:</span> {{rental.type}}
  </div>
  <div class="detail location">
    <span>Location:</span> {{rental.city}}
  </div>
  <div class="detail bedrooms">
    <span>Number of bedrooms:</span> {{rental.bedrooms}}
  </div>
</article>
```

`rental.hbs` 템플릿에서 `{{#each}}` 루프 내의 이전 HTML 마크업을 새로만든 `rental-listing` 컴포넌트로 대체 해보자:

```hbs
<!-- app/templates/rentals.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome!</h2>
  <p>
    We hope you find exactly what you're looking for in a place to stay.
  </p>
  {{#link-to 'about' class="button"}}
    About Us
  {{/link-to}}
</div>

{{#each model as |rentalUnit|}}
  {{rental-listing rental=rentalUnit}}
{{/each}}
```

여기서 `rental-listing` 컴포넌트를 이름으로 호출하고, 각 `rentalUnit`을 컴포넌트의 컴포넌트의 `rental` 어트리뷰트로 할당한다.

## 이미지 숨기고 표시하기

이제 사용자가 요청할때 렌탈 이미지를 표시하는 기능을 추가할 수 있다.

`isWide`가 true로 설정 되어있을 경우에만 엘리먼트 클래스 이름을 `wide`로 셋팅하여 현재 렌탈 이미지를 크게 보여주기 위해 `{{if}}` 헬퍼를 사용 하자. 또한 이미지가 클릭될 수 있음을 나타내는 텍스트를 추가하고, 이미지와 텍스트를 앵커 엘리먼트로 감싸고 거기에 `image` 클래스를 주어 우리의 테스트가 찾을 수 있도록 한다.

```hbs
<!-- app/templates/components/rental-listing.hbs -->
<article class="listing">
  <a class="image {{if isWide "wide"}}">
    <img src="{{rental.image}}" alt="">
    <small>View Larger</small>
  </a>
  <h3>{{rental.title}}</h3>
  <div class="detail owner">
    <span>Owner:</span> {{rental.owner}}
  </div>
  <div class="detail type">
    <span>Type:</span> {{rental.type}}
  </div>
  <div class="detail location">
    <span>Location:</span> {{rental.city}}
  </div>
  <div class="detail bedrooms">
    <span>Number of bedrooms:</span> {{rental.bedrooms}}
  </div>
</article>
```

`isWide`의 값은 컴포넌트의 JavaScript 파일(이 경우에는 `rental-listing.js`)에서 가져온다. 처음에는 이미지가 작기를 원하기 때문에, 프로퍼티를 `false`로 설정 한다.

```javascript
// app/components/rental-listing.js
import Ember from 'ember';

export default Ember.Component.extend({
  isWide: false
});
```

사용자가 이미지를 크게 볼 수 있게 하려면, `isWide`의 값을 토글할 수 있는 액션이 필요하다. 이 액션을 `toggleImageSize`라고 부르자.

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
    <span>Type:</span> {{rental.type}}
  </div>
  <div class="detail location">
    <span>Location:</span> {{rental.city}}
  </div>
  <div class="detail bedrooms">
    <span>Number of bedrooms:</span> {{rental.bedrooms}}
  </div>
</article>
```

앵커 엘리먼트를 클릭하면 컴포넌트로 액션이 전송된다. Ember는 `actions` 해시에 들어가서 `toggleImageSize` 함수를 호출한다. `toggleImageSize`함수를 만들고 컴포넌트의 `isWide` 프로퍼티를 토글해보자.

```javascript
// app/components/rental-listing.js
import Ember from 'ember';

export default Ember.Component.extend({
  isWide: false,
  actions: {
    toggleImageSize() {
      this.toggleProperty('isWide');
    }
  }
});
```

이제 브라우저에서 이미지를 클릭하거나, `View Larger` 링크를 클릭하면, 큰 이미지를 볼 수 있다. 확대된 이미지를 다시 클릭하면 작아진다.
![렌탈 리스트 이미지](guides/images/styled-rental-listings.png)
