import React from 'react';
import {
    Dumbbell,
    Timer,
    Heart,
    Zap,
    Target,
    Activity,
    Bike,
    Footprints,
    Waves,
    Flame,
    Mountain,
    Trophy,
    Star,
    Award,
    Crown,
    Shield,
    Swords,
    Users,
    User,
    Gamepad2,
    type LucideIcon
} from 'lucide-react';

export interface IconCategory {
    name: string;
    icons: IconItem[];
}

export interface IconItem {
    name: string;
    icon: LucideIcon;
    label: string;
}

// Mapping des icônes disponibles organisées par catégories sportives
export const ICON_CATEGORIES: IconCategory[] = [
    {
        name: 'cardio',
        icons: [
            { name: 'heart', icon: Heart, label: 'Cœur' },
            { name: 'activity', icon: Activity, label: 'Activité' },
            { name: 'flame', icon: Flame, label: 'Feu' },
            { name: 'zap', icon: Zap, label: 'Éclair' },
            { name: 'bike', icon: Bike, label: 'Vélo' },
            { name: 'waves', icon: Waves, label: 'Vagues' }
        ]
    },
    {
        name: 'musculation',
        icons: [
            { name: 'dumbbell', icon: Dumbbell, label: 'Haltères' },
            { name: 'target', icon: Target, label: 'Cible' },
            { name: 'mountain', icon: Mountain, label: 'Montagne' },
            { name: 'shield', icon: Shield, label: 'Bouclier' },
            { name: 'star', icon: Star, label: 'Étoile' }
        ]
    },
    {
        name: 'sport collectif',
        icons: [
            { name: 'users', icon: Users, label: 'Groupe' },
            { name: 'trophy', icon: Trophy, label: 'Trophée' },
            { name: 'award', icon: Award, label: 'Récompense' },
            { name: 'crown', icon: Crown, label: 'Couronne' }
        ]
    },
    {
        name: 'sport individuel',
        icons: [
            { name: 'user', icon: User, label: 'Individuel' },
            { name: 'footprints', icon: Footprints, label: 'Pas' },
            { name: 'gamepad2', icon: Gamepad2, label: 'Jeu' },
            { name: 'timer', icon: Timer, label: 'Minuteur' }
        ]
    },
    {
        name: 'explosivité',
        icons: [
            { name: 'zap', icon: Zap, label: 'Éclair' },
            { name: 'flame', icon: Flame, label: 'Feu' },
            { name: 'swords', icon: Swords, label: 'Épées' },
            { name: 'target', icon: Target, label: 'Cible' }
        ]
    },
    {
        name: 'mobilité',
        icons: [
            { name: 'waves', icon: Waves, label: 'Vagues' },
            { name: 'activity', icon: Activity, label: 'Activité' },
            { name: 'heart', icon: Heart, label: 'Cœur' },
            { name: 'footprints', icon: Footprints, label: 'Pas' }
        ]
    }
];

// Fonction utilitaire pour obtenir une icône par son nom
export function getIconByName(name: string): LucideIcon | null {
    for (const category of ICON_CATEGORIES) {
        const icon = category.icons.find(icon => icon.name === name);
        if (icon) {
            return icon.icon;
        }
    }
    return null;
}

// Fonction utilitaire pour obtenir le label d'une icône par son nom
export function getIconLabel(name: string): string {
    for (const category of ICON_CATEGORIES) {
        const icon = category.icons.find(icon => icon.name === name);
        if (icon) {
            return icon.label;
        }
    }
    return name;
}

// Mélange Fisher-Yates (in-place, retourne une copie)
export function shuffleCategories<T>(categories: T[]): T[] {
    const result = [...categories];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Icône par défaut
export const DEFAULT_ICON = 'dumbbell';

// Fonction utilitaire pour rendre une icône par son nom
export function renderIconByName(
    name: string,
    props: React.SVGProps<SVGSVGElement> = {}
): React.ReactElement | null {
    const IconComponent = getIconByName(name);
    if (!IconComponent) {
        return null;
    }

    return React.createElement(IconComponent, {
        className: "w-5 h-5",
        ...props
    });
}