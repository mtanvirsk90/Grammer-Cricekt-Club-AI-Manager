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
  sessionEmail: document.getElementById('session-email'),
  sessionRole: document.getElementById('session-role'),
  logoutButton: document.getElementById('logout-button'),
  mainTabHome: document.getElementById('main-tab-home'),
  mainTabDatabase: document.getElementById('main-tab-database'),
  mainTabMatches: document.getElementById('main-tab-matches'),
  mainTabResults: document.getElementById('main-tab-results'),
  mainTabPoster: document.getElementById('main-tab-poster'),
  mainPaneHome: document.getElementById('main-pane-home'),
  mainPaneDatabase: document.getElementById('main-pane-database'),
  mainPaneMatches: document.getElementById('main-pane-matches'),
  mainPaneResults: document.getElementById('main-pane-results'),
  mainPanePoster: document.getElementById('main-pane-poster'),
  databaseTabPlayers: document.getElementById('database-tab-players'),
  databaseTabClubs: document.getElementById('database-tab-clubs'),
  databaseTabGrounds: document.getElementById('database-tab-grounds'),
  databaseTabSocial: document.getElementById('database-tab-social'),
  databasePanePlayers: document.getElementById('database-pane-players'),
  databasePaneClubs: document.getElementById('database-pane-clubs'),
  databasePaneGrounds: document.getElementById('database-pane-grounds'),
  databasePaneSocial: document.getElementById('database-pane-social'),
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

const switchMainTab = (tabName) => {
  const tabs = [
    { button: elements.mainTabHome, pane: elements.mainPaneHome, name: 'home' },
    { button: elements.mainTabDatabase, pane: elements.mainPaneDatabase, name: 'database' },
    { button: elements.mainTabMatches, pane: elements.mainPaneMatches, name: 'matches' },
    { button: elements.mainTabResults, pane: elements.mainPaneResults, name: 'results' },
    { button: elements.mainTabPoster, pane: elements.mainPanePoster, name: 'poster' },
  ];

  tabs.forEach((tab) => {
    if (!tab.button || !tab.pane) return;
    const active = tab.name === tabName;
    tab.button.classList.toggle('active-workspace-tab', active);
    toggleHidden(tab.pane, !active);
  });
};

const switchDatabaseTab = (tabName) => {
  const tabs = [
    { button: elements.databaseTabPlayers, pane: elements.databasePanePlayers, name: 'players' },
    { button: elements.databaseTabClubs, pane: elements.databasePaneClubs, name: 'clubs' },
    { button: elements.databaseTabGrounds, pane: elements.databasePaneGrounds, name: 'grounds' },
    { button: elements.databaseTabSocial, pane: elements.databasePaneSocial, name: 'social' },
  ];

  tabs.forEach((tab) => {
    if (!tab.button || !tab.pane) return;
    const active = tab.name === tabName;
    tab.button.classList.toggle('active-workspace-tab', active);
    toggleHidden(tab.pane, !active);
  });
};

const updateSessionCard = async (session) => {
  if (!elements.sessionEmail || !elements.sessionRole || !elements.logoutButton) return;

  if (!session) {
    elements.sessionEmail.textContent = 'Not signed in';
    elements.sessionRole.textContent = 'Role: guest';
    elements.logoutButton.disabled = true;
    return;
  }

  let role = 'user';

  if (SUPABASE_READY && supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('access_level')
        .eq('id', session.user.id)
        .maybeSingle();

      if (data?.access_level) role = data.access_level;
    } catch (error) {
      console.error(error);
    }
  }

  elements.sessionEmail.textContent = session.user.email || 'Signed in';
  elements.sessionRole.textContent = `Role: ${role}`;
  elements.logoutButton.disabled = false;
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

const handleLogout = async () => {
  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showMessage('Signed out successfully.');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Logout failed.', 'error');
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
  elements.logoutButton?.addEventListener('click', handleLogout);
  elements.mainTabHome?.addEventListener('click', () => switchMainTab('home'));
  elements.mainTabDatabase?.addEventListener('click', () => switchMainTab('database'));
  elements.mainTabMatches?.addEventListener('click', () => switchMainTab('matches'));
  elements.mainTabResults?.addEventListener('click', () => switchMainTab('results'));
  elements.mainTabPoster?.addEventListener('click', () => switchMainTab('poster'));
  elements.databaseTabPlayers?.addEventListener('click', () => switchDatabaseTab('players'));
  elements.databaseTabClubs?.addEventListener('click', () => switchDatabaseTab('clubs'));
  elements.databaseTabGrounds?.addEventListener('click', () => switchDatabaseTab('grounds'));
  elements.databaseTabSocial?.addEventListener('click', () => switchDatabaseTab('social'));

  document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('change', (event) => {
      const input = document.getElementById(event.target.dataset.passwordToggle);
      if (input) input.type = event.target.checked ? 'text' : 'password';
    });
  });

  supabase?.auth.getSession().then(({ data }) => {
    const session = data?.session || null;
    toggleHidden(elements.authScreen, Boolean(session));
    toggleHidden(elements.appShell, !session);
    updateSessionCard(session);
    switchMainTab('home');
    switchDatabaseTab('players');
  });

  supabase?.auth.onAuthStateChange((_event, session) => {
    if (elements.authScreen && elements.appShell) {
      toggleHidden(elements.authScreen, Boolean(session));
      toggleHidden(elements.appShell, !session);
    }
    updateSessionCard(session);
    switchMainTab('home');
    switchDatabaseTab('players');
  });
};

init();
