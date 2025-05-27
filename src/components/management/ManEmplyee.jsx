import { React, useState, useEffect } from "react";
import AddWorkerModal from "../modals/AddWorkerModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import axios from 'axios';
import io from 'socket.io-client';

const ManEmplyee = () => {
  const [employeeData, setEmployeeData] = useState([{}]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDltModalOpen, setIsDltModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem('employeeData');
    if (storedEmployees) {
      setEmployeeData(JSON.parse(storedEmployees));
    }

    const newSocket = io("http://localhost:5067");
    setSocket(newSocket);

    newSocket.on('faceResult', (data) => {
      if (data.success) alert(`얼굴 인식 성공: ${data.wo_id}`);
      else alert(`얼굴 인식 실패: ${data.message}`);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleCheckboxChange = (code) => {
    setSelectedEmployees((prev) =>
      prev.includes(code)
        ? prev.filter((id) => id !== code)
        : [...prev, code]
    );
  };

  const handleAddEmployee = async (newEmployee) => {
    const temp_employeeId = `250306${String(employeeData.length + 1).padStart(3, '0')}`;
    const updatedEmployee = {
      emp_id: temp_employeeId,
      emp_name: newEmployee.name || `테스트맨${employeeData.length + 1}`,
      emp_role: newEmployee.position || "테스트",
      emp_firstDate: newEmployee.joinDate || "2025.03.06",
      emp_group: newEmployee.department || "테스트부서",
      emp_birthDate: newEmployee.dob || "2025.03.06",
      emp_phone: newEmployee.phone || "010-1234-5678",
      emp_email: newEmployee.email || "newworker@com",
      created_at: new Date().toISOString()
    };

    try {
      await axios.post("/management/addEmployees", updatedEmployee);
      const updatedList = [...employeeData, updatedEmployee];
      sessionStorage.setItem('employeeData', JSON.stringify(updatedList));
      setEmployeeData(updatedList);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add worker:", error);
      alert("직원을 추가하는 데 실패했습니다.");
    }
  };

  const handleDeleteWorker = async (confirm) => {
    if (!confirm) return;
    try {
      const response = await axios.post("/management/dltEmployees", { ids: selectedEmployees });
      if (response.status === 200) {
        const updated = employeeData.filter((worker) => !selectedEmployees.includes(worker.emp_id));
        sessionStorage.setItem('employeeData', JSON.stringify(updated));
        setEmployeeData(updated);
        setSelectedEmployees([]);
      } else {
        alert("직원 삭제 요청 실패.");
      }
    } catch (error) {
      console.error("직원 삭제 오류:", error);
      alert("직원 삭제 실패.");
    }
  };

  const btnAddEmployee = () => setIsAddModalOpen(true);
  const btnRemoveEmployee = () => {
    if (selectedEmployees.length === 0) return;
    setIsDltModalOpen(true);
  };
  const btnAddFace = () => {
    if (socket) {
      socket.emit('faceCheck');
      alert("직원 얼굴 인식이 시작됩니다. 잠시만 기다려 주세요.");
    } else {
      alert("서버 연결 오류");
    }
  };

  const renderRow = (worker) => (
    <div key={worker.emp_id} style={rowStyle}>
      <div className="row-col"><input type="checkbox" checked={selectedEmployees.includes(worker.emp_id)} onChange={() => handleCheckboxChange(worker.emp_id)} /></div>
      <div className="row-col">{worker.emp_id}</div>
      <div className="row-col">{worker.emp_name}</div>
      <div className="row-col">{worker.emp_role}</div>
      <div className="row-col">{new Date(worker.emp_firstDate).toLocaleDateString("ko-KR")}</div>
      <div className="row-col">{worker.emp_group}</div>
      <div className="row-col">{new Date(worker.emp_birthDate).toLocaleDateString("ko-KR")}</div>
      <div className="row-col">{worker.emp_phone}</div>
      <div className="row-col">{worker.emp_email}</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h2>직원관리</h2>

      <div style={buttonWrapStyle}>
        <span style={buttonStyle} onClick={btnAddEmployee}>+ 직원 추가하기</span>
        <span style={buttonStyle} onClick={btnRemoveEmployee}>- 직원 삭제하기</span>
        <span style={buttonStyle} onClick={btnAddFace}>+ 얼굴 등록</span>
      </div>

      <div style={{ marginBottom: "15px" }}>총 직원 수: {employeeData.length}</div>

      {/* 헤더 */}
      <div style={{ ...rowStyle, fontWeight: "bold", background: "#f1f1f1" }}>
        <div className="row-col"><input type="checkbox"
          onChange={(e) =>
            setSelectedEmployees(
              e.target.checked ? employeeData.map((e) => e.emp_id) : []
            )}
          checked={selectedEmployees.length === employeeData.length && employeeData.length > 0} />
        </div>
        <div className="row-col">사원번호</div>
        <div className="row-col">이름</div>
        <div className="row-col">직책</div>
        <div className="row-col">입사일</div>
        <div className="row-col">조직</div>
        <div className="row-col">생년월일</div>
        <div className="row-col">연락처</div>
        <div className="row-col">전자우편</div>
      </div>

      {employeeData.map(worker => renderRow(worker))}

      <AddWorkerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEmployee} />
      <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWorker} isType={"직원"} />
    </div>
  );
};

const containerStyle = {
  width: "100%",
  maxWidth: "900px", // ✅ 모바일에서도 보기 좋게 제한
  margin: "0 auto",
  padding: "10px"
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(9, 1fr)",
  padding: "8px 0",
  borderBottom: "1px solid #ccc",
  gap: "10px",
  alignItems: "center",
};

const buttonWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "20px"
};

const buttonStyle = {
  padding: "8px 12px",
  backgroundColor: "#007BFF",
  color: "#fff",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold"
};

export default ManEmplyee;
