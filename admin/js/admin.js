/* ADMIN - Claude Eric ALIMAKANGA */

var CFG = { user: 'admin', pass: 'admin123' };
var projects = [];
var certs = [];
var msgs = [];
var visits = 0;
var defaultProjects = [
  { id: 1, title: 'Infrastructure Réseau Entreprise', cat: 'reseau', category: 'reseau', desc: 'Conception et déploiement d\'une infrastructure réseau complète incluant VLANs, routage et sécurisation.', fullDesc: 'Conception et déploiement d\'une infrastructure réseau complète pour une entreprise. Le projet incluait la segmentation réseau avec VLANs, la mise en place du routage inter-VLAN, la configuration de pare-feu, la mise en place d\'un VPN site-à-site et la surveillance réseau.', image: 'images/projects/reseau1.jpg', date: '2026', tech: ['Cisco', 'VLAN', 'VPN', 'Firewall'] },
  { id: 2, title: 'Application Web de Gestion', cat: 'dev', category: 'dev', desc: 'Développement d\'une application web complète avec HTML, CSS, JavaScript et connexion base de données.', fullDesc: 'Développement d\'une application web complète de gestion comprenant les modules d\'inscription, suivi des données, et génération de rapports. Technologies utilisées : HTML, CSS, JavaScript, et PHP/MySQL pour le backend.', image: 'images/projects/dev1.jpg', date: '2026', tech: ['HTML', 'CSS', 'JavaScript', 'MySQL'] },
  { id: 3, title: 'Administration Système Windows & Linux', cat: 'reseau', category: 'reseau', desc: 'Mise en place et administration de serveurs Windows Server et Linux en environnement professionnel.', fullDesc: 'Mise en place et administration complète de serveurs Windows Server et Linux. Configuration des services Active Directory, DNS, DHCP, ainsi que l\'automatisation des tâches avec des scripts.', image: 'images/projects/reseau2.jpg', date: '2023', tech: ['Windows Server', 'Linux', 'Active Directory', 'DNS'] },
  { id: 4, title: 'Application Java de Gestion de Stock', cat: 'dev', category: 'dev', desc: 'Application desktop développée en Java avec interface graphique et base de données locale.', fullDesc: 'Conception et développement d\'une application de gestion de stock en Java avec interface Swing. Fonctionnalités : gestion des entrées/sorties, alertes de seuil, et génération de rapports.', image: 'images/projects/dev2.jpg', date: '2023', tech: ['Java', 'Swing', 'MySQL'] }
];
var defaultCerts = [
  { id: 1, title: 'CCNA - Cisco Certified Network Associate', issuer: 'Cisco', date: '2024', image: 'images/certifications/ccna.jpg' },
  { id: 2, title: 'Certification Linux Essentials', issuer: 'LPI', date: '2023', image: 'images/certifications/linux.jpg' },
  { id: 3, title: 'Certification Java SE', issuer: 'Oracle', date: '2023', image: 'images/certifications/java.jpg' }
];
var tempProjectImage = '';
var tempCertImage = '';
var tempProfilePhoto = '';
var tempAboutPhoto = '';
var imageReadPending = { project: false, cert: false, profile: false, about: false };

// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  initNav();
  initForms();
  initFiles();
  loadData();

  // Check if already logged in
  if (localStorage.getItem('ca_admin_token')) {
    showDashboard();
  }
});

// ========================================
// AUTH
// ========================================
function initAuth() {
  var form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var u = document.getElementById('loginUser').value.trim();
    var p = document.getElementById('loginPass').value;
    var savedPass = localStorage.getItem('ca_admin_pass') || CFG.pass;
    var savedUser = localStorage.getItem('ca_admin_user') || CFG.user;

    if (u === savedUser && p === savedPass) {
      if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('ca_admin_token', 'tk_' + Date.now());
      }
      showDashboard();
      notify('Connexion reussie !');
    } else {
      notify('Identifiants incorrects !', true);
    }
  });

  // Toggle password
  var toggle = document.getElementById('togglePass');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var inp = document.getElementById('loginPass');
      if (inp.type === 'password') {
        inp.type = 'text';
        this.textContent = '🙈';
      } else {
        inp.type = 'password';
        this.textContent = '👁';
      }
    });
  }

  // Logout
  var logout = document.getElementById('logoutBtn');
  if (logout) {
    logout.addEventListener('click', function() {
      localStorage.removeItem('ca_admin_token');
      location.reload();
    });
  }
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  updateDash();
  renderActs();
}

