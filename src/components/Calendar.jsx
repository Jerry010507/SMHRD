import React, { useState, useEffect } from "react";
import styles from "../Calendar.module.css";
import Schedule from "./Schedule";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState("");
    const [vacations, setVacations] = useState({});

    // ✅ 휴가 데이터 불러오기
    const fetchVacations = async () => {
        try {
            const response = await fetch("http://localhost:5067/management/getVacation");
            if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
            const { data } = await response.json();
            const grouped = {};

            data.forEach(v => {
                const date = v.start_date.split("T")[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push({ emp_id: v.emp_id, content: v.req_content });
            });

            setVacations(grouped);
        } catch (error) {
            console.error("❌ 휴가 불러오기 실패:", error);
        }
    };

    // ✅ 스케줄 데이터 불러오기
    const fetchSchedules = async () => {
        try {
            const response = await fetch("http://localhost:5067/autoschedule/getSchedules");
            if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
            const data = await response.json();
            const grouped = {};

            data.forEach(s => {
                const dateObj = new Date(s.date);
                dateObj.setHours(dateObj.getHours() + 9); // UTC → KST
                const date = dateObj.toISOString().split("T")[0];
                const { work_name, employee_name } = s;

                if (!grouped[date]) grouped[date] = {};
                if (!grouped[date][work_name]) grouped[date][work_name] = [];
                grouped[date][work_name].push(employee_name);
            });

            setSchedules(grouped);
        } catch (error) {
            console.error("❌ 스케줄 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchVacations();
    }, []);

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.inactive}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const schedule = schedules[dateStr];
            const vacationList = vacations[dateStr] || [];

            const isOnVacation = (name) =>
                vacationList.some((v) => v.emp_id.trim() === name.trim());

            days.push(
                <div
                    key={day}
                    className={styles.active}
                    onClick={() => {
                        setSelectedDate(dateStr);
                        setIsModalOpen(true);
                    }}
                >
                    <span className={styles.dayNumber}>{day}</span>
                    {schedule ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <p className={styles.open}>🟢 오픈: {schedule.오픈?.map(n => `${n}${isOnVacation(n) ? " 🏖" : ""}`).join(", ") || "없음"}</p>
                            <p className={styles.middle}>🟡 미들: {schedule.미들?.map(n => `${n}${isOnVacation(n) ? " 🏖" : ""}`).join(", ") || "없음"}</p>
                            <p className={styles.close}>🔴 마감: {schedule.마감?.map(n => `${n}${isOnVacation(n) ? " 🏖" : ""}`).join(", ") || "없음"}</p>
                            {vacationList.length > 0 && (
                                <p className={styles.vacationNotice}>휴가자: {vacationList.map(v => v.emp_id).join(", ")}</p>
                            )}
                        </div>
                    ) : (
                        <p className={styles.scheduleBox}></p>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className={styles.calendar}>
            {/* ✅ 월 변경 */}
            <div className={styles.header}>
                <button onClick={() => changeMonth(-1)}>◀</button>
                <h2>
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h2>
                <button onClick={() => changeMonth(1)}>▶</button>
            </div>

            {/* ✅ 요일 라벨 */}
            <div className={styles.weekdays}>
                {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                    <div key={i} className={styles.weekday}>{day}</div>
                ))}
            </div>

            {/* ✅ 날짜 렌더링 */}
            <div className={styles.days}>{renderDays()}</div>

            {/* ✅ 일정 모달 */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedDate}</h3>
                        <div className={styles.eventList}>
                            {schedules[selectedDate] ? (
                                <>
                                    <p>🟢 오픈: {schedules[selectedDate].오픈?.join(", ") || "없음"}</p>
                                    <p>🟡 미들: {schedules[selectedDate].미들?.join(", ") || "없음"}</p>
                                    <p>🔴 마감: {schedules[selectedDate].마감?.join(", ") || "없음"}</p>
                                </>
                            ) : (
                                <p>📌 일정 없음</p>
                            )}
                        </div>
                        {vacations[selectedDate] && (
                            <div className={styles.vacationList}>
                                <h4>휴가 일정</h4>
                                <ul>
                                    {vacations[selectedDate].map((v, idx) => (
                                        <li key={idx}>{v.emp_id}: {v.content}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
