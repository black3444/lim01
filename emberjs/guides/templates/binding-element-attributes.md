# 엘레먼트 어트리뷰트 바인딩하기(Binding Element Attributes) [(원본)](https://guides.emberjs.com/v2.12.0/templates/binding-element-attributes/)

일반 텍스트 외에도, 템플릿에 컨트롤러에 바인딩 된 어트리뷰트를 가진 HTML 엘리먼트를 포함할 수 있다.

예를 들어, 컨트롤러에 이미지 URL을 포함한 프로퍼티가 있다고 가정하자:
```hbs
<div id="logo">
  <img src={{logoUrl}} alt="Logo">
</div>
```

이렇게 하면 다음 HTML이 생성된다:
```html
<div id="logo">
  <img src="http://www.example.com/images/logo.png" alt="Logo">
</div>
```

부울 값으로 데이터 바인딩을 사용하면, 특정한 어트리뷰트를 추가하거나 제거할 수 있다. 예를 들어, 아래와 같은 템플릿이 있다:
```hbs
<input type="checkbox" disabled={{isAdministrator}}>
```

`isAdministrator`가 `true`면, 핸들바는 아래와 같은 HTML 엘리먼트를 생성한다:
```html
<input type="checkbox" disabled>
```

`isAdministrator`가 `false`면, 핸들바는 아래와 같이 생성한다:
```html
<input type="checkbox">
```

## 데이터 어트리뷰트 추가하기

기본적으로, 핼퍼와 컴포넌트는 *데이터 어트리뷰트* 를 허용하지 않는다. 예를 들어
```hbs
{{#link-to "photos" data-toggle="dropdown"}}Photos{{/link-to}}

{{input type="text" data-toggle="tooltip" data-placement="bottom" title="Name"}}
```

를 아래의 HTML로 렌더링한다:
```html
<a id="ember239" class="ember-view" href="#/photos">Photos</a>

<input id="ember257" class="ember-view ember-text-field" type="text"
       title="Name">
```

데이터 어트리뷰트에 대한 지원을 가능하게하려면 어트리뷰트 바인딩을 컴포넌트에 반드시 추가해야한다. 예: 특정 어트리뷰트에 대한  [`Ember.LinkComponent`](https://emberjs.com/api/classes/Ember.LinkComponent.html) 나 [`Ember.TextField`](https://emberjs.com/api/classes/Ember.TextField.html)

```js
Ember.LinkComponent.reopen({
  attributeBindings: ['data-toggle']
});

Ember.TextField.reopen({
  attributeBindings: ['data-toggle', 'data-placement']
});
```

이제 위의 동일한 템플릿은 다음 HTML을 렌더링한다:

```html
<a id="ember240" class="ember-view" href="#/photos" data-toggle="dropdown">Photos</a>

<input id="ember259" class="ember-view ember-text-field"
       type="text" data-toggle="tooltip" data-placement="bottom" title="Name">
```
