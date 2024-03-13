import rule_engine_data from "./rules.js";

// Function to apply the rule engine and fill missing values for the given category
function applyRuleEngine(rules, application, category) {
    const rule = rules["rules"].find((r) => r.category === category);

    if (!rule) {
        console.error('No rule found for category: ${category}');
        return;
    }

    const weights = rule.actions[0].weightages;
    const missingValue = calculateEmptyData(application, weights);
    application[category] = missingValue;

}

// Helper function to calculate the missing value based on weightages
function calculateEmptyData(application, weightages) {
    let sum = 0;
    let totalWeight = 0;

    for (const key in weightages) {
        const value = application[key];
        if (!isNaN(value)) {
            sum += value * weightages[key];
            totalWeight += weightages[key];
        }
    }

    return totalWeight === 0 ? 0 : sum / totalWeight;
}

export function fill(applications) {
    // Sample applications data with missing Business Criticality values
    /*const applications = [
        {
            "Application Stability": 3,
            "Application Complexity": 4,
            "Application Maturity": 3,
            "Interoperability": 2,
            "Technology Maturity": 4,
            "Digital and Microservices Readiness": 3,
            "Security": 4,
            "Knowledge": 4,
            "Technical Risk": 2,
            "Business Criticality": 0.0 // Missing value
        },
        {
            "Application Stability": 4,
            "Application Complexity": 0.0,
            "Application Maturity": 4,
            "Interoperability": 3,
            "Technology Maturity": 3,
            "Digital and Microservices Readiness": 4,
            "Security": 3,
            "Knowledge": 4,
            "Technical Risk": 3,
            "Business Criticality": 4
        }
    ];*/

    // Sample rule engine
    const rules = rule_engine_data;

    // Apply the rule engine to fill missing Business Criticality values
    for (const i of applications) {
        //console.log(i);
        if (i["Business Criticality"] == 0.0) {
            applyRuleEngine(rules, i, "Business Criticality");
        }
        else if (i["Application Stability"] == 0.0) {
            applyRuleEngine(rules, i, "Application Stability");
        }
        else if (i["Application Complexity"] == 0.0) {
            applyRuleEngine(rules, i, "Application Complexity");
        }
        else if (i["Application Maturity"] == 0.0) {
            applyRuleEngine(rules, i, "Application Maturity");
        }
        else if (i["Interoperability"] == 0.0) {
            applyRuleEngine(rules, i, "Interoperability");
        }
        else if (i["Technology Maturity"] == 0.0) {
            applyRuleEngine(rules, i, "Technology Maturity");
        }
        else if (i["Digital and Microservices Readiness"] == 0.0) {
            applyRuleEngine(rules, i, "Digital and Microservices Readiness");
        }
        else if (i["Security"] == 0.0) {
            applyRuleEngine(rules, i, "Security");
        }
        else if (i["Knowledge"] == 0.0) {
            applyRuleEngine(rules, i, "Knowledge");
        }
        else if (i["Technical Risk"] == 0.0) {
            applyRuleEngine(rules, i, "Technical Risk");
        }



    }
    return applications;
}
// Resulting applications data with filled Business Criticality values
//console.log(applications);
