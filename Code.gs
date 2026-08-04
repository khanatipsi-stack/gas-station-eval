// ==============================================================================
// Google Apps Script: ระบบฐานข้อมูลประเมินผู้รับเหมาก่อสร้างสถานีบริการน้ำมัน
// Google Sheet URL: https://docs.google.com/spreadsheets/d/1rGvvwW0LKSRpVz8ZyZpiQanQhNJn1zudDW1zXieiPZs/edit
// ==============================================================================

/**
 * ฟังก์ชันรับ GET Request - ดึงข้อมูลโครงการและผลการประเมินทั้งหมด
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // สร้างแท็บอัตโนมัติหากยังไม่มี
    initSheetsIfMissing(ss);
    
    var projectSheet = ss.getSheetByName('Projects');
    var evalSheet = ss.getSheetByName('Evaluations');
    
    // 1. ดึงข้อมูลโครงการจากแท็บ Projects
    var projectData = projectSheet.getDataRange().getValues();
    var projects = [];
    
    for (var i = 1; i < projectData.length; i++) {
      var row = projectData[i];
      if (row[0] || row[1]) {
        projects.push({
          id: String(row[0] || ''),
          branchName: String(row[1] || ''),
          model: String(row[2] || 'Model A'),
          contractor: String(row[3] || ''),
          budget: parseFloat(row[4]) || 0,
          evaluations: {}
        });
      }
    }
    
    // 2. ดึงข้อมูลการประเมินจากแท็บ Evaluations
    var evalData = evalSheet.getDataRange().getValues();
    for (var j = 1; j < evalData.length; j++) {
      var eRow = evalData[j];
      var pId = String(eRow[0] || '');
      var deptId = parseInt(eRow[1], 10);
      
      if (pId && deptId) {
        var project = projects.find(function(p) { return p.id === pId; });
        if (project) {
          var scoresObj = {};
          try {
            scoresObj = JSON.parse(eRow[6] || '{}');
          } catch(err) {
            scoresObj = {};
          }
          
          project.evaluations[deptId] = {
            evaluatorName: String(eRow[2] || ''),
            evaluatorEmail: String(eRow[3] || ''),
            totalDeptScore: parseFloat(eRow[4]) || 0,
            comments: String(eRow[5] || ''),
            scores: scoresObj,
            timestamp: String(eRow[7] || '')
          };
        }
      }
    }
    
    return responseJSON({ 
      status: 'success', 
      projects: projects,
      message: 'ดึงข้อมูลสำเร็จ'
    });
    
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

/**
 * ฟังก์ชันรับ POST Request - บันทึกผลการประเมินใหม่ลง Google Sheet
 */
function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheetsIfMissing(ss);
    
    var evalSheet = ss.getSheetByName('Evaluations');
    var evalRows = evalSheet.getDataRange().getValues();
    
    var projectId = String(data.projectId);
    var deptId = parseInt(data.deptId, 10);
    var evaluatorName = String(data.evaluatorName || '');
    var evaluatorEmail = String(data.evaluatorEmail || '');
    var totalDeptScore = parseFloat(data.totalDeptScore) || 0;
    var comments = String(data.comments || '');
    var scoresJson = JSON.stringify(data.scores || {});
    var timestamp = new Date().toLocaleString('th-TH');
    
    var updated = false;
    
    // หากมีข้อมูลของโครงการและฝ่ายนี้อยู่แล้ว ให้บันทึกทับ
    for (var i = 1; i < evalRows.length; i++) {
      if (String(evalRows[i][0]) === projectId && parseInt(evalRows[i][1], 10) === deptId) {
        var rowNum = i + 1;
        evalSheet.getRange(rowNum, 3, 1, 6).setValues([[
          evaluatorName,
          evaluatorEmail,
          totalDeptScore,
          comments,
          scoresJson,
          timestamp
        ]]);
        updated = true;
        break;
      }
    }
    
    // หากยังไม่มี ให้เพิ่มแถวใหม่
    if (!updated) {
      evalSheet.appendRow([
        projectId,
        deptId,
        evaluatorName,
        evaluatorEmail,
        totalDeptScore,
        comments,
        scoresJson,
        timestamp
      ]);
    }
    
    return responseJSON({ 
      status: 'success', 
      message: 'บันทึกผลการประเมินลง Google Sheet เรียบร้อยแล้ว',
      projectId: projectId,
      deptId: deptId
    });
    
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

/**
 * ฟังก์ชันช่วยสร้างแท็บและจัดเตรียม Header กรณี Sheet ยังไม่มี
 */
function initSheetsIfMissing(ss) {
  var projectSheet = ss.getSheetByName('Projects');
  if (!projectSheet) {
    projectSheet = ss.insertSheet('Projects');
    projectSheet.appendRow(['ID', 'BranchName', 'Model', 'Contractor', 'Budget']);
    // เพิ่มข้อมูลตัวอย่างเริ่มต้น
    projectSheet.appendRow(['PRJ-2026-001', 'สาขา บางนา-ตราด กม.18', 'Model A', 'บริษัท ไทยคอนสตรัคชั่น เอ็นจิเนียริ่ง จำกัด', 4.8]);
    projectSheet.appendRow(['PRJ-2026-002', 'สาขา มิตรภาพ-โคราช', 'Model B', 'บริษัท เอสซีจี ดีเวลลอปเมนท์ จำกัด', 3.2]);
    projectSheet.appendRow(['PRJ-2026-003', 'สาขา พระราม 2 กม.35', 'Model A', 'บริษัท พรีเมียร์ บิลเดอร์ส จำกัด', 5.5]);
  }
  
  var evalSheet = ss.getSheetByName('Evaluations');
  if (!evalSheet) {
    evalSheet = ss.insertSheet('Evaluations');
    evalSheet.appendRow(['ProjectID', 'DeptID', 'EvaluatorName', 'EvaluatorEmail', 'TotalDeptScore', 'Comments', 'ScoresJSON', 'Timestamp']);
  }
}

/**
 * ฟังก์ชันช่วยคืนค่าเป็น JSON Output
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
