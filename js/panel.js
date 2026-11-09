/**
 * Tarihi Foça Simit Fırını — Yönetim Paneli Motoru (js/panel.js)
 * Hem Menü/Fiyat/Ürün Görsellerini hem de Site Yazılarını, Şube Bilgilerini ve Galeri Görsellerini düzenler.
 */

const STORAGE_KEY_PRODUCTS = 'tarihi_foca_simit_firini_menu_v3';
const STORAGE_KEY_BRANCHES = 'tarihi_foca_simit_firini_branches_v3';
const STORAGE_KEY_SITE = 'tarihi_foca_simit_firini_site_v3';
const STORAGE_KEY_GALLERY = 'tarihi_foca_simit_firini_gallery_v3';
const STORAGE_KEY_PASS = 'tarihi_foca_simit_firini_pass_v3';
const STORAGE_KEY_GH = 'tarihi_foca_simit_firini_gh_config';

const panelState = {
  isAuthenticated: false,
  activeTab: 'menu', // 'menu' | 'site'
  adminPassword: 'foca2026',
  siteContent: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.siteContent)),
  branches: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.branches)),
  products: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.products)),
  gallery: JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.gallery)),
  categories: window.FOCA_MENU_DATA.categories,
  categoryImages: window.FOCA_MENU_DATA.categoryImages,
  editingImageTarget: null, // 'branch_foca' | 'branch_bagarasi' | 'site_hero' | 'site_cake' | 'gallery_0'..'gallery_5' | productId
  editingImageTempSrc: '',
  newProductTempImg: window.FOCA_MENU_DATA.categoryImages.gevrek,
  ghConfig: { repo: '', token: '', branch: 'main' }
};

const PRESET_GALLERY = [
  { label: 'Taş Fırın & Gevrek', src: 'assets/images/hero.jpg' },
  { label: 'İzmir Gevreği', src: 'assets/images/gevrek.jpg' },
  { label: 'İzmir Boyozu & Yumurta', src: 'assets/images/boyoz.jpg' },
  { label: 'Poğaça & Açma', src: 'assets/images/pogaca.jpg' },
  { label: 'Ege Kahvaltı & Çay', src: 'assets/images/kahvalti.jpg' },
  { label: 'Tatlı & Tuzlu Kuru Pasta', src: 'assets/images/kurupasta.jpg' },
  { label: 'Yaş Pasta', src: 'assets/images/pasta.jpg' },
  { label: 'El Yapımı Dondurma', src: 'assets/images/dondurma.jpg' },
  { label: 'Foça Şube', src: 'assets/images/foca-sube.jpg' },
  { label: 'Bağarası Şube', src: 'assets/images/bagarasi-sube.jpg' }
];

function loadPanelState() {
  try {
    const rawProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (rawProds) {
      const parsed = JSON.parse(rawProds);
      if (Array.isArray(parsed) && parsed.length > 0) panelState.products = parsed;
    }
    const rawBranches = localStorage.getItem(STORAGE_KEY_BRANCHES);
    if (rawBranches) {
      const parsedB = JSON.parse(rawBranches);
      if (parsedB && parsedB.foca && parsedB.bagarasi) panelState.branches = parsedB;
    }
    const rawSite = localStorage.getItem(STORAGE_KEY_SITE);
    if (rawSite) {
      const parsedS = JSON.parse(rawSite);
      if (parsedS) panelState.siteContent = { ...panelState.siteContent, ...parsedS };
    }
    const rawGal = localStorage.getItem(STORAGE_KEY_GALLERY);
    if (rawGal) {
      const parsedG = JSON.parse(rawGal);
      if (Array.isArray(parsedG) && parsedG.length > 0) panelState.gallery = parsedG;
    }
    const savedPass = localStorage.getItem(STORAGE_KEY_PASS);
    if (savedPass) panelState.adminPassword = savedPass;

    const savedGh = localStorage.getItem(STORAGE_KEY_GH);
    if (savedGh) panelState.ghConfig = JSON.parse(savedGh);
  } catch (e) {}
}

