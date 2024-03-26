import React from 'react';
import './logout.css';
import {useAppDispatch} from "../../app/hooks";
import {logout} from "../../features/usersSlice";

const Logout = () => {
  const dispatch = useAppDispatch();

  return (
    <button type='button' className="logout-btn" onClick={() => dispatch(logout())}>
      <div className="logout-btn-icon"/>
      Выйти
    </button>
  );
};

export default Logout;