// ========================================
// NAVIGATION
// ========================================
function initNav() {
  var links = document.querySelectorAll('.side-link[data-page]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      e.preventDefault();
      var page = this.getAttribute('data-page');
      showPage(page);

      // Remove active from all
      var all = document.querySelectorAll('.side-link');
      for (var j = 0; j < all.length; j++) {
        all[j].classList.remove('active');
      }
      this.classList.add('active');
    });
  }

  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }
}

function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }
  var target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  if (name === 'dash') updateDash();
  if (name === 'projects') renderProjects();
  if (name === 'certs') renderCerts();
  if (name === 'msgs') renderMsgs();
}

// ========================================
// DATA
// ========================================
function loadData() {
  try { projects = JSON.parse(localStorage.getItem('ca_projects') || 'null') || defaultProjects.map(function(p) { return Object.assign({}, p, { tech: p.tech.slice() }); }); } catch(e) { projects = defaultProjects.map(function(p) { return Object.assign({}, p, { tech: p.tech.slice() }); }); }
  try { certs = JSON.parse(localStorage.getItem('ca_certs') || 'null') || defaultCerts.map(function(c) { return Object.assign({}, c); }); } catch(e) { certs = defaultCerts.map(function(c) { return Object.assign({}, c); }); }
  try { msgs = JSON.parse(localStorage.getItem('ca_messages') || '[]'); } catch(e) { msgs = []; }
  try { visits = parseInt(localStorage.getItem('ca_visits') || '0'); } catch(e) { visits = 0; }

  try {
    var portfolioPhotos = JSON.parse(localStorage.getItem('ca_portfolio_photos') || '{}');
    tempProfilePhoto = portfolioPhotos.profile || '';
    tempAboutPhoto = portfolioPhotos.about || '';
    if (tempProfilePhoto) showImagePreview('profilePhotoPreview', tempProfilePhoto);
    if (tempAboutPhoto) showImagePreview('aboutPhotoPreview', tempAboutPhoto);
  } catch(e) {
    notify('Impossible de charger les photos enregistrées.', true);
  }

  // Load profile settings
  try {
    var prof = JSON.parse(localStorage.getItem('ca_profile') || '{}');
    if (prof.name) document.getElementById('pName').value = prof.name;
    if (prof.title) document.getElementById('pTitle').value = prof.title;
    if (prof.email) document.getElementById('pEmail').value = prof.email;
    if (prof.phone1) document.getElementById('pPhone1').value = prof.phone1;
    if (prof.phone2) document.getElementById('pPhone2').value = prof.phone2;
    if (prof.country) document.getElementById('pCountry').value = prof.country;
    if (prof.bio) document.getElementById('pBio').value = prof.bio;
  } catch(e) {}

  var u = localStorage.getItem('ca_admin_user');
  if (u) document.getElementById('sUser').value = u;
}

function saveProjects() { localStorage.setItem('ca_projects', JSON.stringify(projects)); }
function saveCerts() { localStorage.setItem('ca_certs', JSON.stringify(certs)); }
function saveMsgs() { localStorage.setItem('ca_messages', JSON.stringify(msgs)); }

// ========================================
// DASHBOARD
// ========================================
function updateDash() {
  var elProj = document.getElementById('stProjects');
  var elCert = document.getElementById('stCerts');
  var elMsg = document.getElementById('stMsgs');
  var elVisit = document.getElementById('stVisits');

  if (elProj) elProj.textContent = projects.length;
  if (elCert) elCert.textContent = certs.length;
  if (elMsg) elMsg.textContent = msgs.length;
  if (elVisit) elVisit.textContent = visits;

  var unread = 0;
  for (var i = 0; i < msgs.length; i++) {
    if (!msgs[i].read) unread++;
  }
  var badge = document.getElementById('msgBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'inline-block' : 'none';
  }
}

