/* =================================================================
   Aço Forte | JavaScript
   Estratégia: o mínimo de JS possível. O CSS já resolve a maior parte
   do site. Aqui ficam apenas interações pontuais que melhoram a UX.
   ================================================================= */
(function () {
  "use strict";

  /* ----- Menu mobile ----- */
  const navToggle = document.getElementById("navToggle");
  const menu = document.getElementById("menu");

  if (navToggle && menu) {
    const abrir = (abrirMenu) => {
      navToggle.setAttribute("aria-expanded", String(abrirMenu));
      navToggle.setAttribute("aria-label", abrirMenu ? "Fechar menu" : "Abrir menu");
      menu.classList.toggle("open", abrirMenu);
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      abrir(!isOpen);
    });

    /* Fecha o menu ao clicar em qualquer link interno */
    menu.addEventListener("click", (event) => {
      const alvo = event.target.closest("a");
      if (alvo && alvo.getAttribute("href") && alvo.getAttribute("href").startsWith("#")) {
        abrir(false);
      }
    });

    /* Fecha ao redimensionar para desktop */
    const mq = window.matchMedia("(min-width: 761px)");
    mq.addEventListener("change", (e) => {
      if (e.matches) abrir(false);
    });

    /* Fecha com a tecla ESC */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") abrir(false);
    });
  }

  /* ----- Galeria ampliada ----- */
  const gallery = document.querySelector(".gallery");
  const lightbox = document.querySelector(".gallery-lightbox");
  if (gallery && lightbox) {
    const images = Array.from(gallery.querySelectorAll(".gallery-item img"));
    const largeImage = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let activeIndex = 0;
    let touchStartX = null;

    const showImage = (index) => {
      activeIndex = (index + images.length) % images.length;
      const source = images[activeIndex];
      largeImage.src = source.currentSrc || source.src;
      largeImage.alt = source.alt;
      caption.textContent = source.closest(".gallery-item").querySelector("figcaption")?.textContent || source.alt;
    };

    const openLightbox = (index) => {
      showImage(index);
      if (!lightbox.open) lightbox.showModal();
      closeButton.focus();
    };

    images.forEach((image, index) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Ampliar imagem: ${image.alt}`);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    gallery.addEventListener("click", (event) => {
      const image = event.target.closest(".gallery-item img");
      if (image) openLightbox(images.indexOf(image));
    });
    closeButton.addEventListener("click", () => lightbox.close());
    previousButton.addEventListener("click", () => showImage(activeIndex - 1));
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    });
    lightbox.addEventListener("pointerdown", (event) => { touchStartX = event.clientX; });
    lightbox.addEventListener("pointerup", (event) => {
      if (touchStartX === null) return;
      const swipe = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(swipe) > 55) showImage(activeIndex + (swipe < 0 ? 1 : -1));
    });
  }

  /* ----- Ano atual no rodapé ----- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());

  /* ----- Sombra do header ao rolar ----- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 6px 18px rgba(11, 42, 77, .10)";
      } else {
        header.style.boxShadow = "none";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
