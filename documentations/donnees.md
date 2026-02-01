# Emplacement des données

ExploraLire stocke toutes ses données localement dans un dossier dédié de votre répertoire utilisateur.

> **Avertissement :** La modification manuelle de ces fichiers est réservée aux utilisateurs experts. Une mauvaise manipulation peut entraîner une perte de données ou empêcher l'application de fonctionner. Privilégiez toujours l'interface d'ExploraLire pour gérer vos contenus.

## Dossier principal

| Système | Emplacement |
|---------|-------------|
| Windows | `C:\Users\VotreNom\.exploralire\data\` |
| macOS   | `/Users/VotreNom/.exploralire/data/` |
| Linux   | `/home/votrenom/.exploralire/data/` |

> **Note :** Le dossier `.exploralire` est un dossier caché.  
> Sous Windows, activez l'affichage des éléments masqués dans l'explorateur de fichiers.  
> Sous macOS, utilisez `Cmd+Shift+.` dans le Finder.

## Structure du dossier

```
.exploralire/
└── data/
    ├── exploralire.mv.db    ← Base de données (sites, pages, catégories)
    └── images/              ← Images uploadées depuis l'éditeur
```

### Base de données

Le fichier `exploralire.mv.db` est une base de données créée automatiquement au premier lancement. Il contient l'ensemble des sites, pages et catégories.

### Images

Le dossier `images/` contient toutes les images ajoutées via l'éditeur de pages. Les fichiers sont renommés automatiquement pour éviter les conflits.

## Sauvegarde

Pour sauvegarder vos données, copiez l'intégralité du dossier `.exploralire/data/`. Cela inclut la base de données et toutes les images.

Pour restaurer une sauvegarde, remplacez le contenu du dossier `data/` par votre copie, puis relancez l'application.

> **Important :** Effectuez vos sauvegardes lorsque l'application est arrêtée pour éviter tout risque de corruption.

## Export et import de sites

ExploraLire propose également un système d'export/import de sites individuels (au format `.zip`) directement depuis l'interface professeur. C'est la méthode recommandée pour partager des sites entre collègues.
