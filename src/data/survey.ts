// Updated to use stream/function/department hierarchy
export const departments = [
  {
    stream: "Commercial",
    functions: [
      {
        function: "Business_Development",
        departments: [
          "Business_Development",
          "Mergers_And_Acquisitions",
        ],
      },
      {
        function: "Commercial",
        departments: [
          "Commercial",
          "Economics_And_Planning",
        ],
      },
      {
        function: "Exploration",
        departments: [
          "Exploration",
          "Exploration_Operated_Assets",
          "Exploration_Study_Or_Growth_Team",
        ],
      },
      {
        function: "Joint_Ventures",
        departments: [
          "Joint_Ventures_Integrated_Gas",
          "Joint_Ventures",
          "Joint_Ventures_Business",
          "Joint_Ventures_Technical_Solution",
        ],
      },
    ],
  },
  {
    stream: "Finance_And_Procurement",
    functions: [
      {
        function: "Contract_And_Procurement",
        departments: [
          "Contract_And_Procurement",
          "Contracts",
          "Material_Management",
        ],
      },
      {
        function: "Finance_And_Procurement",
        departments: [
          "BF_Non_Operated_Assets",
          "BF_Operated_Assets",
          "BF_Operated_Assets_Block_60_And_48",
          "Finance_And_Procurement",
          "Financial_Control",
          "Financial_Planning_And_Analysis",
          "Treasury",
        ],
      },
    ],
  },
  {
    stream: "Legal",
    functions: [
      {
        function: "Legal",
        departments: ["Legal"],
      },
    ],
  },
  {
    stream: "Operated_Assets",
    functions: [
      {
        function: "HSSE",
        departments: [
          "HSE_Operated_Asset",
          "HSE_Support",
          "HSSE",
          "OH_And_IH",
        ],
      },
      {
        function: "Musandam_Cluster",
        departments: ["Musandam_Cluster"],
      },
      {
        function: "Operated_Assets",
        departments: [
          "Operated_Assets",
          "Technical_Services",
          "Well_Delivery",
        ],
      },
      {
        function: "Projects_Delivery",
        departments: [
          "Construction",
          "Engineering",
          "Major_Projects",
          "Off_Plot_Projects",
          "Project_Technical_Services",
          "Projects_Delivery",
        ],
      },
      {
        function: "Subsurface_And_Operation_60_And_48",
        departments: [
          "Budget_And_Cost_Control",
          "Growth_And_Planning",
          "Operation_60_And_48_COE",
          "Subsurface",
          "Subsurface_And_Operation_60_And_48",
        ],
      },
    ],
  },
  {
    stream: "OQ_Exploration_And_Production",
    functions: [
      {
        function: "OQ_Exploration_And_Production",
        departments: ["OQ_Exploration_And_Production"],
      },
    ],
  },
  {
    stream: "People_Technology_And_Culture",
    functions: [
      {
        function: "Communications_And_Branding",
        departments: ["Communications_And_Branding"],
      },
      {
        function: "Corporate_Support_Service",
        departments: ["Corporate_Support_Service"],
      },
      {
        function: "IDS_And_CI",
        departments: ["IDS", "IDS_And_CI"],
      },
      {
        function: "People_And_Strategy",
        departments: ["People", "People_And_Strategy"],
      },
      {
        function: "People_Technology_And_Culture",
        departments: ["People_Technology_And_Culture"],
      },
    ],
  },
] as const;

// Radio options for each section
export const genderOptions = [
  { label: "survey.gender.options.male", value: "male" },
  { label: "survey.gender.options.female", value: "female" },
];

export const ageOptions = [
  { label: "survey.age.options.age18to24", value: "18-24" },
  { label: "survey.age.options.age25to34", value: "25-34" },
  { label: "survey.age.options.age35to44", value: "35-44" },
  { label: "survey.age.options.age45to54", value: "45-54" },
  { label: "survey.age.options.age55plus", value: "55+" },
];

export const seniorityOptions = [
  { label: "survey.seniority.options.seniorManagement", value: "senior" },
  { label: "survey.seniority.options.manager", value: "manager" },
  { label: "survey.seniority.options.employee", value: "employee" },
];

export const locationOptions = [
  { label: "B60", value: "block60" },
  { label: "Musandam", value: "msusundam" },
  { label: "Muscat", value: "headOffice" },
];
