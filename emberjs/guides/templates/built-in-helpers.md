# 빌트인 헬퍼(Built-in Helpers) [(원본)](https://guides.emberjs.com/v2.12.0/templates/built-in-helpers/)

## 빌트인 헬퍼

지난 섹션에서 헬퍼 작성 방법을 배웠다. 헬퍼는 모든 템플릿에서 사용할 수 있는 간단한 함수이다. Ember는 템플릿을 좀 더 쉽게 개발할 수 있는 몇 가지 헬퍼를 제공한다. 이러한 헬퍼를 사용하면 데이터를 다른 헬퍼 또는 컴포넌트로 전달할 때, 보다 동적인 작업을 수행할 수 있다.

## 헬퍼를 이용하여 프로퍼티를 동적으로 가져오기

[`{{get}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_get) 헬퍼를 사용하면 변수 값을 다른 헬퍼 또는 컴포넌트로 동적으로 쉽게 보낼 수 있다. 계산된 프로퍼티의 결과에 따라 여러 값 중 하나를 출력하려는 경우에 유용할 수 있다.

```hbs
{{get address part}}
```

계산된 프로퍼티 `part`가 "zip"을 반환하면, `this.get('address.zip')`의 결과가 렌더링된다. 만약 "city"를 반환하면, `this.get('address.city')`를 가져온다.

## 중첩 빌트인 헬퍼

지난 섹션에서 헬퍼는 중첩될 수 있다고 설명했다. 이것은 이러한 종류의 동적 헬퍼와 결합될 수 있다. 예를 들어, [`{{concat}}`](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_concat) 헬퍼를 사용하면 여러 패러미터를 연결한 문자열 형태의 단일 패러미터로 컴포넌트 또는 헬퍼에 동적으로 쉽게 보낼 수 있다.

```hbs
{{get "foo" (concat "item" index)}}
```

이것은 index가 1일때, `this.get('foo.item1')`의 결과를 표시하고, index가 2일때 `this.get('foo.item2')`의 결과를 표시한다.
