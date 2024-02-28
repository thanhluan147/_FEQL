import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import HandleLogin from "./handleLogin";
const LoginContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  margin: auto;
  margin-top: 100px;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin: 10px 0;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`;

const Login = () => {
  const nav = useNavigate();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const LoginData = await HandleLogin(loginForm);
      if (LoginData.success) {
        nav("/");
      }
    } catch (error) {
      alert("LOGIN FAIL!!!");
      console.log(error.response);
    }
  };

  const onChangeLogin = (event) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };
  return (
    <LoginContainer>
      <h2>Login</h2>
      <LoginForm>
        <Label htmlFor="username">Username:</Label>
        <Input
          type="text"
          id="name"
          name="username"
          onChange={onChangeLogin}
          value={loginForm.username}
          required
        />

        <Label htmlFor="password">Password:</Label>
        <Input
          type={showPassword ? "text" : "password"}
          id="pass"
          name="password"
          onChange={onChangeLogin}
          value={loginForm.password}
          required
        />
        <label>
          Show Password:
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleCheckboxChange}
          />
        </label>
        <Button onClick={handleLogin}>Login</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
