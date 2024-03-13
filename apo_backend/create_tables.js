import mysql from "mysql";
import crypto from "crypto";
import fs from "fs";


//----------------------------------------------------------------------------
// Database Connection
//----------------------------------------------------------------------------

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "hello123",
    database: "APO_TEST_DATA_MODEL",
    port: 3306,
    //ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") },
    //setTimeout: 60000
}

export const pool = mysql.createPool(dbConfig);

// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err.message);
    } else {
        console.log("Connection established with MySQL database!");
        connection.release();
    }
});

//----------------------------------------------------------------------------
// Function to create the 'user' table
//----------------------------------------------------------------------------

export const createUserTable = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
            User_id INT PRIMARY KEY AUTO_INCREMENT,
            user_password VARCHAR(255) NOT NULL,
            User_Role VARCHAR(255) NOT NULL,
            Username VARCHAR(255) NOT NULL
        )
    `;

    pool.query(createTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'user' table:", err.message);
        } else {
            console.log("Table 'user' created successfully!");
        }
    });
};

//----------------------------------------------------------------------------
// Function to create the 'Category_Central' table
//----------------------------------------------------------------------------

export const createCategoryCentralTable = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Category_Central (
            Category_Central_id INT PRIMARY KEY AUTO_INCREMENT,
            category_name VARCHAR(255) NOT NULL,
            Description VARCHAR(255),
            Category_Creation_date DATE
        )
    `;

    pool.query(createTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Category_Central' table:", err.message);
        } else {
            console.log("Table 'Category_Central' created successfully!");
        }
    });
};

//----------------------------------------------------------------------------
// Function to create the Central Database tables
//----------------------------------------------------------------------------

export const createCentralTables = () => {
    const createL1ParametersCentralTableQuery = `
        CREATE TABLE IF NOT EXISTS L1_Parameters_Central (
            L1_Parameter_Central_id INT PRIMARY KEY AUTO_INCREMENT,
            L1_Parameter_description VARCHAR(255),
            L1_Parameter_name VARCHAR(255),
            Category_Central_id INT,
            L1_Parameters_Creation_date DATE,
            FOREIGN KEY (Category_Central_id) REFERENCES Category_Central(Category_Central_id)
        )
    `;

    const createValuesCentralTableQuery = `
        CREATE TABLE IF NOT EXISTS Values_Central (
            Parameter_Central_id INT,
            Values_id INT PRIMARY KEY AUTO_INCREMENT,
            Value_name VARCHAR(255),
            Default_score FLOAT,
            FOREIGN KEY (Parameter_Central_id) REFERENCES L1_Parameters_Central(L1_Parameter_Central_id)
        )
    `;

    const createL2ParametersCentralTableQuery = `
        CREATE TABLE IF NOT EXISTS L2_Parameters_Central (
            L2_Parameter_Central_id INT PRIMARY KEY AUTO_INCREMENT,
            L2_Parameter_description VARCHAR(255),
            L2_Parameter_name VARCHAR(255),
            L1_Parameter_Central_id INT,
            L2_Creation_date DATE,
            FOREIGN KEY (L1_Parameter_Central_id) REFERENCES L1_Parameters_Central(L1_Parameter_Central_id)
        )
    `;

    const createL3ParametersCentralTableQuery = `
        CREATE TABLE IF NOT EXISTS L3_Parameters_Central (
            L3_Parameter_Central_id INT PRIMARY KEY AUTO_INCREMENT,
            L3_Parameter_description VARCHAR(255),
            L3_Parameter_name VARCHAR(255),
            L2_Parameter_Central_id INT,
            L3_Creation_date DATE,
            FOREIGN KEY (L2_Parameter_Central_id) REFERENCES L2_Parameters_Central(L2_Parameter_Central_id)
        )
    `;

    pool.query(createL1ParametersCentralTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'L1_Parameters_Central' table:", err.message);
        } else {
            console.log("Table 'L1_Parameters_Central' created successfully!");
        }
    });

    pool.query(createValuesCentralTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Values_Central' table:", err.message);
        } else {
            console.log("Table 'Values_Central' created successfully!");
        }
    });

    pool.query(createL2ParametersCentralTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'L2_Parameters_Central' table:", err.message);
        } else {
            console.log("Table 'L2_Parameters_Central' created successfully!");
        }
    });

    pool.query(createL3ParametersCentralTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'L3_Parameters_Central' table:", err.message);
        } else {
            console.log("Table 'L3_Parameters_Central' created successfully!");
        }
    });
};

//----------------------------------------------------------------------------
// Function to create the Customer Instance tables
//----------------------------------------------------------------------------

