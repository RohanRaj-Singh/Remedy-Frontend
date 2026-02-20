export interface SubDepartmentMap {
  [department: string]: string[];
}

export const subDepartments: SubDepartmentMap = {
  // PT&C
  "PTandC": [
    "Chief Office",
    "IDS and CI",
    "People, Culture and Strategy",
    "Support Service",
    "Communication and Branding",
    "External Relations and CSI",
  ],

  // Commercial
  "Commercial": [
    "Joint Venture",
    "Exploration",
    "Economic and Planning",
    "Mergers and Acquisitions",
  ],

  // Operation 60&48
  "Operation 60and48": [
    "Field Operation",
    "Production Operation Support",
    "Maintenance Support",
    "Bisat Development",
    "Growth and Planning",
    "Operation 60and48",
  ],

  // HSSE
  "HSSE": [
    "HSE Operated Asset",
    "OH and IH",
    "Security",
    "HSE Support",
    "Sustainability",
  ],

  // Legal
  "Legal": [
    "Legal",
  ],

  // Technical Services
  "Technical Services": [
    "Technical Services",
  ],

  // Well Delivery
  "Well Delivery": [
    "Well Delivery",
  ],

  // Musandam Cluster
  "Musandam Cluster": [
    "Block 8",
    "Head Office",
    "MGP Operations",
    "MGP Maintenance",
  ],

  // Project Delivery
  "Project Delivery": [
    "Engineering",
    "Project Technical Services",
    "Construction Off Plot",
    "Major Projects",
    "Off Plot Projects",
  ],

  // Contract & Procurement
  "Contract & Procurement": [
    "Contract and Procurement",
    "Contracts",
    "Material Management",
    "ICV",
    "PPM and TBS",
  ],

  // Finance
  "Finance": [
    "Financial Planning and Analysis",
    "BF Operated Asset",
    "Financial Accounting and Tax",
    "Treasury",
    "BF Non Operated Assets",
  ],
} as const;