import React, {useEffect, useState} from 'react';
import excelLogo from "../../assets/excel.png";
import {setNonActive} from "../../features/usersSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import * as XLSX from "xlsx";
import {useLocation, useNavigate} from "react-router-dom";
import axiosApi from "../../axiosApi";

const NonActivesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userState.user);
  const [state, setState] = useState({
    district: {
      id: new URLSearchParams(location.search).get('id') || -1,
      squares: new URLSearchParams(location.search).get('district_name') || ''
    },
    date: new Date(new URLSearchParams(location.search).get('date')),
  })
  const [data, setData] = useState({
    aab: -1,
    nab: -1,
    oab: -1,
    bonusPerPlanActiveAbonent: 150,
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
  const [nonActives, setNonActives] = useState([]);
  const locations = useAppSelector(state => state.userState.locations);
  const [nonActivesLoading, setNonActivesLoading] = useState(false);

  const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate() - 1, 2);

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    void fetchNonActives();
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
      !/iPad|Android|tablet|touch/i.test(navigator.userAgent)
    ) {
      navigate('/bonuses');
    }
  }, []);

  const fetchNonActives = async () => {
    try {
      setNonActivesLoading(true);
      const formData = new FormData();

      formData.append('date_filter', formatDate(new Date('Mon May 15 2024 10:24:59 GMT+0600 (Kyrgyzstan Time)')));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post(
        'noactive_squares/', formData);
      const req2 = await axiosApi.post(
        'filtered_squares/', formData);
      const res = await req.data;
      const res2 = await req2.data;
      setNonActives(res.data);
      setNonActivesLoading(false);
      setData(prevState => ({
        ...prevState,
        aab: res2.count?.['Актив'] || -1,
        nab: res2.count?.['Неактив'] || -1,
        oab: (res2.count?.['Неактив'] || -1) + (res.count?.['Актив'] || -1),
        locations: res2.locations,
        user_list: res2.user_list,
      }));
    }
    catch (e) {
      console.log(e);
    }
  }

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

    XLSX.writeFile(workbook, `${state.district.squares} - ${formatDate(new Date('Mon May 15 2024 10:24:59 GMT+0600 (Kyrgyzstan Time)'))}.xlsx`);
  };

  return (
    <div
      className="bonuses-paper non-actives-list"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {nonActivesLoading ? <span className="non-actives-list-loader" style={{marginTop: '20px'}}/> :
        nonActives.length ?
          <>
            <div style={{padding: '5px', display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <div
                className="close-actives-modal"
                onClick={(e) => {
                  e.stopPropagation();
                  window.history.back();
                }}
              >
              </div>
              {
                user === 'meerim' &&
                <div className="export-to-excel" onClick={handleExcelFileExport}>
                  <img src={excelLogo} alt="excel logo" width="30px" height="30px"/>
                  <span style={{color: 'black', fontWeight: '700'}}>экспорт</span>
                </div>
              }
            </div>
            <div className="non-actives-list-inner">
              {
                nonActivesLoading ? <span className="non-actives-list-loader"/> :
                  nonActives.length && nonActives.map((nonActive, i) => (
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
                        dispatch(setNonActive({
                          ...nonActive,
                          squares_id: locations.filter(location => `${location.id}` === state.district.id)[0]?.squares,
                          user_listt: data.user_list,
                        }));
                        navigate(`/bonuses/non-active`);
                      }}
                    >
                      <div className="non-actives-list-item-ls-abon" style={{width: '70px'}}>
                        <span style={{fontWeight: '700'}}>Лицевой счёт:</span>
                        <span>{nonActive.ls_abon}</span>
                      </div>
                      <div className="non-actives-list-item-address" style={{flexGrow: 1}}>
                        <span style={{fontWeight: '700'}}>Адрес:</span>
                        <span>{nonActive.address}</span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </> : <h3 className="bonuses-paper">Нет данных</h3>
      }
    </div>
  );
};

export default NonActivesList;