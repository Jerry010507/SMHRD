import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from '../MainPage.module.css'; // CSS 모듈 import
import cafeLogo from '../assets/logo_cafe.png'; // ✅ 로고 이미지 import

const MainPage = () => {
    // 로그인 상태 변수
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달창 표시 여부
    const navigate = useNavigate(); // 페이지 이동 함수

    // ✅ 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        try {
            // 로그인 API 요청
            const response = await api.post('user/login', { id, pw });
            if (response.data.success) {
                // 로그인 성공 시 사용자 정보 저장
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                // 시스템 메인으로 이동
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    // ✅ 개발자용 빠른 접속 함수
    const editerLogin = async () => {
        try {
            const id = 'kimyeeun';
            const pw = '12345';
            const response = await api.post('user/login', { id, pw });
            if (response.data.success) {
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            navigate('/system'); // 실패해도 바로 이동
        }
    };

    return (
        <div className={styles.pageContainer} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div style={{ textAlign: 'center', minWidth: '360px' }}>
                {/* ✅ 기존 SAVANNAH 텍스트 대신 이미지 로고 사용 */}
                <div style={{ marginBottom: '20px' }}>
                    <img src={cafeLogo} alt="로고" style={{ width: '350px', height: 'auto' }} />
                </div>

                {/* ✅ 로그인 폼 */}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="id"
                        placeholder="아이디를 입력하세요."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="pw"
                        placeholder="비밀번호를 입력하세요."
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                    />
                    <br />
                    <button
                        className={styles.btnLogin}
                        type="submit"
                        style={{ backgroundColor: '#86593d', color: '#fff' }} // ✅ 로그인 버튼만 색상 유지
                    >
                        로그인
                    </button>
                </form>

                {/* ✅ 서브 버튼들 */}
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                    <button
                        className={styles.RUFirst}
                        style={{ width: "180px", padding: "10px 20px" }} // ✅ 기존 색상
                        onClick={() => setShowModal(true)}
                    >
                        처음이신가요?
                    </button>
                    <button
                        className={styles.RUFirst}
                        style={{ width: "180px", padding: "10px 20px" }} // ✅ 기존 색상
                        onClick={editerLogin}
                    >
                        접속skip(개발자용)
                    </button>
                </div>

                {/* ✅ 회원가입 모달창 */}
                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className={styles.close} onClick={() => setShowModal(false)}>&times;</span>
                            <h2>가입하기</h2>
                            <form action="user/join" method="post">
                                <input type="text" name="act_id" placeholder="아이디를 입력하세요." />
                                <input type="password" name="act_pw" placeholder="비밀번호를 입력하세요." />
                                <input type="text" name="act_name" placeholder="이름을 입력하세요." />
                                <input type="text" name="act_mail" placeholder="이메일을 입력하세요." />
                                <button type="submit">회원가입</button>
                                <button type="button" onClick={() => setShowModal(false)}>나가기</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
