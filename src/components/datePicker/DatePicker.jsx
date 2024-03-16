import React, {useEffect, useState} from 'react';
import 'moment/locale/ru';
import moment from "moment";
import './datePicker.css';

moment.locale('ru');

const DatePicker = ({value, changeHandler}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [nextMonthDisabled, setNextMonthDisabled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const calendar = [];
  moment.updateLocale('ru', {week: {dow: 1}});

  const startDay = currentDate.clone().startOf('month').startOf('week');
  const endDay = currentDate.clone().endOf('month').endOf('week');
  const day = startDay.clone();

  while (!day.isAfter(endDay)) {
    calendar.push(day.clone());
    day.add(1, 'day');
  }

  const currentMonthName = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const handleMonthDecrement = () => {
    setCurrentDate(prev => prev.clone().subtract(1, 'month'));
  };

  const handleMonthIncrement = () => {
    if (nextMonthDisabled) return;
    setCurrentDate(prev => prev.clone().add(1, 'month'));
  };

  const onCheckboxClick = (value) => setPanelOpen(value);

  useEffect(() => {
    document.body.addEventListener('click', () => setPanelOpen(false));
    if (
      currentMonthName === moment().format('MMMM') &&
      currentYear === moment().format('YYYY')
    ) {
      setNextMonthDisabled(true);
    } else setNextMonthDisabled(false);
  }, [currentMonthName, currentYear]);

  return (
    <div className='date-picker'>
      <span className="date-picker-main-placeholder">Дата</span>
      <div className='date-picker-input' onClick={e => e.stopPropagation()}>
        {
          value ?
            <span className="date-picker-value">{moment(value).format('DD.MM.YYYY')}</span> :
            <span className="date-picker-placeholder">Выберите дату</span>
        }
        <input
          className="date-picker-toggler" type="checkbox" checked={panelOpen}
          onChange={e => onCheckboxClick(e.target.checked)}
        />
        <span className="date-picker-icon"/>
        <div className="date-picker-panel">
          <div className="date-picker-current-position">
            <span className="arrow-back" onClick={handleMonthDecrement}/>
            <span className="date-picker-current-month">{currentMonthName}</span>
            <span className="date-picker-current-year">{currentYear}</span>
            <span className="arrow-forward" onClick={handleMonthIncrement}/>
          </div>
          <div className="date-picker-week-names">
            <span>Пн</span>
            <span>Вт</span>
            <span>Ср</span>
            <span>Чт</span>
            <span>Пт</span>
            <span>Сб</span>
            <span>Вс</span>
          </div>
          <div className="day-picker-month-days">
            {
              calendar.map((day, index) => {
                const isWeekend = day.day() === 0 || day.day() === 6;
                return (
                  <div
                    className={`date-picker-month-day ${day.format('MMMM') !== currentMonthName ?
                      'date-picker-not-current-month' : ''} ${day.isSame(moment(), 'day') ?
                      'date-picker-current-day' : ''} ${day.isAfter(moment(), 'day') ?
                      'date-picker-day-in-future' : ''} ${isWeekend ? 'day-picker-day-weekend' : ''}`}
                    key={index}
                    onClick={() => {
                      if (moment().format('DD.MM.YYYY') === moment(day).format('DD.MM.YYYY')) return;
                      changeHandler({
                        target: {
                          name: 'date',
                          value: new Date(day)
                        }
                      });
                    }}
                  >
                    {day.format('D')}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;