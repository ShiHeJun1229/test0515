const STORAGE_KEY = 'healthRecords';
let records = [];

function loadRecords() {
    const stored = localStorage.getItem(STORAGE_KEY);
    records = stored ? JSON.parse(stored) : [];
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderRecords() {
    const tbody = document.getElementById('recordsBody');
    tbody.innerHTML = '';

    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.heartRate}</td>
            <td>${record.bloodPressure}</td>
            <td>${record.bodyTemp}</td>
            <td>${record.respRate}</td>
            <td><button class="delete-btn" data-index="${index}">刪除</button></td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteRecord(index);
        });
    });
}

function addRecord(heartRate, bloodPressure, bodyTemp, respRate) {
    const record = {
        heartRate,
        bloodPressure,
        bodyTemp,
        respRate,
        timestamp: new Date().toISOString()
    };
    records.push(record);
    saveRecords();
    renderRecords();
}

function deleteRecord(index) {
    records.splice(index, 1);
    saveRecords();
    renderRecords();
}

function queryRecords() {
    return records;
}

function downloadJSON() {
    const data = JSON.stringify(records, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vitals.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    renderRecords();

    document.getElementById('healthForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const heartRate = document.getElementById('heartRate').value;
        const bloodPressure = document.getElementById('bloodPressure').value;
        const bodyTemp = document.getElementById('bodyTemp').value;
        const respRate = document.getElementById('respRate').value;

        addRecord(heartRate, bloodPressure, bodyTemp, respRate);
        this.reset();
    });

    document.getElementById('downloadBtn').addEventListener('click', downloadJSON);
});