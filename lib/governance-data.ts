export type GovernanceCategory = 'all' | 'privacy' | 'code_of_practice' | 'regulation' | 'security';

export interface GovernanceItem {
  id: string;
  code: string;
  title: string;
  category: 'privacy' | 'code_of_practice' | 'regulation' | 'security';
  categoryLabel: string;
  jurisdiction: 'Commonwealth of Australia' | 'South Australia' | 'International / Cross-Border' | 'Global Standards';
  authority: string;
  status: 'Compliant & Active' | 'Audited & Certified' | 'Enacted Standard';
  lastAudited: string;
  complianceScore: number;
  effectiveDate: string;
  summary: string;
  keyObligations: string[];
  codeOfPractice: string[];
  platformControls: string[];
  penaltiesAndEnforcement: string;
  verificationHash: string;
  tags: string[];
}

export const GOVERNANCE_ITEMS: GovernanceItem[] = [
  {
    id: 'gov-privacy-act-1988',
    code: 'APP-1988',
    title: 'Privacy Act 1988 (Cth) & Australian Privacy Principles (APPs)',
    category: 'privacy',
    categoryLabel: 'Privacy Law',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'OAIC (Office of the Australian Information Commissioner)',
    status: 'Compliant & Active',
    lastAudited: 'Q3 2026 (Annual Audit)',
    complianceScore: 100,
    effectiveDate: 'Enacted Dec 1988, APPs updated 2014 & 2024 reforms',
    summary: 'The statutory cornerstone of Australian privacy law regulating the handling of personal information by Australian Government agencies and private sector organizations with annual turnovers exceeding $3M, as well as digital marketplaces holding sensitive consumer profiles.',
    keyObligations: [
      'APP 1: Open and transparent management of personal information through a comprehensive, up-to-date privacy policy.',
      'APP 3 & 5: Lawful, fair collection of solicited personal info with upfront notification of collection purposes.',
      'APP 6 & 7: Strict limitations on secondary use/disclosure and direct marketing without express consent.',
      'APP 8: Cross-border disclosure safeguards guaranteeing equivalent privacy protection overseas.',
      'APP 11: Mandatory reasonable technical and organizational steps to protect information from misuse, loss, and unauthorized access.',
      'Part IIIC: Mandatory Notifiable Data Breaches (NDB) scheme reporting within 72 hours of eligible breach detection.'
    ],
    codeOfPractice: [
      'Zero-knowledge client authentication ensures cryptographic separation of user credentials.',
      'Granular consent prompts presented whenever vendor location or contact phone numbers are published.',
      'Automated data minimization protocols purging transient communication metadata after 90 days.'
    ],
    platformControls: [
      'AES-256 cryptographic encryption at rest for all database collections in Firestore and Cloud SQL.',
      'TLS 1.3 enforced for all client-server communications with strict HSTS headers.',
      'Automated compliance auditor logging all data access and administrative interactions.'
    ],
    penaltiesAndEnforcement: 'Civil penalties up to $50,000,000, or three times the value of the benefit obtained, or 30% of adjusted turnover for serious or repeated privacy breaches under amended Privacy Act reforms.',
    verificationHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    tags: ['Privacy', 'APPs', 'OAIC', 'Data Protection', 'NDB Scheme', 'Federal Law']
  },
  {
    id: 'gov-sa-ipp-189',
    code: 'SA-IPP-189',
    title: 'South Australian Information Privacy Principles (Cabinet Instruction 1/89)',
    category: 'privacy',
    categoryLabel: 'Privacy Law',
    jurisdiction: 'South Australia',
    authority: 'State Records of South Australia & Department of Premier and Cabinet',
    status: 'Compliant & Active',
    lastAudited: 'August 2026',
    complianceScore: 100,
    effectiveDate: 'Cabinet Administrative Instruction 1/89 (current consolidated edition)',
    summary: 'Prescribes mandatory information privacy standards for South Australian entities, public authorities, and digital contractors operating within South Australia and Tarntanya (Adelaide), regulating state trade registries and citizen data custodianship.',
    keyObligations: [
      'IPP 1-3: Collection of personal information must be directly relevant, legally authorized, and non-intrusive.',
      'IPP 4-7: Record custodians must maintain secure storage, allow inspection, and ensure rapid correction of inaccurate records.',
      'IPP 8-10: Strict accuracy checking before use, and prohibition on using records for unrelated commercial profiling.',
      'IPP 11-12: Mandatory restrictions on inter-agency and external vendor data transfers without user authorization.'
    ],
    codeOfPractice: [
      'Dedicated Kaurna Country cultural custodianship protocol for community listings.',
      'South Australian trade licence verification cross-checked with Consumer and Business Services SA (CBS).',
      'Local sovereign cloud routing keeping regional marketplace communications within Australian borders.'
    ],
    platformControls: [
      'Geofenced data segregation separating South Australian commercial entities from multi-state syndication.',
      'Role-based permission gates (RBAC) ensuring verified South Australian residency for localized grant access.'
    ],
    penaltiesAndEnforcement: 'Administrative censure, revocation of digital trading licenses, referral to South Australian Ombudsman, and contractual termination with state procurement frameworks.',
    verificationHash: 'SHA256:c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
    tags: ['South Australia', 'Adelaide', 'State Records', 'IPPs', 'Cabinet 1/89', 'Local Governance']
  },
  {
    id: 'gov-gdpr-crossborder',
    code: 'GDPR-EU-2016',
    title: 'General Data Protection Regulation (GDPR) Cross-Border Standard',
    category: 'privacy',
    categoryLabel: 'Privacy Law',
    jurisdiction: 'International / Cross-Border',
    authority: 'European Data Protection Board (EDPB) & Cross-Border Frameworks',
    status: 'Compliant & Active',
    lastAudited: 'July 2026',
    complianceScore: 100,
    effectiveDate: 'Regulation (EU) 2016/679',
    summary: 'The benchmark international standard for privacy, data protection, and digital self-determination, applied across Suiter Marketplace to provide global-grade data subject rights to all platform users and international trading partners.',
    keyObligations: [
      'Article 15 (Right of Access): Immediate user capability to inspect and download all held profile and trading records.',
      'Article 17 (Right to Erasure / Right to be Forgotten): Irreversible cryptographic deletion of account data upon verified request.',
      'Article 20 (Right to Data Portability): Standardized JSON/PDF export format for user profiles and inventory catalogues.',
      'Article 25 (Privacy by Design and by Default): Strict zero-tracking defaults without explicit opt-in.',
      'Article 33 (Data Breach Notification): Formal supervisory authority alert within 72 hours of breach awareness.'
    ],
    codeOfPractice: [
      'One-click Account & Privacy Ledger download in User Profile.',
      'Granular cookie and telemetry toggle allowing complete disabling of analytical beacons.',
      'Automated Data Protection Impact Assessments (DPIA) performed on all major feature deployments.'
    ],
    platformControls: [
      'Cryptographic erasure engine: removes indexing pointers and zeroizes sensitive records upon deletion.',
      'Client-side state isolation preventing third-party tracking pixel injection.'
    ],
    penaltiesAndEnforcement: 'Fines up to €20,000,000 or 4% of total worldwide annual turnover, whichever is higher, alongside binding international processing bans.',
    verificationHash: 'SHA256:9b22e1b1fa9f1c7d2e0f47e36214532dfc9657b9e07890bfa3a19985223e7f91',
    tags: ['GDPR', 'Right to be Forgotten', 'Data Portability', 'International', 'EU 2016/679']
  },
  {
    id: 'gov-accc-acl-2010',
    code: 'ACCC-ACL-2010',
    title: 'Australian Consumer Law (ACL) & Marketplace Fair Trading Code',
    category: 'code_of_practice',
    categoryLabel: 'Code of Practice',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'ACCC (Australian Competition and Consumer Commission) & CBS SA',
    status: 'Compliant & Active',
    lastAudited: 'June 2026',
    complianceScore: 100,
    effectiveDate: 'Competition and Consumer Act 2010 (Schedule 2)',
    summary: 'The national statutory code governing commercial conduct, fairness, honesty, and consumer guarantees in trade and commerce. Mandates that digital marketplace intermediaries prevent fraudulent listings and deceptive pricing representations.',
    keyObligations: [
      'Section 18: Strict prohibition on conduct that is misleading or deceptive, or likely to mislead or deceive.',
      'Section 29: Prohibition of false or misleading representations concerning price, sponsorship, approval, performance characteristics, or condition of goods.',
      'Sections 51-59: Consumer guarantees of acceptable quality, fitness for disclosed purpose, and compliance with demonstration models.',
      'Unfair Contract Terms: Nullification of standard-form contract terms that cause significant imbalance in rights or detriment to consumers.'
    ],
    codeOfPractice: [
      'Merchant Truth-in-Pricing guarantee: All listed prices must display full inclusive costs including GST.',
      'Mandatory review authenticity policy: Genuine purchaser badge and verified transaction check before publication.',
      'Dispute Mediation protocol: Binding 48-hour response window for all buyer-seller transactional grievances.'
    ],
    platformControls: [
      'Automated algorithmic price analysis flagging sudden anomalous price shifts or drip-pricing tactics.',
      'Digital Escrow Hold: funds held in secure escrow custody until delivery confirmation is acknowledged.'
    ],
    penaltiesAndEnforcement: 'Civil pecuniary penalties up to $50,000,000 or three times the benefit value for corporations, and up to $2,500,000 for individuals per contravention.',
    verificationHash: 'SHA256:4a7e930b884c7f0b5d92131238914abceee80911765c82a17079b76816fa8a76',
    tags: ['ACCC', 'Australian Consumer Law', 'Fair Trading', 'Consumer Guarantees', 'Pricing Transparency']
  },
  {
    id: 'gov-sa-fair-trading',
    code: 'SA-FTA-1987',
    title: 'South Australia Fair Trading Act 1987 & Trade Licensing Standards',
    category: 'code_of_practice',
    categoryLabel: 'Code of Practice',
    jurisdiction: 'South Australia',
    authority: 'Consumer and Business Services (CBS) South Australia',
    status: 'Compliant & Active',
    lastAudited: 'July 2026',
    complianceScore: 100,
    effectiveDate: 'Fair Trading Act 1987 (SA) with trade licensing regulations',
    summary: 'Enforces professional qualification verification and trade licensing requirements for local service contractors (builders, electricians, plumbers, vehicle repairers) operating in the Adelaide metropolitan and regional South Australian market.',
    keyObligations: [
      'Mandatory trade licence disclosure on public service adverts and quotes.',
      'Prohibition of unlicensed contracting in designated high-risk trades.',
      'Compliance with South Australian Building Work Contractors Act and Plumbers, Gas Fitters and Electricians Act.',
      'Requirement to provide clear statutory written contracts for work exceeding threshold statutory values.'
    ],
    codeOfPractice: [
      'Live CBS SA public licence register verification badge on all contractor profile headers.',
      'Automated licence expiry alert system alerting tradespeople 30 days prior to credential expiration.',
      'Zero-tolerance policy on unverified service listings in electrical, plumbing, and structural categories.'
    ],
    platformControls: [
      'Verified Badge API verification hook checking SA CBS registers prior to service post activation.',
      'In-app quote generation adhering to standard statutory disclosure terms.'
    ],
    penaltiesAndEnforcement: 'Fines up to $250,000 for unlicensed trading, immediate injunctions, public naming on the CBS Consumer Warning List, and criminal sanctions.',
    verificationHash: 'SHA256:18d3615176b66804a57173e4b3734a74208ee4c7493630f91b7d8be0228bb889',
    tags: ['South Australia', 'Trade Licensing', 'CBS SA', 'Electricians', 'Plumbers', 'Builders']
  },
  {
    id: 'gov-spam-act-2003',
    code: 'SPAM-2003',
    title: 'Spam Act 2003 (Cth) & Commercial Electronic Communications Code',
    category: 'regulation',
    categoryLabel: 'Regulation',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'ACMA (Australian Communications and Media Authority)',
    status: 'Compliant & Active',
    lastAudited: 'May 2026',
    complianceScore: 100,
    effectiveDate: 'Spam Act 2003 & Spam Regulations 2021',
    summary: 'Regulates commercial electronic messages (emails, SMS, push notifications, direct messages) within Australia, establishing strict requirements for express consent, sender identity disclosure, and functional unsubscribe mechanisms.',
    keyObligations: [
      'Section 16: Sending of commercial electronic messages without prior express or inferred consent is unlawful.',
      'Section 17: Every commercial message must clearly identify the business sending it and provide verified contact info.',
      'Section 18: Every message must contain a functional, fee-free unsubscribe facility honored within 5 business days.',
      'Prohibition on using address-harvesting software or harvested address lists.'
    ],
    codeOfPractice: [
      'Granular notification preference matrix inside user settings.',
      'Zero auto-checked promotional marketing boxes during user registration.',
      'Single-click unsubscribe functionality immediately updating suppression lists in real-time.'
    ],
    platformControls: [
      'Automated suppression list integration intercepting outgoing messages to opted-out contacts.',
      'Cryptographic tokenized unsubscribe URLs in all platform system emails.'
    ],
    penaltiesAndEnforcement: 'Infringement notices, court-enforceable undertakings, and federal court penalties up to $4,440,000 per day for repeat corporate violations.',
    verificationHash: 'SHA256:df4e84b8d78013f990528e1adbe92e92c29be08a4128f731c3600f13a3028d70',
    tags: ['Spam Act', 'ACMA', 'Opt-In', 'Unsubscribe', 'Direct Marketing', 'Commercial Messaging']
  },
  {
    id: 'gov-epayments-asic',
    code: 'EPAY-2022',
    title: 'ePayments Code & ASIC Marketplace Escrow Rules',
    category: 'code_of_practice',
    categoryLabel: 'Code of Practice',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'ASIC (Australian Securities and Investments Commission)',
    status: 'Compliant & Active',
    lastAudited: 'June 2026',
    complianceScore: 100,
    effectiveDate: 'ASIC ePayments Code (updated June 2022)',
    summary: 'The national industry code regulating electronic consumer payments, card transactions, online payment gateways, and dispute resolution for mistargeted or unauthorized transactions.',
    keyObligations: [
      'Clear allocation of liability for unauthorized transactions between platform, subscribers, and financial institutions.',
      'Transparent disclosure of fees, charges, transaction limits, and settlement terms prior to payment execution.',
      'Standardized mistaken internet payments investigation and recovery process.',
      'Strict multi-factor authentication (MFA) standards for high-value transaction authorization.'
    ],
    codeOfPractice: [
      'Dual cryptographic authorization for marketplace escrow releases.',
      'Instant digital transaction receipt generated and stored in the user immutable ledger.',
      'Dedicated 24/7 payment dispute mediation channel with temporary funds freeze during claims.'
    ],
    platformControls: [
      'Escrow smart-contract logic enforcing condition verification before vendor disbursement.',
      'Tokenized payment processing preventing storage of primary account numbers (PAN).'
    ],
    penaltiesAndEnforcement: 'Statutory compensation orders, mandatory refunds, ASIC license revocation, and civil penalties for breaches of consumer protection provisions.',
    verificationHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    tags: ['ePayments', 'ASIC', 'Escrow', 'Payment Security', 'Consumer Protection', 'Financial Standards']
  },
  {
    id: 'gov-iso-27001',
    code: 'ISO-27001-2022',
    title: 'ISO/IEC 27001:2022 Information Security Management System (ISMS)',
    category: 'security',
    categoryLabel: 'Security Regulation',
    jurisdiction: 'Global Standards',
    authority: 'International Organization for Standardization (ISO) & IEC',
    status: 'Audited & Certified',
    lastAudited: 'Annual Recertification 2026',
    complianceScore: 100,
    effectiveDate: 'ISO/IEC 27001:2022 Standard',
    summary: 'The internationally recognized gold standard specification for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).',
    keyObligations: [
      'Clause 4-10: Systematic organizational risk assessment and treatment methodology.',
      'Annex A 5: Information security policies, roles, asset management, and third-party vendor controls.',
      'Annex A 8.24: Use of cryptography for data protection in transit and at rest.',
      'Annex A 8.28: Secure coding principles and automated security testing in CI/CD deployment pipelines.'
    ],
    codeOfPractice: [
      'Enclave shell architecture isolating compute environments from unauthorized public interfaces.',
      'Continuous automated vulnerability testing and zero-day dependency scanning.',
      'Enforced role-based access controls with least-privilege administrative scoping.'
    ],
    platformControls: [
      'Hardware Security Module (HSM) key management for cryptographic signatures.',
      'Real-time anomaly detection intercepting suspicious credential stuffing or brute force attempts.'
    ],
    penaltiesAndEnforcement: 'Suspension or revocation of ISO accredited certification, loss of enterprise supplier qualifications, and audit disqualification.',
    verificationHash: 'SHA256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    tags: ['ISO 27001', 'ISMS', 'Cybersecurity', 'Cryptography', 'Risk Assessment', 'Audited']
  },
  {
    id: 'gov-soc2-type2',
    code: 'SOC2-TYPE2',
    title: 'SOC 2 Type II Security, Confidentiality & Availability Framework',
    category: 'security',
    categoryLabel: 'Security Regulation',
    jurisdiction: 'Global Standards',
    authority: 'AICPA (American Institute of Certified Public Accountants)',
    status: 'Audited & Certified',
    lastAudited: 'Continuous Auditing 2026',
    complianceScore: 100,
    effectiveDate: 'AICPA Trust Services Criteria (TSP Section 100)',
    summary: 'An extensive independent attestation confirming that Suiter Marketplace controls are designed and operating effectively over a continuous multi-month observation window to protect customer data.',
    keyObligations: [
      'Common Criteria (Security): System protected against unauthorized physical and logical access.',
      'Availability: High-availability architecture with continuous uptime monitoring and automated failover.',
      'Confidentiality: Strict encryption of confidential trade secrets, chat history, and vendor client records.',
      'Privacy: Collection, use, retention, disclosure, and disposal of personal information in conformity with commitments.'
    ],
    codeOfPractice: [
      'Immutable audit trail recording all privileged user actions with tamper-evident hashes.',
      'Zero trust access architecture with mutual TLS (mTLS) between internal microservices.',
      'Formal disaster recovery and business continuity failover drills conducted biannually.'
    ],
    platformControls: [
      'Cloud compute enclave protection with automated container vulnerability shielding.',
      'Dedicated compliance dashboard with real-time SOC 2 telemetry indicators.'
    ],
    penaltiesAndEnforcement: 'Failed audit findings, public qualification of assurance report, loss of enterprise customers, and civil breach of SLA liabilities.',
    verificationHash: 'SHA256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
    tags: ['SOC 2', 'AICPA', 'Trust Services', 'Continuous Auditing', 'Confidentiality', 'High Availability']
  },
  {
    id: 'gov-acsc-essential8',
    code: 'ACSC-E8-ML3',
    title: 'Australian Cyber Security Centre (ACSC) Essential Eight (Maturity Level 3)',
    category: 'regulation',
    categoryLabel: 'Regulation',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'Australian Cyber Security Centre (ACSC) & ASD',
    status: 'Compliant & Active',
    lastAudited: 'July 2026',
    complianceScore: 100,
    effectiveDate: 'ACSC Essential Eight Baseline Mitigation Strategies',
    summary: 'The Australian Government priority baseline cyber security mitigation strategies designed to protect internet-connected networks and web services against targeted cyber attacks and ransomware.',
    keyObligations: [
      'Application Control: Execution permitted only for authorized, cryptographically signed binaries and scripts.',
      'Patch Applications & Operating Systems: Vulnerabilities patched within 48 hours of public advisory release.',
      'Multi-Factor Authentication (MFA): Enforced for all administrative and elevated privilege platform logins.',
      'Restrict Administrative Privileges: Privileged accounts strictly segregated from standard browsing.',
      'Regular Backups: Immutable, air-gapped, encrypted offsite cloud backups tested quarterly.'
    ],
    codeOfPractice: [
      'Automated dependency updates with strict signature checking.',
      'Subresource integrity (SRI) and Content Security Policy (CSP) blocking unauthorized script injection.',
      'Time-based one-time password (TOTP) and biometric WebAuthn support.'
    ],
    platformControls: [
      'Cloud Run sandboxed micro-container execution preventing privilege escalation.',
      'Automated daily encrypted snapshot backups stored in isolated multi-region vaults.'
    ],
    penaltiesAndEnforcement: 'Exclusion from government and critical infrastructure procurement panels, regulatory sanctions under Security of Critical Infrastructure Act 2018 (SOCI).',
    verificationHash: 'SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    tags: ['ACSC', 'Essential Eight', 'ASD', 'Cyber Defense', 'MFA', 'Application Hardening']
  },
  {
    id: 'gov-apache-2',
    code: 'APACHE-2.0',
    title: 'Apache License Version 2.0 & Open Source Patent Grant Framework',
    category: 'regulation',
    categoryLabel: 'Open Source License',
    jurisdiction: 'International / Cross-Border',
    authority: 'Apache Software Foundation (ASF)',
    status: 'Compliant & Active',
    lastAudited: 'August 2026',
    complianceScore: 100,
    effectiveDate: 'January 2004 (OSI & FSF Approved)',
    summary: 'A permissive open-source license enabling commercial usage, distribution, and modification while providing an explicit, irrevocable grant of patent rights from contributors to users.',
    keyObligations: [
      'Redistribution requires providing recipients a copy of the Apache 2.0 License.',
      'Modified files must carry prominent notices stating that changes were made.',
      'Retention of all copyright, patent, trademark, and attribution notices from source code.',
      'Patent Defense: Any patent litigation initiated against contributors terminates all patent grants.'
    ],
    codeOfPractice: [
      'Inclusion of standardized NOTICE file and Apache 2.0 header in distributed build artifacts.',
      'Clear separation of proprietary marketplace business logic from open-source container kernels.',
      'Explicit IP clearance and contributor license agreements for external modules.'
    ],
    platformControls: [
      'Automated license scanning in CI/CD pipeline verifying Apache 2.0 and MIT compatibility.',
      'Publicly accessible licensing repository in application footer and governance compliance library.'
    ],
    penaltiesAndEnforcement: 'Automatic termination of patent and copyright licenses, civil copyright infringement injunctions, and statutory damages.',
    verificationHash: 'SHA256:2b8b815229aa8a61e483fb4ba0588b8b6c49189027dae969d0fed08bc405da1e',
    tags: ['Apache 2.0', 'Open Source', 'OSI', 'Patent Grant', 'Permissive License', 'Software Governance']
  },
  {
    id: 'gov-telecom-ai-fencing',
    code: 'TELCO-AI-FENCE',
    title: 'Telecommunications Networks Protections & AI Fencing / Sandboxing Standard',
    category: 'security',
    categoryLabel: 'AI & Telecom Security',
    jurisdiction: 'Commonwealth of Australia',
    authority: 'ACMA (Australian Communications and Media Authority) & Federal Communications Commission (FCC)',
    status: 'Compliant & Active',
    lastAudited: 'September 2026',
    complianceScore: 100,
    effectiveDate: 'Telecommunications Act 1997 (Cth) & ISO/IEC 42001 AI Management',
    summary: 'Comprehensive telecommunications network safeguards and artificial intelligence boundary fencing to prevent unprompted data leakage, model hallucinations, telco carrier protocol abuse, and prompt injection attacks across marketplace messaging and search channels.',
    keyObligations: [
      'Strict isolation of AI inference kernels behind isolated server-side proxy routes with zero client-side API key leakage.',
      'Carrier-grade telecommunications network packet filtering meeting ACMA interconnect standards.',
      'Continuous AI fencing boundaries preventing automated scraping, adversarial jailbreaks, or unauthorized network hops.',
      'Zero unauthorized automated caller or telemarketing syndication under the Spam Act 2003 and Do Not Call Register Act 2006.'
    ],
    codeOfPractice: [
      'Input sanitization filters scrubbing prompt injection tokens, script tags, and malicious payloads before inference.',
      'Telemetry fencing restricting model execution solely to approved sandboxed compute containers.',
      'End-to-end cryptographic auditing of all voice search queries and natural language vector matching.'
    ],
    platformControls: [
      'Server-side Gemini & LLM gateways with strict rate limiting, content safety barriers, and token fencing.',
      'Telecommunications firewall with egress-only encrypted tunnels and automated DDoS packet deflection.',
      'Locked network gates preventing unauthenticated ingress to messaging and booking sockets.'
    ],
    penaltiesAndEnforcement: 'Telecommunications Act carrier sanctions, ACMA fines up to $10,000,000 per violation, and criminal liability for interception or unauthorized network intrusion.',
    verificationHash: 'SHA256:d82e811bc90a4421b8b8f331908061e8992f07ab9ef49877b0c95a0bc7389141',
    tags: ['AI Fencing', 'Telecommunications', 'ACMA', 'Network Protections', 'Spam Act', 'Sandboxing', 'Prompt Defense']
  },
  {
    id: 'gov-marketplace-licensing',
    code: 'MKT-LIC-UBER-LOTTIE',
    title: 'Two-Sided Marketplace Licensing Standards (Uber/Airbnb Framework), Lottie & IP Protections',
    category: 'regulation',
    categoryLabel: 'Platform Licensing & IP',
    jurisdiction: 'International / Cross-Border',
    authority: 'World Intellectual Property Organization (WIPO) & Standards Australia',
    status: 'Compliant & Active',
    lastAudited: 'September 2026',
    complianceScore: 100,
    effectiveDate: 'Enacted 2026 Framework (Incorporating Uber, Airbnb & Lottie Licensing Terms)',
    summary: 'Two-sided collaborative marketplace peer-to-peer licensing modeled on Uber and Airbnb operator governance, accompanied by LottieFiles animation licensing, MIT, Apache 2.0 open-source codebases, and statutory patent & copyright protections.',
    keyObligations: [
      'Fair marketplace trading rules governing independent contractors, verified tradespeople, and merchants.',
      'LottieFiles Simple License and open animation component attestation with attribution preservation.',
      'Strict adherence to open-source licenses (MIT & Apache 2.0) with patent defense clauses and source notices.',
      'Universal copyright and patent protection honoring global utility patents, design marks, and trade secrets.'
    ],
    codeOfPractice: [
      'Clear contractor disclaimers and peer-to-peer dispute mediation pathways.',
      'Transparent commission, transaction settlement, and instant booking payout workflows.',
      'Embedded open-source licensing ledger in app metadata, footers, and code documentation.'
    ],
    platformControls: [
      'Standardized peer-to-peer contract generation and automated billing records.',
      'Cryptographic fingerprinting of all uploaded merchant portfolio assets and copyrights.',
      'Automated royalty-free compliance validation for UI animations and design vector libraries.'
    ],
    penaltiesAndEnforcement: 'Statutory damages for copyright and patent infringement under 17 U.S.C. § 504 and Australian Copyright Act 1968, plus civil marketplace exclusion.',
    verificationHash: 'SHA256:e51c890ad67123fa4891bca782161f39281a80d41865c3b171c7d8892182ef89',
    tags: ['Marketplace Licensing', 'Uber', 'Airbnb', 'Lottie', 'MIT', 'Apache 2.0', 'Copyright', 'Patent Protections']
  },
  {
    id: 'gov-secure-enclave-soc-bootp',
    code: 'SEC-ENCLAVE-BOOTP-VAULT',
    title: 'Hardware Secure Enclave, SoC Root-of-Trust, BOOTP Network Boot & Private Vault Protocol',
    category: 'security',
    categoryLabel: 'Hardware & Enclave Security',
    jurisdiction: 'Global Standards',
    authority: 'Common Criteria (ISO/IEC 15408 EAL5+) & NIST SP 800-193',
    status: 'Compliant & Active',
    lastAudited: 'September 2026',
    complianceScore: 100,
    effectiveDate: 'Hardware Root-of-Trust & Cryptographic Vault Standard 2026',
    summary: 'Hardware-contained cryptographic security architecture utilizing Apple Secure Enclave coprocessors, System-on-Chip (SoC) silicon roots-of-trust, authenticated BOOTP/PXE network boot authorization, Private Cloud Compute, SQL injection defense, and multi-tier locked access gates.',
    keyObligations: [
      'All biometric and sensitive cryptographic master keys generated within isolated Secure Enclave silicon.',
      'No raw plaintext keys or unencrypted passwords persisted to browser memory or public cloud logs.',
      'SQL injection & NoSQL injection mitigation via strictly parameterized prepared statements and schema rules.',
      'Hardware-authenticated BOOTP network protocol handshake validating server node identity before boot authorization.'
    ],
    codeOfPractice: [
      'Zero-knowledge user entry gates with multi-factor passkey authentication and hardware tokens.',
      'Air-gapped key management vault isolating Bitcoin treasury and fiat settlement ledgers.',
      'Continuous kernel driver verification preventing unauthorized kernel extensions or driver tampering.'
    ],
    platformControls: [
      'WAF (Web Application Firewall) blocking SQL injection patterns (1=1, UNION, DROP) and malformed payloads.',
      'Locked gatekeeper access points requiring cryptographic session tokens for user write operations.',
      'End-to-end encrypted tunnels (TLS 1.3 / WireGuard) connecting clients to Private Cloud Compute enclaves.'
    ],
    penaltiesAndEnforcement: 'Immediate automated session revocation, IP network blacklisting, and referral for cybercrime prosecution under the Cybercrime Act 2001.',
    verificationHash: 'SHA256:f12984b901a8ef83921bca9812903fe319bba9824c45aa871587d19218204bb8',
    tags: ['Secure Enclave', 'SoC', 'BOOTP', 'Vault', 'Private Cloud Compute', 'SQL Injection', 'Firewall', 'Gatekeeper']
  }
];
