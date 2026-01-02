import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Eye, 
  Copy, 
  Check, 
  ArrowRightLeft,
  Terminal,
  Eraser,
  HelpCircle,
  X,
  Download,
  Save,
  Cloud,
  Loader2,
  Moon,
  Sun,
  Type,
  Layout,
  FileText,
  AlertTriangle
} from 'lucide-react';

const STORAGE_KEY = 'mdx_converter_content';
const THEME_KEY = 'mdx_converter_theme';

const DEFAULT_MDX = `# Heading Level 1
## Heading Level 2
### Heading Level 3

This tool converts **Markdown** with embedded **JSX** into clean HTML.

<div className="p-4 my-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
  <h3 className="text-blue-700 font-bold m-0">💡 JSX Component</h3>
  <p className="text-blue-600 m-0">
    I am a raw HTML/JSX block rendered safely inside Markdown.
  </p>
</div>

## Features
- Standard Markdown support
- HTML/JSX tag preservation
- Live preview

## Table Example
| Feature | Supported |
| :--- | :---: |
| Markdown | ✅ |
| JSX | ✅ |
| Tables | ✅ |

## Code Example
\`\`\`javascript
const greet = () => {
  console.log("Hello World");
}
\`\`\`

<button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
  Click Me (Styled Button)
</button>
`;

// --- Components ---

const Preloader = ({ isDarkMode }) => (
  <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
    <div className="relative flex items-center justify-center mb-6">
      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}></div>
      <div className={`relative p-4 rounded-2xl shadow-xl ${isDarkMode ? 'bg-slate-900 shadow-indigo-900/20' : 'bg-white shadow-indigo-100'}`}>
        <ArrowRightLeft className={`w-10 h-10 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} animate-pulse`} />
      </div>
    </div>
    <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
      MDX Converter
    </h2>
    <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Loading compiler core...</span>
    </div>
  </div>
);

