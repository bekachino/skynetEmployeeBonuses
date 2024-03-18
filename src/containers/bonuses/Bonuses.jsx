import React, {useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import DatePicker from "../../components/datePicker/DatePicker";
import './bonuses.css';
import Autocomplete from "../../components/autocomplete/Autocomplete";
import Button from "../../components/button/Button";

const districts = ['Ак-Ордо', 'Рухий-Мурас', 'Учкун', 'Аламедин-1'];

const Bonuses = () => {
  const [state, setState] = useState({
    date: '',
    district: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Toolbar>
        <form className="toolbar-form" onSubmit={onSubmit}>
          <DatePicker value={state.date} changeHandler={changeHandler}/>
          <Autocomplete value={state.district} changeHandler={changeHandler} options={districts}/>
          <Button type="submit" disabled={!state.date || !state.district} onClick={onSubmit} loading={formLoading}/>
        </form>
      </Toolbar>
    </>
  );
};

export default Bonuses;