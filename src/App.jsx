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
  Loader2
} from 'lucide-react';

const STORAGE_KEY = 'mdx_converter_content';

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

const CheatSheet = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-600" />
          Markdown & JSX Cheat Sheet
        </h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-0 overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 bg-white shadow-sm z-10">
            <tr>
              <th className="p-3 border-b border-slate-200 w-1/4">Element</th>
              <th className="p-3 border-b border-slate-200 w-1/2">Markdown Syntax</th>
              <th className="p-3 border-b border-slate-200 w-1/4">Result / HTML</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="p-3 font-medium">Heading 1</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50"># Title</td>
              <td className="p-3 font-mono text-slate-500">&lt;h1&gt;Title&lt;/h1&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Heading 2</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">## Subtitle</td>
              <td className="p-3 font-mono text-slate-500">&lt;h2&gt;Subtitle&lt;/h2&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Line Break</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">&lt;br /&gt; <span className="text-slate-400">or</span> (2 spaces)</td>
              <td className="p-3 font-mono text-slate-500">&lt;br /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Bold</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">**Bold**</td>
              <td className="p-3 font-mono text-slate-500">&lt;strong&gt;Bold&lt;/strong&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Italic</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">*Italic*</td>
              <td className="p-3 font-mono text-slate-500">&lt;em&gt;Italic&lt;/em&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Link</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">[Text](url)</td>
              <td className="p-3 font-mono text-slate-500">&lt;a href="url"&gt;Text&lt;/a&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Unordered List</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">- Item</td>
              <td className="p-3 font-mono text-slate-500">&lt;ul&gt;&lt;li&gt;Item...</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Ordered List</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">1. Item</td>
              <td className="p-3 font-mono text-slate-500">&lt;ol&gt;&lt;li&gt;Item...</td>
            </tr>
             <tr>
              <td className="p-3 font-medium">Table</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">
                | Header | Header |<br/>
                | --- | --- |<br/>
                | Cell | Cell |
              </td>
              <td className="p-3 font-mono text-slate-500">&lt;table&gt;...</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Blockquote</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">&gt; Quote</td>
              <td className="p-3 font-mono text-slate-500">&lt;blockquote&gt;...</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Code Block</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">```js code ```</td>
              <td className="p-3 font-mono text-slate-500">&lt;pre&gt;&lt;code&gt;...</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Inline Code</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">`code`</td>
              <td className="p-3 font-mono text-slate-500">&lt;code&gt;code&lt;/code&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Image</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">![Alt](img.jpg)</td>
              <td className="p-3 font-mono text-slate-500">&lt;img src="..." /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Horizontal Rule</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">---</td>
              <td className="p-3 font-mono text-slate-500">&lt;hr /&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">JSX / HTML</td>
              <td className="p-3 font-mono text-indigo-600 bg-slate-50">&lt;div class="..."&gt;</td>
              <td className="p-3 font-mono text-slate-500">Preserved as is</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
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

