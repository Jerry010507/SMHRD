import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Schedule2 from './Schedule2';
import RequestForm from './requests/RequestForm';
import Management from './management/Management';
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

  // ✅ 버튼 클릭 시 페이지 변경 함수
  const handleClick = (label) => {
    switch (label) {
      case '메인':
        setTextValue(<Calendar />);
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
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'transparent',
        padding: '0px',
        border: 'none',
        position: 'relative'
      }}>
        {/* ✅ 로고 + 환영문구 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <img src={logoImage} alt='logo' style={{ width: '100px', height: 'auto' }} />
          <div style={{ fontSize: '13px', textAlign: 'right' }}>
            환영합니다. {account.name}님!({account.role})
          </div>
        </div>

        {/* ✅ 2줄 2개 버튼 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button className="btn brown" onClick={() => handleClick('메인')}>메인</button>
          <button className="btn brown" onClick={() => handleClick('요청하기')}>요청하기</button>
          {account.role === '관리자' && (
            <>
              <button className="btn green" onClick={() => handleClick('스케줄 생성')}>스케줄 생성</button>
              <button className="btn green" onClick={() => handleClick('관리하기')}>관리하기</button>
            </>
          )}
        </div>

        {/* ✅ 동적으로 변경되는 콘텐츠 */}
        <div id='changableView' style={{ marginTop: '20px' }}>
          {textValue}
        </div>
      </div>

      {/* ✅ 하단 메인화면 링크 */}
      <div style={{ marginTop: '30px', fontSize: '13px' }}>
        <a href='/' style={{ color: '#007bff', textDecoration: 'none' }}>메인화면으로</a>
      </div>
    </div>
  );
};

export default Main;
