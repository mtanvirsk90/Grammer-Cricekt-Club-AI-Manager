import { GOOGLE_CLIENT_ID, SUPABASE_READY, getConfigMessage, supabase } from './supabase.js';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DEFAULT_PLAYERS_RANGE = 'Players!A:G';
const PLAYER_HEADERS = ['name', 'club_name', 'jersey_number', 'player_category', 'batsman_type', 'bowler_type', 'profile_image_url'];

const byId = (id) => document.getElementById(id);

const elements = {
  authScreen: byId('auth-screen'),
  messages: byId('messages'),
  appMessages: byId('app-messages'),
  sheetsFeedback: byId('sheets-feedback'),
  sheetConnectionForm: byId('sheet-connection-form'),
  googleClientStatus: byId('google-client-status'),
  sheetSpreadsheetInput: byId('sheet-spreadsheet-input'),
  sheetPlayersRange: byId('sheet-players-range'),
  sheetOauthStatus: byId('sheet-oauth-status'),
  sheetAuthorizeButton: byId('sheet-authorize-button'),
  sheetSaveButton: byId('sheet-save-button'),
  sheetDisconnectButton: byId('sheet-disconnect-button'),
  sheetConnectionSummary: byId('sheet-connection-summary'),
  sheetPermissionsList: byId('sheet-permissions-list'),
  sheetSyncSummary: byId('sheet-sync-summary'),
  sheetPermissionSummary: byId('sheet-permission-summary'),
  sheetImportPlayersButton: byId('sheet-import-players-button'),
  sheetExportPlayersButton: byId('sheet-export-players-button'),
};

const state = {
  session: null,
  profile: null,
  connection: null,
  permission: null,
  profiles: [],
  permissions: [],
  tokenClient: null,
  accessToken: '',
};

const htmlEscape = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

const showMessage = (text, type = 'success') => {
  const target = elements.sheetsFeedback || (!elements.authScreen?.classList.contains('hidden') ? elements.messages : (elements.appMessages || elements.messages));
  if (!target) return;
  target.innerHTML = `<div class="message ${type}">${htmlEscape(text)}</div>`;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    target.innerHTML = '';
  }, 8000);
};

const toggleDisabled = (element, disabled) => {
  if (element) element.disabled = disabled;
};

const parseSpreadsheetId = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';
  const match = text.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] || text;
};

const getSpreadsheetUrl = (spreadsheetId) =>
  spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : '';

const isGoogleConfigured = () =>
  GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com';

const isAdmin = () => ['admin', 'super_admin'].includes(state.profile?.access_level);

const canCurrentUser = (permissionName) => {
  if (isAdmin()) return true;
  if (!state.permission) return false;
  return Boolean(state.permission[permissionName]);
};

const requireSupabase = () => {
  if (!SUPABASE_READY || !supabase) {
    throw new Error(getConfigMessage());
  }
};

const getSession = async () => {
  requireSupabase();
  if (state.session) return state.session;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data?.session) throw new Error('Please sign in first.');
  state.session = data.session;
  return state.session;
};

const getAuthHeader = () => {
  if (!state.accessToken) {
    throw new Error('Authorize Google Sheets first.');
  }

  return {
    Authorization: `Bearer ${state.accessToken}`,
    'Content-Type': 'application/json',
  };
};

const initTokenClient = () => {
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services did not load yet.');
  }

  if (state.tokenClient) return state.tokenClient;

  state.tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SHEETS_SCOPE,
    callback: (response) => {
      if (response?.error) {
        showMessage(response.error, 'error');
        return;
      }

      state.accessToken = response.access_token || '';
      if (elements.sheetOauthStatus) {
        elements.sheetOauthStatus.textContent = state.accessToken
          ? 'Authorized with Google Sheets in this browser session.'
          : 'Not connected to Google yet.';
      }
      showMessage('Google Sheets authorized successfully.');
    },
  });

  return state.tokenClient;
};

