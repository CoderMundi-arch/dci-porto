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

});
