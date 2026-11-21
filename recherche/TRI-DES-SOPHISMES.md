# Comment classer les sophismes ? Inventaire et premier tri

*Document de travail pour Aurélien. 21/11/2026, Claude.*
Données : `inventaire-sophismes.xlsx` (onglets Inventaire, Méthodes, Croisement, Arbre proposé),
générées par `construire_classeur.py` à partir de `inventaire.py`.

## 1. L'inventaire

**74 sophismes**, dont les 36 de l'appli. J'ai ajouté surtout ceux qui manquaient dans votre branche « statistique » :
biais du survivant, échantillon biaisé, tireur d'élite texan, oubli du dénominateur, oubli de la fréquence de base,
régression vers la moyenne, facteur de confusion… J'ai aussi ajouté quelques grands classiques : procès d'intention,
whataboutisme, coût irrécupérable, appel au ridicule…

Chaque sophisme est décrit selon **plusieurs critères séparés**, pour pouvoir les croiser :

| Critère | Question | Valeurs |
|---|---|---|
| **Où ça casse** | Quelle pièce de l'argument est défectueuse ? | le départ · le lien (3 façons) · l'échange |
| **Matière** | Avec quoi triche-t-on ? | personnes, émotions, chiffres, causes, mots, etc. (12) |
| **Niveau de preuve** | Si les preuves sont trop faibles, à quel point ? | 1 à 4 |
| **Manuel classique** | Comment les manuels de logique le rangent ? | pertinence, induction, présomption, ambiguïté, formel |
| **Fréquence, difficulté** | Pour l'ordre d'apprentissage | 1 à 3 |
| **Autre place possible** | Hésite-t-on avec une autre case ? | texte |

## 2. Le principe de départ : ça casse toujours avant la conclusion

Un argument a deux pièces : **ce qu'on avance** (les prémisses) et **le lien** (le « donc »). La conclusion n'est que
le résultat : elle peut être vraie avec un sophisme, ou fausse avec un raisonnement parfait. Un sophisme se loge donc :

1. **au départ** : ce qu'on avance est faux ou caché ;
2. **dans le lien**, de trois façons différentes :
   - **ça ne suit pas** : même si tout était vrai, la conclusion ne découle pas (erreur de mécanique) ;
   - **pas assez de preuves** : ça parle bien du sujet, mais c'est trop faible pour conclure ;
   - **ça parle d'autre chose** : la personne, la foule, les émotions… pas la question ;
3. **dans l'échange** : on ne triche pas avec l'argument, mais avec la discussion (on déforme, on esquive,
   on change les règles).

## 3. Les cinq méthodes testées

| Méthode | Catégories | Pour | Contre |
|---|---|---|---|
| **A. Manuel classique** (Copi et Cohen) | 5 + 5 « hors manuel » | Éprouvée depuis des décennies | Noms abstraits (« présomption », « induction défectueuse ») ; ignore les sophismes de débat |
| **B. Où ça casse** | 5 | Chaque case = une question à se poser | 28 % d'hésitations entre cases voisines |
| **C. Avec quoi on triche** | 12, à plat | Thèmes concrets, faciles à retenir | Trop de cases ; ne dit pas *pourquoi* c'est faux |
| **D. Les 6 chapitres actuels** | 6 | Proches de B | Le chapitre « Mots » mélange deux critères |
| **E. Arbre : B en haut, thèmes en bas** | 3 → 5 → 17 familles | La logique en haut, du concret en bas | Les hésitations de B restent |

## 4. Ce que disent les croisements

C'est votre test « les variables sont-elles indépendantes ? ». Je l'ai fait avec un **test du khi-deux** et le
**V de Cramér**, qui va de 0 (sans lien) à 1 (l'un détermine l'autre). Avec 74 sophismes, le khi-deux n'est
qu'indicatif.

- **Où ça casse × Matière : V = 0,86.** Les deux critères sont très liés. La plupart des thèmes tombent dans une seule
  branche : les personnes, la foule et les émotions sont toutes « ça parle d'autre chose » ; les échantillons et les causes
  sont toutes « pas assez de preuves ». Pour un arbre, c'est **une bonne nouvelle** : le thème peut devenir le niveau
  inférieur (la famille) sous la branche, sans faire double emploi.
- **Deux exceptions sont de vrais axes transversaux.** « Mots » s'étale sur 4 branches : un mot piégé peut fausser
  le départ (langage chargé), le lien (équivoque) ou l'échange (vrai Écossais). « Hasard et chiffres » s'étale sur
  2 branches. **C'est l'origine de la confusion de l'appli actuelle** : son chapitre V « Mots » est rangé comme une
  branche alors que c'est un autre axe.
- **Manuel classique × Où ça casse : V = 0,81.** La méthode B retrouve presque case pour case le classement des
  manuels : pertinence = « ça parle d'autre chose », induction défectueuse = « pas assez de preuves »,
  présomption = « le départ », formels = « ça ne suit pas ». Elle a des noms parlants, et une branche « échange »
  que les manuels n'ont pas. C'est un bon signe : on ne réinvente pas une classification bancale.
