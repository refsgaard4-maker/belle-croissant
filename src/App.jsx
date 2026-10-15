
import React, { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Круассан классический",
    category: "Круассаны",
    price: 890,
    tag: "Бестселлер",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=85",
    description: "Золотистая корочка и нежное французское тесто",
  },
  {
    id: 2,
    name: "Pain au Chocolat",
    category: "Круассаны",
    price: 1190,
    tag: "Популярное",
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=900&q=85",
    description: "Воздушная выпечка с насыщенным шоколадом",
  },
  {
    id: 3,
    name: "Фисташковый десерт",
    category: "Десерты",
    price: 1690,
    tag: "Новинка",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=85",
    description: "Нежный крем и ароматная фисташка",
  },
  {
    id: 4,
    name: "Французский багет",
    category: "Хлеб",
    price: 790,
    tag: "Свежий",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=900&q=85",
    description: "Хрустящий багет на натуральной закваске",
  },
  {
    id: 5,
    name: "Клубничный тарт",
    category: "Десерты",
    price: 1890,
    tag: "Любимый",
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=900&q=85",
    description: "Песочная основа, крем и свежие ягоды",
  },
  {
    id: 6,
    name: "Капучино",
    category: "Напитки",
    price: 1090,
    tag: "Классика",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=900&q=85",
    description: "Ароматный эспрессо с нежной молочной пеной",
  },
];

const categories = ["Все", "Круассаны", "Десерты", "Хлеб", "Напитки"];

const money = (value) => value.toLocaleString("ru-RU") + " ₸";

