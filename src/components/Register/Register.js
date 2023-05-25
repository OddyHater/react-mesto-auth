import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppApi from '../../utils/api';

const Register = () => {

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

  const navigate = useNavigate()
  
  const onRegister = (evt) => {
    evt.preventDefault();

    if(!formValue.email || !formValue.password) {
      return;
    }

    AppApi.regiser(formValue)
      .then((res) => {
        if(res) {
          navigate('/sign-in', {replace: true});
        }
      })
      .catch((err) => console.log(err));
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