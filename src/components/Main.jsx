// ✅ Main.jsx (수정 완료)
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Chatting from './Chatting';
import Attendance from './attendance/Attendance';
import Management from './management/Management';
import Schedule2 from './Schedule2';
import RequestForm from './requests/RequestForm';
import MenuList from './MenuList';
import logoImage from '../assets/logo_cafe.png';
import '../App.css';

const Main = () => {
  const [textValue, setTextValue] = useState(<Calendar />);
  const [account, setAccount] = useState({ id: 'temp', name: 'Unknown', role: 'Unknown' });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setAccount(userData);
    } else {
      const kk = { id: 'tester', name: '김예은', role: '관리자' };
      sessionStorage.setItem('user', JSON.stringify(kk));
      setAccount(kk);
    }
  }, []);

  const handleMenuSelect = (item) => {
    switch (item.label) {
      case '메인':
        setTextValue(<Calendar />);
        break;
      case '채팅':
        setTextValue(<Chatting />);
        break;
      case '근태':
        setTextValue(<Attendance />);
        break;
      case '요청하기':
        setTextValue(<RequestForm />);
        break;
      case '스케줄 생성':
        if (account.role === '관리자') setTextValue(<Schedule2 />);
        break;
      case '관리하기':
        if (account.role === '관리자') setTextValue(<Management />);
        break;
      default:
        setTextValue(<Calendar />);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      overflowX: 'hidden',
      padding: '10px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
        padding: '10px',
        position: 'relative'
      }}>
        <div id='profile' style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <img src={logoImage} alt='logo' style={{ width: '100px', height: 'auto' }} />
          <div style={{ textAlign: 'right', fontSize: '13px' }}>
            <div>환영합니다. {account.name}님!({account.role})</div>
          </div>
        </div>

        {/* ✅ 메인화면으로 링크를 우측 하단에 배치 */}
        <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '12px' }}>
          <a href='/' style={{ color: '#007bff', textDecoration: 'none' }}>메인화면으로</a>
        </div>

        <hr style={{ margin: '10px 0' }} />

        <MenuList
          menuItems={[
            { label: '메인' },
            { label: '채팅' },
            { label: '근태' },
            { label: '요청하기' },
            ...(account.role === '관리자'
              ? [{ label: '스케줄 생성' }, { label: '관리하기' }]
              : [])
          ]}
          onItemSelect={handleMenuSelect}
        />

        <div id='changableView' style={{ marginTop: '20px' }}>
          {textValue}
        </div>
      </div>
    </div>
  );
};

export default Main;