// ========================================
// PROJECTS
// ========================================
function renderProjects() {
  var tb = document.getElementById('tbProjects');
  if (!tb) return;

  if (projects.length === 0) {
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;">Aucune realisation. Cliquez sur "Ajouter" pour commencer.</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < projects.length; i++) {
    var p = projects[i];
    var category = p.cat || p.category;
    var catColor = category === 'reseau' ? '#2563eb' : '#10b981';
    var catBg = category === 'reseau' ? 'rgba(37,99,235,.1)' : 'rgba(16,185,129,.1)';
    var catLabel = category === 'reseau' ? 'Reseau' : 'Dev';
    var techStr = (p.tech || []).slice(0, 3).join(', ');

    html += '<tr>' +
      '<td>' + (p.image ? '<img src="' + p.image + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px;">' : '<div style="width:60px;height:40px;background:#f1f5f9;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#94a3b8;">IMG</div>') + '</td>' +
      '<td><strong>' + esc(p.title) + '</strong></td>' +
      '<td><span style="padding:4px 10px;border-radius:50px;font-size:.75rem;font-weight:600;background:' + catBg + ';color:' + catColor + ';">' + catLabel + '</span></td>' +
      '<td>' + (p.date || '-') + '</td>' +
      '<td>' + techStr + '</td>' +
      '<td><button onclick="editProject(' + p.id + ')" style="padding:6px 10px;border:none;border-radius:6px;cursor:pointer;background:rgba(37,99,235,.1);color:#2563eb;margin-right:6px;">Modifier</button><button onclick="delProject(' + p.id + ')" style="padding:6px 10px;border:none;border-radius:6px;cursor:pointer;background:rgba(239,68,68,.1);color:#ef4444;">Suppr</button></td>' +
      '</tr>';
  }
  tb.innerHTML = html;
}

var btnAddProj = document.getElementById('btnAddProject');
if (btnAddProj) {
  btnAddProj.addEventListener('click', function() {
    openProjectModal(null);
  });
}

function openProjectModal(p) {
  document.getElementById('mpId').value = p ? p.id : '';
  document.getElementById('mpTitle').textContent = p ? 'Modifier la realisation' : 'Ajouter une realisation';
  document.getElementById('mpTitleInput').value = p ? p.title : '';
  document.getElementById('mpCat').value = p ? (p.cat || p.category) : 'reseau';
  document.getElementById('mpDesc').value = p ? p.desc : '';
  document.getElementById('mpFull').value = p ? p.fullDesc : '';
  document.getElementById('mpDate').value = p ? p.date : '';
  document.getElementById('mpTech').value = p ? (p.tech || []).join(', ') : '';

  // Gestion de l'image
  var preview = document.getElementById('mpPreview');
  tempProjectImage = p && p.image ? p.image : '';
  document.getElementById('mpFile').value = '';
  if (tempProjectImage) showImagePreview('mpPreview', tempProjectImage);
  else if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }

  openModal('modalProject');
}

var formProj = document.getElementById('formProject');
if (formProj) {
  formProj.addEventListener('submit', function(e) {
    e.preventDefault();
    if (imageReadPending.project) {
      notify('Veuillez attendre le chargement de l’image.', true);
      return;
    }
    var id = document.getElementById('mpId').value;
    var techStr = document.getElementById('mpTech').value;
    var techArr = [];
    if (techStr) {
      var parts = techStr.split(',');
      for (var i = 0; i < parts.length; i++) {
        var t = parts[i].trim();
        if (t) techArr.push(t);
      }
    }

    var data = {
      id: id ? parseInt(id) : Date.now(),
      title: document.getElementById('mpTitleInput').value,
      cat: document.getElementById('mpCat').value,
      category: document.getElementById('mpCat').value,
      desc: document.getElementById('mpDesc').value,
      fullDesc: document.getElementById('mpFull').value,
      date: document.getElementById('mpDate').value,
      tech: techArr,
      image: tempProjectImage
    };

    if (id) {
      var idx = -1;
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(id)) { idx = i; break; }
      }
      if (idx > -1) projects[idx] = data;
    } else {
      projects.push(data);
    }

    try {
      saveProjects();
    } catch (error) {
      notify('Enregistrement impossible : le stockage du navigateur est plein.', true);
      return;
    }
    closeModals();
    renderProjects();
    updateDash();
    notify(id ? 'Realisation modifiee' : 'Realisation ajoutee');
  });
}

