import React, { useEffect, useState } from 'react';
import mainLogo from '../../assets/skynet-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import './signUp.css';

const SignUp = () => {
  const [state, setState] = useState({
    name: '',
    sirName: '',
    department: '',
  });
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      user ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      /iPad|Android|tablet|touch/i.test(navigator.userAgent)
    )
      navigate('/bonuses');
  }, [navigate, user]);

  const onSubmit = (e) => {
    e.preventDefault();
    // navigate('');
  };

  return (
    <div className="form-container">
      <img src={mainLogo} alt="Skynet" />
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={state.name}
          type="text"
          placeholder="Имя"
          onChange={onChange}
          required
        />
        <input
          name="sirName"
          value={state.sirName}
          type="text"
          placeholder="Фамилия"
          onChange={onChange}
          required
        />
        <input
          name="department"
          value={state.department}
          type="text"
          placeholder="Отдел"
          onChange={onChange}
          required
        />
        <button type="submit" className="form-submit-btn">
          Отправить
        </button>
        <span className="form-container-helper">Войти в аккаунт</span>
      </form>
    </div>
  );
};

export default SignUp;
