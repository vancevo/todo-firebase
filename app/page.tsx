import Auth from "./components/auth";
import { Todo } from "./components/Todo.component";

export default function Home() {
  // const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <div className="box-container">
      {/* <div className="todo-box border-solid border-[2px] p-4">
        <h1 className="text-2xl">To do list</h1>
        <AddToDo dispatch={dispatch} />

        <TodoList todos={state.todos} dispatch={dispatch} />
      </div> */}


      <Auth />
      <h1 className="text-2xl font-bold">TO DO LIST</h1>
      <Todo />
    </div>
  );
}
