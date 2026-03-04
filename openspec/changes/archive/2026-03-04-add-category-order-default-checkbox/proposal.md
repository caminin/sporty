## Why

L'IconPicker affiche les catégories d'icônes (Cardio, Musculation, Sport collectif, etc.) dans un ordre fixe. Certains utilisateurs peuvent préférer un ordre aléatoire pour varier l'affichage. Une option simple permet de basculer entre l'ordre actuel et un ordre aléatoire.

## What Changes

- Ajout d'une case à cocher dans l'IconPicker : « Ordre aléatoire des catégories »
- La case est cochée par défaut (ordre aléatoire)
- Quand cochée : affichage des catégories dans un ordre aléatoire
- Persistance du choix utilisateur (localStorage ou préférences de la liste)

## Capabilities

### New Capabilities

- `icon-picker-category-order`: option utilisateur pour l'ordre d'affichage des catégories dans le sélecteur d'icônes (ordre actuel vs aléatoire)

### Modified Capabilities

- `exercise-group-icons`: extension pour supporter l'ordre configurable des catégories dans le picker

## Impact

- `app/components/IconPicker.tsx` : ajout de la checkbox et logique d'ordre
- `app/exercises/icons.ts` : possible fonction utilitaire pour trier les catégories
- Stockage des préférences (localStorage ou dans le contexte existant)
