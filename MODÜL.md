{
  "nexlyn_master_schema": {
    "version": "1.0.0",
    "theme": "vintage_luxury",
    "club_types": [
      {
        "type_id": "ticaret",
        "type_name": "Ticaret & Ürün Kulübü",
        "description": "Özel ürünlerin sergilendiği ve elit müşteri ilişkilerinin yönetildiği lüks mağaza konsepti.",
        "modules": {
          "modul_1": {
            "id": "tic_vitrin",
            "name": "Premium Ürün Vitrini",
            "type": "gallery_grid",
            "features": ["Görsel Büyütme", "Fiyat Etiketi", "Stok Durumu Göstergesi", "Koyu Kırmızı Vurgu"]
          },
          "modul_2": {
            "id": "tic_siparis",
            "name": "Doğrudan Sipariş Formu",
            "type": "action_form",
            "features": ["WhatsApp Entegrasyonu", "Adres Alma", "Özel İstek Notu"]
          },
          "modul_3": {
            "id": "tic_yorum",
            "name": "Müşteri Deneyimleri (Yorumlar)",
            "type": "list_view",
            "features": ["Yıldızlı Değerlendirme", "Admin Onaylı Gösterim", "Tarihçe"]
          },
          "modul_4": {
            "id": "tic_kampanya",
            "name": "Gizli İndirim & Fırsatlar",
            "type": "announcement_banner",
            "features": ["Geri Sayım Sayacı", "Kupon Kodu Kopyalama", "Sınırlı Erişim"]
          },
          "modul_5": {
            "id": "tic_sohbet",
            "name": "VIP Canlı Destek",
            "type": "live_chat",
            "features": ["Gerçek Zamanlı Yazışma", "Sadece Kulüp Sahibine Bildirim", "Dosya/Fotoğraf Gönderimi"]
          }
        }
      },
      {
        "type_id": "oyun",
        "type_name": "Oyun & E-Spor Kulübü",
        "description": "Rekabetin ve takım ruhunun karanlık, gotik bir estetikle buluştuğu klan merkezi.",
        "modules": {
          "modul_1": {
            "id": "oyun_turnuva",
            "name": "Turnuva & Eşleşme Ağacı",
            "type": "bracket_view",
            "features": ["Canlı Skor Güncelleme", "Takım Eşleşmeleri", "Kazanan Vurgusu"]
          },
          "modul_2": {
            "id": "oyun_kadro",
            "name": "Elit Oyuncu Kadrosu",
            "type": "profile_grid",
            "features": ["Oyun İçi Rol (Sniper, Support vb.)", "KDA İstatistikleri", "Oyuncu Avatarı"]
          },
          "modul_3": {
            "id": "oyun_takvim",
            "name": "Antrenman & Maç Takvimi",
            "type": "calendar_view",
            "features": ["Yaklaşan Maçlar", "Saat Dilimi Çevirici", "Katılım Durumu (Katıl/Ret)"]
          },
          "modul_4": {
            "id": "oyun_medya",
            "name": "Epik Anlar (Klipler/Medya)",
            "type": "video_gallery",
            "features": ["YouTube/Twitch Link Gömme", "En Çok Beğenilenler Sıralaması"]
          },
          "modul_5": {
            "id": "oyun_sohbet",
            "name": "Klan İçi Strateji Odası",
            "type": "live_chat",
            "features": ["Sohbet Geçmişi", "Yönetici (Moderatör) Rozetleri", "Duyuru Sabitleme"]
          }
        }
      },
      {
        "type_id": "akademi",
        "type_name": "Akademi & Eğitim Kulübü",
        "description": "Bilginin özel bir cemiyet ciddiyetiyle paylaşıldığı dijital kütüphane ve çalışma odası.",
        "modules": {
          "modul_1": {
            "id": "aka_kaynak",
            "name": "Gizli Kütüphane (Dosyalar)",
            "type": "file_manager",
            "features": ["PDF/Docx İndirme", "Kategori Filtreleme", "Dosya Boyutu Gösterimi"]
          },
          "modul_2": {
            "id": "aka_ders",
            "name": "Ders/Seminer Programı",
            "type": "timeline_view",
            "features": ["Zoom/Meet Linkleri", "Hatırlatıcılar", "Geçmiş Ders Kayıtları"]
          },
          "modul_3": {
            "id": "aka_sorucevap",
            "name": "Soru-Cevap (Q&A) Forumu",
            "type": "forum_thread",
            "features": ["Soruyu Çözüldü İşaretleme", "Eğitmen Vurgusu (Altın Renk)", "Upvote (Katılıyorum)"]
          },
          "modul_4": {
            "id": "aka_sinav",
            "name": "Mini Sınav & Değerlendirme",
            "type": "quiz_engine",
            "features": ["Çoktan Seçmeli Sorular", "Anında Sonuç Gösterimi", "Başarı Tablosu"]
          },
          "modul_5": {
            "id": "aka_notlar",
            "name": "Eğitmenin Altın Notları",
            "type": "rich_text_article",
            "features": ["Okuma Modu (Distraction-free)", "Önemli Yerleri Fosforlama", "Yazdırılabilir Çıktı"]
          }
        }
      },
      {
        "type_id": "eglence",
        "type_name": "Eğlence & Hobi Kulübü",
        "description": "Aynı tutkuyu paylaşanların sanat, müzik ve hobi odaklı özel toplanma alanı.",
        "modules": {
          "modul_1": {
            "id": "egl_pano",
            "name": "Etkinlik & Buluşma Panosu",
            "type": "event_board",
            "features": ["Konum/Harita Entegrasyonu", "Katılımcı Listesi Gösterimi", "Bilet/Rezervasyon Linki"]
          },
          "modul_2": {
            "id": "egl_galeri",
            "name": "İlham Galerisi (Fotoğraf/Sanat)",
            "type": "masonry_grid",
            "features": ["Tam Ekran İnceleme", "Fotoğrafa Yorum Yapma", "Kullanıcı Yükleme İzni"]
          },
          "modul_3": {
            "id": "egl_anket",
            "name": "Ortak Karar (Oylama/Anket)",
            "type": "polling_system",
            "features": ["Çoklu Seçenek", "Canlı Sonuç Barları", "Anonim veya Açık Oylama"]
          },
          "modul_4": {
            "id": "egl_muzik",
            "name": "Cemiyetin Çalma Listesi",
            "type": "spotify_embed",
            "features": ["Spotify/Apple Music Entegrasyonu", "Haftanın Şarkısı Vurgusu"]
          },
          "modul_5": {
            "id": "egl_sohbet",
            "name": "Serbest Kürsü (Lounge)",
            "type": "live_chat",
            "features": ["Gündelik Sohbet", "Emoji/GIF Desteği", "Anlık Çevrimiçi Kişi Sayısı"]
          }
        }
      },
      {
        "type_id": "kurumsal",
        "type_name": "Kurumsal & Şirket Kulübü",
        "description": "Markaların prestijli duruşlarını sergiledikleri resmi, şık ve güvenilir iletişim paneli.",
        "modules": {
          "modul_1": {
            "id": "kur_duyuru",
            "name": "Resmi Duyurular & Bülten",
            "type": "news_feed",
            "features": ["Önem Derecesi (Acil, Normal)", "Tarih ve İmza", "Sabitlenmiş Haberler"]
          },
          "modul_2": {
            "id": "kur_vizyon",
            "name": "Hakkımızda & Vizyon Panosu",
            "type": "hero_content",
            "features": ["Marka Hikayesi", "Yönetim Ekibi Tanıtımı", "Şık Tipografi"]
          },
          "modul_3": {
            "id": "kur_iletisim",
            "name": "Bize Ulaşın (İletişim Masası)",
            "type": "contact_form",
            "features": ["Departman Seçimi", "Kurumsal Harita", "Çalışma Saatleri"]
          },
          "modul_4": {
            "id": "kur_sss",
            "name": "Sıkça Sorulan Sorular (SSS)",
            "type": "accordion_list",
            "features": ["Açılır Kapanır Sorular (Accordion)", "Arama Çubuğu", "Kategori Ayrımı"]
          },
          "modul_5": {
            "id": "kur_toplanti",
            "name": "Toplantı & Randevu Odası",
            "type": "booking_system",
            "features": ["Müsaitlik Takvimi", "Toplantı Linki Üretimi", "E-posta Onay Bildirimi"]
          }
        }
      },
      {
        "type_id": "sosyal",
        "type_name": "Sosyal & Topluluk Kulübü",
        "description": "İnsanların bir amaç uğruna birleştiği, dayanışma ve yardımlaşma odaklı sıcak ortam.",
        "modules": {
          "modul_1": {
            "id": "sos_tanitim",
            "name": "Üye Tanıtım Duvarı",
            "type": "user_cards",
            "features": ["Hoş Geldin Mesajları", "Kısa Biyografiler", "İlgi Alanı Etiketleri"]
          },
          "modul_2": {
            "id": "sos_bagis",
            "name": "Destek & Yardım Kampanyaları",
            "type": "fund_tracker",
            "features": ["Hedef İlerleme Çubuğu", "Şeffaf Bütçe Raporu", "Bağış/Destek Linkleri"]
          },
          "modul_3": {
            "id": "sos_gonullu",
            "name": "Gönüllü Etkinlikleri",
            "type": "task_board",
            "features": ["Görev Dağılımı", "Gönüllü Ol Butonu", "Katılım Puan Sistemi"]
          },
          "modul_4": {
            "id": "sos_kurallar",
            "name": "Cemiyet Kuralları (Manifesto)",
            "type": "rule_book",
            "features": ["Madde Madde Sıralama", "Kabul Ediyorum Onay Kutusu", "Zorunlu Okuma Alanı"]
          },
          "modul_5": {
            "id": "sos_sohbet",
            "name": "Meydan (Genel Sohbet)",
            "type": "live_chat",
            "features": ["Herkesin Katılabildiği Açık Alan", "Küfür/Spam Filtresi", "Soru Sorma Modu"]
          }
        }
      }
    ]
  }
}