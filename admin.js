// --- 1. SUPABASE BAĞLANTISI ---
const supabaseUrl = 'https://hkjsflzfahugubbvohvt.supabase.co'; 
const supabaseKey = 'sb_publishable_bpWCQrmTJBcU6SPADDRoyw_1ZHjoAlX';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let loadedProducts = []; // Arama motoru için ürünleri hafızada tutarız

// --- 2. GİRİŞ ÇIKIŞ İŞLEMLERİ ---
function handleLogin(e) { if(e.key === 'Enter') checkPassword(); }

async function checkPassword() {
    const email = "admin@focasimit.com";
    const password = document.getElementById("admin-password").value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email, password: password });

    if (error) { document.getElementById("login-error").innerText = "Hatalı şifre veya yetkisiz giriş!"; } 
    else {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("admin-panel").classList.remove("hidden");
        fetchProductsForEdit(); 
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    document.getElementById("admin-password").value = "";
    document.getElementById("login-screen").classList.remove("hidden");
    document.getElementById("admin-panel").classList.add("hidden");
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}
// --- 3. GÖRSEL WEBP DÖNÜŞTÜRÜCÜ (ULTRA OPTİMİZE - HIZLI YÜKLEME İÇİN) ---
async function convertToWebP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Menüdeki resimler küçük olduğu için max genişliği 400px yapıyoruz (Eskiden 600'dü)
                const maxWidth = 400; 
                let newWidth = img.width;
                let newHeight = img.height;

                // Eğer resim zaten küçükse büyütme, sadece büyükleri küçült
                if (img.width > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = (img.height * maxWidth) / img.width;
                }

                canvas.width = newWidth; 
                canvas.height = newHeight;
                
                // Resmi çiz
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                // Kaliteyi 0.8'den 0.6'ya çekiyoruz. Gözle fark edilmez ama boyutu %70 küçültür!
                const compressedBase64 = canvas.toDataURL('image/webp', 0.6);
                resolve(compressedBase64); 
            }
            img.onerror = error => reject(error);
            img.src = event.target.result;
        }
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// --- 4. YENİ ÜRÜN EKLEME ---
async function addProduct(event) {
    event.preventDefault();
    const statusMsg = document.getElementById("add-status");
    statusMsg.style.color = "#4caf50"; statusMsg.innerText = "İşleniyor...";

    let finalImgUrl = "";
    const fileInput = document.getElementById("add-img-file");
    if (fileInput.files.length > 0) { finalImgUrl = await convertToWebP(fileInput.files[0]); }

    const newProduct = {
        sube: document.getElementById("add-sube").value,
        kategori: document.getElementById("add-kategori").value,
        ad_tr: document.getElementById("add-ad-tr").value,
        ad_en: document.getElementById("add-ad-en").value,
        aciklama_tr: document.getElementById("add-aciklama-tr").value,
        aciklama_en: document.getElementById("add-aciklama-en").value,
        fiyat: document.getElementById("add-fiyat").value,
        img_url: finalImgUrl, aktif_mi: true
    };

    try {
        const { error } = await supabaseClient.from('urunler').insert([newProduct]);
        if (error) throw error;
        statusMsg.innerText = "Başarıyla eklendi!";
        document.getElementById("add-form").reset(); 
        fetchProductsForEdit(); 
    } catch (hata) { statusMsg.style.color = "#ff4d4d"; statusMsg.innerText = "Hata: " + hata.message; }
}

// --- 5. LİSTELEME, FİLTRELEME VE SIRALAMA MOTORU ---
async function fetchProductsForEdit() {
    const subeSecimi = document.getElementById("edit-sube").value;
    const kategoriSecimi = document.getElementById("edit-kategori").value;
    const listDiv = document.getElementById("edit-product-list");

    if (!kategoriSecimi) {
        listDiv.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Sıralama ve düzenleme yapmak için lütfen bir kategori seçin.</p>';
        return;
    }

    listDiv.innerHTML = "<p>Yükleniyor...</p>";

    try {
        // Seçilen şube ve kategoriye göre çek, 'sira' sütununa göre sırala
        const { data, error } = await supabaseClient
            .from('urunler')
            .select('*')
            .eq('sube', subeSecimi)
            .eq('kategori', kategoriSecimi)
            .order('sira', { ascending: true }); // ÖNEMLİ: Sıraya göre diz
            
        if (error) throw error;
        
        loadedProducts = data; 
        renderEditList(loadedProducts); 
    } catch (error) { 
        listDiv.innerHTML = "<p>Veriler çekilemedi!</p>"; 
        console.error(error);
    }
}

function filterProducts() {
    const term = document.getElementById("search-product").value.toLowerCase();
    const filtered = loadedProducts.filter(u => u.ad_tr.toLowerCase().includes(term));
    renderEditList(filtered);
}

