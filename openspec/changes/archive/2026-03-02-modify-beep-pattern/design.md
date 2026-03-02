## Context

L'application sporty utilise actuellement un système audio simple dans le timer qui produit un seul bip lors des transitions entre exercices. L'utilisateur souhaite améliorer l'expérience audio en modifiant le pattern pour produire deux bips légers suivis d'un bip normal, offrant une meilleure indication des changements d'état.

Le système audio actuel utilise l'API Web Audio pour générer des tons synthétiques directement dans le navigateur, sans dépendances externes.

## Goals / Non-Goals

**Goals:**
- Modifier le pattern audio de "un bip" vers "deux bips légers + un bip normal"
- Maintenir la compatibilité avec le contrôle audio existant (bouton volume)
- Préserver les performances et la réactivité du timer

**Non-Goals:**
- Ne pas ajouter de dépendances audio externes (fichiers son, bibliothèques)
- Ne pas modifier l'interface utilisateur existante
- Ne pas changer les autres aspects du timer (comptes à rebours, etc.)

## Decisions

**Pattern audio:** Utiliser trois tons séquentiels avec des caractéristiques distinctes :
- Deux premiers bips : fréquence 600Hz, durée 0.15s, volume réduit (0.2)
- Troisième bip : fréquence 800Hz, durée 0.3s, volume normal (0.3)

**Implémentation:** Étendre la fonction `playBeep()` existante pour jouer une séquence de tons au lieu d'un seul. Utiliser `setTimeout` pour orchestrer les délais entre les bips.

**Rétrocompatibilité:** Conserver le nom de fonction `playBeep()` et l'état `isAudioEnabled` pour éviter de casser l'interface existante.

## Risks / Trade-offs

- **Performance:** Jouer trois tons séquentiels pourrait causer une légère latence perceptible → Risque faible car les tons sont courts (0.15s + 0.3s total)
- **Complexité:** Code plus complexe pour gérer la séquence → Mitigation : fonction helper claire et bien commentée
- **Accessibilité:** Pattern plus complexe pourrait être moins clair pour certains utilisateurs → Mitigation : possibilité de personnalisation future si besoin