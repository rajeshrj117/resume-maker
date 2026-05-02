import { JobProfile } from '../types';

export const JOB_PROFILES: Record<string, JobProfile> = {
  software_engineer: {
    id: 'software_engineer', title: 'Software Engineer',
    suggestedSkills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'Python', 'AWS', 'Docker', 'GraphQL'],
    suggestedSummary: 'Innovative Software Engineer with 5+ years building scalable web applications. Proven track record of optimizing systems for performance and reliability.',
    suggestedHighlights: ['Developed microservice architecture using Node.js and Docker, improving reliability by 40%.', 'Optimized React frontend bundle sizes, reducing page load times by 35%.', 'Mentored 4 junior developers and established agile best practices.']
  },
  frontend_developer: {
    id: 'frontend_developer', title: 'Frontend Developer',
    suggestedSkills: ['React', 'Vue.js', 'TypeScript', 'CSS3', 'Tailwind', 'Webpack', 'Jest', 'Figma'],
    suggestedSummary: 'Creative Frontend Developer specializing in modern JavaScript frameworks and pixel-perfect responsive interfaces with focus on UX.',
    suggestedHighlights: ['Built responsive e-commerce platform serving 100k+ daily users.', 'Reduced bundle size by 45% through code-splitting strategies.', 'Implemented WCAG 2.1 AA compliance across all major user flows.']
  },
  backend_developer: {
    id: 'backend_developer', title: 'Backend Developer',
    suggestedSkills: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'Redis', 'MongoDB', 'REST APIs', 'Microservices'],
    suggestedSummary: 'Experienced Backend Developer architecting robust APIs and distributed systems handling millions of requests daily.',
    suggestedHighlights: ['Designed RESTful APIs supporting 5M+ daily requests with 99.9% uptime.', 'Optimized PostgreSQL queries reducing response times by 60%.', 'Implemented event-driven architecture using Kafka and microservices.']
  },
  fullstack_developer: {
    id: 'fullstack_developer', title: 'Full Stack Developer',
    suggestedSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Next.js', 'GraphQL'],
    suggestedSummary: 'Versatile Full Stack Developer with end-to-end ownership of web applications, from database design to UI implementation.',
    suggestedHighlights: ['Led full-stack rebuild of legacy platform, increasing performance 3x.', 'Architected and deployed cloud-native SaaS handling $2M+ ARR.', 'Built real-time collaboration features used by 50k+ users.']
  },
  data_scientist: {
    id: 'data_scientist', title: 'Data Scientist',
    suggestedSkills: ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-Learn', 'Tableau'],
    suggestedSummary: 'Analytical Data Scientist with strong foundation in statistical modeling and machine learning. Adept at transforming complex datasets into actionable insights.',
    suggestedHighlights: ['Engineered churn prediction model improving retention by 18%.', 'Designed automated ETL pipelines handling 10M+ daily data points.', 'Identified core KPIs resulting in 12% revenue lift.']
  },
  data_analyst: {
    id: 'data_analyst', title: 'Data Analyst',
    suggestedSkills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'R', 'Google Analytics'],
    suggestedSummary: 'Detail-oriented Data Analyst transforming raw data into strategic business insights through advanced visualization and statistical analysis.',
    suggestedHighlights: ['Built executive dashboards in Tableau reducing reporting time by 70%.', 'Conducted A/B tests on 50+ campaigns, optimizing conversions by 23%.', 'Automated weekly reporting saving 15 hours per week.']
  },
  ml_engineer: {
    id: 'ml_engineer', title: 'Machine Learning Engineer',
    suggestedSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Kubernetes', 'AWS SageMaker', 'Docker'],
    suggestedSummary: 'ML Engineer specializing in productionizing machine learning models at scale with robust MLOps practices.',
    suggestedHighlights: ['Deployed recommendation engine serving 1M+ users with <100ms latency.', 'Built automated ML training pipeline reducing model iteration time by 5x.', 'Improved model accuracy by 23% through advanced feature engineering.']
  },
  devops_engineer: {
    id: 'devops_engineer', title: 'DevOps Engineer',
    suggestedSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Ansible', 'Linux', 'Python'],
    suggestedSummary: 'DevOps Engineer specializing in cloud infrastructure, CI/CD automation, and Kubernetes orchestration for highly scalable systems.',
    suggestedHighlights: ['Migrated monolithic infrastructure to Kubernetes, reducing costs by 40%.', 'Built CI/CD pipelines reducing deployment time from hours to minutes.', 'Implemented IaC with Terraform for reproducible cloud environments.']
  },
  cloud_architect: {
    id: 'cloud_architect', title: 'Cloud Architect',
    suggestedSkills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Microservices', 'Solution Design'],
    suggestedSummary: 'Strategic Cloud Architect designing scalable, cost-effective multi-cloud solutions for enterprise applications.',
    suggestedHighlights: ['Architected multi-region cloud infrastructure for global SaaS company.', 'Reduced cloud costs by $500k annually through optimization initiatives.', 'Led cloud migration of 50+ enterprise applications.']
  },
  cybersecurity_analyst: {
    id: 'cybersecurity_analyst', title: 'Cybersecurity Analyst',
    suggestedSkills: ['SIEM', 'Penetration Testing', 'Network Security', 'Python', 'Wireshark', 'CISSP', 'Risk Assessment'],
    suggestedSummary: 'Vigilant Cybersecurity Analyst protecting enterprise infrastructure through proactive threat detection and incident response.',
    suggestedHighlights: ['Reduced security incidents by 65% through enhanced SIEM monitoring.', 'Conducted penetration testing identifying critical vulnerabilities.', 'Led incident response team handling 200+ security events annually.']
  },
  product_manager: {
    id: 'product_manager', title: 'Product Manager',
    suggestedSkills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'A/B Testing', 'Jira', 'SQL', 'Figma'],
    suggestedSummary: 'Strategic Product Manager guiding cross-functional teams from ideation to successful market launch with data-driven prioritization.',
    suggestedHighlights: ['Launched B2B SaaS feature generating $1.2M ARR within first year.', 'Conducted 50+ user interviews increasing NPS by 15 points.', 'Coordinated 15-person team shipping deliverables consistently on time.']
  },
  project_manager: {
    id: 'project_manager', title: 'Project Manager',
    suggestedSkills: ['PMP', 'Agile', 'Scrum', 'Risk Management', 'Stakeholder Management', 'Jira', 'MS Project'],
    suggestedSummary: 'PMP-certified Project Manager delivering complex initiatives on time and within budget across multiple industries.',
    suggestedHighlights: ['Managed $5M portfolio of digital transformation projects.', 'Delivered 25+ projects on time with 98% stakeholder satisfaction.', 'Implemented Agile methodologies improving team velocity by 40%.']
  },
  ui_ux_designer: {
    id: 'ui_ux_designer', title: 'UI/UX Designer',
    suggestedSkills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    suggestedSummary: 'Creative UI/UX Designer crafting intuitive, inclusive, and visually stunning digital experiences balancing user needs with business objectives.',
    suggestedHighlights: ['Redesigned mobile app increasing daily engagement by 22%.', 'Created design system reducing front-end design debt by 30%.', 'Facilitated weekly usability testing yielding iterative improvements.']
  },
  graphic_designer: {
    id: 'graphic_designer', title: 'Graphic Designer',
    suggestedSkills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography', 'Layout Design'],
    suggestedSummary: 'Innovative Graphic Designer with passion for visual storytelling and brand identity development across digital and print media.',
    suggestedHighlights: ['Designed brand identities for 30+ clients across multiple industries.', 'Created marketing materials increasing campaign engagement by 45%.', 'Won 3 industry design awards for creative excellence.']
  },
  digital_marketer: {
    id: 'digital_marketer', title: 'Digital Marketing Specialist',
    suggestedSkills: ['SEO', 'Google Analytics', 'Social Media Ads', 'Email Marketing', 'Copywriting', 'CRM'],
    suggestedSummary: 'Results-oriented Digital Marketer with extensive knowledge in SEO, performance marketing, and content strategy driving traffic and conversions.',
    suggestedHighlights: ['Managed $250k annual ad budget delivering consistent 4.2x ROAS.', 'Boosted organic traffic by 120% through SEO and content strategy.', 'Increased email click-through rates by 25% through automation.']
  },
  content_writer: {
    id: 'content_writer', title: 'Content Writer',
    suggestedSkills: ['SEO Writing', 'Copywriting', 'Content Strategy', 'WordPress', 'Editing', 'Research'],
    suggestedSummary: 'Versatile Content Writer crafting compelling narratives across blogs, marketing copy, and long-form content with strong SEO focus.',
    suggestedHighlights: ['Wrote 200+ SEO-optimized articles ranking on page 1 of Google.', 'Developed content strategy increasing organic traffic by 180%.', 'Established editorial guidelines maintained by 10+ contributors.']
  },
  social_media_manager: {
    id: 'social_media_manager', title: 'Social Media Manager',
    suggestedSkills: ['Instagram', 'TikTok', 'Hootsuite', 'Content Creation', 'Analytics', 'Influencer Marketing'],
    suggestedSummary: 'Strategic Social Media Manager building engaged communities and viral content campaigns across multiple platforms.',
    suggestedHighlights: ['Grew Instagram following from 5k to 150k organically in 18 months.', 'Created viral TikTok campaign generating 10M+ impressions.', 'Managed influencer partnerships generating $500k in attributed revenue.']
  },
  sales_executive: {
    id: 'sales_executive', title: 'Sales Executive',
    suggestedSkills: ['B2B Sales', 'Salesforce', 'Negotiation', 'Lead Generation', 'CRM', 'Account Management'],
    suggestedSummary: 'High-performing Sales Executive consistently exceeding quotas through consultative selling and strong client relationships.',
    suggestedHighlights: ['Exceeded sales quota by 145% for 3 consecutive years.', 'Built pipeline of $5M+ in enterprise deals annually.', 'Closed largest company deal worth $1.2M ARR.']
  },
  business_analyst: {
    id: 'business_analyst', title: 'Business Analyst',
    suggestedSkills: ['SQL', 'Tableau', 'Excel', 'Process Mapping', 'Requirements Gathering', 'Stakeholder Management'],
    suggestedSummary: 'Detail-oriented Business Analyst bridging technical teams and business stakeholders to deliver impactful solutions.',
    suggestedHighlights: ['Analyzed business processes identifying $800k in annual savings.', 'Documented requirements for 15+ enterprise software implementations.', 'Created KPI dashboards used by C-suite for strategic decisions.']
  },
  hr_manager: {
    id: 'hr_manager', title: 'HR Manager',
    suggestedSkills: ['Talent Acquisition', 'Employee Relations', 'HRIS', 'Performance Management', 'Compliance'],
    suggestedSummary: 'Strategic HR Manager building high-performing teams through talent acquisition, development programs, and employee engagement initiatives.',
    suggestedHighlights: ['Reduced employee turnover by 35% through engagement programs.', 'Recruited 50+ employees across engineering and product teams.', 'Implemented performance management system improving review quality.']
  },
  financial_analyst: {
    id: 'financial_analyst', title: 'Financial Analyst',
    suggestedSkills: ['Financial Modeling', 'Excel', 'SQL', 'Forecasting', 'Valuation', 'Bloomberg', 'PowerPoint'],
    suggestedSummary: 'Analytical Financial Analyst with expertise in financial modeling, forecasting, and investment analysis for Fortune 500 companies.',
    suggestedHighlights: ['Built financial models for $50M+ M&A transactions.', 'Created budget forecasts within 2% accuracy for 3 years running.', 'Identified $2M cost savings through expense analysis.']
  },
  accountant: {
    id: 'accountant', title: 'Accountant',
    suggestedSkills: ['QuickBooks', 'Excel', 'GAAP', 'Tax Preparation', 'Auditing', 'SAP', 'Financial Reporting'],
    suggestedSummary: 'CPA-certified Accountant with expertise in financial reporting, tax compliance, and audit preparation for mid-size companies.',
    suggestedHighlights: ['Managed monthly close process for company with $20M revenue.', 'Reduced audit findings by 60% through process improvements.', 'Implemented new accounting software saving 20 hours per month.']
  },
  teacher: {
    id: 'teacher', title: 'Teacher / Educator',
    suggestedSkills: ['Curriculum Design', 'Classroom Management', 'Differentiated Instruction', 'EdTech', 'Assessment'],
    suggestedSummary: 'Passionate Educator with expertise in differentiated instruction and student-centered learning for diverse classroom environments.',
    suggestedHighlights: ['Improved standardized test scores by 25% over 2 years.', 'Designed innovative STEM curriculum adopted district-wide.', 'Mentored 5 first-year teachers through onboarding program.']
  },
  nurse: {
    id: 'nurse', title: 'Registered Nurse',
    suggestedSkills: ['Patient Care', 'EMR', 'IV Therapy', 'Critical Care', 'BLS', 'ACLS', 'Patient Education'],
    suggestedSummary: 'Compassionate Registered Nurse with 7+ years in critical care providing exceptional patient outcomes and family support.',
    suggestedHighlights: ['Maintained 98% patient satisfaction scores in ICU setting.', 'Trained 15+ new nurses through preceptorship program.', 'Implemented protocol reducing hospital-acquired infections by 40%.']
  },
  doctor: {
    id: 'doctor', title: 'Physician / Doctor',
    suggestedSkills: ['Patient Diagnosis', 'Treatment Planning', 'EMR', 'Clinical Research', 'Medical Procedures'],
    suggestedSummary: 'Board-certified Physician with extensive clinical experience providing comprehensive patient care and evidence-based treatment.',
    suggestedHighlights: ['Treated 2,000+ patients annually with 95% positive outcomes.', 'Published 5 peer-reviewed articles in medical journals.', 'Led clinical trials advancing treatment protocols in specialty area.']
  },
  lawyer: {
    id: 'lawyer', title: 'Attorney / Lawyer',
    suggestedSkills: ['Legal Research', 'Litigation', 'Contract Drafting', 'Negotiation', 'Westlaw', 'Trial Preparation'],
    suggestedSummary: 'Skilled Attorney with proven track record in complex litigation, contract negotiation, and corporate compliance.',
    suggestedHighlights: ['Won $5M+ in client settlements through strategic litigation.', 'Drafted and negotiated 100+ commercial contracts annually.', 'Represented Fortune 500 clients in regulatory compliance matters.']
  },
  customer_support: {
    id: 'customer_support', title: 'Customer Support Specialist',
    suggestedSkills: ['Zendesk', 'Salesforce', 'Communication', 'Problem Solving', 'CRM', 'Live Chat'],
    suggestedSummary: 'Dedicated Customer Support Specialist resolving complex customer issues with empathy and technical expertise.',
    suggestedHighlights: ['Maintained 4.9/5.0 customer satisfaction rating handling 100+ tickets daily.', 'Reduced average response time by 50% through workflow optimization.', 'Created knowledge base articles reducing support tickets by 30%.']
  },
  operations_manager: {
    id: 'operations_manager', title: 'Operations Manager',
    suggestedSkills: ['Process Improvement', 'Supply Chain', 'Lean Six Sigma', 'Team Leadership', 'KPI Tracking'],
    suggestedSummary: 'Results-driven Operations Manager streamlining processes and leading cross-functional teams to achieve operational excellence.',
    suggestedHighlights: ['Improved operational efficiency by 35% through Lean Six Sigma initiatives.', 'Managed team of 40+ across multiple departments and locations.', 'Reduced operating costs by $1.5M annually through process redesign.']
  },
  qa_engineer: {
    id: 'qa_engineer', title: 'QA Engineer',
    suggestedSkills: ['Selenium', 'Cypress', 'Jest', 'API Testing', 'Test Automation', 'JIRA', 'Postman', 'CI/CD'],
    suggestedSummary: 'Quality-focused QA Engineer building robust test automation frameworks ensuring exceptional product quality.',
    suggestedHighlights: ['Built test automation framework reducing regression time by 80%.', 'Identified 500+ critical bugs preventing production incidents.', 'Mentored team of 5 QA engineers in automation best practices.']
  },
  mechanical_engineer: {
    id: 'mechanical_engineer', title: 'Mechanical Engineer',
    suggestedSkills: ['SolidWorks', 'AutoCAD', 'CATIA', 'FEA', 'CAD/CAM', 'Manufacturing', 'GD&T'],
    suggestedSummary: 'Innovative Mechanical Engineer designing and optimizing complex mechanical systems from concept to production.',
    suggestedHighlights: ['Designed mechanical components for products generating $10M+ revenue.', 'Reduced manufacturing costs by 25% through design optimization.', 'Led cross-functional team developing patent-pending product.']
  }
};

export const INITIAL_RESUME_DATA = {
  personalInfo: {
    fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', jobTitle: '', photo: ''
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [
    { id: '1', category: 'Technical Skills', items: [] },
    { id: '2', category: 'Soft Skills', items: [] }
  ],
  projects: [],
  certifications: []
};
