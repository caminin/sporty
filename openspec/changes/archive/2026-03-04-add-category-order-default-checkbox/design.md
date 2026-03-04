## Context

L'IconPicker (`app/components/IconPicker.tsx`) affiche les catégories d'icônes (ICON_CATEGORIES) dans un ordre fixe défini par `app/exercises/icons.ts`. L'ordre actuel est : cardio, musculation, sport collectif, sport individuel, explosivité, mobilité. Aucune option de tri n'existe aujourd'hui.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de choisir l'ordre d'affichage des catégories (actuel vs aléatoire)
- Checkbox cochée par défaut (ordre aléatoire)
- Persister le choix entre les sessions

**Non-Goals:**
- Ordre personnalisable par glisser-déposer
- Ordre par fréquence d'utilisation
- Synchronisation multi-appareils

## Decisions

### 1. Stockage de la préférence : localStorage

**Choix :** Utiliser `localStorage` avec une clé dédiée (ex. `sporty-icon-picker-random-order`).

**Alternatives :**
- Contexte React global : surdimensionné pour une seule préférence UI
- Préférences dans la config de liste : mélange des responsabilités (liste vs UI picker)

**Rationale :** Simple, pas de migration, pas de changement de schéma. La préférence est locale à l'appareil et au navigateur.

### 2. Emplacement de la checkbox

**Choix :** Dans le popup de l'IconPicker, sous la barre de recherche, au-dessus de la grille d'icônes.

**Rationale :** Visible uniquement quand le picker est ouvert, ne surcharge pas le bouton déclencheur.

### 3. Ordre alternatif : aléatoire

**Choix :** Mélange aléatoire (Fisher-Yates) des catégories quand la checkbox est cochée.

**Rationale :** Variété pour l'utilisateur, implémentation simple.

### 4. Fonction utilitaire dans icons.ts

**Choix :** Exporter `shuffleCategories<T>(categories: T[]): T[]` pour réutilisabilité et testabilité.

## Risks / Trade-offs

- **[localStorage non disponible]** → Fallback : considérer la checkbox cochée (ordre aléatoire)