const requestSheetsAccess = () => {
  if (!isGoogleConfigured()) {
    throw new Error('Add your Google web client ID in config.js before using Google Sheets.');
  }

  const tokenClient = initTokenClient();
  tokenClient.requestAccessToken({ prompt: state.accessToken ? '' : 'consent' });
};

const loadProfile = async () => {
  const session = await getSession();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  state.profile = data;
};

const loadConnection = async () => {
  requireSupabase();
  const { data, error } = await supabase
    .from('google_sheet_connections')
    .select('*')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  state.connection = data || null;
};

const loadPermissions = async () => {
  requireSupabase();
  const session = await getSession();

  if (isAdmin()) {
    const [{ data: profiles, error: profilesError }, { data: permissions, error: permissionsError }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, access_level').order('created_at', { ascending: true }),
      supabase.from('google_sheet_permissions').select('*').order('created_at', { ascending: true }),
    ]);

    if (profilesError) throw profilesError;
    if (permissionsError) throw permissionsError;

    state.profiles = profiles || [];
    state.permissions = permissions || [];
  } else {
    state.profiles = [];
    state.permissions = [];
  }

  const { data, error } = await supabase
    .from('google_sheet_permissions')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  state.permission = data || null;
};

const renderConnection = () => {
  if (elements.googleClientStatus) {
    elements.googleClientStatus.textContent = isGoogleConfigured()
      ? 'Google web client ID is configured.'
      : 'Add your Google web client ID in config.js before using Google Sheets.';
  }

  if (elements.sheetOauthStatus) {
    elements.sheetOauthStatus.textContent = state.accessToken
      ? 'Authorized with Google Sheets in this browser session.'
      : 'Not connected to Google yet.';
  }

  if (!elements.sheetConnectionSummary) return;

  if (!state.connection) {
    elements.sheetConnectionSummary.innerHTML = '<div class="empty-state">No shared spreadsheet saved yet.</div>';
    if (elements.sheetSyncSummary) elements.sheetSyncSummary.textContent = 'No shared spreadsheet saved yet.';
    return;
  }

  elements.sheetConnectionSummary.innerHTML = `
    <article class="record-card">
      <h3>Active Spreadsheet</h3>
      <p class="record-meta">${htmlEscape(state.connection.spreadsheet_id)}</p>
      <p class="record-meta">Players range: ${htmlEscape(state.connection.players_range || DEFAULT_PLAYERS_RANGE)}</p>
      ${state.connection.spreadsheet_url ? `<p class="record-meta"><a href="${htmlEscape(state.connection.spreadsheet_url)}" target="_blank" rel="noreferrer">Open Google Sheet</a></p>` : ''}
    </article>
  `;

  if (elements.sheetSyncSummary) {
    elements.sheetSyncSummary.textContent = `${state.connection.spreadsheet_id} | ${state.connection.players_range || DEFAULT_PLAYERS_RANGE}`;
  }

  if (elements.sheetSpreadsheetInput) {
    elements.sheetSpreadsheetInput.value = state.connection.spreadsheet_url || state.connection.spreadsheet_id;
  }
  if (elements.sheetPlayersRange) {
    elements.sheetPlayersRange.value = state.connection.players_range || DEFAULT_PLAYERS_RANGE;
  }
};

const renderPermissionSummary = () => {
  if (!elements.sheetPermissionSummary) return;

  if (isAdmin()) {
    elements.sheetPermissionSummary.textContent = 'Admin access: full Google Sheets management enabled.';
    return;
  }

  if (!state.permission) {
    elements.sheetPermissionSummary.textContent = 'No Google Sheets permission assigned yet.';
    return;
  }

  const labels = [];
  if (state.permission.can_view) labels.push('view');
  if (state.permission.can_import) labels.push('import');
  if (state.permission.can_export) labels.push('export');
  elements.sheetPermissionSummary.textContent = labels.length
    ? `Allowed to ${labels.join(', ')}.`
    : 'No Google Sheets permission assigned yet.';
};

