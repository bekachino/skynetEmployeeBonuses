import React, {useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import DatePicker from "../../components/datePicker/DatePicker";
import './bonuses.css';
import Autocomplete from "../../components/autocomplete/Autocomplete";
import Button from "../../components/button/Button";
import Logout from "../../components/logout/Logout";

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
        <Logout/>
        <form className="toolbar-form" onSubmit={onSubmit}>
          <DatePicker value={state.date} changeHandler={changeHandler}/>
          <Autocomplete value={state.district} changeHandler={changeHandler} options={districts}/>
          <Button type="submit" disabled={!state.date || !state.district} onClick={onSubmit} loading={formLoading}/>
        </form>
      </Toolbar>
      <div className="bonuses-container">
        <div style={{display: 'flex', gap: '20px'}}>
          <div className="bonuses-paper" style={{minWidth: '832px'}}>
            <h1 className="bonuses-paper-title">Сервисная группа</h1>
            <div className="bonuses-table" style={{gap: '4px'}}>
              <div className="bonuses-table-title-row" style={{gap: '4px'}}>
                <span className="br-l-10">ФИО</span>
                <span className="br-r-10">Должность</span>
              </div>
              <div className="bonuses-table-value-row" style={{gap: '4px'}}>
                <span className="br-l-10">Сидоров Петр</span>
                <span className="br-r-10">Капитнан СИ</span>
              </div>
              <div className="bonuses-table-value-row" style={{gap: '4px'}}>
                <span className="br-l-10">Иванов Иван</span>
                <span className="br-r-10">СИ</span>
              </div>
              <div className="bonuses-table-value-row" style={{gap: '4px'}}>
                <span className="br-l-10">Дмитриев Дмитрий</span>
                <span className="br-r-10">СИ</span>
              </div>
            </div>
          </div>
          <div className="bonuses-paper" style={{flexGrow: '1', minWidth: '548px'}}>
            <h1 className="bonuses-paper-title">Локация</h1>
            <span
              style={{fontSize: '18px', fontWeight: '600'}}
            >Сокулук, Шопоков, Асыл-Баш, Романовка</span>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">1. Премия за план 90% Активных абонентов</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col">
              <span className="table-col-title">ААБ</span>
              <span className="table-col-value">3000</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">НАБ</span>
              <span className="table-col-value">450</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">ОАБ</span>
              <span className="table-col-value">3450</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">ААБ/ОАБ %</span>
              <span className="table-col-value">86,96%</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">отклонение %</span>
              <span className="table-col-value">-3,04%</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">отклонение, кол-во</span>
              <span className="table-col-value">-105,00</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Премия</span>
              <span className="table-col-value">0</span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">2. Премия за подключенные заявки (продажи)</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col">
              <span className="table-col-title">Кол-во заявок ТП 980</span>
              <span className="table-col-value">50</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Сумма</span>
              <span className="table-col-value">29400</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Кол-во заявок ТП 1200</span>
              <span className="table-col-value">30</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Кол-во заявок ТП 1200</span>
              <span className="table-col-value">21600</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Премия</span>
              <span className="table-col-value">51 000</span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">3. Премия за подключение абонента</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col" style={{width: '66%'}}>
              <span className="table-col-title">Кол-во подключенных абонентов</span>
              <span className="table-col-value">80</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Кол-во подключенных абонентов</span>
              <span className="table-col-value">80 000</span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">4. Премия за Активных абонентов</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col" style={{width: '66%'}}>
              <span className="table-col-title">4. Премия за Активных абонентов</span>
              <span className="table-col-value">3000</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Кол-во подключенных абонентов</span>
              <span className="table-col-value">75 000</span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <div className="bonuses-table bonuses-table-1" style={{gap: '4px'}}>
            <div className="table-col" style={{width: '50%', gap: '4px'}}>
              <span className="table-col-title br-r-0">ИТОГО ПРЕМИЯ за текущий месяц на бригаду</span>
              <span className="table-col-title br-r-0">Если неактивку сократить до 7% вы можете заработать дополнительно</span>
              <span className="table-col-title br-r-0">Для этого надо вернуть всего абонентов из неактивки</span>
            </div>
            <div className="table-col" style={{gap: '4px'}}>
              <span className="table-col-value br-l-0 table-col-value-red">206 000</span>
              <span className="table-col-value br-l-0 table-col-value-minus">20 738</span>
              <span className="table-col-value br-l-0">209</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bonuses;