function editProject(id) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      openProjectModal(projects[i]);
      break;
    }
  }
}

function delProject(id) {
  if (!confirm('Supprimer cette realisation ?')) return;
  var newArr = [];
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id !== id) newArr.push(projects[i]);
  }
  projects = newArr;
  saveProjects();
  renderProjects();
  updateDash();
  notify('Realisation supprimee');
}

// ========================================
// CERTIFICATIONS
// ========================================
function renderCerts() {
  var tb = document.getElementById('tbCerts');
  if (!tb) return;

  if (certs.length === 0) {
    tb.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:#64748b;">Aucune certification. Cliquez sur "Ajouter" pour commencer.</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < certs.length; i++) {
    var c = certs[i];
    html += '<tr>' +
      '<td>' + (c.image ? '<img src="' + c.image + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px;">' : '<div style="width:60px;height:40px;background:#f1f5f9;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#94a3b8;">IMG</div>') + '</td>' +
      '<td><strong>' + esc(c.title) + '</strong></td>' +
      '<td>' + esc(c.issuer) + '</td>' +
      '<td>' + (c.date || '-') + '</td>' +
      '<td><button onclick="editCert(' + c.id + ')" style="padding:6px 10px;border:none;border-radius:6px;cursor:pointer;background:rgba(37,99,235,.1);color:#2563eb;margin-right:6px;">Modifier</button><button onclick="delCert(' + c.id + ')" style="padding:6px 10px;border:none;border-radius:6px;cursor:pointer;background:rgba(239,68,68,.1);color:#ef4444;">Suppr</button></td>' +
      '</tr>';
  }
  tb.innerHTML = html;
}

var btnAddCert = document.getElementById('btnAddCert');
if (btnAddCert) {
  btnAddCert.addEventListener('click', function() {
    openCertModal(null);
  });
}

function openCertModal(c) {
  document.getElementById('mcId').value = c ? c.id : '';
  document.getElementById('mcTitle').textContent = c ? 'Modifier la certification' : 'Ajouter une certification';
  document.getElementById('mcTitleInput').value = c ? c.title : '';
  document.getElementById('mcIssuer').value = c ? c.issuer : '';
  document.getElementById('mcDate').value = c ? c.date : '';

  // Gestion de l'image
  var preview = document.getElementById('mcPreview');
  tempCertImage = c && c.image ? c.image : '';
  document.getElementById('mcFile').value = '';
  if (tempCertImage) showImagePreview('mcPreview', tempCertImage);
  else if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }

  openModal('modalCert');
}

var formCertEl = document.getElementById('formCert');
if (formCertEl) {
  formCertEl.addEventListener('submit', function(e) {
    e.preventDefault();
    if (imageReadPending.cert) {
      notify('Veuillez attendre le chargement de l’image.', true);
      return;
    }
    var id = document.getElementById('mcId').value;
    var data = {
      id: id ? parseInt(id) : Date.now(),
      title: document.getElementById('mcTitleInput').value,
      issuer: document.getElementById('mcIssuer').value,
      date: document.getElementById('mcDate').value,
      image: tempCertImage
    };

    if (id) {
      var idx = -1;
      for (var i = 0; i < certs.length; i++) {
        if (certs[i].id === parseInt(id)) { idx = i; break; }
      }
      if (idx > -1) certs[idx] = data;
    } else {
      certs.push(data);
    }

    try {
      saveCerts();
    } catch (error) {
      notify('Enregistrement impossible : le stockage du navigateur est plein.', true);
      return;
    }
    closeModals();
    renderCerts();
    updateDash();
    notify(id ? 'Certification modifiee' : 'Certification ajoutee');
  });
}

