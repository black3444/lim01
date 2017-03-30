# 객체의 키를 표시하기(Displaying the Keys in an Object) [(원본)](https://guides.emberjs.com/v2.12.0/templates/displaying-the-keys-in-an-object/)

템플릿에 JavaScript 객체의 모든 키나 값이 표시해야하는 경우 [`{{#each-in}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_each-in) 헬퍼를 사용할 수 있다:

```javascript
// /app/components/store-categories.js
import Ember from 'ember';

export default Ember.Component.extend({
  willRender() {
    // 카테고리 이름을 키로, 제품 목록을 값으로 하여
    // "categories" 프로퍼티를 JavaScript 객체로 설정한다.
    this.set('categories', {
      'Bourbons': ['Bulleit', 'Four Roses', 'Woodford Reserve'],
      'Ryes': ['WhistlePig', 'High West']
    });
  }
});
```

```hbs
<!-- /app/templates/components/store-categories.hbs -->
<ul>
  {{#each-in categories as |category products|}}
    <li>{{category}}
      <ol>
        {{#each products as |product|}}
          <li>{{product}}</li>
        {{/each}}
      </ol>
    </li>
  {{/each-in}}
</ul>
```

`{{each-in}}`의 블록 내부의 템플릿은 전달된 객체의 각 키에 대해 한번 반복된다. 첫 번째 블록 패러미터 (위의 예에서는 `category`) 현재 반복에서의 키이고, 두번째 블록 패러미터 (`products`)는 해당 키의 실제 값이다.

위의 예는 다음과 같은 목록을 출력한다:

```html
<ul>
  <li>Bourbons
    <ol>
      <li>Bulleit</li>
      <li>Four Roses</li>
      <li>Woodford Reserve</li>
    </ol>
  </li>
  <li>Ryes
    <ol>
      <li>WhistlePig</li>
      <li>High West</li>
    </ol>
  </li>
</ul>
```

## 정렬하기
오브젝트의 키는 그 오브젝트의 `Object.keys`를 호출해 받환받는 배열과 같은 순서로 리스트된다. 다른 순서 정렬을 원할 경우, `Object.keys`를 사용하여 배열을 가져와 빌트인 JavaScript 도구로 배열을 정렬하고, `{{#each}}`헬퍼를 대신 이용 해야 한다.

## 빈 리스트

[`{{#each-in}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_each-in) 헬퍼는 매칭되는 `{{else}}`를 가질 수 있다. 객체가 비어있거나 null이거나 정의되지 않은 경우에 이 블록의 내용이 렌더링된다:

```hbs
{{#each-in people as |name person|}}
  Hello, {{name}}! You are {{person.age}} years old.
{{else}}
  Sorry, nobody is here.
{{/each-in}}
```
