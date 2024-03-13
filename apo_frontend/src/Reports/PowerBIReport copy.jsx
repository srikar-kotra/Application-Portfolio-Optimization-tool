import React, { useState } from 'react';
import { powerbi } from 'powerbi-client-react';
import { readFileSync } from 'fs'; // If you're using Node.js for reading the JSON file

const ReportGenerator = () => {
    // State to hold the report configuration
    const [reportConfig, setReportConfig] = useState(null);

    // Function to handle the report generation
    const generateReport = () => {
        try {
            // Read the JSON data to be used for report generation (replace with your JSON data source)
            const jsonData = readFileSync('path/to/your/data.json', 'utf-8');

            // Generate the report configuration by combining the template report URL and the JSON data
            const reportTemplateUrl = 'https://app.powerbi.com/reportEmbed?reportId=your-report-id'; // Replace with the actual template report URL
            const reportConfig = {
                type: 'report',
                embedUrl: reportTemplateUrl,
                tokenType: 'embed',
                accessToken: 'your-embed-token', // Replace with the actual embed token or implement a logic to get the token
                datasetId: 'your-dataset-id', // Replace with the dataset ID associated with the template report
                settings: {
                    filterPaneEnabled: false,
                    navContentPaneEnabled: false
                },
                permissions: powerbi.models.Permissions.All,
                viewMode: powerbi.models.ViewMode.View
            };

            // Set the report configuration to the state
            setReportConfig(reportConfig);
        } catch (error) {
            console.error('Error reading JSON file or generating report:', error.message);
        }
    };

    return (
        <div>
            <button onClick={generateReport}>Generate Report</button>
            {reportConfig && (
                <powerbi.Embed
                    embedConfig={reportConfig}
                />
            )}
        </div>
    );
};

export default ReportGenerator;
