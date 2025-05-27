import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Chatting from './Chatting';
import Attendance from './attendance/Attendance';
import Management from './management/Management';
import Schedule2 from './Schedule2';
import RequestForm from './requests/RequestForm';
import MenuList from './MenuList';
import logoImage from '../assets/logo_cafe.png'; // ✅ 새 로고 이미지
import '../App.css';

const Main = () => {
  const [textValue, setTextValue] = useState(<Calendar />);
  const [account, setAccount] = useState({
    id: "temp",
    name: "Unknown",
    role: "Unknown"
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setAccount(userData);
    } else {
      const kk = {
        id: "tester",
        name: '김예은',
        role: '관리자'
      };
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
        if (account.role === "관리자") setTextValue(<Schedule2 />);
        break;
      case '관리하기':
        if (account.role === "관리자") setTextValue(<Management />);
        break;
      default:
        setTextValue(<Calendar />);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      overflowX: "hidden"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1280px",
        backgroundColor: "#fff",
        padding: "20px",
        boxSizing: "border-box"
      }}>
        <div id='profile' style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* ✅ 텍스트 대신 로고만 출력 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoImage}
              alt="logo"
              style={{
                width: "160px", // ✅ 메인 상단용으로 크게 출력
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
          <div id="account">
            <h3 id='welcome' style={{ fontSize: "16px", marginBottom: "4px" }}>
              환영합니다. {account.name}님!({account.role})
            </h3>
            <a href="/" style={{ fontSize: "14px", color: "#007bff" }}>메인화면으로</a>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <MenuList
          menuItems={[
            { label: '메인' },
            { label: '채팅' },
            { label: '근태' },
            { label: '요청하기' },
            ...(account.role === "관리자" ? [
              { label: '스케줄 생성' },
              { label: '관리하기' }
            ] : [])
          ]}
          onItemSelect={handleMenuSelect}
        />

        <div id='changableView' style={{ marginTop: "30px" }}>
          {textValue}
        </div>
      </div>
    </div>
  );
};

export default Main;
