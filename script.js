/**
 * INVITACIÓN DE GRADUACIÓN - RODRIGO JOSEPH MARTINEZ MAMANI
 * Configuración e Interactividad
 */

// ========================================================
// 1. CONFIGURACIÓN DE GOOGLE SHEETS
// ========================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZ0LaxyhH_UBW3fUBJQXvltFCnRSiUgihDUolZ4iR7Wp6r6OtYfbK8k3rwAAOG2lgn/exec";

// ========================================================
// 2. INICIALIZACIÓN DE ICONOS
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initCountdown();
  initFormHandler();
  initCalendarButton();
  initMusicToggle();
  initShareWhatsApp();
  initAttendanceToggle();

  // Mostrar aviso de prueba si no se ha configurado la URL de Google Sheets
  const sheetsNotice = document.getElementById('sheetsNotice');
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("TU_URL_DE_APPS_SCRIPT")) {
    sheetsNotice.classList.remove('hidden');
  }
});

// ========================================================
// 3. CUENTA REGRESIVA (29 de Noviembre de 2026)
// ========================================================
function initCountdown() {
  const targetDate = new Date("2026-11-29T09:00:00").getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('days').innerText = "00";
      document.getElementById('hours').innerText = "00";
      document.getElementById('minutes').innerText = "00";
      document.getElementById('seconds').innerText = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ========================================================
// 4. CONTROL DEL FORMULARIO Y ENVÍO A GOOGLE SHEETS
// ========================================================
function initFormHandler() {
  const form = document.getElementById('rsvpForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  const btnSpinner = document.getElementById('btnSpinner');
  const successCard = document.getElementById('successCard');
  const btnResetForm = document.getElementById('btnResetForm');
  const successCustomMessage = document.getElementById('successCustomMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Estado cargando
    setLoading(true);

    const formData = new FormData(form);
    const data = {
      fullName: formData.get('fullName'),
      phoneNumber: formData.get('phoneNumber'),
      attendance: formData.get('attendance'),
      guestsCount: formData.get('attendance') === 'No podré asistir' ? '0' : formData.get('guestsCount'),
      message: formData.get('message') || 'Sin mensaje'
    };

    // Caso 1: Modo Demo (Aún no ha colocado la URL de Google Sheets)
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.trim() === "") {
      setTimeout(() => {
        setLoading(false);
        showSuccess(data);
      }, 900);
      return;
    }

    // Caso 2: Envío real a Google Sheets mediante Google Apps Script
    try {
      // Creamos parámetros codificados para evitar bloqueos de CORS
      const postParams = new URLSearchParams();
      postParams.append('nombre', data.fullName);
      postParams.append('celular', data.phoneNumber);
      postParams.append('asistencia', data.attendance);
      postParams.append('acompanantes', data.guestsCount);
      postParams.append('mensaje', data.message);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necesario para Google Apps Script Webhooks
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postParams.toString()
      });

      setLoading(false);
      showSuccess(data);

    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Hubo un detalle de conexión, pero no te preocupes. Inténtalo de nuevo o avísale directamente a Rodrigo.");
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnText.textContent = "Guardando respuesta...";
      btnIcon.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
    } else {
      btnText.textContent = "Confirmar Asistencia";
      btnIcon.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  }

  function showSuccess(data) {
    // Lanzar confeti dorado y festivo
    triggerConfetti();

    // Personalizar mensaje de acuerdo a su respuesta
    if (data.attendance === "No podré asistir") {
      successCustomMessage.textContent = `Muchas gracias por avisarnos, ${data.fullName}. Aunque lamentamos que no puedas acompañarnos, Rodrigo agradece mucho tu aprecio y buenos deseos.`;
    } else {
      successCustomMessage.textContent = `¡Excelente, ${data.fullName}! Tu asistencia ha sido confirmada con éxito (${data.guestsCount}). Te esperamos para celebrar este día tan especial.`;
    }

    form.classList.add('hidden');
    successCard.classList.remove('hidden');
  }

  btnResetForm.addEventListener('click', () => {
    form.reset();
    document.getElementById('guestsWrapper').classList.remove('hidden');
    successCard.classList.add('hidden');
    form.classList.remove('hidden');
  });
}

// Ocultar selector de acompañantes si dice que no podrá asistir
function initAttendanceToggle() {
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestsWrapper = document.getElementById('guestsWrapper');

  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === "No podré asistir") {
        guestsWrapper.classList.add('opacity-40', 'pointer-events-none');
      } else {
        guestsWrapper.classList.remove('opacity-40', 'pointer-events-none');
      }
    });
  });
}

// ========================================================
// 5. ANIMACIÓN DE CONFETI ELEGANTE (Dorado & Azul)
// ========================================================
function triggerConfetti() {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#d4af37', '#f6e27a', '#ffffff', '#1e3a8a', '#93c5fd'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// ========================================================
// 6. AGENDAR EN GOOGLE CALENDAR
// ========================================================
function initCalendarButton() {
  const btn = document.getElementById('btnAddToCalendar');
  btn.addEventListener('click', () => {
    const title = encodeURIComponent("Graduación de Rodrigo Joseph Martinez Mamani - Ing. de Sistemas");
    const details = encodeURIComponent("Graduación de Rodrigo Joseph Martinez Mamani en Ingeniería de Sistemas.\nLugar: Universidad Adventista de Bolivia (UAB), Vinto, Cochabamba.\n¡Horario por confirmar!");
    const location = encodeURIComponent("Universidad Adventista de Bolivia, Vinto, Cochabamba, Bolivia");
    
    // 29 de Noviembre 2026 todo el día o tentativo
    const dates = "20261129/20261130"; 

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(calendarUrl, '_blank');
  });
}

// ========================================================
// 7. COMPARTIR POR WHATSAPP
// ========================================================
function initShareWhatsApp() {
  const btn = document.getElementById('shareWhatsappBtn');
  btn.addEventListener('click', () => {
    const currentUrl = window.location.href;
    const text = encodeURIComponent(
      `🎓 *Invitación de Graduación* 🎓\n\n` +
      `Te invito a celebrar la graduación de *Rodrigo Joseph Martinez Mamani* en *Ingeniería de Sistemas*.\n\n` +
      `📅 *Fecha:* Domingo, 29 de Noviembre de 2026\n` +
      `📍 *Lugar:* Universidad Adventista de Bolivia, Vinto - Cochabamba\n\n` +
      `Por favor confirma tu asistencia en el siguiente enlace:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  });
}

// ========================================================
// 8. REPRODUCTOR DE MÚSICA DE FONDO
// ========================================================
function initMusicToggle() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggleBtn');
  const text = document.getElementById('musicStatusText');
  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        text.textContent = "Pausar";
        btn.classList.add('border-gold-400', 'bg-gold-500/20');
      }).catch(err => {
        console.log("Reproducción bloqueada por el navegador hasta interacción del usuario", err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      text.textContent = "Música";
      btn.classList.remove('border-gold-400', 'bg-gold-500/20');
    }
  });
}