export const createInstanceTables = () => {
    // Create Engagement_Instance table
    const createEngagementInstanceTableQuery = `
        CREATE TABLE IF NOT EXISTS Engagement_Instance (
            Engagement_Instance_id INT PRIMARY KEY AUTO_INCREMENT,
            Repository_id INT,
            Category_Central_id INT,
            Standard_Weightage FLOAT,
            Customer_id INT,
            FOREIGN KEY (Repository_id) REFERENCES Repository_Files(Repository_File_id),
            FOREIGN KEY (Category_Central_id) REFERENCES Category_Central(Category_Central_id),
            FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
        )
    `;

    // Create Customer table
    const createCustomerTableQuery = `
        CREATE TABLE IF NOT EXISTS Customer (
            Customer_id INT PRIMARY KEY AUTO_INCREMENT,
            Customer_name VARCHAR(255),
            Password VARCHAR(255),
            User_id INT,
            FOREIGN KEY (User_id) REFERENCES User(User_id)
        )
    `;

    // Create SOW table
    const createSOWTableQuery = `
        CREATE TABLE IF NOT EXISTS SOW (
            SOW_id INT PRIMARY KEY AUTO_INCREMENT,
            SOW_Date DATE,
            Customer_id INT,
            FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
        )
    `;

    // Create Repository_Files table
    const createRepositoryFilesTableQuery = `
        CREATE TABLE IF NOT EXISTS Repository_Files (
            Repository_File_id INT PRIMARY KEY AUTO_INCREMENT,
            Creation_date DATE,
            Customer_id INT,
            Repository_file_name VARCHAR(255),
            File_Blob LONGBLOB, -- Add the File_Blob column to store the BLOB data
            FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
        )
    `;

    // Create Selected_Finalized_Parameters table
    const createSelectedFinalizedParametersTableQuery = `
        CREATE TABLE IF NOT EXISTS Selected_Finalized_Parameters (
            Selected_Finalized_Parameter_id INT PRIMARY KEY AUTO_INCREMENT,
            Engagement_Instance_id INT,
            Parameter_Central_id INT,
            FOREIGN KEY (Engagement_Instance_id) REFERENCES Engagement_Instance(Engagement_Instance_id),
            FOREIGN KEY (Parameter_Central_id) REFERENCES L1_Parameters_Central(L1_Parameter_Central_id)
        )
    `;

    // Create Normalized_Benchmark_Weightage table
    const createNormalizedBenchmarkWeightageTableQuery = `
        CREATE TABLE IF NOT EXISTS Normalized_Benchmark_Weightage (
            Normalized_Benchmark_Weightage_id INT PRIMARY KEY AUTO_INCREMENT,
            Created_Date DATE,
            Normalized_Benchmark_Weightage_value INT,
            Selected_parameters_id INT,
            FOREIGN KEY (Selected_parameters_id) REFERENCES Selected_Finalized_Parameters(Selected_Finalized_Parameter_id)
        )
    `;

    // Create Engagement_Application_Table table
    const createEngagementApplicationTableQuery = `
        CREATE TABLE IF NOT EXISTS Engagement_Application_Table (
            Engagement_Application_id INT PRIMARY KEY AUTO_INCREMENT,
            Customer_id INT,
            FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
        )
    `;

    // Create Application_parameter_mapping_view table
    const createApplicationParameterMappingViewTableQuery = `
        CREATE TABLE IF NOT EXISTS Application_parameter_mapping_view (
            Parameter_id INT PRIMARY KEY AUTO_INCREMENT,
            Values_id INT,
            Engagement_Application_id INT,
            FOREIGN KEY (Values_id) REFERENCES Values_Central(Values_id),
            FOREIGN KEY (Engagement_Application_id) REFERENCES Engagement_Application_Table(Engagement_Application_id)
        )
    `;

    pool.query(createEngagementInstanceTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Engagement_Instance' table:", err.message);
        } else {
            console.log("Table 'Engagement_Instance' created successfully!");
        }
    });

    pool.query(createCustomerTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Customer' table:", err.message);
        } else {
            console.log("Table 'Customer' created successfully!");
        }
    });

    pool.query(createSOWTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'SOW' table:", err.message);
        } else {
            console.log("Table 'SOW' created successfully!");
        }
    });

    pool.query(createRepositoryFilesTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Repository_Files' table:", err.message);
        } else {
            console.log("Table 'Repository_Files' created successfully!");
        }
    });

    pool.query(createSelectedFinalizedParametersTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Selected_Finalized_Parameters' table:", err.message);
        } else {
            console.log("Table 'Selected_Finalized_Parameters' created successfully!");
        }
    });

    pool.query(createNormalizedBenchmarkWeightageTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Normalized_Benchmark_Weightage' table:", err.message);
        } else {
            console.log("Table 'Normalized_Benchmark_Weightage' created successfully!");
        }
    });

    pool.query(createEngagementApplicationTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Engagement_Application_Table' table:", err.message);
        } else {
            console.log("Table 'Engagement_Application_Table' created successfully!");
        }
    });

    pool.query(createApplicationParameterMappingViewTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating 'Application_parameter_mapping_view' table:", err.message);
        } else {
            console.log("Table 'Application_parameter_mapping_view' created successfully!");
        }
    });
};

export const createAllTables = () => {
    createUserTable()
    createCategoryCentralTable()
    createCentralTables()
    createInstanceTables()
}

//----------------------------------------------------------------------------

// JSON data with categories as an array
const categoriesData = [
    { name: "Business Criticality" },
    { name: "Application Stability" },
    { name: "Application Complexity" },
    { name: "Application Maturity" },
    { name: "Interoperability" },
    { name: "Technology Maturity/Debt" },
    { name: "Digital and Microservices Readiness" },
    { name: "Security Adherence" },
    { name: "Knowledge Repository Repository" },
    { name: "Technical Risk" },
];

// Function to get the creation date in the desired format
const getCreationDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const creationDate = `${year}-${month}-${day}`;
    return creationDate;
};

// Function to modify JSON data and add creation date to each category
const addCreationDateToCategories = (data) => {
    const modifiedData = data.map((category) => {
        return { ...category, Category_Creation_date: getCreationDate() };
    });

    return modifiedData;
};

// Insert the data into the Category_Central table
export const insertCategoriesIntoTable = (data) => {
    const query = "INSERT INTO Category_Central (category_name, Category_Creation_date) VALUES ?";
    const values = data.map((category) => [category.name, category.Category_Creation_date]);

    pool.query(query, [values], (err, result) => {
        if (err) {
            console.error("Error inserting data into 'Category_Central' table:", err.message);
        } else {
            console.log("Data inserted into 'Category_Central' table successfully!");
        }
    });
};

// Call the function to add creation date to each category
export const categoriesWithCreationDate = addCreationDateToCategories(categoriesData);

// JSON data with parameters as an array
export const parametersData = [
    {
        L1_Parameter_description: "",
        L1_Parameter_name: "Physical Resources Management",
        Category_name: "Infrastructure",
    },
    {
        L1_Parameter_description: "",
        L1_Parameter_name: "End Of Life",
        Category_name: "Infrastructure",
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
        L1_Parameter_name: "Use of Standard Security Adherence Protocols",
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
        Category_name: "Technology Maturity/Debt",
    },
    {
        L1_Parameter_description: "Programming Languages used (e.g. COBOL, VB 6.0, C++, Java)",
        L1_Parameter_name: "Programming Languages",
        Category_name: "Technology Maturity/Debt",
    },
    {
        L1_Parameter_description: "Middleware etc. e.g. TIBCO",
        L1_Parameter_name: "Middleware",
        Category_name: "Technology Maturity/Debt",
    },
    {
        L1_Parameter_description: "Database(s) and data storage formats in use",
        L1_Parameter_name: "Database and Data Storage",
        Category_name: "Technology Maturity/Debt",
    },
    {
        L1_Parameter_description: "Tool/software for report development (e.g. Crystal report)",
        L1_Parameter_name: "Report Development Tool",
        Category_name: "Technology Maturity/Debt",
    },
    {
        L1_Parameter_description: "Proprietary tool/software used",
        L1_Parameter_name: "Proprietary Software",
        Category_name: "Technology Maturity/Debt",
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
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Functional Specifications",
        L1_Parameter_name: "Functional Specifications",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Process Flows",
        L1_Parameter_name: "Process Flows",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Logical & Physical Data Model",
        L1_Parameter_name: "Logical & Physical Data Model",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Technical Specifications",
        L1_Parameter_name: "Technical Specifications",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Program Specifications",
        L1_Parameter_name: "Program Specifications",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Unit Test Plan/Specifications",
        L1_Parameter_name: "Unit Test Plan/Specifications",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Maintenance Procedure Manual",
        L1_Parameter_name: "Maintenance Procedure Manual",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Setup/Installation Documents/Requirements",
        L1_Parameter_name: "Setup/Installation Documents/Requirements",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Online Help / User Manual",
        L1_Parameter_name: "Online Help / User Manual",
        Category_name: "Knowledge Repository",
    },
    {
        L1_Parameter_description: "Training Materials",
        L1_Parameter_name: "Training Materials",
        Category_name: "Knowledge Repository",
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
        L1_Parameter_name: "Embedded Knowledge Repository",
        Category_name: "Technical Risk",
    },
    {
        L1_Parameter_description: "Support Capability rating",
        L1_Parameter_name: "Support Capability Rating",
        Category_name: "Technical Risk",
    },
];


