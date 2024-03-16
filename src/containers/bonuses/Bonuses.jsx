import React, {useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import DatePicker from "../../components/datePicker/DatePicker";
import './bonuses.css';
import Autocomplete from "../../components/autocomplete/Autocomplete";

const districts = ['Ак-Ордо', 'Рухий-Мурас', 'Учкун', 'Аламедин-1'];

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
        <div className="toolbar-form">
          <DatePicker value={state.date} changeHandler={changeHandler}/>
          <Autocomplete value={state.district} changeHandler={changeHandler} options={districts}/>
        </div>
      </Toolbar>
    </>
  );
};

export default Bonuses;