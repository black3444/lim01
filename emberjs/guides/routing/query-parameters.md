# 쿼리 패러미터(Query Parameters) [(원본)](https://guides.emberjs.com/v2.11.0/routing/query-params/)

쿼리 패러미터는 URL의 `?`의 오른쪽에 나타나는 선택적인 키-밸류 쌍이다. 예를들어, 다음과같은 URL은 `sort`와 `page`, 각 값은 `ASC`와 `2` 인 두개의 쿼리 패러미터를 가지고 있다:

```
http://example.com/articles?sort=ASC&page=2
```

쿼리 패러미터를 사용하면 추가적으로 직렬화(시리얼라이즈)한 애플리케이션 상태를 URL의 경로(즉, `?`의 왼쪽에있는 모든 것)에 영향을 주지않고 더할 수 있다.

쿼리 패러미터의 일반적인 사용 사례에는 페이지 번호가 지정된 컬렉션의 현재 페이지 번호, 필터 조건 또는 정렬 기준이 포함된다.

## 쿼리 패러미터 명세

쿼리 패러미터는 라우트 기반 컨트롤에서 선언된다. 예를 들어, `articles` 라우트 내에서 활성 상태인 쿼리 패러미터를 구성하려면 `controller:articles`에서 선언해야한다.

인기로 분류되지 않은 기사들을 필터링하는 `category` 쿼리 패러미터를 추가하려면 `'category'`를 `controller:article`의 `queryParams`중 하나로 지정하라:

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['category'],
  category: null
});
```

이렇게하면 URL내의 `category` 쿼리 패러미터와 `controller:articles`의 `category` 프로퍼티가 바인딩 된다. 즉, `articles` 라우트에 들어가면, URL의 `category` 쿼리 파라미터 변경이 생기면 `controller:articles`의 `category` 프로퍼티가 업데이트 된다. 그 반대의 경우도 동일하다. `queryParams`는 계산된 프로퍼티에 바인딩할 수 없으며, 일반적인 값이여야 한다.

이제 `articles` 템플릿이 랜더링할 카테고리 필터링된 배열의 계산된 프로퍼티를 정의해야한다:

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['category'],
  category: null,

  filteredArticles: Ember.computed('category', 'model', function() {
    let category = this.get('category');
    let articles = this.get('model');

    if (category) {
      return articles.filterBy('category', category);
    } else {
      return articles;
    }
  })
});
```

이 코드를 사용하여 다음과 같은 동작을 설정했다:
1. 사용자가 `/articles`로 이동하면 `category` 는 `null`이 되므로 기사가 필터링 되지 않는다.
2. 사용자가 `/articles?category=recent`로 이동하면 카테고리가 `"recent"`로 설정되어 기사가 필터링 된다.
3. `articles` 라우트 내에 있으면 `controller:articles`의 `category` 프로퍼티를 변경하면 URL에서 쿼리 패러미터를 업데이트하게 된다. 기본적으로, 쿼리 패러미터는 프로퍼티를 변경해도 전체 라우터 트랜지션이 발생하지는 않는다.(즉, `model` 훅 및 `setupController`등을 호출하진 않는다.) URL만 업데이트한다.

## link-to 헬퍼

`link-to`헬퍼는 `query-params` 하위 표현식 헬퍼를 이용하여 쿼리 패러미터를 명세하는 것을 돕는다.

```hbs
<!-- 명시적으로 타겟 쿼리 패러미터를 설정 -->
{{#link-to "posts" (query-params direction="asc")}}Sort{{/link-to}}

<!-- 바인딩도 지원한다 -->
{{#link-to "posts" (query-params direction=otherDirection)}}Sort{{/link-to}}
```

위의 예에서, `direction`은 아마도 `posts` 컨트롤러의 쿼리 패러미터터지만, `posts` 라우트와 연결된 아무 컨트롤러의 `direction` 프로퍼티를 참조할 수도 있다. 이 때 가장 가까운 컨트롤러와 제공된 프로퍼티 이름과 매치시킨다.

`link-to` 헬퍼는 "활성" 상태를 결정 할 때 쿼리 패러미터를 고려하고 클래스를 적절하게 설정한다. 활성 상태는 링크를 클릭한 후 쿼리 패러미터가 동일하게 끝나는지 계산하여 결정된다. 현재 모든 활성 쿼리 패러미터를 true로 설정하지 않아도 된다.

