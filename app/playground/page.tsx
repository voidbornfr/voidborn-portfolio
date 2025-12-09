"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/layout/Navbar";
import BackgroundFX from "@/components/layout/BackgroundFX";
import CodeEditor from "@/components/playground/CodeEditor";
import ConsoleOutput from "@/components/playground/ConsoleOutput";
import { Play, RotateCcw, Save, Loader2 } from "lucide-react";
import Script from 'next/script';

// Types for Pyodide and SQL.js
declare global {
    interface Window {
        loadPyodide: any;
        initSqlJs: any;
    }
}

type Language = 'javascript' | 'python' | 'sql';

const DEFAULT_CODE = {
    javascript: `// Write JavaScript here
console.log("Initializing Void System...");

const data = [1, 2, 3, 4, 5];
const doubled = data.map(x => x * 2);

console.log("Original:", data);
console.log("Doubled:", doubled);
`,
    python: `# Write Python here
import numpy as np
import pandas as pd

# Create a DataFrame
data = {
    'Name': ['Neo', 'Morpheus', 'Trinity'],
    'Role': ['The One', 'Captain', 'Officer'],
    'Level': [100, 95, 98]
}

df = pd.DataFrame(data)
print("DataFrame created:")
print(df)

print("\\nBasic Statistics:")
print(df.describe())
`,
    sql: `-- Write SQL here
CREATE TABLE users (id int, name text, role text);
INSERT INTO users VALUES (1, 'Neo', 'The One');
INSERT INTO users VALUES (2, 'Morpheus', 'Captain');
INSERT INTO users VALUES (3, 'Trinity', 'Officer');

SELECT * FROM users;
`
};

