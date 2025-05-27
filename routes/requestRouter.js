// 📌 휴가 요청 + 근무변경 요청 시 승인 여부를 관리자가 변경 가능하고,
// 자동 스케줄 생성 시 '승인된 요청'을 기반으로 휴무 반영되도록 보완

const express = require('express');
const requestRouter = express.Router();
const conn = require("../config/db");

// ✅ [1] 휴가/병가 요청 등록
requestRouter.post("/leave", (request, response) => {
    console.log("✅ [백엔드] 휴가 신청 요청 받음", request.body);
    const { req_type, req_content, emp_id, start_date, end_date } = request.body;

    const allowedTypes = ["휴가", "병가"];
    if (!allowedTypes.includes(req_type)) {
        return response.status(400).json({ error: "❌ 유효하지 않은 휴가 유형입니다." });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return response.status(400).json({ error: "❌ 종료 날짜가 시작 날짜보다 빠를 수 없습니다." });
    }

    const sql = `
        INSERT INTO tb_request (req_type, req_content, emp_id, start_date, end_date, req_status)
        VALUES (?, ?, ?, ?, ?, 'N')
    `;

    conn.query(sql, [req_type, req_content, emp_id, start_date, end_date], (error, result) => {
        if (error) {
            console.error("❌ 근무 요청 등록 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }
        response.json({ message: "✅ 휴가/병가 신청 완료!", detail: result });
    });
});

// ✅ [2] 근무 변경 요청 등록
requestRouter.post("/shifts", (request, response) => {
    console.log("✅ [백엔드] 근무변경 신청 받음", request.body);
    const { req_content, emp_id, origin_date, origin_time, change_date, change_time } = request.body;

    const sql = `
        INSERT INTO tb_request (req_type, req_content, emp_id, origin_date, origin_time, change_date, change_time, req_status)
        VALUES ('근무변경', ?, ?, ?, ?, ?, ?, 'N')
    `;

    conn.query(sql, [req_content, emp_id, origin_date, origin_time, change_date, change_time], (error, result) => {
        if (error) {
            console.error("❌ 근무변경 요청 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }
        response.json({ message: "✅ 근무변경 신청 완료!", detail: result });
    });
});

// ✅ [3] 요청 내역 조회
requestRouter.post("/list/getlist", (request, response) => {
    const { ids } = request.body;

    const sql = `
        SELECT 
            req_type, req_status, req_content,
            start_date, end_date,
            origin_date, origin_time, change_date, change_time
        FROM tb_request
        WHERE emp_id IN (?)
        ORDER BY created_at DESC
    `;

    conn.query(sql, [ids], (error, result) => {
        if (error) {
            console.error("❌ 요청 내역 조회 실패:", error);
            return response.status(500).json({ error: "DB 조회 실패" });
        }
        response.status(200).json({ data: result });
    });
});

// ✅ [4] 관리자 승인 처리 (예: 승인 또는 반려)
requestRouter.post("/approve", (req, res) => {
    const { req_idx, decision, admin_id } = req.body;
    const req_status = decision === "승인" ? "Y" : "R";

    const sql = `
        UPDATE tb_request
        SET req_status = ?, approved_at = NOW(), admin_id = ?
        WHERE req_idx = ?
    `;

    conn.query(sql, [req_status, admin_id, req_idx], (error, result) => {
        if (error) {
            console.error("❌ 승인 처리 실패:", error);
            return res.status(500).json({ error: "DB 오류" });
        }
        res.status(200).json({ message: "처리 완료", result });
    });
});

module.exports = requestRouter;
