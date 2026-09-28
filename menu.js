// ==========================================
// 1. SUPABASE BAĞLANTISI (Kendi bilgilerini gir)
// ==========================================
const supabaseUrl = 'https://hkjsflzfahugubbvohvt.supabase.co'; 
const supabaseKey = 'sb_publishable_bpWCQrmTJBcU6SPADDRoyw_1ZHjoAlX'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. KATEGORİ LİSTELERİ VE ÇEVİRİLER
// ==========================================
const kategorilerListesi = [
    "UNLU MAMULLER", "KAHVALTILIK", "SANDVİÇLER", "SICAK İÇECEKLER", 
    "SOĞUK İÇECEKLER", "KAHVELER", "TATLILAR", "PASTALAR", "DONDURMA", "EKMEK"
];

const kategoriCeviri = {
    "UNLU MAMULLER": "BAKERY", "KAHVALTILIK": "BREAKFAST", "SANDVİÇLER": "SANDWICHES",
    "SICAK İÇECEKLER": "HOT BEVERAGES", "SOĞUK İÇECEKLER": "COLD BEVERAGES", 
    "KAHVELER": "COFFEES", "TATLILAR": "DESSERTS", "PASTALAR": "CAKES",
    "DONDURMA": "ICE CREAM", "EKMEK": "BREAD"
};

let gecerliSubeVerisi = { subeAdi: {}, urunler: [] };
let aktifKategori = "";

// ==========================================
// 3. SİSTEMİN BAŞLAMASI VE VERİ ÇEKME MANTIĞI (ÖNBELLEK DESTEKLİ)
// ==========================================
// DÜZELTME: Çift yazılan (çakışan) başlatma kodu silinip teke düşürüldü.
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subeKodu = urlParams.get('sube');

    if (subeKodu && (subeKodu === 'foca' || subeKodu === 'bagarasi')) {
        veritabanindanCek(subeKodu);
    } else {
        window.location.href = "index.html"; 
    }
});

async function veritabanindanCek(subeKodu) {
    try {
        const titleEl = document.getElementById("branch-title");
        if(titleEl) titleEl.innerText = "Menü Yükleniyor...";

        // Supabase Sorgusu
        const { data, error } = await supabaseClient
            .from('urunler')
            .select('*')
            .eq('sube', subeKodu)
            .eq('aktif_mi', true)
            .order('kategori', { ascending: true })
            .order('sira', { ascending: true });

        if (error) throw error;

        veriyiSistemimizeUyarla(data, subeKodu);

    } catch (hata) {
        console.error("Veritabanı Hatası:", hata);
        
        // GİZLİ HATAYI EKRANA BASAN KOD (DEDEKTİF)
        document.getElementById("branch-title").innerText = "SİSTEM HATASI!";
        let hataMesaji = hata.message || JSON.stringify(hata);
        
        const errorDiv = document.createElement("div");
        errorDiv.innerHTML = `
            <div style="background: rgba(255,0,0,0.9); color: white; padding: 25px; margin: 20px; border-radius: 12px; text-align: center; font-weight: bold; font-size: 1.1rem; line-height: 1.5; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <span style="color: #ffd700; font-size: 1.3rem;">⚠️ LÜTFEN BANA BU MESAJI AT:</span><br><br>
                ${hataMesaji}
            </div>
        `;
        document.getElementById("view-categories").appendChild(errorDiv);
    }
}

function veriyiSistemimizeUyarla(dbVerisi, subeKodu) {
    gecerliSubeVerisi.subeAdi = { 
        tr: subeKodu === 'foca' ? "Foça Şube Menüsü" : "Bağarası Şube Menüsü",
        en: subeKodu === 'foca' ? "Foça Branch Menu" : "Bağarası Branch Menu" 
    };

    gecerliSubeVerisi.urunler = dbVerisi.map(satir => {
        return {
            ad: { tr: satir.ad_tr, en: satir.ad_en },
            aciklama: { tr: satir.aciklama_tr || "", en: satir.aciklama_en || "" },
            fiyat: satir.fiyat,
            kategori: satir.kategori,
            img: satir.img_url || "" 
        };
    });

    setTimeout(() => sayfayiOlustur(), 100); 
}

// ==========================================
// 4. ARAYÜZÜ ÇİZME VE GEÇİŞ FONKSİYONLARI 
// ==========================================
function sayfayiOlustur() {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'tr';
    
    const titleEl = document.getElementById("branch-title");
    if(titleEl) titleEl.innerText = gecerliSubeVerisi.subeAdi[lang];
    
    dikeyKategorileriCiz(lang);
    yatayKategorileriCiz(lang);
    
    if (!document.getElementById("view-products").classList.contains("hidden")) {
        urunleriCiz(lang);
    }
}

