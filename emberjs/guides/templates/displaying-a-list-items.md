# 목록의 아이템 표시하기(Displaying a List of Items) [(원본)](https://guides.emberjs.com/v2.12.0/templates/displaying-a-list-of-items/)

리스트의 아이템을 반복하려면 [`{{#each}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_each) 헬퍼를 사용하라.
이 헬퍼의 첫번째 인자는 반복될 리스트이며, 반복될 값은 블록 패러미터로 산출된다. 블록 패러미터는 해당 헬퍼 블록 안에서만 사용할 수 있다.

예를 들어, 이 템플릿은 객체가 포함된 `people`이라는 이름의 배열을 반복하자. 배열의 각 항목은 `person`이라는 블록 패러미터로 제공된다.

```hbs
<ul>
  {{#each people as |person|}}
    <li>Hello, {{person.name}}!</li>
  {{/each}}
</ul>
```

블록 파라미터는 자바스크립트의 함수 인자와 같이 위치한다(확인필요). `person`은 위 템플릿의 각 항목의 이름이지만, `human`으로 해도 잘 작동한다.

`{{#each}}` 블록 안의 템플릿은 각 아이템에 대해 한번씩 반복되며, 각 항목은 `person` 블록 패러미터로 설정된다.

입력 배열은 다음과 같다:
```javascript
[
  { name: 'Yehuda' },
  { name: 'Tom' },
  { name: 'Trek' }
]
```

위의 템플릿은 다음과 같이 HTML을 렌더링한다:
```html
<ul>
  <li>Hello, Yehuda!</li>
  <li>Hello, Tom!</li>
  <li>Hello, Trek!</li>
</ul>
```

다른 헬퍼와 마찬가지로 `{{#each}}` 헬퍼는 바운드이다. 새 아이템이 추가 되거나 삭제되면 추가 코드를 작성할 필요 없이 DOM이 업데이트된다. Ember는 바인딩 된 배열을 업데이트 해야하기위해 [특별한 메소드](guides/the-object-model/enumerables.md)를 써야한다고 말한다. 또한 [각 헬퍼에서 `key` 옵션을 사용하면](https://emberjs.com/api/classes/Ember.Templates.helpers.html#toc_specifying-keys) 비슷한 아이템을 포함하는 다른 배열로 배열을 대체할 때 렌더링 성능을 향상시킬 수 있다.

## 아이템의 `index`에 접근하기

반복하는 동안, 배열의 각 항목 인덱스는 두번째 블록 패러미터로 제공된다. 블록 매개변수는 쉼표 없이 공백으로 구분된다. 예:
```hbs
<ul>
  {{#each people as |person index|}}
    <li>Hello, {{person.name}}! You're number {{index}} in line</li>
  {{/each}}
</ul>
```

## 빈 리스트
[`{{#each}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_each) 헬퍼는 대응하는 `{{else}}`를 가질 수 있다. `{{#each}}`에 전달된 배열이 비어있으면 블록 내의 내용이 렌더링 된다:
```hbs
{{#each people as |person|}}
  Hello, {{person.name}}!
{{else}}
  Sorry, nobody is here.
{{/each}}
```
