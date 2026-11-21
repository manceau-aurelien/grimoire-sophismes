# Construit inventaire-sophismes.xlsx à partir de inventaire.py
# Lancer : python construire_classeur.py   (depuis ce dossier)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from inventaire import charger
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as col

L = charger()
N = len(L)
BRANCHE = {
    'Départ': "Ce qu'on avance est faux ou caché",
    'Ne suit pas': 'Ça ne suit pas',
    'Pas assez': 'Pas assez de preuves',
    'Autre chose': "Ça parle d'autre chose",
    'Échange': 'On triche avec la discussion',
}
TRONC = {'Départ': '1. Le départ', 'Ne suit pas': '2. Le lien', 'Pas assez': '2. Le lien', 'Autre chose': '2. Le lien', 'Échange': "3. L'échange"}
ORDRE_B = list(BRANCHE)
NIVEAU = {1: '1 · un seul cas', 2: '2 · quelques cas', 3: '3 · beaucoup de cas mal choisis', 4: '4 · bien choisis, cause non prouvée'}
CHAP = {'fondations': 'I · Fondations', 'forme': 'II · Arche brisée', 'court': 'III · Pont trop court', 'ailleurs': 'IV · Pont vers ailleurs', 'mots': 'V · Mots qui glissent', 'terrain': 'VI · Terrain truqué'}
def chap6(d):
    if d['matiere'] == 'Mots': return CHAP['mots']
    return CHAP[{'Départ': 'fondations', 'Ne suit pas': 'forme', 'Pas assez': 'court', 'Autre chose': 'ailleurs', 'Échange': 'terrain'}[d['ou']]]
noms = {d['id']: d['nom'] for d in L}

F = 'Arial'
titre = Font(name=F, size=14, bold=True, color='3A2717')
gras = Font(name=F, bold=True)
norm = Font(name=F)
blanc = Font(name=F, bold=True, color='FFFFFF')
fond_tete = PatternFill('solid', fgColor='5B3A1E')
fond_clair = PatternFill('solid', fgColor='F3E7CF')
fil = Side(style='thin', color='C8B48A')
cadre = Border(left=fil, right=fil, top=fil, bottom=fil)
hb = Alignment(wrap_text=True, vertical='top')

wb = Workbook()

# ───────── Lisez-moi
ws = wb.active; ws.title = 'Lisez-moi'
lignes = [
    ('Inventaire des sophismes — Grimoire des Sophismes', titre),
    (f'{N} sophismes, dont 36 déjà dans l\'appli. Chaque ligne décrit un sophisme selon plusieurs critères indépendants, pour comparer des façons de les classer.', norm),
    ('', norm),
    ('Onglets', gras),
    ('Inventaire : une ligne par sophisme. Les filtres en tête de colonne permettent de trier et de faire des tas.', norm),
    ('Méthodes : les 5 façons de classer testées, avec le nombre de sophismes par catégorie (calculé depuis l\'inventaire).', norm),
    ('Croisement : tableau croisé « où ça casse » × « avec quoi on triche », test du khi-deux et V de Cramér.', norm),
    ('Arbre proposé : le classement recommandé, sous forme d\'arbre de compétences.', norm),
    ('', norm),
    ('Colonnes de l\'inventaire', gras),
    ('Tronc / Branche : où l\'argument casse (le départ, le lien, l\'échange).', norm),
    ('Famille : le regroupement dans l\'arbre proposé.', norm),
    ('Matière : avec quoi on triche (personnes, chiffres, émotions, mots…), indépendamment de l\'endroit où ça casse.', norm),
    ('Niveau de preuve : seulement pour « Pas assez de preuves ». 1 un seul cas · 2 quelques cas · 3 beaucoup de cas mal choisis · 4 bien choisis mais cause non prouvée. (5 = preuve solide : ce n\'est plus un sophisme.)', norm),
    ('Manuel classique : classement des manuels de logique (d\'après Copi et Cohen, Introduction to Logic : pertinence, induction défectueuse, présomption, ambiguïté, plus les sophismes formels).', norm),
    ('Fréquence (1 rare à 3 partout) et Difficulté (1 facile à 3 subtil) : estimations de Claude, pour décider de l\'ordre d\'apprentissage.', norm),
    ('Autre place possible : quand un sophisme pourrait aller ailleurs. Ces hésitations mesurent la netteté d\'un classement.', norm),
    ('', norm),
    ('Pour modifier : changer une case de l\'inventaire suffit, les comptes des onglets Méthodes et Croisement se recalculent.', norm),
]
for i, (t, f) in enumerate(lignes, 1):
    c = ws.cell(row=i, column=1, value=t); c.font = f; c.alignment = Alignment(wrap_text=True, vertical='top')