function dikeyKategorileriCiz(lang) {
    const wrapper = document.getElementById("vertical-categories");
    wrapper.innerHTML = "";

    kategorilerListesi.forEach(kategoriAd => {
        const kategoriUrunleri = gecerliSubeVerisi.urunler.filter(u => u.kategori === kategoriAd);
        if(kategoriUrunleri.length === 0) return; 

        const btn = document.createElement("button");
        btn.className = "vertical-cat-btn";
        btn.innerText = lang === 'tr' ? kategoriAd : kategoriCeviri[kategoriAd];
        
        btn.onclick = () => {
            aktifKategori = kategoriAd;
            showProductView(lang);
        };
        wrapper.appendChild(btn);
    });
}

function yatayKategorileriCiz(lang) {
    const tabsContainer = document.getElementById("horizontal-tabs");
    tabsContainer.innerHTML = ""; 

    kategorilerListesi.forEach(kategoriAd => {
        const kategoriUrunleri = gecerliSubeVerisi.urunler.filter(u => u.kategori === kategoriAd);
        if(kategoriUrunleri.length === 0) return; 

        const btn = document.createElement("button");
        btn.className = "cat-tab " + (aktifKategori === kategoriAd ? "active" : "");
        btn.innerText = lang === 'tr' ? kategoriAd : kategoriCeviri[kategoriAd];
        
        btn.onclick = () => {
            if(aktifKategori !== kategoriAd) {
                aktifKategori = kategoriAd;
                yatayKategorileriCiz(lang); 
                urunleriCiz(lang); 
                btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        };
        tabsContainer.appendChild(btn);
    });
}

function urunleriCiz(lang) {
    const listContainer = document.getElementById("product-list");
    listContainer.innerHTML = "";
    listContainer.classList.remove("animate-page");
    void listContainer.offsetWidth; 
    listContainer.classList.add("animate-page");

    const filtrelenmisUrunler = gecerliSubeVerisi.urunler.filter(urun => urun.kategori === aktifKategori);

    filtrelenmisUrunler.forEach(urun => {
        // DÜZELTME: Resimlerin telefonu yormaması için "loading='lazy'" özelliği eklendi!
        let resimAlani = urun.img ? `<img src="${urun.img}" alt="${urun.ad[lang]}" loading="lazy">` : `<div class="no-img">🍞</div>`;
        const urunKarti = document.createElement("div");
        urunKarti.className = "menu-item-card";
        
        urunKarti.onclick = () => openProductModal(urun, lang);
        
        urunKarti.innerHTML = `
            <div class="item-image">${resimAlani}</div>
            <div class="item-info">
                <h3>${urun.ad[lang]}</h3>
                <p>${urun.aciklama[lang]}</p>
            </div>
            <div class="item-price">${urun.fiyat} ₺</div>
        `;
        listContainer.appendChild(urunKarti);
    });
}

function showProductView(lang) {
    document.getElementById("view-categories").classList.add("hidden");
    document.getElementById("view-products").classList.remove("hidden");
    yatayKategorileriCiz(lang);
    urunleriCiz(lang);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCategoryView() {
    document.getElementById("view-products").classList.add("hidden");
    document.getElementById("view-categories").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 5. ÜRÜN DETAY MODALI FONKSİYONLARI (KUVVETLİ & GARANTİLİ ÇÖZÜM)
// ==========================================
function openProductModal(urun, lang) {
    const modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    const imgContainer = document.getElementById("modal-img-container");
    if (urun.img) {
        document.getElementById("modal-img").src = urun.img;
        imgContainer.style.display = "block";
    } else {
        imgContainer.style.display = "none";
    }

    document.getElementById("modal-title").innerText = urun.ad[lang];
    
    // Eğer fiyatın sonunda ₺ yoksa otomatik ekler, varsa eklemez.
    const priceText = urun.fiyat.toString().includes('₺') ? urun.fiyat : urun.fiyat + " ₺";
    document.getElementById("modal-price").innerText = priceText;
    
    const varsayilanAciklama = lang === 'tr' ? 'Bu ürün için detaylı içerik bilgisi girilmemiştir.' : 'Detailed info is not available for this product.';
    document.getElementById("modal-desc").innerText = urun.aciklama[lang] || varsayilanAciklama;

    // DÜZELTME: CSS'in engellemesini aşmak için en kuvvetli Javascript komutu (Tüm kuralları ezer geçer)
    modal.classList.remove("hidden");
    modal.style.cssText = "display: flex !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: rgba(0,0,0,0.9) !important; z-index: 999999 !important; align-items: center !important; justify-content: center !important;";
    document.body.style.overflow = "hidden"; 
}

function closeProductModal(event) {
    const modal = document.getElementById("product-detail-modal");
    
    // Çarpıya veya siyah boşluğa tıklandığında tamamen gizle
    if (!event || event.target.id === 'product-detail-modal' || event.target.closest('.close-modal-btn')) {
        modal.classList.add("hidden");
        modal.style.cssText = "display: none !important;";
        document.body.style.overflow = "auto"; 
    }
}
