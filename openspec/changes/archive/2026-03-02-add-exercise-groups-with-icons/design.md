## Context

L'application Sporty permet actuellement la gestion d'exercices organisés en groupes prédéfinis ("Cardio endurance", "Épaules et frappe", etc.) stockés dans `exercises.json`. Les utilisateurs peuvent modifier les exercices au sein de ces groupes mais ne peuvent pas créer leurs propres groupes personnalisés ni leur assigner des icônes représentatives.

Cette limitation empêche une organisation plus flexible et personnalisée des séances d'entraînement, particulièrement utile pour les programmes sportifs spécialisés ou les objectifs personnels spécifiques.

L'architecture actuelle repose sur :
- Un fichier `exercises.json` centralisé avec des groupes prédéfinis
- Des actions server-side pour CRUD sur les exercices (`exercises/actions.ts`)
- Une interface de paramètres des groupes (`group-settings/page.tsx`)
- Un système de listes d'exercices avec persistance

## Goals / Non-Goals

**Goals:**
- Permettre aux utilisateurs de créer des groupes d'exercices personnalisés
- Fournir une bibliothèque d'icônes sélectionnables pour représenter visuellement les groupes
- Intégrer cette fonctionnalité dans l'interface existante de paramètres des groupes
- Maintenir la compatibilité avec les groupes prédéfinis existants
- Étendre le système de stockage pour persister les groupes personnalisés

**Non-Goals:**
- Modifier l'architecture des listes d'exercices existante
- Changer le système de stockage principal (JSON)
- Supprimer ou modifier les groupes prédéfinis existants
- Ajouter des fonctionnalités avancées d'organisation (hiérarchie, catégories)

## Decisions

### Architecture des groupes personnalisés
**Décision:** Étendre la structure `exercises.json` avec une nouvelle propriété `customGroups` séparée des `groups` prédéfinis.

**Rationale:** 
- Préserve la compatibilité avec les groupes existants
- Permet une distinction claire entre groupes système et groupes utilisateur
- Facilite les migrations et la maintenance

**Alternative considérée:** Fusionner les groupes personnalisés dans la propriété `groups` existante avec un flag `isCustom`.

### Système d'icônes
**Décision:** Utiliser une bibliothèque d'icônes Lucide React avec mapping prédéfini vers des catégories sportives.

**Rationale:**
- Lucide est déjà utilisé dans le projet (cohérence visuelle)
- Icônes SVG scalables et accessibles
- Mapping simple nom→composant pour faciliter la sérialisation

**Alternative considérée:** Système d'upload d'icônes personnalisées (rejeté pour complexité et cohérence).

### Structure de données
**Décision:** 
```typescript
interface CustomGroup {
  id: string;
  name: string;
  icon: string; // nom de l'icône Lucide
  createdAt: string;
  exercises: Exercise[];
}
```

**Rationale:**
- ID unique pour faciliter les opérations CRUD
- Métadonnées de création pour traçabilité
- Structure alignée sur les exercices existants

### Interface utilisateur
**Décision:** Ajouter un nouvel onglet "Groupes personnalisés" dans la page de paramètres, séparé des "Groupes d'exercices" existants.

**Rationale:**
- Séparation claire des responsabilités UI
- Évite la surcharge de l'interface existante
- Permet une évolution indépendante des fonctionnalités

## Risks / Trade-offs

**Risque de confusion UI → Mitigation:** Séparation des onglets avec labels clairs et tooltips explicatifs.

**Risque de performance → Mitigation:** Lazy loading des icônes et limitation du nombre de groupes personnalisés (max 20).

**Risque de données corrompues → Mitigation:** Validation côté client et serveur, migrations backward-compatible.

**Trade-off complexité vs flexibilité → Mitigation:** Fonctionnalité limitée aux cas d'usage principaux (groupes plats, icônes prédéfinies).