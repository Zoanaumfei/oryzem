import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCpx6LjIAgSd6qguI_i-2PfrAbnd4MyXh8",
  authDomain: "oryzemfirebase.firebaseapp.com",
  projectId: "oryzemfirebase",
  storageBucket: "oryzemfirebase.firebasestorage.app",
  messagingSenderId: "892357545518",
  appId: "1:892357545518:web:95824e96df6800651759bf",
  measurementId: "G-8RP33FMB2F"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Elementos do DOM
let messageElement, clickMeButton;
let externEmailInput, externPasswordInput, externSignInButton, externSignOutButton;
let vwEmailInput, vwPasswordInput, vwSignInButton, vwSignOutButton;
let googleSignInButton, googleSignOutButton, authStatusElement;

document.addEventListener('DOMContentLoaded', () => {
  // Elementos antigos (se ainda existirem)
  messageElement = document.getElementById('message');
  clickMeButton = document.getElementById('clickMe');
  
  // Elementos do formulário EXTERNO
  externEmailInput = document.getElementById('externEmail');
  externPasswordInput = document.getElementById('externPassword');
  externSignInButton = document.getElementById('externSignInButton');
  externSignOutButton = document.getElementById('externSignOutButton');
  
  // Elementos do formulário VW
  vwEmailInput = document.getElementById('vwEmail');
  vwPasswordInput = document.getElementById('vwPassword');
  vwSignInButton = document.getElementById('vwSignInButton');
  vwSignOutButton = document.getElementById('vwSignOutButton');
  
  // Elementos do Google Auth
  googleSignInButton = document.getElementById('googleSignInButton');
  googleSignOutButton = document.getElementById('googleSignOutButton');
  authStatusElement = document.getElementById('authStatus');
  
  // Event Listeners
  if (clickMeButton && messageElement) {
    clickMeButton.addEventListener('click', () => {
      messageElement.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`;
    });
  }
  
  // Formulário Externo
  if (externSignInButton) {
    externSignInButton.addEventListener('click', handleExternSignIn);
  }
  
  if (externSignOutButton) {
    externSignOutButton.addEventListener('click', handleSignOut);
  }
  
  // Formulário VW
  if (vwSignInButton) {
    vwSignInButton.addEventListener('click', handleVwSignIn);
  }
  
  if (vwSignOutButton) {
    vwSignOutButton.addEventListener('click', handleSignOut);
  }
  
  // Google Auth
  if (googleSignInButton) {
    googleSignInButton.addEventListener('click', signInWithGoogle);
  }
  
  if (googleSignOutButton) {
    googleSignOutButton.addEventListener('click', handleSignOut);
  }
  
  // Form submission
  const externLoginForm = document.getElementById('externLoginForm');
  const vwLoginForm = document.getElementById('vwLoginForm');
  
  if (externLoginForm) {
    externLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleExternSignIn();
    });
  }
  
  if (vwLoginForm) {
    vwLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleVwSignIn();
    });
  }
});

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

// SIGN IN - Usuário Externo
async function handleExternSignIn() {
  const email = externEmailInput?.value.trim() || '';
  const password = externPasswordInput?.value || '';
  
  if (!email || !password) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário externo autenticado:', userCredential.user);
    updateAuthStatus(userCredential.user, 'externo');
  } catch (err) {
    console.error('Erro na autenticação externa:', err);
    
    // Verifica se é um novo usuário e tenta criar conta
    if (err.code === 'auth/user-not-found') {
      if (confirm('Usuário não encontrado. Deseja criar uma nova conta?')) {
        await handleExternSignUp(email, password);
      }
    } else {
      alert(`Erro: ${err.message || 'Falha na autenticação'}`);
    }
  }
}

// SIGN UP - Usuário Externo (criação de conta)
async function handleExternSignUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Conta externa criada:', userCredential.user);
    alert('Conta criada com sucesso! Faça login.');
    updateAuthStatus(userCredential.user, 'externo');
  } catch (err) {
    console.error('Erro ao criar conta externa:', err);
    alert(`Erro ao criar conta: ${err.message || 'Tente novamente'}`);
  }
}

// SIGN IN - Usuário VW
async function handleVwSignIn() {
  const email = vwEmailInput?.value.trim() || '';
  const password = vwPasswordInput?.value || '';
  
  if (!email || !password) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  // Verifica se é email corporativo VW (opcional)
  if (email && !email.includes('@volkswagen')) {
    const confirmar = confirm('Este não parece ser um email corporativo Volkswagen. Deseja continuar mesmo assim?');
    if (!confirmar) return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário VW autenticado:', userCredential.user);
    updateAuthStatus(userCredential.user, 'vw');
  } catch (err) {
    console.error('Erro na autenticação VW:', err);
    
    if (err.code === 'auth/user-not-found') {
      alert('Usuário não encontrado. Entre em contato com o administrador.');
    } else {
      alert(`Erro: ${err.message || 'Falha na autenticação'}`);
    }
  }
}

// SIGN OUT - Geral
async function handleSignOut() {
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
    updateAuthStatus(null, null);
    clearFormInputs();
  } catch (err) {
    console.error('Erro ao deslogar:', err);
    alert(`Erro: ${err.message || 'Falha ao deslogar'}`);
  }
}

// SIGN IN with Google
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google login realizado:", user);
    updateAuthStatus(user, 'google');
  } catch (err) {
    console.error("Erro no Google Sign-In:", err);
    
    if (err.code === 'auth/popup-blocked') {
      alert('Pop-up bloqueado. Por favor, permita pop-ups para este site.');
    } else if (err.code === 'auth/popup-closed-by-user') {
      console.log('Usuário fechou a janela de autenticação.');
    } else {
      alert(`Erro: ${err.message || 'Falha na autenticação com Google'}`);
    }
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Atualiza o status de autenticação
function updateAuthStatus(user, type) {
  if (!authStatusElement) return;
  
  if (user) {
    const userName = user.displayName || user.email || 'Usuário';
    const userType = type === 'externo' ? 'Externo' : 
                    type === 'vw' ? 'Volkswagen' : 
                    type === 'google' ? 'Google' : '';
    
    authStatusElement.textContent = `Conectado: ${userName} (${userType})`;
    authStatusElement.className = 'form-help form-help--success';
    
    // Opcional: desabilitar botões de sign in
    disableSignInButtons(true);
  } else {
    authStatusElement.textContent = 'Desconectado';
    authStatusElement.className = 'form-help form-help--info';
    
    // Habilitar botões de sign in
    disableSignInButtons(false);
  }
}

// Limpa os campos dos formulários
function clearFormInputs() {
  if (externEmailInput) externEmailInput.value = '';
  if (externPasswordInput) externPasswordInput.value = '';
  if (vwEmailInput) vwEmailInput.value = '';
  if (vwPasswordInput) vwPasswordInput.value = '';
}

// Habilita/desabilita botões de sign in
function disableSignInButtons(disable) {
  const signInButtons = [
    externSignInButton, 
    vwSignInButton, 
    googleSignInButton
  ];
  
  signInButtons.forEach(button => {
    if (button) {
      button.disabled = disable;
      button.style.opacity = disable ? '0.6' : '1';
    }
  });
}

// ============================================
// LISTENER DE ESTADO DE AUTENTICAÇÃO
// ============================================

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário já está logado - determinar tipo pelo email
    const email = user.email || '';
    let userType = 'externo';
    
    if (email.includes('@volkswagen')) {
      userType = 'vw';
    } else if (user.providerData && user.providerData[0].providerId === 'google.com') {
      userType = 'google';
    }
    
    updateAuthStatus(user, userType);
    
    // Preencher automaticamente o formulário correspondente
    if (userType === 'externo' && externEmailInput) {
      externEmailInput.value = email;
    } else if (userType === 'vw' && vwEmailInput) {
      vwEmailInput.value = email;
    }
  } else {
    updateAuthStatus(null, null);
  }
});

// ============================================
// FUNCIONALIDADE OPCIONAL: MOSTRAR/OCULTAR SENHA
// ============================================

// Se quiser adicionar essa funcionalidade posteriormente:
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const input = this.closest('.input-wrapper').querySelector('input[type="password"], input[type="text"]');
    const icon = this.querySelector('svg');
    
    if (input.type === 'password') {
      input.type = 'text';
      this.setAttribute('aria-label', 'Ocultar senha');
      // Mudar ícone para olho fechado
      if (icon) {
        icon.innerHTML = `<path d="M14.8 14.8C13.6 15.9 11.8 16.5 10 15.9C8.2 15.3 7 13.5 7 11.5C7 10.3 7.5 9.2 8.3 8.3M10 4C10.8 4 11.6 4.1 12.4 4.3L17.4 2.3C17.8 2.1 18.3 2.3 18.5 2.7L19.7 5.3C19.9 5.7 19.7 6.2 19.3 6.4L17.5 7.4C18.9 9 19.8 11 19.8 13.2C19.8 17.1 17 20.4 13.2 21.2C12.4 21.4 11.6 21.5 10.8 21.5C6.5 21.5 2.8 18.3 2 13.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 2L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    } else {
      input.type = 'password';
      this.setAttribute('aria-label', 'Mostrar senha');
      // Voltar para ícone de olho aberto
      if (icon) {
        icon.innerHTML = `<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    }
  });
});