import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const performBrowserSearch = async (query: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the rendering engine for "Cat Browser", the fastest browser in Yellow OS. 
      The user has entered the following URL or search query: "${query}".
      
      Generate the content of this "webpage" using semantic HTML structure. 
      - If it looks like a search query, show search results.
      - If it looks like a URL, simulate the landing page of that website.
      - Theme the results with subtle cat-related puns where appropriate (e.g. "Purr-fect results").
      - Keep the design clean, modern, and readable. Use yellow accents.
      - Use standard tags (h1, h2, p, ul, button, img placeholder).
      - For images, use <img src="https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/400" alt="random" style="border-radius: 12px; margin: 15px 0; width: 100%; object-fit: cover;" />
      - Do NOT include <html>, <head>, or <body> tags.
      - Do NOT use Markdown backticks. Return raw HTML string.`,
    });

    return response.text || "<h1>404 Not Found</h1><p>Cat Browser could not catch this page.</p>";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `<div style="text-align: center; padding: 40px;"><h1 style="color: #ef4444;">Connection Error</h1><p>Cat Browser got distracted by a laser pointer.</p></div>`;
  }
};

export const parseSystemIntent = async (input: string): Promise<{action: 'open' | 'search' | 'answer', target?: string, content?: string}> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user is using a "Spotlight Search" in an OS. Parse their intent: "${input}".
            Return a JSON object with:
            - action: 'open' (if they want to open an app like 'browser', 'settings', 'camera', 'photos', 'games', 'excel', 'notes'), 'search' (if they want to find info), or 'answer' (for general chat).
            - target: the app ID if action is 'open', or the search query if 'search'.
            - content: a short, helpful response if action is 'answer'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        action: { type: Type.STRING },
                        target: { type: Type.STRING },
                        content: { type: Type.STRING }
                    },
                    required: ['action']
                }
            }
        });
        return JSON.parse(response.text);
    } catch (e) {
        return { action: 'search', target: input };
    }
}

export const generateNoteContent = async (topic: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a short, professional work note about: "${topic}".`
        });
        return response.text || "Could not generate note.";
    } catch (e) {
        return "Error generating note.";
    }
}