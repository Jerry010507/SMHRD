import { React, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../modals/VacationModal';

const ManVacation = () => {
    const [vacationData, setVacationData] = useState([]);
    const [empId, setEmpId] = useState("");
    const [selectedWorks, setSelectedVacations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ code: null, result: null, select: null });

    useEffect(() => {
        const storedVacations = sessionStorage.getItem('vacationData');
        try {
            const parsedData = JSON.parse(storedVacations);
            setVacationData(parsedData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setEmpId(user.id);
    }, []);

    useEffect(() => {
        if (modalData.code !== null) {
            setIsModalOpen(true);
        }
    }, [modalData]);

    const handleCheckboxChange = (code) => {
        setSelectedVacations((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code)
                : [...prev, code]
        );
    };

    const btnReviewVacation = (code, decision, select) => {
        setModalData({ code, decision, select });
    };

    const handleVacation = async (code, decision, confirm) => {
        if (!confirm) return;
        try {
            const response = await axios.post("/management/checkVacation", {
                ids: code,
                what: decision,
                who: empId
            });

            if (response.status === 200) {
                const updated = response.data.data[0];
                const savedVacData = JSON.parse(sessionStorage.getItem("vacationData"));
                const index = savedVacData.findIndex(item => item.req_idx === updated.req_idx);
                if (index !== -1) {
                    savedVacData[index] = updated;
                }
                sessionStorage.setItem('vacationData', JSON.stringify(savedVacData));
                setVacationData(savedVacData);
                setIsModalOpen(false);
            } else {
                alert("휴가 처리 요청이 실패했습니다.");
            }
        } catch (error) {
            alert("휴가를 처리하는 데 실패했습니다.");
        }
    };

    return (
        <div style={{ width: "900px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "10px" }}>휴가관리</h2>
            <span>총 휴가요청 수: {vacationData.length}</span>
            <hr />
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {vacationData.map((vac) => (
                    <div key={vac.req_idx} style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        padding: "15px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        backgroundColor: "#f9f9f9"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <input
                                type="checkbox"
                                checked={selectedWorks.includes(vac.req_idx)}
                                onChange={() => handleCheckboxChange(vac.req_idx)}
                            />
                            <strong>{vac.req_type} 요청</strong>
                            <span>{vac.emp_id}</span>
                        </div>
                        <div>사유: {vac.req_content}</div>
                        <div>기간: {new Date(vac.start_date).toLocaleDateString("en-CA")} ~ {new Date(vac.end_date).toLocaleDateString("en-CA")}</div>
                        <div>처리여부: {vac.req_status}</div>
                        <div>처리자: {vac.admin_id || "-"}</div>
                        <div>처리날짜: {vac.approved_at ? new Date(vac.approved_at).toLocaleDateString("en-CA") : "-"}</div>
                        {vac.req_status === "N" ? (
                            <div style={{ marginTop: "10px" }}>
                                <button onClick={() => btnReviewVacation(vac.req_idx, "승인", true)} style={{ marginRight: "10px" }}>승인</button>
                                <button onClick={() => btnReviewVacation(vac.req_idx, "반려", false)}>반려</button>
                            </div>
                        ) : (
                            <div style={{ marginTop: "10px" }}>처리결과: {vac.req_final}</div>
                        )}
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} code={modalData.code} decision={modalData.decision} onSubmit={handleVacation} />
        </div>
    );
};

export default ManVacation;