import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ReqComplete = () => {
    const [requests, setRequests] = useState([]);
    const [empId, setEmpId] = useState("");

    // ✅ 1. 사용자 세션에서 emp_id 추출
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const employeeData = JSON.parse(sessionStorage.getItem("employeeData"));
        console.log("🟡 user:", user);
        console.log("🟢 employeeData:", employeeData);
        if (user && employeeData) {
            const matched = employeeData.find(emp => emp.emp_name === user.name);
            console.log("🔵 matched:", matched);
            if (matched) {
                setEmpId(matched.emp_id);
            }
        }
    }, []);

    // ✅ 2. emp_id로 요청 내역 조회
    useEffect(() => {
        if (!empId) return;

        const fetchVacationData = async () => {
            try {
                const response = await axios.post('/request/list/getlist', { ids: empId });
                console.log("📦 요청 내역 응답:", response.data);
                setRequests(response.data.data);
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
            }
        };

        fetchVacationData();
    }, [empId]);

    // ✅ 3. 렌더링
    return (
        <div style={styles.container}>
            {requests.length > 0 ? (
                requests.map((req, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.title}>
                            {req.req_type === "근무변경" ? "🔄 근무 변경 요청" : "⏸ 휴가/병가 요청"}
                        </div>
                        <div style={styles.detail}>
                            {req.req_type === "근무변경" ? (
                                <>
                                    <p><strong>기존:</strong> {dayjs(req.origin_date).format("YYYY-MM-DD")} {req.origin_time}</p>
                                    <p><strong>변경:</strong> {dayjs(req.change_date).format("YYYY-MM-DD")} {req.change_time}</p>
                                </>
                            ) : (
                                <p><strong>기간:</strong> {dayjs(req.start_date).format("YYYY-MM-DD")} ~ {dayjs(req.end_date).format("YYYY-MM-DD")}</p>
                            )}
                            <p><strong>사유:</strong> {req.req_content}</p>
                            <p><strong>승인 상태:</strong> {req.req_status === "Y" ? "✅ 승인됨" : req.req_status === "R" ? "❌ 반려됨" : "⏳ 대기중"}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p style={styles.noData}>📭 요청 내역이 없습니다.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
    },
    card: {
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "#fafafa",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    title: {
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "10px",
    },
    detail: {
        fontSize: "14px",
        color: "#333",
        lineHeight: "1.6",
    },
    noData: {
        textAlign: "center",
        color: "#888",
        marginTop: "20px",
    }
};

export default ReqComplete;
