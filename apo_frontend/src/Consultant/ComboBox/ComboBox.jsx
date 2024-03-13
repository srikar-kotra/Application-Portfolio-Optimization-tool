import React, { useState } from 'react';
import './ComboBox.css';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';

const ComboBoxPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedParameters, setSelectedParameters] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newParameter, setNewParameter] = useState('');

    const parametersData = [
        {
            L1_Parameter_description: "Financial & Non-financial impacts & consequences, disruption event hit a MAJOR (Financial loss of > $ 5m) impact",
            L1_Parameter_name: "Financial & Non-financial impacts",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Business data criticality",
            L1_Parameter_name: "Business data criticality",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Legislative frameworks to be complied with",
            L1_Parameter_name: "Legislative frameworks",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Classification of the data held",
            L1_Parameter_name: "Classification of data",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Application used for financial/regulatory reporting",
            L1_Parameter_name: "Application for financial/regulatory reporting",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Is the application Customer Facing",
            L1_Parameter_name: "Customer Facing application",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Number of users",
            L1_Parameter_name: "Number of users",
            Category_name: "",
        },
        {
            L1_Parameter_description: "Daily online transaction volume",
            L1_Parameter_name: "Daily online transaction volume",
            Category_name: "",
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
            Category_name: "Security Adherence",
        },
        {
            L1_Parameter_description: "Authentication Mechanism",
            L1_Parameter_name: "Authentication Mechanism",
            Category_name: "Security Adherence",
        },
        {
            L1_Parameter_description: "Included in regularly scheduled Security audits and reviews?",
            L1_Parameter_name: "Regular Security Audits",
            Category_name: "Security Adherence",
        },
        {
            L1_Parameter_description: "Security Regulatory frameworks that the application complies with?",
            L1_Parameter_name: "Compliance with Security Regulatory Frameworks",
            Category_name: "Security Adherence",
        },
        {
            L1_Parameter_description: "Data Privacy Regulatory frameworks that the application complies with?",
            L1_Parameter_name: "Compliance with Data Privacy Regulatory Frameworks",
            Category_name: "Security Adherence",
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
    const groupParametersByCategory = async (data) => {
        const groupedData = {};

        data.forEach((param) => {
            const categoryName = param.Category_name;
            const paramName = param.L1_Parameter_name;

            if (!groupedData[categoryName]) {
                groupedData[categoryName] = [];
            }

            groupedData[categoryName].push(paramName);
        });

        return Object.keys(groupedData).map((category) => ({
            name: category,
            parameters: groupedData[category],
        }));
    };

    const [categories, setCategories] = useState(groupParametersByCategory(parametersData));
    console.log(categories);



    //const groupedParameters = groupParametersByCategory(parametersData);

    //console.log(groupedParameters);


    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleParameterChange = (param) => {
        if (!selectedParameters.includes(param)) {
            setSelectedParameters([...selectedParameters, param].sort());
        }
    };

    const handleRemoveParameter = (param) => {
        setSelectedParameters(selectedParameters.filter((p) => p !== param));
    };

    const handleNewCategoryChange = (e) => {
        setNewCategory(e.target.value);
    };

    const handleNewParameterChange = (e) => {
        setNewParameter(e.target.value);
    };

    const handleAddCategory = () => {
        if (newCategory) {
            setCategories([...categories, { name: newCategory, parameters: [] }]);
            setNewCategory('');
            Swal.fire({
                icon: 'success',
                title: 'Category Added!',
                text: 'New category has been added successfully.',
            });
        }
    };

    const handleAddParameter = () => {
        if (selectedCategory && newParameter) {
            const updatedCategories = categories.map((category) =>
                category.name === selectedCategory
                    ? { ...category, parameters: [...category.parameters, newParameter].sort() }
                    : category
            );
            setCategories(updatedCategories);
            setNewParameter('');
            setSelectedParameters([...selectedParameters, newParameter].sort());
            Swal.fire({
                icon: 'success',
                title: 'Parameter Added!',
                text: 'New parameter has been added successfully.',
            });
        }
    };

    const handleMoveToSelected = () => {
        const selectedParams = categories
            .find((category) => category.name === selectedCategory)
            .parameters.filter((param) => selectedParameters.includes(param));
        setSelectedParameters([...selectedParameters, ...selectedParams]);
    };

    const handleMoveToAvailable = () => {
        const updatedSelectedParams = selectedParameters.filter(
            (param) => !categories.find((category) => category.name === selectedCategory).parameters.includes(param)
        );
        setSelectedParameters(updatedSelectedParams);
    };

    return (
        <div>
            <NavBar />
            <div className="combo-box-container container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <h4>Choose Category:</h4>
                        <select
                            className="form-control"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select a category...</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <h4 className="mt-3">Choose Parameters:</h4>
                        {selectedCategory &&
                            categories
                                .find((category) => category.name === selectedCategory)
                                .parameters.map((param, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            value={param}
                                            onChange={() => handleParameterChange(param)}
                                            checked={selectedParameters.includes(param)}
                                        />
                                        <label className="form-check-label">{param}</label>
                                    </div>
                                ))}
                        <div className="mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new category"
                                value={newCategory}
                                onChange={handleNewCategoryChange}
                            />
                            <button className="cbtn btn btn-primary mt-2" onClick={handleAddCategory}>
                                Add Category
                            </button>
                        </div>
                        <div className="mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new parameter"
                                value={newParameter}
                                onChange={handleNewParameterChange}
                                disabled={!selectedCategory}
                            />
                            <button
                                className="cbtn btn btn-primary mt-2"
                                onClick={handleAddParameter}
                                disabled={!selectedCategory}
                            >
                                Add Parameter
                            </button>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h4>Selected Categories and Parameters:</h4>
                        {selectedParameters.length === 0 ? (
                            <p>No categories and parameters selected.</p>
                        ) : (
                            categories.map((category) => (
                                <div key={category.name} className="mt-3">
                                    <h5>{category.name}</h5>
                                    <ul>
                                        {selectedParameters
                                            .filter((param) => category.parameters.includes(param))
                                            .map((param, index) => (
                                                <li key={index}>
                                                    {param}
                                                    <button
                                                        className="cbtn btn btn-link btn-sm"
                                                        onClick={() => handleRemoveParameter(param)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <button
                            className="cbtn btn btn-primary mr-2"
                            onClick={handleMoveToSelected}
                            disabled={!selectedCategory}
                        >
                            &gt;
                        </button>
                        <button
                            className="cbtn btn btn-primary"
                            onClick={handleMoveToAvailable}
                            disabled={!selectedCategory}
                        >
                            &lt;
                        </button>
                        <div className="col-md-7">
                            <h4>Selected Categories and Parameters:</h4>
                            {/* Rest of the selected categories and parameters UI */}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ComboBoxPage;