const App = () => {
  // Initialize state from localStorage if available
  const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved;
    }
    return DEFAULT_MDX;
  });

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'html'
  const [htmlOutput, setHtmlOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [libLoaded, setLibLoaded] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Load 'marked' library dynamically
  useEffect(() => {
    if (window.marked) {
      setLibLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = () => {
      setLibLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Auto-save logic with debounce
  useEffect(() => {
    const saveToStorage = setTimeout(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, input);
        setIsSaved(true);
      }
    }, 800); // 800ms delay after typing stops

    return () => clearTimeout(saveToStorage);
  }, [input]);

  const handleInputChange = (e) => {
    setIsSaved(false);
    setInput(e.target.value);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor? This will also clear your auto-saved data.')) {
      setInput('');
      setIsSaved(false); // Effect will eventually set it to true after saving empty string
    }
  };

  // Simple HTML formatter (indentation)
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

  // Process the MDX to HTML string
  useEffect(() => {
    if (!libLoaded || !window.marked) return;

    try {
      // Pre-process: Convert JSX className to class for the HTML output/preview
      // This is a lightweight approximation of MDX compilation
      const preProcessed = input
        .replace(/className="/g, 'class="')
        .replace(/className='/g, "class='");

      // Configure marked to allow HTML
      // Note: marked normally preserves HTML by default
      const rawHtml = window.marked.parse(preProcessed, {
        breaks: true,
        gfm: true
      });

      // Format/Beautify the HTML
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

  if (!libLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Loading compiler...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <style>
        {`
          /* Custom styles for the MDX preview to make headings distinct */
          .preview-content h1 {
            font-size: 2.25em !important;
            font-weight: 800 !important;
            color: #1e293b !important;
            border-bottom: 2px solid #e2e8f0;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            padding-bottom: 0.3em;
            line-height: 1.2;
          }
          .preview-content h2 {
            font-size: 1.75em !important;
            font-weight: 700 !important;
            color: #334155 !important;
            border-bottom: 1px solid #e2e8f0;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            padding-bottom: 0.3em;
            line-height: 1.3;
          }
          .preview-content h3 {
            font-size: 1.5em !important;
            font-weight: 600 !important;
            color: #475569 !important;
            margin-top: 1.4em;
            margin-bottom: 0.6em;
            line-height: 1.4;
          }
          .preview-content h4 {
            font-size: 1.25em !important;
            font-weight: 600 !important;
            color: #475569 !important;
            margin-top: 1.2em;
            margin-bottom: 0.5em;
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
            background-color: #f8fafc;
            border-radius: 0 0.5rem 0.5rem 0;
            color: #475569;
            font-style: italic;
          }
          .preview-content pre {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 1.25em;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5em 0;
          }
          .preview-content code {
            font-family: monospace;
            font-size: 0.9em;
          }
          /* Inline code styling (not inside pre) */
          .preview-content :not(pre) > code {
            background-color: #f1f5f9;
            color: #db2777;
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
            color: #4f46e5;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .preview-content a:hover {
            color: #4338ca;
          }
          .preview-content hr {
            border: 0;
            border-top: 2px solid #e2e8f0;
            margin: 2.5em 0;
          }
          /* Table Styles */
          .preview-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 0.95em;
          }
          .preview-content th,
          .preview-content td {
            border: 1px solid #e2e8f0;
            padding: 0.75em;
            text-align: left;
          }
          .preview-content th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #334155;
          }
          .preview-content tr:nth-child(even) {
            background-color: #fcfcfc;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            MDX Converter
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCheatSheet(true)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cheat Sheet</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden">
        
        {/* LEFT: Editor */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Terminal className="w-4 h-4" />
                <span>MDX Input</span>
              </div>
              
              {/* Auto-Save Indicator */}
              <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${isSaved ? 'text-green-600' : 'text-amber-500'}`}>
                {isSaved ? (
                  <>
                    <Cloud className="w-3 h-3" />
                    <span>Auto-saved</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={() => downloadFile(input, 'document.md', 'text/markdown')}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
                title="Download Source MD"
              >
                <Save className="w-3 h-3" /> Save MD
              </button>
              <div className="w-px h-3 bg-slate-300"></div>
              <button 
                onClick={handleClear}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors"
              >
                <Eraser className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/50 bg-white text-slate-800 leading-relaxed"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your MDX here..."
            spellCheck="false"
          />
        </div>

        {/* RIGHT: Output */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-50">
          
          {/* Output Controls */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'html' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code className="w-4 h-4" /> HTML Code
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(htmlOutput, 'document.html', 'text/html')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                title="Download HTML File"
              >
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export HTML</span>
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  copied
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 overflow-auto relative">
            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {activeTab === 'preview' ? (
              // Live Preview Mode
              <div 
                className="p-8 max-w-none preview-content"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            ) : (
              // HTML Source Mode
              <div className="h-full relative group">
                <textarea 
                  readOnly
                  value={htmlOutput}
                  className="w-full h-full p-4 font-mono text-sm bg-slate-900 text-blue-100 resize-none focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cheat Sheet Modal */}
      {showCheatSheet && <CheatSheet onClose={() => setShowCheatSheet(false)} />}
    </div>
  );
};

export default App;