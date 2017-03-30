# 개발 헬퍼(Development Helpers) [(원본)](https://guides.emberjs.com/v2.12.0/templates/development-helpers/)

## 개발 헬퍼
핸들바와 Ember에는 템플릿을 좀 더 쉽게 개발할 수 있는 몇 가지 헬퍼가 있다. 이 도우미를 사용하면 브라우저 콘솔에 변수를 출력하거나 템플릿에서 디버거를 활성화 할 수 있다.

### 로깅(Logging)
[`{{log}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_log)헬퍼를 사용하면 현재 렌더링 컨텍스트의 변수나 표현식을 브라우저의 콘솔에 쉽게 출력할 수 있다:
```hbs
{{log 'Name is:' name}}
```

`{{log}}` 헬퍼는 문자열이나 숫자 같은 기본 유형도 허용한다.

## 중단점 추가하기
[`{{debugger}}`](https://emberjs.com/api/classes/Ember.Templates.helpers.html#method_debugger) 헬퍼는 JavaScript의 `debugger` 키워드와 동일한 핸들바를 제공한다. 디버거 헬퍼에서 실행을 중단하고 현재 렌더링 컨텍스트를 검사할 수 있다.

```hbs
{{debugger}}
```

디버거 헬퍼를 사용할 때 `get` 함수에 액세스 할 수 있다. 이 함수는 템플릿 컨텍스트에서 사용할 수 있는 값을 검색한다. 예를들어 템플릿 내에서 값 `{{foo}}`가 예상대로 렌더링 되지 않는 이유가 궁금하다면, `{{debugger}}`문과 `debugger;` 중단점에 도달할때, 값을 검색할 수 있다.
```js
> get('foo')
```

`get`은 키워드 또한 인식한다. 그래서 이 상황에서:
```hbs
{{#each items as |item|}}
  {{debugger}}
{{/each}}
```

현재 항목의 값에서 가져올 수 있다:
```js
> get('item.name')
```

뷰의 컨텍스트에 엑세스하여 기대하는 개체인지 확인할 수도 있다:
```js
> context

```
