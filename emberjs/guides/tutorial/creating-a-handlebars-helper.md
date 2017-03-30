# 핸들바 헬퍼 만들기(Creating a Handlebars Helper) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/hbs-helper/)

지금까지의 앱은 Ember Data 모델의 사용자 데이터를 바로 보여 준다. 앱이 커지면 사용자에게 데이터를 표시하기 전에 데이터를 조작해야 할 것이다.
이러한 이유로 Ember는 템플릿의 데이터를 꾸미기 위해 핸들바 헬퍼를 제공한다. 핸들바 헬퍼를 이용하여 사용자가 속성이 "독립형(Standalone)" 인지, "커뮤니티(Community)"인지 빠르게 확인 할 수 있게 한다.

`rental-property-type` 헬퍼를 생성해보자:

```
ember g helper rental-property-type
```

이렇게하면 헬퍼와 그 관련 테스트, 이렇게 두개의 파일이 만들어진다.

```
installing helper
  create app/helpers/rental-property-type.js
installing helper-test
  create tests/unit/helpers/rental-property-type-test.js
```

새로운 헬퍼는 제너레이터로부터 만든 보일러플레이트 코드로 시작한다.

```javascript
// app/helpers/rental-property-type.js
import Ember from 'ember';

export function rentalPropertyType(params/*, hash*/) {
  return params;
}

export default Ember.Helper.helper(rentalPropertyType);
```

새로운 헬퍼를 사용하고 `rental.type`을 전달하기 위해 `rental-listing` 컴포넌트 템플릿을 업데이트 하자:

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
</article>
```

이상적으로 우리는 맨 처음 렌탈 프로퍼티를 "Type: Standalone - Estate"을 봐야 한다. 하지만 지금은 기본 템플릿 헬퍼가 `rental.type` 값을 대신 리턴한다. `communityPropertyTyes` 배열에 프로퍼티가 존재하는지 확인하고, 그에따라 `Community` 혹은 `Standalone`중 하나를 반환하도록 헬퍼를 업데이트한다.

```javascript
// app/helpers/rental-property-type.js
import Ember from 'ember';

const communityPropertyTypes = [
  'Condo',
  'Townhouse',
  'Apartment'
];

export function rentalPropertyType([type]/*, hash*/) {
  if (communityPropertyTypes.includes(type)) {
    return 'Community';
  }

  return 'Standalone';
}

export default Ember.Helper.helper(rentalPropertyType);
```

핸들바는 템플릿의 인수 배열을 헬퍼에게 전달한다. ES2015 구조화를 사용하여 배열의 첫번째 항목을 가져와 이름을 `type`으로 정한다. 그 다음 `communityPropertyTypes` 배열에 `type`이 존재하는지 체크한다.

이제 브라우저에서 첫 번째 렌탈의 프로퍼티가 "독립형(Standalone)"으로 보여지고, 나머지 두개는 "커뮤니티(Community)"로 표시되는걸 확인할 수 있다.
