
import React, { useState } from 'react';
import { Language } from '../types';

interface KnowledgeBaseProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Article {
  title: string;
  content: string; // Supports basic HTML line breaks
}

interface Category {
  id: string;
  name: string;
  articles: Article[];
}

const KNOWLEDGE_DATA = {
  en: [
    {
      id: 'resume',
      name: 'Resume Tips',
      articles: [
        {
          title: 'The STAR Method',
          content: 'Use the STAR method to describe your experiences:\n\n• **Situation**: Set the scene.\n• **Task**: Describe your responsibility.\n• **Action**: Explain what steps you took.\n• **Result**: Share outcomes (use numbers!).'
        },
        {
          title: 'Action Verbs',
          content: 'Start bullet points with strong action verbs like "Led", "Developed", "Increased", "Optimized" rather than passive phrases like "Responsible for".'
        },
        {
          title: 'ATS Optimization',
          content: 'Keep formatting simple. Use standard headings. Include keywords from the job description to pass Applicant Tracking Systems.'
        }
      ]
    },
    {
      id: 'interview',
      name: 'Interview Prep',
      articles: [
        {
          title: 'Tell Me About Yourself',
          content: 'Keep it professional. Briefly cover your past, focus on your current achievements, and explain why you are interested in this specific role and future goals.'
        },
        {
          title: 'Greatest Weakness',
          content: 'Choose a real weakness but show how you are working to improve it. Example: "I sometimes struggle with public speaking, so I joined a Toastmasters club to practice."'
        }
      ]
    }
  ],
  zh: [
    {
      id: 'resume',
      name: '简历撰写技巧',
      articles: [
        {
          title: 'STAR 法则',
          content: '使用 STAR 法则描述你的经历，让成就更具说服力：\n\n• **情境 (Situation)**: 任务背景是什么？\n• **任务 (Task)**: 你面临的挑战或目标？\n• **行动 (Action)**: 你具体做了什么？\n• **结果 (Result)**: 取得了什么可量化的成果？'
        },
        {
          title: '拒绝“流水账”',
          content: '不要只列出工作职责（Responsible for...）。要强调你的贡献。例如，将“负责销售”改为“通过新客户开发策略，使季度销售额增长了 20%”。'
        },
        {
          title: '排版与关键词',
          content: 'HR 浏览简历通常只需 6-10 秒。确保重点突出，使用加粗字体强调技能和数据。根据职位描述（JD）调整简历中的关键词。'
        }
      ]
    },
    {
      id: 'interview',
      name: '面试通关秘籍',
      articles: [
        {
          title: '自我介绍范式',
          content: '公式：我是谁 + 我的核心亮点/成就 + 我为什么匹配这个岗位。\n控制在 2-3 分钟内，不要背诵简历，要讲故事。'
        },
        {
          title: '如何回答“你的缺点”',
          content: '不要说“过于追求完美”这种假缺点。说一个真实的、非核心能力的缺点，并重点描述你正在如何改进它。例如：“我在公开演讲方面比较紧张，所以我正在主动参与团队分享会来锻炼自己。”'
        },
        {
          title: '反向提问环节',
          content: '面试结束时不要说“没问题了”。可以问：“团队目前的重点目标是什么？”、“您对这个职位的理想人选有什么期待？”，这能体现你的积极性。'
        }
      ]
    },
    {
      id: 'career',
      name: '职场生存法则',
      articles: [
        {
          title: '向上管理',
          content: '定期主动汇报进度，不要等老板问。遇到问题带上方案去请示，而不仅仅是带去问题。了解老板的优先事项。'
        },
        {
          title: '高效沟通',
          content: '结论先行。在邮件或汇报中，先说结果或核心观点，再展开论述细节（金字塔原理）。'
        }
      ]
    }
  ]
};

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ isOpen, onClose, language }) => {
  const data: Category[] = KNOWLEDGE_DATA[language] || KNOWLEDGE_DATA['en'];
  const [openCategory, setOpenCategory] = useState<string | null>('resume');
  const [isImaOpen, setIsImaOpen] = useState<boolean>(false);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity no-print"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out no-print flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-bold">{language === 'zh' ? '职场知识库' : 'Knowledge Base'}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          
          {/* Tencent IMA Collapsible Section */}
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
            <button
              onClick={() => setIsImaOpen(!isImaOpen)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all text-left"
            >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">
                        {language === 'zh' ? '腾讯ima知识库' : 'Tencent IMA Knowledge Base'}
                    </h3>
                    <p className="text-xs text-gray-500">
                         {language === 'zh' ? 'AI 智能知识管理' : 'AI Knowledge Management'}
                    </p>
                 </div>
               </div>
               <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-400 transition-transform ${isImaOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isImaOpen && (
              <div className="p-3 bg-white border-t border-blue-100 flex flex-col gap-2">
                {/* Resume Templates */}
                <a 
                    href="https://ima.qq.com/wiki/?shareId=7740f75ea6d7cb22ff2fbdcca34c82b996064ba6af4b6ce8390ccfc534e0c120"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors border border-indigo-100 group w-full"
                >
                    <div className="p-1.5 bg-white rounded-md text-indigo-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm flex-1">
                        {language === 'zh' ? '精选个人简历模板' : 'Selected Resume Templates'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>

                {/* HR Knowledge Base */}
                <a 
                    href="https://ima.qq.com/wiki/?shareId=7baecdcbf548190c5d1c454fa0c6d4c8d4cbc0adcf0df6d0e02c9d8f303b6ff5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-100 group w-full"
                >
                    <div className="p-1.5 bg-white rounded-md text-purple-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm flex-1">
                        {language === 'zh' ? '猎头HR全能知识库' : 'Recruiter & HR Knowledge Base'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>

                {/* PPT Templates */}
                <a 
                    href="https://ima.qq.com/wiki/?shareId=9fb6880e2f8c931d817cf410e60ec5bab68bea9345901a5d606a5f9f1fd81e4b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors border border-orange-100 group w-full"
                >
                    <div className="p-1.5 bg-white rounded-md text-orange-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm flex-1">
                        {language === 'zh' ? 'PPT模板大全' : 'PPT Template Collection'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>

                {/* Excel Templates */}
                <a 
                    href="https://ima.qq.com/wiki/?shareId=90aecfe61c4b5f999dc9ebbc47bf189396276afe211c9cfc7448cdda12a80602"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors border border-green-100 group w-full"
                >
                    <div className="p-1.5 bg-white rounded-md text-green-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm flex-1">
                        {language === 'zh' ? 'Excel模板大全' : 'Excel Template Collection'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {data.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-gray-800">{category.name}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-500 transition-transform ${openCategory === category.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openCategory === category.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    {category.articles.map((article, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-100 last:border-0">
                        <h4 className="font-bold text-blue-600 text-sm mb-2 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block"></span>
                           {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-3.5">
                          {article.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Tip */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-medium">
              {language === 'zh' 
                ? 'AI 助手提示：优秀的简历不仅需要好的内容，更需要清晰的结构。使用知识库中的技巧来优化你的描述吧！' 
                : 'AI Tip: A great resume needs both good content and clear structure. Use these tips to optimize your descriptions!'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBase;
