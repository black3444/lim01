# 라우트 정의하기(Defining Your Routes) [(원본)](https://guides.emberjs.com/v2.11.0/routing/defining-your-routes/)

애플리케이션이 시작되면, 라우터는 현재 URL을 정의되니 라우트와 매치시킨다. 라우트는 차례로 템플릿 표시하기, 데이터 로드하기, 애플리케이션 상태 설정을 담당한다.

라우트를 정의하려면, 다음을 실행하라.
```
ember generate route route-name
```

`app/routes/route-name.js`에 경로 라우트 파일이 생성되고, `app/templates/route-name.hbs`에 라우트의 템플릿이 생성되고, `tests/unit/routes/route-name-test.js`에 유닛 테스트 파일이 생성된다. 또한 라우터에 라우트를 추가한다.

## 기본 라우트

Ember 애플리케이션의 라우터의 [`map()`](http://emberjs.com/api/classes/Ember.Router.html#method_map) 메소드를 호출하여 URL 매핑을 정의할 수 있다. `map()`을 호출 할 때, 라우트를 생성하는 데에 사용할 객체인 `this` 세트와 함께 호출될 함수를 넘겨야한다.

```javascript
// app/router.js
Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('favorites', { path: '/favs' });
});
```

이제 사용자가 `/about`을 방문하면, Ember는 `about` 템플릿을 렌더할 것이다. `/favs`를 방문하면 `favorites` 템플릿을 렌더할 것이다.

패스가 라우트 이름과 같으면 . 이 경우, 아래의 내용은 위의 예제와 동일하다:
```javascript
// app/router.js
Router.map(function() {
  this.route('about');
  this.route('favorites', { path: '/favs' });
});
```

탬플릿 내부, `route`메소드에서 제공한 이름을 사용하여 라우트 사이를 탐색하기 위해 [`{{link-to}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_link-to)를 사용할 수 있다.

```hbs
{{#link-to "index"}}<img class="logo">{{/link-to}}

<nav>
  {{#link-to "about"}}About{{/link-to}}
  {{#link-to "favorites"}}Favorites{{/link-to}}
</nav>
```

`{{link-to}}` 헬퍼는 현재 활성화된 라우트를 가리키고 있는 링크에 `active`클래스를 추가할 것이다.

다중 단어 경로 이름은 일반적으로 다음과 같다:

```javascript
// app/router.js
Router.map(function() {
  this.route('blog-post', { path: '/blog-post' });
});
```

위에 정의된 라우트는 기본적으로 `blog-post.js` 라우트 핸들러, `blog-post.hbs` 템플릿을 쓰고, 모든 `{{link-to}}` 헬퍼안의 `blog-post`로 참조된다.

이 규칙을 위반하는 다중 단어 라우트 이름은 다음과 같다:

```javascript
// app/router.js
Router.map(function() {
  this.route('blog_post', { path: '/blog-post' });
});
```

이것은 여전히 기본적으로 `blog-post.js` 라우트 핸들러와 `blog-post.hbs` 템플릿을 사용하지만, `{{link-to}}` 헬퍼 안에서 `blog_post`로 참조된다.

## 중첩 라우트
종종 다른 템플릿 안에 표시되는 템플릿을 갖고 싶어한다. 예를 들어 블로깅 애플리케이션에서 블로그 게시물 목록에서 새 게시물 작성으로 이동하는 대신, 게시물 작성 페이지를 목록 옆에 표시할 수 있다.

이 경우, 중첩된 라우트를 사용하여 하나의 템플릿을 다른 템플릿의 내부에 표시할 수 있다.

`this.route`에 콜백을 전달하여 중첩 된 라우트를 정의할 수 있다:

```javascript
// app/router.js
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

`posts` 라우트를 이미 생성했다고 가정하면, 위의 중첩된 라우트를 생성하기위해 다음을 실행한다.

```
ember generate route posts/new
```

그리고 {{outlet}} 헬퍼를 템플릿에 추가하여 중첩 템플릿을 표시한다:

```hbs
<!-- templates/posts.hbs -->

<h1>Posts</h1>
<!-- Display posts and other content -->
{{outlet}}
```

이 라우터는 `/posts`와 `/post/new`에 대한 라우트를 만든다. 사용자가 `/posts`를 방문하면, 심플하게 `posts.hbs` 템플릿이 표시된다. (아래에서 인덱스 라우트에서 이에 대한 중요한 추가사항을 설명한다.) 사용자가 `posts/new`에 방문하면, `posts/new.hbs` 템플릿이 `posts` 템플릿의 `{{outlet}}`에 렌더된다.

중첩된 라우트의 이름에는 그것의 조상 이름이 포함된다. 만약 라우트로 전환하려고 하면(`transitionTo`나 `{{link-to}}`를 통해), 전체 경로 이름(`new`가 아니라 `posts.new`)을 사용해야한다.

## 애플리케이션 라우트

`application` 라우트는 애플리케이션이 처음 부팅할때 들어간다. 다른 라우트오 마차나가지로, 기본적으로 동일한 이름(이 경우엔 `application`)의 템플릿을 로드한다. 헤더, 푸터, 그리고 다른 장식용 콘텐츠를 여기에 넣어야한다. 다른 모든 라우트는 해당 템플릿을 `application.hbs`의 `{{outlet}}`에 렌더링한다.

이 라우트는 모든 애플리케이션의 일부이므로, `app/router.js`에 지정할 필요가 없다.

## 인덱스 라우트

최상위 레벨을 포함해서 모든 중첩 레벨에서, Ember는 `index`라는 이름의 `/` 경로의 라우트를 자동으로 제공한다. 새로운 레벨의 중첩이 발생하면, 라우터를 확인해 `function`를 보면 거기에 새 레벨이 있다.

예를 들어, 다음과 같은 간단한 라우터 작성하는 경우:

```javascript
// app/router.js
Router.map(function() {
  this.route('favorites');
});
```

이것과 동일하다:

```javascript
// app/router.js
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('favorites');
});
```

`index` 템플릿은 `application` 템플릿에 `{{outlet}}`에 렌더링된다. 사용자가 `/favorites`로 이동하면, Ember가 `index` 템플릿을 `favorites` 템플릿으로 대체한다.

중첩된 라우터는 다음과 같다:

```javascript
// app/router.js
Router.map(function() {
  this.route('posts', function() {
    this.route('favorites');
  });
});
```

다음과 동일하다:
```javascript
// app/router.js
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('posts', function() {
    this.route('index', { path: '/' });
    this.route('favorites');
  });
});
```

사용자가 `/posts`로 이동하면, 현재 경로는 `post.index`가 되고 `post/index` 템플릿은 `posts` 템플릿의 `{{outlet}}`에 렌더링된다.

사용자가 `/post/favorites`으로 이동하면 Ember는 `posts`의 템플릿의 `{{outlet}}`을 `posts/favorites`을 바꾼다.

## 동적 세그먼트

라우트의 책임중 하나는 모델을 로드하는 것이다.

예를들어 `this.route('posts')` 라우트가 있는 경우, 라우트에 앱의 모든 블로그 게시물이 로드 될 수 있다.

`/posts`는 고정된 모델을 나타내므로, 검색할 항목을 알기 위해 추가 정보가 필요하지 않는다. 그러나 라우트를 하나의 게시물만 나타내려면, 라우터에 모든 게시물을 하드코딩할 필요가 없다.

*동적 세그먼트* 를 입력하라.

동적 세그먼트는 `:`로 시작하는 URL의 일부이며 식별자 다음에 온다.

```javascript
// app/router.js
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

만약 사용자가 `/post/5`로 이동하면, 라우트는 올바른 게시물을 로드하는데 `5`라는 `post_id` 를 사용한다. Ember는 다음과 같은 두가지 이유로 `:model-name_id`규칙을 따른다. 첫째로, 컨벤션을 준수하는 경우 라우트가 기본적으로 올바른 모델을 가져오는 방법을 알고 있기때문이다. 둘째로, `params`은 객체이고 키와 연관된 하나의 값만 가질 수 있다. 다음 코드를 넣으면 제대로 작동하지 않는다:

```javascript
// app/router.js
Router.map(function() {
  this.route('photo', { path: '/photo/:id' }, function() {
    this.route('comment', { path: '/comment/:id' });
  });
});
```
하지만 다음의 경우 제대로 작동한다:
```javascript
// app/router.js
Router.map(function() {
  this.route('photo', { path: '/photo/:photo_id' }, function() {
    this.route('comment', { path: '/comment/:comment_id' });
  });
});
```

다음 섹션인 [라우트 모델 지정](guides/routing/specifying-a-routes-model.md)에서 모델을 불러오는 방법에 대해 배울 수 있다.

## 와일드 카드 / 글로빙(globbing) 라우트
여러 URL 세그먼트와 일치하는 와일드 카드 라우트를 정의 할 수 있다. 예를 들어 사용자가 앱에서 관리하지 않는 잘못된 URL을 입력 할 때 유용한 포괄적인 라우트를 사용하는 경우에 이 방법을 사용할 수 있다. 와일드 카드 경로는 별표로 시작한다.

```javascript
// app/router.js
Router.map(function() {
  this.route('not-found', { path: '/*path' });
});
```

```hbs
<!-- app/templates/not-found.hbs -->
<p>Oops, the page you're looking for wasn't found</p>
```

위의 예제처럼 와일드 카드 라우트를 사용하여 애플리케이션에서 관리하지 않는 모든 경로를 처리하여 사용자가 `/a/non-existent/path`를 탐색할 때, 찾고 있는 페이지가 존재하지 않는다고 표시 했다.

## 라우트 핸들러

라우트가 동일한 이름을 가진 템플릿을 렌더링하는 것 이상으로 작업하게 하려면 라우트 핸들러를 작성해야한다. 다음 가이드에서 라우트 핸들러의 다양한 기능을 살펴본다. 라우트에 대한 자세한 내용은 [라우터](http://emberjs.com/api/classes/Ember.Router.html) 및 [라우트 핸들러](http://emberjs.com/api/classes/Ember.Route.html)에 대한 API설명서를 참조하라.
