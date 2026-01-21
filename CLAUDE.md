# Contexte

Les professeurs de CM1/CM2 ont besoin de support afin de permettre aux élèves d’apprendre à lire un texte composite (i.e. un texte documentaire).  
Le but est que l’élève apprenne à chercher dans plusieurs sources d’informations et non un seul document (e.g. un site web).

# Besoin

Un outil permettant la création d’un site internet où l’élève pourra naviguer entre plusieurs pages afin de trouver diverses informations.

Ensuite l’outil fournira un système de questions intégré pour évaluer l’élève sur ça recherche. Les questions peuvent être des QCM, des Vrai/Faux ou des champs libre.

# Contraintes

* Performances optimisées pour tourner sur un ordinateur d’école
* Facile d’utilisation par les professeurs moins à l’aise avec l’informatique
* Fonctionne en hors-ligne pour les écoles non connectées
* Plate-forme à supporter :
    * Windows 10/11
    * MacOS
    * Linux (Zorin OS à minima)
    * Android
    * iPad OS

# Règles de développement communes

* Code et commentaires en Anglais
* Langue de l'application (ce qui sera vue par les utilisateurs) en Français
* Respecte les bonnes pratiques de développement et les conventions des langages
* Evite les commentaires inutiles
* N'ai pas honte de dire que tu ne sais pas
* Factorise dès que possible (DRY)

## Règles de développement Java

* Le package parent est `fr.sydher.edu.exploralire`
* Réalise des TU au format "given when then"
* Ligne vide avant et après le dernier "}" de la classe

## Règles de développement React

* Visuel avec Boostrap 5
* Respecte RGAA
* Bouton d'action à droite (et donc bouton annuler à gauche si présent)
* Utilise au mieux les fichiers .env
* Formatte le code selon le fichier .prettierrc
