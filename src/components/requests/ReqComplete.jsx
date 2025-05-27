import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ReqComplete = () => {
    const [requests, setRequests] = useState([]);
    const [empId, setEmpId] = useState("");

    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user"));
        const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData"));
        const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        setEmpId(hrEmployees[0].emp_id);
    }, []);

    useEffect(() => {
        if (!empId) return;

        const fetchVacationData = async () => {
            try {
                const response = await axios.post('request/list/getlist', { ids: empId });
                setRequests(response.data.data);
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
            }
        };

        fetchVacationData();
    }, [empId]);

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
