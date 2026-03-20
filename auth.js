import { SUPABASE_READY, getConfigMessage, supabase } from './supabase.js';

const elements = {
  authScreen: document.getElementById('auth-screen'),
  appShell: document.getElementById('app-shell'),
  authConfigNote: document.getElementById('auth-config-note'),
  messages: document.getElementById('messages'),
  tabSignup: document.getElementById('tab-signup'),
  tabLogin: document.getElementById('tab-login'),
  showReset: document.getElementById('show-reset'),
  signupForm: document.getElementById('signup-form'),
  loginForm: document.getElementById('login-form'),
  resetForm: document.getElementById('reset-form'),
};

const htmlEscape = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

const toggleHidden = (element, hidden) => {
  if (!element) return;
  element.classList.toggle('hidden', hidden);
};

const showMessage = (text, type = 'success') => {
  if (!elements.messages) return;
  elements.messages.innerHTML = `<div class="message ${type}">${htmlEscape(text)}</div>`;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    elements.messages.innerHTML = '';
  }, 8000);
};

const switchAuthTab = (tabName) => {
  const tabs = [
    { button: elements.tabSignup, form: elements.signupForm, name: 'signup' },
    { button: elements.tabLogin, form: elements.loginForm, name: 'login' },
  ];

  tabs.forEach((tab) => {
    if (!tab.button || !tab.form) return;
    const active = tab.name === tabName;
    tab.button.classList.toggle('active-tab', active);
    toggleHidden(tab.form, !active);
    tab.form.classList.toggle('active-auth-form', active);
  });

  if (elements.resetForm && tabName !== 'login') {
    toggleHidden(elements.resetForm, true);
  }
};

const updateAuthAvailability = () => {
  const buttons = [
    elements.signupForm?.querySelector('button[type="submit"]'),
    elements.loginForm?.querySelector('button[type="submit"]'),
    elements.resetForm?.querySelector('button[type="submit"]'),
  ].filter(Boolean);

  if (!SUPABASE_READY || !supabase) {
    if (elements.authConfigNote) {
      elements.authConfigNote.textContent = getConfigMessage();
      toggleHidden(elements.authConfigNote, false);
    }
    buttons.forEach((button) => {
      button.disabled = true;
    });
    return;
  }

  if (elements.authConfigNote) {
    elements.authConfigNote.textContent = '';
    toggleHidden(elements.authConfigNote, true);
  }
  buttons.forEach((button) => {
    button.disabled = false;
  });
};

const handleSignup = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value || '';
  const fullName = document.getElementById('signup-name')?.value.trim() || '';
  const submitButton = elements.signupForm?.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || 'Create Account';

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Creating Account...';
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.href,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    const identities = data?.user?.identities || [];
    if (Array.isArray(identities) && identities.length === 0) {
      showMessage('This email may already be registered. Try Login or use Forgot password.', 'error');
      return;
    }

    elements.signupForm?.reset();

    if (data?.session) {
      showMessage('Account created and signed in successfully.');
      window.setTimeout(() => window.location.reload(), 1000);
      return;
    }

    switchAuthTab('login');
    showMessage('Account created. Please check your email inbox and confirm your email before logging in.');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Signup failed.', 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
};

const handleLogin = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value || '';
  const submitButton = elements.loginForm?.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || 'Login With Email';

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Signing In...';
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    elements.loginForm?.reset();
    showMessage('Signed in successfully.');
    window.setTimeout(() => window.location.reload(), 800);
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Login failed.', 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
};

const handlePasswordReset = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('reset-email')?.value.trim();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href,
    });
    if (error) throw error;
    elements.resetForm?.reset();
    showMessage('Password reset email sent. Check your inbox.');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Password reset failed.', 'error');
  }
};

const init = () => {
  updateAuthAvailability();

  elements.tabSignup?.addEventListener('click', () => switchAuthTab('signup'));
  elements.tabLogin?.addEventListener('click', () => switchAuthTab('login'));
  elements.showReset?.addEventListener('click', () => toggleHidden(elements.resetForm, !elements.resetForm.classList.contains('hidden')));
  elements.signupForm?.addEventListener('submit', handleSignup);
  elements.loginForm?.addEventListener('submit', handleLogin);
  elements.resetForm?.addEventListener('submit', handlePasswordReset);

  document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('change', (event) => {
      const input = document.getElementById(event.target.dataset.passwordToggle);
      if (input) input.type = event.target.checked ? 'text' : 'password';
    });
  });

  supabase?.auth.onAuthStateChange((_event, session) => {
    if (elements.authScreen && elements.appShell) {
      toggleHidden(elements.authScreen, Boolean(session));
      toggleHidden(elements.appShell, !session);
    }
  });
};

init();
