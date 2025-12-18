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

// ============================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================

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

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let messageElement, clickMeButton;
let externEmailInput, externPasswordInput, externSignInButton, externSignOutButton;
let vwEmailInput, vwPasswordInput, vwSignInButton, vwSignOutButton;
let googleSignInButton, googleSignOutButton, authStatusElement;

// ============================================
// INICIALIZAÇÃO DO DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  initializePasswordToggle();
  
  // Verificar estado de autenticação inicial
  updateAuthUI();
});

// Inicializar elementos do DOM
function initializeElements() {
  // Elementos antigos (opcional)
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
}

// Configurar event listeners
function setupEventListeners() {
  // Botão antigo (se existir)
  if (clickMeButton && messageElement) {
    clickMeButton.addEventListener('click', () => {
      messageElement.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`;
    });
  }
  
  // Formulário Externo
  const externLoginForm = document.getElementById('externLoginForm');
  if (externLoginForm) {
    externLoginForm.addEventListener('submit', handleExternFormSubmit);
  }
  
  // Botões extras do formulário externo
  if (externSignOutButton) {
    externSignOutButton.addEventListener('click', handleSignOut);
  }
  
  // Formulário VW
  const vwLoginForm = document.getElementById('vwLoginForm');
  if (vwLoginForm) {
    vwLoginForm.addEventListener('submit', handleVwFormSubmit);
  }
  
  // Botões extras do formulário VW
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
  
  // Navegação para dashboard
  const dashboardLink = document.querySelector('a[href="/dashboard.html"]');
  if (dashboardLink) {
    dashboardLink.addEventListener('click', (e) => {
      if (!auth.currentUser) {
        e.preventDefault();
        alert('Por favor, faça login primeiro para acessar o Dashboard.');
      }
    });
  }
}

// ============================================
// FUNCIONALIDADE DE MOSTRAR/OCULTAR SENHA
// ============================================

function initializePasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    // Remover event listeners existentes para evitar duplicação
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Adicionar event listener
    newToggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (!passwordInput) return;
      
      const eyeIcon = this.querySelector('.toggle-icon--eye');
      const eyeSlashIcon = this.querySelector('.toggle-icon--eye-slash');
      
      if (passwordInput.type === 'password') {
        // Mostrar senha
        passwordInput.type = 'text';
        if (eyeIcon) eyeIcon.style.display = 'none';
        if (eyeSlashIcon) eyeSlashIcon.style.display = 'block';
        this.setAttribute('aria-label', 'Ocultar senha');
        this.setAttribute('title', 'Clique para ocultar a senha');
      } else {
        // Ocultar senha
        passwordInput.type = 'password';
        if (eyeIcon) eyeIcon.style.display = 'block';
        if (eyeSlashIcon) eyeSlashIcon.style.display = 'none';
        this.setAttribute('aria-label', 'Mostrar senha');
        this.setAttribute('title', 'Clique para mostrar a senha');
      }
      
      // Focar no input novamente
      passwordInput.focus();
    });
    
    // Adicionar tooltip inicial
    newToggle.setAttribute('title', 'Clique para mostrar a senha');
  });
}

// ============================================
// HANDLERS DE FORMULÁRIOS
// ============================================

async function handleExternFormSubmit(e) {
  e.preventDefault();
  
  const email = externEmailInput?.value.trim() || '';
  const password = externPasswordInput?.value || '';
  
  if (!validateEmail(email)) {
    showError(externEmailInput, 'Por favor, insira um email válido.');
    return;
  }
  
  if (!validatePassword(password)) {
    showError(externPasswordInput, 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  clearErrors();
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário externo autenticado:', userCredential.user);
    showSuccess('Login realizado com sucesso!');
    updateAuthUI();
  } catch (err) {
    console.error('Erro na autenticação externa:', err);
    
    if (err.code === 'auth/user-not-found') {
      if (confirm('Usuário não encontrado. Deseja criar uma nova conta?')) {
        await handleExternSignUp(email, password);
      }
    } else if (err.code === 'auth/wrong-password') {
      showError(externPasswordInput, 'Senha incorreta. Tente novamente.');
    } else {
      showError(null, `Erro: ${err.message || 'Falha na autenticação'}`);
    }
  }
}

async function handleVwFormSubmit(e) {
  e.preventDefault();
  
  const email = vwEmailInput?.value.trim() || '';
  const password = vwPasswordInput?.value || '';
  
  if (!validateEmail(email)) {
    showError(vwEmailInput, 'Por favor, insira um email válido.');
    return;
  }
  
  if (!validatePassword(password)) {
    showError(vwPasswordInput, 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  // Verificação opcional de email corporativo
  if (email && !email.includes('@volkswagen')) {
    const confirmar = confirm('Este não parece ser um email corporativo Volkswagen. Deseja continuar mesmo assim?');
    if (!confirmar) return;
  }
  
  clearErrors();
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário VW autenticado:', userCredential.user);
    showSuccess('Login realizado com sucesso!');
    updateAuthUI();
  } catch (err) {
    console.error('Erro na autenticação VW:', err);
    
    if (err.code === 'auth/user-not-found') {
      showError(vwEmailInput, 'Usuário não encontrado. Entre em contato com o administrador.');
    } else if (err.code === 'auth/wrong-password') {
      showError(vwPasswordInput, 'Senha incorreta. Tente novamente.');
    } else {
      showError(null, `Erro: ${err.message || 'Falha na autenticação'}`);
    }
  }
}

async function handleExternSignUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Conta externa criada:', userCredential.user);
    showSuccess('Conta criada com sucesso! Faça login.');
    updateAuthUI();
  } catch (err) {
    console.error('Erro ao criar conta externa:', err);
    
    if (err.code === 'auth/email-already-in-use') {
      showError(externEmailInput, 'Este email já está em uso.');
    } else if (err.code === 'auth/invalid-email') {
      showError(externEmailInput, 'Email inválido.');
    } else if (err.code === 'auth/weak-password') {
      showError(externPasswordInput, 'Senha muito fraca. Use pelo menos 6 caracteres.');
    } else {
      showError(null, `Erro ao criar conta: ${err.message || 'Tente novamente'}`);
    }
  }
}

// ============================================
// AUTENTICAÇÃO COM GOOGLE
// ============================================

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google login realizado:", user);
    showSuccess(`Bem-vindo, ${user.displayName || user.email}!`);
    updateAuthUI();
  } catch (err) {
    console.error("Erro no Google Sign-In:", err);
    
    if (err.code === 'auth/popup-blocked') {
      showError(null, 'Pop-up bloqueado. Por favor, permita pop-ups para este site.');
    } else if (err.code === 'auth/popup-closed-by-user') {
      console.log('Usuário fechou a janela de autenticação.');
    } else {
      showError(null, `Erro: ${err.message || 'Falha na autenticação com Google'}`);
    }
  }
}

// ============================================
// LOGOUT
// ============================================

async function handleSignOut() {
  if (!auth.currentUser) {
    showError(null, 'Nenhum usuário está logado.');
    return;
  }
  
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
    showSuccess('Logout realizado com sucesso!');
    clearFormInputs();
    updateAuthUI();
  } catch (err) {
    console.error('Erro ao deslogar:', err);
    showError(null, `Erro: ${err.message || 'Falha ao deslogar'}`);
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Validação de email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha
function validatePassword(password) {
  return password.length >= 6;
}

// Mostrar mensagem de erro
function showError(inputElement, message) {
  // Limpar erros anteriores
  clearErrors();
  
  // Adicionar classe de erro ao input
  if (inputElement) {
    inputElement.classList.add('form-control--invalid');
    
    // Criar elemento de mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'form-help form-help--error';
    errorElement.textContent = message;
    
    // Inserir após o input
    const wrapper = inputElement.closest('.input-wrapper') || inputElement.parentElement;
    wrapper.appendChild(errorElement);
  } else if (authStatusElement) {
    // Usar authStatus para mensagens gerais
    authStatusElement.textContent = message;
    authStatusElement.className = 'form-help form-help--error';
  } else {
    alert(message);
  }
}

// Mostrar mensagem de sucesso
function showSuccess(message) {
  if (authStatusElement) {
    authStatusElement.textContent = message;
    authStatusElement.className = 'form-help form-help--success';
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
      if (authStatusElement.textContent === message) {
        updateAuthStatus();
      }
    }, 3000);
  } else {
    alert(message);
  }
}

// Limpar erros
function clearErrors() {
  // Remover classes de erro dos inputs
  document.querySelectorAll('.form-control--invalid').forEach(el => {
    el.classList.remove('form-control--invalid');
  });
  
  // Remover mensagens de erro
  document.querySelectorAll('.form-help--error').forEach(el => {
    el.remove();
  });
  
  // Resetar authStatus se estiver mostrando erro
  if (authStatusElement && authStatusElement.classList.contains('form-help--error')) {
    updateAuthStatus();
  }
}

// Limpar campos dos formulários
function clearFormInputs() {
  if (externEmailInput) externEmailInput.value = '';
  if (externPasswordInput) externPasswordInput.value = '';
  if (vwEmailInput) vwEmailInput.value = '';
  if (vwPasswordInput) vwPasswordInput.value = '';
  
  // Resetar ícones de mostrar senha
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    const eyeIcon = toggle.querySelector('.toggle-icon--eye');
    const eyeSlashIcon = toggle.querySelector('.toggle-icon--eye-slash');
    
    if (eyeIcon) eyeIcon.style.display = 'block';
    if (eyeSlashIcon) eyeSlashIcon.style.display = 'none';
  });
}

// Atualizar interface baseada no estado de autenticação
function updateAuthUI() {
  const user = auth.currentUser;
  
  if (user) {
    updateAuthStatus(user);
    disableSignInButtons(true);
    
    // Preencher automaticamente o formulário correspondente
    const email = user.email || '';
    if (email.includes('@volkswagen') && vwEmailInput) {
      vwEmailInput.value = email;
    } else if (externEmailInput) {
      externEmailInput.value = email;
    }
  } else {
    updateAuthStatus(null);
    disableSignInButtons(false);
  }
}

// Atualizar status de autenticação
function updateAuthStatus(user = null) {
  if (!authStatusElement) return;
  
  if (user) {
    const userName = user.displayName || user.email || 'Usuário';
    const provider = user.providerData && user.providerData[0];
    let userType = 'Externo';
    
    if (user.email && user.email.includes('@volkswagen')) {
      userType = 'Volkswagen';
    } else if (provider && provider.providerId === 'google.com') {
      userType = 'Google';
    }
    
    authStatusElement.textContent = `Conectado: ${userName} (${userType})`;
    authStatusElement.className = 'form-help form-help--success';
  } else {
    authStatusElement.textContent = 'Desconectado';
    authStatusElement.className = 'form-help form-help--info';
  }
}

// Habilita/desabilita botões de login
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
      button.style.cursor = disable ? 'not-allowed' : 'pointer';
    }
  });
}

// ============================================
// LISTENER DE ESTADO DE AUTENTICAÇÃO DO FIREBASE
// ============================================

onAuthStateChanged(auth, (user) => {
  updateAuthUI();
  
  // Log para debug
  if (user) {
    console.log('Usuário autenticado:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      provider: user.providerData && user.providerData[0]?.providerId
    });
  } else {
    console.log('Nenhum usuário autenticado');
  }
});

// ============================================
// EXPORT PARA MÓDULOS (se necessário)
// ============================================

// Exportar funções se necessário para outros módulos
export {
  auth,
  handleExternFormSubmit,
  handleVwFormSubmit,
  signInWithGoogle,
  handleSignOut,
  updateAuthUI
};