const renderPermissions = () => {
  if (!elements.sheetPermissionsList) return;

  if (!isAdmin()) {
    elements.sheetPermissionsList.innerHTML = '<div class="empty-state">Admin access is required to manage user spreadsheet permissions.</div>';
    return;
  }

  if (!state.profiles.length) {
    elements.sheetPermissionsList.innerHTML = '<div class="empty-state">No users found yet.</div>';
    return;
  }

  elements.sheetPermissionsList.innerHTML = state.profiles.map((profile) => {
    const permission = state.permissions.find((entry) => entry.user_id === profile.id) || {};
    return `
      <article class="record-card">
        <div class="record-row">
          <div>
            <h3>${htmlEscape(profile.full_name || profile.email || 'Unnamed user')}</h3>
            <p class="record-meta">${htmlEscape(profile.email || 'No email')} | ${htmlEscape(profile.access_level || 'user')}</p>
          </div>
          <div class="record-actions role-row">
            <label class="selection-chip"><input type="checkbox" data-sheet-permission="can_view" data-user-id="${profile.id}" ${permission.can_view ? 'checked' : ''} /><span>View</span></label>
            <label class="selection-chip"><input type="checkbox" data-sheet-permission="can_import" data-user-id="${profile.id}" ${permission.can_import ? 'checked' : ''} /><span>Import</span></label>
            <label class="selection-chip"><input type="checkbox" data-sheet-permission="can_export" data-user-id="${profile.id}" ${permission.can_export ? 'checked' : ''} /><span>Export</span></label>
            <button type="button" class="secondary-action" data-sheet-action="save-permission" data-user-id="${profile.id}">Save</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
};

const updateControlState = () => {
  const canManage = isAdmin();
  toggleDisabled(elements.sheetAuthorizeButton, !isGoogleConfigured());
  toggleDisabled(elements.sheetSaveButton, !canManage);
  toggleDisabled(elements.sheetDisconnectButton, !canManage || !state.connection);
  toggleDisabled(elements.sheetImportPlayersButton, !canCurrentUser('can_import') || !state.connection);
  toggleDisabled(elements.sheetExportPlayersButton, !canCurrentUser('can_export') || !state.connection);
};

const saveConnection = async () => {
  if (!isAdmin()) {
    showMessage('Only admins can manage the shared spreadsheet.', 'error');
    return;
  }

  const session = await getSession();
  const spreadsheetId = parseSpreadsheetId(elements.sheetSpreadsheetInput?.value);
  const playersRange = String(elements.sheetPlayersRange?.value || DEFAULT_PLAYERS_RANGE).trim() || DEFAULT_PLAYERS_RANGE;

  if (!spreadsheetId) {
    showMessage('Enter a spreadsheet URL or ID first.', 'error');
    return;
  }

  const payload = {
    spreadsheet_id: spreadsheetId,
    spreadsheet_url: getSpreadsheetUrl(spreadsheetId),
    players_range: playersRange,
    status: 'active',
    connected_by: session.user.id,
    updated_at: new Date().toISOString(),
  };

  if (state.connection?.id) {
    const { error } = await supabase.from('google_sheet_connections').update(payload).eq('id', state.connection.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('google_sheet_connections').insert([payload]);
    if (error) throw error;
  }

  await loadConnection();
  renderConnection();
  updateControlState();
  showMessage('Shared spreadsheet saved successfully.');
};

const disconnectConnection = async () => {
  if (!isAdmin()) {
    showMessage('Only admins can disconnect the shared spreadsheet.', 'error');
    return;
  }

  if (!state.connection?.id) {
    showMessage('No shared spreadsheet is connected right now.', 'error');
    return;
  }

  const { error } = await supabase.from('google_sheet_connections').delete().eq('id', state.connection.id);
  if (error) throw error;

  state.connection = null;
  renderConnection();
  updateControlState();
  showMessage('Shared spreadsheet disconnected.');
};

const savePermission = async (userId) => {
  if (!isAdmin()) {
    showMessage('Only admins can change Google Sheets permissions.', 'error');
    return;
  }

  const session = await getSession();
  const inputs = [...document.querySelectorAll(`[data-user-id="${userId}"][data-sheet-permission]`)];
  const payload = {
    user_id: userId,
    can_view: inputs.find((input) => input.dataset.sheetPermission === 'can_view')?.checked || false,
    can_import: inputs.find((input) => input.dataset.sheetPermission === 'can_import')?.checked || false,
    can_export: inputs.find((input) => input.dataset.sheetPermission === 'can_export')?.checked || false,
    assigned_by: session.user.id,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('google_sheet_permissions').upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;

  await loadPermissions();
  renderPermissions();
  renderPermissionSummary();
  updateControlState();
  showMessage('Google Sheets permission updated.');
};

const loadTeams = async () => {
  const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

const loadPlayers = async () => {
  const { data, error } = await supabase.from('players').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

const fetchSheetValues = async (spreadsheetId, range) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    headers: getAuthHeader(),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || 'Google Sheets read failed.');
  return payload.values || [];
};

const writeSheetValues = async (spreadsheetId, range, values) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || 'Google Sheets write failed.');
  return payload;
};

const importPlayers = async () => {
  if (!canCurrentUser('can_import')) {
    showMessage('You do not have permission to import from Google Sheets.', 'error');
    return;
  }

  if (!state.connection) {
    showMessage('No shared spreadsheet is saved yet.', 'error');
    return;
  }

  if (!state.accessToken) {
    showMessage('Authorize Google Sheets in this browser session first.', 'error');
    return;
  }

  const [teams, values, session] = await Promise.all([
    loadTeams(),
    fetchSheetValues(state.connection.spreadsheet_id, state.connection.players_range || DEFAULT_PLAYERS_RANGE),
    getSession(),
  ]);

  const homeTeam = teams.find((team) => {
    const labels = Array.isArray(team.squad_labels) ? team.squad_labels : [];
    return labels.some((label) => String(label).includes('club_type:home'));
  });

  if (!homeTeam) {
    throw new Error('Save at least one Home Club first so imported players can be linked.');
  }

  if (!values.length) {
    showMessage('The Google Sheet range is empty.', 'error');
    return;
  }

  const [firstRow, ...dataRows] = values;
  const headers = firstRow.map((value) => String(value || '').trim().toLowerCase());
  const useHeaderRow = headers.includes('name');
  const rows = useHeaderRow ? dataRows : values;
  const effectiveHeaders = useHeaderRow ? headers : PLAYER_HEADERS;

  const payload = rows
    .map((row) => effectiveHeaders.reduce((record, header, index) => {
      record[header] = row[index] || '';
      return record;
    }, {}))
    .filter((row) => String(row.name || '').trim())
    .map((row) => {
      const matchedTeam = teams.find((team) => team.name.toLowerCase() === String(row.club_name || '').trim().toLowerCase());
      const team = matchedTeam || homeTeam;
      return {
        name: String(row.name || '').trim(),
        team_id: team.id,
        jersey_number: Number(row.jersey_number) || 0,
        role: row.player_category || 'Player',
        batsman_type: row.batsman_type || '',
        bowler_type: row.bowler_type || '',
        batting_style: row.batsman_type || '',
        bowling_style: row.bowler_type || '',
        player_category: row.player_category || 'Player',
        profile_image_url: row.profile_image_url || '',
        created_by: session.user.id,
      };
    });

  if (!payload.length) {
    showMessage('No valid player rows were found in the Google Sheet.', 'error');
    return;
  }

  const { error } = await supabase.from('players').insert(payload);
  if (error) throw error;

  window.dispatchEvent(new CustomEvent('gcc:refresh-data'));
  showMessage(`Imported ${payload.length} players from Google Sheets.`);
};

const exportPlayers = async () => {
  if (!canCurrentUser('can_export')) {
    showMessage('You do not have permission to export to Google Sheets.', 'error');
    return;
  }

  if (!state.connection) {
    showMessage('No shared spreadsheet is saved yet.', 'error');
    return;
  }

  if (!state.accessToken) {
    showMessage('Authorize Google Sheets in this browser session first.', 'error');
    return;
  }

  const [teams, players] = await Promise.all([loadTeams(), loadPlayers()]);
  const rows = players.map((player) => {
    const team = teams.find((entry) => String(entry.id) === String(player.team_id));
    return [
      player.name || '',
      team?.name || '',
      player.jersey_number || '',
      player.player_category || player.role || '',
      player.batsman_type || player.batting_style || '',
      player.bowler_type || player.bowling_style || '',
      player.profile_image_url || '',
    ];
  });

  await writeSheetValues(state.connection.spreadsheet_id, state.connection.players_range || DEFAULT_PLAYERS_RANGE, [PLAYER_HEADERS, ...rows]);
  showMessage(`Exported ${rows.length} players to Google Sheets.`);
};

const bindEvents = () => {
  elements.sheetAuthorizeButton?.addEventListener('click', () => {
    try {
      requestSheetsAccess();
    } catch (error) {
      showMessage(error.message || 'Google Sheets authorization failed.', 'error');
    }
  });

  elements.sheetSaveButton?.addEventListener('click', () => {
    Promise.resolve(saveConnection()).catch((error) => {
      console.error(error);
      showMessage(error.message || 'Spreadsheet save failed.', 'error');
    });
  });

  elements.sheetDisconnectButton?.addEventListener('click', () => {
    Promise.resolve(disconnectConnection()).catch((error) => {
      console.error(error);
      showMessage(error.message || 'Spreadsheet disconnect failed.', 'error');
    });
  });

  elements.sheetImportPlayersButton?.addEventListener('click', () => {
    Promise.resolve(importPlayers()).catch((error) => {
      console.error(error);
      showMessage(error.message || 'Player import failed.', 'error');
    });
  });

  elements.sheetExportPlayersButton?.addEventListener('click', () => {
    Promise.resolve(exportPlayers()).catch((error) => {
      console.error(error);
      showMessage(error.message || 'Player export failed.', 'error');
    });
  });

  elements.sheetPermissionsList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sheet-action="save-permission"]');
    if (!button) return;
    Promise.resolve(savePermission(button.dataset.userId)).catch((error) => {
      console.error(error);
      showMessage(error.message || 'Permission save failed.', 'error');
    });
  });
};

const refreshSheetsState = async () => {
  if (!SUPABASE_READY || !supabase) return;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    showMessage(error.message || 'Failed to read session.', 'error');
    return;
  }

  state.session = data?.session || null;
  if (!state.session) {
    state.profile = null;
    state.connection = null;
    state.permission = null;
    state.profiles = [];
    state.permissions = [];
    renderConnection();
    renderPermissions();
    renderPermissionSummary();
    updateControlState();
    return;
  }

  await loadProfile();
  await Promise.all([loadConnection(), loadPermissions()]);
  renderConnection();
  renderPermissions();
  renderPermissionSummary();
  updateControlState();
};

const init = async () => {
  bindEvents();
  renderConnection();
  renderPermissions();
  renderPermissionSummary();
  updateControlState();

  if (!SUPABASE_READY || !supabase) return;

  await refreshSheetsState();
  supabase.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await refreshSheetsState();
  });
};

init().catch((error) => {
  console.error(error);
  showMessage(error.message || 'Google Sheets sync could not start.', 'error');
});
