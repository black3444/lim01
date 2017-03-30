# 액션(Actions) [(원본)](https://guides.emberjs.com/v2.12.0/templates/actions/)

앱은 종종 사용자가 애플리케이션 상태를 변경하는 컨트롤과 상호작용 할 수 있는 방법이 필요하다. 예를 들어, 블로그 제목을 표시하는 템플릿이 있고, 게시물을 확장하여 본문을 표시한다고 가정해보자.

만약 HTML DOM 요소에 [`{{action}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_action) 헬퍼를 추가하면, 사용자가 엘리먼트를 클릭했을 떄, 그 이벤트가 템플릿의 해당 컴포넌트나 컨트롤러로 전송된다.

```hbs
<!-- app/templates/components/single-post.hbs -->
<h3><button {{action "toggleBody"}}>{{title}}</button></h3>
{{#if isShowingBody}}
  <p>{{{body}}}</p>
{{/if}}
```

컴포넌트나 컨트롤러에서, `actions` 훅 내에서 수행할 작업을 정의할 수 있다:
```js
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleBody() {
      this.toggleProperty('isShowingBody');
    }
  }
});
```

컴포넌트의 [액션으로 변경 트리거하기](guides/components/triggering-changes-width-actions.mda) 가이드에서 고급 사용법에 대해 배우겠지만, 다음 기본 사항을 먼저 숙지해야한다.

# 액션 패러미터
선택적으로 액션 핸들러에 패러미터를 전달할 수 있다. 액션 이름 뒤에 `{{action}}` 헬퍼로 전달 된 모든 값은 핸들러에 인자로 전달 된다.

예를 들어, `post` 인자가 넘겨지면:

```hbs
<p><button {{action "select" post}}>✓</button> {{post.title}}</p>
```

`select` 액션 핸들러는 게시물 모델을 포함하는 단일 인자로 호출 될 것이다:

```js
// app/components/single-post.js
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    select(post) {
      console.log(post.get('title'));
    }
  }
});
```

## 이벤트 타입 지정

기본적으로, [`{{actions}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_action) 헬퍼는 클릭 이벤트를 수신하고, 사용자가 요소를 클릭할 때 액션을 트리거한다.

`on` 옵션을 사용하여 이벤트를 지정할 수 있다.

```hbs
<p>
  <button {{action "select" post on="mouseUp"}}>✓</button>
  {{post.title}}
</p>
```

`camelCased` 이벤트 이름을 사용해야하므로, `keypress`와 같은 두단어로 된 이름은 `keyPress`가 된다.

## 수정자 키를 허용하기
기본적으로 `{{action}}` 헬퍼는 수정자 키가 눌려진 클릭 이벤트를 무시한다. `allowedKeys` 옵션을 제공하여 무시하지 않는 키를 지정할 수 있다.

```hbs
<button {{action "anActionName" allowedKeys="alt"}}>
  click me
</button>
```

이렇게 하면 alt키가 눌린채로 클릭하면 `{{action}}`이 실행된다.

## 기본 브라우저 액션 허용
기본적으로, `{{action}}` 헬퍼는 DOM 이벤트의 기본 동작을 차단한다. 만약 브라우저 기본 동작을 허용하려면, Ember가 막는 것을 중지시킬 수 있다.

예를 들어, 일반적인 링크 태그가 있고 클릭할 때 ember동작을 트리거 하는 것 이외에 링크를 사용자가 다른 페이지를 이동하게 하려면 `preventDefault=false`를 이용할 수 있다:

```hbs
<a href="newPage.htm" {{action "logClick" preventDefault=false}}>Go</a>
```

`preventDefault=false`를 생략하면, 사용자가 링크를 클릭하면 Ember.js가 작업을 실행하지만 사용자는 현재 페이지에 남아있는다.

`preventDefault=false`를 표시하면, 사용자가 링크를 클릭하면 Ember.js가 작업을 실행하고 사용자는 새 페이지로 이동한다.

## 액션의 첫번째 패러미터 수정하기

[`{{action}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_action) 헬퍼의 `value` 옵션이 지정되면, 해당 값은 액션의 첫번째 패러미터에서 읽히는 프로퍼티 경로로 간주된다. 이것은 이벤트 리스너에서 매우 유용하며 단방향 바인딩으로도 작업할 수 있다.

```hbs
<label>What's your favorite band?</label>
<input type="text" value={{favoriteBand}} onblur={{action "bandDidChange"}} />
```

첫 번째 패러미터를 출력하는 액션 핸들러가 있다고 가정해보자:

```js
actions: {
  bandDidChange(newValue) {
    console.log(newValue);
  }
}
```

기본적으로 액션 핸들러는 브라우저가 핸들러에 전달하는 이벤트 객체인 이벤트 리스너의 첫번째 매개변수를 받는다. 따라서 `bandDidChange`는 `Event {}`를 출력한다.

`value` 옵션을 사용하면 이벤트 객체에서 해당 프로퍼티를 추출하여 해당 동작을 수정한다:

```hbs
<label>What's your favorite band?</label>
<input type="text" value={{favoriteBand}} onblur={{action "bandDidChange" value="target.value"}} />
```

`newValue` 패러미터는 이벤트 객체의 `target.value` 프로퍼티가 된다. 이 속성은 사용자가 입력 한 필드의 값이다. (예: 'Foo Fighters')

## 클릭할 수 없는 엘리먼트에 액션 붙이기
액션은 DOM 모든 엘리먼트에 붙을 수 있지만 모든 액션이 `click` 이벤트에 응답하는 것은 아니다. 예를 들어, 액션이 `href` 어트리뷰트가 없는 `a` 링크나, `div`에 붙으면 어떤 브라우저는 관련 함수를 실행하지 않는다. 이러한 요소들에 대한 액션을 정의하는 것이야 정말로 필요할 경우, 이를 클릭할 수 있는 CSS해결 방법이 존재한다, `cursor: pointer`. 예를들어:

```css
[data-ember-action]:not(:disabled) {
  cursor: pointer;
}
```

이 임시 해결책을 사용해도 `click` 이벤트는 `click`와 동일한 키보드 접근(포커스가 있을때 `enter` 키같은)을 자동적으로 트리거하지 못한다. 브라우저는 클릭할 수 있는 요소에 대에서만 기본적으로 이를 트리거한다. 또한 보조 기술 사용자(=장애인, 노약자 등)가 액세스 할 수 있는 요소를 만들지 않는다. 사용자가 액세스할 수 있도록 `role` 과/혹은 `tabindex`와 같은 항목을 추가해야한다.
