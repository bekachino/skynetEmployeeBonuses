import React, {useEffect, useState} from 'react';
import './toolbar.css';

const Toolbar = ({open, onClick, children}) => {
  const [toolbarInnerHeight, setToolbarInnerHeight] = useState(`0px`);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setToolbarInnerHeight(`${window.innerHeight}px`);
      } else {
        setToolbarInnerHeight('auto');
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="toolbar">
      <div className={`toolbar-inner ${open ? 'toolbar-inner-open' : ''}`} style={{height: toolbarInnerHeight}}>
        {children}
      </div>
      <div
        className="toolbar-inner-toggler"
        onClick={onClick}
      >
        <span/><span/><span/>
      </div>
    </div>
  );
};

export default Toolbar;