function savePanelState() {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(panelState.products));
    localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(panelState.branches));
    localStorage.setItem(STORAGE_KEY_SITE, JSON.stringify(panelState.siteContent));
    localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(panelState.gallery));
    localStorage.setItem(STORAGE_KEY_PASS, panelState.adminPassword);
    localStorage.setItem(STORAGE_KEY_GH, JSON.stringify(panelState.ghConfig));
  } catch (e) {}
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
  }, 2600);
}

function verifyPanelLogin() {
  const val = (document.getElementById('loginPassInput')?.value || '').trim();
  if (val === panelState.adminPassword) {
    panelState.isAuthenticated = true;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('panelDashboard').classList.remove('hidden');
    renderPanelAll();
  } else {
    document.getElementById('loginErrorMsg').classList.remove('hidden');
  }
}

function lockPanel() {
  panelState.isAuthenticated = false;
  document.getElementById('panelDashboard').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginPassInput').value = '';
}

function switchPanelTab(tabName) {
  panelState.activeTab = tabName;
  document.getElementById('tabSectionMenu').classList.toggle('hidden', tabName !== 'menu');
  document.getElementById('tabSectionSite').classList.toggle('hidden', tabName !== 'site');

  document.getElementById('tabBtnMenu').className = tabName === 'menu'
    ? 'px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-700 text-white shadow-sm transition'
    : 'px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-stone-100 text-stone-700 hover:bg-stone-200 transition';

  document.getElementById('tabBtnSite').className = tabName === 'site'
    ? 'px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-700 text-white shadow-sm transition'
    : 'px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-stone-100 text-stone-700 hover:bg-stone-200 transition';

  renderPanelAll();
}

function updateAdminPassword() {
  const newPass = (document.getElementById('adminNewPasswordInput')?.value || '').trim();
  if (newPass.length < 4) {
    showToast('En az 4 karakterli bir şifre girin');
    return;
  }
  panelState.adminPassword = newPass;
  savePanelState();
  document.getElementById('adminNewPasswordInput').value = '';
  showToast('Şifre güncellendi');
}

function renderPanelAll() {
  renderAdminTable();
  renderSiteEditorFields();

  const ghRepoEl = document.getElementById('ghRepoInput');
  const ghTokenEl = document.getElementById('ghTokenInput');
  if (ghRepoEl) ghRepoEl.value = panelState.ghConfig.repo || '';
  if (ghTokenEl) ghTokenEl.value = panelState.ghConfig.token || '';
}

// =========================================================================
// TAB 2: SITE METİNLERİ, ŞUBE BİLGİLERİ VE VİTRİN GÖRSELLERİ EDİTÖRÜ
// =========================================================================
function renderSiteEditorFields() {
  const sc = panelState.siteContent;
  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el && v !== undefined) el.value = v;
  };
  const setImg = (id, v) => {
    const el = document.getElementById(id);
    if (el && v) el.src = v;
  };

  // Hero & Marka
  setVal('editBrandSub', sc.brandSub);
  setVal('editBrandName', sc.brandName);
  setVal('editHeroBadge', sc.heroBadge);
  setVal('editHeroTitle1', sc.heroTitle1);
  setVal('editHeroTitle2', sc.heroTitle2);
  setVal('editHeroDesc', sc.heroDesc);
  setImg('previewHeroImg', sc.heroImg);

  // İstatistikler
  setVal('editStat1Val', sc.stat1Val);
  setVal('editStat1Label', sc.stat1Label);
  setVal('editStat2Val', sc.stat2Val);
  setVal('editStat2Label', sc.stat2Label);
  setVal('editStat3Val', sc.stat3Val);
  setVal('editStat3Label', sc.stat3Label);

  // Hakkımızda
  setVal('editAboutBadge', sc.aboutBadge);
  setVal('editAboutTitle', sc.aboutTitle);
  setVal('editAboutText1', sc.aboutText1);
  setVal('editAboutText2', sc.aboutText2);

  // Özel Gün Pasta & İletişim
  setVal('editCakeBadge', sc.cakeBadge);
  setVal('editCakeTitle', sc.cakeTitle);
  setVal('editCakeDesc', sc.cakeDesc);
  setVal('editWhatsappNumber', sc.whatsappNumber);
  setVal('editInstagramHandle', sc.instagramHandle);
  setVal('editInstagramUrl', sc.instagramUrl);
  setVal('editFooterDesc', sc.footerDesc);
  setImg('previewCakeImg', sc.cakeImg);

  // Şubeler (Foça & Bağarası)
  const bf = panelState.branches.foca;
  const bb = panelState.branches.bagarasi;
  setVal('editFocaName', bf.name);
  setVal('editFocaTag', bf.tag);
  setVal('editFocaAddress', bf.address);
  setVal('editFocaHours', bf.hours);
  setVal('editFocaPhone', bf.phone);
  setVal('editFocaMap', bf.mapUrl);
  setImg('adminPreviewBranchFoca', bf.img);

  setVal('editBagName', bb.name);
  setVal('editBagTag', bb.tag);
  setVal('editBagAddress', bb.address);
  setVal('editBagHours', bb.hours);
  setVal('editBagPhone', bb.phone);
  setVal('editBagMap', bb.mapUrl);
  setImg('adminPreviewBranchBagarasi', bb.img);

  // Galeri 6 Fotoğraf
  const galGrid = document.getElementById('adminGalleryEditorGrid');
  if (galGrid) {
    galGrid.innerHTML = panelState.gallery.map((g, idx) => `
      <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col gap-2">
        <div class="relative h-28 rounded-xl overflow-hidden bg-amber-100 border border-amber-200">
          <img src="${g.src}" alt="${g.title}" class="w-full h-full object-cover" />
          <button onclick="openImageEditorModal('gallery_${idx}')" class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[11px] font-bold">
            📷 Değiştir
          </button>
        </div>
        <input
          type="text"
          value="${g.title.replace(/"/g, '&quot;')}"
          onchange="updateGalleryTitle(${idx}, this.value)"
          class="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-white"
        />
      </div>
    `).join('');
  }
}

