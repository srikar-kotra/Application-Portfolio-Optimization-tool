import express from "express";
import bodyParser from "body-parser";
import lodash from "lodash";
import cors from "cors";
import session from "express-session";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcrypt";
import methodOverride from "method-override";
import multer from "multer";
import xlsx from "xlsx";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import 'axios';
import main from "./excel.js";

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

import { addData, pool, addCustomerData, addUserToDatabase } from "./create_tables.js";

const _ = { lodash };
const app = express();
const router = express.Router();

//----------------------------------------------------------------------------
// Express Setup
//----------------------------------------------------------------------------
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["POST", "GET", "PUT", "HEAD", "OPTIONS"],
    })
);

import { DataFactoryManagementClient } from "@azure/arm-datafactory";
import { DefaultAzureCredential } from "@azure/identity";
import { InteractiveBrowserCredential } from "@azure/identity";
// For client-side applications running in the browser, use InteractiveBrowserCredential instead of DefaultAzureCredential. See https://aka.ms/azsdk/js/identity/examples for more details.

const subscriptionId = "bfe377a6-4fb1-424c-857c-11fe7842d843";
//const client = new DataFactoryManagementClient(new DefaultAzureCredential(), subscriptionId);

//For client-side applications running in the browser, use this code instead:
const credential = new InteractiveBrowserCredential({
    tenantId: "2b60fd0d-b5b9-48dd-ae44-593943012aff",
    clientId: "78fde600-a58c-4eee-91c0-b577ac164729"
});
//const client = new DataFactoryManagementClient(credential, subscriptionId);


async function testConnection() {
    try {
        // Create a DataFactoryManagementClient with DefaultAzureCredential
        const client = new DataFactoryManagementClient(credential, subscriptionId);

        // Make a simple API call to get the list of Data Factories
        const factories = await client.factories.listBySubscription();

        // If the call is successful, it means the connection is successful
        console.log("Connection to Azure Data Factory is successful.");
        console.log("List of Factories:", factories);
    } catch (error) {
        // If there is an error, it means the connection failed
        console.error("Error connecting to Azure Data Factory:", error.message);
    }
}

// Call the function to test the connection
testConnection();


//----------------------------------------------------------------------------
// Azure Blob Storage Configuration
//----------------------------------------------------------------------------

// Set your Azure Blob Storage connection string and container name here
const accountName = 'techmapofiles';
const accountKey = 'WYexMu25+ouHDv4SSZmPLfVMvO8mEZrubkcqcBK+R3mC56P7f/ay8wMBoGHSRa4I69EFHiaiGEzp+ASt1KG0Rg==';
const containerName = 'apo-files';
const connectionString = `DefaultEndpointsProtocol=https;AccountName=techmapofiles;AccountKey=WYexMu25+ouHDv4SSZmPLfVMvO8mEZrubkcqcBK+R3mC56P7f/ay8wMBoGHSRa4I69EFHiaiGEzp+ASt1KG0Rg==;EndpointSuffix=core.windows.net`;
const containerClient = BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName);

