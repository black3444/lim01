# 계산된 프로퍼티와 [집합 데이터](http://endic.naver.com/enkrEntry.nhn?sLn=kr&entryId=1caffbdd2dad4db29da7ab71089ab822)(Computed Properties and Aggregate Data) [(원본)](https://guides.emberjs.com/v2.10.0/object-model/computed-properties-and-aggregate-data/)

때로는 배열에 있는 아이템의 속성에 의존하는 값을 가진 계산된 프로퍼티가 있을 수 있다. 예를 들어, 할일 목록의 배열이 있고 `isDone` 프로퍼티에 기반해서 완료되지 않은 할일을 계산하고 싶을 수 있다.

이를 쉽게 하기 위해, Ember에서는 하단에 표시된 `@each`를 제공한다.

```javascript
//app/components/todo-list.js
export default Ember.Component.extend({
  todos: null,

  init() {
    this.set('todos', [
      Ember.Object.create({ isDone: true }),
      Ember.Object.create({ isDone: false }),
      Ember.Object.create({ isDone: true }),
    ]);
  },

  incomplete: Ember.computed('todos.@each.isDone', function() {
    var todos = this.get('todos');
    return todos.filterBy('isDone', false);
  })
});
```

여기에서, 종속키 `todo.@each.isDone`은 다음 이벤트중 하나가 발생할 때, Ember.js가 바인딩을 업데이트하고 관찰자가 동작하도록 지시한다.

1. `todos` 배열 안의 모든 객체의 `isDone`프로퍼티가 변경 된다.
2. `todos` 배열에 새 아이템이 추가된다.
3. `todos` 배열에 아이템이 삭제된다.
4. 컴포넌트의 `todos` 프로퍼티가 다른 배열로 변경된다.

또한 Ember는 계산된 프로퍼티 매크로 [`computed.filterBy`](http://emberjs.com/api/classes/Ember.computed.html#method_filterBy)를 제공한다. 이 매크로는 위의 계산된 프로퍼티를 짧게 표현한다.

```javascript
//app/components/todo-list.js
export default Ember.Component.extend({
  todos: null,

  init() {
    this.set('todos', [
      Ember.Object.create({ isDone: true }),
      Ember.Object.create({ isDone: false }),
      Ember.Object.create({ isDone: true }),
    ]);
  },

  incomplete: Ember.computed.filterBy('todos', 'isDone', false)
});
```

위 두개의 예제에서, `incomplete`는 완료되지 않은 할일을 포함하는 배열이다.

```javascript
import TodoListComponent from 'app/components/todo-list';

let todoListComponent = TodoListComponent.create();
todoListComponent.get('incomplete.length');
// 결과 값: 1
```

만약 할일의 `isDone`프로퍼티를 변경하면, `incomplete` 프로퍼티는 자동적으로 업데이트된다.

```javascript
let todos = todoListComponent.get('todos');
let todo = todos.objectAt(1);
todo.set('isDone', true);

todoListComponent.get('incomplete.length');
// 결과 값: 0

todo = Ember.Object.create({ isDone: false });
todos.pushObject(todo);

todoListComponent.get('incomplete.length');
// 결과 값: 1
```

중요한 것은 `@each`는 오직 단일 단계에서만 작동한다. `todos.@each.ower.name` 이나 `todo.@each.owerner.@each.name`처럼 중첩해서 사용할 수 없다.

때로는 각각의 배열의 아이템의 프로퍼티가 변경되는것이 상관 없을 때도 있다. 이럴때에는 `@each`대신 `[]`를 사용한다. `[]` 키를 사용하면 계산된 프로퍼티는 아이템이 배열로부터 추가 혹은 제거되거나, 배열 프로퍼티가 다른 배열로 변경 되었을때에만 업데이트 됩니다.

```javascript
//app/components/todo-list.js
export default Ember.Component.extend({
  todos: null,

  init() {
    this.set('todos', [
      Ember.Object.create({ isDone: true }),
      Ember.Object.create({ isDone: false }),
      Ember.Object.create({ isDone: true }),
    ]);
  },

  selectedTodo: null,
  indexOfSelectedTodo: Ember.computed('selectedTodo', 'todos.[]', function() {
    return this.get('todos').indexOf(this.get('selectedTodo'));
  })
});
```

여기에서는 `indexOfSelectedTodo`는 `todos.[]`에 의존하므로, `todos`에 아이템을 추가하면 업데이트 되지만, `todo`의 `isDone`의 값이 바뀔때는 업데이트 되지 않는다.

[Ember.computed](http://emberjs.com/api/classes/Ember.computed.html) 매크로 중 일부는 `[]`키를 사용하여 일반적인 use-case를 구현한다. 예를 들어, 배열에서 프로퍼티를 매핑한 계산된 프로퍼티를 만들려면 [Ember.computed.map](http://emberjs.com/api/classes/Ember.computed.html#method_map)을 사용하거나 직접 계산된 프로퍼티를 구현하면 된다.

```javascript
const Hamster = Ember.Object.extend({
  excitingChores: Ember.computed('chores.[]', function() {
    return this.get('chores').map(function(chore, index) {
      return `CHORE ${index}: ${chore.toUpperCase()}!`;
    });
  })
});

const hamster = Hamster.create({
  chores: ['clean', 'write more unit tests']
});

hamster.get('excitingChores'); // ['CHORE 1: CLEAN!', 'CHORE 2: WRITE MORE UNIT TESTS!']
hamster.get('chores').pushObject('review code');
hamster.get('excitingChores'); // ['CHORE 1: CLEAN!', 'CHORE 2: WRITE MORE UNIT TESTS!', 'CHORE 3: REVIEW CODE!']
```

여기에서는 계산된 프로퍼티 매크로를 사용하여 일부를 추상화 할 수 있다.

```javascript
const Hamster = Ember.Object.extend({
  excitingChores: Ember.computed.map('chores', function(chore, index) {
    return `CHORE ${index}: ${chore.toUpperCase()}!`;
  })
});
```

이 계산된 매크로는 배열을 사용할 것이라고 생각하고 있기 때문에, 이 경우에는 `[]`키를 사용할 필요가 없다. 하지만, 직접 커스텀 계산된 프로퍼티를 작성하려면 Ember.js에게 `[]`키를 사용하여 배열 변경을 감지하도록 해야 한다.
