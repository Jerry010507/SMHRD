import React, { useState, useEffect } from "react";
import axios from "axios";

const ReqLeave = () => {
  const [empId, setEmpId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  const [reason, setReason] = useState("");
  const [type, setType] = useState("휴가");

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

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
      setDays(diff > 0 ? diff : 0);
    } else {
      setDays(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      alert("모든 항목을 입력하세요");
      return;
    }

    try {
      await axios.post("/request/leave", {
        req_idx: null,
        req_type: type,
        req_content: reason,
        emp_id: empId,
        start_date: startDate,
        end_date: endDate,
      });
      alert("✅ 신청 완료!");
      setStartDate("");
      setEndDate("");
      setReason("");
      setType("휴가");
    } catch (err) {
      console.error("❌ 요청 실패:", err);
      alert("신청 실패");
    }
  };

  return (
    <div style={styles.container}>
      <h3>휴가 / 병가 신청</h3>
      <div style={styles.group}>
        <label>휴가 유형</label>
        <select value={type} onChange={e => setType(e.target.value)} style={styles.input}>
          <option value="휴가">휴가</option>
          <option value="병가">병가</option>
        </select>

        <label>시작일</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.input} />

        <label>종료일</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} style={styles.input} />

        <label>신청일 수</label>
        <div>{days}일</div>

        <label>사유</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} style={styles.input} />

        <button style={styles.button} onClick={handleSubmit}>신청하기</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "400px",
    background: "#fff"
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

export default ReqLeave;
