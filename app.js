function downloadCSV(tableId, filename) {
    var rows = document.getElementById(tableId).querySelectorAll('tr');

    var csv = "\uFEFF"; // BOM (Byte Order Mark) to support UTF-8 in Excel
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            var data = cols[j].innerText.replace(/"/g, '""');
            data = data.replace(/,/g, '');
            row.push('"' + data + '"');
        }
        csv += row.join(',') + '\n';
    }

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

document.getElementById('download-csv-1').addEventListener('click', function() {
    downloadCSV('result-table-1', 'table-1.csv');
});

document.getElementById('download-csv-2').addEventListener('click', function() {
    downloadCSV('result-table-2', 'table-2.csv');
});

document.getElementById('download-table-1').addEventListener('click', function() {
    const tableHeader1 = document.getElementById('table-header-1').innerText;
    html2canvas(document.getElementById('result-table-1')).then(function(canvas) {
        const context = canvas.getContext('2d');
        
        // Create a new canvas to include the header
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + 30; // Adjust height to include header
        const newContext = newCanvas.getContext('2d');
        
        // Draw the header
        newContext.font = "bold 16px Arial";
        newContext.fillText(tableHeader1, 10, 20);
        
        // Draw the table below the header
        newContext.drawImage(canvas, 0, 30);
        
        var link = document.createElement('a');
        link.href = newCanvas.toDataURL('image/png');
        link.download = 'table-1.png';
        link.click();
    });
});

document.getElementById('download-table-2').addEventListener('click', function() {
    const tableHeader2 = document.getElementById('table-header-2').innerText;
    html2canvas(document.getElementById('result-table-2')).then(function(canvas) {
        const context = canvas.getContext('2d');
        
        // Create a new canvas to include the header
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + 30; // Adjust height to include header
        const newContext = newCanvas.getContext('2d');
        
        // Draw the header
        newContext.font = "bold 16px Arial";
        newContext.fillText(tableHeader2, 10, 20);
        
        // Draw the table below the header
        newContext.drawImage(canvas, 0, 30);
        
        var link = document.createElement('a');
        link.href = newCanvas.toDataURL('image/png');
        link.download = 'table-2.png';
        link.click();
    });
});

document.getElementById('initial-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Disable all input initialFormElements and the submit button in the initial form
    const initialFormElements = document.querySelectorAll('#initial-form input, #initial-form select, #initial-form button');
    initialFormElements.forEach(element => {
        element.disabled = true;
    });

    // Show the dynamic section
    document.getElementById('dynamic-section').style.display = 'block';

    // Set the table header based on the initial form inputs
    const baseName = document.getElementById('base-name').value;
    const locationType = document.getElementById('location-type').value;
    const monthYear = document.getElementById('month-year').value;
    document.getElementById('table-header-1').innerText = `میزان کارکرد ${baseName}، ${locationType}، ${monthYear}`;
    document.getElementById('table-header-2').innerText = `تاریخ های شیفت ها`;

    // Show the results section
    document.getElementById('result-section').style.display = 'block';
});

const shiftTypes = ['shift-24-normal', 'shift-24-holiday', 'shift-long-normal', 'shift-long-holiday', 'shift-night', 'shift-full-leave'];

shiftTypes.forEach(shiftType => {
    document.getElementById(shiftType).addEventListener('change', function() {
        const detailsDiv = document.getElementById(`${shiftType}-details`);
        if (this.checked) {
            detailsDiv.innerHTML = `
                <label for="${shiftType}-count">تعداد:</label>
                <input type="text" id="${shiftType}-count" name="${shiftType}-count">
                <label for="${shiftType}-date">تاریخ:</label>
                <input type="text" id="${shiftType}-date" name="${shiftType}-date">
            `;
            detailsDiv.style.display = 'block';
        } else {
            detailsDiv.innerHTML = '';
            detailsDiv.style.display = 'none';
        }
    });
});

