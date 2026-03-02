## 1. Implémentation du pattern audio

- [x] 1.1 Modifier la fonction playBeep() dans app/timer/page.tsx pour jouer une séquence de trois tons
- [x] 1.2 Implémenter les caractéristiques audio : deux bips légers (600Hz, 0.15s, vol 0.2) puis un bip normal (800Hz, 0.3s, vol 0.3)
- [x] 1.3 Ajouter la gestion des délais entre les tons (0.1s entre les deux premiers, 0.2s avant le dernier)
- [x] 1.4 Vérifier que le contrôle audio (isAudioEnabled) fonctionne toujours correctement

## 2. Tests et validation

- [x] 2.1 Tester le nouveau pattern audio lors des transitions d'exercice
- [x] 2.2 Tester le nouveau pattern audio lors de la validation de répétitions
- [x] 2.3 Vérifier que l'audio peut toujours être désactivé
- [x] 2.4 Tester la compatibilité avec les navigateurs ne supportant pas Web Audio API