function updateSiteContentField(key, value) {
  panelState.siteContent[key] = value;
  savePanelState();
  showToast('Metin kaydedildi');
}

function updateBranchDetail(branchKey, field, value) {
  if (!panelState.branches[branchKey]) return;
  panelState.branches[branchKey][field] = value;
  savePanelState();
  showToast('Şube bilgisi kaydedildi');
}

function updateGalleryTitle(idx, value) {
  if (!panelState.gallery[idx]) return;
  panelState.gallery[idx].title = value;
  savePanelState();
  showToast('Galeri başlığı kaydedildi');
}

// =========================================================================
// TAB 1: MENÜ, FİYAT VE ÜRÜN GÖRSELLERİ TABLOSU
// =========================================================================
function renderAdminTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;
  const q = (document.getElementById('adminSearchInput')?.value || '').toLowerCase();
  const catFilter = document.getElementById('adminCategoryFilter')?.value || 'all';

  const rows = panelState.products.filter(p => {
    if (catFilter !== 'all' && p.cat !== catFilter) return false;
    if (q && !p.name.toLowerCase().includes(q) && !(p.desc || '').toLowerCase().includes(q)) return false;
    return true;
  });

  const catOptions = panelState.categories.filter(c => c.id !== 'all');

  tbody.innerHTML = rows.map(p => {
    const hasImg = Boolean(p.img && p.img.trim() !== '');
    return `
      <tr class="hover:bg-amber-50/50 transition">
        <td class="py-2.5 px-3">
          <div class="flex items-center gap-2">
            ${hasImg ? `
              <img src="${p.img}" alt="${p.name.replace(/"/g, '&quot;')}" onclick="openImageEditorModal('${p.id}')" class="w-12 h-12 rounded-xl object-cover border border-amber-300 cursor-pointer shrink-0 hover:opacity-80" />
            ` : `
              <div onclick="openImageEditorModal('${p.id}')" class="w-12 h-12 rounded-xl bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400 font-bold text-center cursor-pointer shrink-0 px-1">
                Yok
              </div>
            `}
            <div class="flex flex-col gap-1">
              <button onclick="openImageEditorModal('${p.id}')" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition whitespace-nowrap">
                📷 ${hasImg ? 'Değiştir' : 'Ekle'}
              </button>
              ${hasImg ? `
                <button onclick="deleteProductImage('${p.id}')" class="px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[10px] transition whitespace-nowrap">
                  🗑️ Kaldır
                </button>
              ` : ''}
            </div>
          </div>
        </td>

        <td class="py-2.5 px-3 min-w-[200px]">
          <input
            type="text"
            value="${p.name.replace(/"/g, '&quot;')}"
            onchange="updateProductField('${p.id}', 'name', this.value)"
            class="w-full font-bold text-stone-900 bg-transparent border-b border-transparent focus:border-amber-600 focus:bg-white px-1 py-0.5 rounded text-xs sm:text-sm focus:outline-none"
          />
          <input
            type="text"
            value="${(p.desc || '').replace(/"/g, '&quot;')}"
            onchange="updateProductField('${p.id}', 'desc', this.value)"
            class="w-full text-xs text-stone-500 bg-transparent border-b border-transparent focus:border-amber-500 focus:bg-white px-1 py-0.5 rounded mt-0.5 focus:outline-none"
          />
        </td>

        <td class="py-2.5 px-3">
          <select onchange="updateProductField('${p.id}', 'cat', this.value)" class="px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs font-medium">
            ${catOptions.map(c => `<option value="${c.id}" ${c.id === p.cat ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </td>

        <td class="py-2.5 px-3">
          <div class="flex items-center gap-1">
            <input
              type="number"
              min="1"
              step="1"
              value="${p.price}"
              onchange="updateProductPrice('${p.id}', this.value)"
              class="w-20 px-2.5 py-1.5 rounded-xl border-2 border-amber-400 bg-amber-50/60 font-extrabold text-amber-950 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <span class="text-xs font-bold text-stone-500">₺</span>
          </div>
        </td>

        <td class="py-2.5 px-3 text-center">
          <input type="checkbox" ${p.foca ? 'checked' : ''} onchange="updateProductBranch('${p.id}', 'foca', this.checked)" class="w-4 h-4 rounded text-amber-700 cursor-pointer" />
        </td>

        <td class="py-2.5 px-3 text-center">
          <input type="checkbox" ${p.bagarasi ? 'checked' : ''} onchange="updateProductBranch('${p.id}', 'bagarasi', this.checked)" class="w-4 h-4 rounded text-emerald-700 cursor-pointer" />
        </td>

        <td class="py-2.5 px-3 text-center">
          <input type="checkbox" ${p.hot ? 'checked' : ''} onchange="updateProductField('${p.id}', 'hot', this.checked)" class="w-4 h-4 rounded text-red-600 cursor-pointer" />
        </td>

        <td class="py-2.5 px-3 text-right">
          <button onclick="deleteProduct('${p.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50">
            Sil
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function compressUploadedImageFile(file, maxWidth, callback) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = Math.round(h * (maxWidth / w));
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function openImageEditorModal(targetId) {
  panelState.editingImageTarget = targetId;
  const titleEl = document.getElementById('imageEditorTitle');
  const nameEl = document.getElementById('imageEditorTargetName');
  const removeBtn = document.getElementById('btnRemoveImageInModal');
  document.getElementById('imageEditorUrlInput').value = '';

  if (targetId === 'branch_foca') {
    titleEl.textContent = 'Foça Şube Fotoğrafı';
    nameEl.textContent = panelState.branches.foca.name;
    panelState.editingImageTempSrc = panelState.branches.foca.img;
    removeBtn.classList.add('hidden');
  } else if (targetId === 'branch_bagarasi') {
    titleEl.textContent = 'Bağarası Şube Fotoğrafı';
    nameEl.textContent = panelState.branches.bagarasi.name;
    panelState.editingImageTempSrc = panelState.branches.bagarasi.img;
    removeBtn.classList.add('hidden');
  } else if (targetId === 'site_hero') {
    titleEl.textContent = 'Ana Kapak Fotoğrafı';
    nameEl.textContent = 'Üst Karşılama Görseli';
    panelState.editingImageTempSrc = panelState.siteContent.heroImg;
    removeBtn.classList.add('hidden');
  } else if (targetId === 'site_cake') {
    titleEl.textContent = 'Özel Gün Pasta Görseli';
    nameEl.textContent = 'Yaş Pasta Banner Görseli';
    panelState.editingImageTempSrc = panelState.siteContent.cakeImg;
    removeBtn.classList.add('hidden');
  } else if (targetId.startsWith('gallery_')) {
    const idx = parseInt(targetId.split('_')[1], 10);
    const gItem = panelState.gallery[idx];
    titleEl.textContent = 'Galeri Fotoğrafı';
    nameEl.textContent = gItem ? gItem.title : 'Galeri';
    panelState.editingImageTempSrc = gItem ? gItem.src : '';
    removeBtn.classList.add('hidden');
  } else {
    const prod = panelState.products.find(p => p.id === targetId);
    if (!prod) return;
    titleEl.textContent = 'Ürün Görseli';
    nameEl.textContent = prod.name;
    panelState.editingImageTempSrc = prod.img || '';
    removeBtn.classList.remove('hidden');
  }

  updateImageEditorModalPreview();
  renderImageEditorPresetGallery();
  document.getElementById('modalImageEditor').classList.remove('hidden');
}

function updateImageEditorModalPreview() {
  const wrap = document.getElementById('imageEditorCurrentPreviewWrap');
  if (panelState.editingImageTempSrc) {
    wrap.innerHTML = `<img src="${panelState.editingImageTempSrc}" alt="Önizleme" class="w-full h-full object-cover" />`;
  } else {
    wrap.innerHTML = `<div class="text-xs text-stone-500 font-bold text-center px-2">Görsel Yok</div>`;
  }
}

function renderImageEditorPresetGallery() {
  const grid = document.getElementById('imageEditorPresetGrid');
  if (!grid) return;
  grid.innerHTML = PRESET_GALLERY.map((item, idx) => `
    <button type="button" onclick="selectPresetImage(${idx})" class="rounded-xl overflow-hidden border-2 border-stone-200 hover:border-amber-600 transition text-left bg-stone-50">
      <img src="${item.src}" alt="${item.label}" class="w-full h-14 object-cover" />
      <div class="p-1 text-[10px] font-semibold text-stone-700 truncate">${item.label}</div>
    </button>
  `).join('');
}

function selectPresetImage(idx) {
  const preset = PRESET_GALLERY[idx];
  if (!preset) return;
  panelState.editingImageTempSrc = preset.src;
  updateImageEditorModalPreview();
}

function handleDeviceImageUpload(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  const t = panelState.editingImageTarget || '';
  const isLarge = t.startsWith('branch_') || t.startsWith('site_') || t.startsWith('gallery_');
  compressUploadedImageFile(file, isLarge ? 1200 : 850, (dataUrl) => {
    panelState.editingImageTempSrc = dataUrl;
    updateImageEditorModalPreview();
    showToast('Fotoğraf yüklendi');
  });
}

function applyImageUrlFromInput() {
  const url = (document.getElementById('imageEditorUrlInput').value || '').trim();
  if (!url) return;
  panelState.editingImageTempSrc = url;
  updateImageEditorModalPreview();
}

function removeImageFromTarget() {
  panelState.editingImageTempSrc = '';
  updateImageEditorModalPreview();
}

function saveImageEditorChanges() {
  const t = panelState.editingImageTarget || '';
  if (t === 'branch_foca') {
    panelState.branches.foca.img = panelState.editingImageTempSrc || 'assets/images/foca-sube.jpg';
  } else if (t === 'branch_bagarasi') {
    panelState.branches.bagarasi.img = panelState.editingImageTempSrc || 'assets/images/bagarasi-sube.jpg';
  } else if (t === 'site_hero') {
    panelState.siteContent.heroImg = panelState.editingImageTempSrc || 'assets/images/hero.jpg';
  } else if (t === 'site_cake') {
    panelState.siteContent.cakeImg = panelState.editingImageTempSrc || 'assets/images/pasta.jpg';
  } else if (t.startsWith('gallery_')) {
    const idx = parseInt(t.split('_')[1], 10);
    if (panelState.gallery[idx] && panelState.editingImageTempSrc) {
      panelState.gallery[idx].src = panelState.editingImageTempSrc;
    }
  } else {
    const prod = panelState.products.find(p => p.id === t);
    if (prod) prod.img = panelState.editingImageTempSrc;
  }
  savePanelState();
  closeImageEditorModal();
  renderPanelAll();
  showToast('Görsel güncellendi');
}

function closeImageEditorModal() {
  document.getElementById('modalImageEditor').classList.add('hidden');
}

function deleteProductImage(prodId) {
  const prod = panelState.products.find(p => p.id === prodId);
  if (!prod) return;
  prod.img = '';
  savePanelState();
  renderPanelAll();
  showToast('Görsel kaldırıldı');
}

function updateProductPrice(prodId, newPriceVal) {
  const prod = panelState.products.find(p => p.id === prodId);
  if (!prod) return;
  prod.price = Math.max(1, Math.round(parseFloat(newPriceVal) || prod.price));
  savePanelState();
  showToast(`${prod.name}: ${prod.price} ₺`);
}

function updateProductField(prodId, field, value) {
  const prod = panelState.products.find(p => p.id === prodId);
  if (!prod) return;
  prod[field] = value;
  savePanelState();
  renderPanelAll();
  showToast('Kaydedildi');
}

function updateProductBranch(prodId, branchKey, isChecked) {
  const prod = panelState.products.find(p => p.id === prodId);
  if (!prod) return;
  prod[branchKey] = Boolean(isChecked);
  savePanelState();
  showToast('Şube durumu güncellendi');
}

function deleteProduct(prodId) {
  panelState.products = panelState.products.filter(p => p.id !== prodId);
  savePanelState();
  renderPanelAll();
  showToast('Ürün silindi');
}

function applyBulkPercentChange(percent) {
  const targetCat = document.getElementById('bulkCategoryTarget').value;
  const roundUnit = parseInt(document.getElementById('bulkRoundMode').value, 10) || 1;
  let count = 0;
  panelState.products.forEach(p => {
    if (targetCat === 'all' || p.cat === targetCat) {
      const raw = p.price * (1 + percent / 100);
      p.price = Math.max(5, Math.round(raw / roundUnit) * roundUnit);
      count++;
    }
  });
  savePanelState();
  renderPanelAll();
  showToast(`${count} ürün güncellendi`);
}

function applyBulkFixedChange(amountTl) {
  const targetCat = document.getElementById('bulkCategoryTarget').value;
  let count = 0;
  panelState.products.forEach(p => {
    if (targetCat === 'all' || p.cat === targetCat) {
      p.price = Math.max(5, p.price + amountTl);
      count++;
    }
  });
  savePanelState();
  renderPanelAll();
  showToast(`${count} ürün güncellendi`);
}

function resetMenuToDefaults() {
  panelState.siteContent = JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.siteContent));
  panelState.products = JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.products));
  panelState.branches = JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.branches));
  panelState.gallery = JSON.parse(JSON.stringify(window.FOCA_MENU_DATA.gallery));
  savePanelState();
  renderPanelAll();
  showToast('Varsayılan verilere dönüldü');
}

