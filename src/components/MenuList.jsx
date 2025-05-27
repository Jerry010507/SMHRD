import React from 'react';

const MenuList = ({ menuItems, onItemSelect }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={item.label === '관리하기' || item.label === '스케줄 생성' ? "funcButton_auth" : "funcButton"}
          onClick={() => onItemSelect(item)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default MenuList;
