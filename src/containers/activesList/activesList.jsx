import React, { useEffect, useState } from 'react';
import excelLogo from '../../assets/excel.png';
import { useAppSelector } from '../../app/hooks';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosApi from '../../axiosApi';

const ActivesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);
  const [state] = useState({
    district: {
      id: new URLSearchParams(location.search).get('id') || -1,
      squares: new URLSearchParams(location.search).get('district_name') || '',
    },
    date: new Date(new URLSearchParams(location.search).get('date')),
  });
  const [actives, setActives] = useState([]);
  const [nonActivesLoading, setNonActivesLoading] = useState(false);

  const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate() - 1, 2);

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    void fetchNonActives();
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) &&
      !/iPad|Android|tablet|touch/i.test(navigator.userAgent)
    ) {
      navigate('/bonuses');
    }
  });

  const fetchNonActives = async () => {
    try {
      setNonActivesLoading(true);
      const formData = new FormData();

      formData.append('date_filter', formatDate(new Date()));
      formData.append('squares_id', state.district.id);

      const req = await axiosApi.post('active_squares/', formData);
      const res = await req.data;
      setActives(res.data);
      setNonActivesLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleExcelFileExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      actives.map((active) => {
        return {
          ls_abon: active.ls_abon,
          address: active.address,
          balance: active.balance,
          ip_address: active.ip_address,
        };
      })
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, state.district.squares);

    XLSX.writeFile(
      workbook,
      `${state.district.squares} - ${formatDate(new Date())}.xlsx`
    );
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
      {nonActivesLoading ? (
        <span
          className="non-actives-list-loader"
          style={{ marginTop: '20px' }}
        />
      ) : actives.length ? (
        <>
          <div
            style={{
              padding: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
            }}
          >
            <div
              className="close-actives-modal"
              onClick={(e) => {
                e.stopPropagation();
                window.history.back();
              }}
            ></div>
            {user === 'meerim' && (
              <div className="export-to-excel" onClick={handleExcelFileExport}>
                <img
                  src={excelLogo}
                  alt="excel logo"
                  width="30px"
                  height="30px"
                />
                <span style={{ color: 'black', fontWeight: '700' }}>
                  экспорт
                </span>
              </div>
            )}
          </div>
          <div className="non-actives-list-inner">
            {nonActivesLoading ? (
              <span className="non-actives-list-loader" />
            ) : (
              actives.length &&
              actives.map((nonActive, i) => (
                <div className="bonuses-paper non-actives-list-item" key={i}>
                  <div
                    className="non-actives-list-item-ls-abon"
                    style={{ width: '70px' }}
                  >
                    <span style={{ fontWeight: '700' }}>Лицевой счёт:</span>
                    <span>{nonActive.ls_abon}</span>
                  </div>
                  <div
                    className="non-actives-list-item-address"
                    style={{ flexGrow: 1 }}
                  >
                    <span style={{ fontWeight: '700' }}>Адрес:</span>
                    <span>{nonActive.address}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <h3 className="bonuses-paper">Нет данных</h3>
      )}
    </div>
  );
};

export default ActivesList;
