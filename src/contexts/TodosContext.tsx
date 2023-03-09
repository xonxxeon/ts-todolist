import { createContext, Dispatch, useContext, useReducer } from 'react';

export type Todo = {
  id : number;
  text : string;
  done : boolean;
};

type TodosState = Todo[];

const TodosStateContext = createContext<TodosState | undefined>(undefined);

type Action =
  | { type : 'CREATE'; text : string }
  | { type : 'TOGGLE'; id : number }
  | { type : 'REMOVE'; id : number };

type TodosDispatch = Dispatch<Action>;
const TodosDispatchContext = createContext<TodosDispatch | undefined>(
  undefined
);

function todosReducer(state: TodosState, action: Action): TodosState {
  switch (action.type) {
    case 'CREATE':
      const nextId = Math.max(...state.map(todo => todo.id)) + 1;
      return state.concat({
        id: nextId,
        text: action.text,
        done: false
      });
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error('Unhandled action');
  }
}

export function TodosContextProvider({ children } : { children : React.ReactNode }) {
    const [todos, dispatch] = useReducer(todosReducer, [
        {
            id: 1,
            text: 'Context API 배우기',
            done: true
        },
        {
            id: 2,
            text: 'TypeScript 배우기',
            done: true
        },
        {
            id: 3,
            text: 'TypeScript 와 Context API 함께 사용하기',
            done: false
        }
    ]);

    return (
        <TodosDispatchContext.Provider value={dispatch}>
            <TodosStateContext.Provider value={todos}>
                {children}
            </TodosStateContext.Provider>
        </TodosDispatchContext.Provider>
    );
}

export function useTodosState() {
    const state = useContext(TodosStateContext);
    if (!state) throw new Error('TodosProvider not found');
    return state;
}

export function useTodosDispatch() {
    const dispatch = useContext(TodosDispatchContext);
    if (!dispatch)  throw new Error('TodosProvider not found');
    return dispatch;
}

//  Context API를 사용하여 상태를 관리 할 때 useReducer를 사용하고 
//  상태 전용 Context 와 디스패치 함수 전용 Context를 만들면 매우 유용합니다. 
//  추가적으로, Context를 만들고 나서 해당 Context를 쉽게 사용 할 수 있는 
//  커스텀 Hooks를 작성하면 더욱 편하게 개발을 하실 수 있습니다.