import React from 'react';
import './reportList.css';

const ReportList = ({list, loading}) => {
  console.log(list);
  return (
    <div className="report-list">
      <div className="bonuses-paper">
        <h3 style={{padding: '0 0 20px', margin: '0'}}>Отчёт по квадратам</h3>
        <div className="report-list-items">
          {
            loading ? <span className="non-actives-list-loader" style={{display: 'inline-block'}}/> :
              list.map(item => (
                <div className="report-list-item">
                  <h3>{item.squares.squares || '-'}</h3>
                  <div>
                    <strong>ААБ: </strong>
                    <span>{item.aab}</span>
                  </div>
                  <div>
                    <strong>НАБ: </strong>
                    <span>{item.nab}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default ReportList;