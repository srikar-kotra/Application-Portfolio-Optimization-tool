import React, { useEffect, useState } from 'react';
import ReactXLSxExport from 'react-xlsx-export';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import { Table, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import './ExcelView.css';
import { useParams } from 'react-router-dom';

const ExcelView = () => {
    const [l0Data, setL0Data] = useState([]);
    const [l1Data, setL1Data] = useState([]);
    const [l0Headers, setL0Headers] = useState([]);
    const [l1Headers, setL1Headers] = useState([]);
    const [l0Array, setL0Array] = useState([]);
    const [l1Array, setL1Array] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showL0Table, setShowL0Table] = useState(false);
    const [showL1Table, setShowL1Table] = useState(false);
    const { customer_id } = useParams();
    const [selectedParams, setSelectedParams] = useState([]);
    const [Inference, setInference] = useState([]);
    const [categories, setCategories] = useState([]);


    /*var categories = {
        "Parameters selected by the consultant and matching with customer provided Data": [], // replace with your actual names
        "Excess Parameters given by the Customer": [],
        "Parameter which requires the data from the Customer": [],
    };*/

    const handleSort = (sortField) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(sortField);
        setSortOrder(newSortOrder);
    };

    const fetchJsonData = async (endpoint, setData, setHeaders, setArray) => {
        try {
            const response = await axios.get(endpoint);
            const jsonData = response.data;
            const jsonArray = Object.values(jsonData)
            const extraColumnData = ["Retain", "Retire", "Retain", "Replace", "Retain", "Retire", "Retain", "Reengineer", "Reengineer", "Retire"]

            // Convert NaN and null to 0 in the data
            const dataWithZero = jsonArray.map((row, index) => {
                const newRow = {
                    "Application ID": index + 1,
                    "Application Name": Object.keys(jsonData)[index],
                    "Inference": extraColumnData[index]
                };
                for (const key in row) {
                    newRow[key] = (row[key] === null) ? 0 : row[key];
                }
                return newRow;
            });


            // Assuming your new array is called "extraColumnData"

            setData(dataWithZero);
            const updatedData = jsonArray.map(item => {
                const { "Application Name": _, ...rest } = item;
                return rest;
            });
            //console.log(Object.keys(updatedData["0"]).sort())

            //console.log(dataWithZero)
            if (setData === setL1Data) {
                setHeaders(["Application ID", "Application Name", ...Object.keys(updatedData["0"]).sort(), "Inference"]);
            }
            else {
                setHeaders(["Application ID", "Application Name", ...Object.keys(updatedData["0"]).sort()]);
            }

            //console.log(["Application ID", "Application Name", ...Object.keys(jsonData["0"]).sort(), "Inference"])

            //console.log(Object.keys(jsonData["0"]).sort())

            setArray(Object.values(dataWithZero));
        } catch (error) {
            console.error('Error fetching JSON data:', error.message);
        }
    };


    const fetchSelectedParamsData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/selected-params/${customer_id}`);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching selected parameters data:', error.message);
            return null;
        }
    };

    const extractSubParameters = (categories) => {
        const subParametersList = [];

        // Iterate through each category and its subparameters
        for (const [category, subParameters] of Object.entries(categories)) {
            subParametersList.push(...subParameters);
        }

        return subParametersList;
    };
    const subParametersList = extractSubParameters(selectedParams);
    //console.log(subParametersList);


    useEffect(() => {
        fetchJsonData(`http://localhost:3001/api/scores_${customer_id}`, setL0Data, setL0Headers, setL0Array);
        fetchJsonData(`http://localhost:3001/api/merge_${customer_id}`, setL1Data, setL1Headers, setL1Array);


        const fetchSelectedParams = async () => {
            try {
                const paramsData = await fetchSelectedParamsData();
                //console.log(paramsData);
                if (paramsData) {
                    setSelectedParams(paramsData);
                    //console.log(paramsData);
                }
            } catch (error) {
                console.error('Error fetching selected parameters:', error);
            }
        };

        // Assuming categories is an object that you want to populate
        const populateCategories = () => {
            const categories = {
                //"Parameters selected by the consultant and matching with customer provided Data": [],
                //"Excess Parameters given by the Customer": [],
                "Parameter which requires the data from the Customer": [],
            };

            const selectedSet = new Set(l0Headers); // Convert l0Headers to a Set for faster lookups

            subParametersList.forEach(param => {
                if (selectedSet.has(param)) {
                    //categories["Parameters selected by the consultant and matching with customer provided Data"].push(param);
                } else {
                    categories["Parameter which requires the data from the Customer"].push(param);
                }
            });

            // Filter l0Headers to get headers only in l0Headers but not in selected parameters
            const excessParams = l0Headers.filter(header => !subParametersList.includes(header));
            //categories["Excess Parameters given by the Customer"] = excessParams;

            setCategories(categories);
        };

        fetchSelectedParams();
        populateCategories();
        //console.log(selectedParams);


    }, [customer_id, l0Headers, subParametersList]);


    return (
        <div>
            <NavBar />
            <div className="view-data-select container">
                <div className="excel-card card-container">
                    {Object.entries(categories).map(([category, names], index) => (
                        <Card key={index} className="category-card">
                            <Card.Body>
                                <Card.Title>{category}</Card.Title>
                                <ul>
                                    {names.map((name, nameIndex) => (
                                        <li key={nameIndex}>{name}</li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <div className="container">
                    <div className="dropdown-container">
                        <Button className='export-file' onClick={() => setShowL0Table(!showL0Table)}>
                            L1 Parameters Table
                        </Button>
                        <Button className='export-file' onClick={() => setShowL1Table(!showL1Table)}>
                            L0 Parameters Table
                        </Button>
                    </div>
                    <div className='table-display'>
                        <h4>All the Parameters data of the Customer</h4>

                        {
                            showL0Table && (
                                <Table striped bordered hover className="view-file-table mt-2 ml-4">
                                    <thead>
                                        <tr>
                                            {l0Headers.map((header, index) => (
                                                <th key={index}>
                                                    {header}{' '}
                                                    <Button variant="link" onClick={() => handleSort(header)}>
                                                        <i className="fas fa-sort-down custom-icon-color"></i>
                                                    </Button>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {l0Array.map((row, index) => (
                                            <tr key={index}>
                                                {l0Headers.map((header, index) => (
                                                    <td key={index}>{row[header]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        {showL1Table && (
                            <Table striped bordered hover className="view-file-table mt-2 ml-4">
                                <thead>
                                    <tr>
                                        {l1Headers.map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {l1Array.map((row, index) => (
                                        <tr key={index}>
                                            {l1Headers.map((header, index) => (
                                                <td
                                                    key={index}
                                                    className={header === "Inference" ? "inference-column" : ""}
                                                >
                                                    {row[header]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>

                </div>
            </div>
            <div className="export-container">
                {(showL0Table || showL1Table) && (
                    <ReactXLSxExport
                        className="export-file"
                        data={showL0Table ? l0Data : l1Data}
                        filename={`Inference_data_${customer_id}`}
                        sheetName="L0 Categories"

                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ExcelView;
