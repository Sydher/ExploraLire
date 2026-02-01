# Guide du développeur

Bienvenue ! Ce guide vous accompagne pour contribuer au projet ExploraLire.

## Pré-requis

- **Java 21** (ou supérieur)
- **Maven 3.9+**
- **Node.js 20+** (géré automatiquement par le plugin Maven `frontend-maven-plugin`)
- Un IDE (IntelliJ IDEA, VS Code, etc.)

## Architecture du projet

```
ExploraLire/
├── pom.xml                          ← Configuration Maven (Quarkus)
├── src/
│   ├── main/
│   │   ├── java/fr/sydher/edu/exploralire/
│   │   │   ├── config/              ← Configuration applicative
│   │   │   ├── ds/                  ← Data sources / services métier
│   │   │   ├── dto/                 ← Objets de transfert
│   │   │   ├── entity/              ← Entités JPA (Hibernate + Panache)
│   │   │   └── rc/                  ← Resources REST (endpoints API)
│   │   ├── frontend/                ← Application React (Vite)
│   │   │   ├── src/
│   │   │   │   ├── components/      ← Composants réutilisables
│   │   │   │   ├── hooks/           ← Hooks React personnalisés
│   │   │   │   ├── pages/           ← Pages (professor/, student/)
│   │   │   │   ├── services/        ← Appels API
│   │   │   │   └── utils/           ← Utilitaires
│   │   │   └── package.json
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        ← Tests unitaires Java
└── documentations/                  ← Documentation du projet
```

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Java 21, Quarkus, Hibernate ORM Panache |
| Base de données | H2 (fichier local) |
| API | REST (Jackson) |
| Frontend | React, Vite, Bootstrap 5 |
| Build | Maven, frontend-maven-plugin |

## Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/Sydher/ExploraLire.git
cd ExploraLire
```

### 2. Lancer le backend en mode dev

```bash
./mvnw quarkus:dev
```

Le backend démarre sur http://localhost:8080 avec rechargement à chaud.

En mode dev, la base de données est recréée à chaque démarrage (`drop-and-create`).

### 3. Lancer le frontend en mode dev

Dans un second terminal :

```bash
cd src/main/frontend
npm install
npm run dev
```

Le frontend démarre sur http://localhost:5173 avec proxy vers le backend.

### 4. Build complet

```bash
./mvnw clean package
```

Maven compile le backend, build le frontend (via `frontend-maven-plugin`), et copie le résultat dans le JAR final.

## Conventions

### Général

- Code et commentaires en **anglais**
- Interface utilisateur en **français**
- Éviter les commentaires inutiles
- Factoriser dès que possible (DRY)

### Java

- Package parent : `fr.sydher.edu.exploralire`
- Tests unitaires au format **given / when / then**
- Ligne vide avant et après le dernier `}` de chaque classe

### React

- Visuel avec **Bootstrap 5**
- Respect du **RGAA** (accessibilité)
- Boutons d'action à **droite** (bouton annuler à gauche si présent)
- Utiliser les fichiers `.env` pour la configuration
- Formatage selon `.prettierrc`

## API REST

L'API est documentée via Swagger (SmallRye OpenAPI).

En mode dev, accédez à la documentation interactive :

**http://localhost:8080/q/swagger-ui**

Principaux endpoints :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/sites` | Liste des sites |
| GET | `/api/sites/{id}` | Détail d'un site |
| POST | `/api/sites` | Créer un site |
| PUT | `/api/sites/{id}` | Modifier un site |
| DELETE | `/api/sites/{id}` | Supprimer un site |
| GET | `/api/pages` | Liste des pages |
| POST | `/api/pages` | Créer une page |
| PUT | `/api/pages/{id}` | Modifier une page |
| DELETE | `/api/pages/{id}` | Supprimer une page |
| GET | `/api/labels` | Liste des catégories |
| POST | `/api/labels` | Créer une catégorie |
| PUT | `/api/labels/{id}` | Modifier une catégorie |
| DELETE | `/api/labels/{id}` | Supprimer une catégorie |

## Build natif

Pour générer un exécutable natif (utilisé pour les releases) :

```bash
./mvnw package -Pnative
```

Nécessite GraalVM ou Mandrel avec le support de la compilation native.

## Contribuer

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma_fonctionnalite`)
2. Développez et testez
3. Ouvrez une Pull Request

Pour toute question ou suggestion : **https://github.com/Sydher/ExploraLire/issues**