function openBulkPasteModal() {
  document.getElementById('modalBulkPaste').classList.remove('hidden');
}
function closeBulkPasteModal() {
  document.getElementById('modalBulkPaste').classList.add('hidden');
}
function fillSampleBulkText() {
  document.getElementById('bulkPasteTextarea').value =
    "Taş Fırın Çıtır İzmir Gevreği - 25\n" +
    "Geleneksel İzmir Boyozu - 30\n" +
    "Tahinli Özel İzmir Boyozu - 40\n" +
    "Fırınlanmış Sıcak Yumurta - 20";
}

function processBulkPaste() {
  const rawText = document.getElementById('bulkPasteTextarea').value || '';
  const defaultCat = document.getElementById('bulkPasteCategory').value || 'gevrek';
  const branchScope = document.getElementById('bulkPasteBranchScope').value || 'both';
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return;

  let updated = 0, added = 0;
  lines.forEach((line, idx) => {
    const match = line.match(/^(.+?)[-;:\t|]+\s*(\d+(?:[.,]\d+)?)\s*(?:tl|₺)?$/i);
    if (!match) return;
    const name = match[1].trim();
    const price = Math.max(1, Math.round(parseFloat(match[2].replace(',', '.'))));
    const existing = panelState.products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.price = price;
      updated++;
    } else {
      panelState.products.unshift({
        id: 'custom_' + Date.now() + '_' + idx,
        name,
        nameEn: name,
        cat: defaultCat,
        price,
        foca: branchScope === 'both' || branchScope === 'foca',
        bagarasi: branchScope === 'both' || branchScope === 'bagarasi',
        hot: defaultCat === 'gevrek' || defaultCat === 'pogaca',
        signature: false,
        img: panelState.categoryImages[defaultCat] || 'assets/images/gevrek.jpg',
        desc: 'Günlük taze üretim.'
      });
      added++;
    }
  });
  savePanelState();
  closeBulkPasteModal();
  renderPanelAll();
  showToast(`${updated} güncellendi, ${added} eklendi`);
}

