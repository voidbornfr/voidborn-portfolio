"use client";

import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface ConsoleOutputProps {
    logs: Array<{
        type: 'log' | 'error' | 'warn' | 'info' | 'table';
        content: string;
        timestamp: number;
        tableData?: { columns: string[], rows: any[][] }
    }>;
    onClear: () => void;
    className?: string;
}

export default function ConsoleOutput({ logs, onClear, className = '' }: ConsoleOutputProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className={`relative flex flex-col rounded-xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                    TERMINAL_OUTPUT
                </span>
                <button
                    onClick={onClear}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
                    title="Clear Console"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {logs.length === 0 ? (
                    <div className="text-white/20 italic select-none">Waiting for execution...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={log.timestamp + i} className={`flex items-start gap-2 break-all ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'warn' ? 'text-yellow-400' :
                                'text-white/80'
                            }`}>
                            <span className="text-white/20 min-w-[20px] select-none text-[10px] pt-0.5">
                                {'>'}
                            </span>
                            {log.type === 'table' && log.tableData ? (
                                <div className="overflow-x-auto w-full my-2">
                                    <table className="w-full text-left border-collapse border border-white/20 text-xs">
                                        <thead>
                                            <tr>
                                                {log.tableData.columns.map((col, idx) => (
                                                    <th key={idx} className="border border-white/20 px-2 py-1 bg-white/10 font-bold text-white/90">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {log.tableData.rows.map((row, rIdx) => (
                                                <tr key={rIdx} className="hover:bg-white/5">
                                                    {row.map((cell, cIdx) => (
                                                        <td key={cIdx} className="border border-white/20 px-2 py-1 text-white/70">
                                                            {cell === null ? 'NULL' : String(cell)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <span>{log.content}</span>
                            )}
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
