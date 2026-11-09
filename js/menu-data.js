/**
 * Tarihi Foça Simit Fırını — Veri Dosyası (js/menu-data.js)
 */

window.FOCA_MENU_DATA = {
  updatedAt: "2026-11-09T11:25:00+03:00",
  siteContent: {
    brandSub: "Yarım Asırlık Gelenek",
    brandName: "Tarihi Foça Simit Fırını",
    heroBadge: "Taş Fırın & Pastane • Self Servis",
    heroTitle1: "Yarım Asırlık",
    heroTitle2: "Gelenek.",
    heroDesc: "Foça'nın tarihi sokaklarında ve Bağarası şubemizde, usta ellerden çıkan sıcacık İzmir boyozu, çıtır susamlı gevrek, taptaze kuru pastalar ve doğal dondurma lezzetleriyle güne başlayın.",
    heroImg: "assets/images/hero.jpg",
    stat1Val: "05:00",
    stat1Label: "İlk Sıcak Pişirim",
    stat2Val: "2 Şube",
    stat2Label: "Foça & Bağarası",
    stat3Val: "4.8 ★",
    stat3Label: "Müşteri Puanı",
    aboutBadge: "Tarihe Tanıklık Eden Lezzetler",
    aboutTitle: "Usta Ellerden Çıkan Geleneksel Tarifler",
    aboutText1: "Yılların verdiği tecrübe ve geleneksel tariflerimizle hazırladığımız unlu mamullerimiz, Foça'nın ve Bağarası'nın vazgeçilmezi olmaya devam ediyor.",
    aboutText2: "İşletmemiz en taze ve sıcak ürünleri sunabilmek adına Self Servis konseptiyle hizmet vermektedir. Kürekten yeni inen çıtır İzmir gevreği, kat kat açılan gerçek İzmir boyozu, fırınlanmış sıcak yumurta ve taze demlenen çayımızla sabahın ilk ışıklarından gece yarısına kadar yanınızdayız.",
    cakeBadge: "ÖZEL GÜNLERİNİZ İÇİN YANINIZDAYIZ",
    cakeTitle: "Doğum Günleri ve Kutlamalar İçin Özel Yaş Pastalar",
    cakeDesc: "Özel günleriniz, kutlamalarınız ve davetleriniz için günlük taze malzemelerle usta işi yaş pastalar ve toplu siparişler hazırlıyoruz.",
    cakeImg: "assets/images/pasta.jpg",
    whatsappNumber: "905339695335",
    instagramHandle: "@tarihifocasimitfirini",
    instagramUrl: "https://www.instagram.com/tarihifocasimitfirini",
    footerDesc: "Yarım asırlık geleneksel lezzet. İşletmemiz en taze ve sıcak ürünleri sunabilmek için self servis hizmet vermektedir. Afiyet olsun."
  },
  categoryImages: {
    hero: "assets/images/hero.jpg",
    gevrek: "assets/images/gevrek.jpg",
    boyoz: "assets/images/boyoz.jpg",
    pogaca: "assets/images/pogaca.jpg",
    kahvalti: "assets/images/kahvalti.jpg",
    kurupasta: "assets/images/kurupasta.jpg",
    pasta: "assets/images/pasta.jpg",
    dondurma: "assets/images/dondurma.jpg",
    branchFoca: "assets/images/foca-sube.jpg",
    branchBagarasi: "assets/images/bagarasi-sube.jpg"
  },
  categories: [
    { id: "all", name: "Tümü", nameEn: "All", icon: "✨", img: "assets/images/hero.jpg" },
    { id: "gevrek", name: "Gevrek & Boyoz", nameEn: "Simit & Boyoz", icon: "🥨", img: "assets/images/gevrek.jpg" },
    { id: "pogaca", name: "Poğaça & Açma", nameEn: "Pastries", icon: "🥐", img: "assets/images/pogaca.jpg" },
    { id: "kahvalti", name: "Kahvaltı & Sıcaklar", nameEn: "Breakfast", icon: "🍳", img: "assets/images/kahvalti.jpg" },
    { id: "kurupasta", name: "Kuru Pasta", nameEn: "Cookies", icon: "🍪", img: "assets/images/kurupasta.jpg" },
    { id: "pasta", name: "Yaş Pasta & Tatlı", nameEn: "Cakes & Desserts", icon: "🎂", img: "assets/images/pasta.jpg" },
    { id: "dondurma", name: "Dondurma", nameEn: "Gelato", icon: "🍦", img: "assets/images/dondurma.jpg" },
    { id: "icecek", name: "Çay & İçecekler", nameEn: "Drinks", icon: "☕", img: "assets/images/kahvalti.jpg" }
  ],
  branches: {
    foca: {
      id: "foca",
      name: "Foça Şube",
      fullTitle: "Tarihi Foça Simit Fırını — Foça Şube",
      nameEn: "Foça Branch",
      badge: "⚓ Foça Şube",
      tag: "⚓ ESKİ FOÇA MERKEZ",
      address: "Fevzipaşa, 210. Sk. No:8, 35680 Foça/İzmir",
      hours: "05.00 - 00.00",
      phone: "0533 969 53 35",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Fevzipasa+210+Sk+No+8+Foca+Izmir",
      img: "assets/images/foca-sube.jpg"
    },
    bagarasi: {
      id: "bagarasi",
      name: "Bağarası Şube",
      fullTitle: "Tarihi Foça Simit Fırını — Bağarası Şube",
      nameEn: "Bağarası Branch",
      badge: "🌿 Bağarası Şube",
      tag: "🌿 BAĞARASI",
      address: "Kazım Dirik, Foça İzmir Karayolu 118A, 35680 Foça/İzmir",
      hours: "06.00 - 23.30",
      phone: "0533 969 53 35",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Kazim+Dirik+Foca+Izmir+Karayolu+118A+Foca+Izmir",
      img: "assets/images/bagarasi-sube.jpg"
    }
  },
  products: [
    { id: "p1", name: "Taş Fırın Çıtır İzmir Gevreği", nameEn: "Stone Oven Crispy Izmir Simit", cat: "gevrek", price: 20, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/gevrek.jpg", desc: "Pekmezli, bol kavrulmuş susamlı geleneksel taş fırın gevreği." },
    { id: "p2", name: "Geleneksel İzmir Boyozu", nameEn: "Traditional Flaky Izmir Boyoz", cat: "gevrek", price: 25, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/boyoz.jpg", desc: "Usta ellerde dinlendirilerek kat kat açılan gerçek İzmir boyozu." },
    { id: "p3", name: "Tahinli Özel İzmir Boyozu", nameEn: "Tahini Filled Crispy Boyoz", cat: "gevrek", price: 35, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/boyoz.jpg", desc: "Taş değirmen çifte kavrulmuş tahin dolgulu sıcak boyoz." },
    { id: "p4", name: "Çikolatalı Sıcak Boyoz", nameEn: "Warm Chocolate Boyoz", cat: "gevrek", price: 40, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/boyoz.jpg", desc: "Çıtır boyoz katmanları arasında akışkan fındık kreması ve çikolata." },
    { id: "p5", name: "Ispanaklı & Lor Peynirli Boyoz", nameEn: "Spinach & Curd Cheese Boyoz", cat: "gevrek", price: 35, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/boyoz.jpg", desc: "Taze Ege otları, ıspanak ve tatlı lor peyniri dolgulu sıcak boyoz." },
    { id: "p6", name: "Tereyağlı Susamlı Kumru Ekmeği", nameEn: "Sesame Kumru Sandwich Bread", cat: "gevrek", price: 25, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/gevrek.jpg", desc: "Nohut mayalı, dışı bol susamlı sıcak İzmir kumrusu." },

    { id: "p7", name: "Zeytinli Saçaklı Açma", nameEn: "Olive Paste Soft Braided Acma", cat: "pogaca", price: 30, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/pogaca.jpg", desc: "Sızma zeytinyağlı ve siyah zeytin ezmeli yumuşak açma." },
    { id: "p8", name: "Sade Tereyağlı Açma", nameEn: "Plain Butter Soft Acma", cat: "pogaca", price: 25, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/pogaca.jpg", desc: "Çörek otu ve susam serpiştirilmiş klasik yumuşak açma." },
    { id: "p9", name: "Bergama Tulum & Beyaz Peynirli Poğaça", nameEn: "White Cheese & Tulum Pogaca", cat: "pogaca", price: 25, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/pogaca.jpg", desc: "Maydanozlu beyaz peynir ve Bergama tulumu dolgulu poğaça." },
    { id: "p10", name: "Dereotlu & Lorlu Poğaça", nameEn: "Fresh Dill & Curd Cheese Pastry", cat: "pogaca", price: 28, foca: true, bagarasi: true, hot: false, signature: false, img: "assets/images/pogaca.jpg", desc: "Taze dereotu aromalı, ağızda dağılan kıyır poğaça." },
    { id: "p11", name: "Kaşarlı & Sucuklu Sıcak Poğaça", nameEn: "Kashar Cheese & Sujuk Pastry", cat: "pogaca", price: 32, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/pogaca.jpg", desc: "Eriyen taze kaşar peyniri ve sucuklu sıcak poğaça." },
    { id: "p12", name: "Patatesli Köy Poğaçası", nameEn: "Spiced Potato Village Pastry", cat: "pogaca", price: 30, foca: false, bagarasi: true, hot: true, signature: false, img: "assets/images/pogaca.jpg", desc: "Karamelize soğanlı ve baharatlı patates dolgulu." },

    { id: "p13", name: "Fırınlanmış Sıcak Yumurta", nameEn: "Warm Oven-Baked Boiled Egg", cat: "kahvalti", price: 15, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/boyoz.jpg", desc: "Boyoz ve gevreğin vazgeçilmez eşlikçisi; karabiber ve kekik ile." },
    { id: "p14", name: "Eski Foça Kahvaltı Tabağı", nameEn: "Foça Aegean Breakfast Plate", cat: "kahvalti", price: 145, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/kahvalti.jpg", desc: "Ezine beyaz peynir, İzmir tulumu, zeytin, domates, salatalık ve sıcak yumurta." },
    { id: "p15", name: "İzmir Usulü Peynirli Kumru", nameEn: "Izmir Kumru Sandwich", cat: "kahvalti", price: 110, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/gevrek.jpg", desc: "Susamlı kumru ekmeği arasında Bergama tulumu, domates ve yeşil biber." },
    { id: "p16", name: "Üç Peynirli Sıcak Su Böreği", nameEn: "Warm Cheese Su Boregi", cat: "kahvalti", price: 95, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/pogaca.jpg", desc: "El açması yufkalarla hazırlanan bol tereyağlı ve peynirli sıcak su böreği." },
    { id: "p17", name: "Bağarası Karışık Köy Tostu", nameEn: "Bagarasi Special Mixed Toast", cat: "kahvalti", price: 120, foca: false, bagarasi: true, hot: true, signature: false, img: "assets/images/kahvalti.jpg", desc: "Ekşi mayalı köy ekmeğinde çift kaşarlı ve sucuklu sıcak tost." },

    { id: "p18", name: "Tatlı Kuru Pasta Porsiyon", nameEn: "Sweet Petit Fours Assortment", cat: "kurupasta", price: 135, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/kurupasta.jpg", desc: "Belçika çikolata kaplı, fıstıklı, bademli ve marmelatlı günlük taze kurabiyeler." },
    { id: "p19", name: "Tuzlu Kuru Pasta Porsiyon", nameEn: "Savory Petit Fours Assortment", cat: "kurupasta", price: 130, foca: true, bagarasi: true, hot: false, signature: false, img: "assets/images/kurupasta.jpg", desc: "Çörek otlu, susamlı kandil simidi, peynirli ve baharatlı kıyır tuzlu kurabiyeler." },
    { id: "p20", name: "Tahinli & Cevizli Foça Kurabiyesi", nameEn: "Tahini & Walnut Foça Cookie", cat: "kurupasta", price: 35, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/kurupasta.jpg", desc: "Ağızda helva gibi dağılan bol tahinli ve kavrulmuş cevizli kurabiye." },
    { id: "p21", name: "Antep Fıstıklı & Damla Sakızlı Kurabiye", nameEn: "Pistachio & Mastic Gum Cookie", cat: "kurupasta", price: 45, foca: true, bagarasi: true, hot: false, signature: false, img: "assets/images/kurupasta.jpg", desc: "Boz fıstık ve Çeşme damla sakızı aromalı özel pastane kurabiyesi." },

    { id: "p22", name: "Belçika Çikolatalı & Çilekli Dilim Pasta", nameEn: "Belgian Chocolate & Strawberry Cake Slice", cat: "pasta", price: 135, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/pasta.jpg", desc: "Günlük taze pandispanya, pastacı kreması, taze çilek ve bitter ganaj." },
    { id: "p23", name: "Özel Gün Yaş Pasta", nameEn: "Celebration Layer Cake", cat: "pasta", price: 680, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/pasta.jpg", desc: "Doğum günü ve kutlamalar için çikolatalı, meyveli veya fıstıklı bütün pasta." },
    { id: "p24", name: "Karamelli Trileçe & Ekler", nameEn: "Caramel Tres Leches & Eclair", cat: "pasta", price: 110, foca: true, bagarasi: true, hot: false, signature: false, img: "assets/images/pasta.jpg", desc: "Günlük sütlü tatlılarımız ve gerçek vanilya kremalı taze ekler." },

    { id: "p25", name: "El Yapımı Doğal Dondurma (Top)", nameEn: "Artisanal Gelato Scoop", cat: "dondurma", price: 50, foca: true, bagarasi: false, hot: false, signature: true, img: "assets/images/dondurma.jpg", desc: "Çikolata parçacıklı, limon kabuklu, kazandibili, tahinli veya cevizli bal-badem." },
    { id: "p26", name: "El Yapımı Doğal Dondurma (Porsiyon)", nameEn: "Artisanal Gelato Portion", cat: "dondurma", price: 140, foca: true, bagarasi: false, hot: false, signature: true, img: "assets/images/dondurma.jpg", desc: "Gerçek meyve ve sütle hazırlanan 3 top doğal dondurma." },
    { id: "p27", name: "Tahinli & Cevizli Foça Dondurması (Kg)", nameEn: "Tahini & Walnut Gelato (1 Kg)", cat: "dondurma", price: 480, foca: true, bagarasi: false, hot: false, signature: false, img: "assets/images/dondurma.jpg", desc: "1 Kg el yapımı doğal Foça dondurması." },

    { id: "p28", name: "Taze Demleme Çay", nameEn: "Freshly Brewed Turkish Tea", cat: "icecek", price: 15, foca: true, bagarasi: true, hot: true, signature: true, img: "assets/images/kahvalti.jpg", desc: "Rize yaprak çayıyla gün boyu taze demlenen çay." },
    { id: "p29", name: "Büyük Fincan Çay", nameEn: "Large Cup of Turkish Tea", cat: "icecek", price: 25, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/kahvalti.jpg", desc: "Kahvaltı keyfini uzatan büyük fincan taze çay." },
    { id: "p30", name: "Közde Türk Kahvesi", nameEn: "Traditional Turkish Coffee", cat: "icecek", price: 55, foca: true, bagarasi: true, hot: true, signature: false, img: "assets/images/kahvalti.jpg", desc: "Çifte kavrulmuş taze çekim Türk kahvesi." },
    { id: "p31", name: "Ev Yapımı Naneli Limonata", nameEn: "Homemade Fresh Mint Lemonade", cat: "icecek", price: 65, foca: true, bagarasi: true, hot: false, signature: true, img: "assets/images/dondurma.jpg", desc: "Rendelenmiş limon kabuğu ve taze nane yapraklarıyla doğal limonata." },
    { id: "p32", name: "Köy Ayranı & Soğuk İçecekler", nameEn: "Foamy Ayran & Cold Drinks", cat: "icecek", price: 30, foca: true, bagarasi: true, hot: false, signature: false, img: "assets/images/kahvalti.jpg", desc: "Bol köpüklü soğuk ayran, sade soda ve meşrubat çeşitleri." }
  ],
  reviews: [
    {
      author: "Mustafa Bozkaya",
      branch: "Foça Şube",
      text: "Fırından sürekli sıcak boyoz ve simit çıkıyor. Simitleri önümde kürekten boşalttı çıtır çıtır mis kokulu. Son zamanlarda yediğim en iyi, en çıtır, en sıcak boyoz ve simitti."
    },
    {
      author: "Furkan",
      branch: "Foça & Bağarası",
      text: "Haftada 2 kez kahvaltı için kesinlikle gidiyoruz. Güler yüzlü kaliteli hizmet, ürünlerinin hepsi birbirinden lezzetli. Gün boyu taze çayları ve devamlı sıcak bulunabilen simit, poğaça ve taptaze kuru pastaları mükemmel."
    },
    {
      author: "Derya Hatipoğlu",
      branch: "Foça Şube",
      text: "Foça’da kahvaltı için akla gelen ilk mekan. Temiz, nezih, doğal bir ortam. Ürünleri taze, dışarıda oturma alanları var. Kahvaltı yapacaksanız hiç düşünmeden gidebilirsiniz."
    },
    {
      author: "Ece Demirel",
      branch: "Foça Şube",
      text: "Harika bir konsepti var. Lezzetli ve tertemiz. Özellikle Yenifoça’dan buraya boyoz yemeye geliyoruz, yanında sıcak haşlanmış taze yumurta da mevcut. Herkese tavsiye ederim."
    },
    {
      author: "Aslı Akyunt",
      branch: "Foça Şube",
      text: "İzmir’de yiyebileceğiniz en çıtır ve lezzetli gevrekler burada, harika İzmir boyozu, açmalar, her şey her an sıcak. Eski Foça çarşı manzaralı, çok keyifli."
    },
    {
      author: "Cemre",
      branch: "Foça Şube",
      text: "Mükemmel bir el yapımı dondurması var; çikolatalısı çikolata parçacıklı, limonlusu limon kabuklu, kazandibili ve tahinlisine bayıldım. Yolunuz düşerse kesinlikle uğrayın."
    }
  ],
  gallery: [
    { src: "assets/images/hero.jpg", title: "Taş Fırından Çıtır Gevrek & Boyoz" },
    { src: "assets/images/gevrek.jpg", title: "Bol Susamlı İzmir Gevreği" },
    { src: "assets/images/boyoz.jpg", title: "İzmir Boyozu & Fırınlanmış Yumurta" },
    { src: "assets/images/pogaca.jpg", title: "Sıcak Poğaça & Zeytinli Açma" },
    { src: "assets/images/kurupasta.jpg", title: "Günlük Tatlı & Tuzlu Kuru Pastalar" },
    { src: "assets/images/dondurma.jpg", title: "El Yapımı Doğal Foça Dondurması" }
  ]
};