document.getElementById('staff-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const staffName = document.getElementById('staff-name').value;
    const productive = document.getElementById('productive').checked ? 'بله' : 'خیر';
    const locationType = document.getElementById('location-type').value;

    let shift24NormalCount = '';
    let shift24NormalDate = '';
    let shift24HolidayCount = '';
    let shift24HolidayDate = '';
    let shiftLongNormalCount = '';
    let shiftLongNormalDate = '';
    let shiftLongHolidayCount = '';
    let shiftLongHolidayDate = '';
    let shiftNightCount = '';
    let shiftNightDate = '';
    let shiftFullLeaveCount = '';
    let shiftFullLeaveDate = '';

    if (document.getElementById('shift-24-normal').checked) {
        shift24NormalCount = document.getElementById('shift-24-normal-count').value;
        shift24NormalDate = document.getElementById('shift-24-normal-date').value;
    }
    if (document.getElementById('shift-24-holiday').checked) {
        shift24HolidayCount = document.getElementById('shift-24-holiday-count').value;
        shift24HolidayDate = document.getElementById('shift-24-holiday-date').value;
    }
    if (document.getElementById('shift-long-normal').checked) {
        shiftLongNormalCount = document.getElementById('shift-long-normal-count').value;
        shiftLongNormalDate = document.getElementById('shift-long-normal-date').value;
    }
    if (document.getElementById('shift-long-holiday').checked) {
        shiftLongHolidayCount = document.getElementById('shift-long-holiday-count').value;
        shiftLongHolidayDate = document.getElementById('shift-long-holiday-date').value;
    }
    if (document.getElementById('shift-night').checked) {
        shiftNightCount = document.getElementById('shift-night-count').value;
        shiftNightDate = document.getElementById('shift-night-date').value;
    }
    if (document.getElementById('shift-full-leave').checked) {
        shiftFullLeaveCount = document.getElementById('shift-full-leave-count').value;
        shiftFullLeaveDate = document.getElementById('shift-full-leave-date').value;
    }

    const miscHoursCount = document.getElementById('misc-hours-count').value;
    const miscHoursDate = document.getElementById('misc-hours-date').value;
    const hourlyLeaveCount = document.getElementById('hourly-leave-count').value;
    const hourlyLeaveDate = document.getElementById('hourly-leave-date').value;
    const missionsCount = document.getElementById('missions-count').value;
    const mealCount = document.getElementById('meal-count').value;
    const notes = document.getElementById('notes').value;

    const tableRow1 = `
        <tr>
            <td>${staffName}</td>
            <td>${productive}</td>
            <td>${locationType}</td>
            <td>${shift24NormalCount}</td>
            <td>${shift24HolidayCount}</td>
            <td>${shiftLongNormalCount}</td>
<td>${shiftLongHolidayCount}</td>
            <td>${shiftNightCount}</td>
            <td>${shiftFullLeaveCount}</td>
            <td>${miscHoursCount}</td>
            <td>${hourlyLeaveCount}</td>
            <td>${missionsCount}</td>
            <td>${mealCount}</td>
            <td>${notes}</td>
            <td><button class="edit-btn">ویرایش</button><button class="save-btn" style="display:none;">ذخیره</button><button class="delete-btn">حذف</button></td>
        </tr>
    `;

    const tableRow2 = `
        <tr>
            <td>${staffName}</td>
            <td>${shift24NormalDate}</td>
            <td>${shift24HolidayDate}</td>
            <td>${shiftLongNormalDate}</td>
            <td>${shiftLongHolidayDate}</td>
            <td>${shiftNightDate}</td>
            <td>${shiftFullLeaveDate}</td>
            <td>${miscHoursDate}</td>
            <td>${hourlyLeaveDate}</td>
            <td><button class="edit-btn">ویرایش</button><button class="save-btn" style="display:none;">ذخیره</button><button class="delete-btn">حذف</button></td>
        </tr>
    `;

    // Insert the new rows into the respective result tables
    document.querySelector('#result-table-1 tbody').insertAdjacentHTML('beforeend', tableRow1);
    document.querySelector('#result-table-2 tbody').insertAdjacentHTML('beforeend', tableRow2);

    // Clear the staff form inputs after submission
    document.getElementById('staff-form').reset();

    // Ensure the dynamic section remains visible after staff form submission
    document.getElementById('dynamic-section').style.display = 'block';
});

// Add event listeners to toggle shift details based on checkbox selection
const shiftTypes = ['shift-24-normal', 'shift-24-holiday', 'shift-long-normal', 'shift-long-holiday', 'shift-night', 'shift-full-leave'];

shiftTypes.forEach(shiftType => {
    document.getElementById(shiftType).addEventListener('change', function() {
        const detailsDiv = document.getElementById(`${shiftType}-details`);
        if (this.checked) {
            detailsDiv.innerHTML = `
                <label for="${shiftType}-count">تعداد:</label>
                <input type="text" id="${shiftType}-count" name="${shiftType}-count">
                <label for="${shiftType}-date">تاریخ:</label>
                <input type="text" id="${shiftType}-date" name="${shiftType}-date">
            `;
            detailsDiv.style.display = 'block';
        } else {
            detailsDiv.innerHTML = '';
            detailsDiv.style.display = 'none';
        }
    });
});

// Event listener to handle editing, saving, and deleting rows in the result section
document.getElementById('result-section').addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('edit-btn')) {
        const row = target.closest('tr');
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell !== cells[0] && cell !== cells[cells.length - 1]) {
                const content = cell.textContent;
                cell.innerHTML = `<input type="text" value="${content}">`;
            }
        });
        target.style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline-block';
    } else if (target.classList.contains('save-btn')) {
        const row = target.closest('tr');
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell !== cells[0] && cell !== cells[cells.length - 1]) {
                const content = cell.querySelector('input').value;
                cell.textContent = content;
            }
        });
        target.style.display = 'none';
        row.querySelector('.edit-btn').style.display = 'inline-block';
    } else if (target.classList.contains('delete-btn')) {
        const row = target.closest('tr');
        row.remove();
    }
});