import React, {useEffect, useRef} from 'react';
import './autocomplete.css';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setPopupId} from "../../features/usersSlice";

const Autocomplete = ({value, changeHandler, options, i, onClick}) => {
  const inputRef = useRef();
  const dispatch = useAppDispatch();
  const popupId = useAppSelector((state) => state.userState.popupId);
  const dists = options.filter(district => district.toLowerCase().includes(value.toLowerCase()))
    .map((district, i) => (
      <span
        className="autocomplete-option"
        onClick={() => {
          changeHandler({target: {name: 'district', value: district}});
          dispatch(setPopupId(''));
        }}
        key={i}
      >{district}</span>
    ));

  const onCheckboxClick = () => {
    onClick();
    dispatch(setPopupId(`autocomplete${i || ''}`));
    inputRef.current.focus();
  };

  useEffect(() => {
    document.body.addEventListener('click', () => {
      dispatch(setPopupId(''));
    });
  }, [dispatch, popupId]);

  return (
    <div className="autocomplete">
      <div className="autocomplete-input-box" onClick={e => e.stopPropagation()}>
        <input
          type="text" className="autocomplete-input" value={value}
          onChange={e => changeHandler({target: {name: "district", value: e.target.value}})}
          name="district"
          autoComplete='off'
          ref={inputRef}
          placeholder="Выберите квадрат"
        />
        <span
          className="autocomplete-toggler"
          onClick={onCheckboxClick}
        />
        <span className="autocomplete-icon"/>
        <div className={`autocomplete-panel${popupId === `autocomplete${i || ''}` ? '-open' : ''}`}>
          {
            dists.length ? dists : <span className="autocomplete-option-not-found">Не найдено</span>
          }
        </div>
      </div>
    </div>
  );
};

export default Autocomplete;