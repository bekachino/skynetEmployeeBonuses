import React, {useState} from 'react';
import mainLogo from '../../assets/skynet-logo.png';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import '../signUp/signUp.css';

const SignIn = () => {
  const [state, setState] = useState({
    login: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userState.user);

  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // navigate('');
  };

  return (
    <div className="form-container">
      <img src={mainLogo} alt="Skynet"/>
      <form onSubmit={onSubmit}>
        <input name='login' value={state.login} type="text" placeholder="Имя" onChange={onChange} required/>
        <input
          name='password' value={state.password} type="password" placeholder="Фамилия"
          onChange={onChange} required
        />
        <button type="submit" className="form-submit-btn">Войти</button>
        <span className="form-container-helper">Запросить логин и пароль</span>
      </form>
    </div>
  );
};

export default SignIn;