// Function to insert the data into the L1_Parameters_Central table
const insertParametersIntoTable = async (data) => {
    const getCategoryCentralIdQuery = "SELECT Category_Central_id FROM Category_Central WHERE category_name = ?";

    const insertParameterQuery =
        "INSERT INTO L1_Parameters_Central (L1_Parameter_description, L1_Parameter_name, Category_Central_id) VALUES ?";

    const parameterValues = [];

    data.forEach((parameter) => {
        pool.query(getCategoryCentralIdQuery, [parameter.Category_name], (err, result) => {
            if (err) {
                console.error("Error fetching 'Category_Central_id' from 'Category_Central' table:", err.message);
            } else {
                if (result.length > 0) {
                    const categoryId = result[0].Category_Central_id;
                    parameterValues.push([parameter.L1_Parameter_description, parameter.L1_Parameter_name, categoryId]);
                    if (parameterValues.length === data.length) {
                        // All data retrieved, now insert into L1_Parameters_Central table
                        pool.query(insertParameterQuery, [parameterValues], (err, result) => {
                            if (err) {
                                console.error("Error inserting data into 'L1_Parameters_Central' table:", err.message);
                            } else {
                                console.log("Data inserted into 'L1_Parameters_Central' table successfully!");
                            }
                        });
                    }
                } else {
                    console.error(`Category '${parameter.Category_name}' not found in 'Category_Central' table.`);
                }
            }
        });
    });
};