- **Hésitations : 21 sophismes sur 74 (28 %).** Elles se font presque toujours entre deux cases voisines.
  Par exemple : la question piège est-elle une prémisse cachée ou un piège tendu dans le débat ? Un sophisme peut
  faire deux fautes à la fois. Je propose une règle simple : **on le range là où il faudrait réparer**. Pour la question
  piège, il suffit de retirer le présupposé caché, donc il va au départ.

## 5. Votre intuition sur les statistiques : confirmée

Les sophismes « pas assez de preuves » se rangent sur une **échelle de robustesse**. C'est la même idée que la
pyramide des niveaux de preuve en médecine :

| Niveau | Ce qu'on a | Échantillons | Causes |
|---|---|---|---|
| 1 | un seul cas | preuve anecdotique | post hoc (« après, donc à cause de ») |
| 2 | quelques cas | généralisation hâtive | fausse cause |
| 3 | beaucoup de cas, mal choisis | échantillon biaisé, biais du survivant, cueillette de cerises, tireur d'élite texan, extrapolation, oubli du dénominateur | cause unique |
| 4 | beaucoup de cas bien choisis, mais la cause n'est pas prouvée | — | corrélation ≠ causalité, facteur de confusion, cause et effet inversés, régression vers la moyenne |
| 5 | preuve solide (essai contrôlé, synthèse d'études) | ce n'est plus un sophisme | |

## 6. Recommandation : l'arbre (méthode E)

```
1. LE DÉPART : « Est-ce vrai ? Est-ce tout ? »
   ├─ Présupposés cachés ....... faux dilemme, faux compromis, solution parfaite, question piège,
   │                             pétition de principe, règle sans exception
   ├─ Affirmations sans preuve . affirmation gratuite, appel au bon sens
   └─ Mots piégés .............. langage chargé, euphémisme, définition persuasive
2. LE LIEN
   ├─ Ça ne suit pas : « Même si tout est vrai, est-ce que ça découle ? »
   │   ├─ Logique pure ......... non sequitur, affirmation du conséquent, négation de l'antécédent,
   │   │                         moyen terme non distribué, sophisme du sophisme
   │   ├─ Le tout et les parties composition, division
   │   ├─ Probabilités ......... sophisme du joueur, conjonction, fréquence de base, procureur
   │   └─ Double sens .......... équivoque, amphibologie
   ├─ Pas assez de preuves : « Est-ce assez pour conclure ? »
   │   ├─ Échantillons ......... l'échelle 1 → 3 ci-dessus
   │   ├─ Causes ............... l'échelle 1 → 4 ci-dessus, + pente glissante
   │   └─ Preuves de substitution fausse analogie, argument de l'ignorance, incrédulité personnelle,
   │                             sources floues
   └─ Ça parle d'autre chose : « Est-ce que ça parle du sujet ? »
       ├─ Les personnes ........ ad hominem, tu quoque, procès d'intention, empoisonnement du puits,
       │                         culpabilité par association, whataboutisme, appel à l'autorité
       ├─ La foule et le temps . popularité, tradition, nouveauté, nature, sophisme génétique
       ├─ Les émotions ......... émotion, peur, pitié, flatterie, ridicule, force
       └─ Les conséquences ..... appel aux conséquences, pensée désirante, coût irrécupérable
3. L'ÉCHANGE : « Répond-on vraiment à l'autre ? »
   ├─ Déformer ................. homme de paille, citation hors contexte
   ├─ Esquiver ................. hareng rouge, mitraillage d'arguments, argument par répétition
   └─ Changer les règles ....... charge de la preuve, déplacement des buts, vrai Écossais, faux équilibre
```

**Pourquoi c'est la plus pertinente :**

- **Sur la logique :** le haut de l'arbre suit la vraie mécanique d'un argument, et il recoupe les manuels.
  Le critère transversal (les mots) n'est plus une fausse branche, mais un **badge** que l'on peut parcourir
  comme une collection.
- **Pour l'apprentissage :** on ne retient jamais plus de 3 choses à la fois. Il y a 3 troncs, puis 2 à 4 branches
  ou familles par embranchement, puis 2 à 8 sophismes par famille. Chaque branche porte **une question**, ce qui sert
  directement à repérer un sophisme. Les familles portent des noms concrets (« les personnes », « les émotions »),
  faciles à retenir.
- **Pour le jeu :** c'est un vrai arbre de compétences. On débloque une famille en commençant par ses sophismes
  fréquents et faciles (colonnes Fréquence et Difficulté). Dans « Échantillons » et « Causes », on monte l'échelle
  de robustesse.

## 7. À décider ensemble

1. Les **familles** vous parlent-elles ? Leurs noms ? Des sophismes à déplacer ? L'onglet Inventaire se filtre et se
   trie facilement pour refaire des tas.
2. Le **périmètre** : faut-il garder 36 sophismes dans l'appli, ou aller vers les 74 en les débloquant
   progressivement dans l'arbre ?
3. La règle « **on le range là où il faudrait réparer** » vous convient-elle pour les cas limites ?
4. Seulement après : la **forme visuelle** de l'arbre dans l'appli.