function editCert(id) {
  for (var i = 0; i < certs.length; i++) {
    if (certs[i].id === id) {
      openCertModal(certs[i]);
      break;
    }
  }
}

function delCert(id) {
  if (!confirm('Supprimer cette certification ?')) return;
  var newArr = [];
  for (var i = 0; i < certs.length; i++) {
    if (certs[i].id !== id) newArr.push(certs[i]);
  }
  certs = newArr;
  saveCerts();
  renderCerts();
  updateDash();
  notify('Certification supprimee');
}

// ========================================
// MESSAGES
// ========================================
function renderMsgs() {
  var box = document.getElementById('msgsList');
  if (!box) return;

  if (msgs.length === 0) {
    box.innerHTML = '<p style="color:#64748b;padding:40px;text-align:center;">Aucun message recu</p>';
    return;
  }

  // Sort by date desc
  var sorted = msgs.slice().sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  var html = '';
  for (var i = 0; i < sorted.length; i++) {
    var m = sorted[i];
    var unreadClass = m.read ? '' : ' unread';
    html += '<div class="msg-item' + unreadClass + '" onclick="viewMsg(' + Number(m.id) + ')">' +
      '<div class="msg-head"><span class="msg-sender">' + esc(m.name) + '</span><span class="msg-date">' + fmtDate(m.date) + '</span></div>' +
      '<div class="msg-sub">' + esc(m.subject) + '</div>' +
      '<div class="msg-prev">' + esc(m.message.substring(0, 120)) + '...</div>' +
      '<button type="button" class="btn btn-danger msg-delete" onclick="event.stopPropagation();delMsg(' + Number(m.id) + ')">Supprimer</button></div>';
  }
  box.innerHTML = html;
}

function viewMsg(id) {
  var m = null;
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].id === id) { m = msgs[i]; break; }
  }
  if (!m) return;

  m.read = true;
  saveMsgs();
  renderMsgs();
  updateDash();

  document.getElementById('msgContent').innerHTML =
    '<div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">' +
    '<h3 style="margin-bottom:8px;">' + esc(m.subject) + '</h3>' +
    '<div style="color:#64748b;font-size:.9rem;">' +
    'De: <strong>' + esc(m.name) + '</strong> &lt;' + esc(m.email) + '&gt;<br>' +
    'Date: ' + fmtDate(m.date) + '</div></div>' +
    '<div style="line-height:1.8;white-space:pre-wrap;">' + esc(m.message) + '</div>';
  openModal('modalMsg');
}

var btnReadAll = document.getElementById('btnReadAll');
if (btnReadAll) {
  btnReadAll.addEventListener('click', function() {
    for (var i = 0; i < msgs.length; i++) {
      msgs[i].read = true;
    }
    saveMsgs();
    renderMsgs();
    updateDash();
    notify('Tous les messages marques comme lus');
  });
}

var btnDeleteAllMsgs = document.getElementById('btnDeleteAllMsgs');
if (btnDeleteAllMsgs) {
  btnDeleteAllMsgs.addEventListener('click', function() {
    if (!msgs.length || !confirm('Supprimer définitivement tous les messages ?')) return;
    var previousMessages = msgs;
    msgs = [];
    try {
      saveMsgs();
    } catch (error) {
      msgs = previousMessages;
      notify('Impossible de supprimer les messages.', true);
      return;
    }
    renderMsgs();
    updateDash();
    notify('Tous les messages ont été supprimés.');
  });
}

function delMsg(id) {
  if (!confirm('Supprimer définitivement ce message ?')) return;
  var index = -1;
  for (var i = 0; i < msgs.length; i++) {
    if (Number(msgs[i].id) === id) { index = i; break; }
  }
  if (index === -1) return;
  var deleted = msgs.splice(index, 1)[0];
  try {
    saveMsgs();
  } catch (error) {
    msgs.splice(index, 0, deleted);
    notify('Impossible de supprimer ce message.', true);
    return;
  }
  renderMsgs();
  updateDash();
  notify('Message supprimé.');
}

