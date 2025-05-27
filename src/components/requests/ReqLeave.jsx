import React, { useState, useEffect } from "react";
import axios from "axios";

const ReqLeave = () => {
    const [empId, setEmpId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [days, setDays] = useState(0);
    const [reason, setReason] = useState("");
    const [type, setType] = useState("휴가");
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user"));
        const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData"));
        const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        setEmpId(hrEmployees[0].emp_id);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
            setDays(diffDays > 0 ? diffDays : 0);
        } else {
            setDays(0);
        }
    }, [startDate, endDate]);

    const handleSubmit = async () => {
        if (!startDate || !endDate || !reason) {
            alert("모든 항목을 입력해 주세요!");
            return;
        }

        if (days <= 0) {
            alert("올바른 날짜 범위를 선택하세요!");
            return;
        }

        try {
            const response = await axios.post("/request/leave", {
                req_idx: null,
                req_type: type,
                req_content: reason,
                emp_id: empId,
                start_date: startDate,
                end_date: endDate,
            });

            alert(`휴가 신청 완료!`);
            setStartDate("");
            setEndDate("");
            setDays(0);
            setReason("");
            setType("휴가");
            setIsSubmitted(true);
        } catch (error) {
            console.error("❌ 요청 실패:", error);
            alert("휴가 신청 실패! 다시 시도해 주세요.");
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>휴가 / 병가 신청</h3>

            <div style={styles.formGroup}>
                <label>휴가 유형</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
                    <option value="휴가">휴가</option>
                    <option value="병가">병가</option>
                </select>

                <label>시작 날짜</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                />

                <label>종료 날짜</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                    min={startDate}
                />

                <label>신청일 수</label>
                <div style={styles.daysText}>{days} 일</div>

                <label>사유</label>
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={styles.input}
                />

                <button style={styles.button} onClick={handleSubmit}>
                    신청하기
                </button>
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
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    input: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    daysText: {
        padding: "8px",
        backgroundColor: "#f0f0f0",
        textAlign: "right",
        fontWeight: "bold"
    },
    button: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default ReqLeave;
