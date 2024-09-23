import React, { useEffect, useRef } from 'react';
import './autocomplete.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPopupId } from '../../features/usersSlice';

const Autocomplete = ({
  name,
  value,
  changeHandler,
  options,
  i,
  onClick,
  type,
  label,
}) => {
  const inputRef = useRef();
  const dispatch = useAppDispatch();
  const popupId = useAppSelector((state) => state.userState.popupId);
  const dists = options
    .filter((option) =>
      option?.trim().toLowerCase().includes(value?.trim().toLowerCase())
    )
    .map((option, i) => (
      <span
        className="autocomplete-option"
        onClick={() => {
          changeHandler({ target: { name: name, value: option } });
          dispatch(setPopupId(''));
        }}
        key={i}
      >
        {option}
      </span>
    ));

  const onCheckboxClick = () => {
    if (onClick) onClick();
    dispatch(setPopupId(`autocomplete${i || ''}`));
    if (type === 'select') return;
    inputRef.current.focus();
  };

  useEffect(() => {
    document.body.addEventListener('click', () => {
      dispatch(setPopupId(''));
    });
  }, [dispatch, popupId]);

  return (
    <div className="autocomplete">
      <div
        className="autocomplete-input-box"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          className="autocomplete-input"
          value={value}
          onChange={(e) =>
            changeHandler({ target: { name: name, value: e.target.value } })
          }
          name="district"
          autoComplete="off"
          ref={inputRef}
          placeholder={label}
        />
        <div
          className={`autocomplete-panel${popupId === `autocomplete${i || ''}` ? '-open' : ''}`}
        >
          {dists.length ? (
            dists
          ) : (
            <span className="autocomplete-option-not-found">Не найдено</span>
          )}
        </div>
        <span className="autocomplete-toggler" onClick={onCheckboxClick} />
        <span className="autocomplete-icon" />
      </div>
    </div>
  );
};

export default Autocomplete;
