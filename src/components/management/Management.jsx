import React, { useState } from 'react';
import styles from "../../Group.module.css";
import ManEmplyee from "./ManEmplyee";
import ManGroup from "./ManGroup";
import ManWork from "./ManWork";
import ManVacation from "./ManVacation";

const Management = () => {
  const [status, setStatus] = useState(0);

  const onClickTab = (index) => {
    setStatus(index);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "100%", // ✅ 너비를 유연하게
      padding: "10px",
      boxSizing: "border-box"
    }}>
      {/* ✅ 탭 버튼들을 세로로 바꿈 */}
      <div className={styles.manageBtnsHorizontal}>
        <span className={styles.workerTab} onClick={() => onClickTab(0)}>직원</span>
        <span className={styles.groupTab} onClick={() => onClickTab(1)}>직책</span>
        <span className={styles.groupTab} onClick={() => onClickTab(2)}>근로</span>
        <span className={styles.groupTab} onClick={() => onClickTab(3)}>휴가</span>
      </div>

      <hr style={{ margin: "10px 0" }} />

      <div className={styles.content}>
        {status === 0 && <ManEmplyee />}
        {status === 1 && <ManGroup />}
        {status === 2 && <ManWork />}
        {status === 3 && <ManVacation />}
      </div>
    </div>
  );
};

export default Management;
