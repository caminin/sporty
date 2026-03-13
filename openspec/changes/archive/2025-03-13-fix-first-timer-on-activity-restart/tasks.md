## 1. Correction du useEffect du countdown

- [x] 1.1 Dans `app/timer/page.tsx`, modifier le useEffect du countdown (lignes ~187-221) : lors du branch `currentStepIndex !== lastStepIndexRef.current`, avant le `return`, appeler `setTimeLeft` avec la durée du step courant (work/time → `currentStep.duration`, rest → `currentStep.duration`) pour forcer un re-render et un second passage de l'effet
- [x] 1.2 Vérifier manuellement : lancer une séance, la terminer, cliquer sur "Oui, refaire !", confirmer que le premier timer décompte correctement après la phase de préparation
