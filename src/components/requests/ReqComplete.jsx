import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ReqComplete = () => {
  const [requests, setRequests] = useState([]);
  const [empId, setEmpId] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const employeeData = JSON.parse(sessionStorage.getItem("employeeData"));

      if (!user || !employeeData) return;

      const match = employeeData.find(emp => emp.emp_name === user.name);
      if (match) {
        setEmpId(match.emp_id);
      }
    } catch (err) {
      console.error("세션 데이터 파싱 오류:", err);
    }
  }, []);

  useEffect(() => {
    if (!empId) return;

    const fetchData = async () => {
      try {
        const res = await axios.post("/request/list/getlist", { ids: empId });
        setRequests(res.data.data);
      } catch (err) {
        console.error("요청 내역 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [empId]);

  return (
    <div style={styles.container}>
      {requests.length > 0 ? (
        requests.map((req, i) => (
          <div key={i} style={styles.card}>
            <strong>{req.req_type === "근무변경" ? "🔄 근무 변경" : "⏸ 휴가/병가"}</strong>
            <div style={styles.detail}>
              {req.req_type === "근무변경" ? (
                <>
                  <p>기존: {dayjs(req.origin_date).format("YYYY-MM-DD")} {req.origin_time}</p>
                  <p>변경: {dayjs(req.change_date).format("YYYY-MM-DD")} {req.change_time}</p>
                </>
              ) : (
                <p>기간: {dayjs(req.start_date).format("YYYY-MM-DD")} ~ {dayjs(req.end_date).format("YYYY-MM-DD")}</p>
              )}
              <p>사유: {req.req_content}</p>
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
  detail: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
  },
  noData: {
    textAlign: "center",
    color: "#888",
    marginTop: "20px",
  },
};

export default ReqComplete;
