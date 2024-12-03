import React, { useEffect, useState } from 'react';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setNonActive } from '../../features/usersSlice';
import Textarea from '../../components/textArea/Textarea';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import axiosApi from '../../axiosApi';
import waLogo from '../../assets/whatsapp.png';
import phoneLogo from '../../assets/phone.png';
import './nonActive.css';

const NonActive = () => {
  const nonActive = useAppSelector((state) => state.userState.nonActive);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNonActive({
        ...nonActive,
        [name]: value,
      })
    );
  };

  useEffect(() => {
    if (!nonActive) navigate('/bonuses');
  }, [navigate, nonActive]);

  useEffect(() => {
    document.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll(
        '.non-active-item-phone-toggler'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const formData = new FormData();

      //eslint-disable-next-line array-callback-return
      Object.keys(nonActive).map((key) => {
        if (key !== 'user_listt') {
          return formData.append(key, nonActive[key]);
        }
      });

      await axiosApi.post('noactive_planup/', formData);
      setFormLoading(false);
      window.history.back();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form className="non-active-item" onSubmit={onSubmit}>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Лицевой счёт:</span>
        <span>{nonActive?.ls_abon || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Адрес:</span>
        <span>{nonActive?.address || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Баланс:</span>
        <span>
          {nonActive?.balance || '-'}{' '}
          <span style={{ fontWeight: '600', textDecoration: 'underline' }}>
            c
          </span>
        </span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Последний платёж:</span>
        <span>{nonActive?.last_pay || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Номер телефона:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {nonActive?.phone_abon?.split(', ').map((phone, i) => (
            <div key={phone}>
              <span className="non-active-item-phone">
                {phone || '-'}
                <input
                  className="non-active-item-phone-toggler"
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="non-active-item-phone-modal">
                  <Link to={`https://wa.me/${phone}`}>
                    <img src={waLogo} alt="wa.me" width="40px" />
                  </Link>
                  <Link to={`tel:0${phone.slice(3, phone.length)}`}>
                    <img src={phoneLogo} alt="phone" width="40px" />
                  </Link>
                </div>
              </span>
              {i !== nonActive?.phone_abon.split(', ').length - 1 && (
                <span style={{ marginRight: '5px' }}>,</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Сервис инженер:</span>
        <Autocomplete
          name="user_list"
          value={nonActive?.user_list || ''}
          changeHandler={changeHandler}
          options={nonActive?.user_listt || []}
          i="user_list"
          label="Сервис инженер"
          type="select"
          onClick={() =>
            changeHandler({ target: { name: 'user_list', value: '' } })
          }
        />
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Статус НАБ:</span>
        <Autocomplete
          name="status"
          value={nonActive?.status || ''}
          changeHandler={changeHandler}
          options={[
            'Оплатил',
            'Оплатит в БВ',
            'Нет дома',
            'Переехал / улетел',
            'Отказ',
            'Демонтирован ранее',
            'Демонтирован',
            'Платная пауза',
            'Не дозвонился',
          ]}
          i="status"
          label="Выберите статус"
          type="select"
          onClick={() =>
            changeHandler({ target: { name: 'status', value: '' } })
          }
        />
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Комментарий:</span>
        <Textarea
          value={nonActive?.comment || ''}
          label="Комментарий"
          name="comment"
          onChange={changeHandler}
          style={{ width: '100%' }}
        />
      </div>
      <Button
        type="submit"
        onClick={onSubmit}
        style={{ maxWidth: 'unset', margin: '20px 5px 15px' }}
        label="Сохранить"
        loading={formLoading}
      />
    </form>
  );
};

export default NonActive;
