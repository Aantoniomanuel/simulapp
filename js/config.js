/* ============================================================
   FIREBASE CONFIG — simulapp-ies-cantillana
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBbiTsJxqhRxloDvOXD-J6ohHARm0WZe2w",
  authDomain:        "simulapp-ies-cantillana.firebaseapp.com",
  projectId:         "simulapp-ies-cantillana",
  storageBucket:     "simulapp-ies-cantillana.firebasestorage.app",
  messagingSenderId: "736364716243",
  appId:             "1:736364716243:web:4b5186a6ed94f36713b426"
};

// Modo demo: false = Firebase real (por defecto desde que Auth está activo)
// Para volver a demo: Perfil → Configuración → "Volver a modo demo"
const MODO_DEMO = localStorage.getItem('simulapp_modo_real') === 'true';

// Dominios de correo permitidos para el auto-registro de alumnos
const DOMINIOS_PERMITIDOS = ['iescantillana.es', 'g.educaand.es'];

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
const APP = {
  usuario: null,
  perfil: null,  // datos de Firestore
  empresa: null,
  grupo: null,
  rolActivo: 'alumno',
  moduloActual: 'dashboard',
};

/* ============================================================
   DATOS DE DEMO (para funcionar sin Firebase real)
   ============================================================ */
const DEMO_USUARIOS = {
  'alumno@iescantillana.es': {
    uid: 'demo-alumno-1',
    email: 'alumno@iescantillana.es',
    displayName: 'Ana García López',
    rol: 'alumno',
    grupo: 'G1',
    empresa: {
      nombre: 'Agrícola Vega Alta S.L.',
      sector: 'Distribución alimentaria',
      formaJuridica: 'S.L.',
      departamento: 'Contabilidad y Finanzas',
      capitalInicial: 50000,
      fechaConstitucion: '2025-10-15',
    }
  },
  'profesor@iescantillana.es': {
    uid: 'demo-prof-1',
    email: 'profesor@iescantillana.es',
    displayName: 'Prof. Simulación',
    rol: 'profesor',
    modulo: '0656',
  },
  'admin@iescantillana.es': {
    uid: 'demo-admin-1',
    email: 'admin@iescantillana.es',
    displayName: 'Administrador',
    rol: 'admin',
  }
};

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  if (!MODO_DEMO) {
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      firebase.auth().onAuthStateChanged(usuario => {
        if (usuario) {
          cargarPerfil(usuario);
        } else {
          mostrarLogin();
        }
      });
    } catch(e) {
      console.warn('Firebase no configurado, usando modo demo');
      mostrarLogin();
    }
  } else {
    // En modo demo, mostrar login tras breve carga
    setTimeout(mostrarLogin, 1200);
  }
});

function mostrarLogin() {
  document.getElementById('pantalla-carga').classList.add('oculto');
  document.getElementById('pantalla-login').classList.add('activo');
}

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */
let rolSeleccionado = 'alumno';

function seleccionarRol(rol, btn) {
  rolSeleccionado = rol;
  document.querySelectorAll('.rol-tab').forEach(t => t.classList.remove('activo'));
  btn.classList.add('activo');

  // Sugerir email demo según rol
  const emails = {
    alumno:   'alumno@iescantillana.es',
    profesor: 'profesor@iescantillana.es',
    admin:    'admin@iescantillana.es'
  };
  document.getElementById('login-email').value = emails[rol] || '';
}

async function iniciarSesion() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const btn   = document.getElementById('btn-login');
  const err   = document.getElementById('login-error');

  err.classList.remove('visible');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner-carga" style="width:18px;height:18px;border-width:2px"></div> Entrando…';

  if (MODO_DEMO) {
    await new Promise(r => setTimeout(r, 800)); // simular latencia
    const perfil = DEMO_USUARIOS[email];
    if (perfil) {
      APP.usuario = { uid: perfil.uid, email: perfil.email, displayName: perfil.displayName };
      APP.perfil  = perfil;
      APP.empresa = perfil.empresa || null;
      APP.rolActivo = perfil.rol;
      cargarApp();
    } else {
      err.classList.add('visible');
      btn.disabled = false;
      btn.innerHTML = '<span>Entrar</span> →';
    }
    return;
  }

  // Firebase real
  try {
    const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
    await cargarPerfil(cred.user);
  } catch(e) {
    err.classList.add('visible');
    btn.disabled = false;
    btn.innerHTML = '<span>Entrar</span> →';
  }
}

async function cargarPerfil(usuario) {
  APP.usuario = usuario;
  if (!MODO_DEMO) {
    const snap = await firebase.firestore().collection('usuarios').doc(usuario.uid).get();
    APP.perfil = snap.data();
    APP.empresa = (APP.perfil && APP.perfil.empresa) || null;
    APP.rolActivo = (APP.perfil && APP.perfil.rol) || 'alumno';
  }
  cargarApp();
}

