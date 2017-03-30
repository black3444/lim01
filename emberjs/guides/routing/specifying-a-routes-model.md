# 라우트 모델 지정(Specifying a Route's Model) [(원본)](https://guides.emberjs.com/v2.11.0/routing/specifying-a-routes-model/)

종종 모델의 데이터 표시를 할 템플릿이 필요할 것이다. 적절한 모델을 로드하는 것은 라우트의 작업중 하나이다.

예를들어, 다음 라우터를 사용하라:
```javascript
// app/router.js
Router.map(function() {
  this.route('favorite-posts');
});
```
`favorite-posts` 라우트에 대한 모델을 로드하려면 `favorite-posts` 라우트 핸들러에서 [`model()`](http://emberjs.com/api/classes/Ember.Route.html#method_model) 훅을 사용한다.

```javascript
// app/routes/favorite-posts.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('post', { favorite: true });
  }
});
```

일반적으로 , `model` 훅은 [Ember Data](guides/models/introduction.md) 레코드를 반환해야하지만, [promise](https://www.promisejs.org/) 객체(Ember Data 레코드는 프로미스임) 또는 일반 JavaScript 객체 또는 배열을 반환 할 수도 있다. Ember는 템플릿 렌더링 전에 데이터로드가 완료 될 때까지(프로미스가 해결될 때까지) 기다린다.

그런 다음 라우트는 컨트롤러의 모델 프로퍼티로 모델 훅의 반환 값을 설정한다. 그러면 템플릿의 컨트롤러의 `model` 프로퍼티에 액세스 할 수 있다.

```hbs
<!-- app/templates/favorite-posts.hbs -->
<h1>Favorite Posts</h1>
{{#each model as |post|}}
  <p>{{post.body}}</p>
{{/each}}
```

## 동적 모델
일부 라우트는 항상 같은 모델을 표시한다. 예를들어 `/photos` 라우트는 항상 애플리케이션에서 사용 할 수 있는 동일한 사진 목록을 표시한다. 사용자가 이 라우트를 떠나 나중에 돌아와도 변하지 않는다.

하지만, 사용자 인터렉션에 따라 모델이 변경 되는 라우트가 종종 있다. 예를들어 사진 뷰어 앱을 상상해보라. `/photos` 라우트는 변경 되지 않는 사진 목록을 모델로 하여 사진 템플릿을 렌더링한다. 그러나 사용자가 특정 사진을 클릭하면 `photo` 템플릿을 사용하여 해당 모델을 표시하려고 한다. 만약 사용자가 돌아가서 다른 사진을 클릭하면 이번에는 다른 모델로 `photo` 템플릿을 다시 표시하려고 한다.

이와 같은 경우 URL 에 표시할 템플릿 뿐 아니라 어떤 모델에 대한 정보를 URL에 포함시키는 것이 중요하다.

Ember에서는 [동적 세그먼트](guides/routing/defining-your-routes.md)가 라우트를 정의 하여 이 작업을 수행한다.

동적 세그먼트가 있는 라우트를 정의하면 Ember는 동적 세그먼트의 값을 URL에 추출하여 첫 번 째 인자로 `model` 훅에 해시로 전달한다:

```javascript
// app/router.js
Router.map(function() {
  this.route('photo', { path: '/photos/:photo_id' });
});
```

```javascript
// app/routes/photo.js
import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').findRecord('photo', params.photo_id);
  }
});
```

동적 세그먼트가 있는 라우트의 `model` 훅에서는, 라우트 템플릿에서 렌더링 할 수 있는 모델로 ID(`47` 이나 `post-slug`같은 것)를 전환하는 것이 좋다. 위의 예제에서, Ember Data의 `findRecord` 메소드에 대한 인자로 사진의 ID(`params.photo_id`)를 사용할 것이다.

참고: 동적 세그먼트가 있는 라우트는 URL을 통해 입력 될 때 항상 `model` 훅이 호출 된다. 트렌지션을 통해 라우트에 들어온 경우 (예: `link-to` 핸들바 헬퍼를 사용할 때), 그리고 모델 컨텍스트가 제공되면 (`link-to`의 두번째 인자), 훅은 실행되지 않는다. 만약 식별자가(id나 slug 같은) 대신 제공되면 모델 훅이 실행 된다.

예를 들어, 이 방법으로 `photo` 라우트로 트랜지션 해도 `model` 훅이 실행되지 않는다(`link-to`가 모델을 넘겼기 때문에):

```hbs
<!-- app/templates/photos.hbs -->
<h1>Photos</h1>
{{#each model as |photo|}}
  <p>
    {{#link-to 'photo' photo}}
      <img src="{{photo.thumbnailUrl}}" alt="{{photo.title}}" />
    {{/link-to}}
  </p>
{{/each}}
```

이 방법으로 트랜지션하면 `model` 훅이 실행된다 (`link-to`가 식별자 대신 `photo.id`를 넘겼기 때문에):
```hbs
<!-- app/templates/photos.hbs -->
<h1>Photos</h1>
{{#each model as |photo|}}
  <p>
    {{#link-to 'photo' photo.id}}
      <img src="{{photo.thumbnailUrl}}" alt="{{photo.title}}" />
    {{/link-to}}
  </p>
{{/each}}
```

동적 세그먼트가 없는 라우트는 항상 모델 훅을 실행한다.

## 다중 모델

[RSVP.hash](http://emberjs.com/api/classes/RSVP.html#method_hash)를 이용하여 다중 모델을 리턴할 수 있다. `RSVP.hash`는 프로미스를 반환하는 인자를 갖고, 모든 인자의 프로미스가 해결되면, `RSVP.hash` 프로미스를 해결한다. 예:

```javascript
// app/routes/songs.js
import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      songs: this.get('store').findAll('song'),
      albums: this.get('store').findAll('album')
    });
  }
});
```

`songs` 템플릿에서, 두 모델을 지정하고 {{#each}} 도우미르 사용하여 노래 모델 및 앨범 모델을 표시할 수 있다:

```hbs
<!-- app/templates/songs.hbs -->
<h1>Playlist</h1>

<ul>
  {{#each model.songs as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>

<h1>Albums</h1>

<ul>
  {{#each model.albums as |album|}}
    <li>{{album.title}} by {{album.artist}}</li>
  {{/each}}
</ul>
```
