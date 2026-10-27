/* ========================================
   PORTFOLIO - CLAUDE ERIC ALIMAKANGA
   JS Propre - Fichier Séparé
   ======================================== */

// Données initiales
const defaultProjects = [
  {
    id:1, title:"Infrastructure Réseau Entreprise", category:"reseau",
    desc:"Conception et déploiement d'une infrastructure réseau complète incluant VLANs, routage et sécurisation.",
    fullDesc:"Conception et déploiement d'une infrastructure réseau complète pour une entreprise. Le projet incluait la segmentation réseau avec VLANs, la mise en place du routage inter-VLAN, la configuration de pare-feu, la mise en place d'un VPN site-à-site et la surveillance réseau.",
    image:"images/projects/reseau1.jpg", date:"2026",
    tech:["Cisco","VLAN","VPN","Firewall"]
  },
  {
    id:2, title:"Application Web de Gestion", category:"dev",
    desc:"Développement d'une application web complète avec HTML, CSS, JavaScript et connexion base de données.",
    fullDesc:"Développement d'une application web complète de gestion comprenant les modules d'inscription, suivi des données, et génération de rapports. Technologies utilisées : HTML, CSS, JavaScript, et PHP/MySQL pour le backend.",
    image:"images/projects/dev1.jpg", date:"2026",
    tech:["HTML","CSS","JavaScript","MySQL"]
  },
  {
    id:3, title:"Administration Système Windows & Linux", category:"reseau",
    desc:"Mise en place et administration de serveurs Windows Server et Linux en environnement professionnel.",
    fullDesc:"Mise en place et administration complète de serveurs Windows Server et Linux. Configuration des services Active Directory, DNS, DHCP, ainsi que l'automatisation des tâches avec des scripts.",
    image:"images/projects/reseau2.jpg", date:"2023",
    tech:["Windows Server","Linux","Active Directory","DNS"]
  },
  {
    id:4, title:"Application Java de Gestion de Stock", category:"dev",
    desc:"Application desktop développée en Java avec interface graphique et base de données locale.",
    fullDesc:"Conception et développement d'une application de gestion de stock en Java avec interface Swing. Fonctionnalités : gestion des entrées/sorties, alertes de seuil, et génération de rapports.",
    image:"images/projects/dev2.jpg", date:"2023",
    tech:["Java","Swing","MySQL"]
  }
];

const defaultCerts = [
  {id:1, title:"CCNA - Cisco Certified Network Associate", issuer:"Cisco", date:"2024", image:"images/certifications/ccna.jpg"},
  {id:2, title:"Certification Linux Essentials", issuer:"LPI", date:"2023", image:"images/certifications/linux.jpg"},
  {id:3, title:"Certification Java SE", issuer:"Oracle", date:"2023", image:"images/certifications/java.jpg"}
];

// Charger depuis localStorage ou utiliser défaut
let projects = JSON.parse(localStorage.getItem('ca_projects') || JSON.stringify(defaultProjects));
let certs = JSON.parse(localStorage.getItem('ca_certs') || JSON.stringify(defaultCerts));

// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioPhotos();
  initNav();
  initScroll();
  renderProjects('all');
  renderCerts();
  initFilters();
  initContact();
  initModal();
  initGoTop();
});

function applyPortfolioPhotos() {
  let photos = {};
  try {
    photos = JSON.parse(localStorage.getItem('ca_portfolio_photos') || '{}');
  } catch (error) {
    console.error('Impossible de charger les photos du portfolio.', error);
    return;
  }

  const photoTargets = [
    { id: 'profilePhoto', src: photos.profile },
    { id: 'aboutPhoto', src: photos.about }
  ];
  photoTargets.forEach(({ id, src }) => {
    const target = document.getElementById(id);
    if (!target || !src) return;
    const image = document.createElement('img');
    image.src = src;
    image.alt = id === 'profilePhoto' ? 'Photo de profil' : 'Photo de présentation';
    target.replaceChildren(image);
    target.classList.add('has-photo');
  });
}

// ========================================
// NAVIGATION
// ========================================
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// ========================================
// SCROLL SPY + GO TOP
// ========================================
function initScroll() {
  const nav = document.getElementById('navbar');
  const goTop = document.getElementById('goTop');
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar shadow
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Go top
    goTop.classList.toggle('visible', window.scrollY > 500);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

function initGoTop() {
  document.getElementById('goTop').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// RENDER PROJECTS
// ========================================
function renderProjects(filter) {
  const wrap = document.getElementById('projectsWrap');
  const list = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (list.length === 0) {
    wrap.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;">Aucune réalisation pour le moment.</p>';
    return;
  }

  wrap.innerHTML = list.map(p => `
    <div class="project-card" onclick="openProject(${p.id})">
      <div class="project-img">
        <img src="${p.image}" alt="${p.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22><rect fill=%22%23f1f5f9%22 width=%22800%22 height=%22600%22/><text x=%22400%22 y=%22300%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-size=%2220%22>${p.category === 'reseau' ? 'Réseau' : 'Dev'}</text></svg>'">
        <div class="project-overlay"><span>+</span></div>
      </div>
      <div class="project-body">
        <span class="project-cat">${p.category === 'reseau' ? 'Réseau & Système' : 'Développement'}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

function initFilters() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProjects(tab.dataset.filter);
    });
  });
}

// ========================================
// RENDER CERTIFICATIONS
// ========================================
function renderCerts() {
  const wrap = document.getElementById('certsWrap');
  if (certs.length === 0) {
    wrap.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;">Aucune certification pour le moment.</p>';
    return;
  }
  wrap.innerHTML = certs.map(c => `
    <div class="cert-card">
      <div class="cert-img">
        <img src="${c.image}" alt="${c.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22><rect fill=%22%23f1f5f9%22 width=%22600%22 height=%22400%22/><text x=%22300%22 y=%22200%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-size=%2218%22>Certification</text></svg>'">
      </div>
      <div class="cert-body">
        <h3>${c.title}</h3>
        <div class="issuer">${c.issuer}</div>
        <div class="date">${c.date}</div>
      </div>
    </div>
  `).join('');
}

// ========================================
// MODAL
// ========================================
function initModal() {
  const modal = document.getElementById('detailModal');
  document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('active'); });
}

function openProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalContent').innerHTML = `
    <img src="${p.image}" class="modal-img" alt="${p.title}" onerror="this.style.display='none'">
    <div class="modal-info">
      <span class="project-cat">${p.category === 'reseau' ? 'Réseau & Système' : 'Développement'}</span>
      <h2>${p.title}</h2>
      <p>${p.fullDesc}</p>
      <div class="project-tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
      <p style="margin-top:16px;color:var(--text-light)"><strong>Date :</strong> ${p.date}</p>
    </div>
  `;
  document.getElementById('detailModal').classList.add('active');
}

// ========================================
// CONTACT FORM
// ========================================
function initContact() {
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const msg = {
      id: Date.now(),
      name: document.getElementById('cName').value,
      email: document.getElementById('cEmail').value,
      subject: document.getElementById('cSubject').value,
      message: document.getElementById('cMessage').value,
      date: new Date().toISOString(),
      read: false
    };
    const msgs = JSON.parse(localStorage.getItem('ca_messages') || '[]');
    msgs.push(msg);
    localStorage.setItem('ca_messages', JSON.stringify(msgs));
    showNotif('Message envoyé avec succès !', 'ok');
    e.target.reset();
  });
}

function showNotif(text, type) {
  const n = document.createElement('div');
  n.className = 'notif ' + type;
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}
