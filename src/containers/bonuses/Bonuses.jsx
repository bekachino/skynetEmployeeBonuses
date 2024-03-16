import React, {useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import './bonuses.css';
import DatePicker from "../../components/datePicker/DatePicker";

const Bonuses = () => {
  const [state, setState] = useState({
    date: '',
    district: '',
  });

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Toolbar>
        <DatePicker value={state.date} changeHandler={changeHandler} />
      </Toolbar>
    </>
  );
};

export default Bonuses;