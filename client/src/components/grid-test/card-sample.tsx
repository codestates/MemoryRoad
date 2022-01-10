import React from 'react';

function CardSample({ name }: any) {
  // console.log(name);
  return (
    <div className="pinControllTower-pinCard" draggable="true" id={name}>
      This div is draggable
    </div>
  );
}

export default CardSample;
