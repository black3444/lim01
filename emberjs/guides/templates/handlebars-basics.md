# 핸들바 기초(Handlebars Basics) [(원본)](https://guides.emberjs.com/v2.12.0/templates/handlebars-basics/)

Ember는 [핸들바 템플릿](http://handlebarsjs.com/) 라이브러리를 사용하여 앱의 사용자 인터페이스를 강화한다. 핸들바 템플릿은 정적인 HTML과 이중 꺾은 괄호(`{{}}`)로 호출되는 핸들바 표현 안의 동적인 콘텐츠를 포함한다.

핸들바 표현 내부의 동적 내용은 데이터 바인딩으로 렌더링 된다. 즉, 프로퍼티를 업데이트하면 템플릿의 해당 프로퍼티 사용된 부분이 자동으로 최신값으로 업데이트된다.

## 프로퍼티 표시하기

템플릿은 컨텍스트로 뒷받침된다. 컨텍스트는 핸들바 표현이 프로퍼티를 읽는 개체이다. Ember에서 컨텍스트는 종종 컴포넌트이다. 라우트로 렌더링되는 템플릿(`application.hbs`와 같은)의 경우, 컨텍스트는 컨트롤러이다.

예를 들어, 이 `application.hbs` 템플릿은 성과 이름을 렌더링한다:

```hbs
<!-- app/templates/application.hbs -->
Hello, <strong>{{firstName}} {{lastName}}</strong>!
```

`firstName` 및 `lastName` 프로퍼티는 컨텍스트(이 경우 애플리케이션 컨트롤러)에서 읽은 다음 `<strong>` HTML 태그 안에 렌더링된다.

위의 템플릿에 `firstName` 과 `lastName`을 제공하려면, 프로퍼티는 애플리케이션 컨트롤러에 반드시 추가되어야한다. 만약 Ember CLI 애플리리케이션따른다면, 다음 파일을 만들어야 할 수도 있다:

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  firstName: 'Trek',
  lastName: 'Glowacki'
});
```

위의 템플릿과 컨트롤러는 다음 HTML로 렌더링된다:
```html
Hello, <strong>Trek Glowacki</strong>!
```

`{{firstName}}`과 `{{lastName}}`은 바운드 데이터임을 기억하라. 즉, 이러한 속성중 하나의 값이 변경되면 DOM이 자동으로 업데이트된다.

애플리케이션의 크기가 커지면 컨트롤러 및 컴포넌트에 의해 뒷받침되는 템플릿이 많이 생긴다.

## 헬퍼

Ember는 [헬퍼를 작성](guides/templates/writing-helpers.md)해 Ember 템플릿에 최소한의 로직을 적용할 수 있는 기능을 제공한다.

예를 들어, 계산된 프로퍼티를 어디든지 정의할 필요 없이 몇개의 숫자를 더하는 기능을 원한다고 해보자.
```javascript
// app/helpers/sum.js
import Ember from 'ember';

export function sum(params) {
  return params.reduce((a, b) => {
    return a + b;
  });
};

export default Ember.Helper.helper(sum);
```

위의 코드를 사용하면 템플릿에서 `{{sum}}` 핸들바 "헬퍼"로 `sum()`함수를 호출할 수 있다:
```hbs
<p>Total: {{sum 1 2 3}}</p>
```

이 헬퍼는 `6`이라는 값을 출력한다.

Ember는 몇가지 빌트인 헬퍼가 함께 제공된다. 이 헬퍼에 대해선 다음 가이드에서 자세히 설명한다.

## 중첩 헬퍼

헬퍼는 다른 헬퍼 호출과 컴포넌트 호출 안에서 중첩될 수 있다.

이렇게 하면 값이 다른 인자나 어트리뷰트로 전달 되기 전에 값을 계산 할 수 있는 유연성이 생긴다.

중괄호 `{{}}`를 중첩할 수는 없으므로, 헬퍼를 중첩하는 올바른 방법은 괄호 `()`를 사용하는 것이다
```hbs
{{sum (multiply 2 4) 2}}
```

이 예에서는 값을 `{{sum}}`에 전달하기 전에 헬퍼를 사용하여 `2`와 `4`를 곱한다.

따라서 이러한 결합 헬퍼의 결과는 `10`이다.

이러한 템플릿 가이드로 나아갈때, 일반적인 값을 사용할 수 있는 곳이면 헬퍼를 사용할 수 있다는 것을 알아두어라.

따라서 Ember는 빌트인 헬퍼 (사용자 커스텀 헬퍼)는 중첩된 형태로 사용할 수 있다.
