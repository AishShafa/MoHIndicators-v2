// src/data/indicators.js
export const indicators = {
  THE: {
    value: 7.2,
    description:
      "Total Expenditure on Health (THE) as % of GDP supports UHC coverage and financial protection.",
    sdgs: ["3.8.1", "3.8.2"],
  },
  OOPS: {
    value: 32.5,
    description:
      "Out-of-Pocket Spending on Health (OOPS) affects proportion of population with large health expenditure burdens.",
    sdgs: ["3.8.2"],
  },
  GGHE: {
    value: 52.3,
    description:
      "General Government Health Expenditure (GGHE) supports UHC and maternal mortality prevention.",
    sdgs: ["3.8.1", "3.1.1"],
  },
};

export const governanceIndicators = [
  {
    id: "nha",
    title: "Availability of National Health Accounts",
    description:
      "Up-to-date National Health Accounts linked to health system resilience and emergency response capacity.",
    sdgs: ["3.d.1"],
  },
  {
    id: "social-protection",
    title: "Population Covered by Social Protection Systems",
    description:
      "Influences financial risk protection and reduces maternal & infant mortality.",
    sdgs: ["3.8.2", "3.1.1", "3.2.1"],
  },
  {
    id: "preventive-health",
    title: "Government Spending on Preventive Health as % of GGHE",
    description:
      "Directly supports vaccine coverage and reduction of NCD mortality.",
    sdgs: ["3.b.1", "3.4.1"],
  },
];
