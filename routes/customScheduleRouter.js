const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ 수동 스케줄 등록 또는 수정
router.post("/upsert", async (req, res) => {
  const { date, day, work_name, employee_name, employee_role } = req.body;

  if (!date || !day || !work_name || !employee_name || !employee_role) {
    return res.status(400).json({ message: "필수 항목 누락!" });
  }

  try {
    const [existing] = await db.promise().query(
      "SELECT * FROM tb_autoschedule WHERE date = ? AND work_name = ?",
      [date, work_name]
    );

    if (existing.length > 0) {
      await db.promise().query(
        "UPDATE tb_autoschedule SET employee_name = ?, employee_role = ?, day = ?, updated_at = NOW() WHERE date = ? AND work_name = ?",
        [employee_name, employee_role, day, date, work_name]
      );
      return res.status(200).json({ message: "수정 완료!" });
    } else {
      await db.promise().query(
        "INSERT INTO tb_autoschedule (date, day, work_name, employee_name, employee_role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [date, day, work_name, employee_name, employee_role]
      );
      return res.status(200).json({ message: "등록 완료!" });
    }
  } catch (err) {
    console.error("❌ 수동 저장 오류:", err);
    res.status(500).json({ message: "DB 오류!", error: err });
  }
});

// ✅ 수동 스케줄 삭제
router.delete("/delete", async (req, res) => {
  const { date, work_name } = req.body;

  if (!date || !work_name) {
    return res.status(400).json({ message: "삭제할 날짜와 근무 유형 필요!" });
  }

  try {
    await db.promise().query(
      "DELETE FROM tb_autoschedule WHERE date = ? AND work_name = ?",
      [date, work_name]
    );
    return res.status(200).json({ message: "삭제 완료!" });
  } catch (err) {
    console.error("❌ 삭제 오류:", err);
    res.status(500).json({ message: "삭제 실패!", error: err });
  }
});

module.exports = router;
