# ExploraLire

Outil de génération de texte composite

## Contexte

Les professeurs de CM1/CM2 ont besoin de support afin de permettre aux élèves d’apprendre à lire un texte composite (i.e. un texte documentaire).  
Le but est que l’élève apprenne à chercher dans plusieurs sources d’informations et non un seul document (e.g. un site web).

L'outil permet la création d’un site internet où l’élève pourra naviguer entre plusieurs pages afin de trouver diverses informations.  
Il fournit également un système de questions intégré pour évaluer l’élève sur sa recherche.

## Documentation

### Comment installer et utiliser ExploraLire ?

#### 1. Téléchargement

* Aller sur https://github.com/Sydher/ExploraLire/releases/latest
* Télécharger la version selon votre système d'opération (Windows, MacOS ou Linux)

#### 2. Installation

* Pour **Windows** aucune installation n'est requise, il faut cependant conserver le fichier .exe qui servira à lancer le logiciel à chaque fois.
* Pour **MacOS** il faut déplacer le .app dans le dossier *Application*
* Pour **Linux** aucune installation n'est requise, il faut cependant conserver le fichier runner qui servira à lancer le logiciel à chaque fois.

#### 3. Lancement

* Démarrer l'application
  * Windows : Double cliquer sur le .exe
  * MacOS : Lancer le logiciel depuis LaunchPad ou Spotlight
  * Linux : `./le-runner` dans un terminal
* L'application est ensuite disponible dans votre navigateur à l'adresse suivante : http://localhost:8080 

### Emplacement des données

Vos données sont stockées dans votre dossier utilisateur :

* Windows : `C:\Users\VotreNom\.exploralire\data\`
* Mac : `/Users/VotreNom/.exploralire/data/`
* Linux : `/home/votrenom/.exploralire/data/`

Le fichier de base de données (`exploralire.mv.db`) y sera automatiquement créé au premier lancement.

### Besoin d'aide ?

Ouvrez un ticket sur : https://github.com/Sydher/ExploraLire/issues

### Développement

Voir plus de détails dans la [documentation dédiée](#).

JAVA_HOME=$(/usr/libexec/java_home -v 21) ./mvnw clean package -Pnative -DskipTests
