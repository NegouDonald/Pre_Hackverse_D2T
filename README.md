# 🎓 SmartTime Manager : Gestion Intelligente du Temps Étudiant

[![Django](https://img.shields.io/badge/Backend-Django%205.1-092E20?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Style-Tailwind%20v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

SmartTime Manager est une solution Full-Stack moderne conçue pour aider les étudiants à surmonter la procrastination et à optimiser leurs révisions. Grâce à un algorithme de priorisation dynamique, l'application suggère intelligemment les tâches à accomplir en fonction de l'urgence, de l'importance et de la charge de travail.

---

## 🌟 Fonctionnalités Clés

### 🧠 Algorithme de Priorisation IA (SmartScore)
Calcule un score de **0 à 100** pour chaque tâche en agrégeant :
- **Urgence Temporelle** (40%) : Croissance exponentielle via `math.log` à l'approche de la deadline.
- **Importance Manuelle** (30%) : Priorités définies par l'utilisateur.
- **Poids de la Catégorie** (15%) : Une session d'EXAMEN prévaut sur une tâche PERSONNELLE.
- **Théorie des Quick Wins** (10%) : Bonus pour les tâches < 30min pour stimuler la dopamine.
- **Malus Retard** : Alerte visuelle et score boosté pour les tâches critiques.

### 📊 Dashboard Holistique
- **Focus du Jour** : La tâche la plus critique est mise en avant avec un bouton d'action immédiat.
- **Visualisation de Données** : Répartition analytique via des graphiques circulaires et linéaires (Recharts).
- **Heatmap d'Activité** : Visualisation de l'intensité de travail sur le long terme (style GitHub).

### 📅 Planning Intuitif
- **Auto-Scheduling** : Génération automatique de créneaux d'étude respectant la méthode Pomodoro.
- **Vue Calendrier** : Interface hebdomadaire fluide avec gestion des créneaux fixes.

### ⏱️ Session d'Étude & Tracking
- **Chronomètre In-App** : Suivi en temps réel de la durée réelle par rapport à l'estimé.
- **Session History** : Historique détaillé des temps passés par matière.

---

## 🛠️ Stack Technique

### Backend (Architecture Modulaire)
- **Framework** : Django 5.x / Django REST Framework
- **Authentification** : JWT (djangorestframework-simplejwt)
- **Documentation** : OpenAPI 3 / Swagger (drf-spectacular)
- **Base de données** : SQLite (Dev) / PostgreSQL compatible
- **Filtrage** : django-filter & search backends

### Frontend (SPA Haute Performance)
- **Framework** : React 18 (Vite)
- **Gestion d'État** : Zustand (State management léger et réactif)
- **Styles** : Tailwind CSS v4 (Design moderne & Dark Mode natif)
- **Animations** : Framer Motion (Transitions fluides & micro-interactions)
- **Graphiques** : Recharts
- **Notifications** : React Hot Toast

---

## 📂 Structure du Projet

```bash
student_time_manager/
├── backend/                # API Django
│   ├── config/             # Configuration noyau & settings
│   ├── apps/               # Modules métiers (users, tasks, planning, analytics)
│   └── scripts/            # Utilitaires de maintenance & démo
└── frontend/               # Application React
    ├── src/
    │   ├── api/            # Config Axios & Intercepteurs
    │   ├── components/     # UI Atoms & Molecules
    │   ├── store/          # État global Zustand
    │   └── pages/          # Vues principales de l'application
```

---

## 🚀 Installation & Démarrage

### 1. Configuration du Backend
```bash
cd backend
# Installation des dépendances
pip install -r requirements.txt

# Initialisation de la base de données
python3 manage.py migrate

# Chargement des données de démonstration
python3 scripts/create_demo.py

# Lancement du serveur
python3 manage.py runserver
```
*L'API est accessible sur `http://127.0.0.1:8000/api/`*
*Documentation Swagger : `http://127.0.0.1:8000/api/docs/`*

### 2. Configuration du Frontend
```bash
cd frontend
# Installation des packages
npm install

# Lancement du serveur de développement (Vite)
npm run dev
```
*L'app est accessible sur `http://localhost:5173` ou `5174`*

---

## 🔐 Identifiants de Démonstration

Pour tester l'application immédiatement avec des données pré-remplies :
- **Username** : `student@gmail.com`
- **Password** : `password123`

---

## ✨ Bonnes Pratiques Implémentées
- **Sécurité** : Isolation des données (chaque utilisateur ne voit que ses tâches).
- **Performance** : Pagination des listes et optimisation des requêtes ORM.
- **UX/UI** : Feedback immédiat via Toasts, interface responsive mobile-first.
- **Clean Code** : Séparation des services métiers dans le backend et hooks personnalisés dans le front.

---
Développé avec passion par l'equipe D2T pour le hackathon de gestion du temps. 🚀
# Pre_Hackverse_NomDeLEquipe
