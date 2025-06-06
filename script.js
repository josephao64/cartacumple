// Importar funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Tu web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsBilZaGjEyO-ZqEXFowXrjFT-794TPlE",
  authDomain: "carta-cumple.firebaseapp.com",
  projectId: "carta-cumple",
  storageBucket: "carta-cumple.firebasestorage.app",
  messagingSenderId: "431208595093",
  appId: "1:431208595093:web:88cc6628ab14ed8835659c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const initialCard = document.getElementById("initialCard");
  const openBtn = document.getElementById("openInvitationBtn");
  const initialContainer = document.getElementById("initialContainer");
  const invitationContainer = document.getElementById("invitationContainer");
  const invitationCard = document.getElementById("invitationCard");
  const confirmBtn = document.getElementById("confirmBtn");

  let smallConfettiInterval = null;

  // Función para lanzar un estallido grande de confeti
  function confetiGrande() {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.3 },
    });
  }

  // Función para lanzar pequeños destellos de confeti periódicos
  function iniciarConfetiContinuo() {
    smallConfettiInterval = setInterval(() => {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.2 },
      });
    }, 2500);
  }

  // Manejar clic en "Abrir invitación"
  openBtn.addEventListener("click", () => {
    // Animar la tarjeta inicial para salir
    initialCard.classList.add("open");

    // Después de la animación de salida (0.8s), mostrar la carta interior
    setTimeout(() => {
      // Ocultar el contenedor inicial
      initialContainer.style.display = "none";

      // Mostrar el contenedor de la invitación
      invitationContainer.style.display = "flex";

      // Animar aparición de la carta interior
      requestAnimationFrame(() => {
        invitationCard.classList.add("show");

        // Lanzar confeti grande al aparecer la carta interior
        confetiGrande();

        // Iniciar confeti continuo (poco a poco)
        iniciarConfetiContinuo();
      });
    }, 800);
  });

  // Manejar clic en "Confirmar asistencia"
  confirmBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Confirmar asistencia 🎉",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre completo">' +
        '<input id="swal-input2" type="number" min="1" class="swal2-input" placeholder="¿Cuántas personas asistirán?">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      preConfirm: () => {
        const nombre = document
          .getElementById("swal-input1")
          .value.trim();
        const personas = document
          .getElementById("swal-input2")
          .value.trim();
        if (!nombre || !personas) {
          Swal.showValidationMessage(
            "Por favor ingresa ambos campos"
          );
          return false;
        }
        if (isNaN(personas) || Number(personas) < 1) {
          Swal.showValidationMessage(
            "Ingresa un número válido de personas"
          );
          return false;
        }
        return { nombre, personas: Number(personas) };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { nombre, personas } = result.value;

        // Lanzar confeti al confirmar (estallido medio)
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.3 },
        });

        // Mostrar mensaje de agradecimiento
        await Swal.fire({
          icon: "success",
          title: `¡Gracias, ${nombre}!`,
          text: `Hemos registrado ${personas} persona(s) para el evento.`,
          confirmButtonText: "Cerrar",
        });

        // Guardar la confirmación en Firestore
        try {
          await addDoc(collection(db, "confirmaciones"), {
            nombre: nombre,
            personas: personas,
            timestamp: serverTimestamp(),
          });
          console.log("Confirmación guardada con éxito");
        } catch (error) {
          console.error("Error guardando en Firestore: ", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo guardar la confirmación. Por favor, inténtalo de nuevo.",
          });
        }
      }
    });
  });
});
