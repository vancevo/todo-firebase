"use client";

import { Button, Form, Input } from "antd";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../config/firebase-config";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.log(e);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.log(e);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Form className="flex gap-2" onFinish={signIn}>
        <Form.Item label="Email" name="email">
          <Input
            type="text"
            placeholder="Email.."
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input
            type="text"
            placeholder="Password.."
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form>
      <div className="flex justify-end gap-2 mb-4">
      <Button danger onClick={signInWithGoogle}>
        Sign in With Google
      </Button>
      <Button onClick={logOut}>
        Log out
      </Button>
      </div>
    </div>
  );
}
