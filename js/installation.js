'use strict';
// Le Grimoire des Sophismes — installation sur l'appareil et sauvegarde de la progression.
// Chargé après app.js : utilise $, S, CLE, sauver, vierge, majBarre, toast, accueil, fermerLecon.

// ═════════════════════════════════════════════ installation
let invitation = null;                                   // l'invitation d'installation (Android, PC)
const estInstallee = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const estIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const peutInstaller = () => !estInstallee() && (invitation || estIOS());

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); invitation = e; majBoutonsAccueil(); });
window.addEventListener('appinstalled', () => {
  invitation = null; garderStockage(); majBoutonsAccueil();
  toast('📲 Le Grimoire est installé : retrouvez-le parmi vos applis.');
});

async function installer() {
  if (invitation) {
    invitation.prompt();
    const choix = await invitation.userChoice.catch(() => null);
    if (choix && choix.outcome === 'accepted') invitation = null;
    majBoutonsAccueil();
    return;
  }
  ouvrirFeuille(`<h2>Installer le Grimoire</h2>
    ${estIOS() ? `<p>Sur iPhone ou iPad, avec <b>Safari</b> :</p>
      <ol><li>touchez le bouton <b>Partager</b> (le carré avec une flèche vers le haut) ;</li>
      <li>choisissez <b>« Sur l'écran d'accueil »</b> ;</li><li>touchez <b>Ajouter</b>.</li></ol>
      <p class="encadre">Sur iPhone, l'appli installée garde sa propre progression, séparée de celle de Safari.
      Pour ne rien perdre : <b>copiez votre code de sauvegarde ici</b>, puis collez-le dans l'appli installée.</p>
      <button class="btn" id="vSauvegarde">Ma sauvegarde</button>`
    : `<p>Dans le menu de votre navigateur (⋮ ou ⋯), choisissez <b>« Installer l'application »</b> ou
      <b>« Ajouter à l'écran d'accueil »</b>.</p>`}`);
  const v = document.getElementById('vSauvegarde'); if (v) v.onclick = ouvrirSauvegarde;
}

// ═════════════════════════════════════════════ sauvegarde
// La progression est enregistrée automatiquement sur l'appareil à chaque réponse.
// On demande au navigateur de ne pas l'effacer, et on permet de l'emporter ailleurs (fichier ou code).
async function garderStockage() {
  try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch (e) {}
}
if (estInstallee()) garderStockage();

const VERSION_SAUVEGARDE = 1;
const enCode = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const deCode = c => JSON.parse(decodeURIComponent(escape(atob(c.replace(/\s+/g, '')))));
const paquet = () => ({ appli: 'grimoire-sophismes', version: VERSION_SAUVEGARDE, date: new Date().toISOString(), progression: S });
const resume = p => { const n = Object.keys(p.found || {}).length; return `${n} page${n > 1 ? 's' : ''} débloquée${n > 1 ? 's' : ''}, ${p.justes || 0} bonne${(p.justes || 0) > 1 ? 's' : ''} réponse${(p.justes || 0) > 1 ? 's' : ''}, ${p.encre || 0} encre`; };

function restaurer(donnees) {
  const p = donnees && donnees.appli === 'grimoire-sophismes' ? donnees.progression : null;
  if (!p || typeof p !== 'object' || typeof p.found !== 'object') { toast('Cette sauvegarde n\'est pas reconnue.'); return; }
  if (!confirm(`Remplacer votre progression actuelle (${resume(S)}) par celle de la sauvegarde (${resume(p)}) ?`)) return;
  S = Object.assign(vierge(), p); sauver(); majBarre(); fermerLecon(); accueil();
  toast('💾 Progression restaurée.');
}

function ouvrirSauvegarde() {
  garderStockage();
  ouvrirFeuille(`<h2>Ma sauvegarde</h2>
    <p>Votre progression est <b>enregistrée automatiquement</b> sur cet appareil, à chaque réponse : vous la
    retrouvez en rouvrant le Grimoire, même hors ligne.</p>
    <p class="famille">Actuellement : ${resume(S)}.</p>
    <p>Pour l'emporter sur un autre appareil, ou la mettre à l'abri si vous videz votre navigateur :</p>
    <h3>Avec un fichier</h3>
    <div class="actions" style="justify-content:flex-start;flex-wrap:wrap">
      <button class="btn" id="sTelecharger">Télécharger ma sauvegarde</button>
      <button class="btn sombre" id="sOuvrir">Restaurer depuis un fichier</button>
      <input type="file" id="sFichier" accept=".json,application/json" hidden>
    </div>
    <h3>Avec un code</h3>
    <p class="famille">Pratique sur téléphone : copiez le code, envoyez-le vous (message, mail), puis collez-le sur l'autre appareil.</p>
    <textarea id="sCode" rows="4" readonly style="width:100%;font-size:13px">${enCode(paquet())}</textarea>
    <div class="actions" style="justify-content:flex-start;flex-wrap:wrap">
      <button class="btn" id="sCopier">Copier mon code</button>
      <button class="btn sombre" id="sColler">Restaurer depuis un code</button>
    </div>`);
  document.getElementById('sTelecharger').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(paquet(), null, 1)], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `grimoire-sauvegarde-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  document.getElementById('sOuvrir').onclick = () => document.getElementById('sFichier').click();
  document.getElementById('sFichier').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(t => restaurer(JSON.parse(t))).catch(() => toast('Ce fichier n\'est pas une sauvegarde lisible.'));
  };
  document.getElementById('sCopier').onclick = async () => {
    const zone = document.getElementById('sCode');
    try { await navigator.clipboard.writeText(zone.value); } catch (e) { zone.select(); document.execCommand('copy'); }
    toast('Code copié.');
  };
  document.getElementById('sColler').onclick = () => {
    const c = prompt('Collez ici votre code de sauvegarde :');
    if (!c) return;
    try { restaurer(deCode(c.trim())); } catch (e) { toast('Ce code n\'est pas valide.'); }
  };
}

// ═════════════════════════════════════════════ fenêtre (réutilise le papier de la leçon)
function ouvrirFeuille(html) {
  $('#leconPapier').innerHTML = `<button class="fermer" aria-label="Fermer">×</button>${html}<div class="filet">❦</div>`;
  $('#leconPapier').querySelector('.fermer').onclick = fermerLecon;
  $('#lecon').classList.add('ouvert'); $('#lecon').setAttribute('aria-hidden', 'false');
  $('#leconPapier').scrollTop = 0;
}

// ═════════════════════════════════════════════ boutons de l'accueil
function majBoutonsAccueil() {
  const zone = document.getElementById('accueilOutils'); if (!zone) return;
  zone.innerHTML = `${peutInstaller() ? '<button class="btn sombre" id="aInstaller">📲 Installer l\'appli</button>' : ''}
    <button class="btn sombre" id="aSauvegarde">💾 Ma sauvegarde</button>`;
  const i = document.getElementById('aInstaller'); if (i) i.onclick = installer;
  document.getElementById('aSauvegarde').onclick = ouvrirSauvegarde;
}
majBoutonsAccueil();
