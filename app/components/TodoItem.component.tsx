"use client";
import React, { memo, useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import type { IPayloadTodo } from "./type";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Checkbox } from "antd";
import dayjs from "dayjs";

interface IProps {
  id: string;
  name: string;
  isChecked: boolean;

  createdAt: string | Date;
  dispatch: ({
    type,
    payload,
  }: {
    type: string;
    payload: IPayloadTodo | any;
  }) => void;
}

const TodoItem = ({ id, name, isChecked, createdAt, dispatch }: IProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(name);
  const [isCheckValue, setIsCheckValue] = useState(isChecked);

  const datedTodo = createdAt

  const onCheck = async (e: any, id: string) => {
    setIsCheckValue(e.target.checked);
    await mutationDoc(id, value, e.target.checked);
  };

  const handleDeleted = async (id: string) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await deleteDoc(todoDoc);

      dispatch({
        type: "DELETE",
        payload: { id },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: CustomEvent | any) => {
    const value = e.target.value as string;
    if (value) {
      setValue(value);
    }
  };

  const mutationDoc = async (
    id: string,
    value: string,
    isCheckValue: boolean
  ) => {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, {
      name: value,
      isChecked: isCheckValue,
      createdAt: dayjs(new Date()).format("DD/MM/YYYY"),
    });
  };

  const handleSave = async (id: string) => {
    if (!value) {
      return;
    }
    try {
      await mutationDoc(id, value, isCheckValue);
      dispatch({
        type: "EDIT",
        payload: {
          id,
          name: value,
          isChecked: isCheckValue,
          createdAt: dayjs(new Date()).format("DD/MM/YYYY"),
        },
      });

      setIsEdit(false);
    } catch (e) {
      console.log(e);
    }
  };

  const viewTodoTemplate = (
    <div id={id} className="my-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Checkbox
            onChange={(e) => onCheck(e, id)}
            checked={isCheckValue}
          ></Checkbox>
          <p className={isCheckValue ? "line-through" : ""}>
            {name} - {datedTodo}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="primary" danger onClick={() => handleDeleted(id)}>
            Delete
          </Button>
          <Button
            type="primary"
            onClick={(id) => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  const editTodoTemplate = (
    <div id={id} className="my-4">
      <div>
        <Form onFinish={() => handleSave(id)}>
          <Form.Item name={name}>
            <Input
              defaultValue={name}
              onChange={handleChange}
              className="w-[80%]"
            ></Input>
            <div className="float-right flex gap-2">
              <Button type="primary" danger onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  return <>{isEdit ? editTodoTemplate : viewTodoTemplate}</>;
};

export default memo(TodoItem);
