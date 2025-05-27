import React from 'react';

const ReqSpace = () => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>공간 요청</h3>
      <div style={styles.box}>
        <p style={styles.placeholder}>현재 기능 추가 중...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold"
  },
  box: {
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
  },
  placeholder: {
    color: "#888",
    fontSize: "16px",
  },
};

export default ReqSpace;
