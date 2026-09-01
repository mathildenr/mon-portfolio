# Modifier le contenu du site

Quatre gestes, toujours les mêmes. Compter deux minutes.

## 1. Démarrer le back-office

Dans le terminal (ou le terminal intégré de VS Code) :

```sh
cd ~/mon-portfolio
npm run dev
```

Laisser cette fenêtre ouverte : elle fait tourner le serveur. `Ctrl+C` pour l'arrêter
quand on a fini.

## 2. Modifier

Ouvrir http://localhost:4321/keystatic

- **Réalisations → Projets** : les fiches projet. On peut en ajouter, en supprimer,
  changer un visuel, réordonner.
- **Sections du site** : les textes fixes de la page — accueil, titres de la section
  réalisations, services, formules, contact.

Cliquer **Save** après chaque fiche. Le texte est écrit directement dans les fichiers
du projet.

## 3. Vérifier

Ouvrir http://localhost:4321 dans un autre onglet. La page se recharge toute seule à
chaque enregistrement. C'est le vrai rendu du site, avec les bonnes polices et les
bonnes couleurs.

Rien de ce qui se passe à ce stade n'est visible en ligne : on peut se tromper,
recommencer, abandonner.

## 4. Publier

Dans VS Code, panneau **Source Control** (l'embranchement, à gauche) :

1. Écrire un court message dans le champ du haut, par exemple
   « Nouvelle description du projet Louise et Rosalie ».
2. Bouton **Commit**.
3. Bouton **Sync Changes**.

Netlify reconstruit le site et le publie sur https://mathilde-regaud.fr en une minute
environ. L'avancement est visible dans l'onglet **Deploys** de Netlify.

---

## En cas de doute

**« J'ai modifié mais je ne vois rien en ligne »** — l'étape 4 n'a pas été faite, ou le
déploiement est encore en cours. Vérifier l'onglet Deploys de Netlify.

**« Le back-office me demande de me connecter à GitHub »** — la ligne
`PUBLIC_KEYSTATIC_GITHUB_REPO` du fichier `.env` s'est réactivée. La remettre en
commentaire (un `#` devant), puis arrêter et relancer `npm run dev`.

**« J'ai fait une bêtise »** — tant que l'étape 4 n'a pas été faite, rien n'est perdu :
dans le panneau Source Control de VS Code, le menu `⋯` → **Discard All Changes**
rétablit la dernière version publiée. Après publication, l'historique des versions
reste consultable sur GitHub, et chaque déploiement précédent reste restaurable
depuis Netlify.

## Les images

Une image ajoutée depuis Keystatic est déposée automatiquement au bon endroit.
Prévoir des fichiers en `.webp` ou `.jpg`, en format paysage pour les vignettes de
projet, et éviter les accents et les espaces dans les noms de fichiers.