function cerrarSesion() {
  if (!MODO_DEMO) firebase.auth().signOut();
  APP.usuario = null; APP.perfil = null;
  document.getElementById('app-principal').classList.remove('activo');
  document.getElementById('pantalla-login').classList.add('activo');
  document.getElementById('btn-login').disabled = false;
  document.getElementById('btn-login').innerHTML = '<span>Entrar</span> →';
  mostrarToast('Sesión cerrada correctamente', 'exito');
}

/* ============================================================
   AUTO-REGISTRO DE ALUMNOS
   ============================================================ */

function toggleRegistro() {
  const panel  = document.getElementById('panel-registro');
  const wrap   = document.getElementById('btn-toggle-registro');
  const abierto = panel.style.display !== 'none';

  if (abierto) {
    panel.style.display = 'none';
    if (wrap) wrap.textContent = '¿Primera vez? Regístrate →';
    return;
  }

  // Mostrar panel
  panel.style.display = 'block';
  if (wrap) wrap.textContent = '← Ocultar registro';

  // Modo demo → aviso; modo real → formulario
  document.getElementById('registro-modo-demo').style.display  = MODO_DEMO ? 'block' : 'none';
  document.getElementById('registro-form-real').style.display  = MODO_DEMO ? 'none'  : 'block';
}

async function registrarAlumno() {
  const nombre = (document.getElementById('reg-nombre').value || '').trim();
  const email  = (document.getElementById('reg-email').value  || '').trim().toLowerCase();
  const grupo  = (document.getElementById('reg-grupo').value  || '').trim();
  const pass   = document.getElementById('reg-pass').value;
  const pass2  = document.getElementById('reg-pass2').value;
  const errEl  = document.getElementById('registro-error');
  const btn    = document.getElementById('btn-registro');

  const mostrarError = (msg) => {
    errEl.textContent = msg;
    errEl.classList.add('visible');
    btn.disabled = false;
    btn.innerHTML = '<span>Crear cuenta</span> →';
  };

  errEl.classList.remove('visible');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner-carga" style="width:16px;height:16px;border-width:2px"></div> Creando cuenta…';

  // Validaciones básicas
  if (!nombre)          return mostrarError('Introduce tu nombre completo.');
  if (!email)           return mostrarError('Introduce tu correo corporativo.');
  if (!grupo)           return mostrarError('Selecciona tu grupo de simulación.');
  if (pass.length < 6)  return mostrarError('La contraseña debe tener al menos 6 caracteres.');
  if (pass !== pass2)   return mostrarError('Las contraseñas no coinciden.');

  // Validar dominio corporativo
  const dominioOk = DOMINIOS_PERMITIDOS.some(d => email.endsWith('@' + d));
  if (!dominioOk) {
    return mostrarError(`Solo se permiten correos ${DOMINIOS_PERMITIDOS.map(d => '@' + d).join(' o ')}.`);
  }

  try {
    // 1. Crear cuenta en Firebase Auth
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);

    // 2. Actualizar displayName
    await cred.user.updateProfile({ displayName: nombre });

    // 3. Crear perfil en Firestore
    const perfil = {
      uid:           cred.user.uid,
      email:         email,
      displayName:   nombre,
      rol:           'alumno',
      grupo:         grupo,
      fechaRegistro: new Date().toISOString(),
      activo:        true,
    };
    await firebase.firestore().collection('usuarios').doc(cred.user.uid).set(perfil);

    // 4. Notificación para el docente en Firestore
    await firebase.firestore().collection('notificaciones_docente').add({
      tipo:    'nuevo_alumno',
      titulo:  `Nuevo alumno registrado: ${nombre}`,
      cuerpo:  `${email} · Grupo ${grupo} · ${new Date().toLocaleDateString('es-ES')}`,
      ts:      Date.now(),
      leida:   false,
    });

    // 5. Cargar la app directamente
    APP.usuario  = cred.user;
    APP.perfil   = perfil;
    APP.empresa  = perfil.empresa || null;
    APP.rolActivo = 'alumno';
    APP.grupo    = grupo;

    document.getElementById('panel-registro').style.display = 'none';
    cargarApp();

  } catch(e) {
    const mensajes = {
      'auth/email-already-in-use':    'Este correo ya tiene una cuenta. Inicia sesión en lugar de registrarte.',
      'auth/invalid-email':           'El formato del correo no es válido.',
      'auth/weak-password':           'La contraseña es demasiado débil (mínimo 6 caracteres).',
      'auth/operation-not-allowed':   'El registro está desactivado. Contacta con tu docente.',
      'auth/network-request-failed':  'Sin conexión a internet. Comprueba tu red.',
    };
    mostrarError(mensajes[e.code] || ('Error: ' + e.message));
  }
}

/* ============================================================
   CAPA 2 — SECCIÓN CONCEPTOS CLAVE
   Biblioteca navegable que reutiliza AYUDA_CONTENIDO
   como fuente de datos. No duplica contenido.
   ============================================================ */

/* ============================================================
   CAPA 3 — CASOS Y SITUACIONES GUIADAS
   ============================================================ */

/* ── Biblioteca de casos predefinidos ─────────────────────── */
