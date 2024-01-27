function processCSV() {
    // Get the input element
    var input = document.getElementById('csvInput');

    // Check if a file is selected
    if (input.files.length > 0) {
    var file = input.files[0];
    var reader = new FileReader();

    // Read the file as text
    reader.readAsText(file);

    reader.onload = function (event) {
        // Get the CSV data
        const csvData = event.target.result;

        // Process the CSV data (Replace this with your own processing logic)
        const output = processData(csvData);

        for (const [key, value] of Object.entries(output)) {
            generateCSV(value, `${key}.csv`);
        }
    };
    } else {
    alert('Please select a CSV file');
    }
}

function csvToData(csvRaw) {
    const csvMatrix = csvRaw.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const headers = csvMatrix[0]
    return csvMatrix.slice(1).map(row => {
        const obj = {}
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j]
        }
        return obj
    })
}

// function dataToCsv(csvData) {
//     if (csvData.length == 0) {
//         return ""
//     }
//     const columns = Object.keys(csvData[0])
//     const output = columns.join(',') + "\n" + csvData.reduce((acc, obj) => acc + columns.map(key => obj[key]).join(',') + '\n', "")
//     return output
// }

function processData(csvRaw) {
    const csvData = csvToData(csvRaw)
    console.log("Input", csvData)
    output = handler(csvData)
    console.group("Output" , output)
    return output
}

function generateCSV(data, filename) {
    // Create a Blob with the data and create a link to trigger download
    var blob = new Blob([data], { type: 'text/csv' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // Append the link to the body and trigger a click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
}