# 복잡한 컴포넌트 만들기(Building a Complex Component) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/autocomplete-component/)

렌탈을 검색할 때 사용자는 특정 도시로 검색 범위를 좁힐 수 있다. 도시 별로 임대료를 필터링할 수 있는 컴포넌트를 만들어보자.

먼저, 새 컴포넌트를 생성하자. 우리의 컴포넌트가 입력을 기반으로 렌탈 목록을 필터링하는 것을 원하므로, 이 컴포넌트를 `list-filter`라고 부를 것이다.

```
ember g component list-filter
```

이전과 마찬가지로, 이 명령은 핸들바 템플릿(`app/templates/components/list-filter.hbs`), 자바스크립트 파일(`app/components/list-filter.js`), 그리고 컴포넌트 통합 테스트(`tests/integration/components/list-filter-test.js`)를 생성한다.

우리가 하는 일을 생각하는데 도움이 되는 몇가지 테스트를 작성하자. 필터 컴포넌트는 필터된 항목의 목록을 컴포넌트 내부에 렌더링된 것(내부 템플릿 블록이라고 함)으로 가져와야 한다. 우리는 컴포넌트가 두가지 동작, 하나는 필터가 제공되지 않을 때 모든 항목의 목록을 제공하는 동작, 다른 하나는 도시별로 목록을 검색하는 동작을 호출하도록 한다.

초기 테스트를 위해 우리가 제공하는 모든 도시가 렌더링되고 목록 객체가 템플릿에서 엑세스 가능한지 확인 한다.

도시별로 필터링하는 액션 호출은 비동기식으로 이루어지며 테스트에서는 이것을 수용해야 한다. 우리는 스텁 액션에서 프로미스(promise) 리턴함으로써 [actions](guides/components/triggering-changes-with-actions.md)을 사용해, `filterByCity`호출로 부터 비동기 액션 완료를 처리하기 할 것이다.

