import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const roles = ["오픈", "미들", "마감"];

const Schedule2 = () => {
  const [schedule, setSchedule] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setEmployees([
      { emp_name: "홍길동", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "김철수", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "이영희", emp_role: "교육생", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "박민수", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "최유리", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "조성민", emp_role: "교육생", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "이수정", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "강다연", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "윤지훈", emp_role: "교육생", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "정예린", emp_role: "바리스타", weekly_hours: 25, daily_hours: 5, work_days: ["월", "화", "수", "목", "금"], off_days: ["토", "일"] },
      { emp_name: "이부장", emp_role: "부점장", weekly_hours: 40, daily_hours: 8, work_days: weekdays, off_days: [] },
      { emp_name: "정점장", emp_role: "점장", weekly_hours: 40, daily_hours: 8, work_days: weekdays, off_days: [] },
      { emp_name: "박매니저", emp_role: "슈퍼바이저", weekly_hours: 35, daily_hours: 7, work_days: weekdays, off_days: [] },
      { emp_name: "안부점장", emp_role: "부점장", weekly_hours: 40, daily_hours: 8, work_days: weekdays, off_days: [] },
      { emp_name: "최슈퍼", emp_role: "슈퍼바이저", weekly_hours: 35, daily_hours: 7, work_days: weekdays, off_days: [] },
    ]);
  }, []);

  const generateSchedule = () => {
    const newSchedule = [];
    const workHours = {};
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const current = new Date(year, month, day);
      const dayName = weekdays[current.getDay()];
      const dateStr = current.toLocaleDateString("ko-KR");
      const assignedNames = new Set();

      roles.forEach((roleName) => {
        const candidates = employees.filter(emp => {
          return (
            emp.work_days.includes(dayName) &&
            !emp.off_days.includes(dayName) &&
            !assignedNames.has(emp.emp_name) &&
            (workHours[emp.emp_name] || 0) + emp.daily_hours <= emp.weekly_hours
          );
        });

        candidates.sort((a, b) => (workHours[a.emp_name] || 0) - (workHours[b.emp_name] || 0));

        if (candidates.length > 0) {
          const selected = candidates[0];
          assignedNames.add(selected.emp_name);
          workHours[selected.emp_name] = (workHours[selected.emp_name] || 0) + selected.daily_hours;

          newSchedule.push({
            date: dateStr,
            day: dayName,
            work_name: roleName,
            employees: [{ name: selected.emp_name, role: selected.emp_role }],
          });
        } else {
          newSchedule.push({
            date: dateStr,
            day: dayName,
            work_name: roleName,
            employees: [{ name: "없음", role: "-" }],
          });
        }
      });
    }

    setSchedule(newSchedule);
  };

  return (
    <div>
      <h2>🟢 스타벅스식 순환 스케줄</h2>
       <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={generateSchedule}>스케줄 생성</button>
        <button onClick={() => navigate("/manualschedule")}>스케줄 수동 수정</button>
      </div>
      
      {schedule.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>날짜</th>
              <th>요일</th>
              <th>근무 유형</th>
              <th>직원</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, i) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.day}</td>
                <td>{item.work_name}</td>
                <td>
                  {item.employees.map((e, j) => (
                    <span key={j}>
                      {e.name} ({e.role})
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Schedule2;
