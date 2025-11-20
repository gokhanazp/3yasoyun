#!/usr/bin/env python3
"""
Google Play Games için logo ve özellik grafiği oluşturur
- Logo: 600x400 şeffaf PNG
- Özellik Grafiği: 1920x1080 PNG (16:9)
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Renkler
GRADIENT_START = (102, 126, 234)  # #667eea
GRADIENT_END = (118, 75, 162)     # #764ba2
WHITE = (255, 255, 255, 255)

def create_gradient_background(width, height):
    """Gradient arka plan oluşturur"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    for y in range(height):
        # Gradient hesaplama
        ratio = y / height
        r = int(GRADIENT_START[0] * (1 - ratio) + GRADIENT_END[0] * ratio)
        g = int(GRADIENT_START[1] * (1 - ratio) + GRADIENT_END[1] * ratio)
        b = int(GRADIENT_START[2] * (1 - ratio) + GRADIENT_END[2] * ratio)
        
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def add_decorative_circles(image):
    """Dekoratif daireler ekler"""
    draw = ImageDraw.Draw(image, 'RGBA')
    width, height = image.size
    
    # Daireler (renk, x, y, radius)
    circles = [
        ((255, 215, 0, 38), -100, -100, 300),      # Altın
        ((255, 107, 157, 38), width - 100, height + 50, 250),  # Pembe
        ((74, 222, 128, 38), width + 50, 50, 200),  # Yeşil
        ((96, 165, 250, 38), 200, height - 100, 175),  # Mavi
        ((251, 191, 36, 38), width // 2, height // 2 + 100, 150),  # Sarı
    ]
    
    for color, x, y, radius in circles:
        draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)
    
    return image

def create_logo_600x400(logo_path, output_path):
    """600x400 şeffaf PNG logo oluşturur"""
    print("📦 Logo oluşturuluyor (600x400 şeffaf PNG)...")
    
    # Şeffaf canvas oluştur
    canvas = Image.new('RGBA', (600, 400), (0, 0, 0, 0))
    
    # Logoyu yükle
    if os.path.exists(logo_path):
        logo = Image.open(logo_path)
        
        # RGBA'ya çevir (şeffaflık için)
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Boyutlandır (padding ile)
        padding = 40
        max_width = 600 - (padding * 2)
        max_height = 400 - (padding * 2)
        
        logo.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Merkeze yerleştir
        x = (600 - logo.width) // 2
        y = (400 - logo.height) // 2
        
        canvas.paste(logo, (x, y), logo)
        
        # Kaydet
        canvas.save(output_path, 'PNG', optimize=True)
        print(f"✅ Logo kaydedildi: {output_path}")
        print(f"   Boyut: 600x400 px, Şeffaf PNG")
        
        # Dosya boyutunu kontrol et
        file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
        print(f"   Dosya boyutu: {file_size:.2f} MB (Max: 8 MB)")
    else:
        print(f"❌ Logo bulunamadı: {logo_path}")

def create_feature_graphic_1920x1080(logo_path, output_path):
    """1920x1080 özellik grafiği oluşturur (16:9)"""
    print("\n🎨 Özellik grafiği oluşturuluyor (1920x1080 PNG)...")
    
    # Gradient arka plan
    image = create_gradient_background(1920, 1080)
    
    # Dekoratif daireler ekle
    image = image.convert('RGBA')
    image = add_decorative_circles(image)
    
    # Oyun ikonları (emoji) ekle
    draw = ImageDraw.Draw(image)
    
    # Emoji pozisyonları ve içerikleri
    emojis = [
        ("🎨", 150, 120),
        ("🐶", 1700, 150),
        ("⭐", 200, 900),
        ("🔢", 1750, 920),
        ("🍎", 100, 540),
        ("🎈", 1820, 540),
        ("🖍️", 1500, 350),
    ]
    
    # Logoyu yükle ve merkeze yerleştir
    if os.path.exists(logo_path):
        logo = Image.open(logo_path)
        
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Beyaz kart arka planı
        card_width = 700
        card_height = 500
        card = Image.new('RGBA', (card_width, card_height), (255, 255, 255, 250))
        
        # Logoyu karta yerleştir
        logo.thumbnail((600, 400), Image.Resampling.LANCZOS)
        logo_x = (card_width - logo.width) // 2
        logo_y = (card_height - logo.height) // 2
        card.paste(logo, (logo_x, logo_y), logo)
        
        # Kartı merkeze yerleştir
        card_x = (1920 - card_width) // 2
        card_y = (1080 - card_height) // 2
        image.paste(card, (card_x, card_y), card)
    
    # RGB'ye çevir ve kaydet
    final_image = image.convert('RGB')
    final_image.save(output_path, 'PNG', optimize=True)
    print(f"✅ Özellik grafiği kaydedildi: {output_path}")
    print(f"   Boyut: 1920x1080 px (16:9), PNG")
    
    # Dosya boyutunu kontrol et
    file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
    print(f"   Dosya boyutu: {file_size:.2f} MB (Max: 15 MB)")

def main():
    print("🎮 Google Play Games Assets Oluşturucu\n")
    
    logo_path = "assets/0-3yaslogo.png"
    
    # 1. Logo oluştur (600x400 şeffaf PNG)
    create_logo_600x400(logo_path, "play-games-logo-600x400.png")
    
    # 2. Özellik grafiği oluştur (1920x1080 PNG)
    create_feature_graphic_1920x1080(logo_path, "play-games-feature-1920x1080.png")
    
    print("\n✅ Tüm dosyalar hazır!")
    print("\n📋 Play Console'a yükle:")
    print("   1. play-games-logo-600x400.png (Logo)")
    print("   2. play-games-feature-1920x1080.png (Özellik Grafiği)")

if __name__ == "__main__":
    main()

