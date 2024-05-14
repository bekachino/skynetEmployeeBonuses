import React, {useEffect, useState} from 'react';
import './neactivkaBySquares.css';
import axiosApi from "../../axiosApi";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Logout from "../../components/logout/Logout";
import DatePicker from "../../components/datePicker/DatePicker";
import Button from "../../components/button/Button";
import Toolbar from "../../components/toolbar/Toolbar";
import {fetchLocations} from "../../features/userThunk";
import {setLocations} from "../../features/usersSlice";

const NeactivkaBySquares = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userState.user);
  const locations = useAppSelector(state => state.userState.locations);
  const [toobarOpen, setToolbarOpen] = useState(false);
  const [state, setState] = useState({
    date: '',
  });
  const [list, setList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [oab, setOab] = useState(0);
  const [aab, setAab] = useState(0);
  const [nab, setNab] = useState(0);
  const otkloneniePercentage = Number((Number(((aab || 0) / (oab || 0) * 100).toFixed(2)) - 90).toFixed(2));
  const otklonenieKolvo = Number((((oab || 0) / 100 * 90) / 100 * otkloneniePercentage).toFixed());

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value || '',
    }));
  };

  useEffect(() => {
    if (!user || user !== 'ruslan') navigate('/sign-in');
  }, [navigate, user]);

  useEffect(() => {
    dispatch(fetchLocations()).then(res => {
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
    // no dependencies needed
  }, []);

  useEffect(() => {
    void fetchList();
  }, [locations]);

  const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate(), 2);

    return `${year}-${month}-${day}`;
  };

  const fetchList = async (e) => {
    e?.preventDefault();
    try {
      if (!state.date) return;
      setListLoading(true);
      const list = await Promise.all(locations.map(async (location) => {
        const formData = new FormData();
        formData.append('date_filter', formatDate(new Date(state.date)));
        formData.append('squares_id', location.id);
        const req = await axiosApi.post('filtered_squares/', formData);
        const res = await req.data;
        return {
          squares: locations.filter(loc => loc.id === location.id)[0],
          aab: res.count['Актив'] || 0,
          nab: res.count['Неактив'] || 0,
          oab: (res.count['Неактив'] || 0) + (res.count['Актив'] || 0),
          aabPercentage: ((res.count['Актив'] || 0) / (res.count['Актив'] + res.count['Неактив'] || 0) * 100).toFixed(2) || 0,
          otkl_percentage: Number(((res.count['Актив'] || 0) / (res.count['Актив'] + res.count['Неактив'] || 0) * 100) - 90).toFixed(2) || 0,
          otkl_kolvo: Number((((res.count['Актив'] + res.count['Неактив'] || 0) / 100 * 90) / 100 *
            Number(((res.count['Актив'] || 0) / (res.count['Актив'] + res.count['Неактив'] || 0) * 100) - 90)).toFixed()) || 0,
        };
      }));
      setList(list);
      setOab(list.reduce((accumulator, currentValue) => {
        accumulator += currentValue?.oab;
        return accumulator;
      }, 0));
      setAab(list.reduce((accumulator, currentValue) => {
        accumulator += currentValue?.aab;
        return accumulator;
      }, 0));
      setNab(list.reduce((accumulator, currentValue) => {
        accumulator += currentValue?.nab;
        return accumulator;
      }, 0));

      setListLoading(false);
    }
    catch (e) {
      setListLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <Toolbar open={toobarOpen} onClick={() => setToolbarOpen(!toobarOpen)}>
        {
          (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
            !/iPad|Android|tablet|touch/i.test(navigator.userAgent)) && <Logout/>
        }
        <form className="toolbar-form" onSubmit={fetchList}>
          <DatePicker value={state.date} changeHandler={changeHandler} i={''}/>
          <Button
            type="submit"
            disabled={!state.date}
            loading={listLoading}
            label="Поиск"
          />
        </form>
      </Toolbar>
      <div style={{width: '100%', display: 'flex', marginTop: '20px'}}>
        <Button
          type="button"
          onClick={() => navigate('/bonuses')}
          label="Одиночный просмотр"
          style={{margin: '0 5px 0 auto'}}
        />
      </div>
      {
        !list.length &&
        <div className="bonuses-paper" style={{marginTop: '20px', color: '#29384A'}}>
          <h2>Выберите дату</h2>
        </div>
      }
      {
        !!list.length &&
        <div className="neactivka-all">
          <div className="neactivka-all-main br-10">
            <span className="neactivka-all-main-title">Все квадраты</span>
            <span className="neactivka-all-main-desc">Общая статистика</span>
            <div className="neactivka-all-main-items">
              <div className="neactivka-all-main-item">
                <span>ОАБ</span>
                <span>{oab}</span>
              </div>
              <div className="neactivka-all-main-item">
                <span>ААБ</span>
                <span>{aab}</span>
              </div>
              <div className="neactivka-all-main-item">
                <span>НАБ</span>
                <span>{nab}</span>
              </div>
              <div className="neactivka-all-main-item">
                <span>Отклонение</span>
                <span>{Number(otklonenieKolvo) || 0}</span>
              </div>
              <div className="neactivka-all-main-item">
                <span>Отклонение %</span>
                <span>{Number(otkloneniePercentage) || 0}%</span>
              </div>
            </div>
          </div>
          {
            list.map((item, i) => (
              <div className="neactivka-all-square br-10" key={i}>
                <span className="neactivka-all-square-title">{item.squares.squares}</span>
                <div className="neactivka-all-square-items">
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">ААБ</span>
                    <span className="neactivka-all-square-item-value br-10">{item.aab}</span>
                  </div>
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">НАБ</span>
                    <span className="neactivka-all-square-item-value br-10">{item.nab}</span>
                  </div>
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">ОАБ</span>
                    <span className="neactivka-all-square-item-value br-10">{item.oab}</span>
                  </div>
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">ААБ/ОАБ%</span>
                    <span className="neactivka-all-square-item-value br-10">{item.aabPercentage}%</span>
                  </div>
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">Отклонение %</span>
                    <span className="neactivka-all-square-item-value br-10">{Number(item.otkl_percentage) || 0}%</span>
                  </div>
                  <div className="neactivka-all-square-item br-10">
                    <span className="neactivka-all-square-item-title br-10">Отклонение, кол-во</span>
                    <span className="neactivka-all-square-item-value br-10">{item.otkl_kolvo}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      }
    </>
  );
};

export default NeactivkaBySquares;