## transitionTo

`Route#transitionTo` 와 `Controller#transitionToRoute`는 `queryParams`키가 있는 오브젝트를 최종 인자로 받는다.

```javascript
// app/routes/some-route.js
this.transitionTo('post', object, { queryParams: { showDetails: true }});
this.transitionTo('posts', { queryParams: { sort: 'title' }});

// 라우트를 변경하지 않고 쿼리 패러미터를 전환하는 경우
this.transitionTo({ queryParams: { direction: 'asc' }});
```

또한 URL 트랜지션에 쿼리 패러미터를 추가할 수 있다:

```javascript
// app/routes/some-route.js
this.transitionTo('/posts/1?sort=date&showDetails=true');
```

## 전체 트랜지션으로 전환

`transitionTo` 또는 `link-to`에 제공된 인자는 쿼리 패러미터 값의 변경에만 부합하며, 라우트의 계층 변경에는 부합하지 않으며, 전체 트랜지션으로 간주하지 않는다. 즉, `model`이나 `setupController`와 같은 훅은 기본적으로 실행되지 않지만, 컨트롤러 프로퍼티만 URL과 마찬가지로 새로운 쿼리 패러미터로 업데이트 된다.

하지만 일부 쿼리 패러미터를 변경하려면 서버에서 데이터를 로드해야할 수 있으며, 이 경우 전체 전환을 선택하는 것이 좋다. 컨트롤러 쿼리 패러미터 프로퍼티가 변경될 때 전체 트랜지션으로 전환하고 싶으면, 해당 컨트롤러와 연결된 `Route`에서 선택적으로 `queryParams` 설정 해시를 사용하여, 해당 쿼리 패러미터의 `refreshModel` 설정 프로퍼티를 `true`로 설정할 수 있다.

```javascript
// app/routes/articles.js
import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    category: {
      refreshModel: true
    }
  },
  model(params) {
    // 이것은 'articles' 라우트에 처음으로 들어갔을때 호출되며,
    // 그리고 위에서 `refreshModel:true` 설정하여 쿼리 매개변수가 변경되면 재실행한다.

    // 패러미터는 { category: "someValueOrJustNull" } 형식이고,
    // 서버로 전달할 수 있다.
    return this.get('store').query('article', params);
  }
});
```

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['category'],
  category: null
});
```

## `replaceState`로 대신 URL 업데이트하기

기본적으로, Ember는 컨트롤러 쿼리 패러미터 프로퍼티 변경에 대한 응답으로 주소 표시줄의 URL을 업데이트하기위해 `pushState`를 사용한다. 하지만 `replaceState`(사용자의 브라우저 히스토리에 아이템을 추가하는 것을 막는다.)를 대신 쓰고싶을수 있다. 이것을 `Route`의 `queryParams` 설정 해시에 명세할 수 있다.(위의 예제에서 계속)

```javascript
// app/routes/articles.js
import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    category: {
      replace: true
    }
  }
});
```

이 설정 프로퍼티의 이름과 그것의 기본값인 `false`는 `link-to` 헬퍼와 유사하며, `replace=true`를 통해 `replaceState` 트랜지션을 선택할 수 있다.

## 컨트롤러의 프로퍼티를 다른 쿼리 패러미터 키에 매핑

기본적으로 컨트롤러 쿼리 패러미터 프로퍼티로 `foo`를 지정하면 키가 `foo`인 쿼리 파라미터와 바인딩된다(예: `?foo=123`). 다음 설정 문법을 이용하여 컨트롤러 프로퍼티를 다른 쿼리 패러미터 키와 매핑 할 수 있다.

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    category: 'articles_category'
  },
  category: null
});
```

이로 인해 `controller:articles`의 `category` 프로퍼티가 쿼리 패러미터로 업데이트되는 변화를 유발한다. 반대의 경우도 마찬가지다.


추가 사용자 정의가 필요한 쿼리 패러미터는 `queryParams` 배열의 문자열과 함께 제공될 수 있다.

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'filter', {
    category: 'articles_category'
  }],
  category: null,
  page: 1,
  filter: 'recent'
});
```

## 기본값 및 비직렬화(deserialization)

다음 예에서, 컨트롤러 쿼리 패러미터 프로퍼티 `page`는 기본 값 `1`로 간주된다.

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: 'page',
  page: 1
});
```

