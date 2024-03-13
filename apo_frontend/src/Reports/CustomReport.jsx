
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import PieChart from "./Visuals/Pie";
import ScatterPlot from "./Visuals/Scatter";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomReport.css';
export default function CustomReport() {
    const { username, customer_id } = useParams();
    const [counts, setCounts] = useState({
        Retain: 0,
        Retire: 0,
        Reengineer: 0,
        Replace: 0,
    });


    const [data, setData] = useState(3);

    /*useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/merge_${customer_id}.json`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [customer_id]);

    if (!data) {
        return <div>Loading...</div>;
    }*/

    const sample = {
        "A1": {
            "Business Criticality": 5,
            "Application Stability": 2,
            "Application Complexity": 1,
            "Application Maturity": 2.25,
            "Interoperability": 5,
            "Technology Maturity/Debt": 5,
            "Digital and Microservices Readiness": 5,
            "Security Adherence": 5,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 5
        },
        "A2": {
            "Business Criticality": 2.6,
            "Application Stability": 3,
            "Application Complexity": 5,
            "Application Maturity": 3.5,
            "Interoperability": 1,
            "Technology Maturity/Debt": 3,
            "Digital and Microservices Readiness": 3,
            "Security Adherence": 1,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 1
        },
        "A3": {
            "Business Criticality": 4.6,
            "Application Stability": 1.5,
            "Application Complexity": 2,
            "Application Maturity": 3.75,
            "Interoperability": 5,
            "Technology Maturity/Debt": 5,
            "Digital and Microservices Readiness": 5,
            "Security Adherence": 5,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 3
        },
        "A4": {
            "Business Criticality": 3.2,
            "Application Stability": 3.5,
            "Application Complexity": 1,
            "Application Maturity": 3.75,
            "Interoperability": 1,
            "Technology Maturity/Debt": 3,
            "Digital and Microservices Readiness": 3,
            "Security Adherence": 1,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 5
        },
        "A5": {
            "Business Criticality": 4.6,
            "Application Stability": 4,
            "Application Complexity": 5,
            "Application Maturity": 2.5,
            "Interoperability": 1,
            "Technology Maturity/Debt": 5,
            "Digital and Microservices Readiness": 5,
            "Security Adherence": 5,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 1
        },
        "A6": {
            "Business Criticality": 3,
            "Application Stability": 2,
            "Application Complexity": 2,
            "Application Maturity": 2.25,
            "Interoperability": 5,
            "Technology Maturity/Debt": 3,
            "Digital and Microservices Readiness": 3,
            "Security Adherence": 1,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 3
        },
        "A7": {
            "Business Criticality": 5,
            "Application Stability": 3,
            "Application Complexity": 1,
            "Application Maturity": 3.75,
            "Interoperability": 1,
            "Technology Maturity/Debt": 5,
            "Digital and Microservices Readiness": 5,
            "Security Adherence": 5,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 5
        },
        "A8": {
            "Business Criticality": 2.6,
            "Application Stability": 3.5,
            "Application Complexity": 5,
            "Application Maturity": 3.5,
            "Interoperability": 5,
            "Technology Maturity/Debt": 5,
            "Digital and Microservices Readiness": 3,
            "Security Adherence": 1,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 1
        },
        "A9": {
            "Business Criticality": 3.2,
            "Application Stability": 2.5,
            "Application Complexity": 2,
            "Application Maturity": 2.25,
            "Interoperability": 1,
            "Technology Maturity/Debt": 3,
            "Digital and Microservices Readiness": 5,
            "Security Adherence": 5,
            "Knowledge Repositories": 3,
            "Technical Risk": 3,
            "Infrastructure": 3
        },
        "A10": {
            "Business Criticality": 3,
            "Application Stability": 3.5,
            "Application Complexity": 5,
            "Application Maturity": 2.75,
            "Interoperability": 1,
            "Technology Maturity/Debt": 3,
            "Digital and Microservices Readiness": 3,
            "Security Adherence": 1,
            "Knowledge Repositories": 0,
            "Technical Risk": 0,
            "Infrastructure": 3
        }
    }

    const weightedAverage = (weights, values) => {
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * values[i];
        }
        return sum / totalWeight;
    };

    const newJson = {};
    for (const key in sample) {
        const data = sample[key];
        const businessCriticalityWeight = 0.5;
        const businessCriticalityValue = data["Business Criticality"];
        const knowledgeWeight = 0.2;
        const knowledgeValue = data["Knowledge Repositories"];
        const applicationStabilityWeight = 0.3;
        const applicationStabilityValue = data["Application Stability"];
        const businessCriticality = weightedAverage(
            [businessCriticalityWeight, knowledgeWeight, applicationStabilityWeight],
            [businessCriticalityValue, knowledgeValue, applicationStabilityValue]
        );

        const technicalityWeights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        const technicalityValues = [
            data["Application Complexity"],
            data["Application Maturity"],
            data["Interoperability"],
            data["Technology Maturity/Debt"],
            data["Digital and Microservices Readiness"],
            data["Security Adherence"],
            data["Technical Risk"],
            data["Infrastructure"],
        ];
        //console.log(technicalityValues);
        //const technicality = weightedAverage(technicalityWeights, technicalityValues);
        var tect = data["Application Complexity"] +
            data["Application Maturity"] +
            data["Interoperability"] +
            data["Technology Maturity/Debt"] +
            data["Digital and Microservices Readiness"] +
            data["Security Adherence"] +
            data["Technical Risk"] + data["Infrastructure"];
        tect = tect / 8;
        newJson[key] = {
            "Business Criticality": businessCriticality,
            "Technicality": tect
        };
    }

    let userStr = JSON.stringify(newJson);
    console.log(userStr);
    console.log(newJson);

    let retainCount = 0;
    let retireCount = 0;
    let reengineerCount = 0;
    let replaceCount = 0;

    const inputJson = newJson
    const getCategory = (businessCriticality, technicality) => {
        if (businessCriticality > 3 && technicality < 3) {
            replaceCount++;
            return "Replace";
        } else if (businessCriticality < 3 && technicality < 3) {
            retireCount++;
            return "Retire";
        } else if (businessCriticality > 3 && technicality > 3) {
            retainCount++;
            return "Retain";
        } else if (businessCriticality < 3 && technicality > 3) {
            reengineerCount++;
            return "Reengineer";
        } else {
            return "Unknown"; // Handle any other cases if needed
        }
    };

    const newJson1 = {};
    for (const key in inputJson) {
        const { "Business Criticality": bc, Technicality: tech } = inputJson[key];
        const category = getCategory(bc, tech);
        newJson1[key] = { Category: category };
    }
    const scatterData1 = [];
    for (const key in inputJson) {
        const { "Business Criticality": businessCriticality, "Technicality": tect } = inputJson[key];
        scatterData1.push({ x: businessCriticality, y: tect });
    }
    //console.log(newJson1);


    return (
        <>
            <Navbar />

            <div className="report container">
                {/*<PieChart labels={labels} dataval={dataval} />
                <ScatterPlot data={scatterData} />*/}
                <h1 >Analysis/Assessment Report</h1>
                <h5>Customer Name: {customer_id}</h5>

                <div className="pie container">
                    <PieChart labels={['Retire', 'Retain', 'Replace', 'Re-engineer']} dataval={[retireCount, retainCount, replaceCount, reengineerCount]} />
                </div>
                <ScatterPlot data={scatterData1} />


            </div>
            <Footer />
        </>
    );
}