//----------------------------------------------------------------------------
// Multer Setup for File Uploads
//----------------------------------------------------------------------------
//const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const { Customer_id } = await req.body;
        //console.log(req.body)
        const subDirectory = `customer_${Customer_id}`;
        const destinationPath = path.join('uploads', subDirectory);
        fs.mkdirSync(destinationPath, { recursive: true });
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const fileExt = path.extname(originalName);
        const timestamp = new Date();
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth() + 1;
        const day = timestamp.getDate();
        //console.log(timestamp)
        const fileName = `${path.basename(originalName, fileExt)}_${year}${month}${day}${fileExt}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });


//----------------------------------------------------------------------------
// Call the function to create tables
//----------------------------------------------------------------------------

addData();

//----------------------------------------------------------------------------
// Express Session Middleware
//----------------------------------------------------------------------------

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Call the function to get the secret key
const secretKey = generateSecretKey();

app.use(
    session({
        secret: secretKey, // Replace with your secret key for session encryption
        resave: false,
        saveUninitialized: true,
        role: "",
        cookie: {
            maxAge: 60 * 60 * 1000, // Set the session duration (in milliseconds) here
        },
    })
);

//----------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------
// Middleware to parse incoming request bodies
app.use(bodyParser.json());



// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check username against the database
    const query = 'SELECT user_password, User_Role FROM user WHERE Username = ?';
    pool.query(query, [username], async (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { user_password, User_Role } = results[0];

        try {
            //const passwordMatch = await bcrypt.compare(password, hashedPassword);
            const passwordMatch = password === user_password;
            if (passwordMatch) {
                req.session.role = User_Role; // Store the role in the session
                return res.json({ User_Role });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error comparing passwords', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

// Route for user logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});



// Route to check if the user is authenticated and get their role
app.get('/user', (req, res) => {
    if (req.session.role) {
        res.json({ role: req.session.role });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Route for adding data to the 'Customer' table
app.post('/add-customer', (req, res) => {
    const { Customer_name, username } = req.body;

    // Query to get the count of all elements in the customer table
    const query = 'SELECT COUNT(*) AS total_customers FROM Customer';
    var Customer_id = 0;
    // Execute the query
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }

        // The count of all elements in the customer table will be in the 'total_customers' field of the first row of 'results'
        const totalCount = results[0].total_customers;
        Customer_id = totalCount + 1;

    });

    //console.log(Customer_id, Customer_name, username)
    // Define an SQL query to search for the User_id based on the given username
    const findUserIdQuery = `
      SELECT User_id
      FROM User
      WHERE username = ?
    `;
    // Use the MySQL connection to execute the SQL query to find the User_id
    pool.query(findUserIdQuery, [username.username], (err, result) => {
        if (err) {
            console.error('Error searching for User_id:', err);
            res.status(500).json({ error: 'Error searching for User_id' });
        } else {
            if (result.length === 0) {
                // If no user with the given username is found, return an error response
                res.status(404).json({ error: 'User not found with the given username' });
            } else {
                const User_id = result[0].User_id; // Extract the User_id from the query result

                // Define an SQL query to insert customer data into the "Customer" table
                const insertCustomerQuery = `
            INSERT INTO Customer ( Customer_id,Customer_name, User_id)
            VALUES (?, ?, ?)
          `;

                // Use the MySQL connection to execute the SQL query and add the customer data
                pool.query(insertCustomerQuery, [Customer_id, Customer_name, User_id], (err, result) => {
                    if (err) {
                        console.error('Error adding customer data:', err);
                        res.status(500).json({ error: 'Error adding customer data' });
                    } else {
                        console.log('Customer data added successfully!');
                        res.status(200).json({ message: 'Customer data added successfully' });
                    }
                });
            }
        }
    });
});


// Assuming you have already created a MySQL connection pool named "pool"

app.post('/get-customers', (req, res) => {
    const { username } = req.body.username;
    //console.log(username)

    // Define an SQL query to find the User_id based on the given username
    const findUserIdQuery = `
      SELECT User_id
      FROM User
      WHERE username = ?
    `;

    // Use the MySQL connection to execute the SQL query to find the User_id
    pool.query(findUserIdQuery, [username], (err, result) => {
        if (err) {
            console.error('Error searching for User_id:', err);
            res.status(500).json({ error: 'Error searching for User_id' });
        } else {
            if (result.length === 0) {
                // If no user with the given username is found, return an error response
                res.status(404).json({ error: 'User not found with the given username' });
            } else {
                const User_id = result[0].User_id; // Extract the User_id from the query result

                // Define an SQL query to get a list of customers based on the User_id
                const getCustomersQuery = `
            SELECT *
            FROM Customer
            WHERE User_id = ?
          `;

                // Use the MySQL connection to execute the SQL query and retrieve the list of customers
                pool.query(getCustomersQuery, [User_id], (err, customers) => {
                    if (err) {
                        console.error('Error fetching customers:', err);
                        res.status(500).json({ error: 'Error fetching customers' });
                    } else {
                        // Send the list of customer data to the frontend
                        res.status(200).json({ customers });
                    }
                });
            }
        }
    });
});


// Route for adding data to the 'User' table
app.post('/add-user', (req, res) => {
    const { username, password, role } = req.body;
    addUserToDatabase(username, password, role);
});


// File Upload
app.post('/api/upload', upload.array('files'), async (req, res) => {
    try {
        const uploadedFiles = req.files;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
        //console.log(uploadedFiles.length)

        const { Customer_id } = req.body;
        if (!Customer_id) {
            return res.status(400).json({ error: 'Customer ID is missing in the request.' });
        }
        //console.log(Customer_id)



        // Save files to Azure Blob Storage
        //const { savedFileNames, cols } = await saveFilesToBlobStorage(uploadedFiles, Customer_id);

        // Save file names to MySQL database
        //await saveFileNamesToDatabase(savedFileNames, Customer_id);
        main(Customer_id.toString());
        //console.log('local')

        // Save files to local storage
        await saveFilesToLocal(uploadedFiles, Customer_id);


        res.status(200).json({ message: 'Files uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading files:', error.message);
        res.status(500).json({ error: 'Failed to upload files. Please try again.' });
    }
});

// Add the following route to your Express app

app.post('/api/get-files', async (req, res) => {
    try {
        const { customer_id } = req.body;
        if (!customer_id) {
            return res.status(400).json({ error: 'Customer ID is missing in the request.' });
        }

        const subDirectory = `customer_${customer_id}`;
        const directoryPath = path.join('uploads', subDirectory);
        //console.log(directoryPath)
        // Read the contents of the directory
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err.message);
                return res.status(500).json({ error: 'Failed to read directory contents.' });
            }

            // Filter out any subdirectories (if any) from the list of files
            const fileNames = files.filter((file) => fs.statSync(path.join(directoryPath, file)).isFile());
            //console.log(fileNames)
            res.status(200).json({ files: fileNames });
        });
    } catch (error) {
        console.error('Error fetching files:', error.message);
        res.status(500).json({ error: 'Failed to fetch files. Please try again.' });
    }
});


//----------------------------------------------------------------------------
// Helper Functions
//----------------------------------------------------------------------------


// Function to save files to local storage
function saveFilesToLocal(files, Customer_id) {

    const subDirectory = `customer_${Customer_id}`;
    const destinationPath = path.join('uploads', subDirectory);
    for (const file of files) {
        //console.log(file)

        if (!file || !file.buffer) {
            console.error('Error saving file to local storage:', 'File buffer is missing.');
            continue;
        }

        const originalName = file.originalname;
        console.log(originalName)
        /*const timestamp = Date.now();
        const fileName = `${path.basename(originalName, path.extname(originalName))}_${timestamp}${path.extname(originalName)}`;
        const filePath = path.join(destinationPath, fileName);

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.error('Error saving file to local storage:', err.message);
            } else {
                console.log('File saved to local storage:', filePath);
            }
        });*/
    }
}


// Function to save files to Azure Blob Storage and return the saved file names
async function saveFilesToBlobStorage(files, Customer_id) {
    const savedFileNames = [];
    const cols = [];
    for (const file of files) {
        const originalName = file.originalname;
        const fileExt = originalName.split('.').pop();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '');
        const blobName = originalName.replace(`.${fileExt}`, '') + '_' + timestamp + '.' + fileExt;
        //addApplicationData(file.buffer);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        // Extract column names from the Excel sheet
        const columnNames = await getColumnNamesFromExcelBlob(blobName, Customer_id);
        //console.log(columnNames)
        cols.push(columnNames);

        // Match column names with L1_Parameters_Central and get Category_Central_id
        //const categoryIds = await matchColumnNamesWithL1Parameters(columnNames);
        console.log(categoryIds)
        savedFileNames.push(blobName);
    }
    return { savedFileNames, cols };
}


// Function to save file names to MySQL database
function saveFileNamesToDatabase(fileNames, Customer_id) {
    //console.log(Customer_id)
    const values = fileNames.map((fileName) => [new Date(), fileName, Customer_id]);
    const insertQuery = 'INSERT INTO Repository_Files (Creation_date, Repository_file_name, Customer_id) VALUES ?';
    pool.query(insertQuery, [values], (err, result) => {
        if (err) {
            console.error('Error saving file names to database:', err.message);
        } else {
            console.log('File names saved to database successfully!');
        }
    });
}

// Function to extract column names from an Excel sheet in Azure Blob Storage
async function getColumnNamesFromExcelBlob(blobName, Customer_id) {
    try {
        // Get the blob content from Azure Blob Storage
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download(0);
        const blobContent = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        // Parse the Excel file using xlsx library
        const workbook = xlsx.read(blobContent, { type: "buffer" });
        await main(Customer_id.toString(), workbook)

        // Assuming the first sheet is the one with column names
        const firstSheetName = workbook.SheetNames[0];
        addApplicationData(workbook, Customer_id)
        const worksheet = workbook.Sheets[firstSheetName];

        // Get the range of the worksheet
        const range = xlsx.utils.decode_range(worksheet["!ref"]);

        // Extract column names from the first row of the worksheet
        const columnNames = [];
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cellAddress = xlsx.utils.encode_cell({ r: 0, c: colIndex });
            const cellValue = worksheet[cellAddress]?.v;
            columnNames.push(cellValue);
        }

        return columnNames;
    } catch (error) {
        console.error('Error extracting column names from Excel:', error.message);
        throw error;
    }
}

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

// Function to match column names with L1_Parameters_Central and return Category_Central_id
async function matchColumnNamesWithL1Parameters(columnNames) {
    try {
        // Create an array to store the Category_Central_id values
        const categoryIds = [];

        // Iterate through the column names and search for matches in the L1_Parameters_Central table
        for (const columnName of columnNames) {
            // Define the SQL query to find the Category_Central_id based on the column name
            const findCategoryQuery = `
                SELECT Category_Central_id
                FROM L1_Parameters_Central
                WHERE L1_Parameter_name = ?`;

            // Use the MySQL connection to execute the SQL query and retrieve the Category_Central_id
            const [rows] = await pool.query(findCategoryQuery, [columnName]);
            console.log(rows);

            if (rows.length > 0) {
                // If a match is found, store the Category_Central_id in the array
                categoryIds.push(rows[0].Category_Central_id);
            } else {
                // Handle the case when no match is found (optional)
                categoryIds.push(null);
            }
        }

        return categoryIds;
    } catch (error) {
        console.error('Error matching column names with L1_Parameters_Central:', error.message);
        throw error;
    }
}

//function to add data to application_table
async function addApplicationData(workbookInstance, Customer_id) {
    try {


        // Read the local Excel file using xlsx library
        const workbook = workbookInstance;
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Find the range of the worksheet
        const range = xlsx.utils.decode_range(worksheet["!ref"]);

        // Calculate the number of rows by subtracting the starting row from the ending row
        const numRows = range.e.r - range.s.r + 1;
        //console.log("Number of rows:", numRows);
        var i = 0;
        for (i = 0; i < numRows; i++) {
            insertApplicationData(Customer_id);
        }

    } catch (error) {
        console.error("Error counting rows:", error.message);
        //res.status(500).json({ error: "Failed to count rows." });
    }
}

async function insertApplicationData(Customer_id) {
    const insertQuery = `
        INSERT INTO Engagement_Application_Table (Customer_id)
        VALUES (?)
    `;

    // Use the MySQL connection to execute the SQL query and add the data
    pool.query(insertQuery, [Customer_id], (err, result) => {
        if (err) {
            console.error('Error adding data to Engagement_Application_Table:', err);
            //res.status(500).json({ error: 'Error adding data to Engagement_Application_Table' });
        } else {
            console.log('Data added to Engagement_Application_Table successfully!');
            //res.status(200).json({ message: 'Data added to Engagement_Application_Table successfully' });
        }
    });
}


// Endpoint to fetch JSON data based on customer_id
app.get('/api/scores_:customer_id', (req, res) => {
    const customerId = req.params.customer_id;
    //console.log(customerId)

    // const filePath = path.join(__dirname, 'json', `score_${customerId}.json`);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const folderPath = path.join(__dirname, 'json');
    const filePath = path.join(folderPath, `scores_${customerId}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err.message);
            return res.status(500).json({ error: 'Failed to fetch JSON data.' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
            res.status(500).json({ error: 'Failed to parse JSON data.' });
        }
    });
});


