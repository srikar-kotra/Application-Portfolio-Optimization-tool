import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { Dropdown } from 'react-bootstrap';
import './Reports.css';
import { PowerBIEmbed } from 'powerbi-client-react';
import axios from 'axios'; // Import Axios or your preferred method for fetching data
import { PublicClientApplication, InteractionRequiredAuthError, BrowserAuthError } from '@azure/msal-browser';
import { UserAgentApplication } from 'msal';

const Reports = () => {
    const [selectedReportId, setSelectedReportId] = useState('7596430b-4847-4612-837b-b5b31aaf3fbd'); // Default report ID
    const [reportData, setReportData] = useState([]); // State to store the fetched report data
    const [accessToken, setAccessToken] = useState(null); // State to store the access token
    const [interactionInProgress, setInteractionInProgress] = useState(false);

    const msalConfig = {
        // Your MSAL configuration...
        auth: {
            clientId: '78fde600-a58c-4eee-91c0-b577ac164729',
            authority: 'https://login.microsoftonline.com/2b60fd0d-b5b9-48dd-ae44-593943012aff', // Replace with your Azure AD tenant ID or 'common' for multi-tenant
            redirectUri: 'http://localhost:3000', // Replace with your app's redirect URI
        },
        cache: {
            cacheLocation: 'localStorage', // You can use other cache locations based on your preference
            storeAuthStateInCookie: true, // Set to false if you don't want to use cookies
        },
    };

    const account = {
        homeAccountId: '1628da35-a9fb-4f91-b74c-fb9ea55832e02b60fd0d-b5b9-48dd-ae44-593943012aff',
        environment: 'login.microsoftonline.com',
        tenantId: '2b60fd0d-b5b9-48dd-ae44-593943012aff',
        username: 'cs20b030@iittp.ac.in',
    };

    const pca = new PublicClientApplication(msalConfig);
    const msalInstance = new UserAgentApplication(msalConfig);
    const powerBiScopes = ['https://analysis.windows.net/powerbi/api/Report.Read.All'];

    useEffect(() => {
        // Function to get the access token using MSAL
        const getAccessToken = async () => {
            try {
                const response = await msalConfig.acquireTokenSilent({
                    scopes: ['https://analysis.windows.net/powerbi/api/.default'],
                    account: account,
                });

                // Set the active account when you successfully get the token
                if (response.account) {
                    msalInstance.setActiveAccount(response.account);
                }

                return response.accessToken;
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    try {
                        const response = await pca.acquireTokenPopup({
                            scopes: powerBiScopes,
                        });

                        // Set the active account when you successfully get the token
                        if (response.account) {
                            msalInstance.setActiveAccount(response.account);
                        }

                        return response.accessToken;
                    } catch (error) {
                        console.error('Error acquiring token:', error);
                        return null;
                    }
                } else {
                    console.error('Error acquiring token:', error);
                    return null;
                }
            }
        };
        // Fetch the data you want to update in the Power BI report
        fetchReportData();

        // Get the access token and update state once it's available
        getAccessToken().then((accessToken) => {
            setAccessToken(accessToken);
        });
    }, []);

    const handleReportSelection = (event) => {
        setSelectedReportId(event.target.value);
    };

    const reportOptions = [
        { id: 'a729ecd5-1c84-415d-b857-0246c1e8e1db', name: 'Sample Report 1' },
        { id: 'some_other_report_id', name: 'Example2' },
        // Add more report options as needed
    ];

    const fetchReportData = async () => {
        try {
            // Fetch data from your API or data source using Axios or your preferred method
            // For demonstration purposes, we will use Axios and assume your API returns the data as an array of objects.
            /*const response = await axios.get('YOUR_API_ENDPOINT'); // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
            */

            // Assuming the API response data is an array of objects, update the state with the fetched data
            //setReportData(response.data);

            const data = [
                {
                    'Name': 'App1',
                    'Business Criticality': 4,
                    'Technical Debt': 3,
                },
                {
                    'Name': 'App2',
                    'Business Criticality': 2,
                    'Technical Debt': 1,
                },
            ];

            setReportData(data);
        } catch (error) {
            console.error('Error fetching report data:', error.message);
        }
    };

    return (
        <div>
            <NavBar />

            <div>
                <div className="reports-select">
                    <Dropdown className="report-dropdown">
                        <Dropdown.Toggle id="reportSelect">
                            {/* Display the selected report name */}
                            {reportOptions.find((report) => report.id === selectedReportId)?.name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {reportOptions.map((report) => (
                                <Dropdown.Item key={report.id} eventKey={report.id} onSelect={handleReportSelection}>
                                    {report.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Render the PowerBIEmbed component conditionally */}
                {accessToken && (
                    <PowerBIEmbed
                        reportId={selectedReportId}
                        embedUrl="https://app.powerbi.com/reportEmbed?reportId=a729ecd5-1c84-415d-b857-0246c1e8e1db&autoAuth=true&ctid=2b60fd0d-b5b9-48dd-ae44-593943012aff"
                        accessToken={accessToken}
                        reportData={reportData}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Reports;
