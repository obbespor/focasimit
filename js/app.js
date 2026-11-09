/**
 * Tarihi Foça Simit Fırını — Müşteri Arayüzü & Mobil QR Menü Motoru (js/app.js)
 */

const STORAGE_KEY_PRODUCTS = 'tarihi_foca_simit_firini_menu_v4';
const STORAGE_KEY_CATEGORIES = 'tarihi_foca_simit_firini_categories_v4';
const STORAGE_KEY_BRANCHES = 'tarihi_foca_simit_firini_branches_v4';
const STORAGE_KEY_SITE = 'tarihi_foca_simit_firini_site_v4';
const STORAGE_KEY_GALLERY = 'tarihi_foca_simit_firini_gallery_v4';

const state = {
  lang: 'tr',
  activeView: 'vitrin', // 'vitrin' | 'qrmenu'
  activeBranch: 'foca', // 'foca' | 'bagarasi'
  selectedCategory: 'all',
  selectedTag: 'all', // 'all' | 'sicak' | 'imza' | 'tatli'
  mobileLayout: window.innerWidth < 640 ? 'compact' : 'grid',
  searchQuery: '',
  siteContent: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.siteContent)),
  branches: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.branches)),
  products: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.products)),
  categories: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.categories)),
  reviews: window.FOCA_MENU_DATA.reviews,
  gallery: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.gallery))
};

function loadPreviewOverridesFromStorage() {
  try {
    const rawProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (rawProds) {
      const parsed = JSON.parse(rawProds);
      if (Array.isArray(parsed) && parsed.length > 0) state.products = parsed;
    }
    const rawCats = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (rawCats) {
      const parsedC = JSON.parse(rawCats);
      if (Array.isArray(parsedC) && parsedC.length > 0) state.categories = parsedC;
    }
    const rawBranches = localStorage.getItem(STORAGE_KEY_BRANCHES);
    if (rawBranches) {
      const parsedB = JSON.parse(rawBranches);
      if (parsedB && parsedB.foca && parsedB.bagarasi) state.branches = parsedB;
    }
    const rawSite = localStorage.getItem(STORAGE_KEY_SITE);
    if (rawSite) {
      const parsedS = JSON.parse(rawSite);
      if (parsedS && parsedS.brandName) state.siteContent = { ...state.siteContent, ...parsedS };
    }
    const rawGal = localStorage.getItem(STORAGE_KEY_GALLERY);
    if (rawGal) {
      const parsedG = JSON.parse(rawGal);
      if (Array.isArray(parsedG) && parsedG.length > 0) state.gallery = parsedG;
    }
  } catch (e) {}
}

function getCategoryIcon(catId) {
  const found = state.categories.find(c => c.id === catId);
  return found && found.icon ? found.icon : '🥨';
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const text = document.getElementById('toastText');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.remove('hidden');
  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2000);
}

function renderSiteContentBindings() {
  const sc = state.siteContent;
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
  };
  const setSrc = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) {
      el.classList.remove('img-fallback-hidden');
      el.src = val;
    }
  };

  if (state.lang === 'tr') {
    setTxt('scBrandSub', sc.brandSub);
    setTxt('scBrandName', sc.brandName);
    setTxt('scHeroBadge', sc.heroBadge);
    setTxt('scHeroTitle1', sc.heroTitle1);
    setTxt('scHeroTitle2', sc.heroTitle2);
    setTxt('scHeroDesc', sc.heroDesc);
    setTxt('scStat1Val', sc.stat1Val);
    setTxt('scStat1Label', sc.stat1Label);
    setTxt('scStat2Val', sc.stat2Val);
    setTxt('scStat2Label', sc.stat2Label);
    setTxt('scStat3Val', sc.stat3Val);
    setTxt('scStat3Label', sc.stat3Label);
    setTxt('scAboutBadge', sc.aboutBadge);
    setTxt('scAboutTitle', sc.aboutTitle);
    setTxt('scAboutText1', sc.aboutText1);
    setTxt('scAboutText2', sc.aboutText2);
    setTxt('scCakeBadge', sc.cakeBadge);
    setTxt('scCakeTitle', sc.cakeTitle);
    setTxt('scCakeDesc', sc.cakeDesc);
    setTxt('scFooterBrand', sc.brandName);
    setTxt('scFooterDesc', sc.footerDesc);
    setTxt('scInstagramHandle', sc.instagramHandle);
  }

  setSrc('scHeroImg', sc.heroImg);
  setSrc('scCakeImg', sc.cakeImg);

  const waLink = document.getElementById('scWhatsappLink');
  if (waLink && sc.whatsappNumber) {
    const cleanNum = sc.whatsappNumber.replace(/\D/g, '');
    waLink.href = `https://wa.me/${cleanNum}?text=Merhaba%20Tarihi%20Fo%C3%A7a%20Simit%20F%C4%B1r%C4%B1n%C4%B1%2C%20%C3%B6zel%20g%C3%BCn%20pastas%C4%B1%20ve%20sipari%C5%9F%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`;
  }

  const igLink = document.getElementById('scInstagramHandle');
  if (igLink && sc.instagramUrl) {
    igLink.href = sc.instagramUrl;
  }

  setTxt('footerFocaAddr', '📍 ' + state.branches.foca.address);
  setTxt('footerFocaPhone', '📞 ' + state.branches.foca.phone);
  setTxt('footerFocaHours', '🕒 ' + state.branches.foca.hours);

  setTxt('footerBagAddr', '📍 ' + state.branches.bagarasi.address);
  setTxt('footerBagPhone', '📞 ' + state.branches.bagarasi.phone);
  setTxt('footerBagHours', '🕒 ' + state.branches.bagarasi.hours);
}

