import { React, useState, useEffect } from 'react';
import AddGroupModal from '../modals/AddGroupModal';
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import axios from 'axios';

const ManGroup = () => {
    const [groupData, setGroupData] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDltModalOpen, setIsDltModalOpen] = useState(false);

    useEffect(() => {
        const storedGroups = sessionStorage.getItem('groupData');
        if (storedGroups) {
            setGroupData(JSON.parse(storedGroups));
        }
    }, []);

    const handleCheckboxChange = (code) => {
        setSelectedGroups((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code)
                : [...prev, code]
        );
    };

    const groupLine = (code, dpName, description, location) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <label>
                <input
                    type="checkbox"
                    checked={selectedGroups.includes(code)}
                    onChange={() => handleCheckboxChange(code)}
                    style={{ marginRight: "8px" }}
                />
                <strong>{dpName}</strong>
            </label>
            <span>직책번호: {code}</span>
            <span>설명: {description}</span>
            <span>위치: {location}</span>
        </div>
    );

    const handleAddGroup = async (newGroup) => {
        const { dpId, dpName, description, location } = newGroup;
        const temp_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const response = await axios.post("/management/addGroup", {
                group_id: dpId,
                group_name: dpName,
                group_desc: description,
                group_pos: location,
                created_at: temp_time
            });

            const updatedGroupData = [
                ...groupData,
                {
                    group_id: dpId,
                    group_name: dpName,
                    group_desc: description,
                    group_pos: location,
                    created_at: temp_time
                }
            ];

            sessionStorage.setItem('groupData', JSON.stringify(updatedGroupData));
            setGroupData(updatedGroupData);
            setIsAddModalOpen(false);
        } catch (error) {
            if (error.message.includes("500")) {
                alert("직책코드가 중복입니다. 다시 시도해주세요.");
            } else {
                alert("조직을 추가하는 데 실패했습니다.");
            }
        }
    };

    const handleDeleteGroup = async (confirm) => {
        if (!confirm) return;
        try {
            const response = await axios.post("/management/dltGroup", { ids: selectedGroups });
            if (response.status === 200) {
                const updatedGroupData = groupData.filter((group) => !selectedGroups.includes(group.group_id));
                sessionStorage.setItem('groupData', JSON.stringify(updatedGroupData));
                setGroupData(updatedGroupData);
                setSelectedGroups([]);
                setIsDltModalOpen(false);
            } else {
                alert("조직 삭제 요청이 실패했습니다.");
            }
        } catch (error) {
            alert("조직 삭제하는 데 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }
    };

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ margin: "0 0 10px 0" }}>직책관리</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setIsDltModalOpen(true)} disabled={selectedGroups.length === 0}>- 직책 삭제하기</button>
                <button onClick={() => setIsAddModalOpen(true)}>+ 직책 추가하기</button>
            </div>
            <span>총 직책 수: {groupData.length}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {groupData.map((group) =>
                    groupLine(group.group_id, group.group_name, group.group_desc, group.group_pos)
                )}
            </div>
            <AddGroupModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddGroup} />
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteGroup} isType="직책" />
        </div>
    );
};

export default ManGroup;
