import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from '../MainPage.module.css';
import cafeLogo from '../assets/logo_cafe.png';

const MainPage = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // ✅ body 스크롤 제거 (한 번만 실행)
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // 스크롤 제거
        return () => {
            document.body.style.overflow = 'auto'; // 컴포넌트 벗어나면 원상복구
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('user/login', { id, pw });
            if (response.data.success) {
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

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
            navigate('/system');
        }
    };

    return (
        <div
            style={{
                position: 'fixed', // ✅ 위치 고정
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                overflow: 'hidden',
                padding: '20px',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <img
                        src={cafeLogo}
                        alt="로고"
                        style={{
                            width: '100%',
                            maxWidth: '350px',
                            height: 'auto',
                        }}
                    />
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="id"
                        placeholder="아이디를 입력하세요."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                    />
                    <input
                        type="password"
                        name="pw"
                        placeholder="비밀번호를 입력하세요."
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '20px', padding: '10px' }}
                    />
                    <button
                        className={styles.btnLogin}
                        type="submit"
                        style={{
                            backgroundColor: '#86593d',
                            color: '#fff',
                            width: '100%',
                            padding: '12px',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                        }}
                    >
                        로그인
                    </button>
                </form>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px',
                        marginTop: '20px',
                    }}
                >
                    <button
                        className={styles.RUFirst}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#eee',
                            borderRadius: '4px',
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        처음이신가요?
                    </button>
                    <button
                        className={styles.RUFirst}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#eee',
                            borderRadius: '4px',
                        }}
                        onClick={editerLogin}
                    >
                        접속skip(개발자용)
                    </button>
                </div>

                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className={styles.close} onClick={() => setShowModal(false)}>
                                &times;
                            </span>
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
