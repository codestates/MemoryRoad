import React from 'react';
import './mm.css';

// 이건 또 왜 렌더링 안되냐
function Comp({ name, key }: any) {
  return (
    <div className="box-ppp" id={name} key={key}>
      OMG
    </div>
  );
}

export default Comp;