// ========================================
// SETTINGS
// ========================================
function initForms() {
  var formProf = document.getElementById('formProfile');
  if (formProf) {
    formProf.addEventListener('submit', function(e) {
      e.preventDefault();
      var prof = {
        name: document.getElementById('pName').value,
        title: document.getElementById('pTitle').value,
        email: document.getElementById('pEmail').value,
        phone1: document.getElementById('pPhone1').value,
        phone2: document.getElementById('pPhone2').value,
        country: document.getElementById('pCountry').value,
        bio: document.getElementById('pBio').value
      };
      localStorage.setItem('ca_profile', JSON.stringify(prof));
      notify('Profil sauvegarde !');
      addAct("Mise a jour du profil");
    });
  }

  var formPhotos = document.getElementById('formPortfolioPhotos');
  if (formPhotos) {
    formPhotos.addEventListener('submit', function(e) {
      e.preventDefault();
      if (imageReadPending.profile || imageReadPending.about) {
        notify('Veuillez attendre le chargement des photos.', true);
        return;
      }
      try {
        localStorage.setItem('ca_portfolio_photos', JSON.stringify({
          profile: tempProfilePhoto,
          about: tempAboutPhoto
        }));
      } catch (error) {
        notify('Enregistrement impossible : le stockage du navigateur est plein.', true);
        return;
      }
      notify('Photos du portfolio enregistrées.');
      addAct('Mise a jour des photos du portfolio');
    });
  }

  var formSec = document.getElementById('formSecurity');
  if (formSec) {
    formSec.addEventListener('submit', function(e) {
      e.preventDefault();
      var old = document.getElementById('sOld').value;
      var neu = document.getElementById('sNew').value;
      var conf = document.getElementById('sConfirm').value;
      var cur = localStorage.getItem('ca_admin_pass') || CFG.pass;

      if (old !== cur) { notify('Ancien mot de passe incorrect', true); return; }
      if (neu !== conf) { notify('Les mots de passe ne correspondent pas', true); return; }
      if (neu.length < 6) { notify('Minimum 6 caracteres', true); return; }

      localStorage.setItem('ca_admin_pass', neu);
      localStorage.setItem('ca_admin_user', document.getElementById('sUser').value);
      notify('Mot de passe change !');
      addAct('Changement de mot de passe');
      e.target.reset();
    });
  }
}

// ========================================
// FILE INPUTS - STOCKAGE LOCAL
// ========================================
function initFiles() {
  document.getElementById('mpFile').addEventListener('change', function() {
    handleFileUpload(this, 'mpPreview', 'project');
  });
  document.getElementById('mcFile').addEventListener('change', function() {
    handleFileUpload(this, 'mcPreview', 'cert');
  });
  document.getElementById('profilePhotoFile').addEventListener('change', function() {
    handleFileUpload(this, 'profilePhotoPreview', 'profile');
  });
  document.getElementById('aboutPhotoFile').addEventListener('change', function() {
    handleFileUpload(this, 'aboutPhotoPreview', 'about');
  });
}

