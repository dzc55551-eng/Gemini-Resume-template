
import React, { useState, useRef, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import TemplateRenderer from './components/TemplateRenderer';
import KnowledgeBase from './components/KnowledgeBase';
import { parseResumeWithGemini, translateResume } from './services/geminiService';
import { ResumeData, TemplateType, INITIAL_RESUME_STATE, Language } from './types';

const APP_STRINGS = {
  en: {
    appTitle: "AI Resume Architect",
    uploadBtn: "Upload Resume (PDF/Word/Img)",
    uploadBtnMedium: "Upload Resume",
    uploadBtnShort: "Upload", // Mobile short version
    uploadTooltip: "Supports PDF, Word, Images",
    analyzing: "Analyzing...",
    exportBtn: "Export PDF",
    exportBtnShort: "Export", // Mobile short version
    exporting: "Generating PDF...",
    selectTemplate: "Choose Template",
    parseError: "Could not extract data from this file. Please try a different file or fill manually.",
    fileSizeError: "File is too large. Please upload a file smaller than 5MB.",
    translating: "Translating...",
    knowledgeBase: "Knowledge Base",
    tabEditor: "Editor",
    tabPreview: "Preview"
  },
  zh: {
    appTitle: "AI 智能简历助手",
    uploadBtn: "上传简历 (PDF/Word/图片)",
    uploadBtnMedium: "上传简历",
    uploadBtnShort: "上传",
    uploadTooltip: "支持 PDF, Word, 图片",
    analyzing: "正在分析...",
    exportBtn: "导出 PDF",
    exportBtnShort: "导出",
    exporting: "正在生成 PDF...",
    selectTemplate: "选择模板",
    parseError: "无法从该文件中提取数据。请尝试其他文件或手动填写。",
    fileSizeError: "文件过大，请上传小于 5MB 的文件。",
    translating: "正在翻译...",
    knowledgeBase: "职场知识库",
    tabEditor: "编辑简历",
    tabPreview: "实时预览"
  }
};

const TEMPLATE_NAMES = {
  en: {
    [TemplateType.MODERN]: "Modern",
    [TemplateType.CLASSIC]: "Classic",
    [TemplateType.MINIMAL]: "Minimal",
    [TemplateType.SIDEBAR]: "Sidebar",
    [TemplateType.FRESH_GRAD]: "Fresh Grad"
  },
  zh: {
    [TemplateType.MODERN]: "现代",
    [TemplateType.CLASSIC]: "经典",
    [TemplateType.MINIMAL]: "极简",
    [TemplateType.SIDEBAR]: "侧边栏",
    [TemplateType.FRESH_GRAD]: "应届生"
  }
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_STATE);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.MODERN);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  
  // Mobile responsiveness states
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [previewScale, setPreviewScale] = useState<number>(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const t = APP_STRINGS[language];

  // Auto-scale preview on resize
  useEffect(() => {
    const calculateScale = () => {
        if (previewWrapperRef.current) {
            const availableWidth = previewWrapperRef.current.clientWidth;
            // A4 width is approx 210mm (~794px at 96 DPI). 
            // We add 32px padding (16px each side) consideration.
            const standardWidth = 794 + 40; 
            
            // Only scale down if screen is smaller than A4
            if (availableWidth < standardWidth) {
                // Subtract some padding from available width to prevent edge touching
                setPreviewScale((availableWidth - 20) / 794); 
            } else {
                setPreviewScale(1);
            }
        }
    };

    // Calculate initially and on resize/tab switch
    calculateScale();
    // Small timeout to allow layout to settle when switching tabs
    const timer = setTimeout(calculateScale, 100);
    
    window.addEventListener('resize', calculateScale);
    return () => {
        window.removeEventListener('resize', calculateScale);
        clearTimeout(timer);
    };
  }, [mobileTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsParsing(true);
    setError(null);

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(t.fileSizeError);
      }

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const parsedData = await parseResumeWithGemini(base64Data, file.type, language);
      
      if (parsedData) {
        setResumeData(parsedData);
        // On mobile, switch to editor to show parsed results first, or preview? 
        // Let's stay on editor so user can verify.
      } else {
        setError(t.parseError);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to parse resume.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportPdf = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;
    
    setIsExporting(true);
    
    const cleanName = resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_");
    
    const opt = {
      margin: 0,
      filename: `${cleanName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        // Temporarily reset scale for export if needed, but html2pdf handles DOM element. 
        // We might need to clone or ensure the scale transform doesn't affect PDF generation.
        // Actually html2pdf takes the element layout. 
        // Best practice: clone the node, remove transform, append to body (hidden), export, then remove.
        // However, simple window.print() is often more robust for A4.
        
      // @ts-ignore
      if (window.html2pdf) {
        // @ts-ignore
        await window.html2pdf().set(opt).from(element).save();
      } else {
        console.warn('html2pdf not loaded, falling back to window.print()');
        document.title = `${cleanName}_Resume`;
        window.print();
      }
    } catch (e) {
      console.error("PDF Export Error:", e);
      alert("PDF export failed. Trying browser print...");
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const toggleLanguage = async () => {
    if (isTranslating) return;

    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    
    setIsTranslating(true);
    try {
        const translatedData = await translateResume(resumeData, newLang);
        setResumeData(translatedData);
    } catch (e) {
        console.error("Translation failed:", e);
        alert(language === 'zh' ? "Content translation failed, but UI language changed." : "内容翻译失败，但界面语言已切换。");
    } finally {
        setIsTranslating(false);
    }
  };

  return (
    <div id="app-container" className="h-screen w-full flex flex-col bg-gray-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 shrink-0 no-print z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-sm sm:text-xl font-bold text-gray-800 truncate">{t.appTitle}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
           {/* Knowledge Base Button */}
           <button
            onClick={() => setIsKnowledgeBaseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex"
            title={t.knowledgeBase}
           >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-medium text-sm">{t.knowledgeBase}</span>
          </button>
           <button
            onClick={() => setIsKnowledgeBaseOpen(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
            title={t.knowledgeBase}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button 
            onClick={toggleLanguage}
            disabled={isTranslating}
            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm font-medium transition-colors ${isTranslating ? 'cursor-wait opacity-70' : ''}`}
            title="Switch language"
          >
            {isTranslating ? (
                <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <>
                    <span className={language === 'zh' ? 'text-gray-900 font-bold' : 'text-gray-500'}>中</span>
                    <span className="text-gray-400">/</span>
                    <span className={language === 'en' ? 'text-gray-900 font-bold' : 'text-gray-500'}>EN</span>
                </>
            )}
          </button>

          <div className="relative group" title={t.uploadTooltip}>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf, .png, .jpg, .jpeg, .docx, .doc"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isParsing}
            />
            <button 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                    isParsing 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
            >
              {isParsing ? (
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="hidden lg:inline">{t.uploadBtn}</span>
                    <span className="hidden sm:inline lg:hidden">{t.uploadBtnMedium}</span>
                    <span className="inline sm:hidden">{t.uploadBtnShort}</span>
                </>
              )}
            </button>
          </div>
          
          <button 
            onClick={handleExportPdf}
            disabled={isExporting}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap text-xs sm:text-base ${
                isExporting 
                ? "bg-gray-700 text-gray-300 cursor-wait" 
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
             {isExporting ? (
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
             ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="hidden sm:inline">{t.exportBtn}</span>
                    <span className="inline sm:hidden">{t.exportBtnShort}</span>
                </>
             )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      {/* On Mobile: toggle between editor/preview. On Desktop: flex-row split. */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Editor Sidebar */}
        <aside 
            className={`
                flex-col border-r border-gray-200 bg-white z-10 no-print transition-all duration-200
                w-full md:w-1/3 md:min-w-[350px] md:max-w-[500px] md:flex
                ${mobileTab === 'preview' ? 'hidden' : 'flex'}
            `}
        >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t.selectTemplate}</label>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                 {[TemplateType.MODERN, TemplateType.CLASSIC, TemplateType.MINIMAL, TemplateType.SIDEBAR, TemplateType.FRESH_GRAD].map((templateType) => (
                    <button 
                        key={templateType} 
                        onClick={() => setActiveTemplate(templateType)}
                        className={`text-sm py-2 px-1 rounded border transition-all ${
                            activeTemplate === templateType 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                        }`}
                    >
                        {TEMPLATE_NAMES[language][templateType]}
                    </button>
                 ))}
               </div>
            </div>
            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 text-sm flex items-start gap-2 border-b border-red-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                <ResumeForm data={resumeData} onChange={setResumeData} language={language} />
            </div>
        </aside>

        {/* Right: Live Preview */}
        <main 
            ref={previewWrapperRef}
            className={`
                bg-gray-200 overflow-y-auto p-4 md:p-8 justify-center print-container relative
                w-full md:flex-1 md:flex
                ${mobileTab === 'editor' ? 'hidden' : 'flex'}
            `}
        >
          {/* We wrap the resume in a scaling container for mobile */}
          <div 
             className="relative origin-top transition-transform duration-200 print:transform-none"
             style={{ 
                 transform: `scale(${previewScale})`,
                 width: '210mm', // Fixed A4 width
                 // Add height to wrapper based on scale to prevent massive whitespace if we wanted, 
                 // but since overflow is auto on parent, it's okay. 
                 marginBottom: `${(1 - previewScale) * -100}%` // Hack to reduce bottom whitespace when scaled down
             }}
          >
              <div id="resume-preview" className="w-[210mm] min-h-[297mm] bg-white shadow-2xl print-container">
                 <TemplateRenderer template={activeTemplate} data={resumeData} language={language} />
              </div>
          </div>
        </main>
      </div>

       {/* Mobile Bottom Navigation - Visible only on small screens */}
       <div className="md:hidden h-16 bg-white border-t border-gray-200 flex shrink-0 z-40 no-print">
            <button 
                onClick={() => setMobileTab('editor')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 ${
                    mobileTab === 'editor' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-xs font-medium">{t.tabEditor}</span>
            </button>
            <div className="w-px bg-gray-100 h-full"></div>
            <button 
                onClick={() => setMobileTab('preview')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 ${
                    mobileTab === 'preview' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs font-medium">{t.tabPreview}</span>
            </button>
       </div>

       {/* Knowledge Base Sidebar */}
       <KnowledgeBase 
          isOpen={isKnowledgeBaseOpen} 
          onClose={() => setIsKnowledgeBaseOpen(false)} 
          language={language} 
        />
    </div>
  );
};

export default App;
