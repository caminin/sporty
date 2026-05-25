## REMOVED Requirements

### Requirement: Interface de création de groupes personnalisés
**Reason**: Les groupes de séance sont définis dans les fichiers JSON importés ; l’admin ne propose plus de création via formulaire.
**Migration**: Ajouter le bloc `groups` dans le JSON (`exercice_list/*.json`) puis importer via l’onglet Import / Export.
