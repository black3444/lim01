# 링크(Links) [(원본)](https://guides.emberjs.com/v2.12.0/templates/links/)

## `{{link-to}}` 컴포넌트
[`{{link-to}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_link-to) 컴포넌트를 이용하여 라우트에 대한 링크를 만든다.

```js
// app/router.js
Router.map(function() {
  this.route('photos', function(){
    this.route('edit', { path: '/:photo_id' });
  });
});
```

```hbs
<!-- app/templates/photos.hbs -->
<ul>
  {{#each photos as |photo|}}
    <li>{{#link-to "photos.edit" photo}}{{photo.title}}{{/link-to}}</li>
  {{/each}}
</ul>
```

`photos` 템플릿의 모델이 세장의 사진 목록인 경우, 렌더링된 HTML은 다음과 같을 것이다:

```html
<ul>
  <li><a href="/photos/1">Happy Kittens</a></li>
  <li><a href="/photos/2">Puppy Running</a></li>
  <li><a href="/photos/3">Mountain Landscape</a></li>
</ul>
```

`{{link-to}}` 컴포넌트는 하나 또는 두개의 인수를 취한다:
* 라우트의 이름. 이 예에서는, `index`, `photos`, 혹은 `photos.edit`이다.
* 각 [동적 세그먼트](guides/routing/defining-your-routes.md)에 대한 모델(최대 한개). 기본적으로 Ember.js는 각 세그먼트를 해당하는 오브젝트의 `id` 프로퍼티로 바꾼다. 위의 예제에서, 두번째 인자는 각 `photo` 객체이고, `id` 프로퍼티는 동적세그먼트를 `1`, `2`, `3`으로 채우는데 사용 된다. 컴포넌트에에 전달할 모델이 없으면 대신 명시적인 값을 제공할 수도 있다:

```hbs
<!-- app/templates/photos.hbs -->
{{#link-to "photos.edit" 1}}
  First Photo Ever
{{/link-to}}
```

렌더링된 링크가 현재 라우트와 일치하고, 동일한 객체 인스턴스가 컴포넌트에 넘겨지면, 링크는 `class="active"`로 지정된다. 예를 들어, URL `/photos/2`에 있을 때, 위의 첫번째 예제는 아래와 같이 렌더된다:

```html
<ul>
  <li><a href="/photos/1">Happy Kittens</a></li>
  <li><a href="/photos/2" class="active">Puppy Running</a></li>
  <li><a href="/photos/3">Mountain Landscape</a></li>
</ul>
```

## 다중 세그먼트의 예

라우트가 중첩되어 있으면 각 동적 세그먼트에 대한 모델 또는 식별자를 제공할 수 있다.

```js
// app/router.js
Router.map(function() {
  this.route('photos', function(){
    this.route('photo', { path: '/:photo_id' }, function(){
      this.route('comments');
      this.route('comment', { path: '/comments/:comment_id' });
    });
  });
});
```

```hbs
<!-- app/templates/photo/index.hbs -->
<div class="photo">
  {{body}}
</div>

<p>{{#link-to "photos.photo.comment" primaryComment}}Main Comment{{/link-to}}</p>
```

하나의 모델만 지정하면, 가장 안쪽의 동적 세그먼트인 `:comment_id`를 나타낸다. `:photo_id` 세그먼트는 현재 사진을 사용할 것이다.

또는 사진 ID와 댓글을 모두 컴포넌트에 전달할 수 있다:
```hbs
<!-- app/templates/photo/index.hbs -->
<p>
  {{#link-to 'photo.comment' 5 primaryComment}}
    Main Comment for the Next Photo
  {{/link-to}}
</p>
```

위의 예에서, `PhotoRoute`의 모델 훅은 `params.photo_id = 5`로 실행 된다. `CommentRoute`에 대한 `model` 훅은 `comment` 세그먼트에 대한 모델 객체를 제공 될때까지 실행 되지 않는다. 댓글의 ID는 `CommentRoute`의 `serialize`훅을 따라 URL을 채운다.

## 쿼리 패러미터 설정하기

`query-params` 헬퍼는 링크에서 쿼리 패러미터를 설정하는 데 사용할 수 있다:
```hbs
// 명시적으로 타겟 쿼리 패러미터를 설정함
{{#link-to "posts" (query-params direction="asc")}}Sort{{/link-to}}

// 바인딩도 지원된다
{{#link-to "posts" (query-params direction=otherDirection)}}Sort{{/link-to}}
```

## 인라인 컴포넌트로 link-to 사용

블록 표현식으로 사용 되는 것 외에도 `link-to` 컴포넌트는 링크 텍스트를 컴포넌트의 첫번째 인자로 지정하여 인라인 형식으로 사용할 수 있다:

```hbs
A link in {{#link-to "index"}}Block Expression Form{{/link-to}},
and a link in {{link-to "Inline Form" "index"}}.
```

위의 결과물은 다음과 같을것이다:
```html
A link in <a href="/">Block Expression Form</a>,
and a link in <a href="/">Inline Form</a>.
```

## 링크에 추가 어트리뷰트 추가하기

링크를 생성할 때 추가적인 어트리뷰트를 설정할 수 있다. `link-to` 컴포넌트에 대한 추가 인자를 사용하여 이 작업ㅇ르 수행할 수 있다:
```hbs
<p>
  {{link-to "Edit this photo" "photo.edit" photo class="btn btn-primary"}}
</p>
```

`class`와 `rel`과 같이 사용하고자하는 일반적인 HTML 어트리뷰트가 가능하다. 클래스 이름을 추가할 때, Ember는 표준 `ember_view` 와 가능하면 `active` 클래스 명을 적용한다.

## 히스토리 엔트리 바꾸기

[`link-to`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_link-to)의 기본 동작은 라우트간에 전환 할때, 브라우저 기록에 엔트리를 추가하는 것이다. 하지만, 브라우저 히스토리의 현재 엔트리를 바꾸려면 `replace=true` 옵션을 사용할 수 있다:

```hbs
<p>
  {{#link-to "photo.comment" 5 primaryComment replace=true}}
    Main Comment for the Next Photo
  {{/link-to}}
</p>
```
