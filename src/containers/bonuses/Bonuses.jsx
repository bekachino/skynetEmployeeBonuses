import React, {useEffect, useRef, useState} from 'react';
import Toolbar from "../../components/toolbar/Toolbar";
import DatePicker from "../../components/datePicker/DatePicker";
import Autocomplete from "../../components/autocomplete/Autocomplete";
import Button from "../../components/button/Button";
import Logout from "../../components/logout/Logout";
import axiosApi from "../../axiosApi";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchLocations} from "../../features/userThunk";
import {setLocations, setNonActive} from "../../features/usersSlice";
import * as XLSX from 'xlsx';
import excelLogo from '../../assets/excel.png';
import './bonuses.css';

const Bonuses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const kolZayContainerRef = useRef();
  const [kolZayContainerPosition, setKolZayContainerPosition] = useState({x: 0, y: 0});
  const user = useAppSelector(state => state.userState.user);
  const locations = useAppSelector(state => state.userState.locations);
  const [nonActives, setNonActives] = useState([]);
  const [connectedSalesData, setConnectedSalesData] = useState([]);
  const [showNonActives, setShowNonActives] = useState(false);
  const [showConnectedAbonents, setShowConnectedAbonents] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toobarOpen, setToolbarOpen] = useState(false);
  const [nonActivesLoading, setNonActivesLoading] = useState(false);
  const [connectedAbonentsListLoading, setConnectedAbonentsListLoading] = useState(false);
  const [state, setState] = useState({
    date: new URLSearchParams(location.search).get('date') || '',
    district: {id: new URLSearchParams(location.search).get('id') || -1, squares: ''},
  });
  const [data, setData] = useState({
    aab: -1,
    nab: -1,
    oab: -1,
    bonusPerPlanActiveAbonent: 300,
    planActiveAbsBonusPercentage: 90,
    additionalEarningPercentage: 7,
    connectedAbonentsAmount: 0,
    bonusPerConnectedReq: 1000,
    bonusPerConnectedAbonent: 1000,
    bonusPerActiveAbonent2: 25,
    bonusPerReturnedAbonent2: 25,
    locations: [],
    user_list: [],
  });

  const aabPercentage = Number(((data.aab || 0) / (data.oab || 0) * 100).toFixed(2));
  const otkloneniePercentage = Number((aabPercentage - data.planActiveAbsBonusPercentage).toFixed(2));
  const otklonenieKolvo = Number((((data.oab || 0) / 100 * data.planActiveAbsBonusPercentage) / 100 * otkloneniePercentage).toFixed());
  const blockOneBonus = Number((otklonenieKolvo > 0 ? otklonenieKolvo * data.bonusPerPlanActiveAbonent : 0).toFixed());
  const blockTwoBonus = connectedSalesData.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.count * currentValue.price);
  }, 0);
  const blockThreeBonus = Number((data.connectedAbonentsAmount * data.bonusPerConnectedAbonent).toFixed());
  const blockFourBonus = Number(((data.aab || 0) * data.bonusPerActiveAbonent2).toFixed());
  const additionalBonus = Number((
    ((100 - data.planActiveAbsBonusPercentage) - data.additionalEarningPercentage) * (data.oab || 0) / 100 * 150
  ).toFixed());

  const changeHandler = (e) => {
    const {name, value} = e.target;
    if (
      [
        'bonusPerPlanActiveAbonent', 'planActiveAbsBonusPercentage', 'additionalEarningPercentage', 'bonusPerConnectedReq',
        'bonusPerConnectedAbonent', 'bonusPerActiveAbonent2', 'bonusPerReturnedAbonent2'
      ].includes(name)
    ) {
      setData(prevState => ({
        ...prevState,
        [name]: typeof value === 'number' ? value : value.replace(/[^0-9]/g, ''),
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        [name]: name === 'district' ? getDistrictByName(value) : value,
      }));
    }
  };

  const getDistrictByName = (name) => {
    return locations.filter(district => district.squares === name)[0] || {id: -1, squares: name};
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

  const fetchNonActives = async () => {
    try {
      setNonActivesLoading(true);
      const formData = new FormData();

      formData.append('date_filter', formatDate(new Date(state.date)));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post(
        'noactive_squares/', formData);
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
      setConnectedAbonentsListLoading(true);
      const formData = new FormData();

      formData.append('date_filter', formatDate(new Date(state.date)));
      formData.append('squares_id', state.district.id);
      const req = await axiosApi.post(
        'count_podkl/', formData);
      const res = await req.data;
      setConnectedSalesData(res.data.map(tariff => {
        return {
          ...tariff,
          price: 100,
        }
      }));
      setConnectedAbonentsListLoading(false);
    }
    catch (e) {
      console.log(e);
    }
  };

  const handleScroll = () => {
    const pos = kolZayContainerRef.current?.getBoundingClientRect();
    if (pos) {
      setKolZayContainerPosition({x: pos.left, y: pos.top});
    }
  };

  useEffect(() => {
    if (
      !user &&
      (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        !/iPad|Android|tablet|touch/i.test(navigator.userAgent))
    ) navigate('/sign-in');
    dispatch(fetchLocations()).then(res => {
      if (state.district.id > 0 && !state.district.squares) {
        setState(prevState => (
          {
            ...prevState,
            district: {
              id: state.district.id,
              squares: res.payload.data.filter(location => location.id === Number(state.district.id))[0]?.squares
            }
          }));
      }
      if (user === 'naryn') {
        dispatch(setLocations(res.payload.data.filter(location => ['Ат-Башы', 'Кочкор', 'Нарын'].includes(location.squares))));
      } else if (user === 'ik') {
        dispatch(setLocations(res.payload.data.filter(location => ['Кызыл-Суу', 'Ананьева', 'Чолпон-Ата', 'Балыкчы', 'Боконбаево', 'Барскоон']
          .includes(location.squares))));
      } else if (user === 'talas') {
        dispatch(setLocations(res.payload.data.filter(location => ['Талас', 'Талас1'].includes(location.squares))));
      } else if (user === 'djalalabad') {
        dispatch(setLocations(res.payload.data.filter(location => ['Базар-Коргон', 'Джалал-Абад'].includes(location.squares))));
      } else if (user === 'osh') {
        dispatch(setLocations(res.payload.data.filter(location => ['Ош', 'Араван', 'Кара-Суу'].includes(location.squares))));
      }
    }).catch(e => console.log(e));
    if (toobarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // no state dependency needed
  }, [dispatch, navigate, toobarOpen, user]);

  useEffect(() => {
    if (state.date) void onSubmit();
    // no dependency needed
  }, []);

  useEffect(() => {
    window.addEventListener('click', () => setShowNonActives(false));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      navigate(`?date=${formatDate(new Date(state.date))}&id=${state.district.id}`);
    }
    setFormLoading(true);
    try {
      if (!state.date || state.district.id < 0) return;
      await fetchNonActives();
      await fetchConnectedAbonents();
      const formData = new FormData();

      formData.append('date_filter', formatDate(new Date(state.date)));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post(
        'filtered_squares/', formData);
      const res = await req.data;
      setData(prevState => ({
        ...prevState,
        aab: res.count['Актив'] || -1,
        nab: res.count['Неактив'] || -1,
        oab: (res.count['Неактив'] || -1) + (res.count['Актив'] || -1),
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

  const handleExcelFileExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(nonActives.map(nonActive => {
      return {
        ls_abon: nonActive.ls_abon,
        address: nonActive.address,
        balance: nonActive.balance,
        name_abon: nonActive.name_abon,
        type_abon: nonActive.type_abon,
        phone_abon: nonActive.phone_abon,
        last_pay: nonActive.last_pay,
      }
    }));
    XLSX.utils.book_append_sheet(workbook, worksheet, state.district.squares);

    XLSX.writeFile(workbook, `${state.district.squares} - ${formatDate(new Date(state.date))}.xlsx`);
  };

  return (
    <>
      <Toolbar open={toobarOpen} onClick={() => setToolbarOpen(!toobarOpen)}>
        {
          (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
            !/iPad|Android|tablet|touch/i.test(navigator.userAgent)) && <Logout/>
        }
        <form className="toolbar-form" onSubmit={onSubmit}>
          <DatePicker value={state.date} changeHandler={changeHandler} i={''}/>
          {!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
            !/iPad|Android|tablet|touch/i.test(navigator.userAgent) &&
            <Autocomplete
              name="district"
              value={state.district.squares}
              changeHandler={changeHandler}
              options={[...locations?.map(district => district.squares) || []]}
              i={''}
              onClick={() => setState(prevState => ({
                ...prevState,
                district: {id: -1, squares: ''},
              }))}
              label="Выберите квадрат"
            />
          }
          <Button
            type="submit"
            disabled={!state.date || (
              !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
              !/iPad|Android|tablet|touch/i.test(navigator.userAgent) && !state.district.squares)}
            onClick={onSubmit}
            loading={formLoading}
            label="Поиск"
          />
        </form>
      </Toolbar>
      <div className="bonuses-container">
        {
          data.aab < 0 ?
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
                      onClick={() => (data.planActiveAbsBonusPercentage < 100) &&
                        changeHandler({
                          target: {
                            name: 'planActiveAbsBonusPercentage',
                            value: data.planActiveAbsBonusPercentage + 1
                          }
                        })}
                    >&#x25B2;</span>
                    <span
                      className="currentPercentage-decrease"
                      onClick={() => (data.planActiveAbsBonusPercentage > 0) &&
                        changeHandler({
                          target: {
                            name: 'planActiveAbsBonusPercentage',
                            value: data.planActiveAbsBonusPercentage - 1
                          }
                        })}
                    >&#x25BC;</span>
                  </div>
                  {' ' + data.planActiveAbsBonusPercentage}%
                </h1>
                <div className="bonuses-table bonuses-table-1">
                  <div className="table-col">
                    <span className="table-col-title">ААБ</span>
                    <span className="table-col-value">{data.aab > 0 ? data.aab : '-'}</span>
                  </div>
                  <div className="table-col">
                    <span
                      className="table-col-title" style={{cursor: 'pointer', position: 'relative'}}
                      onClick={(e) => {
                        if (data.nab < 0) return;
                        if (
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
                          /iPad|Android|tablet|touch/i.test(navigator.userAgent)
                        ) {
                          navigate(`/bonuses/non-actives-list?id=${state.district.id}&district_name=${state.district.squares}`);
                        } else {
                          e.stopPropagation();
                          setShowNonActives(true);
                        }
                      }}
                    >
                      НАБ
                      {
                        showNonActives &&
                        <div
                          className="bonuses-paper non-actives-list"
                          style={{display: 'flex', flexDirection: 'column',}}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{
                            padding: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px'
                          }}>
                            {
                              user === 'meerim' &&
                              <div className="export-to-excel" onClick={handleExcelFileExport}>
                                <img src={excelLogo} alt="excel logo" width="30px" height="30px"/>
                                <span style={{color: 'black'}}>экспорт</span>
                              </div>
                            }
                          </div>
                          <div className="non-actives-list-inner">
                            {
                              nonActivesLoading ? <span className="non-actives-list-loader"/> :
                                nonActives.length ?
                                  nonActives.map((nonActive, i) => (
                                    <div
                                      className={
                                        "bonuses-paper non-actives-list-item " +
                                        `${nonActive?.status && nonActive.status === 'Оплатил' ?
                                          'non-actives-list-item-paid' :
                                          nonActive?.status && nonActive.status !== 'Оплатил' ?
                                            'non-actives-list-item-has-status' : ''}`
                                      }
                                      key={i}
                                      onClick={() => {
                                        if (
                                          !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
                                          !/iPad|Android|tablet|touch/i.test(navigator.userAgent)
                                        ) {
                                          dispatch(setNonActive({
                                            ...nonActive,
                                            squares_id: locations.filter(location => `${location.id}` === state.district.id)[0]?.squares,
                                            user_listt: data.user_list,
                                          }));
                                          navigate(`/bonuses/non-active`);
                                        }
                                      }}
                                    >
                                      <div className="non-actives-list-item-ls-abon"
                                           style={{minWidth: '120px', maxWidth: '120px'}}>
                                        <span>Лицевой счёт:</span>
                                        <span>{nonActive.ls_abon}</span>
                                      </div>
                                      <div className="non-actives-list-item-address" style={{flexGrow: 1}}>
                                        <span>Адрес:</span>
                                        <span>{nonActive.address}</span>
                                      </div>
                                    </div>
                                  )) :
                                  <h3 className="bonuses-paper" style={{color: 'black'}}>
                                    Нет данных
                                  </h3>
                            }
                          </div>
                        </div>
                      }
                    </span>
                    <span className="table-col-value">{data.nab > 0 ? data.nab : '-'}</span>
                  </div>
                  <div className="table-col">
                    <span className="table-col-title">ОАБ</span>
                    <span className="table-col-value">{data.oab > 0 ? data.oab : '-'}</span>
                  </div>
                  <div className="table-col">
                    <span className="table-col-title">ААБ/ОАБ %</span>
                    <span className="table-col-value">
                      {aabPercentage}%
                    </span>
                  </div>
                  <div className="table-col">
                      <span className="table-col-title">
                        {otkloneniePercentage < 0 ? 'отклонение' : 'соответствие'} %
                      </span>
                    <span
                      className={`table-col-value ${otkloneniePercentage >= 0 ? 'table-col-value-plus' : 'table-col-value-minus'}`}>
                        {otkloneniePercentage}%
                      </span>
                  </div>
                  <div className="table-col">
                      <span className="table-col-title">
                        {otklonenieKolvo < 0 ? 'отклонение' : 'соответствие'}, кол-во
                      </span>
                    <span
                      className={`table-col-value ${otklonenieKolvo >= 0 ? 'table-col-value-plus' : 'table-col-value-minus'}`}>{otklonenieKolvo}</span>
                  </div>
                  <div className="table-col">
                     <span className="table-col-title table-col-value-yellow">
                      Премия {data.bonusPerPlanActiveAbonent}
                      <span style={{textDecoration: 'underline'}}>c</span>
                      </span>
                    <span className="table-col-value total-bonus">{blockOneBonus}</span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">2. Премия за подключенные заявки (продажи)</h1>
                <div className="bonuses-table bonuses-table-2" style={{flexWrap: 'wrap'}}>
                  <div className="table-col" style={{maxWidth: 'unset', position: 'relative'}}>
                    <span
                      className="table-col-title"
                      onMouseEnter={() => {
                        handleScroll();
                        setShowConnectedAbonents(true);
                      }}
                      onMouseLeave={() => setShowConnectedAbonents(false)}
                      style={{cursor: 'pointer'}}
                      ref={kolZayContainerRef}
                    >
                      Кол-во заявок
                      {
                        showConnectedAbonents && !!connectedSalesData.length &&
                        <div
                          className="bonuses-paper non-actives-list"
                          style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gridGap: '5px',
                            minWidth: '310px',
                            transform: `translate(${kolZayContainerPosition.x}px, ${kolZayContainerPosition.y}px)`,
                            height: 'unset',
                          }}
                        >
                          {
                            connectedAbonentsListLoading ? <span className="non-actives-list-loader"/> :
                              connectedSalesData.map((item, i) => (
                                <div className="bonuses-paper non-actives-list-item" key={i}
                                     style={{minWidth: '120px', width: 'unset'}}>
                                  <div className="non-actives-list-item-ls-abon" style={{width: '100%'}}>
                                    <div style={{display: 'flex', gap: '5px'}}>
                                      <span>{item.name}:</span>
                                      <span>{item.count}</span>
                                    </div>
                                    <div>
                                      <input
                                        className="editable-input" type="text"
                                        name="bonusPerConnectedReq"
                                        value={item.price || 0}
                                        onChange={(e) => {
                                          const connectedSalesDataCopy = [...connectedSalesData];
                                          connectedSalesData[i].price = e.target.value.replace(/[^0-9]/g, '');
                                          setConnectedSalesData(connectedSalesDataCopy);
                                        }}
                                        style={{marginLeft: '0'}}
                                      />
                                      <span style={{textDecoration: 'underline'}}>c</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          }
                        </div>
                      }
                    </span>
                    <span
                      className="table-col-value">{connectedSalesData.reduce((acc, currentValue) => acc + currentValue.count, 0)}</span>
                  </div>
                  <div className="table-col" style={{maxWidth: 'unset'}}>
                    <span className="table-col-title table-col-value-yellow">
                      Премия
                    </span>
                    <span className="table-col-value total-bonus">
                      {blockTwoBonus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">3. Премия за подключение абонента</h1>
                <div className="bonuses-table bonuses-table-3">
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
                      {formatNumber(blockThreeBonus)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bonuses-paper" style={{width: '100%'}}>
                <h1 className="bonuses-paper-title">4. Премия за Активных абонентов</h1>
                <div className="bonuses-table bonuses-table-4">
                  <div className="table-col" style={{width: '66%'}}>
                    <span className="table-col-title">Кол-во активных абонентов</span>
                    <span className="table-col-value">{data.aab}</span>
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
                      {formatNumber(blockFourBonus)}
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
                    {blockOneBonus + blockTwoBonus + blockThreeBonus + blockFourBonus} сом
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
                      {((Math.abs(otkloneniePercentage) + (10 - data.additionalEarningPercentage)) * data.oab / 100).toFixed()}
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
                    </h2>
                    <h1 style={{color: '#29384A', padding: '9px', fontWeight: 800}}>
                      {formatNumber(additionalBonus)} сом
                    </h1>
                  </div>
                </div>
              </div>
            </>
        }
      </div>
    </>
  )
    ;
};

export default Bonuses;