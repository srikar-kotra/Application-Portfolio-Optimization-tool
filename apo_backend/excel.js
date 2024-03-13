import xlsx from 'xlsx';
import fs from 'fs';
import { application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { valuesData, parametersData } from './create_tables.js'
import { fill } from './Rule_Engine/rule_engine.js'
// Function to save JSON data to a local file
function saveJsonToFile(jsonData, customFileName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const folderPath = path.join(__dirname, 'json');
    const filePath = path.join(folderPath, customFileName);

    // Check if the 'json' folder exists, create it if it doesn't
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    // Check if the JSON file already exists
    if (fs.existsSync(filePath)) {
        // If the file exists, read its content
        const existingData = fs.readFileSync(filePath, 'utf8');

        try {
            // Parse the existing JSON data
            const existingJsonData = JSON.parse(existingData);

            // Merge the new jsonData into the existing JSON data
            const mergedData = { ...existingJsonData, ...jsonData };

            // Write the merged data back to the file
            fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));

            console.log(`JSON data updated and saved to: ${filePath}`);
        } catch (error) {
            console.error('Error parsing existing JSON data:', error.message);
        }
    } else {
        // If the file doesn't exist, write the JSON data directly to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        console.log(`JSON data saved to: ${filePath}`);
    }
}

// Main function to execute the conversion and saving to a local JSON file
export default async function main(customer_id, workbook) {
    try {
        const data = await convertToScores(workbook);
        //console.log(await convertToScores());
        const scoresData = data.result;
        const mergeData = data.merge;
        //console.log(mergeData);

        // Generate a custom JSON file name based on the current timestamp
        //const timestamp = new Date().toISOString().replace(/[:.]/g, '');
        const customFileName = `scores_${customer_id}.json`;

        const mergeFileName = `merge_${customer_id}.json`;

        // Save the scores data to the local JSON file
        saveJsonToFile(scoresData, customFileName);
        saveJsonToFile(mergeData, mergeFileName);
        //console.log(mergeData)
        //console.log(fill(mergeData))
    } catch (error) {
        console.error('Error during conversion and saving:', error.message);
    }
}

// Function to convert Excel data to JSON and print the result
async function convertExcelFileToJson(file) {
    try {
        // Read the Excel file from the directory
        const excelBuffer = await fs.readFileSync('Test.xlsx');

        // Call the existing function to convert Excel buffer to JSON
        return convertExcelToJson(excelBuffer);
    } catch (error) {
        console.error('Error reading Excel file:', error.message);
        throw new Error('Failed to read Excel file. Please check the file path and try again.');
    }
}

// Function to convert Excel data to JSON
async function convertExcelToJson(excelBuffer) {
    try {
        // Parse the Excel buffer using xlsx library
        const workbook = xlsx.read(excelBuffer, { type: 'buffer' });

        // Assuming the first sheet is the one with data
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the worksheet data to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Return the JSON data
        return jsonData;
    } catch (error) {
        console.error('Error converting Excel to JSON:', error.message);
        throw new Error('Failed to convert Excel to JSON. Please try again.');
    }
}





// Function to convert values to scores based on the provided mapping
async function convertToScores(workbook) {

    const categories = [
        { name: "Business Criticality" },
        { name: "Application Stability" },
        { name: "Application Complexity" },
        { name: "Application Maturity" },
        { name: "Interoperability" },
        { name: "Technology Maturity/Debt" },
        { name: "Digital and Microservices Readiness" },
        { name: "Security Adherence" },
        { name: "Knowledge Repositories" },
        { name: "Technical Risk" },
        { name: "Infrastructure" }

    ];

    // Usage example:
    // Replace 'path/to/excel.xlsx' with the actual path to your Excel file
    const genjson = await convertExcelFileToJson(workbook);
    const dataWithDefaultScores = genjson;
    //console.log("--")
    //console.log(dataWithDefaultScores);
    // Mapping of values to scores for each parameter

    const scoreMappings = {};

    // Loop through the input array
    for (const item of valuesData) {
        const parameterName = item.Parameter_name;
        const valueName = item.Value_name;
        const defaultScore = item.Default_score;

        // Check if the parameter name already exists in the result object
        if (!scoreMappings[parameterName]) {
            // If not, create a new object for the parameter
            scoreMappings[parameterName] = {};
        }

        // Add the value name and default score to the nested object
        scoreMappings[parameterName][valueName] = defaultScore;
    }

    /*const scoreMappings = {
        'Financial & Non-financial impacts': {
            '0 - 6 hours (Intra-Day)': 5,
            '7 - 12 hours (Inter-Day)': 4,
            '13 - 24 hours (Start of Day Tomorrow)': 3,
            '25 - 72 Hours (This Week)': 2,
            '3 - 5 days + (End of Week)': 1,
        },
        'Frequency of Changes': {
            'No code changes due to bugs / enhancements in the last 12 months': 5,
            'No code changes due to bugs / enhancements in the last 6 months': 4,
            'No code changes due to bugs / enhancements in the last 3 months': 3,
            'No code changes due to bugs / enhancements in the last 1 month': 2,
            'Frequent code change due to recurring problems': 1,
        },
        'Business data criticality': {
            "Data stored is critical to the business and loss could stop revenue and pose major financial/legal cost": 5,
            "Data stored is core to the business and loss of this data could involve a cost to carry out the business operation": 4,
            "Data stored is not critical to day-to-day operations, but are important for smooth business operation": 3,
            "Data stored is not at all critical to business": 2,
            "NA - Data not available": 1
        },
        // ... Add mappings for other parameters ...
    };*/


    const parameter_mapping = {};

    parametersData.forEach((item) => {
        const parameterName = item.L1_Parameter_name;
        const categoryName = item.Category_name;
        parameter_mapping[parameterName] = categoryName;
    });

    const result = [];
    const merge = [];

    for (var i = 0; i < dataWithDefaultScores.length; i++) {
        const item = dataWithDefaultScores[i];
        //console.log(item);

        // Get the parameters in item
        const parameters = Object.keys(item);
        //console.log(parameters);


        const scores = {};
        const categoryScores = {}; // Store the scores for each category
        for (const category of categories) {
            categoryScores[category.name] = 0.0;
        }
        const categoryCounts = {}; // Store the counts of parameters for each category
        const applicationName = item['Application Name'];

        parameters.forEach((parameter) => {
            if (parameter == 'Application Name') {
                scores[parameter] = item[parameter];

            }
            else {
                const value = item[parameter];
                //console.log(value);
                const mapping = scoreMappings[parameter];
                //console.log(mapping);
                const score = mapping[value];
                //console.log(score);
                scores[parameter] = score;
                categoryScores[parameter_mapping[parameter]] = (categoryScores[parameter_mapping[parameter]] || 0) + score;
                categoryCounts[parameter_mapping[parameter]] = (categoryCounts[parameter_mapping[parameter]] || 0) + 1;


            }
        }

        );

        //console.log(categoryScores);

        // Calculate the average score for each category
        Object.keys(categoryScores).forEach((category) => {
            categoryScores[category] = categoryScores[category] / categoryCounts[category];
        });
        merge[applicationName] = categoryScores;
        //console.log(merge);
        result.push(scores);



    };
    //console.log(merge);

    return { result, merge };
}



