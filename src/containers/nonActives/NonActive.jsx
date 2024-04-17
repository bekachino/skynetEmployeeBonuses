import React, {useEffect} from 'react';
import './nonActive.css';
import Autocomplete from "../../components/autocomplete/Autocomplete";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setNonActive} from "../../features/usersSlice";
import Textarea from "../../components/textArea/Textarea";
import {useNavigate} from "react-router-dom";
import Button from "../../components/button/Button";

const NonActive = () => {
  const nonActive = useAppSelector((state) => state.userState.nonActive);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const {name, value} = e.target;
    dispatch(setNonActive({
      ...nonActive,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!nonActive) navigate('/bonuses/-');
  }, [navigate, nonActive]);

  const onSubmit = (e) => {
    e.preventDefault();
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
        <span>{nonActive?.balance || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Последний платёж:</span>
        <span>{nonActive?.last_pay || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Номер телефона:</span>
        <span>{nonActive?.phone_abon || '-'}</span>
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Статус НАБ:</span>
        <Autocomplete
          name="statusNab"
          value={nonActive?.statusNab || ''}
          changeHandler={changeHandler}
          options={['Оплатил', 'Оплатит в БВ', 'Нет дома', 'Переехал / улетел', 'Отказ', 'Демонтирован ранее', 'Демонтирован', 'Платная пауза', 'Не дозвонился']}
          i={nonActive?.ls_abon}
          label="Выберите статус"
          type="select"
          onClick={() => changeHandler({target: {name: 'statusNab', value: ''}})}
        />
      </div>
      <div className="non-active-item-row">
        <span className="non-active-item-row-title">Комментарий:</span>
        <Textarea
          value={nonActive?.comment || ''}
          label="Комментарий"
          name="comment"
          onChange={changeHandler}
          style={{width: '100%'}}
        />
      </div>
      <Button type="submit" onClick={onSubmit} style={{maxWidth: 'unset', margin: '20px 5px 15px'}} label="Сохранить"/>
    </form>
  );
};

export default NonActive;