우리는 테스트가 마지막에 `wait`을 호출하는 것을 추가하여 결과를 어설트(assert)해야한다. Ember의 [`wait` 헬퍼](guides//testing/testing-components)는 주어진 함수 콜백이 실행되고 테스트가 종료되기 전에 모든 프로미스가 해결되는 것을 기다린다.

```javascript
// tests/integration/components/list-filter-test.js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import RSVP from 'rsvp';

moduleForComponent('list-filter', 'Integration | Component | filter listing', {
  integration: true
});

const ITEMS = [{city: 'San Francisco'}, {city: 'Portland'}, {city: 'Seattle'}];
const FILTERED_ITEMS = [{city: 'San Francisco'}];

test('should initially load all listings', function (assert) {
  // 우리는 잠재적으로 데이터를 비동기적으로 가져올 것이므로 프로미스를 리턴하려고 한다.
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  // 통합테스트를 통해, 앱에서 사용하는 것과 동일한 방식으로 컴포넌트를 설정하고 사용할 수 있다.
  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
    {{/list-filter}}
  `);

  // wait 함수는 then 블록의 내용을 실행하기 전에 모든 약속과 xhr 요청이 해결 될때까지 대기할 프로미스를 리턴 한다.
  return wait().then(() => {
    assert.equal(this.$('.city').length, 3);
    assert.equal(this.$('.city').first().text().trim(), 'San Francisco');
  });
});
```

두 번째 테스트에서는, 필터의 입력 텍스트가 실제로 필터 액션을 호출하고 표시된 목록을 업데이트 하는지 체크한다.

우리는 입력 필드에 `keyUp` 이벤트를 생성하여 액션을 강제 실행 한 다음, 단 하나의 항목만 렌더링한다고 assert하자.

```javascript
// tests/integration/components/list-filter-test.js
test('should update with matching listings', function (assert) {
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
    {{/list-filter}}
  `);

  // 여기에 있는 keyup 이벤트가 목록을 필터링하도록 하는 액션을 호출해야한다.
  this.$('.list-filter input').val('San').keyup();

  return wait().then(() => {
    assert.equal(this.$('.city').length, 1);
    assert.equal(this.$('.city').text().trim(), 'San Francisco');
  });
});
```

다음으로, `app/templates/rentals.hbs` 파일에서 우리가 테스트한 것과 비슷한 방식으로 `list-filter` 컴포넌트를 추가할 것이다. 단순히 도시를 보여주는 것 대신, `rental-listing` 컴포넌트를 사용하여 대여 세부정보를 표시할 것이다.

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

{{#list-filter
   filter=(action 'filterByCity')
   as |rentals|}}
  <ul class="results">
    {{#each rentals as |rentalUnit|}}
      <li>{{rental-listing rental=rentalUnit}}</li>
    {{/each}}
  </ul>
{{/list-filter}}
```

이제 우리는 failing 테스트와 컴포넌트 작성에 필요한 아이디어를 얻었으므로 컴포넌트를 구현할 것이다. 컴포넌트가 입력 필드를 제공하고 블록에 결과목록을 생성하기 원하기 떄문에 템플릿은 간단해진다:

```hbs
{{input value=value key-up=(action 'handleFilterEntry') class="light" placeholder="Filter By City"}}
{{yield results}}
```

템플릿에는 텍스트 필드로 렌더링 되는 [`{{input}}`](guides/templates/input-helpers.md)가 포함되어있다. 이 헬퍼에서 사용자는 검색에 사용된 도시목록을 필터링하는 패턴을 입력할 수 있다. `input`의 `value` 프로퍼티는 우리 컴포넌트의 `value`프로퍼티와 바인딩 된다. `key-up` 속성은 `handleFilterEntry` 액션에 바인딩 된다.

다음은 컴포넌트의 JavaScript가 어떻게 보이는지 이다:
```javascript
// app/components/list-filter.js
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-filter'],
  value: '',

  init() {
    this._super(...arguments);
    this.get('filter')('').then((results) => this.set('results', results));
  },

  actions: {
    handleFilterEntry() {
      let filterInputValue = this.get('value');
      let filterAction = this.get('filter');
      filterAction(filterInputValue).then((filterResults) => this.set('results', filterResults));
    }
  }

});
```

`init` 훅을 사용하여 `filter`액션을 빈 값으로 호출하여 초기 리스트를 시드한다. 우리의 `handleFilterEntry` 액션은 입력 헬퍼에 의해 설정된 `value` 어트리뷰트에 기반한 필터액션을 호출한다.

`filter` 액션은 호출 객체에 의해 [전달](guides/components/triggering-changes-with-actions.md)된다. 이것은 *closure* 액션이라고 알려진 패턴이다.

이러한 액션을 구현하기 위해, `rentals` 컨트롤러를 만든다. 컨트롤러는 해당 라우트의 템플릿에서 사용가능한 액션과 프로퍼티를 포함 할 수 있다.

다음을 실행하여 `rentals` 라우트에 대한 컨트롤러를 생성한다:
```
ember g controller rentals
```

이제 새 컨트롤러를 다음과 같이 정의하라:

```javascript
// app/controllers/rentals.js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    filterByCity(param) {
      if (param !== '') {
        return this.get('store').query('rental', { city: param });
      } else {
        return this.get('store').findAll('rental');
      }
    }
  }
});
```

사용자가 컴포넌트의 텍스트 필드에 입력하면 컨트롤러의 `filterByCity`가 호출된다. 그 액션은 `value` 프로퍼티를 사용하고, 사용자가 지금까지 입력한 내용과 일치하는 데이터 저장소의 레코드에 대한 `rental` 데이터를 필터링한다. 쿼리의 결과는 호출한 곳에 반환 된다.

이 작업을 수행하려면 Mirage `config.js`파일을 다음과 같이 바꿔 쿼리에 응답 할 수 있어야 한다.

```javascript
// mirage/config.js
export default function() {
  this.namespace = '/api';

  let rentals = [{
      type: 'rentals',
      id: 'grand-old-mansion',
      attributes: {
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        type: 'Estate',
        bedrooms: 15,
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description: "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg',
        description: "A commuters dream. This rental is within walking distance of 2 bus stops and the Metro."
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
        description: "Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet."
      }
    }];

  this.get('/rentals', function(db, request) {
    if(request.queryParams.city !== undefined) {
      let filteredRentals = rentals.filter(function(i) {
        return i.attributes.city.toLowerCase().indexOf(request.queryParams.city.toLowerCase()) !== -1;
      });
      return { data: filteredRentals };
    } else {
      return { data: rentals };
    }
  });
}
```

우리의 Mirage 설정을 업데이트 한 후, 테스트를 통과하면 홈 화면에 간단한 필터가 표시되고 입력하는 동안 렌탈 목록이 업데이트 된다.

![결과 스크린샷](guides/images/styled-super-rentals-filter.png)

![인수 테스트 통과 이미지](guides/images/passing-acceptance-tests.png)