const addApplicationName = (jsonObj) => {
    const result = [];

    for (const key in jsonObj) {
        const subObj = jsonObj[key];
        subObj["Application Name"] = key;
        result.push(subObj);
    }

    return result;
};

// Endpoint to fetch JSON data based on customer_id
app.get('/api/merge_:customer_id', (req, res) => {
    const customerId = req.params.customer_id;
    //console.log(customerId)

    // const filePath = path.join(__dirname, 'json', `score_${customerId}.json`);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const folderPath = path.join(__dirname, 'json');
    const filePath = path.join(folderPath, `merge_${customerId}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err.message);
            return res.status(500).json({ error: 'Failed to fetch JSON data.' });
        }

        try {
            const jsonData = JSON.parse(data);
            //console.log(jsonData)
            res.json(addApplicationName(jsonData));
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
            res.status(500).json({ error: 'Failed to parse JSON data.' });
        }
    });
});



app.post('/save-selected-category/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;

    // Ensure the "json" directory exists
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const jsonDir = path.join(__dirname, 'json');
    if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir);
    }

    // Construct the filename
    const filename = `selected_params_${customer_id}.json`;
    const filePath = path.join(jsonDir, filename);

    // Write the JSON data to the file
    fs.writeFile(filePath, JSON.stringify(req.body, null, 4), (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ error: 'Error saving data' });
        }

        console.log('File saved successfully:', filename);
        return res.status(200).json({ message: 'File saved successfully' });
    });
});

// Endpoint to fetch JSON data based on customer_id
app.get('/api/selected-params/:customer_id', (req, res) => {
    const customerId = req.params.customer_id;
    //console.log(customerId)

    // const filePath = path.join(__dirname, 'json', `score_${customerId}.json`);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const folderPath = path.join(__dirname, 'json');
    const filePath = path.join(folderPath, `selected_params_${customerId}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err.message);
            return res.status(500).json({ error: 'Failed to fetch JSON data.' });
        }

        try {
            const jsonData = JSON.parse(data);
            //console.log(jsonData)
            res.json(jsonData);
            //res.json(addApplicationName(jsonData));
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
            res.status(500).json({ error: 'Failed to parse JSON data.' });
        }
    });
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});



//----------------------------------------------------------------------------
//setting up the port
//----------------------------------------------------------------------------

let port = 3001;
app.listen(port, function () {
    console.log("Server started on port 3001");
});
