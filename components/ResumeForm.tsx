
import React, { useState } from 'react';
import { ResumeData, Experience, Education, Language, SkillItem, Project } from '../types';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  language: Language;
}

const FORM_LABELS = {
  en: {
    sections: {
      personal: "Personal",
      summary: "Summary",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      skills: "Skills"
    },
    personal: {
      title: "Personal Information",
      avatar: "Profile Photo",
      uploadAvatar: "Upload Photo",
      removeAvatar: "Remove",
      fullName: "Full Name",
      age: "Age",
      gender: "Gender",
      email: "Email",
      phone: "Phone",
      location: "Location",
      linkedin: "LinkedIn",
      website: "Website/Portfolio"
    },
    summary: {
      title: "Professional Summary",
      label: "Bio",
      placeholder: "Briefly describe your professional background and key achievements..."
    },
    experience: {
      title: "Experience",
      add: "+ Add Job",
      jobTitle: "Job Title",
      company: "Company",
      startDate: "Start Date",
      endDate: "End Date",
      description: "Description (Bullet points)",
      present: "Present"
    },
    projects: {
      title: "Projects",
      add: "+ Add Project",
      name: "Project Name",
      role: "Your Role",
      startDate: "Start Date",
      endDate: "End Date",
      description: "Description",
      link: "Link (Optional)",
      present: "Ongoing"
    },
    education: {
      title: "Education",
      add: "+ Add School",
      school: "School",
      degree: "Degree",
      major: "Major",
      courses: "Main Courses",
      year: "Year",
      startDate: "Start Date",
      endDate: "Graduation Date",
      present: "Present"
    },
    skills: {
      title: "Skills",
      add: "+ Add Skill",
      name: "Skill Name",
      level: "Proficiency (%)"
    }
  },
  zh: {
    sections: {
      personal: "个人信息",
      summary: "自我评价",
      experience: "工作经历",
      projects: "项目经历",
      education: "教育经历",
      skills: "技能专长"
    },
    personal: {
      title: "个人信息",
      avatar: "头像照片",
      uploadAvatar: "上传照片",
      removeAvatar: "删除",
      fullName: "姓名",
      age: "年龄",
      gender: "性别",
      email: "电子邮箱",
      phone: "联系电话",
      location: "所在城市",
      linkedin: "LinkedIn / 社交主页",
      website: "个人网站 / 作品集"
    },
    summary: {
      title: "自我评价",
      label: "简介",
      placeholder: "简要描述您的职业背景、核心竞争力及主要成就..."
    },
    experience: {
      title: "工作经历",
      add: "+ 添加工作",
      jobTitle: "职位名称",
      company: "公司名称",
      startDate: "开始时间",
      endDate: "结束时间",
      description: "工作内容 (建议使用条列式)",
      present: "至今"
    },
    projects: {
      title: "项目经历",
      add: "+ 添加项目",
      name: "项目名称",
      role: "担任角色",
      startDate: "开始时间",
      endDate: "结束时间",
      description: "项目描述",
      link: "项目链接 (选填)",
      present: "进行中"
    },
    education: {
      title: "教育经历",
      add: "+ 添加学校",
      school: "学校名称",
      degree: "学历 (如: 本科)",
      major: "专业 (如: 计算机)",
      courses: "主修课程",
      year: "毕业年份",
      startDate: "入学时间",
      endDate: "毕业时间",
      present: "至今"
    },
    skills: {
      title: "技能专长",
      add: "+ 添加技能",
      name: "技能名称",
      level: "熟练度 (%)"
    }
  }
};

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, language }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof FORM_LABELS['en']['sections']>('personal');
  const labels = FORM_LABELS[language];

  const handlePersonalInfoChange = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalInfoChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (section: 'experience' | 'projects' | 'education' | 'skills', id: string, field: string, value: any) => {
    const list = data[section] as any[];
    const newList = list.map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, [section]: newList });
  };

  const addItem = (section: 'experience' | 'projects' | 'education' | 'skills') => {
    const id = crypto.randomUUID();
    let newItem;
    
    if (section === 'experience') {
      newItem = { id, title: '', company: '', startDate: '', endDate: '', description: '' };
    } else if (section === 'projects') {
      newItem = { id, name: '', role: '', startDate: '', endDate: '', description: '', link: '' };
    } else if (section === 'education') {
      newItem = { id, school: '', degree: '', major: '', courses: '', year: '', startDate: '', endDate: '' };
    } else {
      newItem = { id, name: '', level: 80 };
    }

    onChange({ ...data, [section]: [...(data[section] as any[]), newItem] });
  };

  const removeItem = (section: 'experience' | 'projects' | 'education' | 'skills', id: string) => {
    const list = data[section] as any[];
    onChange({ ...data, [section]: list.filter(item => item.id !== id) });
  };

  const tabs = [
    { id: 'personal', label: labels.sections.personal },
    { id: 'summary', label: labels.sections.summary },
    { id: 'experience', label: labels.sections.experience },
    { id: 'projects', label: labels.sections.projects },
    { id: 'education', label: labels.sections.education },
    { id: 'skills', label: labels.sections.skills },
  ];

  // Helper component for date range inputs
  const DateRangeInputs = ({ 
    startDate, 
    endDate, 
    onStartChange, 
    onEndChange, 
    labelStart, 
    labelEnd, 
    labelPresent 
  }: { 
    startDate: string, 
    endDate: string, 
    onStartChange: (val: string) => void, 
    onEndChange: (val: string) => void,
    labelStart: string,
    labelEnd: string,
    labelPresent: string
  }) => {
    const isPresent = endDate === 'Present' || endDate === '至今' || endDate === 'Ongoing' || endDate === '进行中';
    const presentValue = language === 'zh' ? '至今' : 'Present';

    return (
      <div className="grid grid-cols-2 gap-3">
          <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{labelStart}</label>
              <input 
                  type="month" 
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={startDate}
                  onChange={(e) => onStartChange(e.target.value)}
              />
          </div>
          <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
                  {labelEnd}
                  <label className="flex items-center gap-1 cursor-pointer font-normal text-blue-600">
                      <input 
                          type="checkbox" 
                          className="w-3 h-3"
                          checked={isPresent}
                          onChange={(e) => onEndChange(e.target.checked ? presentValue : '')}
                      />
                      <span className="text-[10px] uppercase tracking-wide">{labelPresent}</span>
                  </label>
              </label>
              {isPresent ? (
                   <div className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-sm text-gray-500 italic">
                       {presentValue}
                   </div>
              ) : (
                  <input 
                      type="month" 
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      value={endDate}
                      onChange={(e) => onEndChange(e.target.value)}
                  />
              )}
          </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div 
        className="flex w-full overflow-x-auto border-b border-gray-200 bg-white touch-pan-x"
        style={{ scrollbarWidth: 'thin' }} // Firefox
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-none px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.personal.title}</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                {data.personalInfo.avatar ? (
                  <img src={data.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-2xl">📷</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                  {labels.personal.uploadAvatar}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
                {data.personalInfo.avatar && (
                   <button 
                      onClick={() => handlePersonalInfoChange('avatar', '')}
                      className="text-red-500 text-xs hover:underline text-left"
                   >
                     {labels.personal.removeAvatar}
                   </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.fullName}</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={data.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.age}</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={data.personalInfo.age || ''}
                      onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.gender}</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={data.personalInfo.gender || ''}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.phone}</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={data.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.email}</label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={data.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.location}</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={data.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.linkedin}</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.personal.website}</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={data.personalInfo.website}
                  onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {activeTab === 'summary' && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.summary.title}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels.summary.label}</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder={labels.summary.placeholder}
                  value={data.summary}
                  onChange={(e) => onChange({...data, summary: e.target.value})}
                />
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{labels.experience.title}</h3>
                <button onClick={() => addItem('experience')} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    {labels.experience.add}
                </button>
             </div>
             <div className="space-y-6">
                {data.experience.map((exp) => (
                    <div key={exp.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
                        <button 
                            onClick={() => removeItem('experience', exp.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.experience.company}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={exp.company}
                                    onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.experience.jobTitle}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={exp.title}
                                    onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)}
                                />
                            </div>

                            <DateRangeInputs 
                                startDate={exp.startDate}
                                endDate={exp.endDate}
                                onStartChange={(val) => updateItem('experience', exp.id, 'startDate', val)}
                                onEndChange={(val) => updateItem('experience', exp.id, 'endDate', val)}
                                labelStart={labels.experience.startDate}
                                labelEnd={labels.experience.endDate}
                                labelPresent={labels.experience.present}
                            />

                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.experience.description}</label>
                                <textarea 
                                    className="w-full p-2 border border-gray-300 rounded text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    value={exp.description}
                                    onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{labels.projects.title}</h3>
                <button onClick={() => addItem('projects')} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    {labels.projects.add}
                </button>
             </div>
             <div className="space-y-6">
                {data.projects.map((proj) => (
                    <div key={proj.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
                        <button 
                            onClick={() => removeItem('projects', proj.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.projects.name}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={proj.name}
                                    onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.projects.role}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={proj.role}
                                    onChange={(e) => updateItem('projects', proj.id, 'role', e.target.value)}
                                />
                            </div>
                            
                            <DateRangeInputs 
                                startDate={proj.startDate}
                                endDate={proj.endDate}
                                onStartChange={(val) => updateItem('projects', proj.id, 'startDate', val)}
                                onEndChange={(val) => updateItem('projects', proj.id, 'endDate', val)}
                                labelStart={labels.projects.startDate}
                                labelEnd={labels.projects.endDate}
                                labelPresent={labels.projects.present}
                            />

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.projects.link}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={proj.link || ''}
                                    onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.projects.description}</label>
                                <textarea 
                                    className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    value={proj.description}
                                    onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{labels.education.title}</h3>
                <button onClick={() => addItem('education')} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    {labels.education.add}
                </button>
             </div>
             <div className="space-y-6">
                {data.education.map((edu) => (
                    <div key={edu.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
                        <button 
                            onClick={() => removeItem('education', edu.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.education.school}</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={edu.school}
                                    onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{labels.education.degree}</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                        value={edu.degree}
                                        onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{labels.education.major}</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                        value={edu.major}
                                        onChange={(e) => updateItem('education', edu.id, 'major', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{labels.education.courses}</label>
                                <textarea 
                                    className="w-full p-2 border border-gray-300 rounded text-sm h-16 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    value={edu.courses || ''}
                                    onChange={(e) => updateItem('education', edu.id, 'courses', e.target.value)}
                                    placeholder={language === 'zh' ? '例：微观经济学、会计学原理...' : 'e.g. Microeconomics, Accounting...'}
                                />
                            </div>

                            <DateRangeInputs 
                                startDate={edu.startDate || ''}
                                endDate={edu.endDate || ''}
                                onStartChange={(val) => updateItem('education', edu.id, 'startDate', val)}
                                onEndChange={(val) => updateItem('education', edu.id, 'endDate', val)}
                                labelStart={labels.education.startDate}
                                labelEnd={labels.education.endDate}
                                labelPresent={labels.education.present}
                            />

                             {/* Fallback Year Input (Hidden if startDate is used, or kept for backward compatibility if needed, but better to just replace) */}
                             {(!edu.startDate && !edu.endDate && edu.year) && (
                                 <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 text-orange-400">{labels.education.year} (Legacy)</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-orange-200 rounded text-sm bg-orange-50"
                                        placeholder="e.g. 2018 - 2022"
                                        value={edu.year}
                                        onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)}
                                    />
                                </div>
                             )}
                        </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{labels.skills.title}</h3>
                <button onClick={() => addItem('skills')} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    {labels.skills.add}
                </button>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {data.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                         <div className="flex-1">
                             <input 
                                type="text" 
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                placeholder={labels.skills.name}
                                value={skill.name}
                                onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                             />
                         </div>
                         <div className="w-20">
                              <input 
                                type="number" 
                                min="0" max="100"
                                className="w-full p-1.5 border border-gray-300 rounded text-sm"
                                placeholder="%"
                                value={skill.level}
                                onChange={(e) => updateItem('skills', skill.id, 'level', parseInt(e.target.value) || 0)}
                             />
                         </div>
                        <button 
                            onClick={() => removeItem('skills', skill.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
