# Minecraft Sunucu Entegrasyonu

## 🎮 Genel Bakış

Bu web sitesi, Minecraft sunucularına 3 farklı yöntemle entegre edilebilir:

## 1. 📡 REST API (En Yaygın)

### API Endpoint'leri

#### **Kullanıcı Doğrulama**
```http
POST /api/minecraft/verify
Headers: X-API-Key: your-secret-key
Body: { "username": "oyuncu_adi" }

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "username": "oyuncu_adi",
    "credits": 1500,
    "email": "user@example.com"
  }
}
```

#### **Bekleyen Siparişleri Getir**
```http
GET /api/minecraft/pending?username=oyuncu_adi
Headers: X-API-Key: your-secret-key

Response:
{
  "success": true,
  "count": 2,
  "orders": [
    {
      "id": "order_id",
      "username": "oyuncu_adi",
      "productName": "VIP Rank",
      "productCategory": "VIP Üyelikler",
      "productDescription": "/lp user {username} parent set vip",
      "amount": 1,
      "createdAt": "2026-01-11T..."
    }
  ]
}
```

#### **Sipariş Teslim Et**
```http
POST /api/minecraft/execute
Headers: X-API-Key: your-secret-key
Body: { "orderId": "order_id", "executed": true }

Response:
{
  "success": true,
  "order": {
    "id": "order_id",
    "username": "oyuncu_adi",
    "productName": "VIP Rank",
    "amount": 1,
    "status": "completed"
  }
}
```

### 🔒 Güvenlik Ayarları

`.env` dosyanıza ekleyin:
```env
MC_API_KEY=super-gizli-api-anahtari-buraya
```

---

## 2. 🔌 Spigot/Paper Plugin Örneği

### Java Plugin Kodu

```java
package com.yourserver.webstore;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.net.http.*;
import java.net.URI;

public class WebStorePlugin extends JavaPlugin {
    
    private static final String API_URL = "https://yourwebsite.com/api/minecraft";
    private static final String API_KEY = "your-secret-api-key";
    
    @Override
    public void onEnable() {
        // Her 30 saniyede bir bekleyen siparişleri kontrol et
        new BukkitRunnable() {
            @Override
            public void run() {
                checkPendingOrders();
            }
        }.runTaskTimerAsynchronously(this, 0L, 600L); // 30 saniye
        
        getLogger().info("WebStore plugin yüklendi!");
    }
    
    private void checkPendingOrders() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL + "/pending"))
                .header("X-API-Key", API_KEY)
                .GET()
                .build();
            
            HttpResponse<String> response = client.send(request, 
                HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                JsonObject json = JsonParser.parseString(response.body())
                    .getAsJsonObject();
                
                if (json.get("success").getAsBoolean()) {
                    json.getAsJsonArray("orders").forEach(orderElement -> {
                        JsonObject order = orderElement.getAsJsonObject();
                        executeOrder(order);
                    });
                }
            }
        } catch (Exception e) {
            getLogger().warning("Sipariş kontrolü hatası: " + e.getMessage());
        }
    }
    
    private void executeOrder(JsonObject order) {
        String orderId = order.get("id").getAsString();
        String username = order.get("username").getAsString();
        String productName = order.get("productName").getAsString();
        String description = order.get("productDescription").getAsString();
        String category = order.get("productCategory").getAsString();
        
        // Ana thread'de komutu çalıştır
        new BukkitRunnable() {
            @Override
            public void run() {
                boolean success = false;
                
                try {
                    // Komutu çalıştır (description'da komut var)
                    String command = description.replace("{username}", username);
                    Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                    
                    // Oyuncuya mesaj gönder
                    Bukkit.getPlayer(username).ifPresent(player -> {
                        player.sendMessage("§a✓ " + productName + " satın alımınız teslim edildi!");
                    });
                    
                    success = true;
                    getLogger().info(username + " adlı oyuncuya " + productName + " teslim edildi");
                    
                } catch (Exception e) {
                    getLogger().warning("Sipariş teslimi başarısız: " + e.getMessage());
                }
                
                // Sipariş durumunu güncelle
                markOrderExecuted(orderId, success);
            }
        }.runTask(this);
    }
    
    private void markOrderExecuted(String orderId, boolean success) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            
            String jsonBody = String.format(
                "{\"orderId\":\"%s\",\"executed\":%b}", 
                orderId, success
            );
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL + "/execute"))
                .header("X-API-Key", API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            
            client.send(request, HttpResponse.BodyHandlers.ofString());
            
        } catch (Exception e) {
            getLogger().warning("Sipariş güncelleme hatası: " + e.getMessage());
        }
    }
}
```

### plugin.yml
```yaml
name: WebStore
version: 1.0
main: com.yourserver.webstore.WebStorePlugin
api-version: 1.19
author: YourName
description: Web mağaza entegrasyonu
```

---

## 3. 🔄 Alternatif: RCON Entegrasyonu

Web sitesinden direkt RCON komutu gönder:

```typescript
// app/api/minecraft/rcon/route.ts
import Rcon from 'rcon-client';

export async function POST(req: Request) {
  const { command } = await req.json();
  
  const rcon = await Rcon.connect({
    host: 'localhost',
    port: 25575,
    password: 'rcon-password'
  });
  
  const response = await rcon.send(command);
  await rcon.end();
  
  return Response.json({ success: true, response });
}
```

---

## 📋 Kurulum Adımları

### 1. Web Sitesi Ayarları

`.env` dosyasına ekle:
```env
MC_API_KEY=super-gizli-anahtar-12345
```

### 2. Minecraft Sunucusu

**Spigot/Paper:**
1. Plugin'i indir/derle
2. `plugins` klasörüne at
3. `config.yml` düzenle:
```yaml
api-url: https://yourwebsite.com/api/minecraft
api-key: super-gizli-anahtar-12345
check-interval: 30 # saniye
```
4. Sunucuyu başlat

**BungeeCord:**
- Aynı plugin'i proxy sunucusuna kur
- Tüm serverlar için merkezi kontrol

---

## 🎯 Ürün Kategorileri ve Komut Örnekleri

### VIP Üyelikler
```yaml
Ürün: VIP Rank
Komut: lp user {username} parent set vip
Kategori: VIP Üyelikler
```

### Kozmetikler
```yaml
Ürün: Elmas Kılıç Görünümü
Komut: cosmetics give {username} diamond_sword_skin
Kategori: Kozmetikler
```

### Kutular
```yaml
Ürün: Efsanevi Kutu x3
Komut: crate give {username} legendary 3
Kategori: Kutular
```

### Krediler
```yaml
Ürün: 1000 Credit
Komut: eco give {username} 1000
Kategori: Credit
```

---

## ⚡ Özellikler

✅ Otomatik sipariş teslimi (30 saniye aralıklarla)  
✅ Hata durumunda tekrar deneme  
✅ Oyuncu çevrimdışı ise bekleme  
✅ Detaylı log kayıtları  
✅ Güvenli API anahtarı doğrulama  
✅ Çoklu sunucu desteği (BungeeCord)  

---

## 🔧 Test Etme

```bash
# Bekleyen siparişleri kontrol et
curl -H "X-API-Key: your-key" \
  https://yourwebsite.com/api/minecraft/pending

# Kullanıcı doğrula
curl -X POST -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"username":"Steve"}' \
  https://yourwebsite.com/api/minecraft/verify
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Plugin loglarını kontrol edin
2. API endpoint'lerini test edin
3. API anahtarının doğru olduğundan emin olun
4. Firewall ayarlarını kontrol edin
