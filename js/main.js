// Navegação responsiva e interações leves do site DCI
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.textContent = opened ? "×" : "☰";
    });
  }


  // Submenu Institucional: alterna por clique e fecha ao clicar fora ou pressionar Escape.
  const institutionalDropdown = document.querySelector(".site-header-modern .nav-dropdown");
  const institutionalToggle = institutionalDropdown?.querySelector(".dropdown-toggle");
  if (institutionalDropdown && institutionalToggle) {
    const setDropdownOpen = (open) => {
      institutionalDropdown.classList.toggle("is-open", open);
      institutionalToggle.setAttribute("aria-expanded", String(open));
    };
    institutionalToggle.addEventListener("click", () => {
      setDropdownOpen(!institutionalDropdown.classList.contains("is-open"));
    });
    document.addEventListener("pointerdown", (event) => {
      if (!institutionalDropdown.contains(event.target)) setDropdownOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && institutionalDropdown.classList.contains("is-open")) {
        setDropdownOpen(false);
        institutionalToggle.focus();
      }
    });
    institutionalDropdown.querySelectorAll(".dropdown-menu a").forEach(link => {
      link.addEventListener("click", () => setDropdownOpen(false));
    });
    if (toggle && nav) toggle.addEventListener("click", () => setDropdownOpen(false));
  }

  // Destaca automaticamente a página atual no menu.
  const page = document.body.classList.contains("page-home") ? "home"
    : document.body.classList.contains("page-about") ? "about"
    : document.body.classList.contains("page-blog") ? "blog"
    : document.body.classList.contains("page-contact") ? "contact"
    : document.body.classList.contains("page-infrastructure") ? "infrastructure" : "";
  if (page) {
    const active = document.querySelector(`.main-nav [data-page="${page}"]`);
    if (active) active.classList.add("active");
  }

  // Filtros e pesquisa do blog.
  const cards = [...document.querySelectorAll(".blog-card")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const search = document.querySelector("#article-search");
  const noResults = document.querySelector("#no-results");
  let category = "all";
  const updateArticles = () => {
    const term = (search?.value || "").trim().toLocaleLowerCase("pt");
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesTerm = !term || card.textContent.toLocaleLowerCase("pt").includes(term);
      const show = matchesCategory && matchesTerm;
      card.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
  };
  filterButtons.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    updateArticles();
  }));
  search?.addEventListener("input", updateArticles);

  // Demonstração front-end: o formulário precisa de backend/serviço para enviar mensagens.
  const contactForm = document.querySelector("#contact-form");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = contactForm.querySelector(".form-feedback");
    if (!contactForm.reportValidity()) return;
    feedback.textContent = "Obrigado pelo seu contacto. Para ativar o envio, ligue este formulário ao serviço de e-mail da clínica.";
    contactForm.reset();
  });

  const newsletter = document.querySelector("#newsletter-form");
  newsletter?.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.querySelector(".newsletter-feedback");
    if (!newsletter.reportValidity()) return;
    feedback.textContent = "Obrigado! A subscrição ficará ativa após integração com a plataforma de e-mail.";
    newsletter.reset();
  });

  // Carrossel da galeria de infraestrutura.
  const track = document.querySelector(".infra-track");
  const slides = [...document.querySelectorAll(".infra-slide")];
  const dotsWrap = document.querySelector(".gallery-dots");
  if (track && slides.length && dotsWrap) {
    let index = 0;
    const prev = document.querySelector(".gallery-prev");
    const next = document.querySelector(".gallery-next");
    const visibleCount = () => window.matchMedia("(max-width: 680px)").matches ? 1
      : window.matchMedia("(max-width: 950px)").matches ? 2 : 3;
    const maxIndex = () => Math.max(0, slides.length - visibleCount());
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ver conjunto ${i + 1}`);
      dot.addEventListener("click", () => { index = Math.min(i, maxIndex()); render(); });
      dotsWrap.appendChild(dot);
    });
    const render = () => {
      index = Math.max(0, Math.min(index, maxIndex()));
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const width = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * (width + gap)}px)`;
      [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === maxIndex();
    };
    prev?.addEventListener("click", () => { index--; render(); });
    next?.addEventListener("click", () => { index++; render(); });
    window.addEventListener("resize", render);
    render();
  }


  // Animações progressivas ao entrar na área visível; acessível e sem bloqueio de conteúdo.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = [...document.querySelectorAll(
      ".section-title, .intro-strip, .hero-copy, .story-copy, .purpose-card, .service-card, .course-promo, .about-teaser, .mini-blog-grid article, .blog-card, .featured-article, .newsletter, .values-grid > div, .about-banner, .contact-intro, .contact-form, .info-panel, .infra-hero-inner, .infra-intro-grid, .infra-feature-grid article, .infra-slide, .infra-team-grid, .infra-visit-inner"
    )];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });
    targets.forEach((item, index) => {
      item.classList.add("scroll-reveal", "reveal-pending");
      const siblings = item.parentElement ? [...item.parentElement.children].filter(node => node.matches(".service-card, .blog-card, .purpose-card, .infra-feature-grid article, .mini-blog-grid article, .values-grid > div")) : [];
      const position = siblings.indexOf(item);
      if (position >= 0) item.style.setProperty("--reveal-delay", Math.min(position % 4, 3) * 75 + "ms");
      observer.observe(item);
    });
  }

});
