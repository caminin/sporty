## 1. Helper et construction de séance

- [x] 1.1 Exporter `seriesRestDuration(globalRestTime)` dans `app/session-utils.ts` (`Math.max(1, Math.round(globalRestTime / 2))`)
- [x] 1.2 Adapter `buildSessionSteps` : repos court entre séries du même exercice, repos complet entre deux références
- [x] 1.3 Tests `buildSessionSteps` : 3 séries avec repos demi, transition vers exercice suivant avec repos complet, `globalRestTime` impair (15 → 8 s)

## 2. Estimation homepage

- [x] 2.1 Adapter `estimateSessionDuration` pour compter repos demi (intra-bloc) et repos complet (inter-exercice)
- [x] 2.2 Tests estimation : placement `series` 3, deux exercices `series` 1, cohérence avec `buildSessionSteps`

## 3. Vérification

- [x] 3.1 Lancer `session-utils.test.ts` et corriger les assertions existantes qui supposent un repos uniforme
- [x] 3.2 Vérifier manuellement : entraînement Pompes × 3 avec `globalRestTime` 20 → pauses 10 s entre séries, pause 20 s avant l'exercice suivant
