// script.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// ——— Configuración e inicialización de Firebase ———
const firebaseConfig = {
  apiKey: "AIzaSyDsBilZaGjEyO-ZqEXFowXrjFT-794TPlE",
  authDomain: "carta-cumple.firebaseapp.com",
  projectId: "carta-cumple",
  storageBucket: "carta-cumple.firebasestorage.app",
  messagingSenderId: "431208595093",
  appId: "1:431208595093:web:88cc6628ab14ed8835659c"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ——— Resto de tu lógica de invitación ———
const envelope       = document.getElementById("envelope");
const card           = document.getElementById("card");
const musica         = document.getElementById("musica");
const details        = document.getElementById("details");
const btnMostrarForm = document.getElementById("btn-mostrar-form");
const form           = document.getElementById("rsvp-form");
const mensajeConfirm = document.getElementById("mensaje-confirmacion");

// Al hacer clic en el sobre...
envelope.addEventListener("click", () => {
  gsap.to(envelope, {
    scale: 0,
    duration: 0.8,
    ease: "power2.in",
    onComplete: () => {
      envelope.style.display = "none";
      card.style.display     = "block";
      prepararAnimacionDeLetras();
      gsap.fromTo(card,
        { scale: 0.8, opacity: 0 },
        { duration: 1.2, scale: 1, opacity: 1, ease: "back.out(1.7)", onComplete: animarContenido }
      );
    }
  });
  if (musica.paused) musica.play();
  startConfetti();
});

function prepararAnimacionDeLetras() {
  card.querySelectorAll(".animar-letras").forEach(el => {
    const txt = el.textContent;
    el.innerHTML = "";
    txt.split("").forEach(c => {
      const span = document.createElement("span");
      span.textContent = c;
      el.appendChild(span);
    });
  });
}

function animarContenido() {
  const allSpans = card.querySelectorAll(".animar-letras span");
  gsap.fromTo(allSpans,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 1.0, ease: "back.out(1.5)" }
  );
  gsap.to(details, { opacity: 1, delay: 1.8, duration: 1.0 });
  gsap.to(btnMostrarForm, { opacity: 1, delay: 2.8, duration: 1.0 });
}

btnMostrarForm.addEventListener("click", () => {
  gsap.to(form, { display: "flex", opacity: 1, duration: 1.0 });
});

// ——— Aquí guardamos en Firestore ———
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre  = form.nombre.value.trim();
  const telefono = form.telefono.value.trim();

  try {
    await addDoc(collection(db, "confirmaciones"), {
      nombre,
      telefono,
      creado: serverTimestamp()
    });
  } catch (err) {
    console.error("Error guardando en Firestore:", err);
  }

  // Ocultar formulario y botón
  form.style.display         = "none";
  btnMostrarForm.style.display = "none";

  // Mostrar mensaje de confirmación
  mensajeConfirm.style.display = "block";

  // Volver a mostrar botón tras 2.5s
  setTimeout(() => {
    mensajeConfirm.style.display = "none";
    btnMostrarForm.style.display = "block";
    gsap.fromTo(btnMostrarForm, { opacity: 0 }, { opacity: 1, duration: 0.8 });
  }, 2500);
});

// ——— Confeti marrón/dorado ———
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
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
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
  for (let i = 0; i < 100; i++) particles.push(createParticle());
  drawParticles();
}