function renderEditList(products) {
    const listDiv = document.getElementById("edit-product-list");
    listDiv.innerHTML = "";
    if(products.length === 0) { listDiv.innerHTML = "<p>Bu kategoride ürün bulunamadı.</p>"; return; }

    // Sadece arama çubuğu boşsa yukarı/aşağı oklarını göster (Arama varken sıra kaydırılmaz)
    const aramaBosta = document.getElementById("search-product").value.trim() === "";

    products.forEach((urun, index) => {
        const item = document.createElement("div");
        item.className = "edit-item";
        item.style.display = "flex"; item.style.alignItems = "center";
        
        const aktifDurumu = urun.aktif_mi ? "" : '<span style="color:#ff4d4d; font-size:0.8rem;">(Tükendi)</span>';
        
        // Yukarı Aşağı Butonları
        let orderButtons = "";
        if (aramaBosta) {
            orderButtons = `
                <div style="display:flex; flex-direction:column; gap:4px; margin-right:15px;">
                    <button onclick="moveProduct(${index}, -1)" style="background:#333; color:#d4af37; border:none; border-radius:4px; cursor:pointer; padding:5px 8px;" ${index === 0 ? 'disabled opacity="0.3"' : ''}>▲</button>
                    <button onclick="moveProduct(${index}, 1)" style="background:#333; color:#d4af37; border:none; border-radius:4px; cursor:pointer; padding:5px 8px;" ${index === products.length - 1 ? 'disabled opacity="0.3"' : ''}>▼</button>
                </div>
            `;
        }
        
        item.innerHTML = `
            ${orderButtons}
            <div class="edit-info" style="flex:1;">
                <h4>${urun.ad_tr} <span style="color:var(--gold); font-size:0.9rem;">(${urun.fiyat})</span> ${aktifDurumu}</h4>
            </div>
            <div class="edit-actions">
                <button class="btn-update" onclick="openEditModal('${urun.id}')">Düzenle</button>
                <button class="btn-delete" onclick="deleteProduct('${urun.id}', '${urun.ad_tr}')">Sil</button>
            </div>
        `;
        listDiv.appendChild(item);
    });
}

// Ürün Sırasını Değiştirme ve Veritabanına Kaydetme
async function moveProduct(index, direction) {
    if (index + direction < 0 || index + direction >= loadedProducts.length) return;

    // Dizideki yerlerini değiştir
    const temp = loadedProducts[index];
    loadedProducts[index] = loadedProducts[index + direction];
    loadedProducts[index + direction] = temp;

    // Arayüzü anında güncelle (hissiyatı hızlandırmak için)
    renderEditList(loadedProducts);

    // Arka planda Supabase'e yeni sıraları kaydet
    try {
        for (let i = 0; i < loadedProducts.length; i++) {
            loadedProducts[i].sira = i; // 0, 1, 2 diye yeni sıra ver
            await supabaseClient.from('urunler').update({ sira: i }).eq('id', loadedProducts[i].id);
        }
    } catch (error) {
        console.error("Sıralama güncellenirken hata oluştu:", error);
    }
}

async function deleteProduct(id, isim) {
    if(confirm(`"${isim}" adlı ürünü silmek istediğinize emin misiniz?`)) {
        try {
            const { error } = await supabaseClient.from('urunler').delete().eq('id', id);
            if (error) throw error;
            fetchProductsForEdit();
        } catch (error) { alert("Hata: " + error.message); }
    }
}

// --- 6. KAPSAMLI GÜNCELLEME SİSTEMİ (MODAL) ---
function openEditModal(id) {
    // Hafızadaki ürünlerden tıkladığımızı bul
    const urun = loadedProducts.find(u => u.id === id);
    if(!urun) return;
    
    // Modalın içindeki kutuları mevcut verilerle doldur
    document.getElementById('update-id').value = urun.id;
    document.getElementById('update-old-img').value = urun.img_url || '';
    document.getElementById('update-sube').value = urun.sube; // Şube seçimi eklendi
    document.getElementById('update-kategori').value = urun.kategori;
    document.getElementById('update-aktif').value = urun.aktif_mi ? 'true' : 'false';
    document.getElementById('update-ad-tr').value = urun.ad_tr;
    document.getElementById('update-ad-en').value = urun.ad_en;
    document.getElementById('update-aciklama-tr').value = urun.aciklama_tr || '';
    document.getElementById('update-aciklama-en').value = urun.aciklama_en || '';
    document.getElementById('update-fiyat').value = urun.fiyat;
    
    // Modalı ekranda göster ve CSS inatlaşmasını zorla kır
    const modal = document.getElementById('edit-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none'; // Tamamen gizle
    document.getElementById('update-form').reset();
    document.getElementById('update-status').innerText = "";
}

async function submitFullUpdate(event) {
    event.preventDefault();
    const statusMsg = document.getElementById("update-status");
    statusMsg.style.color = "#4caf50"; statusMsg.innerText = "Güncelleniyor...";

    // Eğer yeni resim yüklenmişse WebP yap, yoksa eski resmi (hidden inputtan) kullan
    let finalImgUrl = document.getElementById('update-old-img').value;
    const fileInput = document.getElementById("update-img-file");
    if (fileInput.files.length > 0) { finalImgUrl = await convertToWebP(fileInput.files[0]); }

    const id = document.getElementById('update-id').value;
    const updatedData = {
        sube: document.getElementById('update-sube').value, // Şube verisi eklendi
        kategori: document.getElementById('update-kategori').value,
        aktif_mi: document.getElementById('update-aktif').value === 'true',
        ad_tr: document.getElementById('update-ad-tr').value,
        ad_en: document.getElementById('update-ad-en').value,
        aciklama_tr: document.getElementById('update-aciklama-tr').value,
        aciklama_en: document.getElementById('update-aciklama-en').value,
        fiyat: document.getElementById('update-fiyat').value,
        img_url: finalImgUrl
    };

    try {
        const { error } = await supabaseClient.from('urunler').update(updatedData).eq('id', id);
        if (error) throw error;
        
        statusMsg.innerText = "Başarıyla güncellendi!";
        setTimeout(() => {
            closeEditModal();
            fetchProductsForEdit(); // Arka plandaki listeyi yenile
        }, 1000);
    } catch (hata) {
        statusMsg.style.color = "#ff4d4d"; statusMsg.innerText = "Hata: " + hata.message;
    }
}