function openAddSingleProductModal() {
  panelState.newProductTempImg = 'assets/images/gevrek.jpg';
  const prev = document.getElementById('newProdImgPreview');
  if (prev) {
    prev.src = panelState.newProductTempImg;
    prev.classList.remove('hidden');
  }
  document.getElementById('modalAddProduct').classList.remove('hidden');
}
function closeAddSingleProductModal() {
  document.getElementById('modalAddProduct').classList.add('hidden');
}
function handleNewProdFileUpload(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  compressUploadedImageFile(file, 850, (dataUrl) => {
    panelState.newProductTempImg = dataUrl;
    const prev = document.getElementById('newProdImgPreview');
    if (prev) {
      prev.src = dataUrl;
      prev.classList.remove('hidden');
    }
  });
}
function clearNewProdImage() {
  panelState.newProductTempImg = '';
  document.getElementById('newProdImgPreview')?.classList.add('hidden');
}
function saveNewSingleProduct() {
  const name = (document.getElementById('newProdName').value || '').trim();
  const price = Math.max(1, Math.round(parseFloat(document.getElementById('newProdPrice').value) || 30));
  const cat = document.getElementById('newProdCat').value || 'gevrek';
  const desc = (document.getElementById('newProdDesc').value || 'Günlük taze üretimimiz.').trim();
  const foca = document.getElementById('newProdFoca').checked;
  const bagarasi = document.getElementById('newProdBagarasi').checked;
  if (!name) return;

  panelState.products.unshift({
    id: 'item_' + Date.now(),
    name,
    nameEn: name,
    cat,
    price,
    foca,
    bagarasi,
    hot: cat === 'gevrek' || cat === 'pogaca',
    signature: false,
    img: panelState.newProductTempImg,
    desc
  });
  savePanelState();
  closeAddSingleProductModal();
  document.getElementById('newProdName').value = '';
  renderPanelAll();
  showToast(`${name} eklendi`);
}

