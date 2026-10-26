/* ==========================================================
   IRON GYM — JavaScript
   Menú, navbar al hacer scroll, contadores,
   animaciones de reveal y validación del formulario.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Navbar pegada + botón subir ---------- */
  const navbar = document.querySelector(".navbar");
  const botonSubir = document.getElementById("botonSubir");

  function alHacerScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("pegada", y > 40);
    botonSubir.classList.toggle("visible", y > 500);
    marcarLinkActivo();
  }

  window.addEventListener("scroll", alHacerScroll, { passive: true });
  alHacerScroll();

  /* ---------- Link activo según sección visible ---------- */
  const links = [...document.querySelectorAll(".nav-link")];
  const secciones = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function marcarLinkActivo() {
    const posicion = window.scrollY + 120;
    let indiceActual = 0;

    secciones.forEach((seccion, i) => {
      if (seccion.offsetTop <= posicion) indiceActual = i;
    });

    links.forEach((link, i) =>
      link.classList.toggle("activo", i === indiceActual)
    );
  }

  /* ---------- Menú hamburguesa (móvil) ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const abierto = navLinks.classList.toggle("abierto");
    navToggle.classList.toggle("abierto", abierto);
    navToggle.setAttribute("aria-expanded", String(abierto));
  });

  // Cerrar el menú al tocar un link
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("abierto");
      navToggle.classList.remove("abierto");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Contadores del hero ---------- */
  function animarContador(elemento) {
    const objetivo = Number(elemento.dataset.contar);
    const duracion = 1400;
    const inicio = performance.now();

    function paso(ahora) {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const suavizado = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
      elemento.textContent = Math.round(objetivo * suavizado).toLocaleString("es-AR");
      if (progreso < 1) requestAnimationFrame(paso);
    }

    requestAnimationFrame(paso);
  }

  /* ---------- Animación de reveal al hacer scroll ---------- */
  const tarjetas = document.querySelectorAll(".tarjeta-reveal");

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.add("visible");

        // Si el elemento tiene contadores adentro, los animamos una vez
        entrada.target
          .querySelectorAll(".stat-num[data-contar]")
          .forEach((contador) => {
            if (contador.dataset.animado) return;
            contador.dataset.animado = "true";
            animarContador(contador);
          });

        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.15 }
  );

  tarjetas.forEach((tarjeta) => observador.observe(tarjeta));

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("formContacto");
  const mensaje = document.getElementById("formMensaje");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();

    if (!nombre || !email) {
      mensaje.style.color = "#ff5c5c";
      mensaje.textContent = "⚠️ Completá tu nombre y email para poder contactarte.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mensaje.style.color = "#ff5c5c";
      mensaje.textContent = "⚠️ El email no parece válido, revisalo por favor.";
      return;
    }

    // Demo: mostramos confirmación. Para producción convendría conectar
    // un servicio como Formspree, EmailJS o un backend propio.
    mensaje.style.color = "";
    mensaje.textContent = `¡Gracias ${nombre}! Ya te anotamos para la clase gratis 💪`;
    form.reset();
  });
});
