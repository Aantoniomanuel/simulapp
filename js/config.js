/* ============================================================
   FIREBASE CONFIG
   (Reemplazar con las credenciales del proyecto Firebase real)
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey: "REEMPLAZAR_CON_API_KEY",
  authDomain: "REEMPLAZAR.firebaseapp.com",
  projectId: "REEMPLAZAR_PROJECT_ID",
  storageBucket: "REEMPLAZAR.appspot.com",
  messagingSenderId: "REEMPLAZAR",
  appId: "REEMPLAZAR"
};

// Modo demo: true = sin Firebase real, datos de ejemplo
const MODO_DEMO = true;

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
   CARGA DE APP
   ============================================================ */
/* ============================================================
   CAPA 2 — SECCIÓN CONCEPTOS CLAVE
   Biblioteca navegable que reutiliza AYUDA_CONTENIDO
   como fuente de datos. No duplica contenido.
   ============================================================ */

/* ============================================================
   CAPA 3 — CASOS Y SITUACIONES GUIADAS
   ============================================================ */

/* ── Biblioteca de casos predefinidos ─────────────────────── */
