"use client";
import AddToDo from "./AddToDo.component";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { todoReducer, initialState } from "../redux/reducers";
import TodoList from "./TodoList.component";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  chartConfig,
  data,
  registerChart,
  type IChart,
} from "./chart-config/chart-config";
import type { IPayloadTodo } from "./type";
import dayjs from "dayjs";

//Setup chart
registerChart();

export const renderChart = (isLoading: boolean, todos: any) => {
  const [dataChart, setDataChart] = useState([] as IChart | any);

  const renderData = todos.length ? (
    <Line options={chartConfig} data={dataChart} />
  ) : (
    "NO DATA"
  );

  const setRandomBg = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const hexColor = "#" + randomColor;
    return hexColor;
  };

  const configData = ({
    labels,
    labelName,
    data,
  }: {
    labels: string[];
    labelName: string[];
    data: any[];
  }) => {
    const newArr = [...Array(labels.length)];
    const datasets = newArr.map((item, index) => {
      const randomColor = setRandomBg();
      return {
        label: labelName[index],
        data: data[index],
        borderColor: randomColor,
        backgroundColor: randomColor,
      };
    });
    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const dataMap = (todos: IPayloadTodo[]) => {
    const newDatedMap = new Map();
    const newTodos = todos.reverse(); //Date init sort
    newTodos.forEach((item: IPayloadTodo) => {
      if (newDatedMap.has(item.createdAt)) {
        const newCount = newDatedMap.get(item.createdAt).count;
        const newChecked = newDatedMap.get(item.createdAt).checked;
        newDatedMap.set(item.createdAt, {
          ...newDatedMap.get(item.createdAt),
          count: newCount + 1,
          checked: item.isChecked ? newChecked + 1 : newChecked,
        });
      } else {
        newDatedMap.set(item.createdAt, {
          dated: item.createdAt,
          count: 1,
          checked: item.isChecked ? 1 : 0,
        });
      }
    });
    return Array.from(newDatedMap.values()).map(
      ({ dated, count, checked }) => ({
        dated,
        count,
        checked,
      })
    );
  };

  useEffect(() => {
    const datasetMap = dataMap(todos);
    const _labels = datasetMap.map((item) => item.dated);
    const _count = datasetMap.map((item) => item.count);
    const _checked = datasetMap.map((item) => item.checked);

    let dataOptions = configData({
      labels: _labels,
      labelName: ["Total", "Completed"],
      data: [_count, _checked],
    });
    console.log(dataOptions);

    setDataChart(dataOptions);
  }, [todos]);

  return <div>{renderData}</div>;
};

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

  const queryFireBaseCollection = useCallback(async () => {
    const querySnapshot = await getDocs(todoCollectionRef);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return data;
  }, []);

  const setData = (dispatch: any, newState: any) => {
    dispatch({
      type: "SET",
      payload: newState,
    });
  };

  useEffect(() => {
    //Get data
    const getTodos = async () => {
      try {
        setIsLoading(true);

        const newState = {
          ...initialState,
          todos: await queryFireBaseCollection(),
        };

        setData(dispatch, newState);
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
      <AddToDo dispatch={dispatch} todoCollectionRef={todoCollectionRef} />
      <div className="border-2 h-[5px] border-zinc-800"></div>
      {/* TO-DO-LIST */}
      {renderData}
      {/* RENDER CHART - CHART NEED FIX WHEN TODO CHECKED*/}
      <div>{renderChart(true, state.todos)}</div>
    </div>
  );
};
