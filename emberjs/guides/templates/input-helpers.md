# 입력 헬퍼(Input Helpers) [(원본)](https://guides.emberjs.com/v2.12.0/templates/input-helpers/)

Ember.js의 [`{{input}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_input) 및 [`{{textarea}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_textarea) 헬퍼는 일반적인 양식 컨트롤을 만드는 가장 쉬운 방법이다. 이러한 헬퍼를 사용하면 기본 HTML `<input>` 혹 `<textarea>` 엘리먼트와 거의 동일한 양식 컨트롤을 만들 수 들고, 뿐만 아니라 Ember의 양방향 바인딩을 인식하고 자동으로 업데이트 할 수 있다.  

## 텍스트 필드
```hbs
{{input value="http://www.facebook.com"}}
```

은 이렇게된다:
```html
<input type="text" value="http://www.facebook.com"/>
```

입력 헬퍼에서 다음과 같은 표준 `<input>` 어트리뷰트를 전달할 수 있다:


| `readonly`           | `required`       | `autofocus`    |
| `value`              | `placeholder`    | `disabled`     |
| `size`               | `tabindex`       | `maxlength`    |
| `name`               | `min`            | `max`          |
| `pattern`            | `accept`         | `autocomplete` |
| `autosave`           | `formaction`     | `formenctype`  |
| `formmethod`         | `formnovalidate` | `formtarget`   |
| `height`             | `inputmode`      | `multiple`     |
| `step`               | `width`          | `form`         |
| `selectionDirection` | `spellcheck`     | `type`         |

이러한 어트리뷰트는 따옴표 붙은 문자열로 설정하면 이전 예제에서와 같이 해당 값이 엘리먼트에 직접 설정된다. 그러나 따옴표로 묶지 않으면 값은 현재 렌더링 컨텍스트의 프로퍼티에 바인딩 된다. 예:
```hbs
{{input type="text" value=firstName disabled=entryNotAllowed size="50"}}
```

현재 컨텍스트에서 `disabled` 특성을 `entryNotAllowed`값에 바인딩한다.

## 액션
`enter` 또는 `key-press`와 같은 특정 이벤트에 액션을 지정하려면 다음을 사용하라

```hbs
{{input value=firstName key-press="updateFirstName"}}
```

[이벤트 이름](https://emberjs.com/api/classes/Ember.View.html#toc_event-names)을 반드시 기록해야한다.

## 체크박스
또한 `{{input}}` 헬퍼를 사용하여 `type`을 설정하여 체크박스를 만들 수도 있다:
```hbs
{{input type="checkbox" name="isAdmin" checked=isAdmin}}
```

체크박스는 다음 속성을 지원한다:
* `checked`
* `disabled`
* `tabindex`
* `indeterminate`
* `name`
* `autofocus`
* `form`

이전 섹션에서 설명한대로 바인딩하거나 설정할 수 있다.

## 텍스트 에어리어
```hbs
{{textarea value=name cols="80" rows="6"}}
```

텍스트 영역의 값을 현재 컨텍스트 `name`에 바인딩한다.

[`{{textarea}}`]()는 다음 속성 바인딩과 설정을 지원한다.

* `name`
* `rows`
* `cols`
* `placeholder`
* `disabled`
* `maxlength`
* `tabindex`
* `selectionEnd`
* `selectionStart`
* `selectionDirection`
* `wrap`
* `readonly`
* `autofocus`
* `form`
* `spellcheck`
* `required`


## 동적 어트리뷰트 바인딩하기
예를 들어 유연한 양식을 원하는 경우 프로퍼티을 입력에 동적으로 바인딩해야할 수도 있다. 이를 수행하려면 다음 예제와 같이 [`{{get}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_get)와 [`{{mut}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_mut)를 함께 사용해야한다.

```hbs
{{input value=(mut (get person field))}}
```

`{{get}}` 헬퍼는 바인딩할 속성을 동적으로 지정할 수 있게 해주는 반면, `{{mut}}` 헬퍼는 입력에서 바인딩을 업데이트 할 수 있다. 자세한 내용은 각 헬퍼의 도큐먼트를 참조하라.