//----------------------------------------------------------------------------
// Function to insert the data into the Values_Central table
//----------------------------------------------------------------------------
// JSON data with values and scores for "Financial & Non-financial impacts & consequences"
export const valuesData = [
    //infrastructure
    {
        Parameter_name: "Physical Resources Management",
        Value_name: "low",
        Default_score: 1,
    },
    {
        Parameter_name: "Physical Resources Management",
        Value_name: "medium",
        Default_score: 3,
    },
    {
        Parameter_name: "Physical Resources Management",
        Value_name: "high",
        Default_score: 5,
    },
    {
        Parameter_name: "End Of Life",
        Value_name: "low",
        Default_score: 1,
    },
    {
        Parameter_name: "End Of Life",
        Value_name: "medium",
        Default_score: 3,
    },
    {
        Parameter_name: "End Of Life",
        Value_name: "high",
        Default_score: 5,
    },
    // Financial & Non-financial impacts & consequences
    {
        Parameter_name: "Financial & Non-financial impacts",
        Value_name: "0 - 6 hours (Intra-Day)",
        Default_score: 5,
    },
    {
        Parameter_name: "Financial & Non-financial impacts",
        Value_name: "7 - 12 hours (Inter-Day)",
        Default_score: 4,
    },
    {
        Parameter_name: "Financial & Non-financial impacts",
        Value_name: "13 - 24 hours (Start of Day Tomorrow)",
        Default_score: 3,
    },
    {
        Parameter_name: "Financial & Non-financial impacts",
        Value_name: "25 - 72 Hours (This Week)",
        Default_score: 2,
    },
    {
        Parameter_name: "Financial & Non-financial impacts",
        Value_name: "3 - 5 days + (End of Week)",
        Default_score: 1,
    },
    // Business data criticality
    {
        Parameter_name: "Business data criticality",
        Value_name: "Data stored is critical to the business and loss could stop revenue and pose major financial/legal cost",
        Default_score: 5,
    },
    {
        Parameter_name: "Business data criticality",
        Value_name: "Data stored is core to the business and loss of this data could involve a cost to carry out the business operation",
        Default_score: 4,
    },
    {
        Parameter_name: "Business data criticality",
        Value_name: "Data stored is not critical to day-to-day operations, but are important for smooth business operation",
        Default_score: 3,
    },
    {
        Parameter_name: "Business data criticality",
        Value_name: "Data stored is not at all critical to business",
        Default_score: 2,
    },
    {
        Parameter_name: "Business data criticality",
        Value_name: "NA - Data not available",
        Default_score: 1,
    },
    // Legislative frameworks
    {
        Parameter_name: "Legislative frameworks",
        Value_name: "2 and above",
        Default_score: 5,
    },
    {
        Parameter_name: "Legislative frameworks",
        Value_name: "1",
        Default_score: 4,
    },
    {
        Parameter_name: "Legislative frameworks",
        Value_name: "Not Applicable",
        Default_score: 1,
    },
    // Classification of data
    {
        Parameter_name: "Classification of data",
        Value_name: "Not Critical",
        Default_score: 1,
    },
    {
        Parameter_name: "Classification of data",
        Value_name: "Public",
        Default_score: 2,
    },
    {
        Parameter_name: "Classification of data",
        Value_name: "Private",
        Default_score: 3,
    },
    {
        Parameter_name: "Classification of data",
        Value_name: "Confidential",
        Default_score: 4,
    },
    {
        Parameter_name: "Classification of data",
        Value_name: "Highly Confidential",
        Default_score: 5,
    },
    // Application for financial/regulatory reporting
    {
        Parameter_name: "Application for financial/regulatory reporting",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Application for financial/regulatory reporting",
        Value_name: "No",
        Default_score: 1,
    },
    // Customer Facing application
    {
        Parameter_name: "Customer Facing application",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Customer Facing application",
        Value_name: "No",
        Default_score: 1,
    },
    // Number of users
    {
        Parameter_name: "Number of users",
        Value_name: "Greater than 1000",
        Default_score: 5,
    },
    {
        Parameter_name: "Number of users",
        Value_name: "500 to 1000",
        Default_score: 4,
    },
    {
        Parameter_name: "Number of users",
        Value_name: "100 to 500",
        Default_score: 3,
    },
    {
        Parameter_name: "Number of users",
        Value_name: "50 to 100",
        Default_score: 2,
    },
    {
        Parameter_name: "Number of users",
        Value_name: "Less than 50",
        Default_score: 1,
    },
    // Daily online transaction volume
    {
        Parameter_name: "Daily online transaction volume",
        Value_name: "<1000",
        Default_score: 1,
    },
    {
        Parameter_name: "Daily online transaction volume",
        Value_name: "1,000-5,000",
        Default_score: 2,
    },
    {
        Parameter_name: "Daily online transaction volume",
        Value_name: "5,000-10,000",
        Default_score: 3,
    },
    {
        Parameter_name: "Daily online transaction volume",
        Value_name: "10,000-20,000",
        Default_score: 4,
    },
    {
        Parameter_name: "Daily online transaction volume",
        Value_name: "greater than 20,000",
        Default_score: 5,
    },
    // System Availability
    {
        Parameter_name: "System Availability",
        Value_name: "<90%",
        Default_score: 1,
    },
    {
        Parameter_name: "System Availability",
        Value_name: ">= 90%",
        Default_score: 2,
    },
    {
        Parameter_name: "System Availability",
        Value_name: "> 92%-95%",
        Default_score: 3,
    },
    {
        Parameter_name: "System Availability",
        Value_name: "> 98%",
        Default_score: 4,
    },
    {
        Parameter_name: "System Availability",
        Value_name: "> 99%",
        Default_score: 5,
    },
    // Frequency of Changes
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to bugs / enhancements in the last 12 months",
        Default_score: 5,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to bugs / enhancements in the last 6 months",
        Default_score: 4,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to bugs / enhancements in the last 3 months",
        Default_score: 3,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to bugs / enhancements in the last 1 month",
        Default_score: 2,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "Frequent code change due to recurring problems",
        Default_score: 1,
    },
    // Average Monthly Incidents
    {
        Parameter_name: "Average Monthly Incidents",
        Value_name: "Above 15",
        Default_score: 2,
    },
    {
        Parameter_name: "Average Monthly Incidents",
        Value_name: "15 to 10",
        Default_score: 3,
    },
    {
        Parameter_name: "Average Monthly Incidents",
        Value_name: "10 to 5",
        Default_score: 4,
    },
    {
        Parameter_name: "Average Monthly Incidents",
        Value_name: "0 to 5",
        Default_score: 5,
    },
    // Degree of Customization
    {
        Parameter_name: "Degree of Customization",
        Value_name: "High - core functionality customized",
        Default_score: 1,
    },
    {
        Parameter_name: "Degree of Customization",
        Value_name: "Medium - Reports, non-core functionality, interfaces, etc.",
        Default_score: 3,
    },
    {
        Parameter_name: "Degree of Customization",
        Value_name: "Low - only custom reports",
        Default_score: 5,
    },
    // BCP/DR Inclusion
    {
        Parameter_name: "BCP/DR Inclusion",
        Value_name: "No",
        Default_score: 1,
    },
    {
        Parameter_name: "BCP/DR Inclusion",
        Value_name: "Yes - Manual Backup / Restore",
        Default_score: 2,
    },
    {
        Parameter_name: "BCP/DR Inclusion",
        Value_name: "Yes - Partial Automatic Backup / Restore",
        Default_score: 3,
    },
    {
        Parameter_name: "BCP/DR Inclusion",
        Value_name: "Yes - Scheduled Backup, Automatic Restore",
        Default_score: 4,
    },
    {
        Parameter_name: "BCP/DR Inclusion",
        Value_name: "Yes - Scheduled Backup, Automatic Restore & switch-over",
        Default_score: 5,
    },
    // Incoming Interfaces / Linkages
    {
        Parameter_name: "Incoming Interfaces / Linkages",
        Value_name: "No incoming/outgoing linkages",
        Default_score: 1,
    },
    {
        Parameter_name: "Incoming Interfaces / Linkages",
        Value_name: "Low number of incoming/outgoing linkages (< 5)",
        Default_score: 2,
    },
    {
        Parameter_name: "Incoming Interfaces / Linkages",
        Value_name: "Medium number of incoming/outgoing linkages (5-10)",
        Default_score: 3,
    },
    {
        Parameter_name: "Incoming Interfaces / Linkages",
        Value_name: "Medium / High number of incoming/outgoing linkages (10-15)",
        Default_score: 4,
    },
    {
        Parameter_name: "Incoming Interfaces / Linkages",
        Value_name: "High number of incoming/outgoing linkages (> 20)",
        Default_score: 5,
    },
    // Outgoing Interfaces / Linkages
    {
        Parameter_name: "Outgoing Interfaces / Linkages",
        Value_name: "No incoming/outgoing linkages",
        Default_score: 1,
    },
    {
        Parameter_name: "Outgoing Interfaces / Linkages",
        Value_name: "Low number of incoming/outgoing linkages (< 5)",
        Default_score: 2,
    },
    {
        Parameter_name: "Outgoing Interfaces / Linkages",
        Value_name: "Medium number of incoming/outgoing linkages (5-10)",
        Default_score: 3,
    },
    {
        Parameter_name: "Outgoing Interfaces / Linkages",
        Value_name: "Medium / High number of incoming/outgoing linkages (10-15)",
        Default_score: 4,
    },
    {
        Parameter_name: "Outgoing Interfaces / Linkages",
        Value_name: "High number of incoming/outgoing linkages (> 20)",
        Default_score: 5,
    },
    // Database Diversity
    {
        Parameter_name: "Database Diversity",
        Value_name: ">95% data stored in single database type",
        Default_score: 1,
    },
    {
        Parameter_name: "Database Diversity",
        Value_name: "Two dominant database types used",
        Default_score: 2,
    },
    {
        Parameter_name: "Database Diversity",
        Value_name: "Three dominant databases types used",
        Default_score: 3,
    },
    {
        Parameter_name: "Database Diversity",
        Value_name: "Four databases types used",
        Default_score: 4,
    },
    {
        Parameter_name: "Database Diversity",
        Value_name: "More than 4 database types used",
        Default_score: 5,
    },
    // Software Language Diversity
    {
        Parameter_name: "Software Language Diversity",
        Value_name: ">95% development in single language/technology",
        Default_score: 1,
    },
    {
        Parameter_name: "Software Language Diversity",
        Value_name: "2-3 dominant languages/technologies used",
        Default_score: 2,
    },
    {
        Parameter_name: "Software Language Diversity",
        Value_name: "3-5 dominant languages/technologies  used",
        Default_score: 3,
    },
    {
        Parameter_name: "Software Language Diversity",
        Value_name: "5-10 languages/technologies  used",
        Default_score: 4,
    },
    {
        Parameter_name: "Software Language Diversity",
        Value_name: "<10 languages/technologies  used",
        Default_score: 5,
    },
    // Business Rules Abstraction
    {
        Parameter_name: "Business Rules Abstraction",
        Value_name: "Business logic coded with application logic in adhoc manner",
        Default_score: 1,
    },
    {
        Parameter_name: "Business Rules Abstraction",
        Value_name: "Business logic closely coupled with Application logic; structured access-points",
        Default_score: 3,
    },
    {
        Parameter_name: "Business Rules Abstraction",
        Value_name: "Business Rules fully abstracted from Application",
        Default_score: 5,
    },
    // Presence of Hardcoded Parameters
    {
        Parameter_name: "Presence of Hardcoded Parameters",
        Value_name: "None",
        Default_score: 1,
    },
    {
        Parameter_name: "Presence of Hardcoded Parameters",
        Value_name: "Only configuration data hard-coded",
        Default_score: 2,
    },
    {
        Parameter_name: "Presence of Hardcoded Parameters",
        Value_name: "Configuration data, input data",
        Default_score: 3,
    },
    {
        Parameter_name: "Presence of Hardcoded Parameters",
        Value_name: "Configuration data, input data, workflow control data",
        Default_score: 5,
    },
    // Code Comments and Documentation
    {
        Parameter_name: "Code Comments and Documentation",
        Value_name: "Not practiced; no comments exist",
        Default_score: 1,
    },
    {
        Parameter_name: "Code Comments and Documentation",
        Value_name: "Comments on high-level logic only",
        Default_score: 2,
    },
    {
        Parameter_name: "Code Comments and Documentation",
        Value_name: "Comments on control flow",
        Default_score: 3,
    },
    {
        Parameter_name: "Code Comments and Documentation",
        Value_name: "Comments on detailed logic and control flow",
        Default_score: 4,
    },
    {
        Parameter_name: "Code Comments and Documentation",
        Value_name: "Detailed inline comments; part of review cycle",
        Default_score: 5,
    },
    // Lifecycle Stage
    {
        Parameter_name: "Lifecycle Stage",
        Value_name: "Initial Development",
        Default_score: 1,
    },
    {
        Parameter_name: "Lifecycle Stage",
        Value_name: "Enhancement",
        Default_score: 2,
    },
    {
        Parameter_name: "Lifecycle Stage",
        Value_name: "Steady State",
        Default_score: 3,
    },
    {
        Parameter_name: "Lifecycle Stage",
        Value_name: "Maintenance",
        Default_score: 4,
    },
    {
        Parameter_name: "Lifecycle Stage",
        Value_name: "Review",
        Default_score: 5,
    },
    // Frequency of Changes
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "Frequent code change due to recurring problems",
        Default_score: 1,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to Problems/CR/Changes in the last 1 month",
        Default_score: 2,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to Problems/CR/Changes in the last 3 months",
        Default_score: 3,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to Problems/CR/Changes in the last 6 months",
        Default_score: 4,
    },
    {
        Parameter_name: "Frequency of Changes",
        Value_name: "No code changes due to CR/Changes in the last 12",
        Default_score: 5,
    },
    // Average Monthly Change Tickets
    {
        Parameter_name: "Average Monthly Change Tickets",
        Value_name: "<5",
        Default_score: 5,
    },
    {
        Parameter_name: "Average Monthly Change Tickets",
        Value_name: "5 to 10",
        Default_score: 4,
    },
    {
        Parameter_name: "Average Monthly Change Tickets",
        Value_name: "10 to 15",
        Default_score: 3,
    },
    {
        Parameter_name: "Average Monthly Change Tickets",
        Value_name: "15 to 20",
        Default_score: 2,
    },
    {
        Parameter_name: "Average Monthly Change Tickets",
        Value_name: ">25",
        Default_score: 1,
    },
    // Use of Design Patterns
    {
        Parameter_name: "Use of Design Patterns",
        Value_name: "None",
        Default_score: 1,
    },
    {
        Parameter_name: "Use of Design Patterns",
        Value_name: "Yes - followed for initial version, not updated",
        Default_score: 3,
    },
    {
        Parameter_name: "Use of Design Patterns",
        Value_name: "Yes - updated",
        Default_score: 5,
    },
    // Compliance with Open Standards
    {
        Parameter_name: "Compliance with Open Standards",
        Value_name: "No",
        Default_score: 1,
    },
    {
        Parameter_name: "Compliance with Open Standards",
        Value_name: "Yes - largely Open Standards, with custom add-ons and tweaks",
        Default_score: 3,
    },
    {
        Parameter_name: "Compliance with Open Standards",
        Value_name: "Yes - fully compliant with out-of-box Open Standards",
        Default_score: 5,
    },
    // Use of Standard Data Formats
    {
        Parameter_name: "Use of Standard Data Formats",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Use of Standard Data Formats",
        Value_name: "No",
        Default_score: 1,
    },
    // Use of Standard Communication Protocols
    {
        Parameter_name: "Use of Standard Communication Protocols",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Use of Standard Communication Protocols",
        Value_name: "No",
        Default_score: 1,
    },
    // Use of Standard Security Protocols
    {
        Parameter_name: "Use of Standard Security Protocols",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Use of Standard Security Protocols",
        Value_name: "No",
        Default_score: 1,
    },
    // Compliance with Data-Protection Standards
    {
        Parameter_name: "Compliance with Data-Protection Standards",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Compliance with Data-Protection Standards",
        Value_name: "No",
        Default_score: 1,
    },
    // API/Service Exposure
    {
        Parameter_name: "API/Service Exposure",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "API/Service Exposure",
        Value_name: "No",
        Default_score: 1,
    },
    // Close Bindings to Hardware
    {
        Parameter_name: "Close Bindings to Hardware",
        Value_name: "None - Cloud Based/virtualizable",
        Default_score: 5,
    },
    {
        Parameter_name: "Close Bindings to Hardware",
        Value_name: "Bound to (specific) DB",
        Default_score: 4,
    },
    {
        Parameter_name: "Close Bindings to Hardware",
        Value_name: "Bound to (specific) OS",
        Default_score: 3,
    },
    {
        Parameter_name: "Close Bindings to Hardware",
        Value_name: "Bound to (specific) Hardware",
        Default_score: 2,
    },
    {
        Parameter_name: "Close Bindings to Hardware",
        Value_name: "Bound to (specific) Hardware/OS/DB/3rd Party software",
        Default_score: 1,
    },
    // Programming Languages
    {
        Parameter_name: "Programming Languages",
        Value_name: "2nd GL (Assembly)",
        Default_score: 1,
    },
    {
        Parameter_name: "Programming Languages",
        Value_name: "early 3GL (Fortran, ALGOL, COBOL)",
        Default_score: 2,
    },
    {
        Parameter_name: "Programming Languages",
        Value_name: "3GL (C, C++, C#, Java, BASIC, Pascal)",
        Default_score: 3,
    },
    {
        Parameter_name: "Programming Languages",
        Value_name: "4GL (SQL/PL, LISP, ADA)",
        Default_score: 4,
    },
    {
        Parameter_name: "Programming Languages",
        Value_name: "5GL (Python, Ruby)",
        Default_score: 5,
    },
    // Middleware
    {
        Parameter_name: "Middleware",
        Value_name: "Cloud Based (APIs/Services oriented)",
        Default_score: 5,
    },
    {
        Parameter_name: "Middleware",
        Value_name: "MQ Series",
        Default_score: 3,
    },
    {
        Parameter_name: "Middleware",
        Value_name: "Flat-files/directory-based data-integration",
        Default_score: 1,
    },
    // Database and Data Storage
    {
        Parameter_name: "Database and Data Storage",
        Value_name: "Flat-files+SQL+NoSQL",
        Default_score: 5,
    },
    {
        Parameter_name: "Database and Data Storage",
        Value_name: "Flat-files+SQL",
        Default_score: 3,
    },
    {
        Parameter_name: "Database and Data Storage",
        Value_name: "Flat-files",
        Default_score: 1,
    },
    // Report Development Tool
    {
        Parameter_name: "Report Development Tool",
        Value_name: "Cloud Based",
        Default_score: 5,
    },
    {
        Parameter_name: "Report Development Tool",
        Value_name: "Business Objects",
        Default_score: 3,
    },
    {
        Parameter_name: "Report Development Tool",
        Value_name: "Custom PL/SQL",
        Default_score: 1,
    },
    {
        Parameter_name: "Report Development Tool",
        Value_name: "MS Excel / VBA",
        Default_score: 2,
    },
    {
        Parameter_name: "Report Development Tool",
        Value_name: "COTS Reporting software (Discoverer, Temenos, etc.)",
        Default_score: 4,
    },
    // Proprietary Software
    {
        Parameter_name: "Proprietary Software",
        Value_name: "Yes",
        Default_score: 1,
    },
    {
        Parameter_name: "Proprietary Software",
        Value_name: "No",
        Default_score: 5,
    },
    // n-tier Architecture Support
    {
        Parameter_name: "n-tier Architecture Support",
        Value_name: "monolith (non-tiered) architecture",
        Default_score: 1,
    },
    {
        Parameter_name: "n-tier Architecture Support",
        Value_name: "2-tier",
        Default_score: 2,
    },
    {
        Parameter_name: "n-tier Architecture Support",
        Value_name: "3-tier (or more)",
        Default_score: 3,
    },
    {
        Parameter_name: "n-tier Architecture Support",
        Value_name: "N-tier architecture",
        Default_score: 5,
    },
    // API/Service Access
    {
        Parameter_name: "API/Service Access",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "API/Service Access",
        Value_name: "No",
        Default_score: 1,
    },
    // Web Accessibility
    {
        Parameter_name: "Web Accessibility",
        Value_name: "Yes (through all popular browsers)",
        Default_score: 5,
    },
    {
        Parameter_name: "Web Accessibility",
        Value_name: "Yes (Only few browser through custom app)",
        Default_score: 3,
    },
    {
        Parameter_name: "Web Accessibility",
        Value_name: "No (custom app needed)",
        Default_score: 1,
    },
    // Vendor Lock-in
    {
        Parameter_name: "Vendor Lock-in",
        Value_name: "Yes",
        Default_score: 1,
    },
    {
        Parameter_name: "Vendor Lock-in",
        Value_name: "No",
        Default_score: 5,
    },
    // Mobility and Omni-channel Support
    {
        Parameter_name: "Mobility and Omni-channel Support",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Mobility and Omni-channel Support",
        Value_name: "No",
        Default_score: 1,
    },
    // Authorization Mechanism
    {
        Parameter_name: "Authorization Mechanism",
        Value_name: "User based privileges",
        Default_score: 1,
    },
    {
        Parameter_name: "Authorization Mechanism",
        Value_name: "User role based privileges",
        Default_score: 2,
    },
    {
        Parameter_name: "Authorization Mechanism",
        Value_name: "User role and session based privileges",
        Default_score: 3,
    },
    {
        Parameter_name: "Authorization Mechanism",
        Value_name: "Built-in workflow mechanism",
        Default_score: 4,
    },
    // Authentication Mechanism
    {
        Parameter_name: "Authentication Mechanism",
        Value_name: "Two level authentication",
        Default_score: 2,
    },
    {
        Parameter_name: "Authentication Mechanism",
        Value_name: "Three level authentication",
        Default_score: 3,
    },
    {
        Parameter_name: "Authentication Mechanism",
        Value_name: "Session based three level authentication",
        Default_score: 4,
    },
    {
        Parameter_name: "Authentication Mechanism",
        Value_name: "Biometrics",
        Default_score: 5,
    },
    // Regular Security Audits
    {
        Parameter_name: "Regular Security Audits",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Regular Security Audits",
        Value_name: "No",
        Default_score: 1,
    },
    // Compliance with Security Regulatory Frameworks
    {
        Parameter_name: "Compliance with Security Regulatory Frameworks",
        Value_name: "No Security compliance required",
        Default_score: 1,
    },
    {
        Parameter_name: "Compliance with Security Regulatory Frameworks",
        Value_name: "SOX/PCI-DSS/ISO27001, etc. or equivalent",
        Default_score: 3,
    },
    {
        Parameter_name: "Compliance with Security Regulatory Frameworks",
        Value_name: "SOX/PCI-DSS/ISO27001, etc. with reporting",
        Default_score: 5,
    },
    // Business continuity plan in place
    {
        Parameter_name: "Business continuity plan in place",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Business continuity plan in place",
        Value_name: "No",
        Default_score: 1,
    },
    // Disaster Recovery plan in place
    {
        Parameter_name: "Disaster Recovery plan in place",
        Value_name: "Yes",
        Default_score: 5,
    },
    {
        Parameter_name: "Disaster Recovery plan in place",
        Value_name: "No",
        Default_score: 1,
    },
    // Time taken to recover from an incident
    {
        Parameter_name: "Time taken to recover from an incident",
        Value_name: "More than 72 hours",
        Default_score: 1,
    },
    {
        Parameter_name: "Time taken to recover from an incident",
        Value_name: "48 - 72 hours",
        Default_score: 2,
    },
    {
        Parameter_name: "Time taken to recover from an incident",
        Value_name: "24 - 48 hours",
        Default_score: 3,
    },
    {
        Parameter_name: "Time taken to recover from an incident",
        Value_name: "12 - 24 hours",
        Default_score: 4,
    },
    {
        Parameter_name: "Time taken to recover from an incident",
        Value_name: "Less than 12 hours",
        Default_score: 5,
    },
    // Number of test instances
    {
        Parameter_name: "Number of test instances",
        Value_name: "None",
        Default_score: 1,
    },
    {
        Parameter_name: "Number of test instances",
        Value_name: "1",
        Default_score: 2,
    },
    {
        Parameter_name: "Number of test instances",
        Value_name: "2",
        Default_score: 3,
    },
    {
        Parameter_name: "Number of test instances",
        Value_name: "3",
        Default_score: 4,
    },
    {
        Parameter_name: "Number of test instances",
        Value_name: "More than 3",
        Default_score: 5,
    },
    // Percentage of automated test coverage
    {
        Parameter_name: "Percentage of automated test coverage",
        Value_name: "None",
        Default_score: 1,
    },
    {
        Parameter_name: "Percentage of automated test coverage",
        Value_name: "Less than 30%",
        Default_score: 2,
    },
    {
        Parameter_name: "Percentage of automated test coverage",
        Value_name: "30% to 60%",
        Default_score: 3,
    },
    {
        Parameter_name: "Percentage of automated test coverage",
        Value_name: "60% to 90%",
        Default_score: 4,
    },
    {
        Parameter_name: "Percentage of automated test coverage",
        Value_name: "More than 90%",
        Default_score: 5,
    },
    // Dedicated test environment(s)
    {
        Parameter_name: "Dedicated test environment(s)",
        Value_name: "No",
        Default_score: 1,
    },
    {
        Parameter_name: "Dedicated test environment(s)",
        Value_name: "Yes, limited shared",
        Default_score: 2,
    },
    {
        Parameter_name: "Dedicated test environment(s)",
        Value_name: "Yes, shared",
        Default_score: 3,
    },
    {
        Parameter_name: "Dedicated test environment(s)",
        Value_name: "Yes, limited dedicated",
        Default_score: 4,
    },
    {
        Parameter_name: "Dedicated test environment(s)",
        Value_name: "Yes, fully dedicated",
        Default_score: 5,
    },
    // Automated test data generation
    {
        Parameter_name: "Automated test data generation",
        Value_name: "No",
        Default_score: 1,
    },
    {
        Parameter_name: "Automated test data generation",
        Value_name: "Yes, for positive and negative test scenarios",
        Default_score: 3,
    },
    {
        Parameter_name: "Automated test data generation",
        Value_name: "Yes, for positive test scenarios",
        Default_score: 4,
    },
    {
        Parameter_name: "Automated test data generation",
        Value_name: "Yes, for a few test scenarios",
        Default_score: 2,
    },
    {
        Parameter_name: "Automated test data generation",
        Value_name: "Yes, for positive and some test scenarios",
        Default_score: 5,
    },
    // Automated Test scripts regression time
    {
        Parameter_name: "Automated Test scripts regression time",
        Value_name: "More than 2 days",
        Default_score: 1,
    },
    {
        Parameter_name: "Automated Test scripts regression time",
        Value_name: "1 to 2 days",
        Default_score: 2,
    },
    {
        Parameter_name: "Automated Test scripts regression time",
        Value_name: "12 to 24 hours",
        Default_score: 3,
    },
    {
        Parameter_name: "Automated Test scripts regression time",
        Value_name: "6 to 12 hours",
        Default_score: 4,
    },
    {
        Parameter_name: "Automated Test scripts regression time",
        Value_name: "Less than 6 hours",
        Default_score: 5,
    },
    // Number of Production releases in last 12 months
    {
        Parameter_name: "Number of Production releases in last 12 months",
        Value_name: "More than 6",
        Default_score: 1,
    },
    {
        Parameter_name: "Number of Production releases in last 12 months",
        Value_name: "4 to 6",
        Default_score: 2,
    },
    {
        Parameter_name: "Number of Production releases in last 12 months",
        Value_name: "2 to 4",
        Default_score: 3,
    },
    {
        Parameter_name: "Number of Production releases in last 12 months",
        Value_name: "1",
        Default_score: 4,
    },
    {
        Parameter_name: "Number of Production releases in last 12 months",
        Value_name: "None",
        Default_score: 5,
    },
    // Number of Parallel releases in last 12 months
    {
        Parameter_name: "Number of Parallel releases in last 12 months",
        Value_name: "More than 6",
        Default_score: 1,
    },
    {
        Parameter_name: "Number of Parallel releases in last 12 months",
        Value_name: "4 to 6",
        Default_score: 2,
    },
    {
        Parameter_name: "Number of Parallel releases in last 12 months",
        Value_name: "2 to 4",
        Default_score: 3,
    },
    {
        Parameter_name: "Number of Parallel releases in last 12 months",
        Value_name: "1",
        Default_score: 4,
    },
    {
        Parameter_name: "Number of Parallel releases in last 12 months",
        Value_name: "None",
        Default_score: 5,
    },
    // Frequency of releases to Production
    {
        Parameter_name: "Frequency of releases to Production",
        Value_name: "Every few weeks",
        Default_score: 1,
    },
    {
        Parameter_name: "Frequency of releases to Production",
        Value_name: "Monthly",
        Default_score: 2,
    },
    {
        Parameter_name: "Frequency of releases to Production",
        Value_name: "Bi-monthly",
        Default_score: 3,
    },
    {
        Parameter_name: "Frequency of releases to Production",
        Value_name: "Quarterly",
        Default_score: 4,
    },
    {
        Parameter_name: "Frequency of releases to Production",
        Value_name: "Bi-annually or longer",
        Default_score: 5,
    },
    // Frequency of releases to Parallel
    {
        Parameter_name: "Frequency of releases to Parallel",
        Value_name: "Every few weeks",
        Default_score: 1,
    },
    {
        Parameter_name: "Frequency of releases to Parallel",
        Value_name: "Monthly",
        Default_score: 2,
    },
    {
        Parameter_name: "Frequency of releases to Parallel",
        Value_name: "Bi-monthly",
        Default_score: 3,
    },
    {
        Parameter_name: "Frequency of releases to Parallel",
        Value_name: "Quarterly",
        Default_score: 4,
    },
    {
        Parameter_name: "Frequency of releases to Parallel",
        Value_name: "Bi-annually or longer",
        Default_score: 5,
    },
];



