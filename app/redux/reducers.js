export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      const newA = {
        todos: [...state.todos, action.payload],
      };
      return newA;
    case "DELETE":
      const deletedArr = state.todos.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        todos: deletedArr,
      };
    case "EDIT":
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    default:
      return state.todos;
  }
};

export const initialState = {
  todos: [
    // {
    //   id: 1,
    //   name: "learn English",
    //   priority: "daily",
    // },
    // {
    //   id: 2,
    //   name: "learn NextJS",
    //   priority: "daily",
    // },
  ],
};
