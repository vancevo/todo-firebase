"use client";
import { Button, Input, Space } from "antd";
import { Form } from "antd";
import { nanoid } from "nanoid";
import { useState } from "react";
import type { IPayloadTodo } from "./type";
import { useDebouncedCallback } from "use-debounce";
import { addDoc, doc, setDoc } from "firebase/firestore";

interface IProps {
  todoCollectionRef: any;
  dispatch: ({
    type,
    payload,
  }: {
    type: string;
    payload: IPayloadTodo;
  }) => void;
}

const AddToDo = (props: IProps) => {
  const [value, setValue] = useState("");
  const debounced = useDebouncedCallback((value) => {
    setValue(value);
  }, 100);

  const { dispatch } = props;

  const handleSubmit = async (event: { todo: string }) => {
    try {
      const newId =  nanoid();
      const todoDocRef = doc(props.todoCollectionRef, newId)

      await setDoc(todoDocRef, {
        id: newId,
        name: event.todo,
        isChecked: false,
      });
      dispatch({
        type: "ADD",
        payload: {
          id: newId,
          name: event.todo,
        },
      });
      setValue("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex">
      <Form className="w-[100%] mt-4" onFinish={handleSubmit}>
        <Form.Item name={"todo"}>
          <Space.Compact
            className="flex"
            style={{
              width: "100%",
            }}
          >
            <Input
              placeholder="Add to do..."
              className="w-[100%] flex-1"
              value={value}
              onChange={(e) => debounced(e.target.value)}
            />
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Space.Compact>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddToDo;
