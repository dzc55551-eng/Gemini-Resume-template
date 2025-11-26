
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Language } from "../types";

declare global {
  interface Window {
    mammoth: any;
  }
}

const parseResumeWithGemini = async (base64Data: string, mimeType: string, language: Language = 'en'): Promise<ResumeData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Define the schema for structured output
    const resumeSchema = {
      type: Type.OBJECT,
      properties: {
        personalInfo: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            age: { type: Type.STRING },
            gender: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            website: { type: Type.STRING },
          },
        },
        summary: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              startDate: { type: Type.STRING, description: "YYYY-MM format or Present" },
              endDate: { type: Type.STRING, description: "YYYY-MM format or Present" },
              description: { type: Type.STRING },
            },
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              startDate: { type: Type.STRING, description: "YYYY-MM format" },
              endDate: { type: Type.STRING, description: "YYYY-MM format" },
              description: { type: Type.STRING },
              link: { type: Type.STRING },
            },
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING },
              major: { type: Type.STRING },
              school: { type: Type.STRING },
              year: { type: Type.STRING },
              startDate: { type: Type.STRING, description: "YYYY-MM format" },
              endDate: { type: Type.STRING, description: "YYYY-MM format" },
            },
          },
        },
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["personalInfo", "experience", "education", "skills"],
    };

    const promptText = language === 'zh' 
      ? "请从附件中提取简历信息，并按照指定的 JSON 结构输出。请注意：1. 将教育经历中的'学历'和'专业'分开提取。2. 所有时间字段请尽量标准化为 'YYYY-MM' 格式（如 2023-01），如果是'至今'请填 'Present'。3. 尽量提取教育经历的开始和结束时间。4. 如果简历中有年龄和性别信息，请提取。如果某个字段缺失，请保留为空字符串。请将工作经历和项目经历的描述总结为简洁的要点。"
      : "Extract the resume information from the attached document into the specified JSON structure. Notes: 1. Extract 'degree' and 'major' separately for education. 2. Standardize all dates to 'YYYY-MM' format where possible, use 'Present' for current roles. 3. Extract start and end dates for education. 4. Extract age and gender if available. If a field is missing, leave it as an empty string. Summarize experience and project descriptions into concise bullet points.";

    let contents;

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOCX via mammoth.js extraction
        if (!window.mammoth) {
            throw new Error("Docx parser (mammoth) is not loaded.");
        }

        // Convert Base64 to ArrayBuffer
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // Extract raw text
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        const extractedText = result.value;
        
        contents = {
            parts: [
                { text: `Resume Text Content:\n${extractedText}` },
                { text: promptText }
            ]
        };
    } else {
        // Handle PDF/Image via Gemini native vision/document understanding
        contents = {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                {
                    text: promptText,
                },
            ],
        };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as any;
    
    // Add IDs to arrays for React keys since the API won't generate them
    const processedData: ResumeData = {
      personalInfo: {
        fullName: parsed.personalInfo?.fullName || "",
        email: parsed.personalInfo?.email || "",
        phone: parsed.personalInfo?.phone || "",
        location: parsed.personalInfo?.location || "",
        linkedin: parsed.personalInfo?.linkedin || "",
        website: parsed.personalInfo?.website || "",
        age: parsed.personalInfo?.age || "",
        gender: parsed.personalInfo?.gender || "",
        avatar: "", // Initialize as empty
      },
      summary: parsed.summary || "",
      experience: (parsed.experience || []).map((exp: any) => ({ ...exp, id: crypto.randomUUID() })),
      projects: (parsed.projects || []).map((proj: any) => ({ ...proj, id: crypto.randomUUID() })),
      education: (parsed.education || []).map((edu: any) => ({ 
        ...edu, 
        id: crypto.randomUUID(),
        degree: edu.degree || "",
        major: edu.major || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || ""
      })),
      // Map simple strings to SkillItem objects with a default high proficiency
      skills: (parsed.skills || []).map((skill: string) => ({
        id: crypto.randomUUID(),
        name: skill,
        level: 80 // Default level for parsed skills
      })),
    };

    return processedData;

  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw error;
  }
};

const translateResume = async (data: ResumeData, targetLanguage: Language): Promise<ResumeData> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");

        const ai = new GoogleGenAI({ apiKey });

        const translationSchema = {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  age: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  website: { type: Type.STRING },
                },
              },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                },
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING },
                    link: { type: Type.STRING },
                  },
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    major: { type: Type.STRING },
                    school: { type: Type.STRING },
                    year: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                  },
                },
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
        };

        const targetLangName = targetLanguage === 'zh' ? "Simplified Chinese" : "English";
        
        // Prepare the data to be translated (excluding IDs and avatar to save tokens/complexity)
        const contentToTranslate = {
            personalInfo: { ...data.personalInfo, avatar: undefined }, // Exclude avatar base64
            summary: data.summary,
            experience: data.experience.map(({ id, ...rest }) => rest),
            projects: data.projects.map(({ id, ...rest }) => rest),
            education: data.education.map(({ id, ...rest }) => rest),
            skills: data.skills.map(s => s.name) // Just translate names
        };

        const prompt = `Translate the following resume JSON data into ${targetLangName}. 
        Rules:
        1. Maintain the exact JSON structure.
        2. Translate 'summary', 'description', 'title', 'role', 'degree', 'major', 'school', 'location', 'gender' and skill names.
        3. Do NOT translate proper nouns (like names of people or specific tech stack names like React, Python) if they are usually kept in original language, but translate company names if appropriate or provide transliteration.
        4. Convert 'Present' to '至今' if translating to Chinese, and '至今' to 'Present' if translating to English.
        5. Return the result in the specified JSON schema.
        
        JSON Data to translate:
        ${JSON.stringify(contentToTranslate)}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from translation");

        const parsed = JSON.parse(text);

        // Merge translated data back with original IDs and Avatar
        // We add || [] fallbacks to prevent errors if the AI returns partial data
        return {
            personalInfo: {
                ...(parsed.personalInfo || {}),
                avatar: data.personalInfo.avatar, // Restore avatar
                age: parsed.personalInfo?.age || data.personalInfo.age,
                gender: parsed.personalInfo?.gender || data.personalInfo.gender
            },
            summary: parsed.summary || "",
            experience: (parsed.experience || []).map((exp: any, index: number) => ({
                ...exp,
                id: data.experience[index]?.id || crypto.randomUUID()
            })),
            projects: (parsed.projects || []).map((proj: any, index: number) => ({
                ...proj,
                id: data.projects[index]?.id || crypto.randomUUID()
            })),
            education: (parsed.education || []).map((edu: any, index: number) => ({
                ...edu,
                id: data.education[index]?.id || crypto.randomUUID()
            })),
            skills: (parsed.skills || []).map((skillName: string, index: number) => ({
                id: data.skills[index]?.id || crypto.randomUUID(),
                name: skillName,
                level: data.skills[index]?.level || 80
            }))
        };

    } catch (error) {
        console.error("Translation error:", error);
        throw error;
    }
};

export { parseResumeWithGemini, translateResume };