ws.column_dimensions['A'].width = 120

# ───────── Inventaire
wi = wb.create_sheet('Inventaire')
tetes = ['N°', 'Nom', 'Autres noms', 'Exemple', "Dans l'appli", 'Parent', 'Tronc', 'Branche (où ça casse)', 'Famille',
         'Matière (avec quoi on triche)', 'Niveau de preuve', 'Manuel classique', 'Chapitre actuel (appli)', 'Fréquence', 'Difficulté', 'Autre place possible']
largeurs = [5, 26, 26, 60, 8, 22, 13, 26, 22, 22, 18, 20, 20, 9, 9, 34]
for j, (t, w) in enumerate(zip(tetes, largeurs), 1):
    c = wi.cell(row=1, column=j, value=t); c.font = blanc; c.fill = fond_tete; c.alignment = Alignment(wrap_text=True, vertical='center'); c.border = cadre
    wi.column_dimensions[col(j)].width = w
ordre = sorted(L, key=lambda d: (ORDRE_B.index(d['ou']), d['famille']))
for i, d in enumerate(ordre, 2):
    vals = [i - 1, d['nom'], d['alias'], d['exemple'], 'oui' if d['appli'] else '', noms.get(d['parent'], ''), TRONC[d['ou']], BRANCHE[d['ou']],
            d['famille'], d['matiere'], NIVEAU.get(d['preuve'], ''), d['manuel'], chap6(d), d['freq'], d['diff'], d['hesite']]
    for j, v in enumerate(vals, 1):
        c = wi.cell(row=i, column=j, value=v); c.font = norm; c.alignment = hb; c.border = cadre
        if i % 2 == 0: c.fill = fond_clair
DER = N + 1
wi.freeze_panes = 'C2'
wi.auto_filter.ref = f'A1:{col(len(tetes))}{DER}'
wi.row_dimensions[1].height = 32

def plage(lettre): return f'Inventaire!${lettre}$2:${lettre}${DER}'
COL = {'tronc': 'G', 'branche': 'H', 'famille': 'I', 'matiere': 'J', 'preuve': 'K', 'manuel': 'L', 'chap': 'M', 'hesite': 'P'}

# ───────── Méthodes
wm = wb.create_sheet('Méthodes')
wm.column_dimensions['A'].width = 38; wm.column_dimensions['B'].width = 12; wm.column_dimensions['C'].width = 90
methodes = [
    ('A. Le manuel classique (Copi et Cohen)', 'manuel', ['Pertinence', 'Induction défectueuse', 'Présomption', 'Ambiguïté', 'Formel', 'Hors manuel'],
     "Logique et éprouvé, mais les noms (« présomption », « induction défectueuse ») sont abstraits pour le grand public, et il ignore les sophismes de débat (5 « hors manuel »)."),
    ('B. Où ça casse (anatomie de l\'argument)', 'branche', [BRANCHE[b] for b in ORDRE_B],
     "5 cases, chacune répond à une question à se poser. Recoupe presque exactement le manuel classique (V de Cramér 0,81) avec des noms parlants. Faiblesse : 21 sophismes sur 74 ont une autre place possible, souvent entre deux cases voisines."),
    ('C. Avec quoi on triche (thèmes)', 'matiere', sorted({d['matiere'] for d in L}),
     "Le plus facile à retenir (des thèmes concrets), mais 12 catégories à plat, et le thème ne dit pas pourquoi l'argument est faux : « Mots » ou « Hasard et chiffres » cassent à des endroits très différents."),
    ('D. Les 6 chapitres actuels de l\'appli', 'chap', list(CHAP.values()),
     "C'est la méthode B, plus un chapitre « Mots » qui mélange deux critères : il range ensemble des sophismes qui cassent au départ, dans le lien et dans l'échange. D'où la confusion."),
    ('E. L\'arbre proposé (B en tronc et branches, familles concrètes en feuilles)', 'famille', sorted({d['famille'] for d in L}, key=lambda f: (ORDRE_B.index(next(d['ou'] for d in L if d['famille'] == f)), f)),
     "3 troncs, 5 branches, 17 familles de 2 à 8 sophismes. Le haut de l'arbre donne la logique (où ça casse), le bas donne des thèmes faciles à retenir. Recommandé."),
]
r = 1
c = wm.cell(row=r, column=1, value='Cinq façons de classer, testées sur le même inventaire'); c.font = titre; r += 2
for nom, cle, cats, verdict in methodes:
    wm.cell(row=r, column=1, value=nom).font = Font(name=F, bold=True, size=12)
    c = wm.cell(row=r, column=3, value=verdict); c.font = Font(name=F, italic=True); c.alignment = Alignment(wrap_text=True, vertical='top')
    wm.row_dimensions[r].height = 45; r += 1
    for t in ('Catégorie', 'Sophismes'):
        pass
    wm.cell(row=r, column=1, value='Catégorie').font = blanc; wm.cell(row=r, column=1).fill = fond_tete
    wm.cell(row=r, column=2, value='Sophismes').font = blanc; wm.cell(row=r, column=2).fill = fond_tete
    r += 1; debut = r
    for cat in cats:
        wm.cell(row=r, column=1, value=cat).font = norm
        wm.cell(row=r, column=2, value=f'=COUNTIF({plage(COL[cle])},A{r})').font = norm
        r += 1
    wm.cell(row=r, column=1, value='Total').font = gras
    wm.cell(row=r, column=2, value=f'=SUM(B{debut}:B{r - 1})').font = gras
    r += 2
