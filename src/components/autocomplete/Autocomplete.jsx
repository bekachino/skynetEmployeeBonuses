import React, {useEffect, useRef, useState} from 'react';
import './autocomplete.css';

const Autocomplete = ({value, changeHandler, options}) => {
  const inputRef = useRef();
  const [panelOpen, setPanelOpen] = useState(false);
  const dists = options.filter(district => district.toLowerCase().includes(value.toLowerCase()))
    .map((district, i) => (
      <span
        className="autocomplete-option"
        onClick={() => {
          changeHandler({target: {name: 'district', value: district}});
          setPanelOpen(false);
        }}
        key={i}
      >{district}</span>
    ));

  const onCheckboxClick = (value) => {
    setPanelOpen(value);
    value && inputRef.current.focus();
  };

  useEffect(() => {
    document.body.addEventListener('click', () => setPanelOpen(false));
  }, []);

  return (
    <div className="autocomplete">
      <div className="autocomplete-input-box" onClick={e => e.stopPropagation()}>
        <input
          type="text" className="autocomplete-input" value={value}
          onChange={changeHandler}
          name="district"
          autoComplete='off'
          ref={inputRef}
          placeholder="Выберите квадрат"
        />
        <input
          className="autocomplete-toggler" type="checkbox" checked={panelOpen}
          onChange={() => onCheckboxClick(true)}
        />
        <span className="autocomplete-icon"/>
        <div className="autocomplete-panel">
          {
            dists.length ? dists : <span className="autocomplete-option-not-found">Не найдено</span>
          }
        </div>
      </div>
    </div>
  );
};

export default Autocomplete;