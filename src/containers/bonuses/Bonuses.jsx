import React, {useEffect, useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import DatePicker from "../../components/datePicker/DatePicker";
import Autocomplete from "../../components/autocomplete/Autocomplete";
import Button from "../../components/button/Button";
import Logout from "../../components/logout/Logout";
import axiosApi from "../../axiosApi";
import './bonuses.css';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

const Bonuses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userState.user);
  const [districts, setDistricts] = useState([]);
  const [nonActives, setNonActives] = useState([]);
  const [showNonActives, setShowNonActives] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toobarOpen, setToolbarOpen] = useState(false);
  const [nonActivesLoading, setNonActivesLoading] = useState(false);
  const [state, setState] = useState({
    date: '',
    district: {id: -1, squares: ''},
  });
  const [data, setData] = useState({
    actives: -1,
    nonActives: -1,
    bonusPerActiveAbonent: 150,
    currentPercentage: 90,
    additionalEarningPercentage: 7,
    bonusPerConnectedAbonent980: 0,
    bonusPerConnectedAbonent1200: 0,
    connectedAbonents980: 0,
    connectedAbonents1200: 0,
    connectedAbonentsAmount: 0,
    bonusPerConnectedAbonent: 1000,
    bonusPerActiveAbonent2: 25,
    bonusPerReturnedAbonent2: 25,
    locations: [],
    user_list: [],
  });
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
      abonentsPlusMinusNumber * data.bonusPerActiveAbonent : 0) + w +
    (data.connectedAbonentsAmount * data.bonusPerConnectedAbonent) + (data.actives * data.bonusPerActiveAbonent2);
  const abonentAmountToReturn = Math.ceil(q * 0.03 * 150 + w + e + q * (1 - data.additionalEarningPercentage / 100) * data.bonusPerReturnedAbonent2 - r);

  const changeHandler = (e) => {
    const {name, value} = e.target;
    if (
      [
        'bonusPerActiveAbonent', 'currentPercentage', 'additionalEarningPercentage', 'bonusPerConnectedAbonent980',
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
        [name]: name === 'district' ? getDistrictByName(value) : value,
      }));
    }
  };

  const getDistrictByName = (name) => {
    return districts.filter(district => district.squares === name)[0] || {id: -1, squares: name};
  };

  const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate(), 2);

    return `${year}-${month}-${day}`;
  }

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const fetchSquires = async () => {
    try {
      const req = await axiosApi('http://planup.skynet.kg:8000/planup/all_squares/');
      const res = await req.data;
      setDistricts(res.data);
    }
    catch (e) {
      console.log(e);
    }
  };

  const fetchNonActives = async () => {
    setNonActivesLoading(true);
    try {
      const formData = new FormData();

      formData.append('date_filter', formatDate(state.date));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post(
        'http://planup.skynet.kg:8000/planup/noactive_squares/', formData);
      const res = await req.data;
      setNonActives(res.data);
      setNonActivesLoading(false);
    }
    catch (e) {
      console.log(e);
    }
  }

  const fetchConnectedAbonents = async () => {
    try {
      const formData = new FormData();

      formData.append('date_filter', formatDate(state.date));
      formData.append('squares_id', state.district.id);
      const req = await axiosApi.post(
        'http://planup.skynet.kg:8000/planup/planup_squares/', formData);
      const res = await req.data;
      setData(prevState => ({
        ...prevState,
        connectedAbonentsAmount: res.connection_count || 0,
      }));
    }
    catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchSquires();
    if (!user) navigate('/sign-in');
    if (toobarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('click', () => setShowNonActives(false));
  }, [navigate, toobarOpen, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetchNonActives();
      await fetchConnectedAbonents();
      const formData = new FormData();

      formData.append('date_filter', formatDate(state.date));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post(
        'http://planup.skynet.kg:8000/planup/filtered_squares/', formData);
      const res = await req.data;
      setData(prevState => ({
        ...prevState,
        actives: res.count['Актив'] || -1,
        nonActives: res.count['Неактив'] || -1,
        locations: res.locations,
        user_list: res.user_list,
      }));
      setFormLoading(false);
      setToolbarOpen(false);
    }
    catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Toolbar open={toobarOpen} onClick={() => setToolbarOpen(!toobarOpen)}>
        <Logout/>
        <form className="toolbar-form" onSubmit={onSubmit}>
          <DatePicker value={state.date} changeHandler={changeHandler} i={''}/>
          <Autocomplete
            value={state.district.squares}
            changeHandler={changeHandler}
            options={[...districts?.map(district => district.squares) || []]}
            i={''}
            onClick={() => setState(prevState => ({
              ...prevState,
              district: {id: -1, squares: ''},
            }))}
          />
          <Button type="submit" disabled={!state.date || state.district.id < 0} onClick={onSubmit}
                  loading={formLoading}/>
        </form>
      </Toolbar>
      <div className="bonuses-container">
        {
          data.actives < 0 ?
            <h3 className="bonuses-paper" style={{padding: '20px 0'}}>
              Нет данных
            </h3> :
            <>
              <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div className="bonuses-paper service-group-block">
                  <h1 className="bonuses-paper-title">Сервисная группа</h1>
                  <div className="bonuses-table" style={{gap: '4px'}}>
                    <div className="bonuses-table-title-row" style={{gap: '4px'}}>
                      <span className="br-l-10">ФИО</span>
                      <span className="br-r-10">Должность</span>
                    </div>
                    {data.user_list.length ?
                      data.user_list.map((user, i) => (
                        <div className="bonuses-table-value-row" style={{gap: '4px'}} key={i}>
                          <span className="br-l-10">{user}</span>
                          <span className="br-r-10">СИ</span>
                        </div>
                      )) :
                      <div className="bonuses-table-value-row" style={{gap: '4px'}}>
                        <span className="br-l-10">-</span>
                        <span className="br-r-10">-</span>
                      </div>
                    }
                  </div>
                </div>
                <div className="bonuses-paper location-block">
                  <h1 className="bonuses-paper-title">Локация</h1>
                  <span
                    style={{fontSize: '18px', fontWeight: '600'}}
                  >{data.locations.length ? data.locations.join(', ') : '-'}</span>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">
                  1. Премия за план
                  Активных абонентов
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
                </h1>
                <div className="bonuses-table bonuses-table-1">
                  <div className="table-col">
                    <span className="table-col-title">ААБ</span>
                    <span className="table-col-value">{data.actives}</span>
                  </div>
                  <div className="table-col">
                    <span
                      className="table-col-title" style={{cursor: 'pointer', position: 'relative'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNonActives(true);
                      }}>
                      НАБ
                      {
                        showNonActives &&
                        <div className="bonuses-paper non-actives-list">
                          <div className="non-actives-list-inner">
                            {
                              nonActivesLoading ? <span className="non-actives-list-loader"/> :
                                nonActives.map((nonActive, i) => (
                                  <div className="bonuses-paper non-actives-list-item" key={i}>
                                    <div className="non-actives-list-item-ls-abon">
                                      <span>ls_abon:</span>
                                      <span>{nonActive.ls_abon}</span>
                                    </div>
                                    <div className="non-actives-list-item-address">
                                      <span>Адрес:</span>
                                      <span>{nonActive.address}</span>
                                    </div>
                                    <div className="non-actives-list-item-balance">
                                      <span>Баланс:</span>
                                      <span>
                                        {nonActive.balance}
                                        {' '}<span style={{fontWeight: 600, textDecoration: 'underline'}}>c</span>
                                      </span>
                                    </div>
                                    <div className="non-actives-list-item-ip-address">
                                      <span>IP Адрес:</span>
                                      <span>{nonActive.ip_address}</span>
                                    </div>
                                  </div>
                                ))
                            }
                          </div>
                        </div>
                      }
                    </span>
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
                    <span className="table-col-value total-bonus">
                {
                  abonentsPlusMinusNumber * data.bonusPerActiveAbonent > 0 ?
                    formatNumber(abonentsPlusMinusNumber * data.bonusPerActiveAbonent) : 0
                }
              </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">2. Премия за подключенные заявки (продажи)</h1>
                <div className="bonuses-table bonuses-table-1">
                  <div className="table-col">
                    <span className="table-col-title">Кол-во заявок ТП 980</span>
                    <span className="table-col-value">0</span>
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
                      {/*{formatNumber(connected980Bonuses)}*/}0
                    </span>
                  </div>
                  <div className="table-col">
                    <span className="table-col-title">Кол-во заявок ТП 1200</span>
                    <span className="table-col-value">0</span>
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
                      {/*{formatNumber(connected1200Bonuses)}*/}0
                    </span>
                  </div>
                  <div className="table-col">
                    <span className="table-col-title table-col-value-yellow">Премия</span>
                    <span className="table-col-value total-bonus">
                      {/*{formatNumber(w)}*/}0
                    </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">3. Премия за подключение абонента</h1>
                <div className="bonuses-table bonuses-table-1">
                  <div className="table-col" style={{width: '66%'}}>
                    <span className="table-col-title">Кол-во подключенных абонентов</span>
                    <span className="table-col-value">
                {data.connectedAbonentsAmount}
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
                    <span className="table-col-value total-bonus">
                      {formatNumber(
                        data.connectedAbonentsAmount * data.bonusPerConnectedAbonent
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">4. Премия за Активных абонентов</h1>
                <div className="bonuses-table bonuses-table-1">
                  <div className="table-col" style={{width: '66%'}}>
                    <span className="table-col-title">Кол-во активных абонентов</span>
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
                    <span className="table-col-value total-bonus">
                      {formatNumber(data.actives * data.bonusPerActiveAbonent2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <div className="border-yellow total-bonuses" style={{width: '450px', marginLeft: 'auto'}}>
                  <h2 className="table-col-value-yellow" style={{padding: '11px 50px'}}>
                    ИТОГО ПРЕМИЯ за текущий месяц на бригаду
                  </h2>
                  <h1 style={{color: '#29384A', padding: '9px', fontWeight: 800}}>
                    {formatNumber(bonusForCurrentMonth)} сом
                  </h1>
                </div>
                <div
                  className="border-yellow can-earn-more-block"
                  style={{
                    margin: '8px 0 0 auto',
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
                      {Math.floor(data.nonActives / data.additionalEarningPercentage) === Infinity ?
                        0 : Math.floor(data.nonActives / data.additionalEarningPercentage)}
                    </h2>
                  </div>
                  <div className="border-red">
                    <h2 className="table-col-value-red"
                        style={{padding: '11px 20px', fontSize: '18px', display: 'flex'}}>
                      Вы можете ЗАРАБОТАТЬ ДОПОЛНИТЕЛЬНО если неактивку сократить до
                      <div style={{margin: '0 2px 0 7px', display: 'flex', flexDirection: 'column', width: '16px'}}>
                        <span
                          className="additionalEarningPercentage-increase"
                          onClick={() => (data.additionalEarningPercentage < 100) &&
                            changeHandler({
                              target: {
                                name: 'additionalEarningPercentage',
                                value: data.additionalEarningPercentage + 1
                              }
                            })}
                        >&#x25B2;</span>
                        <span
                          className="additionalEarningPercentage-decrease"
                          onClick={() => (data.additionalEarningPercentage > 0) &&
                            changeHandler({
                              target: {
                                name: 'additionalEarningPercentage',
                                value: data.additionalEarningPercentage - 1
                              }
                            })}
                        >&#x25BC;</span>
                      </div>
                      {' ' + data.additionalEarningPercentage}%
                      <input
                        className="editable-input" type="text"
                        name="bonusPerReturnedAbonent2"
                        value={data.bonusPerReturnedAbonent2}
                        onChange={changeHandler}/>
                      <span style={{textDecoration: 'underline'}}>c</span>
                    </h2>
                    <h1 style={{color: '#29384A', padding: '9px', fontWeight: 800}}>
                      {abonentAmountToReturn > 0 ? `+ ${formatNumber(abonentAmountToReturn)}` : 0} сом
                    </h1>
                  </div>
                </div>
              </div>
            </>
        }
      </div>
    </>
  );
};

export default Bonuses;