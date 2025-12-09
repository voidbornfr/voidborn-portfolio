"use client";

import React from 'react';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';

interface CodeEditorProps {
    language: 'javascript' | 'python' | 'sql';
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function CodeEditor({ language, value, onChange, className = '' }: CodeEditorProps) {
    const getExtensions = (): Extension[] => {
        switch (language) {
            case 'javascript':
                return [javascript({ jsx: true, typescript: true })];
            case 'python':
                return [python()];
            case 'sql':
                return [sql()];
            default:
                return [];
        }
    };

    return (
        <div className={`relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col ${className}`}>
            {/* Header / StatusBar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="ml-2 text-xs font-mono text-white/40 uppercase tracking-widest">
                        {language}_EDITOR
                    </span>
                </div>
                <div className="text-[10px] font-mono text-white/30">
                    READY
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 min-h-0">
                <CodeMirror
                    value={value}
                    height="100%"
                    theme={vscodeDark}
                    extensions={getExtensions()}
                    onChange={onChange}
                    className="text-sm font-mono bg-transparent [&_.cm-editor]:bg-transparent [&_.cm-gutters]:!bg-transparent [&_.cm-gutters]:!border-r-0 [&_.cm-gutters]:!text-white/20"
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        history: true,
                        foldGutter: true,
                        drawSelection: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        syntaxHighlighting: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        rectangularSelection: true,
                        crosshairCursor: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        closeBracketsKeymap: true,
                        defaultKeymap: true,
                        searchKeymap: true,
                        historyKeymap: true,
                        foldKeymap: true,
                        completionKeymap: true,
                        lintKeymap: true,
                    }}
                />
            </div>

            {/* Aesthetic Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    );
}
