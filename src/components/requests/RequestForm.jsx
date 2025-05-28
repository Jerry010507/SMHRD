import React from 'react';
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
          flexDirection: "column",
          gap: "30px",
          marginTop: "30px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "30px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <ReqLeave />
          <ReqShiftChange />
          <div style={{
            display: "flex",
            flexDirection: "column",
            background: "#fafafa",
            padding: "10px",
            borderRadius: "10px"
          }}>
            <h3 style={{ textAlign: "center" }}>내역</h3>
            <ReqComplete />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
