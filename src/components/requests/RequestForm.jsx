import React from 'react';
import ReqSpace from './ReqSpace';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';
import ReqComplete from './ReqComplete';

const RequestForm = () => {
  return (
    <div style={styles.page}>
      <h2 style={styles.header}>요청하기</h2>

      <div style={styles.section}>
        <ReqSpace />
      </div>

      <div style={styles.row}>
        <ReqLeave />
        <ReqShiftChange />
        <div style={styles.completeBox}>
          <h3 style={styles.completeTitle}>내역</h3>
          <ReqComplete />
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    padding: "20px",
    width: "100%",
    alignItems: "center"
  },
  header: {
    textAlign: "center"
  },
  section: {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%"
  },
  completeBox: {
    display: "flex",
    flexDirection: "column",
    background: "#fafafa",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "400px"
  },
  completeTitle: {
    textAlign: "center",
    marginBottom: "10px"
  }
};

export default RequestForm;
