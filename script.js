const envelope = document.getElementById("envelope");
const card = document.getElementById("card");
const musica = document.getElementById("musica");
const details = document.getElementById("details");
const btnMostrarForm = document.getElementById("btn-mostrar-form");
const form = document.getElementById("rsvp-form");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

// Al hacer clic en el sobre, mostrar la tarjeta con animación
envelope.addEventListener("click", () => {
  gsap.to(envelope, {
    scale: 0,
    duration: 0.6,
    ease: "power2.in",
    onComplete: () => {
      envelope.style.display = "none";
      card.style.display = "block";

      // Preparar animación de letras
      prepararAnimacionDeLetras();

      // Mostrar tarjeta
      gsap.fromTo(card,
        { scale: 0.8, opacity: 0 },
        { duration: 1, scale: 1, opacity: 1, ease: "back.out(1.7)", onComplete: animarContenido }
      );
    }
  });

  // Reproducir música si está en pausa
  if (musica.paused) musica.play();

  // Iniciar confeti
  startConfetti();
});

// Envuelve cada letra en un span para animarlas
function prepararAnimacionDeLetras() {
  const elems = card.querySelectorAll(".animar-letras");
  elems.forEach(el => {
    const text = el.textContent;
    el.innerHTML = "";
    text.split("").forEach(char => {
      const span = document.createElement("span");
      span.textContent = char;
      el.appendChild(span);
    });
  });
}

// Una vez que la tarjeta aparece, animamos letras, detalles y botón
function animarContenido() {
  // Animar título y subtítulo
  const allSpans = card.querySelectorAll(".animar-letras span");
  gsap.fromTo(allSpans,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "back.out(1.5)" }
  );

  // Mostrar detalles después de las letras
  gsap.to(details, { opacity: 1, delay: 1.2, duration: 0.8 });

  // Mostrar botón para mostrar formulario después de detalles
  gsap.to(btnMostrarForm, { opacity: 1, delay: 1.8, duration: 0.8 });
}

// Al hacer clic en el botón "Confirmar asistencia", mostrar formulario centrado
btnMostrarForm.addEventListener("click", () => {
  gsap.to(form, { display: "flex", opacity: 1, duration: 0.8 });
});

// Manejo del formulario al enviar
form.addEventListener("submit", function (e) {
  e.preventDefault();
  // Ocultar formulario y botón
  form.style.display = "none";
  btnMostrarForm.style.display = "none";
  // Mostrar mensaje de confirmación centrado
  mensajeConfirmacion.style.display = "block";
  // Después de 2.5 segundos, esconder mensaje y volver a mostrar botón
  setTimeout(() => {
    mensajeConfirmacion.style.display = "none";
    btnMostrarForm.style.display = "block";
    // Opcional: restaurar opacidad con GSAP
    gsap.fromTo(btnMostrarForm, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }, 2500);
});

// ======= Código del confeti marrón/dorado =======
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
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
// ================================================================
