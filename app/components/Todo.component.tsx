"use client";
import AddToDo from "./AddToDo.component";
import { useEffect, useReducer, useState } from "react";
import { todoReducer, initialState } from "../redux/reducers";
import TodoList from "./TodoList.component";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import Image from "next/image";

export const Todo = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const todoCollectionRef = collection(db, "todos");

  const renderData = isLoading ? (
    "...LOADING..."
  ) : state.todos?.length ? (
    <TodoList todos={state.todos} dispatch={dispatch} />
  ) : (
    <div className="w-[100%] flex justify-center">
      <Image
        src={`/images/empty.jpg`}
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </div>
  );

  useEffect(() => {
    //Get data
    const getTodos = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(todoCollectionRef);

        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        const newState = {
          ...initialState,
          todos: data,
        };

        dispatch({
          type: "SET",
          payload: newState,
        });

      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    //set data
    getTodos();
  }, []);

  return (
    <div className="w-[50vw] p-4">
      <AddToDo dispatch={dispatch} todoCollectionRef={todoCollectionRef}/>
      <div className="border-2 h-[5px] border-zinc-800"></div>
      {/* TO-DO-LIST */}
      {renderData}
    </div>
  );
};