wm.cell(row=r, column=1, value='Hésitations (sophismes ayant une autre place possible)').font = gras
wm.cell(row=r, column=2, value=f'=COUNTIF({plage(COL["hesite"])},"?*")').font = gras
wm.cell(row=r, column=3, value='Mesurées pour la méthode B (et donc pour l\'arbre E, qui en hérite).').font = norm
r += 1
wm.cell(row=r, column=1, value='Part des sophismes concernés').font = gras
c = wm.cell(row=r, column=2, value=f'=B{r - 1}/COUNTA({plage("B")})'); c.font = gras; c.number_format = '0%'

# ───────── Croisement
wc = wb.create_sheet('Croisement')
def croiser(r0, titre_t, cle_l, lignes_, cle_c, colonnes_, note):
    wc.cell(row=r0, column=1, value=titre_t).font = Font(name=F, bold=True, size=12)
    wc.cell(row=r0 + 1, column=1, value=note).font = Font(name=F, italic=True)
    h = r0 + 2
    wc.cell(row=h, column=1, value='Observé').font = blanc; wc.cell(row=h, column=1).fill = fond_tete
    for j, cc in enumerate(colonnes_, 2):
        x = wc.cell(row=h, column=j, value=cc); x.font = blanc; x.fill = fond_tete; x.alignment = Alignment(wrap_text=True, vertical='center')
    jt = len(colonnes_) + 2
    x = wc.cell(row=h, column=jt, value='Total'); x.font = blanc; x.fill = fond_tete
    for i, ll in enumerate(lignes_, h + 1):
        wc.cell(row=i, column=1, value=ll).font = norm
        for j in range(2, jt):
            wc.cell(row=i, column=j, value=f'=COUNTIFS({plage(COL[cle_l])},$A{i},{plage(COL[cle_c])},{col(j)}${h})').font = norm
        wc.cell(row=i, column=jt, value=f'=SUM(B{i}:{col(jt - 1)}{i})').font = gras
    it = h + len(lignes_) + 1
    wc.cell(row=it, column=1, value='Total').font = gras
    for j in range(2, jt + 1):
        wc.cell(row=it, column=j, value=f'=SUM({col(j)}{h + 1}:{col(j)}{it - 1})').font = gras
    # attendu si indépendance
    he = it + 2
    wc.cell(row=he, column=1, value='Attendu si les deux critères étaient indépendants').font = Font(name=F, italic=True)
    for i in range(len(lignes_)):
        ro, re_ = h + 1 + i, he + 1 + i
        wc.cell(row=re_, column=1, value=f'=A{ro}').font = norm
        for j in range(2, jt):
            x = wc.cell(row=re_, column=j, value=f'={col(jt)}{ro}*{col(j)}${it}/${col(jt)}${it}'); x.font = norm; x.number_format = '0.0'
    fin = he + len(lignes_)
    obs = f'B{h + 1}:{col(jt - 1)}{it - 1}'; att = f'B{he + 1}:{col(jt - 1)}{fin}'
    rk = fin + 2
    wc.cell(row=rk, column=1, value='Khi-deux').font = gras
    x = wc.cell(row=rk, column=2, value=f'=SUMPRODUCT(({obs}-{att})^2/{att})'); x.font = gras; x.number_format = '0.0'
    wc.cell(row=rk + 1, column=1, value='V de Cramér (0 = indépendants, 1 = l\'un détermine l\'autre)').font = gras
    x = wc.cell(row=rk + 1, column=2, value=f'=SQRT(B{rk}/({col(jt)}{it}*(MIN({len(lignes_)},{len(colonnes_)})-1)))'); x.font = gras; x.number_format = '0.00'
    wc.cell(row=rk + 2, column=1, value="Avec 74 sophismes, beaucoup de cases attendues sont inférieures à 5 : le khi-deux n'est qu'indicatif, le V de Cramér sert de mesure d'association.").font = Font(name=F, italic=True)
    return rk + 4