이는 두가지 방법으로 쿼리 패러미터에 영향을 준다:
1. 쿼리 패러미터 값은 기본값과 같은 데이터 타입으로 캐스팅된다. 예를 들어 `/?page=3`에서 `/?page=2`로 URL을 변경하면 `controller:articles`의 `page` 프로퍼티가 문자열 `"2"`가 아닌 숫자 `2`로 설정된다. 부울 기본값도 동일하게 적용된다.

2. 컨트롤러의 쿼리 패러미터 프로퍼티가 현재 기본값으로 설정되어있으면, 그 값은 URL에 직렬화 되지 않는다. 위의 예에서, `page`가 `1`이면 URL은 `/articles` 처럼 보이지만, 컨트롤러의 `page` 값을 `2`로 바꾸면 URL은 `/articles?page=2`가 된다.

## 고정적 쿼리 패러미터 값

기본적으로, Ember에서 쿼리 패러미터 값은 "고정적"이다. 쿼리 패러미터를 변경하고 라우트를 떠났다가 다시 접속하면, 해당 쿼리 매개변수의 새 값이 보존된다.(기본값으로 재설정하지 않고) 이는 라우트 간에 앞 뒤로 이동할 때, 정렬 / 필터 패러미터를 보존하는데 특히 유용하다.

또한, 이런 고정적인 쿼리 패러미터 값은 라우트에 로드된 모델에 따라 저장/복원 된다. 그래서 동적 세그먼트 `:/team_name`및 컨트롤러 쿼리 패러미터 "filter"가 있는 `team` 라우트가 주어지면,`/badgers`로 이동하고 `"rookies"`로 필터링한다. 그다음 `/bears`로 이동하고 `"best"`필터링 한다. 그리고 `/potatoes`로 이동하고 `"worst"`로 필터링한다. 그 다음 아래와 같은 링크가 보여진다.

```hbs
{{#link-to "team" "badgers"}}Badgers{{/link-to}}
{{#link-to "team" "bears"}}Bears{{/link-to}}
{{#link-to "team" "potatoes"}}Potatoes{{/link-to}}
```

생성된 링크는 다음과같다:
```html
<a href="/badgers?filter=rookies">Badgers</a>
<a href="/bears?filter=best">Bears</a>
<a href="/potatoes?filter=worst">Potatoes</a>
```

이것은 일단 쿼리 패러미터를 변경하면 저장되고, 라우트에 로드된 모델에 연결 된다는 것을 보여준다.

쿼리 패러미터를 재설정하려면 두가지 옵션이 있다:
1. 해당 쿼리 패러미터의 기본 값을 `link-to` 또는 `transitionTo`에 명시적으로 전달한다.
2. 라우트를 종료하거나 라우트 모델을 변경하기 전에 `Route.resetController` 훅을 사용하여 쿼리 패러미터를 다시 기본 값으로 설정하라.

다음 예제에서, 컨트롤러의 `page` 쿼리 패러미터는 1로 재설정되지만, *트랜지션 전의 `ArticlesRoute` 모델로 범위가 지정된다.*

이 결과로 나간 라우트로 다시 향하는 모든 링크는 새롭게 재 설정된 값 `1`을 쿼리 패러미터 값으로 사용한다.

```javascript
// app/routes/articles.js
import Ember from 'ember';

export default Ember.Route.extend({
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // 라우트의 모델이만 변경되면 isExiting은 false가 된다.
      controller.set('page', 1);
    }
  }
});
```

경우에 따라, 고정적 쿼리 패러미터의 값이 라우트 모델에 적용되는 것을 원하지 않는데, 라우트의 모델이 변경 되는 경우에도 쿼리 패러미터 값을 다시 사용하는 경우가 있다. 이것은 컨트롤러의 `queryParams` 설정 해시에서 `scope` 옵션을 `"controller"`로 설정하여 수행할 수 있다.

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [{
    showMagnifyingGlass: {
      scope: 'controller'
    }
  }]
});
```

다음은 단일 컨트롤러 쿼리 패러미터 프로퍼티의 범위와 쿼리 패러미터 URL 키를 모두 재 정의하는 방법을 보여준다:

```javascript
// app/controllers/articles.js
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page', 'filter',
    {
      showMagnifyingGlass: {
        scope: 'controller',
        as: 'glass'
      }
    }
  ]
});
```
