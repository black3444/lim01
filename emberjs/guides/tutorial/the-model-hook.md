# 모델 훅(The Model Hook) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/model-hook/)

이제, 방금 만든 렌탈 페이지에 사용 가능한 렌탈 목록을 추가해 보겠다.

Ember 는 `model` 이라고 부르는 객체의 페이지에 대한 데이터를 가지고 있는다. 처음에 단순하게 가지고 있기 위해, 렌탈목록 페이지의 모델을 하드 코딩된 자바스크립트 객체 배열을 사용할 것이다. 나중에 앱에서 데이터를 강력하게 관리하기 위한 라이브러리인 [Ember Data](https://github.com/emberjs/data)를 사용하도록 전환 할 것이다.

이 섹션이 끝났을 때의 모습은 다음과 같다:

![모델 데이터가 들어간 애플리케이션 스크린샷 이미지](guides/images/super-rentals-index-with-list.png)

Ember에서 라우트 핸들러는 페이지에 대한 데이터로 모델을 로드한다. `model` 이라는 함수에서 데이터를 로드한다. `model` 함수가 **hook** 으로서 동작한다는 것은 Ember가 애플리케이션에서 다른 시간에 호출할 것을 의미한다. 우리가 `rentals`의 라우트 핸들러에 추가한 model 함수는 유저가 루트 URL http://localhost:4200 이나 http://localhost:4200/rentals 를 통해 rentals 라우트에 접속하게 될 때 호출 된다.

`app/routes/rentlas.js`를 열고 `model` 함수에서 렌탈 객체 배열을 반환한다.

```javascript
// app/routes/rentals.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [{
      id: 'grand-old-mansion',
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      type: 'Estate',
      bedrooms: 15,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.'
    }, {
      id: 'urban-living',
      title: 'Urban Living',
      owner: 'Mike TV',
      city: 'Seattle',
      type: 'Condo',
      bedrooms: 1,
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg',
      description: 'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.'

    }, {
      id: 'downtown-charm',
      title: 'Downtown Charm',
      owner: 'Violet Beauregarde',
      city: 'Portland',
      type: 'Apartment',
      bedrooms: 3,
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
      description: 'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.'

    }];
  }
});
```

여기에 우리는 ES6의 짧은 메소드 정의 문법를 사용하고있다: `model()`은 `model: function()`과 같다.

앰버는 위에 반환 된 모델 객체를 사용하여 `model`이라는 어트리뷰트로 저장한다. [라우트와 템플릿(Routes and Templates)](guides/tutorial/routes-and-templates.md)에서 라우트와 함께 생성된 렌탈 템플릿에서 사용할 수 있다.

이제 렌탈 페이지의 템플릿으로 이동한다. 모델 어트리뷰트를 이용하여 렌탈 목록을 표시할 수 있다. 여기서는 [`{{each}}`](guides/templates/displaying-a-list-of-items.md)라고 하는 또 다른 일반 핸들바 헬퍼를 사용할 것이다. 이 헬퍼는 모델의 각 렌탈 객체를 반복한다.

```hbs
<!-- app/templates/rentals.hbs -->
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome!</h2>
  <p>
    We hope you find exactly what you're looking for in a place to stay.
    <br>Browse our listings, or use the search box below to narrow your search.
  </p>
  {{#link-to 'about' class="button"}}
    About Us
  {{/link-to}}
</div>

{{#each model as |rental|}}
  <article class="listing">
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
{{/each}}
```

이 템플릿에서 각 객체를 반복한다. 매 반복에서 현재 객체는 `rental`이라는 변수에 저장된다. 각 단계의 렌탈 변수에서 해당 프로퍼티에 대한 정보의 리스트를 만든다.

렌탈 항목을 나열했으므로, 렌탈 표시가 유효하다는 것을 확인하는 수용 테스트가 다음과 같이 표시되어야한다:

![인수 테스트 통과 이미지](guides/images/passing-list-rentals-tests.png)
