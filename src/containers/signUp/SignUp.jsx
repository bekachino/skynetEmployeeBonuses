import React, {useState} from 'react';
import mainLogo from '../../assets/skynet-logo.png';
import './signUp.css';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

const SignUp = () => {
  const [state, setState] = useState({
    name: '',
    sirName: '',
    department: '',
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
        <input name='name' value={state.name} type="text" placeholder="Имя" onChange={onChange} required/>
        <input name='sirName' value={state.sirName} type="text" placeholder="Фамилия" onChange={onChange} required/>
        <input name='department' value={state.department} type="text" placeholder="Отдел" onChange={onChange} required/>
        <button type="submit" className="form-submit-btn">Отправить</button>
      </form>
    </div>
  );
};

export default SignUp;