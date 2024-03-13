const rule_engine_data = {
  "rules": [
    {
      "id": 1,
      "name": "Rule 1",
      "description": "Fill missing values for Business Criticality",
      "category": "Business Criticality",
      "conditions": [
        {
          "field": "Business Criticality",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateBC",
          "weightages": {
            "Application Stability": 0.12,
            "Application Complexity": 0.08,
            "Application Maturity": 0.1,
            "Interoperability": 0.09,
            "Technology Maturity": 0.11,
            "Digital and Microservices Readiness": 0.1,
            "Security": 0.13,
            "Knowledge": 0.07,
            "Technical Risk": 0.05
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Rule 2",
      "description": "Fill missing values for Application Stability",
      "category": "Application Stability",
      "conditions": [
        {
          "field": "Application Stability",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateAS",
          "weightages": {
            "Business Criticality": 0.1,
            "Application Complexity": 0.09,
            "Application Maturity": 0.08,
            "Interoperability": 0.07,
            "Technology Maturity": 0.1,
            "Digital and Microservices Readiness": 0.09,
            "Security": 0.12,
            "Knowledge": 0.05,
            "Technical Risk": 0.1
          }
        }
      ]
    },
    {
      "id": 3,
      "name": "Rule 3",
      "description": "Fill missing values for Application Complexity",
      "category": "Application Complexity",
      "conditions": [
        {
          "field": "Application Complexity",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateComplexity",
          "weightages": {
            "Business Criticality": 0.08,
            "Application Stability": 0.09,
            "Application Maturity": 0.1,
            "Interoperability": 0.08,
            "Technology Maturity": 0.09,
            "Digital and Microservices Readiness": 0.07,
            "Security": 0.11,
            "Knowledge": 0.06,
            "Technical Risk": 0.12
          }
        }
      ]
    },
    {
      "id": 4,
      "name": "Rule 4",
      "description": "Fill missing values for Application Maturity",
      "category": "Application Maturity",
      "conditions": [
        {
          "field": "Application Maturity",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateMaturity",
          "weightages": {
            "Business Criticality": 0.07,
            "Application Stability": 0.08,
            "Application Complexity": 0.09,
            "Interoperability": 0.06,
            "Technology Maturity": 0.08,
            "Digital and Microservices Readiness": 0.06,
            "Security": 0.1,
            "Knowledge": 0.05,
            "Technical Risk": 0.11
          }
        }
      ]
    },
    {
      "id": 5,
      "name": "Rule 5",
      "description": "Fill missing values for Interoperability",
      "category": "Interoperability",
      "conditions": [
        {
          "field": "Interoperability",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateInteroperability",
          "weightages": {
            "Business Criticality": 0.06,
            "Application Stability": 0.07,
            "Application Complexity": 0.08,
            "Application Maturity": 0.09,
            "Technology Maturity": 0.1,
            "Digital and Microservices Readiness": 0.11,
            "Security": 0.12,
            "Knowledge": 0.05,
            "Technical Risk": 0.07
          }
        }
      ]
    },
    {
      "id": 6,
      "name": "Rule 6",
      "description": "Fill missing values for Technology Maturity",
      "category": "Technology Maturity",
      "conditions": [
        {
          "field": "Technology Maturity",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateTechMaturity",
          "weightages": {
            "Business Criticality": 0.09,
            "Application Stability": 0.08,
            "Application Complexity": 0.07,
            "Application Maturity": 0.06,
            "Interoperability": 0.07,
            "Digital and Microservices Readiness": 0.08,
            "Security": 0.11,
            "Knowledge": 0.05,
            "Technical Risk": 0.09
          }
        }
      ]
    },
    {
      "id": 7,
      "name": "Rule 7",
      "description": "Fill missing values for Digital and Microservices Readiness",
      "category": "Digital and Microservices Readiness",
      "conditions": [
        {
          "field": "Digital and Microservices Readiness",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateDigitalReadiness",
          "weightages": {
            "Business Criticality": 0.05,
            "Application Stability": 0.07,
            "Application Complexity": 0.08,
            "Application Maturity": 0.06,
            "Interoperability": 0.08,
            "Technology Maturity": 0.09,
            "Security": 0.1,
            "Knowledge": 0.05,
            "Technical Risk": 0.07
          }
        }
      ]
    },
    {
      "id": 8,
      "name": "Rule 8",
      "description": "Fill missing values for Security",
      "category": "Security",
      "conditions": [
        {
          "field": "Security",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateSecurity",
          "weightages": {
            "Business Criticality": 0.07,
            "Application Stability": 0.08,
            "Application Complexity": 0.09,
            "Application Maturity": 0.1,
            "Interoperability": 0.07,
            "Technology Maturity": 0.08,
            "Digital and Microservices Readiness": 0.09,
            "Knowledge": 0.05,
            "Technical Risk": 0.1
          }
        }
      ]
    },
    {
      "id": 9,
      "name": "Rule 9",
      "description": "Fill missing values for Knowledge",
      "category": "Knowledge",
      "conditions": [
        {
          "field": "Knowledge",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateKnowledge",
          "weightages": {
            "Business Criticality": 0.08,
            "Application Stability": 0.07,
            "Application Complexity": 0.06,
            "Application Maturity": 0.05,
            "Interoperability": 0.06,
            "Technology Maturity": 0.07,
            "Digital and Microservices Readiness": 0.05,
            "Security": 0.1,
            "Technical Risk": 0.08
          }
        }
      ]
    },
    {
      "id": 10,
      "name": "Rule 10",
      "description": "Fill missing values for Technical Risk",
      "category": "Technical Risk",
      "conditions": [
        {
          "field": "Technical Risk",
          "operator": "isMissing"
        }
      ],
      "actions": [
        {
          "action": "calculateTechRisk",
          "weightages": {
            "Business Criticality": 0.09,
            "Application Stability": 0.08,
            "Application Complexity": 0.1,
            "Application Maturity": 0.07,
            "Interoperability": 0.06,
            "Technology Maturity": 0.08,
            "Digital and Microservices Readiness": 0.07,
            "Security": 0.12,
            "Knowledge": 0.05
          }
        }
      ]
    }
  ]
}
export default rule_engine_data;