import React from 'react';
import ReqSpace from './ReqSpace';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';
import ReqComplete from './ReqComplete';

const RequestForm = () => {
  return (
    <div>
      <h4>요청하기</h4>

      <div
        style={{
          display: "flex",
          flexDirection: "column", // 세로로 전체 구성
          gap: "30px",
          marginTop: "30px"
        }}
      >
        {/* 첫 줄: 공간 요청 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReqSpace />
        </div>

        {/* 두 번째 줄: 왼쪽 휴가요청, 가운데 근무변경, 오른쪽 내역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "30px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          {/* 휴가 신청 */}
          <ReqLeave />

          {/* 근무 변경 */}
          <ReqShiftChange />

          {/* 요청 내역 */}
          <div style={{ display: "flex", flexDirection: "column", background: "#fafafa", padding: "10px", borderRadius: "10px" }}>
            <h3 style={{ textAlign: "center" }}>내역</h3>
            <ReqComplete />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
