(function () {
  const POLICY_TEXT = {
    terms: {
      title: "Terms of use",
      body: [
        "Uso responsable: el contenido de ALTA MUSA es informativo y puede cambiar sin aviso.",
        "Propiedad: marcas, textos e imágenes pertenecen a ALTA MUSA o a sus titulares autorizados.",
        "Prohibido: copiar, revender, automatizar scraping o usar el contenido para suplantación.",
        "Reservas: cualquier booking/casting se confirma por canales oficiales."
      ]
    },
    privacy: {
      title: "Privacy Policy",
      body: [
        "Recopilamos datos mínimos para contacto (nombre, email, mensaje).",
        "No vendemos tus datos. Se usan solo para responder solicitudes y gestión interna.",
        "Puedes solicitar actualización o eliminación de tu información vía Contact."
      ]
    },
    cookie: {
      title: "Cookie Policy",
      body: [
        "Podemos usar cookies básicas para rendimiento y experiencia de navegación.",
        "No usamos cookies invasivas sin necesidad. Puedes desactivarlas en tu navegador.",
        "Al continuar navegando, aceptas el uso básico de cookies."
      ]
    },
    u18: {
      title: "Under 18 FAQs",
      body: [
        "Menores de edad requieren autorización de madre/padre o tutor legal.",
        "Se verifica identidad y permisos antes de cualquier sesión o contrato.",
        "La seguridad y bienestar del talento es prioridad."
      ]
    }
  };

  const loadPartial = async (selector, url) => {
    const host = document.querySelector(selector);
    if (!host) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      host.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      host.innerHTML = "";
    }
  };

  const initHeader = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const btn = header.querySelector(".menu-btn");
    const panel = header.querySelector(".mobile-panel");

    if (btn && panel) {
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });

      // cerrar menú al hacer click en un link
      panel.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (!a) return;
        btn.setAttribute("aria-expanded", "false");
        panel.hidden = true;
      });
    }
  };

  const initFooter = () => {
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  };

  // ---------- Modal ----------
  const closeModal = () => {
    const back = document.querySelector(".modal-backdrop");
    if (back) back.remove();
    document.documentElement.style.overflow = "";
  };

  const openModal = (key) => {
    const data = POLICY_TEXT[key];
    if (!data) return;

    closeModal();
    document.documentElement.style.overflow = "hidden";

    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${data.title}">
        <div class="modal-head">
          <h3 class="modal-title">${data.title}</h3>
          <button class="modal-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          ${data.body.map(p => `<p>${p}</p>`).join("")}
        </div>
      </div>
    `;

    back.addEventListener("click", (e) => {
      if (e.target === back) closeModal();
    });

    back.querySelector(".modal-close").addEventListener("click", closeModal);

    window.addEventListener("keydown", function esc(ev){
      if (ev.key === "Escape") {
        closeModal();
        window.removeEventListener("keydown", esc);
      }
    });

    document.body.appendChild(back);
  };

  const initPolicyLinks = () => {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-modal]");
      if (!a) return;
      e.preventDefault();
      openModal(a.getAttribute("data-modal"));
    });
  };

  const boot = async () => {
    await loadPartial("#header-slot", "partials/header.html");
    await loadPartial("#footer-slot", "partials/footer.html");

    initHeader();
    initFooter();
    initPolicyLinks();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
