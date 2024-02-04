 // ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter=','){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
        
function processCSV() {
    // Get the input element
    var input = document.getElementById('csvInput');

    document.getElementById("matchButton").disabled = true;
    document.getElementById("matchButton").innerHTML = "Match Complete! Check Downloads.";

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
    const arr = CSVToArray(csvRaw);
    const headers = arr[0].map(h => h.replace(/ /g, '_').toLowerCase())
    return arr.slice(1).map(row => {
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

    for (let key in output) {
        createTable(key, output[key])
    }
    return output
}

function createTable(name, data) {
    var newTable = document.createElement('section');

    // Step 2: Set attributes or content (optional)
    newTable.id = `${name}_table`;
    newTable.className = 'container';

    
    table = `<table> ${CSVToArray(data).map((row, index) => {
        const el = index == 0 ? 'th' : 'td'
        return `<tr>${row.map((v) => `<${el}>${v}<${el}/>`).join('\n')}</tr>`
    }).join('\n')} </table>`

    newTable.innerHTML = `<h2>${name}</h2>\n${table}`;

    // Step 3: Append the div to an existing element or the document body
    // Here, we are appending it to the body
    document.body.appendChild(newTable);
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