# Micro-Frontend Mağaza

Next.js Multi-Zone yapısıyla hazırlanmış, birbirinden bağımsız home ve cart uygulamalarından oluşan örnek mağaza projesidir. Home uygulaması ürün kataloğunu ve ürün detaylarını, cart uygulaması ise tarayıcıda saklanan sepeti sunar.

## Ön koşullar

- Docker Desktop ve Docker Compose v2
- Docker kullanılmayacaksa Node.js 20.9 veya üzeri ve npm

## Docker ile çalıştırma

Önce 3000 ve 3001 portlarını kullanan yerel geliştirme sunucularını durdurun. Ardından repo kökünde aşağıdaki komutu çalıştırın:

```powershell
docker compose up --build
```

Servisler hazır olduğunda mağazayı `http://localhost:3000` adresinden açın. Sepet, kullanıcı akışında `http://localhost:3000/cart` adresindedir.

Containerları durdurmak için:

```powershell
docker compose down
```

Compose iki ayrı servis oluşturur:

| Servis | Host adresi | Amaç |
| --- | --- | --- |
| home | `http://localhost:3000` | Ürün kataloğu, ürün detayı ve Multi-Zone giriş noktası |
| cart | `http://localhost:3001/cart` | Cart uygulamasının bağımsız servis kontrolü |

Home image build edilirken `CART_SERVICE_URL=http://cart:3001` build argümanı kullanılır. Bu değer Next.js rewrite yapılandırmasına build sırasında yazılır. `CART_SERVICE_URL` değiştirildiğinde home image yeniden build edilmelidir. Docker dışındaki varsayılan değer `http://localhost:3001` olarak kalır.

## Docker olmadan çalıştırma

Bağımlılıkları uygulama bazında kurun:

```powershell
npm.cmd --prefix apps/home ci
npm.cmd --prefix apps/cart ci
```

İki ayrı PowerShell terminali açın. İlk terminalde:

```powershell
npm.cmd --prefix apps/home run dev
```

İkinci terminalde:

```powershell
npm.cmd --prefix apps/cart run dev
```

Her iki uygulama aynı anda çalışırken mağazayı `http://localhost:3000` adresinden kullanın. Home uygulaması `/cart` ve altındaki istekleri cart uygulamasına yönlendirir.

## Sepet ve origin davranışı

Sepet verisi tarayıcının localStorage alanında tutulur. localStorage origin'e bağlıdır ve port numarası origin'in bir parçasıdır. Bu nedenle `http://localhost:3000/cart` ile `http://localhost:3001/cart` farklı localStorage alanları kullanır.

Ortak mağaza ve sepet akışı `http://localhost:3000` ile `http://localhost:3000/cart` üzerinden test edilmelidir. `http://localhost:3001/cart` yalnızca cart servisinin bağımsız olarak çalıştığını doğrulamak içindir. `http://localhost:3001/` adresinin 404 döndürmesi, cart uygulamasının basePath değerinin `/cart` olması nedeniyle beklenen davranıştır.

## Kontrol adımları

1. `http://localhost:3000` adresinde ürün listesinin açıldığını doğrulayın.
2. Bir ürün detayına gidip ürünü iki kez sepete ekleyin.
3. `http://localhost:3000/cart` adresine geçip ürün adını, birim fiyatı, adedi ve toplamı kontrol edin.
4. Sayfayı yenileyip sepetin korunduğunu doğrulayın.
5. Ürünü silip boş sepet görünümünü kontrol edin.
6. `http://localhost:3001/cart` adresinin cart servisini bağımsız olarak açtığını doğrulayın.

## Uygulama bazında kalite kontrolleri

```powershell
npm.cmd --prefix apps/home run lint
npm.cmd --prefix apps/home run typecheck
npm.cmd --prefix apps/home run build

npm.cmd --prefix apps/cart run lint
npm.cmd --prefix apps/cart run typecheck
npm.cmd --prefix apps/cart run build
```
