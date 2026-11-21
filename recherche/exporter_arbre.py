# Exporte l'inventaire pour le prototype d'arbre : python recherche/exporter_arbre.py
import sys, os, json
ici = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ici)
from inventaire import charger
garde = ['nom', 'alias', 'exemple', 'famille', 'ou', 'preuve', 'freq', 'diff', 'parent']
data = {d['id']: {k: d[k] for k in garde} for d in charger()}
sortie = os.path.join(ici, '..', 'prototype-arbre', 'inventaire-data.js')
with open(sortie, 'w', encoding='utf-8') as f:
    f.write('// Généré par recherche/exporter_arbre.py à partir de recherche/inventaire.py — ne pas modifier à la main.\n')
    f.write('const INVENTAIRE = ' + json.dumps(data, ensure_ascii=False, indent=0) + ';\n')
print(len(data), 'sophismes exportés')
