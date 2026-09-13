document.addEventListener("DOMContentLoaded", () => {
    // 1. Modüler Header ve Footer'ı Yükle
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initHeaderScroll(); // Header yüklendikten sonra kaydırma efektini aktif et
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

// Kaydırdıkça Header'ın arkaplanını saydamdan siyaha çeviren efekt
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Şube Seçim Modalı Fonksiyonları
// Şube Seçim Modalı Fonksiyonları
function openBranchModal() {
    const modal = document.getElementById('branchModal');
    if (modal) {
        modal.classList.add('active'); // Eğer ana sayfadaysak (modal varsa) aç
    } else {
        window.location.href = "index.html#subeler"; // Menü sayfasındaysak ana sayfaya yönlendir
    }
}

function closeBranchModal() {
    document.getElementById('branchModal').classList.remove('active');
}

// Modalın dışına tıklayınca kapanmasını sağla
document.getElementById('branchModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeBranchModal();
    }
});

// --- DİL DEĞİŞTİRME SİSTEMİ ---
let currentLang = 'tr';

const translations = {
    tr: {
        navHome: "Ana Sayfa",
        navAbout: "Hakkımızda",
        navBranches: "Şubelerimiz",
        qrBtn: "QR Menü",
        heroTitle: "Yarım Asırlık <br><span>Gelenek.</span>",
        heroSub: "Foça'nın tarihi sokaklarında, usta ellerden çıkan sıcacık boyoz ve çıtır gevrek kokusuyla güne başlayın.",
        heroBtn: "Menüyü İncele",
        aboutTitle: "Tarihe Tanıklık Eden <span class='gold-text'>Lezzetler</span>",
        orderTitle: "Özel Günleriniz İçin Yanınızdayız",
        orderBtn: "WhatsApp'tan Sipariş Ver",
        modalTitle: "Hangi menüyü incelemek istersiniz?",
        modalSub: "Size daha doğru fiyat ve ürün bilgisi sunabilmemiz için lütfen şube seçin.",
        btnCenter: "Foça Şube",
        btnCoast: "Bağarası Şube",
        
        // --- FOOTER VE ŞUBE ÇEVİRİLERİ ---
        footerBrand: "Tarihi Foça Simit Fırını",
        footerDesc: "Geleneksel lezzet. İşletmemiz self servis hizmet vermektedir. Afiyet olsun.",
        centerBranch: "Foça Şube",
        centerAddress: "Fevzipaşa, 210. Sk. No:8, 35680 Foça/İzmir",
        coastBranch: "Bağarası Şube",
        coastAddress: "Kazım Dirik, Foça İzmir Karayolu 118A, 35680 Foça/İzmir",
        everyday: "Her Gün:",
        socialMedia: "Sosyal Medya",
        footerRights: "&copy; 2026 Tarihi Foça Simit Fırını. Tüm Hakları Saklıdır.",
        getDirections: "Yol Tarifi Al"
    },
    en: {
        navHome: "Home",
        navAbout: "About Us",
        navBranches: "Branches",
        qrBtn: "QR Menu",
        heroTitle: "Half a Century of <br><span>Tradition.</span>",
        heroSub: "Start your day in the historical streets of Foça with the aroma of warm boyoz and crispy gevrek from master hands.",
        heroBtn: "View Menu",
        aboutTitle: "Flavors Witnessing <span class='gold-text'>History</span>",
        orderTitle: "With You on Special Occasions",
        orderBtn: "Order via WhatsApp",
        modalTitle: "Which menu would you like to view?",
        modalSub: "Please select a branch so we can provide accurate pricing and product information.",
        btnCenter: "Foça Branch",
        btnCoast: "Bağarası Branch",
        
        // --- FOOTER VE ŞUBE ÇEVİRİLERİ ---
        footerBrand: "Historical Foça Bakery",
        footerDesc: "Traditional taste. Our establishment is self-service. Enjoy your meal.",
        centerBranch: "Foça Branch",
        centerAddress: "Fevzipasa, 210. St. No:8, 35680 Foca/Izmir",
        coastBranch: "Bağarası Branch",
        coastAddress: "Kazim Dirik, Foca Izmir Highway 118A, 35680 Foca/Izmir",
        everyday: "Everyday:",
        socialMedia: "Social Media",
        footerRights: "&copy; 2026 Historical Foça Bakery. All Rights Reserved.",
        getDirections: "Get Directions"
    }
};

function toggleLanguage() {
    // Dili değiştir (TR ise EN yap, EN ise TR yap)
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    
    // Butonun üzerindeki yazıyı güncelle
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.innerText = currentLang === 'tr' ? 'EN' : 'TR';
    }

    // Sayfadaki tüm data-i18n etiketlerini bul ve çevir
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
}
