// ==========================================================================
// CAREERLY — SAMPLE DATA
// Replace with your API calls. Centralized so all pages share the same source.
// ==========================================================================

export const companies = [
  { id: "acme", name: "Acme Corp", logoColor: "#1952a8", logoShape: "circle", rating: 3.0, reviews: 176, jobs: 41, tagline: "Technology & Software", location: "Adelaide SA 5000" },
  { id: "globex", name: "Globex", logoColor: "#d81b60", logoShape: "diamond", rating: 4.2, reviews: 309, jobs: 12, tagline: "Marketing & Media", location: "Sydney NSW 2000" },
  { id: "initech", name: "Initech", logoColor: "#0d1b3e", logoShape: "square", rating: 3.8, reviews: 92, jobs: 7, tagline: "Finance & Banking", location: "Melbourne VIC 3000" },
  { id: "umbrella", name: "Umbrella Co", logoColor: "#e63988", logoShape: "circle", rating: 4.5, reviews: 521, jobs: 23, tagline: "Healthcare", location: "Brisbane QLD 4000" },
];

export const jobs = [
  { id: "j1", title: "Founder", company: "Acme Corp", companyId: "acme", logoColor: "#1952a8", logoShape: "circle", location: "Adelaide SA 5000", type: "Full-time", salary: "$120k–$160k", posted: "2d ago" },
  { id: "j2", title: "Marketing Lead", company: "Globex", companyId: "globex", logoColor: "#d81b60", logoShape: "diamond", location: "Sydney NSW", type: "Contract", salary: "$90k–$110k", posted: "5d ago" },
  { id: "j3", title: "Software Engineer", company: "Initech", companyId: "initech", logoColor: "#0d1b3e", logoShape: "square", location: "Melbourne VIC", type: "Full-time", salary: "$110k–$140k", posted: "1d ago" },
  { id: "j4", title: "Product Manager", company: "Acme Corp", companyId: "acme", logoColor: "#1952a8", logoShape: "circle", location: "Remote", type: "Full-time", salary: "$130k–$170k", posted: "3d ago" },
  { id: "j5", title: "Nurse Practitioner", company: "Umbrella Co", companyId: "umbrella", logoColor: "#e63988", logoShape: "circle", location: "Brisbane QLD", type: "Part-time", salary: "$80k–$95k", posted: "1d ago" },
];

export const filters = ["All", "Full-time", "Contract", "Part-time", "Remote", "Adelaide SA"];
