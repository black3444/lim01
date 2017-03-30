# 템플릿 렌더링하기(Rendering a Template) [(원본)](https://guides.emberjs.com/v2.11.0/routing/rendering-a-template/)

라우트 핸들러의 작업중 하나는 스크린에 적절한 템플릿을 렌더링하는 것이다.

기본적으로 라우트 한들러는 라우트와 이름이 같은 템플릿을 렌더링한다. 이 라우터를 사용해보자:

```javascript
// app/router.js
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

여기 `posts` 라우트는 `posts.hbs` 템플릿을 렌더링 하고, `posts.new` 라우트는 `posts/new.hbs`를 렌더링 한다.

각 템플릿은 상위 라우트 템플릿의 `{{outlet}}`에 렌더링 된다. 예를들어, `posts.new` 라우트는 `posts.hbs`의 `{{outlet}}`에 렌더링 하고 `posts` 라우트는 그 템플릿을 `application.hbs`의 `{{outlet}}`에 렌더링 한다.

기본 템플릿이 아닌 다른 템플릿으로 렌더링 하려면 라우트의 [`templateName`](http://emberjs.com/api/classes/Ember.Route.html#property_templateName) 속성을 렌더링할 템플릿 이름으로 설정하라.

```javascript
// app/routes/posts.js
import Ember from 'ember';

export default Ember.Route.extend({
  templateName: 'posts/favorite-posts'
});
```

템플릿 렌더링을 보다 세밀하게 제어하려면 [`renderTemplate()`](http://emberjs.com/api/classes/Ember.Route.html#method_renderTemplate) 훅을 오버라이드 할 수 있다. 무엇보다도 템플릿을 구성하는 데 사용되느 컨트롤러와 렌더링 할 특정 outlet을 선택할 수 있다.
