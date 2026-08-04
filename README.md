# คู่มือการตั้งค่าและการใช้งานระบบประเมินผู้รับเหมาก่อสร้างสถานีบริการน้ำมัน
*( Gas Station Construction Contractor Evaluation System with Google Sheets Database & Gemini AI )*

---

## 📌 โครงสร้างไฟล์ในโปรเจกต์
- [`index.html`](file:///C:/Users/10080235/.gemini/antigravity/scratch/gas_station_eval/index.html) - หน้าเว็บแอปพลิเคชันสำหรับทำแบบประเมิน, ดูรายงาน และวิเคราะห์ด้วย AI
- [`Code.gs`](file:///C:/Users/10080235/.gemini/antigravity/scratch/gas_station_eval/Code.gs) - โค้ด Google Apps Script สำหรับใส่ใน Google Sheet เพื่อทำหน้าที่เป็น API Database Backend

---

## 🚀 ขั้นตอนการเชื่อมต่อฐานข้อมูล Google Sheet (Step-by-Step)

### 1. เปิด Google Sheet ของคุณ
เปิดลิงก์ Google Sheet ที่คุณเตรียมไว้:
👉 [https://docs.google.com/spreadsheets/d/1rGvvwW0LKSRpVz8ZyZpiQanQhNJn1zudDW1zXieiPZs/edit](https://docs.google.com/spreadsheets/d/1rGvvwW0LKSRpVz8ZyZpiQanQhNJn1zudDW1zXieiPZs/edit)

### 2. นำโค้ด Google Apps Script ไปวาง
1. ในหน้า Google Sheet ให้คลิกเมนู **Extensions (ส่วนขยาย)** &gt; **Apps Script**
2. คัดลอกโค้ดทั้งหมดในไฟล์ [`Code.gs`](file:///C:/Users/10080235/.gemini/antigravity/scratch/gas_station_eval/Code.gs) ไปวางทดแทนในหน้า Apps Script
3. กดปุ่ม **Save (บันทึก)** หรือกด `Ctrl + S`

### 3. ทำการ Deploy เป็น Web App
1. กดปุ่ม **Deploy (ทำให้ใช้งานได้)** ที่มุมขวาบน &gt; เลือก **New deployment (การทำให้ใช้งานได้ใหม่)**
2. คลิกรูปเฟือง ⚙️ ด้านข้าง Select type &gt; เลือก **Web app**
3. ตั้งค่าดังนี้:
   - **Description**: `Gas Station Eval API`
   - **Execute as**: `Me (อีเมลของคุณ)`
   - **Who has access**: `Anyone (ทุกคน)` *(สำคัญมาก)*
4. กดปุ่ม **Deploy** และกดยืนยันการเข้าถึงสิทธิ์ (Authorize access)
5. คัดลอก **Web App URL** ที่ได้ (ลักษณะ URL: `https://script.google.com/macros/s/AKfycb.../exec`)

### 4. นำ Web App URL มาใส่ในหน้าเว็บแอปพลิเคชัน
1. เปิดไฟล์ [`index.html`](file:///C:/Users/10080235/.gemini/antigravity/scratch/gas_station_eval/index.html) ในเว็บเบราว์เซอร์
2. คลิกปุ่ม **"เชื่อมต่อ Google Sheet"** บน Navbar แถบบน
3. วาง Web App URL ที่ได้ลงในช่อง แล้วกดปุ่ม **"ทดสอบ & บันทึกการเชื่อมต่อ"**
4. สถานะจะเปลี่ยนเป็น **`Google Sheet: Connected`** สีเขียว และดึงข้อมูลโครงการจาก Sheet มาแสดงทันที!

---

## 📊 โครงสร้างการจัดเก็บข้อมูลใน Google Sheet (สร้างให้อัตโนมัติ)

สคริปต์ `Code.gs` จะทำการสร้างและจัดการแท็บใน Google Sheet ให้อัตโนมัติดังนี้:

1. **แท็บ `Projects`**: เก็บรายชื่อโครงการสถานีบริการน้ำมัน
   - `ID` | `BranchName` | `Model` | `Contractor` | `Budget`

2. **แท็บ `Evaluations`**: เก็บผลการประเมินรายฝ่าย
   - `ProjectID` | `DeptID` | `EvaluatorName` | `EvaluatorEmail` | `TotalDeptScore` | `Comments` | `ScoresJSON` | `Timestamp`

---

## 🤖 ฟีเจอร์ Gemini AI Smart Assistant
- **Auto-Rubric Scorer**: วิเคราะห์บันทึกการตรวจหน้างาน (Inspection Notes) และประเมินระดับคะแนน 1-5 ทั้ง 12 หัวข้อให้อัตโนมัติด้วย Gemini 3 Flash
- **Executive Risk & Performance Summary**: สร้างรายงานวิเคราะห์จุดแข็ง ความเสี่ยง SHE และข้อเสนอแนะในการประมูลงานสำหรับผู้บริหาร
- **Gemini Construction Advisor**: แชทผู้ช่วยตอบคำถามเกี่ยวกับเกณฑ์มาตรฐานวิศวกรรม SHE และการตรวจรับงานสถานีบริการน้ำมัน
