
import React from 'react';
import { ResumeData, TemplateType, Language } from '../types';

interface TemplateProps {
  data: ResumeData;
  language: Language;
}

const SECTION_HEADERS = {
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    projects: "Project Experience",
    education: "Education",
    skills: "Professional Skills",
    links: "Links",
    contact: "Contact",
    basicInfo: "Basic Info",
    selfEval: "Self Evaluation"
  },
  zh: {
    summary: "自我评价",
    experience: "工作经历",
    projects: "项目经历",
    education: "教育经历",
    skills: "专业技能",
    links: "作品链接",
    contact: "联系方式",
    basicInfo: "基本信息",
    selfEval: "自我评价"
  }
};

// Helper to format dates (e.g., "2023-01" -> "2023.01")
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "";
  // If it's "Present", "至今", or similar non-date strings, return as is
  if (dateStr.length < 5 || !dateStr.includes("-")) return dateStr;
  
  // Replace hyphen with dot for cleaner look
  return dateStr.replace("-", ".");
};

const formatRange = (start: string | undefined, end: string | undefined, legacyYear: string | undefined) => {
  if (start || end) {
    const s = formatDate(start);
    const e = formatDate(end);
    if (s && e) return `${s} - ${e}`;
    if (s) return `${s} - Present`; // Fallback if end is missing but start exists
    return e;
  }
  return legacyYear || "";
};

const ModernTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = SECTION_HEADERS[language];
  return (
    <div className="w-full h-full p-8 bg-white text-gray-800">
      <header className="border-b-4 border-blue-600 pb-6 mb-6 flex justify-between items-start">
        <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wide">{data.personalInfo.fullName}</h1>
            <div className="mt-2 text-sm flex flex-wrap gap-4 text-gray-600">
            {data.personalInfo.age && <span>🎂 {data.personalInfo.age}</span>}
            {data.personalInfo.gender && <span>⚧ {data.personalInfo.gender}</span>}
            {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
            {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
            </div>
        </div>
        {data.personalInfo.avatar && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0 ml-4">
                <img src={data.personalInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
           {data.summary && (
            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase">{t.summary}</h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase">{t.experience}</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-500 font-medium">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-blue-600 font-medium mb-2">{exp.company}</div>
                  <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {data.projects && data.projects.length > 0 && (
            <section>
                <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase">{t.projects}</h2>
                <div className="space-y-5">
                {data.projects.map((proj) => (
                    <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">{proj.name}</h3>
                             {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-600">🔗</a>}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                             {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                        </span>
                    </div>
                    {proj.role && <div className="text-blue-600 font-medium mb-1 text-sm">{proj.role}</div>}
                    <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                        {proj.description}
                    </div>
                    </div>
                ))}
                </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase">{t.education}</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                    <span className="text-sm text-gray-500">
                        {formatRange(edu.startDate, edu.endDate, edu.year)}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {edu.degree}
                    {edu.major && ` · ${edu.major}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-1 bg-gray-50 p-4 rounded-lg h-fit">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">{t.skills}</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
          
          {data.personalInfo.website && (
             <section className="mt-6">
               <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">{t.links}</h2>
               <div className="text-sm text-blue-600 truncate">{data.personalInfo.website}</div>
             </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ClassicTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = SECTION_HEADERS[language];
  return (
    <div className="w-full h-full p-10 bg-white text-gray-900 font-serif">
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <div className="text-sm space-x-3 text-gray-700">
          {data.personalInfo.age && <span>{data.personalInfo.age}</span>}
          {data.personalInfo.gender && <span>| {data.personalInfo.gender}</span>}
          {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
          {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo.email && <span>| {data.personalInfo.email}</span>}
        </div>
        {data.personalInfo.linkedin && <div className="text-sm mt-1">{data.personalInfo.linkedin}</div>}
      </div>

      <div className="space-y-6">
        {data.summary && (
          <section>
            <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase">{t.summary}</h2>
            <p className="text-sm leading-relaxed">{data.summary}</p>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold border-b border-gray-400 mb-4 uppercase">{t.experience}</h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-md">
                  <span>{exp.company}</span>
                  <span>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                </div>
                <div className="italic text-sm mb-1">{exp.title}</div>
                <div className="text-sm leading-snug whitespace-pre-line ml-4">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.projects && data.projects.length > 0 && (
            <section>
            <h2 className="text-lg font-bold border-b border-gray-400 mb-4 uppercase">{t.projects}</h2>
            <div className="space-y-5">
                {data.projects.map((proj) => (
                <div key={proj.id}>
                    <div className="flex justify-between font-bold text-md">
                        <span>{proj.name}</span>
                        <span>{formatDate(proj.startDate)} – {formatDate(proj.endDate)}</span>
                    </div>
                    {proj.role && <div className="italic text-sm mb-1">{proj.role}</div>}
                    <div className="text-sm leading-snug whitespace-pre-line ml-4">
                        {proj.description}
                    </div>
                </div>
                ))}
            </div>
            </section>
        )}

        <section>
          <h2 className="text-lg font-bold border-b border-gray-400 mb-4 uppercase">{t.education}</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                 <div className="flex justify-between font-bold text-sm">
                  <span>{edu.school}</span>
                  <span>{formatRange(edu.startDate, edu.endDate, edu.year)}</span>
                </div>
                <div className="text-sm italic">
                  {edu.degree}
                  {edu.major && `, ${edu.major}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase">{t.skills}</h2>
          <p className="text-sm leading-relaxed">
            {data.skills.map(s => s.name).join(" • ")}
          </p>
        </section>
      </div>
    </div>
  );
};

const MinimalTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = SECTION_HEADERS[language];
  return (
    <div className="w-full h-full p-8 bg-white text-slate-800 font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-2">{data.personalInfo.fullName}</h1>
          <p className="text-xl text-slate-500 font-light">{data.experience[0]?.title || "Professional"}</p>
        </div>
        <div className="text-right text-sm space-y-1 text-slate-500">
            {data.personalInfo.age && <div>{data.personalInfo.age}</div>}
            {data.personalInfo.gender && <div>{data.personalInfo.gender}</div>}
            <div>{data.personalInfo.email}</div>
            <div>{data.personalInfo.phone}</div>
            <div>{data.personalInfo.location}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-8">
           <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t.contact}</h3>
            <div className="space-y-2 text-sm">
               {data.personalInfo.linkedin && <div className="truncate">{data.personalInfo.linkedin}</div>}
               {data.personalInfo.website && <div className="truncate">{data.personalInfo.website}</div>}
            </div>
           </section>

           <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t.skills}</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="text-sm border-l-2 border-slate-200 pl-3">{skill.name}</span>
              ))}
            </div>
           </section>

           <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t.education}</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="font-bold">{edu.school}</div>
                  <div className="text-slate-500">
                    {edu.degree}
                    {edu.major && <span className="text-slate-400 block text-xs mt-0.5">{edu.major}</span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{formatRange(edu.startDate, edu.endDate, edu.year)}</div>
                </div>
              ))}
            </div>
           </section>
        </div>

        <div className="col-span-8 space-y-10">
           {data.summary && (
             <section>
                <p className="text-lg font-light leading-relaxed text-slate-700">{data.summary}</p>
             </section>
           )}

           <section>
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{t.experience}</h3>
             <div className="space-y-8">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="font-bold text-lg">{exp.title}</h4>
                       <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                         {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                       </span>
                    </div>
                    <div className="text-slate-500 mb-3">{exp.company}</div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
             </div>
           </section>

           {data.projects && data.projects.length > 0 && (
             <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{t.projects}</h3>
                <div className="space-y-8">
                    {data.projects.map((proj) => (
                    <div key={proj.id}>
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                                <h4 className="font-bold text-lg">{proj.name}</h4>
                                {proj.link && <a href={proj.link} className="text-slate-400 hover:text-blue-500 text-sm">↗</a>}
                           </div>
                           <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                               {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                           </span>
                        </div>
                        <div className="text-slate-500 mb-3">{proj.role}</div>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{proj.description}</p>
                    </div>
                    ))}
                </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
};

const SidebarTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = SECTION_HEADERS[language];
  const primaryColor = "bg-[#2563eb]"; // Blue-600
  
  // Helper for arrow header
  const ArrowHeader = ({ title }: { title: string }) => (
    <div className="relative mb-6">
      <div className={`relative z-10 inline-block text-white font-bold py-1.5 pl-6 pr-10 text-lg ${primaryColor}`}
           style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}>
        {title}
      </div>
      <div className="absolute bottom-0 left-0 w-full border-b-2 border-blue-600 translate-y-[-1px] opacity-30"></div>
    </div>
  );

  return (
    <div className="w-full h-full flex bg-white font-sans text-gray-800">
      {/* Left Sidebar */}
      <div className="w-[32%] bg-[#f1f5f9] p-6 flex flex-col gap-6 border-r border-gray-200">
        
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mb-4 shadow-sm flex items-center justify-center border-4 border-white">
                 {data.personalInfo.avatar ? (
                    <img src={data.personalInfo.avatar} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-4xl text-gray-500 font-bold">{data.personalInfo.fullName.charAt(0)}</span>
                 )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center leading-tight tracking-wide">{data.personalInfo.fullName}</h1>
        </div>

        {/* Basic Info */}
        <div className="text-sm space-y-3">
            {data.personalInfo.age && (
                <div className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '年龄:' : 'Age:'}</span>
                    <span className="text-gray-600">{data.personalInfo.age}</span>
                </div>
            )}
            {data.personalInfo.gender && (
                <div className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '性别:' : 'Gender:'}</span>
                    <span className="text-gray-600">{data.personalInfo.gender}</span>
                </div>
            )}
            {data.personalInfo.location && (
                <div className="flex gap-2">
                    <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '居住地:' : 'Loc:'}</span>
                    <span className="text-gray-600">{data.personalInfo.location}</span>
                </div>
            )}
            {data.personalInfo.phone && (
                <div className="flex gap-2">
                     <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '电话:' : 'Tel:'}</span>
                     <span className="text-gray-600">{data.personalInfo.phone}</span>
                </div>
            )}
            {data.personalInfo.email && (
                <div className="flex gap-2">
                     <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '邮箱:' : 'Email:'}</span>
                     <span className="text-gray-600 break-all">{data.personalInfo.email}</span>
                </div>
            )}
            {data.education[0] && (
                 <>
                    <div className="flex gap-2">
                        <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '学历:' : 'Degree:'}</span>
                        <span className="text-gray-600">
                            {data.education[0].degree}
                            {data.education[0].major && <span className="block text-xs text-gray-500">{data.education[0].major}</span>}
                        </span>
                    </div>
                     <div className="flex gap-2">
                        <span className="font-bold text-gray-700 min-w-[3.5em]">{language === 'zh' ? '院校:' : 'School:'}</span>
                        <span className="text-gray-600">{data.education[0].school}</span>
                    </div>
                 </>
            )}
        </div>

        {/* Skills with Progress Bars */}
        <section>
            <h2 className="text-lg font-bold text-blue-600 border-b border-blue-600 mb-3 pb-1">{t.skills}</h2>
            <div className="space-y-3">
                {data.skills.map((skill) => (
                    <div key={skill.id}>
                        <div className="flex justify-between text-sm font-medium mb-1 text-gray-700">
                            <span>{skill.name}</span>
                        </div>
                        <div className="w-full bg-gray-300 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Self Evaluation / Summary */}
        {data.summary && (
             <section>
                <h2 className="text-lg font-bold text-blue-600 border-b border-blue-600 mb-3 pb-1">{t.selfEval}</h2>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                    {data.summary}
                </p>
            </section>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 pt-10">
        
        {/* Education History */}
        <section className="mb-8">
            <ArrowHeader title={t.education} />
            <div className="space-y-4 pl-2">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative border-l-2 border-blue-100 pl-4 pb-2">
                         <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-2 ring-white"></div>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold text-gray-800">{edu.school}</h3>
                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 rounded">
                                {formatRange(edu.startDate, edu.endDate, edu.year)}
                            </span>
                        </div>
                        <div className="text-blue-600 font-medium">
                            {edu.degree} 
                            {edu.major && <span className="text-gray-600 font-normal"> | {edu.major}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Work Experience */}
        <section className="mb-8">
            <ArrowHeader title={t.experience} />
            <div className="space-y-8 pl-2">
                {data.experience.map((exp) => (
                    <div key={exp.id} className="relative border-l-2 border-blue-100 pl-4 pb-4">
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-2 ring-white"></div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{exp.title}</h3>
                                <div className="text-blue-600 font-medium">{exp.company}</div>
                            </div>
                            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
            <section>
                <ArrowHeader title={t.projects} />
                <div className="space-y-8 pl-2">
                    {data.projects.map((proj) => (
                        <div key={proj.id} className="relative border-l-2 border-blue-100 pl-4 pb-4">
                            <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-2 ring-white"></div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{proj.name}</h3>
                                    {proj.role && <div className="text-blue-600 font-medium">{proj.role}</div>}
                                </div>
                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                                </span>
                            </div>
                             {proj.link && <div className="text-xs text-blue-500 mb-2 truncate">{proj.link}</div>}
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {proj.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        )}

      </div>
    </div>
  );
};

interface RendererProps extends TemplateProps {
  template: TemplateType;
}

const TemplateRenderer: React.FC<RendererProps> = ({ template, data, language }) => {
  switch (template) {
    case TemplateType.MODERN:
      return <ModernTemplate data={data} language={language} />;
    case TemplateType.CLASSIC:
      return <ClassicTemplate data={data} language={language} />;
    case TemplateType.MINIMAL:
      return <MinimalTemplate data={data} language={language} />;
    case TemplateType.SIDEBAR:
      return <SidebarTemplate data={data} language={language} />;
    default:
      return <ModernTemplate data={data} language={language} />;
  }
};

export default TemplateRenderer;
