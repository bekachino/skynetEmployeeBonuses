import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Logout from '../../components/logout/Logout';
import DatePicker from '../../components/datePicker/DatePicker';
import Button from '../../components/button/Button';
import Toolbar from '../../components/toolbar/Toolbar';
import { fetchLocations } from '../../features/userThunk';
import { setLocations } from '../../features/usersSlice';
import { useFetchDataByAllSquares } from "../bonuses/hooks";
import './neactivkaBySquares.css';

const NeactivkaBySquares = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userState.user);
  const locations = useAppSelector((state) => state.userState.locations);
  const [toobarOpen, setToolbarOpen] = useState(false);
  const [state, setState] = useState({
    date: '',
  });
  const [oab, setOab] = useState(0);
  const [aab, setAab] = useState(0);
  const [nab, setNab] = useState(0);
  const [lastPaysCount, setLastPaysCount] = useState(0);
  const {
    dataBySquares,
    dataBySquaresLoading,
    fetchDataBySquares,
    percentageChange
  } = useFetchDataByAllSquares();
  const otkloneniePercentage = Number((
    Number((
      (
        (
          aab || 0
        ) / (
          oab || 0
        )
      ) * 100
    ).toFixed(2)) - 90
  ).toFixed(2));
  const otklonenieKolvo = Number((
    (
      (
        (
          (
            oab || 0
          ) / 100
        ) * 90
      ) / 100
    ) * otkloneniePercentage
  ).toFixed());
  
  const changeHandler = (e) => {
    const {
      name,
      value
    } = e.target;
    setState((prevState) => (
      {
        ...prevState,
        [name]: value || '',
      }
    ));
  };
  
  useEffect(() => {
    if (!user || ![
      'ruslan',
      'meerim'
    ].includes(user)) navigate('/sign-in');
  }, [
    navigate,
    user
  ]);
  
  useEffect(() => {
    dispatch(fetchLocations())
    .then((res) => {
      dispatch(setLocations(res.payload.data.filter((location) => ![36].includes(location.id))));
    })
    .catch((e) => console.log(e));
    if (toobarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    void fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);
  
  useEffect(() => {
    setOab(dataBySquares.reduce((accumulator, currentValue) => {
      accumulator += currentValue?.oab;
      return accumulator;
    }, 0));
    setAab(dataBySquares.reduce((accumulator, currentValue) => {
      accumulator += currentValue?.aab;
      return accumulator;
    }, 0));
    setNab(dataBySquares.reduce((accumulator, currentValue) => {
      accumulator += currentValue?.nab;
      return accumulator;
    }, 0));
    setLastPaysCount(dataBySquares.reduce((accumulator, currentValue) => {
      accumulator += currentValue?.lastPaysCount;
      return accumulator;
    }, 0));
  }, [dataBySquares]);
  
  const fetchList = async (e) => {
    e?.preventDefault();
    if (!state.date) return;
    void fetchDataBySquares(locations.filter(square => !square.squares.includes('партнерка')), state.date);
  };
  
  return (
    <>
      <Toolbar
        open={toobarOpen}
        onClick={() => setToolbarOpen(!toobarOpen)}
      >
        {!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !/iPad|Android|tablet|touch/i.test(navigator.userAgent) &&
          <Logout/>}
        <form
          className='toolbar-form'
          onSubmit={fetchList}
        >
          <DatePicker
            value={state.date}
            changeHandler={changeHandler}
            i={''}
          />
          <Button
            type='submit'
            disabled={!state.date}
            loading={dataBySquaresLoading}
            label='Поиск'
          />
        </form>
      </Toolbar>
      <div
        style={{
          width: '100%',
          display: 'flex',
          marginTop: '20px',
        }}
      >
        <Button
          type='button'
          onClick={() => navigate('/bonuses')}
          label='Одиночный просмотр'
          style={{ margin: '0 5px 0 auto' }}
        />
      </div>
      {!dataBySquares.length && (
        <div
          className='bonuses-paper'
          style={{
            marginTop: '20px',
            color: '#29384A',
          }}
        >
          <h2>Выберите дату</h2>
        </div>
      )}
      {!!dataBySquares.length && (
        <div className='neactivka-all'>
          <div className='neactivka-all-main br-10'>
            <span className='neactivka-all-main-title'>Все квадраты</span>
            <span className='neactivka-all-main-desc'>Общая статистика</span>
            <div className='neactivka-all-main-items'>
              <div className='neactivka-all-main-item'>
                <span>ОАБ</span>
                <span>{oab}</span>
              </div>
              <div className='neactivka-all-main-item'>
                <span>ААБ</span>
                <span>{aab}</span>
              </div>
              <div className='neactivka-all-main-item'>
                <span>НАБ</span>
                <span>{nab}</span>
              </div>
              <div className='neactivka-all-main-item'>
                <span>6 и более</span>
                <span>{lastPaysCount}</span>
              </div>
              <div className='neactivka-all-main-item'>
                <span>
                  {otklonenieKolvo >= 0 ? 'Соответствие' : 'Отклонение'}
                </span>
                <span>{otklonenieKolvo || 0}</span>
              </div>
              <div className='neactivka-all-main-item'>
                <span>
                  {otkloneniePercentage >= 0 ? 'Соответствие' : 'Отклонение'} %
                </span>
                <span>{otkloneniePercentage || 0}%</span>
              </div>
            </div>
          </div>
          {dataBySquares.map((item, i) => (
            <div
              className='neactivka-all-square br-10'
              key={i}
            >
              <span className='neactivka-all-square-title'>
                {item.squares.squares}
                <span
                  style={{
                    fontSize: '16px',
                    marginLeft: '10px',
                  }}
                >
                  ({item.locations})
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    maxHeight: '28px',
                  }}
                >
                  <div
                    style={{
                      margin: '0 2px 0 7px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <span
                      className='currentPercentage-increase'
                      onClick={() => {
                        percentageChange(i, (
                          item.percentage || 90
                        ) + 1);
                      }}
                    >
                      &#x25B2;
                    </span>
                    <span
                      className='currentPercentage-decrease'
                      onClick={() => {
                        percentageChange(i, (
                          item.percentage || 90
                        ) - 1);
                      }}
                    >
                      &#x25BC;
                    </span>
                  </div>
                  {' ' + item.percentage}%
                </div>
              </span>
              <div className='neactivka-all-square-items'>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    ААБ
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {item.aab}
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    НАБ
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {item.nab}
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    ОАБ
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {item.oab}
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    6 и более
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {item.lastPaysCount}
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    ААБ/ОАБ%
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {Number(item.aabPercentage) || 0}%
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    {Number((
                      (
                        item.aab || 0
                      ) / (
                        (
                          item.aab || 0
                        ) + (
                          item.nab || 0
                        )
                      )
                    ) * 100 - item.percentage || 0).toFixed(2) || 0 ? 'Соответствие' : 'Отклонение'}{' '}
                    %
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {Number((
                      (
                        item.aab || 0
                      ) / (
                        (
                          item.aab || 0
                        ) + (
                          item.nab || 0
                        )
                      )
                    ) * 100 - item.percentage || 0).toFixed(2) || 0 || 0}
                    %
                  </span>
                </div>
                <div className='neactivka-all-square-item br-10'>
                  <span className='neactivka-all-square-item-title br-10'>
                    {(
                      Number((
                        (
                          (
                            (
                              (
                                item.aab + item.nab || 0
                              ) / 100
                            ) * item.percentage
                          ) / 100
                        ) * Number((
                          (
                            item.aab || 0
                          ) / (
                            item.aab + item.nab || 0
                          )
                        ) * 100 - item.percentage)
                      ).toFixed()) || 0
                    ) >= 0 ? 'Соответствие' : 'Отклонение'}
                    , кол-во
                  </span>
                  <span className='neactivka-all-square-item-value br-10'>
                    {Number((
                      (
                        (
                          (
                            (
                              item.aab + item.nab || 0
                            ) / 100
                          ) * item.percentage
                        ) / 100
                      ) * Number((
                        (
                          item.aab || 0
                        ) / (
                          item.aab + item.nab || 0
                        )
                      ) * 100 - item.percentage)
                    ).toFixed()) || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NeactivkaBySquares;
