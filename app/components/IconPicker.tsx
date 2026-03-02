'use client';

import React, { useState } from 'react';
import { ICON_CATEGORIES, IconItem, getIconByName } from '../exercises/icons';

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    className?: string;
}

export default function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Obtenir l'icône actuellement sélectionnée
    const selectedIcon = getIconByName(value);

    // Filtrer les icônes selon le terme de recherche
    const filteredCategories = ICON_CATEGORIES.map(category => ({
        ...category,
        icons: category.icons.filter(icon =>
            icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            icon.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.icons.length > 0);

    const handleIconSelect = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative ${className}`}>
            {/* Bouton déclencheur */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
            >
                <div className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-lg">
                    {selectedIcon ? (
                        React.createElement(selectedIcon, {
                            className: "w-6 h-6 text-[#13ec5b]"
                        })
                    ) : (
                        <div className="w-6 h-6 bg-neutral-600 rounded"></div>
                    )}
                </div>
                <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">
                        {selectedIcon ? 'Icône sélectionnée' : 'Choisir une icône'}
                    </div>
                    <div className="text-xs text-neutral-400">
                        {selectedIcon ? 'Cliquez pour changer' : 'Aucune icône sélectionnée'}
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Modal/Popup */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Contenu du sélecteur */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                        {/* Barre de recherche */}
                        <div className="p-4 border-b border-neutral-800">
                            <input
                                type="text"
                                placeholder="Rechercher une icône..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white placeholder-neutral-400 focus:ring-2 focus:ring-[#13ec5b] text-sm"
                            />
                        </div>

                        {/* Grille d'icônes */}
                        <div className="max-h-80 overflow-y-auto">
                            {filteredCategories.length === 0 ? (
                                <div className="p-8 text-center text-neutral-400">
                                    Aucune icône trouvée pour "{searchTerm}"
                                </div>
                            ) : (
                                filteredCategories.map(category => (
                                    <div key={category.name} className="p-4">
                                        <h3 className="text-sm font-semibold text-[#13ec5b] uppercase tracking-wider mb-3">
                                            {category.name === 'cardio' && 'Cardio'}
                                            {category.name === 'musculation' && 'Musculation'}
                                            {category.name === 'sport collectif' && 'Sport collectif'}
                                            {category.name === 'sport individuel' && 'Sport individuel'}
                                            {category.name === 'explosivité' && 'Explosivité'}
                                            {category.name === 'mobilité' && 'Mobilité'}
                                        </h3>
                                        <div className="grid grid-cols-6 gap-2">
                                            {category.icons.map(icon => {
                                                const IconComponent = icon.icon;
                                                const isSelected = value === icon.name;

                                                return (
                                                    <button
                                                        key={icon.name}
                                                        type="button"
                                                        onClick={() => handleIconSelect(icon.name)}
                                                        className={`
                                                            flex flex-col items-center gap-2 p-3 rounded-lg transition-colors group
                                                            ${isSelected
                                                                ? 'bg-[#13ec5b] text-black'
                                                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                                                            }
                                                        `}
                                                        title={icon.label}
                                                    >
                                                        <IconComponent className="w-6 h-6" />
                                                        <span className="text-xs text-center leading-tight">
                                                            {icon.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}