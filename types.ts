
export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string; // Bullet points or paragraph
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  link?: string;
}

export interface Education {
  id: string;
  degree: string; // e.g. Bachelor, Master, 本科 (学历)
  major: string;  // e.g. Computer Science, 计算机科学 (专业)
  school: string;
  year: string; // Legacy/Fallback string (e.g. "2018 - 2022")
  startDate?: string; // New: YYYY-MM
  endDate?: string;   // New: YYYY-MM or "Present"
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  avatar?: string; // Base64 image string
  age?: string;
  gender?: string; // New field
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: SkillItem[];
}

export enum TemplateType {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  MINIMAL = 'MINIMAL',
  SIDEBAR = 'SIDEBAR',
}

export type Language = 'en' | 'zh';

export const INITIAL_RESUME_STATE: ResumeData = {
  personalInfo: {
    fullName: "Alex Doe",
    email: "alex.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexdoe",
    website: "alexdoe.dev",
    avatar: "",
    age: "28",
    gender: "Male"
  },
  summary: "Results-oriented software engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications and optimizing backend performance.",
  experience: [
    {
      id: '1',
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      startDate: "2021-03",
      endDate: "Present",
      description: "• Led a team of 5 developers in rebuilding the core checkout payment microservice.\n• Reduced API latency by 40% through caching strategies and database indexing.\n• Mentored junior developers and conducted code reviews."
    },
    {
      id: '2',
      title: "Software Developer",
      company: "Creative Startups LLC",
      startDate: "2018-06",
      endDate: "2021-02",
      description: "• Developed responsive UI components using React and Tailwind CSS.\n• Integrated third-party APIs for map services and email notifications.\n• Collaborated with designers to ensure pixel-perfect implementation."
    }
  ],
  projects: [
    {
      id: '1',
      name: "E-commerce Analytics Dashboard",
      role: "Frontend Lead",
      startDate: "2020-01",
      endDate: "2020-06",
      description: "• Built a real-time analytics dashboard using React, D3.js, and WebSocket.\n• Optimized data visualization performance for large datasets.",
      link: "github.com/alexdoe/analytics"
    }
  ],
  education: [
    {
      id: '1',
      degree: "B.S.",
      major: "Computer Science",
      school: "University of Technology",
      year: "2018 - 2022",
      startDate: "2018-09",
      endDate: "2022-06"
    }
  ],
  skills: [
    { id: '1', name: "React", level: 90 },
    { id: '2', name: "TypeScript", level: 85 },
    { id: '3', name: "Node.js", level: 80 },
    { id: '4', name: "AWS", level: 75 },
    { id: '5', name: "Python", level: 70 },
    { id: '6', name: "GraphQL", level: 65 },
    { id: '7', name: "Docker", level: 60 }
  ]
};
