'use client';

import React, { useState } from 'react';
import { Copy, FileUp } from 'lucide-react';

type JsonImportExportPanelProps = {
    title: string;
    description?: string;
    exportDisabled?: boolean;
    importDisabled?: boolean;
    showListName?: boolean;
    listName?: string;
    listNamePlaceholder?: string;
    onListNameChange?: (name: string) => void;
    onExport: () => string | null;
    onImport: (json: string, listName?: string) => Promise<{ success: boolean; error?: string }>;
};

export default function JsonImportExportPanel({
    title,
    description,
    exportDisabled = false,
    importDisabled = false,
    showListName = false,
    listName = '',
    listNamePlaceholder = 'Nom de la liste',
    onListNameChange,
    onExport,
    onImport,
}: JsonImportExportPanelProps) {
    const [importJson, setImportJson] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    const [exportedToClipboard, setExportedToClipboard] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            if (text) setImportJson(text);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleImport = async () => {
        setImportError(null);
        const json = importJson.trim();
        if (!json) {
            setImportError('Collez du JSON ou sélectionnez un fichier');
            return;
        }
        if (showListName && !listName.trim()) {
            setImportError('Le nom de la liste est requis');
            return;
        }
        setIsImporting(true);
        try {
            const result = await onImport(json, showListName ? listName.trim() : undefined);
            if (result.success) {
                setImportJson('');
                setImportError(null);
            } else {
                setImportError(result.error ?? "Erreur lors de l'import");
            }
        } finally {
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        const json = onExport();
        if (!json) return;
        await navigator.clipboard.writeText(json);
        setExportedToClipboard(true);
        setTimeout(() => setExportedToClipboard(false), 2000);
    };

    const importBlocked =
        importDisabled || !importJson.trim() || (showListName && !listName.trim()) || isImporting;

    return (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-[#13ec5b] mb-2 uppercase tracking-wider">
                    {title}
                </h2>
                {description && <p className="text-sm text-neutral-400">{description}</p>}
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                    <FileUp className="w-4 h-4" />
                    Importer
                </h3>
                {showListName && onListNameChange && (
                    <input
                        type="text"
                        placeholder={listNamePlaceholder}
                        value={listName}
                        onChange={(e) => onListNameChange(e.target.value)}
                        className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                    />
                )}
                <textarea
                    placeholder="Collez le JSON ici…"
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    rows={5}
                    disabled={importDisabled}
                    className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white text-sm font-mono resize-y disabled:opacity-50"
                />
                <div className="flex items-center gap-3">
                    <label
                        className={`flex-1 ${importDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                        <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportFileChange}
                            className="hidden"
                            disabled={importDisabled}
                        />
                        <span className="inline-flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg font-medium text-sm border border-neutral-700">
                            <FileUp className="w-4 h-4" />
                            Fichier .json
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={importBlocked}
                        className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm"
                    >
                        {isImporting ? 'Import…' : 'Importer'}
                    </button>
                </div>
                {importError && <p className="text-sm text-red-400 whitespace-pre-line">{importError}</p>}
            </div>

            <div className="border-t border-neutral-800 pt-6 space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Exporter</h3>
                <button
                    type="button"
                    onClick={handleExport}
                    disabled={exportDisabled}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium text-sm border border-neutral-700"
                >
                    <Copy className="w-4 h-4" />
                    {exportedToClipboard ? 'Copié ✓' : 'Copier le JSON'}
                </button>
            </div>
        </div>
    );
}