const CheatSheet = ({ onClose, isDarkMode }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[85dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          <Terminal className="w-5 h-5 text-indigo-500" />
          Markdown & JSX Cheat Sheet
        </h2>
        <button 
          onClick={onClose}
          className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-0 overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className={`font-semibold sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            <tr>
              <th className={`p-3 border-b w-1/4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>Element</th>
              <th className={`p-3 border-b w-1/3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>Markdown Syntax</th>
              <th className={`p-3 border-b w-1/3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>Result / HTML</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800 text-slate-400' : 'divide-slate-100 text-slate-700'}`}>
            <tr>
              <td className="p-3 font-medium">Headings</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}># H1<br/>## H2<br/>### H3</td>
              <td className="p-3 font-mono opacity-70">&lt;h1&gt;...&lt;/h1&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Emphasis</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>**Bold**<br/>*Italic*<br/>~~Strike~~</td>
              <td className="p-3 font-mono opacity-70">&lt;strong&gt;, &lt;em&gt;, &lt;del&gt;</td>
            </tr>
             <tr>
              <td className="p-3 font-medium">Lists</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>- Item 1<br/>1. Numbered 1<br/>- [x] Task</td>
              <td className="p-3 font-mono opacity-70">&lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Links & Images</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>[Link](url)<br/>![Alt](img.jpg)</td>
              <td className="p-3 font-mono opacity-70">&lt;a&gt;, &lt;img /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Blockquote</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>&gt; Text</td>
              <td className="p-3 font-mono opacity-70">&lt;blockquote&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Code</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>`inline`<br/>```block```</td>
              <td className="p-3 font-mono opacity-70">&lt;code&gt;, &lt;pre&gt;</td>
            </tr>
             <tr>
              <td className="p-3 font-medium">Table</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                | H | H |<br/>
                | - | - |<br/>
                | C | C |
              </td>
              <td className="p-3 font-mono opacity-70">&lt;table&gt;...</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Line Break</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>&lt;br /&gt; <span className="opacity-50">or</span> (2 spaces)</td>
              <td className="p-3 font-mono opacity-70">&lt;br /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Horizontal Rule</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>--- <span className="opacity-50">or</span> ***</td>
              <td className="p-3 font-mono opacity-70">&lt;hr /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">JSX / HTML</td>
              <td className={`p-3 font-mono text-indigo-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>&lt;div class="..."&gt;</td>
              <td className="p-3 font-mono opacity-70">Preserved as is</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`p-4 border-t text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
);

const ClearConfirmation = ({ onConfirm, onCancel, isDarkMode }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}>
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold mb-2">Clear Editor?</h3>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          This will remove all text and clear your auto-saved data. This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <button 
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Yes, Clear
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  // Initialize content state
  const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved;
    }
    return DEFAULT_MDX;
  });

  // Initialize Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme === 'dark';
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'html'
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'output'
  const [htmlOutput, setHtmlOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [libLoaded, setLibLoaded] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Stats calculation
  const stats = {
    chars: input.length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0
  };

  // Load 'marked' library dynamically
  useEffect(() => {
    if (window.marked) {
      setTimeout(() => setLibLoaded(true), 800);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = () => {
      setTimeout(() => setLibLoaded(true), 800);
    };
    document.head.appendChild(script);
  }, []);

  // Auto-save logic
  useEffect(() => {
    const saveToStorage = setTimeout(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, input);
        setIsSaved(true);
      }
    }, 800);
    return () => clearTimeout(saveToStorage);
  }, [input]);

  // Theme Persistence logic
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    setIsSaved(false);
    setInput(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Trigger modal instead of native confirm
  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  // Actual clear logic
  const performClear = () => {
    setInput('');
    setIsSaved(false);
    setShowClearConfirm(false);
  };

  const formatHTML = (html) => {
    let formatted = '';
    let indent = '';
    html.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(2);
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += '  ';
    });
    return formatted.substring(1, formatted.length - 3);
  };

  useEffect(() => {
    if (!libLoaded || !window.marked) return;
    try {
      const preProcessed = input
        .replace(/className="/g, 'class="')
        .replace(/className='/g, "class='");

      const rawHtml = window.marked.parse(preProcessed, {
        breaks: true,
        gfm: true
      });
      const formattedHtml = formatHTML(rawHtml);
      setHtmlOutput(formattedHtml);
      setError(null);
    } catch (err) {
      console.error("Conversion failed:", err);
      setError(err.message);
    }
  }, [input, libLoaded]);

  const handleCopy = () => {
    const textToCopy = activeTab === 'html' ? htmlOutput : input;
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Styles generator function to handle theme changes in the preview content AND scrollbars
  const getGlobalStyles = (dark) => `
    /* Scrollbar Styling */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${dark ? '#334155 #0f172a' : '#cbd5e1 #f1f5f9'};
    }
    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    *::-webkit-scrollbar-track {
      background: ${dark ? '#0f172a' : '#f1f5f9'};
    }
    *::-webkit-scrollbar-thumb {
      background-color: ${dark ? '#334155' : '#cbd5e1'};
      border-radius: 4px;
      border: 2px solid ${dark ? '#0f172a' : '#f1f5f9'};
    }
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${dark ? '#475569' : '#94a3b8'};
    }

    /* Preview Content Styling */
    .preview-content {
      color: ${dark ? '#e2e8f0' : '#334155'};
    }
    .preview-content h1 {
      font-size: 2em !important;
      font-weight: 800 !important;
      color: ${dark ? '#f8fafc' : '#1e293b'} !important;
      border-bottom: 2px solid ${dark ? '#334155' : '#e2e8f0'};
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      padding-bottom: 0.3em;
      line-height: 1.2;
    }
    @media (min-width: 640px) {
      .preview-content h1 { font-size: 2.25em !important; }
    }
    .preview-content h2 {
      font-size: 1.5em !important;
      font-weight: 700 !important;
      color: ${dark ? '#f1f5f9' : '#334155'} !important;
      border-bottom: 1px solid ${dark ? '#334155' : '#e2e8f0'};
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      padding-bottom: 0.3em;
      line-height: 1.3;
    }
    @media (min-width: 640px) {
      .preview-content h2 { font-size: 1.75em !important; }
    }
    .preview-content h3 {
      font-size: 1.25em !important;
      font-weight: 600 !important;
      color: ${dark ? '#cbd5e1' : '#475569'} !important;
      margin-top: 1.4em;
      margin-bottom: 0.6em;
      line-height: 1.4;
    }
    @media (min-width: 640px) {
      .preview-content h3 { font-size: 1.5em !important; }
    }
    .preview-content p {
      margin-bottom: 1.25em;
      line-height: 1.7;
    }
    .preview-content ul {
      list-style-type: disc;
      padding-left: 1.6em;
      margin-bottom: 1.25em;
    }
    .preview-content ol {
      list-style-type: decimal;
      padding-left: 1.6em;
      margin-bottom: 1.25em;
    }
    .preview-content li {
      margin-bottom: 0.5em;
    }
    .preview-content blockquote {
      border-left: 4px solid #6366f1;
      padding: 1em;
      margin: 1.5em 0;
      background-color: ${dark ? '#1e293b' : '#f8fafc'};
      border-radius: 0 0.5rem 0.5rem 0;
      color: ${dark ? '#94a3b8' : '#475569'};
      font-style: italic;
    }
    .preview-content pre {
      background-color: ${dark ? '#0f172a' : '#1e293b'};
      color: #e2e8f0;
      padding: 1.25em;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1.5em 0;
      border: 1px solid ${dark ? '#334155' : 'transparent'};
    }
    .preview-content code {
      font-family: monospace;
      font-size: 0.9em;
    }
    .preview-content :not(pre) > code {
      background-color: ${dark ? '#334155' : '#f1f5f9'};
      color: ${dark ? '#f472b6' : '#db2777'};
      padding: 0.2em 0.4em;
      border-radius: 0.25em;
      font-weight: 500;
    }
    .preview-content img {
      border-radius: 0.5rem;
      max-width: 100%;
      height: auto;
    }
    .preview-content a {
      color: ${dark ? '#818cf8' : '#4f46e5'};
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .preview-content a:hover {
      color: ${dark ? '#a5b4fc' : '#4338ca'};
    }
    .preview-content hr {
      border: 0;
      border-top: 2px solid ${dark ? '#334155' : '#e2e8f0'};
      margin: 2.5em 0;
    }
    .preview-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      font-size: 0.95em;
      display: block;
      overflow-x: auto;
    }
    @media (min-width: 640px) {
      .preview-content table { display: table; }
    }
    .preview-content th,
    .preview-content td {
      border: 1px solid ${dark ? '#334155' : '#e2e8f0'};
      padding: 0.75em;
      text-align: left;
    }
    .preview-content th {
      background-color: ${dark ? '#1e293b' : '#f8fafc'};
      font-weight: 600;
      color: ${dark ? '#f1f5f9' : '#334155'};
    }
    .preview-content tr:nth-child(even) {
      background-color: ${dark ? '#0f172a' : '#fcfcfc'};
    }
  `;

  if (!libLoaded) {
    return <Preloader isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`h-[100dvh] flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <style>{getGlobalStyles(isDarkMode)}</style>

      {/* Header */}
      <header className={`flex-none flex flex-col md:flex-row items-center justify-between shadow-sm z-20 border-b transition-colors duration-200 gap-3 md:gap-0 px-4 sm:px-6 py-3 sm:py-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Top Row: Logo & Actions (Mobile) */}
        <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                MDX Converter
              </h1>
            </div>

            {/* Mobile Only Actions: Help & Theme */}
            <div className="flex items-center gap-2 md:hidden">
                 <button 
                  onClick={() => setShowCheatSheet(true)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                 <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </div>
        
        {/* Mobile View Toggle (Visible < MD) */}
        <div className="w-full md:hidden flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setMobileView('editor')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
               mobileView === 'editor' 
                 ? isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                 : isDarkMode ? 'text-slate-400' : 'text-slate-500'
             }`}
           >
             <FileText className="w-4 h-4" /> Input
           </button>
           <button 
             onClick={() => setMobileView('output')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
               mobileView === 'output' 
                 ? isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                 : isDarkMode ? 'text-slate-400' : 'text-slate-500'
             }`}
           >
             <Layout className="w-4 h-4" /> Output
           </button>
        </div>

        {/* Desktop Actions (Hidden < MD) */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setShowCheatSheet(true)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="inline">Cheat Sheet</span>
          </button>
          
          <div className={`w-px h-5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT: Editor Pane */}
        <div className={`
          flex-col w-full md:w-1/2 border-r transition-colors duration-200 h-full
          ${mobileView === 'editor' ? 'flex' : 'hidden md:flex'}
          ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors duration-200 flex-none ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">MDX Input</span>
                <span className="sm:hidden">Input</span>
              </div>
              
              <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${isSaved ? 'text-green-500' : 'text-amber-500'}`}>
                {isSaved ? (
                  <>
                    <Cloud className="w-3 h-3" />
                    <span className="hidden sm:inline">Auto-saved</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={() => downloadFile(input, 'document.md', 'text/markdown')}
                className={`text-xs flex items-center gap-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
                title="Download Source MD"
              >
                <Save className="w-3 h-3" /> <span className="hidden sm:inline">Save MD</span>
              </button>
              <div className={`w-px h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
              <button 
                onClick={handleClearClick}
                className={`text-xs flex items-center gap-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
              >
                <Eraser className="w-3 h-3" /> <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>
          <textarea
            className={`flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/50 leading-relaxed transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-slate-300 placeholder-slate-600' : 'bg-white text-slate-800'}`}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your MDX here..."
            spellCheck="false"
          />
          {/* Status Bar */}
          <div className={`flex-none px-4 py-2 border-t text-xs flex justify-end gap-4 transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="flex items-center gap-1.5">
              <Type className="w-3 h-3" />
              <span className="hidden sm:inline">Words:</span> <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{stats.words}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              <span className="hidden sm:inline">Chars:</span> <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{stats.chars}</strong>
            </span>
          </div>
        </div>

        {/* RIGHT: Output Pane */}
        <div className={`
          flex-col w-full md:w-1/2 transition-colors duration-200 h-full
          ${mobileView === 'output' ? 'flex' : 'hidden md:flex'}
          ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}
        `}>
          
          {/* Output Controls */}
          <div className={`flex-none flex items-center justify-between px-4 py-2 border-b transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* Tabs */}
            <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'preview' 
                    ? isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'html' 
                    ? isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code className="w-4 h-4" /> <span className="hidden sm:inline">Code</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(htmlOutput, 'document.html', 'text/html')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                title="Download HTML File"
              >
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export HTML</span>
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  copied
                    ? isDarkMode ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-600'
                    : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 overflow-auto relative">
            {error && (
              <div className={`absolute top-4 left-4 right-4 p-4 rounded-lg border text-sm z-20 ${isDarkMode ? 'bg-red-900/20 text-red-400 border-red-800' : 'bg-red-50 text-red-600 border-red-200'}`}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {activeTab === 'preview' ? (
              // Live Preview Mode
              <div 
                className="p-4 sm:p-8 max-w-none preview-content"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            ) : (
              // HTML Source Mode
              <div className="h-full relative group">
                <textarea 
                  readOnly
                  value={htmlOutput}
                  className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${isDarkMode ? 'bg-slate-950 text-indigo-200' : 'bg-slate-900 text-blue-100'}`}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCheatSheet && <CheatSheet onClose={() => setShowCheatSheet(false)} isDarkMode={isDarkMode} />}
      {showClearConfirm && <ClearConfirmation onConfirm={performClear} onCancel={() => setShowClearConfirm(false)} isDarkMode={isDarkMode} />}
    </div>
  );
};

export default App;