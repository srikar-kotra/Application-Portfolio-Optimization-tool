import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import './CategoryComponent.css'; // Import the CSS file for styling

const CategoryComponent = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [leftParameters, setLeftParameters] = useState([]);
    const [rightParameters, setRightParameters] = useState([]);
    const { username, customer_id } = useParams();
    // Define an object that maps each category to its corresponding parameters
    /*const categoryParameters = {

        'Application Complexity': [
            'Outgoing Interfaces / Linkages',
            'Database Diversity',
            'Software Language Diversity',
        ],
        'Application Stability': [
            'Availability of Knowledge in Documents',
            'Concurrency of Business users',
            'Degree of Customization',
            'Average Monthly Incidents'
        ],
        'Application Maturity': [
            'Lifecycle Stage',
            'Frequency of Changes',
            'Use of Design Patterns',
            'Average Monthly Change Tickets'
        ],
        'Business Criticality': [
            'Scalability',
            'Availability',
            'User Experience'
        ],
        // Add more categories and their corresponding parameters as needed
    };*/

    const parametersData = [
        {
            L1_Parameter_description: "",
            L1_Parameter_name: "Scalability",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "",
            L1_Parameter_name: "User Experience",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "",
            L1_Parameter_name: "Availability",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Financial & Non-financial impacts & consequences, disruption event hit a MAJOR (Financial loss of > $ 5m) impact",
            L1_Parameter_name: "Financial & Non-financial impacts",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Financial & Non-financial impacts & consequences, disruption event hit a MAJOR (Financial loss of > $ 5m) impact",
            L1_Parameter_name: "Financial & Non-financial impacts",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Financial & Non-financial impacts & consequences, disruption event hit a MAJOR (Financial loss of > $ 5m) impact",
            L1_Parameter_name: "Financial & Non-financial impacts",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Business data criticality",
            L1_Parameter_name: "Business data criticality",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Legislative frameworks to be complied with",
            L1_Parameter_name: "Legislative frameworks",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Classification of the data held",
            L1_Parameter_name: "Classification of data",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Application used for financial/regulatory reporting",
            L1_Parameter_name: "Application for financial/regulatory reporting",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Is the application Customer Facing",
            L1_Parameter_name: "Customer Facing application",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Number of users",
            L1_Parameter_name: "Number of users",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Daily online transaction volume",
            L1_Parameter_name: "Daily online transaction volume",
            Category_name: "Business Criticality",
        },
        {
            L1_Parameter_description: "Lifecycle Stage of the application",
            L1_Parameter_name: "Lifecycle Stage",
            Category_name: "Application Maturity",
        },
        {
            L1_Parameter_description: "Frequency of Enhancements/Upgrades/Code Change in last 12 months",
            L1_Parameter_name: "Frequency of Changes",
            Category_name: "Application Maturity",
        },
        {
            L1_Parameter_description: "Average monthly number of change tickets for application logic changes/enhancements logged in the past 6 months",
            L1_Parameter_name: "Average Monthly Change Tickets",
            Category_name: "Application Maturity",
        },
        {
            L1_Parameter_description: "Use of Architectural / Development Design patterns or practices",
            L1_Parameter_name: "Use of Design Patterns",
            Category_name: "Application Maturity",
        },
        {
            L1_Parameter_description: "Current System Availability",
            L1_Parameter_name: "System Availability",
            Category_name: "Application Stability",
        },
        {
            L1_Parameter_description: "Frequency of Code Change due to bugs / enhancements in last 12 months",
            L1_Parameter_name: "Frequency of Code Change",
            Category_name: "Application Stability",
        },
        {
            L1_Parameter_description: "Avg. monthly number of incidents logged in past 6 months",
            L1_Parameter_name: "Average Monthly Incidents",
            Category_name: "Application Stability",
        },
        {
            L1_Parameter_description: "Degree of customization",
            L1_Parameter_name: "Degree of Customization",
            Category_name: "Application Stability",
        },
        {
            L1_Parameter_description: "Application is included in BCP/DR",
            L1_Parameter_name: "BCP/DR Inclusion",
            Category_name: "Application Stability",
        }, {
            L1_Parameter_description: "Application Interfaces / Linkages (incoming)",
            L1_Parameter_name: "Incoming Interfaces / Linkages",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Application Interfaces / Linkages (outgoing)",
            L1_Parameter_name: "Outgoing Interfaces / Linkages",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Diversity of Database(s)",
            L1_Parameter_name: "Database Diversity",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Diversity of software languages",
            L1_Parameter_name: "Software Language Diversity",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Business Rules Abstraction (eg. Hardcoded in the code)",
            L1_Parameter_name: "Business Rules Abstraction",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Code Development practices: Presence of hardcoded parameters",
            L1_Parameter_name: "Presence of Hardcoded Parameters",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Code Development practices: Comments and documentation within the code",
            L1_Parameter_name: "Code Comments and Documentation",
            Category_name: "Application Complexity",
        },
        {
            L1_Parameter_description: "Compliance with Open Standards published by recognized standards bodies (e.g., IETF, ISO, etc.)",
            L1_Parameter_name: "Compliance with Open Standards",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Use of standard data formats",
            L1_Parameter_name: "Use of Standard Data Formats",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Use of standard communication protocols",
            L1_Parameter_name: "Use of Standard Communication Protocols",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Use of standard security protocols",
            L1_Parameter_name: "Use of Standard Security Protocols",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Compliance with data-protection / data-encryption standards",
            L1_Parameter_name: "Compliance with Data-Protection Standards",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Ability to expose functionality through APIs/Service calls out of the box",
            L1_Parameter_name: "API/Service Exposure",
            Category_name: "Interoperability",
        },
        {
            L1_Parameter_description: "Close bindings to hardware",
            L1_Parameter_name: "Close Bindings to Hardware",
            Category_name: "Technology Maturity",
        },
        {
            L1_Parameter_description: "Programming Languages used (e.g. COBOL, VB 6.0, C++, Java)",
            L1_Parameter_name: "Programming Languages",
            Category_name: "Technology Maturity",
        },
        {
            L1_Parameter_description: "Middleware etc. e.g. TIBCO",
            L1_Parameter_name: "Middleware",
            Category_name: "Technology Maturity",
        },
        {
            L1_Parameter_description: "Database(s) and data storage formats in use",
            L1_Parameter_name: "Database and Data Storage",
            Category_name: "Technology Maturity",
        },
        {
            L1_Parameter_description: "Tool/software for report development (e.g. Crystal report)",
            L1_Parameter_name: "Report Development Tool",
            Category_name: "Technology Maturity",
        },
        {
            L1_Parameter_description: "Proprietary tool/software used",
            L1_Parameter_name: "Proprietary Software",
            Category_name: "Technology Maturity",
        }, {
            L1_Parameter_description: "Support for n-tier architecture (DB, middleware, apps, Web, etc.)",
            L1_Parameter_name: "n-tier Architecture Support",
            Category_name: "Digital and Microservices Readiness",
        },
        {
            L1_Parameter_description: "Ability to provide access to functionality through APIs/Service calls",
            L1_Parameter_name: "API/Service Access",
            Category_name: "Digital and Microservices Readiness",
        },
        {
            L1_Parameter_description: "Accessible through web without custom add-on",
            L1_Parameter_name: "Web Accessibility",
            Category_name: "Digital and Microservices Readiness",
        },
        {
            L1_Parameter_description: "Dependence on specific hardware/software configuration; or lock-in with specific vendor for hardware/software",
            L1_Parameter_name: "Vendor Lock-in",
            Category_name: "Digital and Microservices Readiness",
        },
        {
            L1_Parameter_description: "Support for mobility, omni-channel access",
            L1_Parameter_name: "Mobility and Omni-channel Support",
            Category_name: "Digital and Microservices Readiness",
        },
        {
            L1_Parameter_description: "Authorization Mechanism",
            L1_Parameter_name: "Authorization Mechanism",
            Category_name: "Security",
        },
        {
            L1_Parameter_description: "Authentication Mechanism",
            L1_Parameter_name: "Authentication Mechanism",
            Category_name: "Security",
        },
        {
            L1_Parameter_description: "Included in regularly scheduled Security audits and reviews?",
            L1_Parameter_name: "Regular Security Audits",
            Category_name: "Security",
        },
        {
            L1_Parameter_description: "Security Regulatory frameworks that the application complies with?",
            L1_Parameter_name: "Compliance with Security Regulatory Frameworks",
            Category_name: "Security",
        },
        {
            L1_Parameter_description: "Data Privacy Regulatory frameworks that the application complies with?",
            L1_Parameter_name: "Compliance with Data Privacy Regulatory Frameworks",
            Category_name: "Security",
        },
        {
            L1_Parameter_description: "Architecture and Design Specifications",
            L1_Parameter_name: "Architecture and Design Specifications",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Functional Specifications",
            L1_Parameter_name: "Functional Specifications",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Process Flows",
            L1_Parameter_name: "Process Flows",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Logical & Physical Data Model",
            L1_Parameter_name: "Logical & Physical Data Model",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Technical Specifications",
            L1_Parameter_name: "Technical Specifications",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Program Specifications",
            L1_Parameter_name: "Program Specifications",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Unit Test Plan/Specifications",
            L1_Parameter_name: "Unit Test Plan/Specifications",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Maintenance Procedure Manual",
            L1_Parameter_name: "Maintenance Procedure Manual",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Setup/Installation Documents/Requirements",
            L1_Parameter_name: "Setup/Installation Documents/Requirements",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Online Help / User Manual",
            L1_Parameter_name: "Online Help / User Manual",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Training Materials",
            L1_Parameter_name: "Training Materials",
            Category_name: "Knowledge",
        },
        {
            L1_Parameter_description: "Vendor Support available",
            L1_Parameter_name: "Vendor Support Availability",
            Category_name: "Technical Risk",
        },
        {
            L1_Parameter_description: "System Code Availability",
            L1_Parameter_name: "System Code Availability",
            Category_name: "Technical Risk",
        },
        {
            L1_Parameter_description: "Availability of skills required to support the system",
            L1_Parameter_name: "Skills Availability",
            Category_name: "Technical Risk",
        },
        {
            L1_Parameter_description: "Embedded knowledge or key personnel required for support / enhancement",
            L1_Parameter_name: "Embedded Knowledge",
            Category_name: "Technical Risk",
        },
        {
            L1_Parameter_description: "Support Capability rating",
            L1_Parameter_name: "Support Capability Rating",
            Category_name: "Technical Risk",
        },



    ];

    // Function to group parameters by category
    const groupParametersByCategory = (data) => {
        const groupedData = {};

        data.forEach((param) => {
            const categoryName = param.Category_name;
            const paramName = param.L1_Parameter_name;

            if (!groupedData[categoryName]) {
                groupedData[categoryName] = [];
            }

            groupedData[categoryName].push(paramName);
        });

        return groupedData;
    };

    const categoryParameters = groupParametersByCategory(parametersData);

    //console.log(categoryParameters);

    const handleSaveSelected = async () => {
        const selectedParams = {};

        // Loop through the categories and gather the selected parameters
        for (const category of categories) {
            selectedParams[category] = rightParameters.filter((param) =>
                categoryParameters[category].includes(param)
            );
        }
        console.log(selectedParams)

        try {
            // Send the selected parameters to the backend for saving
            const response = await fetch(`http://localhost:3001/save-selected-category/${customer_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedParams),
            });

            if (response.ok) {
                // Successfully saved
                console.log('Selected parameters saved successfully');
            } else {
                console.error('Error saving selected parameters');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const categories = Object.keys(categoryParameters);

    const leftArrowIcon = '<'; // Replace with your desired left arrow icon
    const rightArrowIcon = '>'; // Replace with your desired right arrow icon

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        // Fetch parameters for the selected category from the categoryParameters object
        const parameters = categoryParameters[category];
        setLeftParameters(parameters);
        setRightParameters([]);
    };

    const handleMoveToRight = (parameter) => {
        setLeftParameters(leftParameters.filter((p) => p !== parameter));
        setRightParameters([...rightParameters, parameter]);
    };

    const handleMoveToLeft = (parameter) => {
        setRightParameters(rightParameters.filter((p) => p !== parameter));
        setLeftParameters([...leftParameters, parameter]);
    };

    return (
        <div>
            <NavBar />
            <Container fluid className="category-component">
                <Row>
                    <Col className="select-column">
                        <Form.Group controlId="categorySelect" className="select-category mx-auto">
                            <Form.Label className='select-category'>Select Category from Master Data</Form.Label>
                            <Form.Control as="select" onChange={handleCategoryChange}>
                                <option value="">Select a Category</option>
                                {categories.map((category, index) => (
                                    <option className="category-option" key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                {selectedCategory && (
                    <Row className="parameter-row">
                        <Col sm={5} className="parameters-col">
                            <div className="param-heading-enclose">
                                <h4 className="param-heading">Available Parameters:</h4>
                            </div>
                            <ul>
                                {leftParameters.map((parameter, index) => (
                                    <li key={index}>
                                        {parameter}
                                        <Button variant="primary" className="param-col-button" onClick={() => handleMoveToRight(parameter)}>
                                            {rightArrowIcon}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col sm={5} className="parameters-col">
                            <div className="param-heading-enclose">
                                <h4 className="param-heading">Selected Parameters:</h4>
                            </div>
                            <ul>
                                {rightParameters.map((parameter, index) => (
                                    <li key={index}>
                                        {parameter}
                                        <Button className="param-col-button" onClick={() => handleMoveToLeft(parameter)}>
                                            {leftArrowIcon}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                )}
                {/*
                <Row>
                    <div className="all-params-container">
                        <div className="all-p-heading">
                            <h4 className="text-center">Selected Parameters by the Consultant</h4>
                        </div>
                        <ul className="all-params">
                           
                            {rightParameters.map((parameter, index) => (
                                <li className="all-params-list" key={index}>
                                    {parameter}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Row>
            */}
                <Row>
                    <div className="text-center">
                        <Button variant="success" onClick={handleSaveSelected}>
                            Save Selected
                        </Button>
                    </div>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default CategoryComponent;