function handleFileUpload(input, previewId, type) {
  var file = input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    input.value = '';
    notify('Veuillez choisir un fichier image.', true);
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    input.value = '';
    notify('Image trop grande. Max 2MB.', true);
    return;
  }

  var reader = new FileReader();
  imageReadPending[type] = true;
  reader.onload = function(e) {
    imageReadPending[type] = false;
    if (typeof e.target.result !== 'string') {
      notify('Impossible de lire ce fichier image.', true);
      return;
    }
    if (type === 'project') tempProjectImage = e.target.result;
    else if (type === 'cert') tempCertImage = e.target.result;
    else if (type === 'profile') tempProfilePhoto = e.target.result;
    else tempAboutPhoto = e.target.result;
    showImagePreview(previewId, e.target.result);
  };
  reader.onerror = function() {
    imageReadPending[type] = false;
    notify('Erreur lors de la lecture du fichier image.', true);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(previewId, src) {
  var preview = document.getElementById(previewId);
  if (!preview) return;

  preview.innerHTML = '<img src="' + src + '" style="max-width:200px;max-height:150px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);">' +
    '<button type="button" onclick="removeImage(\'' + previewId + '\')" style="display:block;margin-top:8px;padding:6px 12px;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:.85rem;">❌ Supprimer</button>';
  preview.style.display = 'block';
}

function removeImage(previewId) {
  var preview = document.getElementById(previewId);
  if (preview) {
    preview.innerHTML = '';
    preview.style.display = 'none';
  }

  // Reset temp
  if (previewId === 'mpPreview') {
    tempProjectImage = '';
    var input = document.getElementById('mpFile');
    if (input) input.value = '';
  } else if (previewId === 'mcPreview') {
    tempCertImage = '';
    var input = document.getElementById('mcFile');
    if (input) input.value = '';
  } else if (previewId === 'profilePhotoPreview') {
    tempProfilePhoto = '';
    var profileInput = document.getElementById('profilePhotoFile');
    if (profileInput) profileInput.value = '';
  } else if (previewId === 'aboutPhotoPreview') {
    tempAboutPhoto = '';
    var aboutInput = document.getElementById('aboutPhotoFile');
    if (aboutInput) aboutInput.value = '';
  }
}

function clearStoredImages() {
  tempProjectImage = '';
  tempCertImage = '';
  imageReadPending.project = false;
  imageReadPending.cert = false;
}

// ========================================
// MODALS
// ========================================
function openModal(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModals() {
  var modals = document.querySelectorAll('.modal');
  for (var i = 0; i < modals.length; i++) {
    modals[i].classList.remove('active');
  }
  document.body.style.overflow = '';
  clearStoredImages();
}

// Close on backdrop click
var modals = document.querySelectorAll('.modal');
for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener('click', function(e) {
    if (e.target === this) closeModals();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModals();
});

// ========================================
// ACTIVITIES
// ========================================
function addAct(text) {
  var acts = [];
  try {
    acts = JSON.parse(localStorage.getItem('ca_acts') || '[]');
  } catch(e) {}
  acts.unshift({ text: text, date: new Date().toISOString() });
  if (acts.length > 20) acts.pop();
  localStorage.setItem('ca_acts', JSON.stringify(acts));
  renderActs();
}

function renderActs() {
  var box = document.getElementById('activityList');
  if (!box) return;

  var acts = [];
  try {
    acts = JSON.parse(localStorage.getItem('ca_acts') || '[]');
  } catch(e) {}

  if (acts.length === 0) {
    box.innerHTML = '<p style="color:#64748b;padding:20px;">Aucune activite</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < acts.length; i++) {
    html += '<div style="display:flex;gap:12px;padding:10px;border-radius:8px;">' +
      '<div style="width:36px;height:36px;min-width:36px;background:rgba(37,99,235,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-size:1.1rem;">&#10003;</div>' +
      '<div><p style="font-size:.9rem;">' + esc(acts[i].text) + '</p><p style="font-size:.8rem;color:#64748b;">' + fmtDate(acts[i].date) + '</p></div></div>';
  }
  box.innerHTML = html;
}

// ========================================
// UTILS
// ========================================
function notify(text, isError) {
  var box = document.getElementById('notifBox');
  if (!box) return;

  var n = document.createElement('div');
  var color = isError ? '#ef4444' : '#10b981';
  var icon = isError ? '&#9888; ' : '&#10003; ';
  n.style.cssText = 'background:#fff;padding:14px 20px;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.12);display:flex;align-items:center;gap:10px;min-width:260px;margin-bottom:10px;border-left:4px solid ' + color + ';animation:slideIn .3s;';
  n.innerHTML = '<span style="font-size:1.2rem;">' + icon + '</span><span>' + esc(text) + '</span>';
  box.appendChild(n);

  setTimeout(function() {
    n.style.opacity = '0';
    n.style.transform = 'translateX(100%)';
    n.style.transition = 'all .3s';
    setTimeout(function() { n.remove(); }, 300);
  }, 3500);
}

function fmtDate(d) {
  var date = new Date(d);
  var now = new Date();
  var diff = now - date;
  if (diff < 60000) return "A linstant";
  if (diff < 3600000) return 'Il y a ' + Math.floor(diff / 60000) + ' min';
  if (diff < 86400000) return 'Il y a ' + Math.floor(diff / 3600000) + ' h';
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
