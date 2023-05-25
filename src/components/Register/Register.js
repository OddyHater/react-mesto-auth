import React from 'react';
import { useState } from 'react';

const Register = ({onSubmit}) => {

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

  const onRegister = (evt) => {
    evt.preventDefault();

    onSubmit(formValue);
  }


  return (
    <div className="login">
      <h2 className="login__title">Регистрация</h2>
      <form className="login__form" onSubmit={onRegister}>
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

export default Register;