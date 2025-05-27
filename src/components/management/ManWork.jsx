import { React, useState, useEffect } from 'react'
import AddWorkModal from '../modals/AddWorkModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'
import axios from 'axios'

const ManWork = () => {
    const [workData, setWorkData] = useState([])
    const [selectedWorks, setSelectedWorks] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDltModalOpen, setIsDltModalOpen] = useState(false)

    useEffect(() => {
        const storedWorks = sessionStorage.getItem('workData')
        if (storedWorks) {
            try {
                const parsedData = JSON.parse(storedWorks)
                setWorkData(parsedData)
            } catch (err) {
                console.error('JSON 파싱 오류:', err)
            }
        }
    }, [])

    const handleCheckboxChange = (code) => {
        setSelectedWorks((prev) =>
            prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
        )
    }

    // ⭐️ 버튼 함수 정의 위치 추가
    const btnAddWork = () => setIsAddModalOpen(true)
    const btnRemoveWork = () => {
        if (selectedWorks.length === 0) return
        setIsDltModalOpen(true)
    }

    const handleAddWork = async (newWork) => {
        let temp01 = newWork.wrkId + `${workData.length + 1}` || `T${workData.length + 1}`
        let temp02 = newWork.wrkName || `테스트그룹`
        let temp03 = newWork.wrkTimeStart || `테스트그룹장`
        let temp04 = newWork.wrkTimeEnd || `테스트그룹장`
        let temp05 = newWork.wrkbreakTime || `테스트그룹장`
        let temp06 = newWork.wrkDays || `테스트 그룹 설명`
        let temp07 = newWork.wrkDfRule || 40.0
        let temp08 = newWork.wrkMxRule || 52.0
        let temp09 = newWork.wrkType || '정규직'
        let temp10 = newWork.wrkDesc || '테스트용'

        try {
            await axios.post('/management/addwork', {
                work_id: temp01,
                work_name: temp02,
                work_start: temp03,
                work_end: temp04,
                work_break: temp05,
                work_days: temp06,
                work_default_rule: temp07,
                work_max_rule: temp08,
                work_type: temp09,
                work_desc: temp10
            })

            const updatedWorkData = [
                ...workData,
                {
                    work_id: temp01,
                    work_name: temp02,
                    work_start: temp03,
                    work_end: temp04,
                    work_break: temp05,
                    work_days: temp06,
                    work_default_rule: temp07,
                    work_max_rule: temp08,
                    work_type: temp09,
                    work_desc: temp10,
                    created_at: new Date().toISOString()
                }
            ]

            sessionStorage.setItem('workData', JSON.stringify(updatedWorkData))
            setWorkData(updatedWorkData)
            setIsAddModalOpen(false)
        } catch (error) {
            console.error('근로 추가 실패:', error)
            alert('근로를 추가하는 데 실패했습니다. 다시 시도해주세요.')
        }
    }

    const handleDeleteWork = async (confirm) => {
        if (!confirm) return

        try {
            const response = await axios.post('/management/dltWork', { ids: selectedWorks })
            if (response.status === 200) {
                const updatedWorkData = workData.filter((work) => !selectedWorks.includes(work.work_id))
                sessionStorage.setItem('workData', JSON.stringify(updatedWorkData))
                setWorkData(updatedWorkData)
                setSelectedWorks([])
                setIsDltModalOpen(false)
            } else {
                alert('근로 삭제 요청이 실패했습니다.')
            }
        } catch (error) {
            console.error('근로 삭제 오류:', error)
            alert('근로 삭제 중 문제가 발생했습니다.')
        }
    }

    const workLine = (code, wName, wstart, wEnd, workDates, defTime, limtTime, type, comment) => (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
            <div><strong>근로번호:</strong> {code}</div>
            <div><strong>근로명:</strong> {wName}</div>
            <div><strong>출근시간:</strong> {wstart}</div>
            <div><strong>퇴근시간:</strong> {wEnd}</div>
            <div><strong>소정근로요일:</strong> {workDates}</div>
            <div><strong>소정근로규칙:</strong> {defTime}</div>
            <div><strong>최대근로규칙:</strong> {limtTime}</div>
            <div><strong>계약유형:</strong> {type}</div>
            <div><strong>비고:</strong> {comment}</div>
        </div>
    )

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <h2>근로관리</h2>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                <button onClick={btnRemoveWork} style={btnStyle}>- 근로 삭제하기</button>
                <button onClick={btnAddWork} style={btnStyle}>+ 근로 추가하기</button>
            </div>
            <span>총 근로 수 : {workData.length}</span>
            <hr />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                    type="checkbox"
                    onChange={(e) => setSelectedWorks(e.target.checked ? workData.map((w) => w.work_id) : [])}
                    checked={selectedWorks.length === workData.length && workData.length > 0}
                />
                <span style={{ marginLeft: '10px' }}>전체 선택</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {workData.map((work) =>
                    workLine(
                        work.work_id,
                        work.work_name,
                        work.work_start,
                        work.work_end,
                        work.work_days,
                        work.work_default_rule,
                        work.work_max_rule,
                        work.work_type,
                        work.work_desc
                    )
                )}
            </div>
            <AddWorkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddWork} />
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWork} isType={'근로'} />
        </div>
    )
}

const btnStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
}

export default ManWork
