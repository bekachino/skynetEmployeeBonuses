import React, {useEffect, useState} from 'react';
import mainLogo from '../../assets/skynet-logo.png';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import '../signUp/signUp.css';
import {signIn} from "../../features/userThunk";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signIn(state));
  };

  useEffect(() => {
    if (
      user ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      /iPad|Android|tablet|touch/i.test(navigator.userAgent)
    ) navigate('/bonuses');
  }, [navigate, user]);

  return (
    <div className="form-container">
      <img src={mainLogo} alt="Skynet"/>
      <form onSubmit={onSubmit}>
        <input name='login' value={state.login} type="text" placeholder="Логин" onChange={onChange} required/>
        <input
          name='password' value={state.password} type="password" placeholder="Пароль"
          onChange={onChange} required
        />
        <button type="submit" className="form-submit-btn">Войти</button>
        <span className="form-container-helper">Запросить логин и пароль</span>
      </form>
    </div>
  );
};

export default SignIn;