
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
    fullName: "张三",
    email: "zhang.san@example.com",
    phone: "138 0013 8000",
    location: "北京, 中国",
    linkedin: "linkedin.com/in/zhangsan",
    website: "zhangsan.dev",
    avatar: "",
    age: "28",
    gender: "男"
  },
  summary: "结果导向型软件工程师，拥有 5 年以上全栈开发经验。在交付可扩展的 Web 应用程序和优化后端性能方面拥有良好的记录。",
  experience: [
    {
      id: '1',
      title: "高级软件工程师",
      company: "科技解决方案有限公司",
      startDate: "2021-03",
      endDate: "至今",
      description: "• 带领 5 人开发团队重构核心支付微服务。\n• 通过缓存策略和数据库索引将 API 延迟降低了 40%。\n• 指导初级开发人员并进行代码审查。"
    },
    {
      id: '2',
      title: "软件开发工程师",
      company: "创新创业 LLC",
      startDate: "2018-06",
      endDate: "2021-02",
      description: "• 使用 React 和 Tailwind CSS 开发响应式 UI 组件。\n• 集成第三方 API 用于地图服务和电子邮件通知。\n• 与设计师合作确保像素级完美实现。"
    }
  ],
  projects: [
    {
      id: '1',
      name: "电商分析仪表盘",
      role: "前端负责人",
      startDate: "2020-01",
      endDate: "2020-06",
      description: "• 使用 React、D3.js 和 WebSocket 构建实时分析仪表盘。\n• 优化大数据集的数据可视化性能。",
      link: "github.com/zhangsan/analytics"
    }
  ],
  education: [
    {
      id: '1',
      degree: "本科",
      major: "计算机科学",
      school: "科技大学",
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