wc.column_dimensions['A'].width = 34
for j in range(2, 16): wc.column_dimensions[col(j)].width = 14
mats = ['Présupposés', 'Logique', 'Ressemblances et catégories', 'Hasard et chiffres', 'Échantillons', 'Causes', 'Conséquences', 'Personnes', 'Le groupe et le temps', 'Émotions', 'Conduite du débat', 'Mots']
r = croiser(1, 'Matière (avec quoi on triche) × Branche (où ça casse)', 'matiere', mats, 'branche', [BRANCHE[b] for b in ORDRE_B],
            "Si une matière tombe dans une seule branche, elle peut devenir une famille de l'arbre. Si elle s'étale (Mots, Hasard et chiffres), c'est un axe transversal.")
croiser(r, 'Manuel classique × Branche (où ça casse)', 'manuel', ['Pertinence', 'Induction défectueuse', 'Présomption', 'Ambiguïté', 'Formel', 'Hors manuel'],
        'branche', [BRANCHE[b] for b in ORDRE_B], "Montre que la méthode « où ça casse » retrouve le classement des manuels, avec des noms parlants et une branche « échange » en plus.")
wc.row_dimensions[3].height = 45

# ───────── Arbre proposé
wa = wb.create_sheet('Arbre proposé')
wa.column_dimensions['A'].width = 4; wa.column_dimensions['B'].width = 4; wa.column_dimensions['C'].width = 34; wa.column_dimensions['D'].width = 70
QUESTION = {'Départ': '« Est-ce vrai ? Est-ce tout ? »', 'Ne suit pas': '« Même si tout est vrai, est-ce que ça découle ? »',
            'Pas assez': '« Est-ce assez pour conclure ? »', 'Autre chose': '« Est-ce que ça parle du sujet ? »', 'Échange': '« Répond-on vraiment à l\'autre ? »'}
r = 1
wa.cell(row=r, column=1, value="L'arbre proposé : où ça casse → famille → sophismes").font = titre; r += 2
tronc_vu = None
for b in ORDRE_B:
    if TRONC[b] != tronc_vu:
        tronc_vu = TRONC[b]
        x = wa.cell(row=r, column=1, value=tronc_vu.upper()); x.font = Font(name=F, bold=True, size=13, color='9B1C1C'); r += 1
    x = wa.cell(row=r, column=2, value=f'{BRANCHE[b]}   {QUESTION[b]}'); x.font = Font(name=F, bold=True, size=12); r += 1
    fams = []
    for d in ordre:
        if d['ou'] == b and d['famille'] not in fams: fams.append(d['famille'])
    for fa in fams:
        membres = [d for d in ordre if d['famille'] == fa]
        if fa in ('Échantillons', 'Causes'):
            membres.sort(key=lambda d: (d['preuve'] or 9))
            txt = ' < '.join(f"{d['nom']} ({d['preuve']})" if d['preuve'] else d['nom'] for d in membres)
            txt += '   (classés du moins au plus robuste)'
        else:
            txt = ', '.join(d['nom'] for d in membres)
        wa.cell(row=r, column=3, value=fa).font = gras
        x = wa.cell(row=r, column=4, value=txt); x.font = norm; x.alignment = Alignment(wrap_text=True, vertical='top')
        r += 1
    r += 1
wa.cell(row=r, column=1, value="Les sophismes de « Mots » restent marqués d'un badge transversal : ils sont rangés là où ils cassent, mais on peut aussi les parcourir comme une collection.").font = Font(name=F, italic=True)

sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'inventaire-sophismes.xlsx')
wb.calculation.fullCalcOnLoad = True
wb.save(sortie)
print('écrit', sortie)
