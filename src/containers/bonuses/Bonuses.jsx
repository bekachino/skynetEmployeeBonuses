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
  const [data, setData] = useState({
    actives: 3000,
    nonActives: 450,
    bonusPerActiveAbonent: 150,
    currentPercentage: 90,
    bonusPerConnectedAbonent980: 588,
    bonusPerConnectedAbonent1200: 720,
    connectedAbonents980: 50,
    connectedAbonents1200: 30,
    bonusPerConnectedAbonent: 1000,
    bonusPerActiveAbonent2: 25,
    bonusPerReturnedAbonent2: 25,
  });
  const [formLoading, setFormLoading] = useState(false);
  const activesPercentage = Number((data.actives / (data.actives + data.nonActives) * 100).toFixed(2)) || 0;
  const abonentsPlusMinusPercentage = Number((activesPercentage - data.currentPercentage).toFixed(2)) || 0;
  const abonentsPlusMinusNumber = Math.floor((abonentsPlusMinusPercentage / 100) * (data.actives + data.nonActives));
  const connected980Bonuses = data.connectedAbonents980 * data.bonusPerConnectedAbonent980;
  const connected1200Bonuses = data.connectedAbonents1200 * data.bonusPerConnectedAbonent1200;

  const q = data.actives + data.nonActives;
  const w = connected980Bonuses + connected1200Bonuses;
  const e = (data.connectedAbonents980 + data.connectedAbonents1200) * data.bonusPerConnectedAbonent;
  const r = (abonentsPlusMinusNumber * data.bonusPerActiveAbonent > 0 ?
      abonentsPlusMinusNumber * data.bonusPerActiveAbonent : 0) +
    connected980Bonuses + connected1200Bonuses +
    (data.connectedAbonents980 + data.connectedAbonents1200)
    * data.bonusPerConnectedAbonent +
    data.actives * data.bonusPerActiveAbonent2;
  const bonusForCurrentMonth = (abonentsPlusMinusNumber * data.bonusPerActiveAbonent > 0 ?
      abonentsPlusMinusNumber * data.bonusPerActiveAbonent : 0) +
    connected980Bonuses + connected1200Bonuses +
    (data.connectedAbonents980 + data.connectedAbonents1200)
    * data.bonusPerConnectedAbonent +
    data.actives * data.bonusPerActiveAbonent2;

  const changeHandler = (e) => {
    const {name, value} = e.target;
    if (
      [
        'bonusPerActiveAbonent', 'currentPercentage', 'bonusPerConnectedAbonent980',
        'bonusPerConnectedAbonent1200', 'bonusPerConnectedAbonent', 'bonusPerActiveAbonent2',
        'bonusPerReturnedAbonent2'
      ].includes(name)
    ) {
      setData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const abonentAmountToReturn = Math.ceil(q * 0.03 * 150 + w + e + q * 0.93 * data.bonusPerReturnedAbonent2 - r);

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
          <h1 className="bonuses-paper-title">
            1. Премия за план
            <div style={{margin: '0 2px 0 7px', display: 'flex', flexDirection: 'column'}}>
              <span
                className="currentPercentage-increase"
                onClick={() => (data.currentPercentage < 100) &&
                  changeHandler({target: {name: 'currentPercentage', value: data.currentPercentage + 1}})}
              >&#x25B2;</span>
              <span
                className="currentPercentage-decrease"
                onClick={() => (data.currentPercentage > 0) &&
                  changeHandler({target: {name: 'currentPercentage', value: data.currentPercentage - 1}})}
              >&#x25BC;</span>
            </div>
            {' ' + data.currentPercentage}%
            {' '}Активных абонентов
          </h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col">
              <span className="table-col-title">ААБ</span>
              <span className="table-col-value">{data.actives}</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">НАБ</span>
              <span className="table-col-value">{data.nonActives}</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">ОАБ</span>
              <span className="table-col-value">{data.actives + data.nonActives}</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">ААБ/ОАБ %</span>
              <span className="table-col-value">
                {activesPercentage}%
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title">
                {abonentsPlusMinusPercentage < 0 ? 'отклонение' : 'соответствие'} %
              </span>
              <span className={
                `table-col-value
                ${abonentsPlusMinusPercentage >= 0 ? 'table-col-value-plus' : 'table-col-value-minus'}`}
              >
                {abonentsPlusMinusPercentage}%
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title">
                {abonentsPlusMinusNumber < 0 ? 'отклонение' : 'соответствие'}, кол-во
              </span>
              <span className={
                `table-col-value
                ${abonentsPlusMinusNumber >= 0 ? 'table-col-value-plus' : 'table-col-value-minus'}`}
              >
                {abonentsPlusMinusNumber}
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title table-col-value-yellow">
                Премия
                <input
                  className="editable-input" type="text"
                  name="bonusPerActiveAbonent"
                  value={data.bonusPerActiveAbonent}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </span>
              <span className="table-col-value">
                {
                  abonentsPlusMinusNumber * data.bonusPerActiveAbonent > 0 ?
                    formatNumber(abonentsPlusMinusNumber * data.bonusPerActiveAbonent) : 0}
              </span>
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
              <span className="table-col-title">
                Сумма
                <input
                  className="editable-input" type="text"
                  name="bonusPerConnectedAbonent980"
                  value={data.bonusPerConnectedAbonent980}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </span>
              <span className="table-col-value">
                {formatNumber(connected980Bonuses)}
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title">Кол-во заявок ТП 1200</span>
              <span className="table-col-value">30</span>
            </div>
            <div className="table-col">
              <span className="table-col-title">
                Сумма
                <input
                  className="editable-input" type="text"
                  name="bonusPerConnectedAbonent1200"
                  value={data.bonusPerConnectedAbonent1200}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </span>
              <span className="table-col-value">
                {formatNumber(connected1200Bonuses)}
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title table-col-value-yellow">Премия</span>
              <span className="table-col-value">
                {formatNumber(w)}
              </span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">3. Премия за подключение абонента</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col" style={{width: '66%'}}>
              <span className="table-col-title">Кол-во подключенных абонентов</span>
              <span className="table-col-value">
                {data.connectedAbonents980 + data.connectedAbonents1200}
              </span>
            </div>
            <div className="table-col">
              <span className="table-col-title table-col-value-yellow">
                Премия
                <input
                  className="editable-input" type="text"
                  name="bonusPerConnectedAbonent"
                  value={data.bonusPerConnectedAbonent}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </span>
              <span className="table-col-value">
                {formatNumber(
                  (data.connectedAbonents980 + data.connectedAbonents1200)
                  * data.bonusPerConnectedAbonent
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <h1 className="bonuses-paper-title">4. Премия за Активных абонентов</h1>
          <div className="bonuses-table bonuses-table-1">
            <div className="table-col" style={{width: '66%'}}>
              <span className="table-col-title">4. Премия за Активных абонентов</span>
              <span className="table-col-value">{data.actives}</span>
            </div>
            <div className="table-col">
              <span className="table-col-title table-col-value-yellow">
                Премия
                <input
                  className="editable-input" type="text"
                  name="bonusPerActiveAbonent2"
                  value={data.bonusPerActiveAbonent2}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </span>
              <span className="table-col-value">
                {formatNumber(data.actives * data.bonusPerActiveAbonent2)}
              </span>
            </div>
          </div>
        </div>
        <div className="bonuses-paper" style={{minWidth: '1440px'}}>
          <div className="border-yellow" style={{width: '450px', marginLeft: 'auto'}}>
            <h2 className="table-col-value-yellow" style={{padding: '11px 50px'}}>
              ИТОГО ПРЕМИЯ за текущий месяц на бригаду
            </h2>
            <h1 style={{color: '#29384A', padding: '9px'}}>
              {formatNumber(bonusForCurrentMonth)} сом
            </h1>
          </div>
          <div
            className="border-yellow"
            style={{
              width: '780px', margin: '8px 0 0 auto',
              display: 'flex', justifyContent: 'space-between', alignItems: 'stretch',
              backgroundColor: 'rgb(240, 240, 240)'
            }}>
            <div
              style={{
                backgroundColor: '#F0F0F0', flexGrow: '1', padding: '14px 20px',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <span style={{color: '#29384A', fontSize: '18px', fontWeight: '600'}}>
                Для этого надо вернуть всего абонентов из неактивки:
              </span>
              <h2 style={{marginTop: 'auto', color: '#D1585B'}}>
                {Math.ceil((data.actives + data.nonActives) * 0.93 - data.actives)}
              </h2>
            </div>
            <div className="border-red">
              <h2 className="table-col-value-red" style={{padding: '11px 20px', fontSize: '18px'}}>
                Вы можете ЗАРАБОТАТЬ ДОПОЛНИТЕЛЬНО если неактивку сократить до 7%
                <input
                  className="editable-input" type="text"
                  name="bonusPerReturnedAbonent2"
                  value={data.bonusPerReturnedAbonent2}
                  onChange={changeHandler}/>
                <span style={{textDecoration: 'underline'}}>c</span>
              </h2>
              <h1 style={{color: '#29384A', padding: '9px'}}>
                {abonentAmountToReturn > 0 ? `+ ${formatNumber(abonentAmountToReturn)}` : 0} сом
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bonuses;