// Function to insert values into the Values_Central table
const insertValuesIntoValuesCentral = async () => {
    const query =
        "INSERT INTO Values_Central (Parameter_Central_id, Value_name, Default_score) VALUES ?";
    const valuesToInsert = await Promise.all(
        valuesData.map(async (value) => {
            const parameterId = await getL1ParameterCentralIdByName(value.Parameter_name);
            return [parameterId, value.Value_name, value.Default_score];
        })
    );

    pool.query(query, [valuesToInsert], (err, result) => {
        if (err) {
            console.error("Error inserting data into 'Values_Central' table:", err.message);
        } else {
            console.log("Data inserted into 'Values_Central' table successfully!");
        }
    });
};

// Function to get the L1_Parameter_Central_id from the L1_Parameters_Central table based on the parameter name
const getL1ParameterCentralIdByName = (parameterName) => {
    const query = "SELECT L1_Parameter_Central_id FROM L1_Parameters_Central WHERE L1_Parameter_name = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [parameterName], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0].L1_Parameter_Central_id);
                } else {
                    resolve(null);
                }
            }
        });
    });
};


//--------------------------------------------------------------------------------------------------------------
// Function to insert data into user table
//--------------------------------------------------------------------------------------------------------------

export const addUserToDatabase = (user_password, user_role, username) => {


    // SQL INSERT query to add data to the 'user' table
    const insertQuery = 'INSERT INTO user (user_password, User_Role, Username) VALUES (?, ?, ?)';

    // Data to be inserted
    const data = [user_password, user_role, username];

    // Execute the INSERT query
    pool.query(insertQuery, data, (error, results) => {

        if (error) {
            console.error('Error executing the INSERT query:', error);
        } else {
            console.log('Data added to the user table successfully.');
        }
    });
}



