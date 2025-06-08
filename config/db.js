// db.js 또는 conn.js
//  MySQL 연결 풀 설정 파일

const mysql = require("mysql2/promise");  // async/await 지원을 위해 promise 버전 사용
//  DB 연결 풀 생성
const db = mysql.createPool({
  host: "127.0.0.1",          // 로컬 MySQL
  port: 3306,                 // 기본 포트
  user: "root",               // 사용자명 (설정한 계정으로 변경 가능)
  password: "12345", // 비밀번호 입력
  database: "cafe_schedule", // 사용할 DB 이름
  waitForConnections: true,  // 커넥션 대기 허용
  connectionLimit: 10,       // 최대 10개의 연결 유지
  queueLimit: 0              // 대기열 제한 없음
});

//  연결 테스트용 코드
(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ DB 연결 성공");
  } catch (err) {
    console.error("❌ DB 연결 실패:", err.message);
  }
})();

module.exports = db;
