"use client";
import { memo, useEffect } from "react";
import TodoItem from "./TodoItem.component";
import type { IPayloadTodo } from "./type";
import Image from "next/image";

interface IProps {
  todos: IPayloadTodo[];
  dispatch: ({
    type,
    payload,
  }: {
    type: string;
    payload: IPayloadTodo;
  }) => void;
}

const TodoList = (props: IProps) => {
  const { dispatch, todos } = props;

  useEffect(() => {
    console.log("render TodoList");
  });

  return (
    <div className="mt-4 h-[500px] overflow-y-scroll px-4">
      {todos.length ? (
        todos.map((todo: IPayloadTodo) => (
          <TodoItem
            name={todo?.name?.toUpperCase() || ""}
            id={todo.id}
            dispatch={dispatch}
            key={todo.id}
          />
        ))
      ) : (
        <Image
          src={`/images/empty.jpg`}
          width={500}
          height={500}
          alt="Picture of the author"
          className="flex items-center justify-center text-center w-[100%] h-[90%]"
        />
      )}
    </div>
  );
};
export default memo(TodoList);