export default function PlaygroundPage() {
    const [language, setLanguage] = useState<Language>('python');
    const [code, setCode] = useState(DEFAULT_CODE['python']);
    const [logs, setLogs] = useState<Array<{ type: 'log' | 'error' | 'warn' | 'info'; content: string; timestamp: number }>>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');

    // Engine States
    const [pyodide, setPyodide] = useState<any>(null);
    const [sqlDb, setSqlDb] = useState<any>(null);
    const [isPyodideLoading, setIsPyodideLoading] = useState(false);
    const [isSqlLoading, setIsSqlLoading] = useState(false);

    // Update code when language changes
    useEffect(() => {
        // Simple persistence for this session could be added here
        // For now, just reset to default if switching to a lang for first time, 
        // to simplify, but in reality we'd want to save state per lang.
        setCode(DEFAULT_CODE[language]);
        setLogs([]);
    }, [language]);

    const addLog = useCallback((content: string, type: 'log' | 'error' | 'warn' | 'info' = 'log') => {
        setLogs(prev => [...prev, { type, content, timestamp: Date.now() }]);
    }, []);

    // --- EXECUTION LOGIC ---

    const executeJS = async () => {
        try {
            // Override console.log to capture output
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;

            console.log = (...args) => addLog(args.map(a => String(a)).join(' '), 'log');
            console.error = (...args) => addLog(args.map(a => String(a)).join(' '), 'error');
            console.warn = (...args) => addLog(args.map(a => String(a)).join(' '), 'warn');
            console.info = (...args) => addLog(args.map(a => String(a)).join(' '), 'info');

            // Execute
            // eslint-disable-next-line no-new-func
            const func = new Function(code);
            func();

            // Restore
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
        } catch (error: any) {
            addLog(error.message || String(error), 'error');
        }
    };

    const initPyodide = async () => {
        if (!window.loadPyodide) return;
        setIsPyodideLoading(true);
        try {
            const py = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
            });
            // Capture stdout
            py.setStdout({ batched: (msg: string) => addLog(msg, 'log') });
            setPyodide(py);
            addLog("Python runtime initialized.", 'info');
        } catch (e: any) {
            addLog(`Failed to load Python: ${e.message}`, 'error');
        } finally {
            setIsPyodideLoading(false);
        }
    };

    const executePython = async () => {
        if (!pyodide) {
            addLog("Python runtime not loaded yet.", 'warn');
            return;
        }
        try {
            // Auto-load packages
            await pyodide.loadPackagesFromImports(code);

            await pyodide.runPythonAsync(code);
        } catch (e: any) {
            // Fallback if loadPackagesFromImports fails or logic requires manual loading
            // But for now, let's try the built-in helper first or manual regex
            if (e.message.includes("loadPackage")) {
                addLog("Installing packages...", 'info');
                const importRegex = /^(?:import|from)\s+([a-zA-Z0-9_]+)/gm;
                const packages = new Set<string>();
                let match;
                while ((match = importRegex.exec(code)) !== null) {
                    packages.add(match[1]);
                }
                if (packages.size > 0) {
                    try {
                        await pyodide.loadPackage(Array.from(packages));
                        await pyodide.runPythonAsync(code);
                        return;
                    } catch (err: any) {
                        addLog(`Package installation failed: ${err.message}`, 'error');
                    }
                }
            }
            addLog(e.message, 'error');
        }
    };

    const initSql = async () => {
        if (!window.initSqlJs) return;
        setIsSqlLoading(true);
        try {
            const SQL = await window.initSqlJs({
                locateFile: (file: string) => `https://sql.js.org/dist/${file}`
            });
            setSqlDb(new SQL.Database());
            addLog("SQL Database initialized in-memory.", 'info');
        } catch (e: any) {
            addLog(`Failed to load SQL: ${e.message}`, 'error');
        } finally {
            setIsSqlLoading(false);
        }
    };

    const executeSql = async () => {
        if (!sqlDb) {
            addLog("SQL Database not loaded yet.", 'warn');
            return;
        }
        try {
            const results = sqlDb.exec(code);
            if (results.length === 0) {
                addLog("Query executed successfully. No results returned.", 'info');
            } else {
                results.forEach((res: any) => {
                    addLog(`Result: ${JSON.stringify(res.columns)}`, 'info');
                    res.values.forEach((row: any) => {
                        addLog(JSON.stringify(row), 'log');
                    });
                });
            }
        } catch (e: any) {
            addLog(e.message, 'error');
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setLogs([]); // Clear logs on run? Optional.

        if (language === 'javascript') await executeJS();
        else if (language === 'python') await executePython();
        else if (language === 'sql') await executeSql();

        setIsRunning(false);
    };

    // Initialize engines when needed
    useEffect(() => {
        if (language === 'python' && !pyodide && !isPyodideLoading) {
            // Check if script is loaded
            if (window.loadPyodide) initPyodide();
            else {
                // Wait for script to load
                const interval = setInterval(() => {
                    if (window.loadPyodide) {
                        clearInterval(interval);
                        initPyodide();
                    }
                }, 500);
                return () => clearInterval(interval);
            }
        }
        if (language === 'sql' && !sqlDb && !isSqlLoading) {
            if (window.initSqlJs) initSql();
            else {
                const interval = setInterval(() => {
                    if (window.initSqlJs) {
                        clearInterval(interval);
                        initSql();
                    }
                }, 500);
                return () => clearInterval(interval);
            }
        }
    }, [language, pyodide, sqlDb]);


    return (
        <main className="min-h-screen relative font-sans text-white bg-void md:overflow-hidden">
            <Script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js" strategy="afterInteractive" />
            <Script src="https://sql.js.org/dist/sql-wasm.js" strategy="afterInteractive" />

            <BackgroundFX />
            <Navbar />

            <div className="pt-24 min-h-screen md:h-screen flex flex-col max-w-[1600px] mx-auto p-4 z-10 relative">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 glass-panel p-3 rounded-xl sticky top-24 md:static z-20 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <h1 className="font-heading font-bold text-xl tracking-tight hidden md:block">
                            VOID<span className="text-white/40">_PLAYGROUND</span>
                        </h1>
                        <div className="h-6 w-px bg-white/10 hidden md:block" />

                        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
                            {(['python', 'sql', 'javascript'] as Language[]).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase transition-all ${language === lang
                                        ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="mr-4 text-[10px] font-mono text-white/30 hidden md:block">
                            {language === 'python' && !pyodide && 'LOADING RUNTIME...'}
                            {language === 'python' && pyodide && 'PYTHON READY'}
                            {language === 'sql' && !sqlDb && 'LOADING DB...'}
                            {language === 'sql' && sqlDb && 'SQL DB READY'}
                            {language === 'javascript' && 'JS V8 (NATIVE)'}
                        </div>

                        <button
                            onClick={handleRun}
                            disabled={isRunning || (language === 'python' && !pyodide) || (language === 'sql' && !sqlDb)}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="black" />}
                            <span>RUN</span>
                        </button>
                    </div>
                </div>

                {/* Mobile View Toggle */}
                <div className="md:hidden flex mb-4 bg-white/5 p-1 rounded-lg sticky top-[160px] z-20 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all ${activeTab === 'code' ? 'bg-white text-black' : 'text-white/40'}`}
                    >
                        CODE_EDITOR
                    </button>
                    <button
                        onClick={() => setActiveTab('output')}
                        className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all ${activeTab === 'output' ? 'bg-emerald-500 text-black' : 'text-white/40'}`}
                    >
                        TERMINAL_Logs
                    </button>
                </div>

                {/* Main Content Split */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 pb-4 relative">
                    <div className={`${activeTab === 'code' ? 'block' : 'hidden md:block'} h-[75vh] md:h-full`}>
                        <CodeEditor
                            language={language}
                            value={code}
                            onChange={setCode}
                            className="h-full shadow-2xl"
                        />
                    </div>
                    <div className={`${activeTab === 'output' ? 'block' : 'hidden md:block'} h-[75vh] md:h-full`}>
                        <ConsoleOutput
                            logs={logs}
                            onClear={() => setLogs([])}
                            className="h-full shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