function switchMainView(viewName) {
  state.activeView = viewName;
  const vVitrin = document.getElementById('viewVitrin');
  const vQr = document.getElementById('viewQrMenu');

  if (vVitrin) vVitrin.classList.toggle('hidden', viewName !== 'vitrin');
  if (vQr) vQr.classList.toggle('hidden', viewName !== 'qrmenu');

  const btnVitrin = document.getElementById('navBtnVitrin');
  const btnQr = document.getElementById('navBtnQrMenu');

  if (btnVitrin) {
    btnVitrin.className = viewName === 'vitrin'
      ? 'hidden md:inline-flex px-3.5 py-2 rounded-xl text-sm font-bold transition bg-[#1e120b] text-white shadow-sm'
      : 'hidden md:inline-flex px-3.5 py-2 rounded-xl text-sm font-semibold transition text-[#1e120b] hover:bg-stone-200/70';
  }
  if (btnQr) {
    btnQr.className = viewName === 'qrmenu'
      ? 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#1e120b] text-[#f3c677] shadow-sm flex items-center gap-1.5'
      : 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#9a5818] text-white shadow-sm hover:bg-[#7c4510] flex items-center gap-1.5';
  }

  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectBranch(branchId) {
  if (branchId !== 'foca' && branchId !== 'bagarasi') return;
  state.activeBranch = branchId;
  renderAll();
  showToast(state.branches[branchId].name + ' Menüsü');
}

function openBranchMenuDirectly(branchId) {
  state.activeBranch = branchId;
  switchMainView('qrmenu');
}

function goToBranchesSection() {
  switchMainView('vitrin');
  setTimeout(() => {
    document.getElementById('subeler')?.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

function filterQrMenuByCategory(catId) {
  state.selectedCategory = catId;
  state.selectedTag = 'all';
  switchMainView('qrmenu');
}

function setMobileCardLayout(mode) {
  state.mobileLayout = mode;
  renderQrMenuSection();
}

const I18N = {
  tr: {
    navHome: 'Ana Sayfa',
    navAbout: 'Hakkımızda',
    navBranches: 'Şubelerimiz',
    navQrMenu: 'QR Menü',
    btnFocaMenu: 'Foça Şube Menü',
    btnBagarasiMenu: 'Bağarası Şube Menü',
    liveOvenCardTag: 'Taş Fırından Taze',
    liveOvenCardTitle: 'İmza Lezzetlerimiz',
    catStripTitle: 'Kategoriler'
  },
  en: {
    navHome: 'Home',
    navAbout: 'About Us',
    navBranches: 'Branches',
    navQrMenu: 'QR Menu',
    btnFocaMenu: 'Foça Branch Menu',
    btnBagarasiMenu: 'Bağarası Branch Menu',
    liveOvenCardTag: 'Fresh from the Stone Oven',
    liveOvenCardTitle: 'Signature Favorites',
    catStripTitle: 'Categories'
  }
};

function toggleLanguage() {
  state.lang = state.lang === 'tr' ? 'en' : 'tr';
  const btn = document.getElementById('btnLangToggle');
  if (btn) btn.textContent = state.lang === 'tr' ? 'EN' : 'TR';
  const dict = I18N[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  renderAll();
}

function getBranchProducts(branchId) {
  return state.products.filter(p => branchId === 'foca' ? p.foca : p.bagarasi);
}

function getFilteredQrProducts() {
  const branchProds = getBranchProducts(state.activeBranch);
  return branchProds.filter(p => {
    if (state.selectedCategory !== 'all' && p.cat !== state.selectedCategory) return false;
    if (state.selectedTag === 'sicak' && !p.hot) return false;
    if (state.selectedTag === 'imza' && !p.signature) return false;
    if (state.selectedTag === 'tatli' && p.cat !== 'kurupasta' && p.cat !== 'pasta' && p.cat !== 'dondurma') return false;
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q) || (p.nameEn || '').toLowerCase().includes(q);
      const matchDesc = (p.desc || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });
}

function handleQrSearch(val) {
  state.searchQuery = val || '';
  document.getElementById('btnClearSearch')?.classList.toggle('hidden', !state.searchQuery);
  renderQrMenuSection();
}

function clearQrSearch() {
  state.searchQuery = '';
  const input = document.getElementById('qrSearchInput');
  if (input) input.value = '';
  document.getElementById('btnClearSearch')?.classList.add('hidden');
  renderQrMenuSection();
}

function setTagFilter(tag) {
  state.selectedTag = tag;
  const mapIds = { all: 'tagBtnAll', sicak: 'tagBtnSicak', imza: 'tagBtnImza', tatli: 'tagBtnTatli' };
  Object.keys(mapIds).forEach(t => {
    const btn = document.getElementById(mapIds[t]);
    if (!btn) return;
    btn.className = t === tag
      ? 'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-[#d99b43] text-[#1e120b] transition shadow-sm shrink-0'
      : 'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-white/10 text-stone-200 hover:bg-white/15 transition shrink-0';
  });
  renderQrMenuSection();
}

function selectCategory(catId, btnEl) {
  state.selectedCategory = catId;
  renderQrMenuSection();
  if (btnEl && btnEl.scrollIntoView) {
    btnEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function openLightbox(src, caption) {
  if (!src) return;
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption || '';
  document.getElementById('modalLightbox').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('modalLightbox').classList.add('hidden');
}

function renderBranchIndicators() {
  const isFoca = state.activeBranch === 'foca';
  const bInfo = state.branches[state.activeBranch];

  const pFoca = document.getElementById('pillBranchFoca');
  const pBag = document.getElementById('pillBranchBagarasi');
  if (pFoca && pBag) {
    pFoca.className = isFoca
      ? 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-[#1e120b] text-[#f3c677] shadow-sm'
      : 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 text-stone-700 hover:bg-stone-200/70';
    pBag.className = !isFoca
      ? 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-[#1e120b] text-[#f3c677] shadow-sm'
      : 'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 text-stone-700 hover:bg-stone-200/70';
  }

  // Mobil Alt Gezinme Çubuğu
  const bNavHome = document.getElementById('mBottomHome');
  const bNavFoca = document.getElementById('mBottomFoca');
  const bNavBag = document.getElementById('mBottomBagarasi');
  if (bNavHome && bNavFoca && bNavBag) {
    const inQr = state.activeView === 'qrmenu';
    bNavHome.className = !inQr
      ? 'flex flex-col items-center justify-center py-2 text-[#f3c677] font-bold text-[11px]'
      : 'flex flex-col items-center justify-center py-2 text-stone-400 font-medium text-[11px]';
    bNavFoca.className = (inQr && isFoca)
      ? 'flex flex-col items-center justify-center py-2 text-[#f3c677] font-bold text-[11px]'
      : 'flex flex-col items-center justify-center py-2 text-stone-400 font-medium text-[11px]';
    bNavBag.className = (inQr && !isFoca)
      ? 'flex flex-col items-center justify-center py-2 text-[#f3c677] font-bold text-[11px]'
      : 'flex flex-col items-center justify-center py-2 text-stone-400 font-medium text-[11px]';
  }

  const vBadge = document.getElementById('vitrinMenuBranchBadge');
  if (vBadge) vBadge.textContent = bInfo.badge;

  const vBtnFoca = document.getElementById('vitrinBtnFoca');
  const vBtnBag = document.getElementById('vitrinBtnBagarasi');
  if (vBtnFoca && vBtnBag) {
    vBtnFoca.className = isFoca
      ? 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#1e120b] text-[#f3c677] shadow-sm'
      : 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-white text-stone-800 border border-stone-300 hover:bg-stone-50';
    vBtnBag.className = !isFoca
      ? 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#1e120b] text-[#f3c677] shadow-sm'
      : 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-white text-stone-800 border border-stone-300 hover:bg-stone-50';
  }

  const qTitle = document.getElementById('qrHeaderBranchTitle');
  const qAddr = document.getElementById('qrHeaderBranchAddress');
  const qHours = document.getElementById('qrHeaderHoursBadge');
  if (qTitle) qTitle.textContent = bInfo.name;
  if (qAddr) qAddr.textContent = '📍 ' + bInfo.address;
  if (qHours) qHours.textContent = bInfo.hours;

  const qSwFoca = document.getElementById('qrSwitchFoca');
  const qSwBag = document.getElementById('qrSwitchBagarasi');
  if (qSwFoca && qSwBag) {
    qSwFoca.className = isFoca
      ? 'flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#d99b43] text-[#1e120b] shadow text-center'
      : 'flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition text-stone-200 hover:bg-white/10 text-center';
    qSwBag.className = !isFoca
      ? 'flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-[#d99b43] text-[#1e120b] shadow text-center'
      : 'flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition text-stone-200 hover:bg-white/10 text-center';
  }
}

function renderBranchesSection() {
  const container = document.getElementById('branchesContainer');
  if (!container) return;

  const list = [state.branches.foca, state.branches.bagarasi];
  container.innerHTML = list.map(b => `
    <div class="bg-white rounded-3xl overflow-hidden border border-[#e6dac8] shadow-sm hover:shadow-xl transition flex flex-col justify-between group min-w-0">
      <div>
        <div class="relative h-52 sm:h-64 overflow-hidden hero-surface cursor-pointer" onclick="openLightbox('${b.img}', '${b.fullTitle}')">
          <img src="${b.img}" alt="${b.fullTitle}" onerror="this.classList.add('img-fallback-hidden')" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 max-w-full" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span class="px-2.5 py-1 rounded-full bg-white/95 text-[#1e120b] font-bold text-[11px] shadow">${b.tag}</span>
            <span class="px-2.5 py-1 rounded-full bg-[#1e120b]/90 text-[#f3c677] border border-[#f3c677]/30 font-bold text-[11px] shadow">${b.hours}</span>
          </div>
          <div class="absolute bottom-3 left-4 right-4 text-white">
            <div class="text-[10px] uppercase tracking-widest text-[#f3c677] font-bold">${state.siteContent.brandName}</div>
            <h3 class="font-serif-title text-xl sm:text-2xl font-bold leading-tight mt-0.5">${b.name}</h3>
          </div>
        </div>

        <div class="p-4 sm:p-6 pb-3 space-y-2">
          <p class="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
            <span class="text-[#9a5818] shrink-0">📍</span>
            <span class="break-words">${b.address}</span>
          </p>
          <p class="text-xs sm:text-sm text-stone-700 flex items-center gap-2">
            <span class="text-[#9a5818] shrink-0">📞</span>
            <a href="tel:${b.phone.replace(/\s+/g, '')}" class="font-semibold text-[#1e120b] hover:text-[#9a5818]">${b.phone}</a>
          </p>
        </div>
      </div>

      <div class="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-stone-100 flex items-center gap-2.5">
        <button onclick="openBranchMenuDirectly('${b.id}')" class="flex-1 px-4 py-3 rounded-xl bg-[#1e120b] hover:bg-[#311d12] text-[#f3c677] font-bold text-xs sm:text-sm transition text-center shadow-sm">
          ${b.name} Menüsü
        </button>
        <a href="${b.mapUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm transition shrink-0">
          Yol Tarifi ↗
        </a>
      </div>
    </div>
  `).join('');
}

function renderHeroSignatureCard() {
  const container = document.getElementById('heroSignatureItemsList');
  if (!container) return;
  const featured = getBranchProducts(state.activeBranch).filter(p => p.signature).slice(0, 4);
  container.innerHTML = featured.map(p => {
    const title = state.lang === 'en' && p.nameEn ? p.nameEn : p.name;
    const icon = getCategoryIcon(p.cat);
    const hasImg = Boolean(p.img && p.img.trim() !== '');
    return `
      <div class="flex items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 transition cursor-pointer min-w-0" onclick="switchMainView('qrmenu')">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="relative w-11 h-11 rounded-xl bg-[#341f13] border border-[#f3c677]/25 flex items-center justify-center text-base shrink-0 overflow-hidden">
            <span>${icon}</span>
            ${hasImg ? `<img src="${p.img}" alt="${title}" onerror="this.classList.add('img-fallback-hidden')" class="absolute inset-0 w-full h-full object-cover" />` : ''}
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-xs sm:text-sm text-white truncate">${title}</div>
            <div class="text-[11px] text-stone-300/80 truncate mt-0.5">${p.desc}</div>
          </div>
        </div>
        <div class="shrink-0 pl-1">
          <span class="px-2.5 py-1 rounded-lg bg-[#d99b43]/20 border border-[#f3c677]/35 text-[#f3c677] font-bold text-xs sm:text-sm whitespace-nowrap">${p.price} ₺</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderHomeCategoryStrip() {
  const grid = document.getElementById('homeCategoryVisualGrid');
  if (!grid) return;
  const cats = state.categories.filter(c => c.id !== 'all');
  grid.innerHTML = cats.map(c => {
    const label = state.lang === 'en' && c.nameEn ? c.nameEn : c.name;
    const count = getBranchProducts(state.activeBranch).filter(p => p.cat === c.id).length;
    const hasImg = Boolean(c.img && c.img.trim() !== '');
    return `
      <button onclick="filterQrMenuByCategory('${c.id}')" class="group relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-square border border-[#e6dac8] shadow-sm hover:shadow-lg transition text-left hero-surface min-w-0">
        ${hasImg ? `<img src="${c.img}" alt="${label}" onerror="this.classList.add('img-fallback-hidden')" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 max-w-full" />` : ''}
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>
        <div class="absolute inset-0 p-3 flex flex-col justify-between text-white">
          <span class="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/15 flex items-center justify-center text-base">${c.icon || '🥨'}</span>
          <div>
            <div class="font-serif-title font-bold text-sm sm:text-base leading-tight">${label}</div>
            <div class="text-[11px] text-[#f3c677] font-medium mt-0.5">${count} Çeşit</div>
          </div>
        </div>
      </button>
    `;
  }).join('');
}

function buildProductCardHtml(p, isQrMenuView) {
  const title = state.lang === 'en' && p.nameEn ? p.nameEn : p.name;
  const bothBranches = p.foca && p.bagarasi;
  const branchNote = bothBranches
    ? 'Foça & Bağarası'
    : (p.foca ? 'Foça Şube' : 'Bağarası Şube');
  const hasImage = Boolean(p.img && p.img.trim() !== '');
  const safeTitle = title.replace(/'/g, "\\'");
  const catIcon = getCategoryIcon(p.cat);

  // Mobil Öncelikli Liste Kartı (Sıkışıklığı Önleyen Zarif Tasarım)
  if (isQrMenuView && state.mobileLayout === 'compact') {
    return `
      <div class="bg-white rounded-2xl border border-[#e6dac8] shadow-sm hover:shadow-md transition p-3 sm:p-4 flex items-start gap-3 sm:gap-4 min-w-0">
        ${hasImage ? `
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden fallback-thumb shrink-0 cursor-pointer border border-[#e6dac8] flex items-center justify-center" onclick="openLightbox('${p.img}', '${safeTitle}')">
            <span class="text-2xl">${catIcon}</span>
            <img src="${p.img}" alt="${title}" loading="lazy" onerror="this.classList.add('img-fallback-hidden')" class="absolute inset-0 w-full h-full object-cover" />
          </div>
        ` : ''}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-serif-title font-bold text-[15px] sm:text-lg text-[#1e120b] leading-snug">${title}</h3>
            <span class="px-2.5 py-1 rounded-lg bg-[#1e120b] text-[#f3c677] font-extrabold text-xs sm:text-sm whitespace-nowrap shrink-0">
              ${p.price} ₺
            </span>
          </div>
          <p class="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">${p.desc || ''}</p>
          ${(p.hot || p.signature) ? `
            <div class="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-semibold">
              ${p.hot ? `<span class="text-[#b45309] flex items-center gap-0.5">🔥 Sıcak</span>` : ''}
              ${p.signature ? `<span class="text-stone-600 flex items-center gap-0.5">⭐ İmza Lezzet</span>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Görsel vitrin / Kart görünümü
  if (hasImage) {
    return `
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-[#e6dac8] shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col justify-between card-zoom min-w-0">
        <div>
          <div class="relative h-44 sm:h-48 overflow-hidden fallback-thumb cursor-pointer flex items-center justify-center" onclick="openLightbox('${p.img}', '${safeTitle}')">
            <span class="text-4xl">${catIcon}</span>
            <img src="${p.img}" alt="${title}" loading="lazy" onerror="this.classList.add('img-fallback-hidden')" class="zoom-img absolute inset-0 w-full h-full object-cover transition duration-500 max-w-full" />
            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              ${p.hot ? `<span class="px-2.5 py-0.5 rounded-full bg-[#1e120b]/85 backdrop-blur-sm text-[#f3c677] font-bold text-[11px]">🔥 Sıcak</span>` : ''}
              ${p.signature ? `<span class="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#1e120b] font-bold text-[11px]">⭐ İmza</span>` : ''}
            </div>
            <div class="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-[#1e120b]/95 text-[#f3c677] font-extrabold text-sm sm:text-base shadow border border-[#f3c677]/30">
              ${p.price} ₺
            </div>
          </div>

          <div class="p-4">
            <h3 class="font-serif-title font-bold text-base sm:text-lg text-[#1e120b] leading-snug">${title}</h3>
            <p class="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">${p.desc || ''}</p>
          </div>
        </div>

        <div class="px-4 pb-3.5 pt-2.5 flex items-center justify-between gap-2 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
          <span>${branchNote}</span>
          <button onclick="openLightbox('${p.img}', '${safeTitle}')" class="text-[#9a5818] font-semibold hover:underline">
            Büyüt
          </button>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-[#e6dac8] shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          <div class="flex items-start justify-between gap-2.5">
            <h3 class="font-serif-title font-bold text-base sm:text-lg text-[#1e120b] leading-snug">${title}</h3>
            <div class="px-3 py-1 rounded-xl bg-[#1e120b] text-[#f3c677] font-extrabold text-sm shrink-0">
              ${p.price} ₺
            </div>
          </div>
          <p class="text-xs text-stone-600 mt-1.5 leading-relaxed">${p.desc || ''}</p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
          <span>${branchNote}</span>
          <span>${p.hot ? '🔥 Sıcak' : ''}</span>
        </div>
      </div>
    `;
  }
}

function renderVitrinPreview() {
  const grid = document.getElementById('vitrinMenuPreviewGrid');
  if (!grid) return;
  const items = getBranchProducts(state.activeBranch).slice(0, 8);
  grid.innerHTML = items.map(p => buildProductCardHtml(p, false)).join('');
}

function renderQrMenuSection() {
  const pillsEl = document.getElementById('qrCategoryPills');
  const gridEl = document.getElementById('qrMenuProductGrid');
  const summaryEl = document.getElementById('qrMenuResultSummary');
  if (!pillsEl || !gridEl) return;

  const branchProducts = getBranchProducts(state.activeBranch);

  pillsEl.innerHTML = state.categories.map(c => {
    const active = state.selectedCategory === c.id;
    const count = c.id === 'all'
      ? branchProducts.length
      : branchProducts.filter(p => p.cat === c.id).length;
    const label = state.lang === 'en' && c.nameEn ? c.nameEn : c.name;
    return `
      <button onclick="selectCategory('${c.id}', this)" class="${
        active
          ? 'px-3.5 py-2 rounded-xl bg-[#1e120b] text-[#f3c677] font-bold text-xs sm:text-sm shadow-sm whitespace-nowrap flex items-center gap-1.5 shrink-0'
          : 'px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#1e120b] border border-[#e6dac8] font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition shrink-0'
      }">
        <span>${c.icon || '🥨'}</span>
        <span>${label}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/15 text-[#f3c677]' : 'bg-stone-100 text-stone-600'}">${count}</span>
      </button>
    `;
  }).join('');

  const btnCompact = document.getElementById('btnLayoutCompact');
  const btnGrid = document.getElementById('btnLayoutGrid');
  if (btnCompact && btnGrid) {
    btnCompact.className = state.mobileLayout === 'compact'
      ? 'px-2.5 py-1 rounded-lg bg-[#1e120b] text-[#f3c677] text-xs font-bold shadow-sm'
      : 'px-2.5 py-1 rounded-lg text-stone-700 hover:bg-stone-100 text-xs font-semibold';
    btnGrid.className = state.mobileLayout === 'grid'
      ? 'px-2.5 py-1 rounded-lg bg-[#1e120b] text-[#f3c677] text-xs font-bold shadow-sm'
      : 'px-2.5 py-1 rounded-lg text-stone-700 hover:bg-stone-100 text-xs font-semibold';
  }

  const filtered = getFilteredQrProducts();
  const bName = state.branches[state.activeBranch].name;
  if (summaryEl) {
    summaryEl.textContent = `${bName} • ${filtered.length} Ürün`;
  }

  gridEl.className = state.mobileLayout === 'compact'
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5';

  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl p-8 text-center border border-[#e6dac8]">
        <div class="text-2xl mb-2">🥨</div>
        <div class="font-bold text-sm text-[#1e120b]">Ürün bulunamadı</div>
        <button onclick="state.selectedCategory='all'; setTagFilter('all'); clearQrSearch();" class="mt-3 px-4 py-2 rounded-xl bg-[#1e120b] text-[#f3c677] text-xs font-bold">
          Tüm Ürünleri Göster
        </button>
      </div>
    `;
  } else {
    gridEl.innerHTML = filtered.map(p => buildProductCardHtml(p, true)).join('');
  }
}

function renderGalleryAndReviews() {
  const galEl = document.getElementById('bentoPhotoGallery');
  if (galEl) {
    galEl.innerHTML = state.gallery.map((g, idx) => `
      <div onclick="openLightbox('${g.src}', '${g.title.replace(/'/g, "\\'")}')" class="${idx === 0 ? 'col-span-2 row-span-2' : ''} relative rounded-2xl overflow-hidden cursor-pointer group border border-[#e6dac8] shadow-sm aspect-[4/3] hero-surface min-w-0">
        <img src="${g.src}" alt="${g.title}" loading="lazy" onerror="this.classList.add('img-fallback-hidden')" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 max-w-full" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold leading-snug">
          ${g.title}
        </div>
      </div>
    `).join('');
  }

  const revEl = document.getElementById('reviewsGrid');
  if (revEl) {
    revEl.innerHTML = state.reviews.map(r => `
      <div class="p-4 sm:p-5 rounded-2xl bg-[#faf6f0] border border-[#e6dac8] shadow-sm flex flex-col justify-between min-w-0">
        <div>
          <div class="flex items-center justify-between text-[#b87324] text-xs font-bold mb-2">
            <span>★★★★★</span>
            <span class="text-[11px] text-[#1e120b] bg-[#e6dac8]/60 px-2.5 py-0.5 rounded-full">${r.branch}</span>
          </div>
          <p class="text-xs sm:text-sm text-stone-700 italic leading-relaxed">"${r.text}"</p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#e6dac8] flex items-center justify-between text-xs">
          <strong class="text-[#1e120b]">${r.author}</strong>
          <span class="text-stone-500">Google Yorumu</span>
        </div>
      </div>
    `).join('');
  }
}

function renderAll() {
  renderSiteContentBindings();
  renderBranchIndicators();
  renderBranchesSection();
  renderHeroSignatureCard();
  renderHomeCategoryStrip();
  renderVitrinPreview();
  renderQrMenuSection();
  renderGalleryAndReviews();
}

function handleHashRouting() {
  const h = (window.location.hash || '').toLowerCase();
  if (h === '#qr-foca' || h === '#foca') {
    state.activeBranch = 'foca';
    switchMainView('qrmenu');
  } else if (h === '#qr-bagarasi' || h === '#bagarasi') {
    state.activeBranch = 'bagarasi';
    switchMainView('qrmenu');
  }
}

window.addEventListener('hashchange', handleHashRouting);

window.addEventListener('DOMContentLoaded', () => {
  loadPreviewOverridesFromStorage();
  renderAll();
  handleHashRouting();
});