//--------------------------------------------------------------------------------------------------------------
// Function to add data into the Customer table
//--------------------------------------------------------------------------------------------------------------
export const addCustomerData = (customerId, customerName, userId) => {
    // SQL INSERT query to add data to the 'Customer' table
    const insertQuery = 'INSERT INTO Customer (Customer_id, Customer_name, User_id) VALUES (?, ?, ?)';

    // Data to be inserted
    const data = [customerId, customerName, userId];

    // Execute the INSERT query
    pool.query(insertQuery, data, (error, results) => {
        if (error) {
            console.error('Error executing the INSERT query:', error);
        } else {
            console.log('Data added to the Customer table successfully.');
        }
    });
}

// Function to delete a table
const deleteTable = (tableName) => {
    const deleteQuery = `DROP TABLE IF EXISTS ${tableName}`;

    pool.query(deleteQuery, (error, result) => {
        if (error) {
            console.error(`Error deleting table ${tableName}:`, error.message);
        } else {
            console.log(`Table ${tableName} deleted successfully.`);
        }
    });
};

// Function to add a column to an existing table
const addColumnToTable = (tableName, columnName, columnDefinition) => {
    const addColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`;

    pool.query(addColumnQuery, (error, result) => {
        if (error) {
            console.error(`Error adding column ${columnName} to table ${tableName}:`, error.message);
        } else {
            console.log(`Column ${columnName} added to table ${tableName} successfully.`);
        }
    });
};

// Function to delete all tables in the database
const deleteAllTables = () => {
    // Query to fetch all table names from the database
    const getTableNamesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ?
    `;

    // Get the database name from the connection configuration
    const dbName = dbConfig.database;

    pool.query(getTableNamesQuery, [dbName], (err, results) => {
        if (err) {
            console.error("Error fetching table names:", err.message);
            return;
        }

        // Extract table names from the query results
        const tableNames = results.map((result) => result.TABLE_NAME);
        console.log("Tables to delete:", results);

        if (tableNames.length === 0) {
            console.log("No tables found in the database.");
            return;
        }

        // Run a DROP TABLE query for each table
        tableNames.forEach((tableName) => {
            const dropTableQuery = `DROP TABLE ${tableName}`;
            pool.query(dropTableQuery, (err) => {
                if (err) {
                    console.error(`Error deleting table '${tableName}':`, err.message);
                } else {
                    console.log(`Table '${tableName}' deleted successfully.`);
                }
            });
        });
    });
};



export const addData = () => {

    //modify table
    //addColumnToTable('Repository_Files', 'File_Blob', 'LONGBLOB');

    //to delete table
    //deleteTable('Application');
    //deleteTable('L1_Parameters_Central');
    //deleteTable('Values_Central');

    //to delete all tables
    //deleteAllTables();

    // to create Tables and Columns in the database
    //createAllTables();

    // Call the function to insert data into the Category_Central table
    //insertCategoriesIntoTable(categoriesWithCreationDate);

    // Call the function to insert data into the L1_Parameters_Central table
    //insertParametersIntoTable(parametersData);

    // Call the function to insert values into the Values_Central table
    //insertValuesIntoValuesCentral();

    // call the function to insert data into the user table
    //addUserToDatabase('admin', 'admin', 'admin');
    //addUserToDatabase('consultant', 'consultant', 'consultant');
}

//addData()