import React, { useState, useEffect } from "react";
import axios from "axios";

const ReqShiftChange = () => {
  const [empId, setEmpId] = useState("");
  const [origindate, setOrigindate] = useState("");
  const [origintime, setOrigintime] = useState("");
  const [changedate, setChangedate] = useState("");
  const [changetime, setChangetime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    try {
      const aa = JSON.parse(sessionStorage.getItem("user"));
      const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData"));
      const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
      if (hrEmployees.length > 0) setEmpId(hrEmployees[0].emp_id);
    } catch (e) {
      console.warn("세션 불러오기 실패:", e);
    }
  }, []);

  const handleSubmit = async () => {
    if (!origindate || !origintime || !changedate || !changetime || !reason) {
      alert("모든 항목을 입력하세요");
      return;
    }

    try {
      await axios.post("/request/shifts", {
        req_idx: null,
        req_type: "근무변경",
        req_content: reason?.trim() ? reason : "사유 입력",
        emp_id: empId,
        origin_date: origindate,
        origin_time: origintime,
        change_date: changedate,
        change_time: changetime,
      });

      alert("✅ 근무 변경 신청 완료!");
      setOrigindate("");
      setOrigintime("");
      setChangedate("");
      setChangetime("");
      setReason("");
    } catch (err) {
      console.error("❌ 요청 실패:", err);
      alert("근무 변경 요청 실패");
    }
  };

  return (
    <div style={styles.container}>
      <h3>근무 변경 요청</h3>
      <div style={styles.group}>
        <label>기존 근무 날짜</label>
        <input type="date" value={origindate} onChange={e => setOrigindate(e.target.value)} style={styles.input} />

        <label>기존 시간</label>
        <select value={origintime} onChange={e => setOrigintime(e.target.value)} style={styles.input}>
          <option value="">선택</option>
          <option>오픈</option>
          <option>미들</option>
          <option>마감</option>
        </select>

        <label>변경할 날짜</label>
        <input type="date" value={changedate} onChange={e => setChangedate(e.target.value)} style={styles.input} />

        <label>변경할 시간</label>
        <select value={changetime} onChange={e => setChangetime(e.target.value)} style={styles.input}>
          <option value="">선택</option>
          <option>오픈</option>
          <option>미들</option>
          <option>마감</option>
        </select>

        <label>사유</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} style={styles.input} />

        <button onClick={handleSubmit} style={styles.button}>신청하기</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff"
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    marginTop: "10px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer"
  }
};

export default ReqShiftChange;
