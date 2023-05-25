import React from 'react';
import { useState } from 'react';
import AppApi from '../../utils/api';

const Login = () => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });

  const handleFormChange = (evt) => {
    let {name, value} = evt.target;

    setFormValue({
      ...formValue,
      [name]: value      
    })
  }

  const onLogin = (evt) => {
    evt.preventDefault();

    if(!formValue.email || !formValue.password) {
      return;
    }

    AppApi.login(formValue)
      .then((res) => {
        if(res.token) {
          localStorage.setItem('token', res.token);
          console.log(123);
        }
      })
  }

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form" onSubmit={onLogin}>
        <input
          type="email"
          name="email"
          className="login__input login__input_type_email"
          placeholder="Email"
          onChange={handleFormChange}
        />

        <input
          type="password"
          name="password"
          className="login__input login__input_type_password"
          placeholder="Пароль"
          onChange={handleFormChange}
        />
        <button 
          type="submit"
          value="Submit"
          className="login__submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;