function App() {
  const [category, setCategory] = useState("Все");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`${product.name} добавлен в корзину`);
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id ? { ...x, qty: x.qty + delta } : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const totalCount = cart.reduce((sum, x) => sum + x.qty, 0);
  const totalPrice = cart.reduce((sum, x) => sum + x.price * x.qty, 0);

  const visibleProducts = products.filter(
    (p) => category === "Все" || p.category === category
  );

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const order = () => {
    if (!cart.length) return;
    const lines = cart.map(
      (p) => `${p.name} — ${p.qty} шт. (${money(p.price * p.qty)})`
    );
    const text = [
      "Здравствуйте! Хочу оформить заказ:",
      "",
      ...lines,
      "",
      `Итого: ${money(totalPrice)}`,
    ].join("\n");
    navigator.clipboard?.writeText(text)
      .then(() => setToast("Заказ скопирован! Отправьте его пекарне."))
      .catch(() => setToast("Не удалось скопировать заказ."));
  };

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="container header-inner">
          <a className="logo" href="#home" onClick={() => setMenuOpen(false)}>
            <span className="logo-icon">✦</span>
            <span>
              BELLE <em>CROISSANT</em>
              <small>ARTISAN BOULANGERIE</small>
            </span>
          </a>

          <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Главная</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>О нас</a>
            <a href="#menu" onClick={() => setMenuOpen(false)}>Меню</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Галерея</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Контакты</a>
          </nav>

          <div className="header-actions">
            <button className="cart-trigger" onClick={() => setCartOpen(true)}>
              <span>Корзина</span>
              <span className="bag-icon">♧</span>
              <span className="cart-count">{totalCount}</span>
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-eyebrow">
            <span className="line" />
            МАЛЕНЬКИЙ КУСОЧЕК ПАРИЖА
          </div>

          <h1>
            Искусство
            <br />
            <em>наслаждаться</em>
            <br />
            каждым утром.
          </h1>

          <p>
            Свежая французская выпечка, ароматный кофе
            и особенная атмосфера, в которую хочется
            возвращаться снова и снова.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-gold" onClick={() => goTo("menu")}>
              Смотреть меню <span>↗</span>
            </button>
            <button className="btn btn-outline" onClick={() => goTo("about")}>
              Наша история <span>→</span>
            </button>
          </div>

          <div className="hero-bottom">
            <span>01 / 03</span>
            <span className="hero-bottom-line" />
            <span>СОЗДАНО С ЛЮБОВЬЮ</span>
          </div>
        </div>
        <div className="hero-side">BONJOUR • BON APPÉTIT • BELLE CROISSANT</div>
      </section>

      {/* MINI FEATURES */}
      <section className="features">
        <div className="container features-grid">
          <div className="feature">
            <span className="feature-icon">✧</span>
            <div><strong>Каждый день свежее</strong><small>Выпекаем с раннего утра</small></div>
          </div>
          <div className="feature">
            <span className="feature-icon">♡</span>
            <div><strong>С любовью к деталям</strong><small>Авторские рецепты и традиции</small></div>
          </div>
          <div className="feature">
            <span className="feature-icon">♨</span>
            <div><strong>Особенный аромат</strong><small>Настоящий вкус Франции</small></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section-pad" id="about">
        <div className="container about-grid">
          <div className="about-images">
            <img
              className="about-img-main"
              src="https://images.unsplash.com/photo-1608198093002-ad4e005484df?w=1000&q=85"
              alt="Свежая выпечка"
            />
            <img
              className="about-img-small"
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=650&q=85"
              alt="Французский хлеб"
            />
            <div className="about-stamp">
              <span>✦</span>
              FAIT AVEC
              <br />
              AMOUR
            </div>
          </div>

          <div className="about-text">
            <div className="section-label">01 — НАША ФИЛОСОФИЯ</div>
            <h2 className="section-title">
              Вкус, который
              <br />
              <em>рассказывает</em>
              <br />
              историю.
            </h2>
            <div className="gold-divider" />
            <p>
              Belle Croissant — это больше, чем просто пекарня.
              Это место, где французские традиции встречаются
              с современным искусством выпечки.
            </p>
            <p>
              Мы верим, что счастье состоит из маленьких моментов:
              утреннего кофе, тёплого круассана и неспешных
              разговоров с близкими.
            </p>
            <div className="about-signature">Avec amour, Belle Croissant ♡</div>
            <button className="text-link" onClick={() => goTo("menu")}>
              ПОПРОБОВАТЬ НАШУ ВЫПЕЧКУ <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <div className="quote-band">
        <div className="container">
          <span>✦</span>
          <p>La vie est belle avec un croissant.</p>
          <span>✦</span>
        </div>
      </div>

      {/* MENU */}
      <section className="menu-section section-pad" id="menu">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">02 — СОЗДАНО ДЛЯ ВАС</div>
            <h2 className="section-title">
              Наши маленькие <em>шедевры</em>
            </h2>
            <p>Немного французского счастья в каждом кусочке.</p>
          </div>

          <div className="categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category ${category === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="products">
            {visibleProducts.map((product) => (
              <article className="product" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-tag">{product.tag}</span>
                  <button
                    className="product-quick-add"
                    onClick={() => addToCart(product)}
                    title="Добавить в корзину"
                    aria-label={`Добавить ${product.name}`}
                  >
                    +
                  </button>
                </div>
                <div className="product-info">
                  <small>{product.category.toUpperCase()}</small>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-bottom">
                    <strong>{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)}>
                      В корзину <span>↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL */}
      <section className="special">
        <div className="special-image" />
        <div className="special-shade" />
        <div className="container special-content">
          <span className="section-label">МАЛЕНЬКИЕ РАДОСТИ</span>
          <h2>
            Счастье пахнет
            <br />
            <em>свежей выпечкой.</em>
          </h2>
          <p>
            Остановите мгновение. Возьмите любимый напиток
            и подарите себе немного удовольствия.
          </p>
          <button className="btn btn-gold" onClick={() => goTo("menu")}>
            Выбрать что-нибудь вкусное <span>↗</span>
          </button>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section section-pad" id="gallery">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">03 — МОМЕНТЫ СЧАСТЬЯ</div>
            <h2 className="section-title">
              Атмосфера <em>Belle Croissant</em>
            </h2>
            <p>Место, где каждое мгновение становится особенным.</p>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item gallery-large">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1100&q=85" alt="Атмосфера кафе" loading="lazy" />
              <span>НАША АТМОСФЕРА</span>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=85" alt="Кофе" loading="lazy" />
              <span>КОФЕ С ЛЮБОВЬЮ</span>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=800&q=85" alt="Выпечка" loading="lazy" />
              <span>СВЕЖАЯ ВЫПЕЧКА</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="container contact-grid">
          <div>
            <div className="section-label">04 — ДО СКОРОЙ ВСТРЕЧИ</div>
            <h2 className="section-title">
              Заходите
              <br />
              <em>на чашечку кофе.</em>
            </h2>
            <p className="contact-intro">
              Мы всегда рады новым гостям и старым друзьям.
              Каждое утро начинается с чего-то вкусного.
            </p>
            <div className="contact-detail">
              <span>⌖</span>
              <div><strong>Наш город</strong><p>Алматы, Казахстан</p></div>
            </div>
            <div className="contact-detail">
              <span>◷</span>
              <div><strong>Время работы</strong><p>Ежедневно, 08:00 — 22:00</p></div>
            </div>
            <div className="contact-detail">
              <span>✉</span>
              <div><strong>Связаться с нами</strong><p>hello@bellecroissant.kz</p></div>
            </div>
            <small className="demo-note">
              Контактная информация демонстрационная.
            </small>
          </div>
          <div className="contact-image">
            <img
              src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=1000&q=85"
              alt="Кофе и уют"
              loading="lazy"
            />
            <div className="contact-image-note">À bientôt! ♡</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <span className="footer-logo">✦ BELLE <em>CROISSANT</em></span>
            <p>Немного Парижа в каждом дне.</p>
          </div>
          <div className="footer-links">
            <a href="#home">Главная</a>
            <a href="#about">О нас</a>
            <a href="#menu">Меню</a>
            <a href="#contact">Контакты</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} BELLE CROISSANT. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED WITH ♡</span>
        </div>
      </footer>

      {/* CART */}
      {cartOpen && (
        <div className="cart-overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-panel" onMouseDown={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div>
                <small>ВАШ ВЫБОР</small>
                <h2>Корзина <em>♡</em></h2>
              </div>
              <button className="close-cart" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span>🥐</span>
                  <h3>Здесь пока пусто</h3>
                  <p>Самое время выбрать что-нибудь вкусное.</p>
                  <button className="btn btn-gold" onClick={() => {
                    setCartOpen(false);
                    goTo("menu");
                  }}>
                    Перейти в меню ↗
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{money(item.price)}</p>
                      <div className="qty-control">
                        <button onClick={() => changeQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <strong>{money(item.price * item.qty)}</strong>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-summary">
                <div><span>Товаров</span><span>{totalCount}</span></div>
                <div className="cart-total"><strong>Итого</strong><strong>{money(totalPrice)}</strong></div>
                <button className="btn btn-gold checkout" onClick={order}>
                  Скопировать заказ ↗
                </button>
                <small>Демонстрационный сайт: оплата и доставка не подключены.</small>
              </div>
            )}
          </aside>
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #30271f;
  background: #fbf8f3;
  font-synthesis: none;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; }
body, button, a { -webkit-tap-highlight-color: transparent; }
button { font-family: inherit; cursor: pointer; }
button:focus-visible, a:focus-visible { outline: 2px solid #bf9154; outline-offset: 4px; }
a { color: inherit; text-decoration: none; }
img { display: block; width: 100%; object-fit: cover; }
.container { width: min(1200px, calc(100% - 80px)); margin: auto; }
section { scroll-margin-top: 90px; }
.section-pad { padding: 125px 0; }
.section-label { font-size: 11px; letter-spacing: 3px; font-weight: 700; color: #bb915c; margin-bottom: 24px; }
.section-title { font-family: 'Playfair Display', serif; font-size: clamp(37px, 4.5vw, 63px); font-weight: 400; line-height: 1.2; letter-spacing: -1.8px; margin: 0; }
.section-title em { color: #b68a56; font-weight: 400; }
.section-heading { text-align: center; margin-bottom: 50px; }
.section-heading p { color: #8c8176; margin-top: 18px; line-height: 1.7; }

/* HEADER */
.header { position: absolute; z-index: 50; top: 0; left: 0; width: 100%; color: white; transition: all .3s; }
.header-scrolled { position: fixed; background: rgba(35,29,25,.97); box-shadow: 0 8px 35px #0002; animation: slideDown .3s ease; }
.header-inner { height: 100px; display: flex; align-items: center; justify-content: space-between; gap: 22px; }
.logo { display: flex; gap: 12px; align-items: center; font-family: 'Playfair Display',serif; font-size: 19px; letter-spacing: 1px; font-weight: 600; white-space: nowrap; }
.logo em { font-weight: 400; color: #d9b886; }
.logo small { display: block; font: 8px 'DM Sans',sans-serif; letter-spacing: 3.2px; margin-top: 6px; opacity: .8; }
.logo-icon { color: #e5bd80; font-size: 33px; }
.nav { display: flex; gap: 30px; }
.nav a { font-size: 12px; font-weight: 500; opacity: .8; transition: .3s; }
.nav a:hover { opacity: 1; color: #e1b679; }
.header-actions { display: flex; align-items: center; gap: 12px; }
.cart-trigger { border: 1px solid #ffffff55; background: transparent; color: #fff; padding: 12px 17px; display: flex; align-items: center; gap: 12px; font-size: 12px; transition: .3s; }
.cart-trigger:hover { background: #ffffff20; }
.bag-icon { font-size: 18px; }
.cart-count { background: #c49a66; color: white; border-radius: 50%; width: 21px; height: 21px; display: grid; place-items: center; font-size: 11px; }
.mobile-toggle { display: none; background: transparent; border: 0; color: white; font-size: 25px; }

/* HERO */
.hero { height: min(850px, 100svh); min-height: 650px; position: relative; display: flex; align-items: center; color: white; overflow: hidden; background: #30271f; }
.hero-photo { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1608198093002-ad4e005484df?w=2000&q=90') center 50%/cover; animation: heroZoom 15s ease-in-out infinite alternate; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(23,18,15,.86) 0%,rgba(23,18,15,.68) 43%,rgba(23,18,15,.13) 100%),linear-gradient(0deg,#20161066,transparent 30%); }
.hero-content { position: relative; z-index: 1; padding-top: 80px; }
.hero-eyebrow { font-size: 11px; letter-spacing: 3px; color: #e6c398; display: flex; align-items: center; gap: 16px; margin-bottom: 30px; animation: fadeUp .8s both; }
.line { width: 35px; height: 1px; background: #e6c398; }
.hero h1 { font-family: 'Playfair Display',serif; font-size: clamp(55px, 6.3vw, 98px); font-weight: 400; line-height: 1.12; letter-spacing: -3px; margin: 0; animation: fadeUp 1s .1s both; }
.hero h1 em { color: #e0b47d; font-weight: 400; }
.hero-content > p { max-width: 460px; font-size: 15px; line-height: 2; color: #ece1d4; margin: 35px 0; animation: fadeUp 1s .2s both; }
.hero-buttons { display: flex; flex-wrap: wrap; gap: 13px; animation: fadeUp 1s .3s both; }
.btn { display: inline-flex; justify-content: center; align-items: center; gap: 32px; min-height: 56px; padding: 0 26px; border: 1px solid transparent; font-size: 12px; font-weight: 700; letter-spacing: .35px; transition: .3s; }
.btn span { font-size: 19px; font-weight: 400; }
.btn-gold { background: #c59b66; color: #fff; }
.btn-gold:hover { background: #ae7d42; transform: translateY(-3px); box-shadow: 0 12px 28px #0002; }
.btn-outline { color: white; background: transparent; border-color: #ffffff75; }
.btn-outline:hover { background: #ffffff20; }
.hero-bottom { margin-top: 85px; display: flex; align-items: center; gap: 18px; font-size: 10px; letter-spacing: 2px; opacity: .7; }
.hero-bottom-line { height: 1px; width: 70px; background: #fff; opacity: .6; }
.hero-side { position: absolute; right: 25px; top: 50%; writing-mode: vertical-rl; font-size: 9px; letter-spacing: 4px; color: #fff9; transform: translateY(-50%); }

/* FEATURES */
.features { background: #f1e9df; border-bottom: 1px solid #e8dcd0; }
.features-grid { display: grid; grid-template-columns: repeat(3,1fr); }
.feature { padding: 36px 25px; display: flex; align-items: center; justify-content: center; gap: 18px; border-right: 1px solid #dfd2c3; }
.feature:last-child { border: 0; }
.feature-icon { font-family: serif; font-size: 40px; color: #ae895f; }
.feature strong { display: block; font-family: 'Playfair Display',serif; font-size: 17px; font-weight: 500; }
.feature small { display: block; font-size: 11px; color: #9c8f80; margin-top: 6px; }

/* ABOUT */
.about { background: #fbf8f3; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 110px; align-items: center; }
.about-images { position: relative; padding: 0 65px 75px 0; }
.about-img-main { height: 580px; filter: saturate(.85); }
.about-img-small { position: absolute; width: 51%; height: 265px; right: 0; bottom: 0; border: 10px solid #fbf8f3; }
.about-stamp { position: absolute; top: 35px; right: 0; width: 128px; height: 128px; border-radius: 50%; background: #bd955f; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font: 12px 'Playfair Display',serif; letter-spacing: 2px; line-height: 1.8; transform: rotate(12deg); box-shadow: 0 8px 25px #0002; }
.about-stamp span { font-size: 27px; line-height: 1.2; }
.gold-divider { width: 45px; height: 2px; background: #c29a69; margin: 32px 0; }
.about-text > p { font-size: 14px; line-height: 2.1; color: #83786d; margin-bottom: 21px; }
.about-signature { color: #b28a58; font-family: 'Playfair Display',serif; font-style: italic; font-size: 23px; margin-top: 30px; }
.text-link { border: 0; background: none; padding: 10px 0; border-bottom: 1px solid #b59165; margin-top: 25px; color: #85603d; font-size: 10px; letter-spacing: 1.2px; font-weight: 700; }
.text-link span { padding-left: 20px; font-size: 17px; }

/* QUOTE */
.quote-band { background: #30271f; padding: 35px 0; color: #e8cb9f; }
.quote-band .container { display: flex; justify-content: center; align-items: center; gap: 30px; }
.quote-band p { font: italic 26px 'Playfair Display',serif; text-align: center; margin: 0; }
.quote-band span { font-size: 20px; }

/* MENU */
.menu-section { background: #f7f1e9; }
.categories { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 45px; }
.category { background: transparent; border: 1px solid #dfd2c1; color: #72665b; padding: 13px 25px; font-size: 12px; transition: .3s; }
.category:hover, .category.active { background: #342b24; color: #fff; border-color: #342b24; }
.products { display: grid; grid-template-columns: repeat(3,1fr); gap: 29px; }
.product { background: #fff; transition: transform .35s, box-shadow .35s; overflow: hidden; }
.product:hover { transform: translateY(-8px); box-shadow: 0 20px 40px #4d382012; }
.product-image-wrap { position: relative; height: 270px; overflow: hidden; background: #eee4da; }
.product-image-wrap img { height: 100%; transition: transform .7s; }
.product:hover img { transform: scale(1.08); }
.product-tag { position: absolute; top: 16px; left: 16px; padding: 9px 14px; background: #faf6ee; color: #755a3c; font-size: 10px; }
.product-quick-add { position: absolute; bottom: 15px; right: 15px; width: 45px; height: 45px; border: 0; background: #fff; color: #5c4735; font-size: 26px; transition: .3s; }
.product-quick-add:hover { background: #b78c56; color: #fff; }
.product-info { padding: 25px; }
.product-info small { color: #ba9163; font-size: 9px; letter-spacing: 2px; }
.product-info h3 { font: 500 22px 'Playfair Display',serif; margin: 10px 0; }
.product-info > p { color: #968a7e; font-size: 12px; line-height: 1.8; min-height: 43px; }
.product-bottom { border-top: 1px solid #eee8e1; padding-top: 20px; margin-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.product-bottom strong { font-size: 17px; font-weight: 600; color: #896640; }
.product-bottom button { border: 0; background: transparent; color: #826b51; font-size: 11px; font-weight: 600; }
.product-bottom button:hover { color: #c39356; }
.product-bottom button span { padding-left: 8px; }

/* SPECIAL */
.special { min-height: 525px; position: relative; background: #29221c; display: flex; align-items: center; color: white; }
.special-image { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&q=85') center/cover; }
.special-shade { position: absolute; inset: 0; background: linear-gradient(90deg,#241b16f2,#241b16b3 54%,#241b1633); }
.special-content { position: relative; z-index: 1; padding: 75px 0; }
.special h2 { font: 400 clamp(40px,5vw,68px)/1.2 'Playfair Display',serif; margin: 20px 0; }
.special h2 em { color: #e3bb87; }
.special p { max-width: 440px; font-size: 14px; line-height: 2; color: #e4d6c6; margin-bottom: 30px; }

/* GALLERY */
.gallery-section { background: #fbf8f3; }
.gallery-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 15px; }
.gallery-item { height: 370px; position: relative; overflow: hidden; background: #d8c5ac; }
.gallery-item img { height: 100%; transition: transform .7s; }
.gallery-item:hover img { transform: scale(1.08); }
.gallery-item::after { content: ''; position: absolute; inset: 55% 0 0; background: linear-gradient(transparent,#0008); }
.gallery-item span { position: absolute; z-index: 1; bottom: 24px; left: 24px; color: white; font-size: 10px; letter-spacing: 2px; font-weight: 700; }

/* CONTACT */
.contact { background: #f1e9df; padding: 115px 0; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
.contact-intro { max-width: 400px; color: #817569; font-size: 14px; line-height: 2; margin: 28px 0 40px; }
.contact-detail { display: flex; align-items: flex-start; gap: 22px; margin: 24px 0; }
.contact-detail > span { color: #b89160; font-size: 27px; width: 26px; text-align: center; }
.contact-detail strong { font-size: 13px; font-weight: 600; }
.contact-detail p { color: #8c7e70; font-size: 12px; margin: 7px 0 0; }
.contact-image { position: relative; }
.contact-image img { height: 540px; }
.contact-image-note { position: absolute; bottom: -20px; left: -25px; background: #bc935f; color: white; padding: 24px 32px; font: italic 22px 'Playfair Display',serif; }
.demo-note { display: block; color: #988677; font-size: 11px; margin-top: 25px; }

/* FOOTER */
.footer { background: #2b241f; color: #f0e5da; padding: 65px 0 25px; }
.footer-top { display: flex; justify-content: space-between; gap: 35px; align-items: center; padding-bottom: 50px; border-bottom: 1px solid #ffffff20; }
.footer-logo { font: 23px 'Playfair Display',serif; }
.footer-logo em { color: #cb9e68; }
.footer-brand p { color: #a99d91; font-size: 12px; margin: 15px 0 0; }
.footer-links { display: flex; gap: 25px; flex-wrap: wrap; }
.footer-links a { color: #c4b6a7; font-size: 12px; }
.footer-links a:hover { color: #fff; }
.footer-bottom { display: flex; justify-content: space-between; gap: 15px; padding-top: 30px; color: #988a7c; font-size: 9px; letter-spacing: 1.5px; }

/* CART */
.cart-overlay { position: fixed; inset: 0; z-index: 100; background: #0009; display: flex; justify-content: flex-end; animation: fadeIn .2s; }
.cart-panel { width: min(475px,100%); height: 100%; background: #fbf8f3; display: flex; flex-direction: column; animation: slideLeft .35s ease; box-shadow: -10px 0 50px #0002; }
.cart-header { display: flex; justify-content: space-between; align-items: center; padding: 35px 30px; border-bottom: 1px solid #e8ddd1; }
.cart-header small { color: #b78c5b; font-size: 10px; letter-spacing: 2px; }
.cart-header h2 { font: 32px 'Playfair Display',serif; margin: 8px 0 0; }
.cart-header h2 em { color: #c49a66; }
.close-cart { border: 0; background: transparent; font-size: 21px; color: #554534; }
.cart-items { padding: 22px 30px; overflow-y: auto; flex: 1; }
.empty-cart { text-align: center; padding: 85px 0; }
.empty-cart > span { font-size: 70px; }
.empty-cart h3 { font: 28px 'Playfair Display',serif; }
.empty-cart p { color: #96897b; font-size: 13px; margin-bottom: 30px; }
.cart-item { display: flex; align-items: center; gap: 15px; padding: 19px 0; border-bottom: 1px solid #e9ded1; }
.cart-item img { width: 78px; height: 84px; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-info h3 { font: 16px 'Playfair Display',serif; margin: 0 0 6px; }
.cart-item-info p { color: #a68b6c; font-size: 12px; margin: 0 0 10px; }
.cart-item > strong { font-size: 12px; white-space: nowrap; }
.qty-control { display: flex; align-items: center; width: fit-content; border: 1px solid #dfd0bf; }
.qty-control button { width: 28px; height: 27px; border: 0; background: transparent; font-size: 16px; }
.qty-control span { min-width: 23px; text-align: center; font-size: 12px; }
.cart-summary { padding: 25px 30px 30px; border-top: 1px solid #e4d9cd; }
.cart-summary > div { display: flex; justify-content: space-between; margin-bottom: 15px; color: #817367; font-size: 13px; }
.cart-summary .cart-total { color: #352b23; font-size: 20px; padding-top: 15px; border-top: 1px solid #e4d9cd; }
.checkout { width: 100%; margin-top: 10px; }
.cart-summary > small { display: block; margin-top: 14px; text-align: center; color: #968779; font-size: 10px; line-height: 1.5; }
.toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 200; background: #332b24; color: #fff; padding: 16px 25px; box-shadow: 0 10px 30px #0003; font-size: 12px; max-width: calc(100% - 35px); text-align: center; animation: fadeUp .3s; }

/* ANIMATIONS */
@keyframes fadeUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes heroZoom { from { transform: scale(1); } to { transform: scale(1.08); } }

/* TABLET */
@media (max-width: 1050px) {
  .container { width: min(100% - 50px,1200px); }
  .nav { gap: 15px; }
  .nav a { font-size: 11px; }
  .logo { font-size: 16px; }
  .about-grid, .contact-grid { gap: 45px; }
  .about-img-main { height: 490px; }
  .products { gap: 18px; }
  .product-image-wrap { height: 230px; }
  .product-info { padding: 19px; }
}

/* MOBILE */
@media (max-width: 760px) {
  .container { width: calc(100% - 38px); }
  .section-pad { padding: 75px 0; }
  .header-inner { height: 75px; }
  .logo { font-size: 15px; }
  .logo-icon { font-size: 25px; }
  .logo small { font-size: 7px; letter-spacing: 2px; }
  .mobile-toggle { display: block; }
  .cart-trigger { padding: 9px 11px; }
  .cart-trigger > span:first-child { display: none; }
  .nav { position: absolute; left: 0; right: 0; top: 75px; background: #302720; display: none; padding: 22px; flex-direction: column; gap: 0; }
  .nav-open { display: flex; }
  .nav a { padding: 14px 0; font-size: 14px; border-bottom: 1px solid #ffffff20; }
  .hero { min-height: 710px; height: 93svh; max-height: 900px; }
  .hero-photo { background-position: 60% center; }
  .hero-overlay { background: linear-gradient(90deg,#1b1412de,#1b141280),linear-gradient(0deg,#1b141277,transparent); }
  .hero-content { padding-top: 45px; }
  .hero h1 { font-size: clamp(48px,9vw,75px); letter-spacing: -2px; }
  .hero-content > p { font-size: 13px; max-width: 390px; margin: 25px 0; }
  .hero-eyebrow { font-size: 9px; letter-spacing: 2px; }
  .hero-side { display: none; }
  .hero-bottom { margin-top: 60px; }
  .btn { padding: 0 19px; min-height: 52px; font-size: 11px; gap: 15px; }
  .features-grid { grid-template-columns: 1fr; }
  .feature { justify-content: flex-start; border-right: 0; border-bottom: 1px solid #dfd2c3; padding: 22px 20px; }
  .feature:last-child { border: 0; }
  .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 65px; }
  .about-images { max-width: 560px; }
  .about-img-main { height: 470px; }
  .about-text { order: -1; }
  .section-title { font-size: clamp(37px,8vw,53px); }
  .quote-band p { font-size: 18px; }
  .quote-band .container { gap: 12px; }
  .products { grid-template-columns: repeat(2,1fr); gap: 15px; }
  .product-image-wrap { height: 220px; }
  .product-info h3 { font-size: 18px; }
  .gallery-grid { grid-template-columns: 1fr 1fr; }
  .gallery-large { grid-column: span 2; }
  .gallery-item { height: 260px; }
  .contact-image img { height: 430px; }
  .footer-top, .footer-bottom { flex-direction: column; }
}

@media (max-width: 480px) {
  .hero h1 { font-size: 47px; }
  .hero-buttons { gap: 9px; }
  .hero-buttons .btn { padding: 0 14px; gap: 9px; }
  .about-img-main { height: 380px; }
  .about-img-small { height: 180px; border-width: 6px; }
  .about-stamp { width: 95px; height: 95px; font-size: 9px; }
  .products { grid-template-columns: 1fr; }
  .product-image-wrap { height: 290px; }
  .product-info { padding: 22px; }
  .product-info h3 { font-size: 22px; }
  .category { padding: 11px 16px; font-size: 11px; }
  .gallery-grid { gap: 9px; }
  .gallery-item { height: 190px; }
  .gallery-large { height: 280px; }
  .gallery-item span { font-size: 8px; left: 12px; bottom: 12px; }
  .contact-image img { height: 350px; }
  .footer-links { gap: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
}
`;

export default App;
