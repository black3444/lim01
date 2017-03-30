# 조건(Conditionals) [(원본)](https://guides.emberjs.com/v2.12.0/templates/conditionals/)

[`if`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_if) 와 [`unless`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_unless)와 같은 구문은 빌트인 헬퍼로 구현된다. 헬퍼는 세가지 방법으로 호출할 수 잇다. 각 방법은 각 조건과 함께 아래에 설명 되어있다.

첫번째 호출 스타일은 **인라인 호출** 이다. 프로퍼티를 보여주는 것과 비슷하지만 헬퍼는 인자를 허용한다. 예:
```hbs
<div>
  {{if isFast "zoooom" "putt-putt-putt"}}
</div>
```

이 경우의 [`{{if}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_if)는 `isFast`가 참일때 `"zooom"`을 리턴하고, `isFast`가 거짓일 때 `"putt-putt-putt"`을 리턴한다. 인라인 표현식으로 호출된 헬퍼는 프로퍼티가 단일 값으로 표현하는 것과 동일한 방식으로 단일 값을 렌더링한다.

인라인 헬퍼는 HTML 태그 내부에서 사용할 필요가 없다. 어트리뷰트 내부에서도 사용할 수 있다.

```hbs
<div class="is-car {{if isFast "zoooom" "putt-putt-putt"}}">
</div>
```

**중첩된 호출** 은 헬퍼를 사용하는 또 다른 방법이다. 인라인 헬퍼와 마찬가지로 중첩 된 헬퍼는 단일 값을 생성하고 반환한다. 예를 들어, 이 템플릿은 `isFast`와 `isFueled`가 참이면 `"zoooom"`을 렌더링한다.

```hbs
<div>
  {{if isFast (if isFueled "zoooom")}}
</div>
```

처음 호출된 중첩 헬퍼는 오직 `isFueled`가 참일때만 `"zoooom"`을 반환한다. 그 다음 인라인 구문이 호출되고, `isFast`가 참인 경우에만 중첩된 헬퍼의 값(`"zoooom"`)이 렌더링된다.

헬퍼 사용법의 세번째 형식은 **블록 호출** 이다. 블록 헬퍼를 사용하여 템플릿의 일부만 렌더링한다. 헬퍼의 블록 호출은 헬퍼 이름 앞의 `#`와, 호출의 마지막에 `{{/` 두개의 중괄호로 닫는 것으로 인식할 수 있다.

예를 들어, 이 템플릿은 `person` 프로퍼티를 그것이 존재할때만 보여준다:
```hbs
{{#if person}}
  Welcome back, <b>{{person.firstName}} {{person.lastName}}</b>!
{{/if}}
```

[`{{if}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_if)는 `false`, `undefined`, `null`, `''`, `0`, 또는 `[]`(즉, 모든 자바스크립트 거짓 값 또는 빈 배열)을 제외한 모든 값을 참으로 체크한다.

만약 `{{#if}}`에 전달 된 값이 거짓으로 평가 되면 해달 호출의 `{{else}}` 블록이 렌더링된다:
```hbs
{{#if person}}
  Welcome back, <b>{{person.firstName}} {{person.lastName}}</b>!
{{else}}
  Please log in.
{{/if}}
```

`{{else}}` 헬퍼 호출을 체인을 걸 수 있고, 가장 일반적인 사용 사례는 `{{else if}}`이다.

```hbs
{{#if isAtWork}}
  Ship that code!
{{else if isReading}}
  You can finish War and Peace eventually...
{{/if}}
```

`{{if}}`의 역함수는 [`{{unless}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_unless)로, 동일하게 세가지 스타일의 호출방법이 있다. 예를들어, 이 템플릿에는 사용자가 지불하지 않은 금액만 표시된다.

```hbs
{{#unless hasPaid}}
  You owe: ${{total}}
{{/unless}}
```
