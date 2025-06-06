const envelope        = document.getElementById("envelope");
const card            = document.getElementById("card");
const musica          = document.getElementById("musica");
const details         = document.getElementById("details");
const btnMostrarForm  = document.getElementById("btn-mostrar-form");
const form            = document.getElementById("rsvp-form");
const mensajeConfirm  = document.getElementById("mensaje-confirmacion");

// Al hacer clic en el sobre, mostrar la tarjeta con animación
envelope.addEventListener("click", () => {
  gsap.to(envelope, {
    scale: 0,
    duration: 0.8,           // Más lento
    ease: "power2.in",
    onComplete: () => {
      envelope.style.display = "none";
      card.style.display     = "block";

      // Envolver letras para animación
      prepararAnimacionDeLetras();

      // Aparecer tarjeta
      gsap.fromTo(card,
        { scale: 0.8, opacity: 0 },
        { duration: 1.2, scale: 1, opacity: 1, ease: "back.out(1.7)", onComplete: animarContenido }
      );
    }
  });

  // Reproducir música si está en pausa
  if (musica.paused) musica.play();

  // Iniciar confeti
  startConfetti();
});

// Envuelve cada letra en un <span> para animación
function prepararAnimacionDeLetras() {
  const elems = card.querySelectorAll(".animar-letras");
  elems.forEach(el => {
    const txt = el.textContent;
    el.innerHTML = "";
    txt.split("").forEach(c => {
      const span = document.createElement("span");
      span.textContent = c;
      el.appendChild(span);
    });
  });
}

// Animar contenido tras aparecer la tarjeta
function animarContenido() {
  // Animar cada letra con GSAP, más lento
  const allSpans = card.querySelectorAll(".animar-letras span");
  gsap.fromTo(allSpans,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,      // Intervalo más grande entre letras
      duration: 1.0,     // Animación de letra más lenta
      ease: "back.out(1.5)"
    }
  );

  // Mostrar detalles después de la animación de letras
  gsap.to(details, { opacity: 1, delay: 1.8, duration: 1.0 });

  // Mostrar botón para formulario después de detalles
  gsap.to(btnMostrarForm, { opacity: 1, delay: 2.8, duration: 1.0 });
}

// Al hacer clic en "Confirmar asistencia", mostrar formulario centrado
btnMostrarForm.addEventListener("click", () => {
  gsap.to(form, { display: "flex", opacity: 1, duration: 1.0 });
});

// Manejo del formulario al enviar
form.addEventListener("submit", function(e) {
  e.preventDefault();
  // Ocultar formulario y botón
  form.style.display = "none";
  btnMostrarForm.style.display = "none";

  // Mostrar mensaje de confirmación centrado
  mensajeConfirm.style.display = "block";

  // Tras 2.5s, ocultar mensaje y mostrar botón de nuevo
  setTimeout(() => {
    mensajeConfirm.style.display = "none";
    btnMostrarForm.style.display = "block";
    // Restaurar opacidad con GSAP
    gsap.fromTo(btnMostrarForm, { opacity: 0 }, { opacity: 1, duration: 0.8 });
  }, 2500);
});

// ======= Código del confeti marrón/dorado =======
const canvas = document.getElementById("confetti");
const ctx    = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticle() {
  const colors = ["#a67c52", "#d4af37", "#8b5e3c"];
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 2 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotateSpeed: Math.random() * 5
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();

    p.y += p.speed;
    p.rotation += p.rotateSpeed;

    if (p.y > canvas.height) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawParticles);
}

function startConfetti() {
  for (let i = 0; i < 100; i++) {
    particles.push(createParticle());
  }
  drawParticles();
}