function buildMenuDataJsContent() {
  const payload = {
    updatedAt: new Date().toISOString(),
    siteContent: panelState.siteContent,
    categoryImages: window.FOCA_MENU_DATA.categoryImages,
    categories: window.FOCA_MENU_DATA.categories,
    branches: panelState.branches,
    products: panelState.products,
    reviews: window.FOCA_MENU_DATA.reviews,
    gallery: panelState.gallery
  };
  return "window.FOCA_MENU_DATA = " + JSON.stringify(payload, null, 2) + ";\n";
}

function downloadMenuDataJsFile() {
  const content = buildMenuDataJsContent();
  const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'menu-data.js';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('menu-data.js indirildi');
}

async function publishToGitHubDirectly() {
  const repo = (document.getElementById('ghRepoInput')?.value || '').trim();
  const token = (document.getElementById('ghTokenInput')?.value || '').trim();
  panelState.ghConfig = { repo, token, branch: 'main' };
  savePanelState();

  if (!repo || !token) {
    showToast('Repo ve Token bilgilerini girin');
    return;
  }

  try {
    showToast('Yayınlanıyor...');
    const apiUrl = `https://api.github.com/repos/${repo}/contents/js/menu-data.js`;
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    let sha = undefined;
    if (getRes.ok) {
      const existingData = await getRes.json();
      sha = existingData.sha;
    }

    const contentStr = buildMenuDataJsContent();
    const base64Content = btoa(unescape(encodeURIComponent(contentStr)));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Site ve menu guncellemesi',
        content: base64Content,
        sha: sha
      })
    });

    if (putRes.ok) {
      showToast('Canlı sitede güncellendi');
    } else {
      showToast('GitHub yetki hatası');
    }
  } catch (err) {
    showToast('Bağlantı hatası');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadPanelState();
});
