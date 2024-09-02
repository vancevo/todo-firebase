"use client";
import React, { memo, useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import type { IPayloadTodo } from "./type";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

interface IProps {
  id: string;
  name: string;
  dispatch: ({
    type,
    payload,
  }: {
    type: string;
    payload: IPayloadTodo;
  }) => void;
}

const TodoItem = ({ id, name, dispatch }: IProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(name);

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

  const handleSave = async (id: string) => {
    if (!value) {
      return;
    }
    try {
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, {
        name: value,
      });
      dispatch({
        type: "EDIT",
        payload: {
          id,
          name: value,
        },
      });

      setIsEdit(false);
    } catch (e) {
      console.log(e);
    }
  };

  const viewTodoTemplate = (
    <div id={id} className="my-4">
      <div className="flex justify-between">
        <p>
          {name}
        </p>
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
