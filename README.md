# Le Grimoire des Sophismes

Appli web (PC et téléphone, installable, hors ligne) pour apprendre à repérer les sophismes.

- **Le Grimoire** : un livre ancien dont les pages se tournent. 36 sophismes en 6 chapitres, classés selon
  **l'endroit où l'argument casse** (le schéma du pont : fondations, arche, portée, pont vers ailleurs, mots, terrain).
  Chaque page est scellée tant que le sophisme n'a pas été débusqué ; un clic ouvre la leçon complète et un mini-quiz.
- **L'entraînement** : Apprenti (sophisme ou pas ?), Compagnon (4 étiquettes), Maître (écrire le nom, tolérant
  aux fautes, « presque » si l'on nomme la famille), et Débats (cliquer la réplique fautive, puis la nommer).
- Progression incrémentale : pages débloquées, 3 sceaux de maîtrise par sophisme, encre, rangs du lecteur.

## Fichiers

- `js/sophismes.js` : chapitres et sophismes (contenu des pages et des leçons).
- `js/exercices.js` : 132 exercices (dont 24 arguments corrects qui ressemblent à des sophismes) et 6 débats.
- `js/app.js` : livre, leçons, entraînement, débats, sauvegarde (`localStorage`, clé `grimoire-sophismes-v1`).
- `CAHIER-DES-CHARGES.md` : les choix de départ validés avec Aurélien.
- `recherche/` : inventaire de 74 sophismes et comparaison des méthodes de classement (`TRI-DES-SOPHISMES.md`,
  `inventaire-sophismes.xlsx`, régénéré par `python construire_classeur.py` à partir de `inventaire.py`).
- `prototype-arbre/` : prototype de l'arbre de compétences (ouvrir `/prototype-arbre/` dans l'aperçu). Après une
  modification de `recherche/inventaire.py`, relancer `python recherche/exporter_arbre.py`. Progression : clé
  `grimoire-arbre-proto`.

- `js/phrases-*.js` : phrases ajoutées pour l'arbre (une par branche, plus `phrases-pistes.js`). Les phrases correctes
  portent `v`, la vérité probable de leur conclusion : 4 démontré · 3 très probable · 2 probable · 1 simple piste.
  Au moins la moitié des phrases doivent être correctes (consigne d'Aurélien).

Ajouter un exercice : une ligne dans `EXERCICES` (`f` = id du sophisme, ou `null` + `s` pour un argument correct).
Personnages politiques fictifs, camps variés, aucune fausse citation attribuée à une personne réelle.

Lancer en local : `python -m http.server 8649 --directory Grimoire-Sophismes` depuis le dossier parent.
