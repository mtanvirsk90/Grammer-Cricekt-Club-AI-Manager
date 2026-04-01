import { SUPABASE_READY, getConfigMessage, schemaSQL, supabase } from './supabase.js';

const SUPER_ADMIN_EMAILS = ['mtanvir.sk90@gmail.com'];
const DEFAULT_MAIN_TAB = 'home';
const DEFAULT_DATABASE_TAB = 'players';

const elements = {
  authScreen: document.getElementById('auth-screen'),
  appShell: document.getElementById('app-shell'),
  messages: document.getElementById('messages'),
  appMessages: document.getElementById('app-messages'),
  authConfigNote: document.getElementById('auth-config-note'),
  schemaSql: document.getElementById('schema-sql'),
  mainTabHome: document.getElementById('main-tab-home'),
  mainTabDatabase: document.getElementById('main-tab-database'),
  mainTabMatches: document.getElementById('main-tab-matches'),
  mainTabResults: document.getElementById('main-tab-results'),
  mainTabPoster: document.getElementById('main-tab-poster'),
  mainTabAdmin: document.getElementById('main-tab-admin'),
  mainPaneHome: document.getElementById('main-pane-home'),
  mainPaneDatabase: document.getElementById('main-pane-database'),
  mainPaneMatches: document.getElementById('main-pane-matches'),
  mainPaneResults: document.getElementById('main-pane-results'),
  mainPanePoster: document.getElementById('main-pane-poster'),
  mainPaneAdmin: document.getElementById('main-pane-admin'),
  databaseTabPlayers: document.getElementById('database-tab-players'),
  databaseTabClubs: document.getElementById('database-tab-clubs'),
  databaseTabGrounds: document.getElementById('database-tab-grounds'),
  databaseTabSocial: document.getElementById('database-tab-social'),
  databaseTabSheets: document.getElementById('database-tab-sheets'),
  databasePanePlayers: document.getElementById('database-pane-players'),
  databasePaneClubs: document.getElementById('database-pane-clubs'),
  databasePaneGrounds: document.getElementById('database-pane-grounds'),
  databasePaneSocial: document.getElementById('database-pane-social'),
  databasePaneSheets: document.getElementById('database-pane-sheets'),
  tabLogin: document.getElementById('tab-login'),
  tabSignup: document.getElementById('tab-signup'),
  showReset: document.getElementById('show-reset'),
  signupForm: document.getElementById('signup-form'),
  loginForm: document.getElementById('login-form'),
  resetForm: document.getElementById('reset-form'),
  logoutButton: document.getElementById('logout-button'),
  sessionEmail: document.getElementById('session-email'),
  sessionRole: document.getElementById('session-role'),
  adminSection: document.getElementById('admin-section'),
  profilesList: document.getElementById('profiles-list'),
  teamForm: document.getElementById('team-form'),
  teamEditId: document.getElementById('team-edit-id'),
  teamSubmitButton: document.getElementById('team-submit-button'),
  teamCancelEdit: document.getElementById('team-cancel-edit'),
  teamsList: document.getElementById('teams-list'),
  teamsSearch: document.getElementById('teams-search'),
  teamsExport: document.getElementById('teams-export'),
  teamsTemplate: document.getElementById('teams-template'),
  teamsImportFile: document.getElementById('teams-import-file'),
  teamsPagination: document.getElementById('teams-pagination'),
  teamsViewMode: document.getElementById('teams-view-mode'),
  teamsSort: document.getElementById('teams-sort'),
  teamsSelectPage: document.getElementById('teams-select-page'),
  teamsBulkDelete: document.getElementById('teams-bulk-delete'),
  teamLogoUrl: document.getElementById('team-logo-url'),
  teamLogoFile: document.getElementById('team-logo-file'),
  teamClubType: document.getElementById('team-club-type'),
  socialLinkForm: document.getElementById('social-link-form'),
  socialLinksList: document.getElementById('social-links-list'),
  venueForm: document.getElementById('venue-form'),
  venueEditId: document.getElementById('venue-edit-id'),
  venueSubmitButton: document.getElementById('venue-submit-button'),
  venueCancelEdit: document.getElementById('venue-cancel-edit'),
  venuesList: document.getElementById('venues-list'),
  venuesSearch: document.getElementById('venues-search'),
  venuesPagination: document.getElementById('venues-pagination'),
  venueAddress: document.getElementById('venue-address'),
  venueImageUrls: document.getElementById('venue-image-urls'),
  venueImageFiles: document.getElementById('venue-image-files'),
  playerForm: document.getElementById('player-form'),
  playerEditId: document.getElementById('player-edit-id'),
  playerSubmitButton: document.getElementById('player-submit-button'),
  playerCancelEdit: document.getElementById('player-cancel-edit'),
  playersList: document.getElementById('players-list'),
  playersCategoryFilter: document.getElementById('players-category-filter'),
  playersSearch: document.getElementById('players-search'),
  playersExport: document.getElementById('players-export'),
  playersTemplate: document.getElementById('players-template'),
  playersImportFile: document.getElementById('players-import-file'),
  playersPagination: document.getElementById('players-pagination'),
  playersViewMode: document.getElementById('players-view-mode'),
  playersSort: document.getElementById('players-sort'),
  playersSelectPage: document.getElementById('players-select-page'),
  playersBulkDelete: document.getElementById('players-bulk-delete'),
  playerProfileFile: document.getElementById('player-profile-file'),
  playerImageStyleMode: document.getElementById('player-image-style-mode'),
  matchForm: document.getElementById('match-form'),
  matchEditId: document.getElementById('match-edit-id'),
  matchSubmitButton: document.getElementById('match-submit-button'),
  matchCancelEdit: document.getElementById('match-cancel-edit'),
  matchesList: document.getElementById('matches-list'),
  matchesSearch: document.getElementById('matches-search'),
  matchesPagination: document.getElementById('matches-pagination'),
  lineupForm: document.getElementById('lineup-form'),
  lineupMatch: document.getElementById('lineup-match'),
  lineupTeamSide: document.getElementById('lineup-team-side'),
  lineupPlayer: document.getElementById('lineup-player'),
  lineupRole: document.getElementById('lineup-role'),
  lineupList: document.getElementById('lineup-list'),
  lineupCount: document.getElementById('lineup-count'),
  lineupMatchSummary: document.getElementById('lineup-match-summary'),
  resultForm: document.getElementById('result-form'),
  resultEditId: document.getElementById('result-edit-id'),
  resultSubmitButton: document.getElementById('result-submit-button'),
  resultCancelEdit: document.getElementById('result-cancel-edit'),
  resultMatch: document.getElementById('result-match'),
  playerOfMatch: document.getElementById('player-of-match'),
  bestScorerName: document.getElementById('best-scorer-name'),
  bestBowlerName: document.getElementById('best-bowler-name'),
  winnerTeam: document.getElementById('winner-team'),
  tossWinner: document.getElementById('toss-winner'),
  resultsList: document.getElementById('results-list'),
  resultsSearch: document.getElementById('results-search'),
  resultsPagination: document.getElementById('results-pagination'),
  resultPosterMatch: document.getElementById('result-poster-match'),
  resultPosterHost: document.getElementById('result-poster'),
  generateResultPoster: document.getElementById('generate-result-poster'),
  downloadResultPoster: document.getElementById('download-result-poster'),
  resultPosterSponsorImages: document.getElementById('result-poster-sponsor-images'),
  resultPosterSocialLinks: document.getElementById('result-poster-social-links'),
  resultCaptionOutput: document.getElementById('result-caption-output'),
  posterMatch: document.getElementById('poster-match'),
  posterType: document.getElementById('poster-type'),
  posterMatchPicker: document.getElementById('poster-match-picker'),
  posterPlatform: document.getElementById('poster-platform'),
  posterVisualMode: document.getElementById('poster-visual-mode'),
  posterVenueImage: document.getElementById('poster-venue-image'),
  posterSponsorImages: document.getElementById('poster-sponsor-images'),
  posterSocialLinks: document.getElementById('poster-social-links'),
  posterSelection: document.getElementById('poster-selection'),
  posterSelectionLabel: document.getElementById('poster-selection-label'),
  posterHost: document.getElementById('poster'),
  posterCaptionOutput: document.getElementById('poster-caption-output'),
  generatePoster: document.getElementById('generate-poster'),
  downloadPoster: document.getElementById('download-poster'),
  playerTeam: document.getElementById('player-team'),
  matchTeam1: document.getElementById('match-team1'),
  matchTeam2: document.getElementById('match-team2'),
  matchVenue: document.getElementById('match-venue'),
  matchHomeDatalist: document.getElementById('match-home-datalist'),
  matchAwayDatalist: document.getElementById('match-away-datalist'),
  matchVenueDatalist: document.getElementById('match-venue-datalist'),
  statsGrid: document.getElementById('stats-grid'),
  homeUpcomingList: document.getElementById('home-upcoming-list'),
  homeResultsList: document.getElementById('home-results-list'),
  homeClubsList: document.getElementById('home-clubs-list'),
  homePlayersList: document.getElementById('home-players-list'),
  homeNavSchedule: document.getElementById('home-nav-schedule'),
  homeNavResults: document.getElementById('home-nav-results'),
  homeNavUpcoming: document.getElementById('home-nav-upcoming'),
  homeNavLatestResults: document.getElementById('home-nav-latest-results'),
  homeNavClubs: document.getElementById('home-nav-clubs'),
  homeNavPosters: document.getElementById('home-nav-posters'),
  homeNavScheduleMeta: document.getElementById('home-nav-schedule-meta'),
  homeNavResultsMeta: document.getElementById('home-nav-results-meta'),
  homeNavUpcomingMeta: document.getElementById('home-nav-upcoming-meta'),
  homeNavLatestResultsMeta: document.getElementById('home-nav-latest-results-meta'),
  homeNavClubsMeta: document.getElementById('home-nav-clubs-meta'),
  homeNavPostersMeta: document.getElementById('home-nav-posters-meta'),
  homeWelcomeEmail: document.getElementById('home-welcome-email'),
  homeHeroBanner: document.querySelector('.home-hero-banner'),
  homeHeroLogo: document.getElementById('home-hero-logo'),
  homeHeroTitle: document.getElementById('home-hero-title'),
  homeHeroQuote: document.getElementById('home-hero-quote'),
  homeHeroGround: document.getElementById('home-hero-ground'),
  homeHeroVenueNote: document.getElementById('home-hero-venue-note'),
  homeActionPlayer: document.getElementById('home-action-player'),
  homeActionMatch: document.getElementById('home-action-match'),
  homeActionPoster: document.getElementById('home-action-poster'),
  topbarEmail: document.getElementById('topbar-email'),
  confirmModal: document.getElementById('confirm-modal'),
  confirmTitle: document.getElementById('confirm-title'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmCancel: document.getElementById('confirm-cancel'),
  confirmAccept: document.getElementById('confirm-accept'),
};

const state = {
  session: null,
  profile: null,
  profiles: [],
  teams: [],
  venues: [],
  socialLinks: [],
  players: [],
  matches: [],
  results: [],
  filters: {
    players: '',
    teams: '',
    venues: '',
    matches: '',
    results: '',
  },
  editingIds: {
    player: '',
    team: '',
    venue: '',
    match: '',
    result: '',
  },
  pagination: {
    players: 1,
    teams: 1,
    venues: 1,
    matches: 1,
    results: 1,
  },
  ui: {
    playersViewMode: 'cards',
    playersSort: 'name-asc',
    teamsViewMode: 'cards',
    teamsSort: 'name-asc',
    playersCategoryFilter: 'all',
    inlineLineupPlayerId: '',
    inlineLineupRole: 'player',
  },
  selectedRows: {
    players: new Set(),
    teams: new Set(),
  },
  lineupsByMatch: new Map(),
  transientResultMedia: new Map(),
  activePosterMatchIds: [],
  selectedPosterVariantKey: '',
  activeResultPosterMatchId: '',
  lastSavedMatchId: '',
  pendingConfirm: null,
};

window.__gccAppState = state;

const PLAYER_IMAGE_MODE_STORAGE_KEY = 'gcc-player-image-modes';
const readPlayerImageModes = () => {
  try {
    return JSON.parse(window.localStorage.getItem(PLAYER_IMAGE_MODE_STORAGE_KEY) || '{}');
  } catch (error) {
    console.error(error);
    return {};
  }
};
const writePlayerImageModes = (modes) => {
  try {
    window.localStorage.setItem(PLAYER_IMAGE_MODE_STORAGE_KEY, JSON.stringify(modes));
  } catch (error) {
    console.error(error);
  }
};
const getPlayerImageMode = (playerId) => readPlayerImageModes()[String(playerId)] || 'original';
const setPlayerImageMode = (playerId, mode) => {
  if (!playerId) return;
  const next = readPlayerImageModes();
  next[String(playerId)] = mode || 'original';
  writePlayerImageModes(next);
};

const getMainTabStorageKey = (session = state.session) => `gcc-active-main-tab:${session?.user?.id || 'guest'}`;
const getDatabaseTabStorageKey = (session = state.session) => `gcc-active-database-tab:${session?.user?.id || 'guest'}`;
const saveActiveMainTab = (tabName) => {
  try {
    window.localStorage.setItem(getMainTabStorageKey(), tabName);
  } catch (error) {
    console.error(error);
  }
};
const saveActiveDatabaseTab = (tabName) => {
  try {
    window.localStorage.setItem(getDatabaseTabStorageKey(), tabName);
  } catch (error) {
    console.error(error);
  }
};
const getSavedMainTab = () => {
  try {
    return window.localStorage.getItem(getMainTabStorageKey()) || DEFAULT_MAIN_TAB;
  } catch (error) {
    console.error(error);
    return DEFAULT_MAIN_TAB;
  }
};
const getSavedDatabaseTab = () => {
  try {
    return window.localStorage.getItem(getDatabaseTabStorageKey()) || DEFAULT_DATABASE_TAB;
  } catch (error) {
    console.error(error);
    return DEFAULT_DATABASE_TAB;
  }
};
const clearSavedTabs = (session = state.session) => {
  try {
    window.localStorage.removeItem(getMainTabStorageKey(session));
    window.localStorage.removeItem(getDatabaseTabStorageKey(session));
  } catch (error) {
    console.error(error);
  }
};

const STORAGE_BUCKETS = {
  player: 'player-assets',
  team: 'club-assets',
  venue: 'venue-assets',
};

const CSV_HEADERS = {
  teams: ['name', 'short_name', 'team_count', 'squad_labels', 'primary_color', 'secondary_color', 'logo_url', 'notes'],
  players: ['name', 'club_name', 'jersey_number', 'player_category', 'batsman_type', 'bowler_type', 'profile_image_url'],
};

const CLUB_TEMPLATE_HEADERS = ['name', 'short_name', 'club_side', 'team_count', 'primary_color', 'secondary_color'];
const PLAYER_TEMPLATE_HEADERS = ['name', 'jersey_number', 'batsman_type', 'bowler_type', 'player_category'];
const CLUB_SIDE_OPTIONS = ['home', 'opponent'];
const CLUB_COLOR_OPTIONS = ['#d32027', '#3944a7', '#111111', '#d2a52a', '#0f766e', '#166534', '#ffffff'];
const BATSMAN_TYPE_OPTIONS = [
  'Right-hand bat',
  'Left-hand bat',
  'Right-hand aggressive bat',
  'Left-hand aggressive bat',
  'Right-hand anchor bat',
  'Left-hand anchor bat',
];
const BOWLER_TYPE_OPTIONS = [
  'Right-arm fast',
  'Right-arm fast-medium',
  'Right-arm medium',
  'Right-arm off spin',
  'Right-arm leg spin',
  'Left-arm fast',
  'Left-arm fast-medium',
  'Left-arm medium',
  'Left-arm orthodox spin',
  'Left-arm wrist spin',
];
const PLAYER_CATEGORY_OPTIONS = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper', 'Wicketkeeper-Batsman'];
const buildSquadLabels = (teamCount) => Array.from({ length: Math.max(1, Number(teamCount) || 1) }, (_, index) => `T${index + 1}`);

const PAGE_SIZE = 6;

const htmlEscape = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

const formatDate = (value) => {
  if (!value) return 'TBD';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};

const formatTime = (value) => {
  if (!value) return 'TBD';

  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(`1970-01-01T${value}`));
};

const isAdmin = () => ['admin', 'super_admin'].includes(state.profile?.access_level);
const isSuperAdmin = () => state.profile?.access_level === 'super_admin';
const isBootstrapSuperAdminEmail = (email) => SUPER_ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());
const findTeam = (teamId) => state.teams.find((team) => String(team.id) === String(teamId));
const findVenue = (venueId) => state.venues.find((venue) => String(venue.id) === String(venueId));
const findMatch = (matchId) => state.matches.find((match) => String(match.id) === String(matchId));
const findPlayer = (playerId) => state.players.find((player) => String(player.id) === String(playerId));
const getLineupForMatch = (matchId) => state.lineupsByMatch.get(String(matchId)) || [];
const getLineupForMatchSide = (matchId, teamSide) => getLineupForMatch(matchId).filter((entry) => entry.team_side === teamSide);
const findTeamByName = (name) => state.teams.find((team) => team.name.toLowerCase() === String(name).trim().toLowerCase());
const findVenueByName = (name) => state.venues.find((venue) => venue.name.toLowerCase() === String(name).trim().toLowerCase());
const getLineupRoleLabel = (value) => ({
  player: 'Player',
  captain: 'Captain',
  vice_captain: 'Vice Captain',
  wicketkeeper: 'Wicketkeeper',
}[value] || 'Player');
const getTeamSideLabel = (value) => ({
  home: 'Home XI',
  away: 'Away XI',
}[value] || 'XI');
const CLUB_TYPE_PREFIX = 'club_type:';
const normaliseClubType = (value) => (String(value).trim().toLowerCase() === 'opponent' ? 'opponent' : 'home');
const getTeamType = (team) => {
  const labels = Array.isArray(team?.squad_labels) ? team.squad_labels : [];
  const marker = labels.find((label) => String(label).startsWith(CLUB_TYPE_PREFIX));
  return marker ? normaliseClubType(String(marker).slice(CLUB_TYPE_PREFIX.length)) : 'home';
};
const withTeamTypeLabel = (labels, type) => {
  const cleanLabels = (Array.isArray(labels) ? labels : []).filter((label) => !String(label).startsWith(CLUB_TYPE_PREFIX));
  return [`${CLUB_TYPE_PREFIX}${normaliseClubType(type)}`, ...cleanLabels];
};
const getHomeTeams = () => state.teams.filter((team) => getTeamType(team) === 'home');
const getOpponentTeams = () => state.teams.filter((team) => getTeamType(team) === 'opponent');
const getTeamTypeLabel = (team) => (getTeamType(team) === 'opponent' ? 'Opponent' : 'Home');

const getWeekKey = (dateValue) => {
  if (!dateValue) return '';

  const date = new Date(`${dateValue}T00:00:00`);
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  const weekNumber = 1 + Math.round((date - firstThursday) / 604800000);

  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const showMessage = (text, type = 'success') => {
  const target = !elements.authScreen?.classList.contains('hidden') ? elements.messages : (elements.appMessages || elements.messages);
  if (!target) return;
  target.innerHTML = `<div class="message ${type}">${htmlEscape(text)}</div>`;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    target.innerHTML = '';
  }, 8000);
};

const getStyleLabel = (value) => ({
  hero: 'Hero Portrait',
  batting: 'Best Batsman With Bat',
  bowling: 'Best Bowler In Action',
  allrounder: 'All-Rounder Spotlight',
  celebration: 'Celebration Pose',
}[value] || 'Cricket Spotlight');

const readLocalImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Image upload could not be read.'));
    reader.readAsDataURL(file);
  });

const readLocalImages = async (fileList) => {
  const files = [...(fileList || [])];
  return Promise.all(files.map((file) => readLocalImage(file)));
};

const toTextList = (value) =>
  String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const mergeImageSources = async (textValue, fileList) => {
  const uploadedImages = await readLocalImages(fileList);
  return [...toTextList(textValue), ...uploadedImages];
};

const normaliseQuery = (value) => String(value || '').trim().toLowerCase();

const matchesFilter = (query, values) => {
  if (!query) return true;
  return values.some((value) => normaliseQuery(value).includes(query));
};

const setEditMode = (entity, id, editing) => {
  state.editingIds[entity] = editing ? String(id) : '';
};

const getPaginatedItems = (items, key) => {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  state.pagination[key] = Math.min(state.pagination[key], totalPages);
  const page = Math.max(1, state.pagination[key]);
  const startIndex = (page - 1) * PAGE_SIZE;
  return {
    items: items.slice(startIndex, startIndex + PAGE_SIZE),
    page,
    totalPages,
  };
};

const renderPagination = (container, key, totalItems) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (totalItems <= PAGE_SIZE) {
    container.innerHTML = '';
    return;
  }

  const page = Math.max(1, Math.min(state.pagination[key], totalPages));
  container.innerHTML = `
    <button type="button" class="secondary-action" data-action="page-prev" data-key="${key}" ${page === 1 ? 'disabled' : ''}>Previous</button>
    <span class="pagination-label">Page ${page} of ${totalPages}</span>
    <button type="button" class="secondary-action" data-action="page-next" data-key="${key}" ${page === totalPages ? 'disabled' : ''}>Next</button>
  `;
};

const upsertStateItem = (items, item, sortValueGetter) => {
  const nextItems = [...items];
  const existingIndex = nextItems.findIndex((entry) => String(entry.id) === String(item.id));

  if (existingIndex >= 0) {
    nextItems[existingIndex] = item;
  } else {
    nextItems.push(item);
  }

  return nextItems.sort((left, right) => {
    const leftValue = String(sortValueGetter(left) || '').toLowerCase();
    const rightValue = String(sortValueGetter(right) || '').toLowerCase();
    return leftValue.localeCompare(rightValue);
  });
};

const resetListSearch = (key, input) => {
  state.filters[key] = '';
  state.pagination[key] = 1;
  setValueIfPresent(input, '');
};

const sortByMode = (items, mode, getValue) => {
  const sorted = [...items];
  sorted.sort((left, right) => {
    const leftValue = getValue(left, mode);
    const rightValue = getValue(right, mode);
    const direction = mode.endsWith('desc') ? -1 : 1;

    if (typeof leftValue === 'number' || typeof rightValue === 'number') {
      return ((Number(leftValue) || 0) - (Number(rightValue) || 0)) * direction;
    }

    return String(leftValue || '').localeCompare(String(rightValue || ''), undefined, { sensitivity: 'base' }) * direction;
  });
  return sorted;
};

const renderTable = (columns, rows) => `
  <div class="data-table-wrap">
    <table class="data-table">
      <thead>
        <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  </div>
`;

const updateBulkActionState = () => {
  elements.playersBulkDelete.disabled = !state.selectedRows.players.size;
  elements.teamsBulkDelete.disabled = !state.selectedRows.teams.size;
};

const openConfirmModal = (title, message, onConfirm) => {
  state.pendingConfirm = onConfirm;
  elements.confirmTitle.textContent = title;
  elements.confirmMessage.textContent = message;
  toggleHidden(elements.confirmModal, false);
};

const closeConfirmModal = () => {
  state.pendingConfirm = null;
  toggleHidden(elements.confirmModal, true);
};

const uploadImageFile = async (file, bucket, folder) => {
  if (!file) return '';

  if (!SUPABASE_READY || !supabase) {
    return readLocalImage(file);
  }

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
  const path = `${folder}/${safeName}`;

  try {
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || '';
  } catch (error) {
    console.warn(`Storage upload failed for ${bucket}/${path}. Falling back to local data URL.`, error);
    return readLocalImage(file);
  }
};

const uploadImageFiles = async (fileList, bucket, folder) => {
  const files = [...(fileList || [])];
  return Promise.all(files.map((file) => uploadImageFile(file, bucket, folder)));
};

const mergeStoredImageSources = async (textValue, fileList, bucket, folder) => {
  const uploadedImages = await uploadImageFiles(fileList, bucket, folder);
  return [...toTextList(textValue), ...uploadedImages.filter(Boolean)];
};

const escapeCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCsv = (filename, headers, rows) => {
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const readSpreadsheetRows = async (file) => {
  const fileName = String(file?.name || '').toLowerCase();

  if (fileName.endsWith('.csv')) {
    const text = await file.text();
    return parseCsv(text);
  }

  if (!window.XLSX) {
    throw new Error('Excel support did not load. Please refresh and try again.');
  }

  const buffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const worksheet = workbook.Sheets[firstSheetName];
  return window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });
};

const downloadExcelFile = (filename, sheetName, rows) => {
  if (!window.XLSX) {
    throw new Error('Excel support did not load. Please refresh and try again.');
  }

  const workbook = window.XLSX.utils.book_new();
  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  window.XLSX.writeFile(workbook, filename);
};

const createPlayerTemplateWorkbook = async () => {
  if (!window.ExcelJS) {
    throw new Error('Excel template support did not load. Please refresh and try again.');
  }

  const workbook = new window.ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Players');

  sheet.columns = [
    { header: 'name', key: 'name', width: 28 },
    { header: 'jersey_number', key: 'jersey_number', width: 16 },
    { header: 'batsman_type', key: 'batsman_type', width: 26 },
    { header: 'bowler_type', key: 'bowler_type', width: 26 },
    { header: 'player_category', key: 'player_category', width: 24 },
  ];

  sheet.addRow({
    name: 'John Smith',
    jersey_number: '18',
    batsman_type: 'Right-hand bat',
    bowler_type: 'Right-arm medium',
    player_category: 'Batsman',
  });

  sheet.getRow(1).font = { bold: true };

  const applyDropdown = (columnKey, options) => {
    for (let rowIndex = 2; rowIndex <= 200; rowIndex += 1) {
      sheet.getCell(`${columnKey}${rowIndex}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${options.join(',')}"`],
        showErrorMessage: true,
      };
    }
  };

  applyDropdown('C', BATSMAN_TYPE_OPTIONS);
  applyDropdown('D', BOWLER_TYPE_OPTIONS);
  applyDropdown('E', PLAYER_CATEGORY_OPTIONS);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'players-template.xlsx';
  link.click();
  URL.revokeObjectURL(url);
};

const createClubTemplateWorkbook = async () => {
  if (!window.ExcelJS) {
    throw new Error('Excel template support did not load. Please refresh and try again.');
  }

  const workbook = new window.ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Clubs');

  sheet.columns = [
    { header: 'name', key: 'name', width: 28 },
    { header: 'short_name', key: 'short_name', width: 16 },
    { header: 'club_side', key: 'club_side', width: 16 },
    { header: 'team_count', key: 'team_count', width: 14 },
    { header: 'primary_color', key: 'primary_color', width: 18 },
    { header: 'secondary_color', key: 'secondary_color', width: 18 },
  ];

  sheet.addRow({
    name: 'Grammer Cricket Club',
    short_name: 'GCC',
    club_side: 'home',
    team_count: '3',
    primary_color: '#d32027',
    secondary_color: '#3944a7',
  });

  sheet.getRow(1).font = { bold: true };

  const applyDropdown = (columnKey, options) => {
    for (let rowIndex = 2; rowIndex <= 200; rowIndex += 1) {
      sheet.getCell(`${columnKey}${rowIndex}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${options.join(',')}"`],
        showErrorMessage: true,
      };
    }
  };

  applyDropdown('C', CLUB_SIDE_OPTIONS);
  applyDropdown('D', ['1', '2', '3', '4', '5']);
  applyDropdown('E', CLUB_COLOR_OPTIONS);
  applyDropdown('F', CLUB_COLOR_OPTIONS);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clubs-template.xlsx';
  link.click();
  URL.revokeObjectURL(url);
};

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
};

const parseCsv = (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || '';
      return row;
    }, {});
  });
};

const setEmptyState = (container, text) => {
  if (!container) return;
  container.innerHTML = `<div class="empty-state">${htmlEscape(text)}</div>`;
};

const toggleHidden = (element, hidden) => {
  if (!element) return;
  element.classList.toggle('hidden', hidden);
};

const setValueIfPresent = (element, value) => {
  if (!element) return;
  element.value = value;
};

const addListener = (element, eventName, handler) => {
  if (!element) return;
  element.addEventListener(eventName, (event) => {
    try {
      const result = handler(event);
      if (result && typeof result.then === 'function') {
        result.catch((error) => {
          console.error(error);
          showMessage(error.message || 'Something went wrong.', 'error');
        });
      }
    } catch (error) {
      console.error(error);
      showMessage(error.message || 'Something went wrong.', 'error');
    }
  });
};

const ensureSession = async () => {
  if (state.session) return state.session;

  if (!SUPABASE_READY || !supabase) {
    throw new Error(getConfigMessage());
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  state.session = data?.session || null;
  if (!state.session) {
    throw new Error('Please sign in first.');
  }

  return state.session;
};

const switchMainTab = (tabName) => {
  const tabs = [
    { button: elements.mainTabHome, pane: elements.mainPaneHome, name: 'home' },
    { button: elements.mainTabDatabase, pane: elements.mainPaneDatabase, name: 'database' },
    { button: elements.mainTabMatches, pane: elements.mainPaneMatches, name: 'matches' },
    { button: elements.mainTabResults, pane: elements.mainPaneResults, name: 'results' },
    { button: elements.mainTabPoster, pane: elements.mainPanePoster, name: 'poster' },
    { button: elements.mainTabAdmin, pane: elements.mainPaneAdmin, name: 'admin' },
  ];

  tabs.forEach((tab) => {
    if (!tab.button || !tab.pane) return;
    const active = tab.name === tabName;
    tab.button.classList.toggle('active-workspace-tab', active);
    toggleHidden(tab.pane, !active);
  });

  if (tabs.some((tab) => tab.name === tabName)) {
    saveActiveMainTab(tabName);
  }
};

const switchDatabaseTab = (tabName) => {
  const tabs = [
    { button: elements.databaseTabPlayers, pane: elements.databasePanePlayers, name: 'players' },
    { button: elements.databaseTabClubs, pane: elements.databasePaneClubs, name: 'clubs' },
    { button: elements.databaseTabGrounds, pane: elements.databasePaneGrounds, name: 'grounds' },
    { button: elements.databaseTabSocial, pane: elements.databasePaneSocial, name: 'social' },
    { button: elements.databaseTabSheets, pane: elements.databasePaneSheets, name: 'sheets' },
  ];

  tabs.forEach((tab) => {
    if (!tab.button || !tab.pane) return;
    const active = tab.name === tabName;
    tab.button.classList.toggle('active-workspace-tab', active);
    toggleHidden(tab.pane, !active);
  });

  if (tabs.some((tab) => tab.name === tabName)) {
    saveActiveDatabaseTab(tabName);
  }
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

  if (tabName !== 'login') {
    toggleHidden(elements.resetForm, true);
  }
};

const initAuthUi = () => {
  addListener(elements.tabSignup, 'click', () => switchAuthTab('signup'));
  addListener(elements.tabLogin, 'click', () => switchAuthTab('login'));
  addListener(elements.showReset, 'click', () => toggleHidden(elements.resetForm, !elements.resetForm.classList.contains('hidden')));
  addListener(elements.signupForm, 'submit', handleSignup);
  addListener(elements.loginForm, 'submit', handleLogin);
  addListener(elements.resetForm, 'submit', handlePasswordReset);

  document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('change', (event) => {
      const input = document.getElementById(event.target.dataset.passwordToggle);
      if (input) input.type = event.target.checked ? 'text' : 'password';
    });
  });
};

const fillSelect = (select, placeholder, items, labelBuilder) => {
  const currentValue = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = labelBuilder(item);
    select.appendChild(option);
  });

  if (items.some((item) => String(item.id) === currentValue)) {
    select.value = currentValue;
  }
};

const setSelectValueIfPresent = (select, value, items) => {
  if (!select || !value) return false;
  const exists = items.some((item) => String(item.id) === String(value));
  if (exists) {
    select.value = String(value);
    return true;
  }
  return false;
};

const fillDatalist = (datalist, items, labelBuilder) => {
  datalist.innerHTML = items.map((item) => `<option value="${htmlEscape(labelBuilder(item))}"></option>`).join('');
};

const syncPlayerHomeClubValue = () => {
  const homeTeams = getHomeTeams();
  const currentValue = String(elements.playerTeam?.value || '');
  const currentExists = homeTeams.some((team) => String(team.id) === currentValue);

  if (elements.playerTeam) {
    elements.playerTeam.value = currentExists ? currentValue : String(homeTeams[0]?.id || '');
  }
};

const getMatchLabel = (match) => {
  const team1 = findTeam(match.team1_id);
  const team2 = findTeam(match.team2_id);
  return `${team1?.name || 'Unknown'} vs ${team2?.name || 'Unknown'} | ${formatDate(match.match_date)}${match.match_time ? ` | ${formatTime(match.match_time)}` : ''}`;
};

const isUpcomingMatch = (match) => {
  if (!match?.match_date) return false;

  const today = new Date();
  const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const matchDate = new Date(`${match.match_date}T00:00:00`).getTime();
  const hasResult = state.results.some((result) => String(result.match_id) === String(match.id));

  return matchDate >= todayKey && !hasResult;
};

const isPosterEligibleMatch = (match) =>
  Boolean(match) && !state.results.some((result) => String(result.match_id) === String(match.id));

const getPreMatchPosterMatches = () => state.matches.filter(isPosterEligibleMatch);
const getCompletedPosterMatches = () =>
  state.results
    .map((result) => findMatch(result.match_id))
    .filter(Boolean);
const getResultEligibleMatches = () =>
  state.matches.filter((match) => !state.results.some((result) => String(result.match_id) === String(match.id)));

const getMatchStatusPills = (match) => {
  const hasResult = state.results.some((result) => String(result.match_id) === String(match.id));
  const lineupCount = getLineupForMatchSide(match.id, 'home').length;
  const statuses = [
    {
      label: hasResult ? 'Result Added' : 'No Result',
      tone: hasResult ? 'success' : 'warning',
    },
    {
      label: lineupCount >= 11 ? 'Lineup Ready' : `XI ${lineupCount}/11`,
      tone: lineupCount >= 11 ? 'info' : 'neutral',
    },
  ];

  return statuses.map((status) =>
    `<span class="match-status-pill match-status-pill-${status.tone}">${htmlEscape(status.label)}</span>`).join('');
};

const getAvailableHomePlayersForMatch = (matchId) => {
  const matchLineup = getLineupForMatch(matchId);
  const selectedIds = new Set(matchLineup.map((entry) => String(entry.player_id)));
  const unavailableIds = matchId ? getUnavailablePlayerIdsForWeek(matchId) : new Set();
  const match = findMatch(matchId);
  const sideTeamId = match ? match.team1_id : '';

  return matchId
    ? getAllowedPlayersForMatch(matchId).filter((player) =>
      String(player.team_id) === String(sideTeamId) &&
      !selectedIds.has(String(player.id)) &&
      !unavailableIds.has(String(player.id)))
    : [];
};

const getAllowedPlayersForMatch = (matchId) => {
  const match = findMatch(matchId);
  if (!match) return [];

  return state.players.filter((player) =>
    String(player.team_id) === String(match.team1_id) || String(player.team_id) === String(match.team2_id));
};

const getUnavailablePlayerIdsForWeek = (matchId) => {
  const currentMatch = findMatch(matchId);
  if (!currentMatch) return new Set();

  const weekKey = getWeekKey(currentMatch.match_date);
  const unavailableIds = new Set();

  state.matches.forEach((match) => {
    if (String(match.id) === String(matchId)) return;
    if (getWeekKey(match.match_date) !== weekKey) return;

    const lineup = state.lineupsByMatch.get(String(match.id)) || [];
    lineup.forEach((entry) => {
      unavailableIds.add(String(entry.player_id));
    });
  });

  return unavailableIds;
};

const updateAppVisibility = () => {
  const signedIn = Boolean(state.session);
  toggleHidden(elements.authScreen, signedIn);
  toggleHidden(elements.appShell, !signedIn);
};

const renderHomeDashboard = () => {
  if (!elements.statsGrid) {
    return;
  }

  const homeClub = getHomeTeams()[0] || null;
  const homeGround = state.venues[0] || null;
  const homeGroundImage = Array.isArray(homeGround?.image_urls) && homeGround.image_urls.length ? homeGround.image_urls[0] : './ground-photo.jfif';
  const upcomingMatches = state.matches.filter(isUpcomingMatch).slice(0, 5);
  const completedResults = state.results.slice(0, 5);
  const savedClubs = state.teams.slice(0, 5);
  const savedPlayers = state.players.slice(0, 5);
  const stats = [
    { label: 'Total Players', value: state.players.length },
    { label: 'Registered Clubs', value: state.teams.length },
    { label: 'Match Venues', value: state.venues.length },
    { label: 'Matches Total', value: state.matches.length },
  ];

  elements.statsGrid.innerHTML = stats.map((stat) => `
    <article class="stat-card">
      <span class="section-label">${htmlEscape(stat.label)}</span>
      <strong>${htmlEscape(stat.value)}</strong>
    </article>
  `).join('');

  if (elements.homeHeroBanner) {
    elements.homeHeroBanner.style.background = `
      linear-gradient(180deg, rgba(17, 24, 39, 0.28), rgba(17, 24, 39, 0.58)),
      url("${homeGroundImage}") center/cover no-repeat
    `;
  }

  if (elements.homeHeroLogo) {
    elements.homeHeroLogo.src = homeClub?.logo_url || './logo.svg';
  }

  if (elements.homeHeroTitle) {
    elements.homeHeroTitle.innerHTML = `${htmlEscape(homeClub?.name || 'Grammer')} <span>Cricket Club</span>`;
  }

  if (elements.homeHeroQuote) {
    elements.homeHeroQuote.textContent = homeClub?.notes
      ? `"${homeClub.notes}"`
      : '"Excellence in every stroke, integrity in every play."';
  }

  if (elements.homeHeroGround) {
    elements.homeHeroGround.textContent = homeGround?.name
      ? `${homeGround.name}${homeGround.address ? ` | ${homeGround.address}` : ''}`
      : 'Save your main ground to feature it here.';
  }

  if (elements.homeHeroVenueNote) {
    elements.homeHeroVenueNote.textContent = Array.isArray(homeGround?.image_urls) && homeGround.image_urls.length
      ? `${homeGround.image_urls.length} saved ground pictures ready for posters and results.`
      : 'Add venue pictures to bring posters and results to life.';
  }

  if (elements.homeNavScheduleMeta) {
    elements.homeNavScheduleMeta.textContent = `${state.matches.length} fixtures in the system.`;
  }

  if (elements.homeNavResultsMeta) {
    elements.homeNavResultsMeta.textContent = `${state.results.length} completed match results ready to review.`;
  }

  if (elements.homeNavUpcomingMeta) {
    const nextMatch = upcomingMatches[0];
    const nextVenue = nextMatch ? findVenue(nextMatch.venue_id) : null;
    elements.homeNavUpcomingMeta.textContent = nextMatch
      ? `${formatDate(nextMatch.match_date)}${nextVenue?.name ? ` | ${nextVenue.name}` : ''}`
      : 'No upcoming matches yet.';
  }

  if (elements.homeNavLatestResultsMeta) {
    const latestResult = completedResults[0];
    const latestWinner = latestResult ? findTeam(latestResult.winner_team_id) : null;
    elements.homeNavLatestResultsMeta.textContent = latestResult
      ? `Latest winner: ${latestWinner?.name || 'TBD'}`
      : 'No completed matches yet.';
  }

  if (elements.homeNavClubsMeta) {
    elements.homeNavClubsMeta.textContent = savedClubs.length
      ? `${savedClubs.length} clubs ready for fixtures and posters.`
      : 'No clubs saved yet.';
  }

  if (elements.homeNavPostersMeta) {
    elements.homeNavPostersMeta.textContent = state.matches.length
      ? 'Open posters for fixtures, lineups, and results.'
      : 'Save clubs, grounds, and a match first.';
  }
};

const updateAuthAvailability = () => {
  const authButtons = [
    elements.loginForm.querySelector('button[type="submit"]'),
    elements.signupForm.querySelector('button[type="submit"]'),
    elements.resetForm.querySelector('button[type="submit"]'),
  ];

  if (!SUPABASE_READY || !supabase) {
    elements.authConfigNote.textContent = getConfigMessage();
    toggleHidden(elements.authConfigNote, false);
    authButtons.forEach((button) => {
      button.disabled = true;
    });
    return;
  }

  elements.authConfigNote.textContent = '';
  toggleHidden(elements.authConfigNote, true);
  authButtons.forEach((button) => {
    button.disabled = false;
  });
};

const updateSessionCard = () => {
  if (!elements.sessionEmail || !elements.sessionRole || !elements.logoutButton) {
    return;
  }

  if (!state.session) {
    elements.sessionEmail.textContent = 'Not signed in';
    elements.sessionRole.textContent = 'Role: guest';
    if (elements.homeWelcomeEmail) elements.homeWelcomeEmail.textContent = 'guest';
    if (elements.topbarEmail) elements.topbarEmail.textContent = 'Not signed in';
    elements.logoutButton.disabled = true;
    toggleHidden(elements.mainTabAdmin, true);
    toggleHidden(elements.adminSection, true);
    updateAppVisibility();
    return;
  }

  elements.sessionEmail.textContent = state.profile?.email || state.session.user.email || 'Signed in';
  elements.sessionRole.textContent = `Role: ${state.profile?.access_level || 'user'}`;
  if (elements.homeWelcomeEmail) elements.homeWelcomeEmail.textContent = state.profile?.email || state.session.user.email || 'member';
  if (elements.topbarEmail) elements.topbarEmail.textContent = state.profile?.email || state.session.user.email || 'Signed in';
  elements.logoutButton.disabled = false;
  toggleHidden(elements.mainTabAdmin, !isAdmin());
  toggleHidden(elements.adminSection, !isAdmin());
  updateAppVisibility();
};

const renderProfiles = () => {
  if (!isAdmin()) {
    setEmptyState(elements.profilesList, 'Admin access is required to manage roles.');
    return;
  }

  if (!state.profiles.length) {
    setEmptyState(elements.profilesList, 'No user profiles found yet.');
    return;
  }

  elements.profilesList.innerHTML = state.profiles.map((profile) => `
    <article class="record-card">
      <div class="record-row">
        <div>
          <h3>${htmlEscape(profile.full_name || profile.email || 'Unnamed user')}</h3>
          <p class="record-meta">${htmlEscape(profile.email || 'No email')} | ${htmlEscape(profile.access_level)}</p>
        </div>
        <div class="record-actions role-row">
          <select data-action="change-role" data-id="${profile.id}" ${profile.access_level === 'super_admin' ? 'disabled' : ''}>
            <option value="user" ${profile.access_level === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${profile.access_level === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="super_admin" ${profile.access_level === 'super_admin' ? 'selected' : ''}>Super Admin</option>
          </select>
        </div>
      </div>
    </article>
  `).join('');
};

const renderTeams = () => {
  const query = normaliseQuery(state.filters.teams);
  const filteredTeams = sortByMode(state.teams.filter((team) => matchesFilter(query, [
    team.name,
    team.short_name,
    getTeamTypeLabel(team),
    team.notes,
    team.primary_color,
    team.secondary_color,
    ...(team.squad_labels || []),
  ])), state.ui.teamsSort, (team) => team.name || '');

  if (!filteredTeams.length) {
    setEmptyState(elements.teamsList, 'No clubs saved yet.');
    elements.teamsPagination.innerHTML = '';
    return;
  }

  const paginated = getPaginatedItems(filteredTeams, 'teams');
  if (state.ui.teamsViewMode === 'table') {
    elements.teamsList.innerHTML = renderTable(
      ['Select', 'Club', 'Short', 'Type', 'Colors', 'Actions'],
      paginated.items.map((team) => `
        <tr>
          <td><input type="checkbox" data-action="toggle-team-select" data-id="${team.id}" ${state.selectedRows.teams.has(String(team.id)) ? 'checked' : ''} /></td>
          <td>${htmlEscape(team.name)}</td>
          <td>${htmlEscape(team.short_name)}</td>
          <td>${htmlEscape(getTeamTypeLabel(team))}</td>
          <td>${htmlEscape(team.primary_color || '#d32027')} / ${htmlEscape(team.secondary_color || '#3944a7')} | ${htmlEscape((team.squad_labels || []).join(', ') || 'T1')}</td>
          <td class="table-actions">
            ${team.logo_url ? `<img src="${htmlEscape(team.logo_url)}" alt="${htmlEscape(team.name)} logo" class="list-logo" />` : '<span class="record-meta">No logo</span>'}
            <button type="button" class="secondary-action" data-action="edit-team" data-id="${team.id}">Edit</button>
            <button type="button" class="danger-action" data-action="delete-team" data-id="${team.id}">Delete</button>
          </td>
        </tr>
      `),
    );
  } else {
    elements.teamsList.innerHTML = `
      <div class="club-card-grid">
        ${paginated.items.map((team) => {
          const teamTypeLabel = getTeamTypeLabel(team);
          const logoMarkup = team.logo_url
            ? `<img src="${htmlEscape(team.logo_url)}" alt="${htmlEscape(team.name)} logo" class="club-card-logo" />`
            : `
              <div class="club-card-logo club-card-logo-fallback" aria-hidden="true">
                <img src="./logo.svg" alt="Club crest" class="club-card-logo-crest" />
              </div>
            `;

          return `
            <article class="club-card">
              <div class="club-card-hero">
                <div class="club-card-badge">${htmlEscape(teamTypeLabel)}</div>
                ${logoMarkup}
              </div>
              <div class="club-card-body">
                <h3>${htmlEscape(team.name)}</h3>
              </div>
              <div class="club-card-actions">
                <button type="button" class="secondary-action" data-action="edit-team" data-id="${team.id}">Edit</button>
                <button type="button" class="danger-action" data-action="delete-team" data-id="${team.id}">Delete</button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }
  renderPagination(elements.teamsPagination, 'teams', filteredTeams.length);
  updateBulkActionState();
};

const renderVenues = () => {
  const query = normaliseQuery(state.filters.venues);
  const filteredVenues = state.venues.filter((venue) => matchesFilter(query, [
    venue.name,
    venue.city,
    venue.country,
    venue.address,
    venue.notes,
  ]));

  if (!filteredVenues.length) {
    setEmptyState(elements.venuesList, 'No grounds saved yet.');
    elements.venuesPagination.innerHTML = '';
    return;
  }

  const paginated = getPaginatedItems(filteredVenues, 'venues');
  elements.venuesList.innerHTML = `
    <div class="venue-card-grid">
      ${paginated.items.map((venue) => {
        const imageUrls = Array.isArray(venue.image_urls) ? venue.image_urls : [];
        const heroImage = imageUrls[0] || '';
        const locationLine = venue.address || `${venue.city || ''}${venue.country ? `, ${venue.country}` : ''}`.trim() || 'Address not added';
        return `
          <article class="venue-card">
            <div class="venue-card-media">
              ${
                heroImage
                  ? `<img src="${htmlEscape(heroImage)}" alt="${htmlEscape(venue.name)} ground view" class="venue-card-photo" />`
                  : `<div class="venue-card-photo venue-card-photo-fallback"><img src="./logo.svg" alt="Club crest" class="venue-card-fallback-crest" /></div>`
              }
              <div class="venue-card-badge">${imageUrls.length ? 'Saved Photos' : 'No Photo Yet'}</div>
            </div>
            <div class="venue-card-body">
              <h3>${htmlEscape(venue.name)}</h3>
              <p class="record-meta">${htmlEscape(locationLine)}</p>
              ${venue.notes ? `<p class="record-meta">${htmlEscape(venue.notes)}</p>` : ''}
            </div>
            <div class="venue-card-actions">
              <button type="button" class="secondary-action" data-action="edit-venue" data-id="${venue.id}">Edit</button>
              <button type="button" class="danger-action" data-action="delete-venue" data-id="${venue.id}">Delete</button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
  renderPagination(elements.venuesPagination, 'venues', filteredVenues.length);
};

const renderSocialLinks = () => {
  if (!state.socialLinks.length) {
    setEmptyState(elements.socialLinksList, 'No saved social or streaming links yet.');
    return;
  }

  elements.socialLinksList.innerHTML = state.socialLinks.map((link) => `
    <article class="record-card">
      <div class="record-row">
        <div>
          <h3>${htmlEscape(link.label)}</h3>
          <p class="record-meta">${htmlEscape(link.platform)}</p>
          <p class="record-meta"><a href="${htmlEscape(link.url)}" target="_blank" rel="noreferrer">${htmlEscape(link.url)}</a></p>
        </div>
        <div class="record-actions">
          <button type="button" class="danger-action" data-action="delete-social-link" data-id="${link.id}">Delete</button>
        </div>
      </div>
    </article>
  `).join('');
};

const renderPlayers = () => {
  const query = normaliseQuery(state.filters.players);
  const filteredPlayers = sortByMode(state.players.filter((player) => {
    const category = player.player_category || player.role || 'Player';
    if (state.ui.playersCategoryFilter !== 'all' && category !== state.ui.playersCategoryFilter) {
      return false;
    }

    return matchesFilter(query, [
      player.name,
      player.jersey_number,
      category,
      player.batsman_type,
      player.bowler_type,
    ]);
  }), state.ui.playersSort, (player, mode) => {
    if (mode.startsWith('jersey')) return Number(player.jersey_number) || 0;
    return player.name || '';
  });

  if (!filteredPlayers.length) {
    setEmptyState(elements.playersList, 'No players saved yet.');
    elements.playersPagination.innerHTML = '';
    return;
  }

  const paginated = getPaginatedItems(filteredPlayers, 'players');
  if (state.ui.playersViewMode === 'table') {
    elements.playersList.innerHTML = renderTable(
      ['Select', 'Player', 'Jersey', 'Type', 'Actions'],
      paginated.items.map((player) => {
        const category = player.player_category || player.role || 'Player';
        return `
          <tr>
            <td><input type="checkbox" data-action="toggle-player-select" data-id="${player.id}" ${state.selectedRows.players.has(String(player.id)) ? 'checked' : ''} /></td>
            <td>${htmlEscape(player.name)}</td>
            <td>${htmlEscape(player.jersey_number || 0)}</td>
            <td>${htmlEscape(category)}</td>
            <td class="table-actions">
              <button type="button" class="secondary-action" data-action="edit-player" data-id="${player.id}">Edit</button>
              <button type="button" class="danger-action" data-action="delete-player" data-id="${player.id}">Delete</button>
            </td>
          </tr>
        `;
      }),
    );
  } else {
    elements.playersList.innerHTML = `
      <div class="player-roster-grid">
        ${paginated.items.map((player) => {
          const category = player.player_category || player.role || 'Player';
          const initials = String(player.name || 'P')
            .split(' ')
            .map((part) => part[0] || '')
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return `
            <article class="player-roster-card">
              <div class="player-roster-badge">#${htmlEscape(player.jersey_number || '0')}</div>
              <div class="player-card-actions">
                <button type="button" class="icon-action player-card-delete" data-action="delete-player" data-id="${player.id}" aria-label="Delete ${htmlEscape(player.name)}">Delete</button>
              </div>
              <div class="player-roster-media">
                ${
                  player.profile_image_url
                    ? `<img src="${htmlEscape(player.profile_image_url)}" alt="${htmlEscape(player.name)} profile" class="player-roster-photo" />`
                    : `
                      <div class="player-avatar-kit">
                        <div class="player-avatar-head"></div>
                        <div class="player-avatar-body"></div>
                        <img src="./logo.svg" alt="Club crest" class="player-avatar-crest" />
                        <div class="player-avatar-badge">${htmlEscape(initials || 'G')}</div>
                      </div>
                    `
                }
              </div>
              <div class="player-roster-meta">
                <h3>${htmlEscape(player.name)}</h3>
                <div class="player-roster-type">${htmlEscape(category)}</div>
              </div>
              <div class="player-roster-controls">
                <button type="button" class="player-edit-button" data-action="edit-player" data-id="${player.id}" aria-label="Edit ${htmlEscape(player.name)}">Edit</button>
              </div>
              <div class="player-roster-footer">
                <div class="player-stat">
                  <strong>0</strong>
                  <span>Matches</span>
                </div>
                <div class="player-stat">
                  <strong>0</strong>
                  <span>Runs</span>
                </div>
                <div class="player-stat">
                  <strong>0</strong>
                  <span>Wickets</span>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }
  renderPagination(elements.playersPagination, 'players', filteredPlayers.length);
  updateBulkActionState();

  if (elements.playersCategoryFilter) {
    elements.playersCategoryFilter.value = state.ui.playersCategoryFilter;
  }
};

const renderMatches = () => {
  const query = normaliseQuery(state.filters.matches);
  const filteredMatches = state.matches.filter((match) => {
    const venue = findVenue(match.venue_id);
    const team1 = findTeam(match.team1_id);
    const team2 = findTeam(match.team2_id);

    return matchesFilter(query, [
      team1?.name,
      team2?.name,
      venue?.name,
      venue?.address,
      match.match_date,
      match.match_time,
    ]);
  });

  if (!filteredMatches.length) {
    setEmptyState(elements.matchesList, 'No matches created yet.');
    elements.matchesPagination.innerHTML = '';
    return;
  }

  const paginated = getPaginatedItems(filteredMatches, 'matches');
  elements.matchesList.innerHTML = `
    <div class="match-card-grid">
      ${paginated.items.map((match) => {
        const venue = findVenue(match.venue_id);
        const homeTeam = findTeam(match.team1_id);
        const awayTeam = findTeam(match.team2_id);
        const lineupCount = getLineupForMatchSide(match.id, 'home').length;
        const lineupEntries = getLineupForMatchSide(match.id, 'home');
        const lineupPreview = lineupEntries.slice(0, 4).map((entry) => entry.players?.name).filter(Boolean);
        const isActiveLineupMatch = String(elements.lineupMatch?.value || '') === String(match.id);
        const availablePlayers = isActiveLineupMatch ? getAvailableHomePlayersForMatch(match.id) : [];
        const formatTeamLogo = (team) => team?.logo_url
          ? `<img src="${htmlEscape(team.logo_url)}" alt="${htmlEscape(team.name)} logo" class="match-team-logo" />`
          : `<div class="match-team-logo match-team-logo-fallback"><img src="./logo.svg" alt="Club crest" class="match-team-logo-crest" /></div>`;

        return `
          <article class="match-card ${isActiveLineupMatch ? 'match-card-active' : ''}">
            <div class="match-card-header">
              <div class="match-team-block">
                ${formatTeamLogo(homeTeam)}
                <span>${htmlEscape(homeTeam?.name || 'Unknown home')}</span>
              </div>
              <div class="match-versus-block">
                <div class="match-status-row">${getMatchStatusPills(match)}</div>
                <strong>VS</strong>
              </div>
              <div class="match-team-block">
                ${formatTeamLogo(awayTeam)}
                <span>${htmlEscape(awayTeam?.name || 'Unknown away')}</span>
              </div>
            </div>
            <div class="match-card-body">
              <div class="match-card-meta">
                <div class="match-meta-item">
                  <small>Date</small>
                  <strong>${htmlEscape(formatDate(match.match_date))}</strong>
                </div>
                <div class="match-meta-item">
                  <small>Venue</small>
                  <strong>${htmlEscape(venue?.name || 'Unknown venue')}</strong>
                </div>
                <div class="match-meta-item">
                  <small>Home XI</small>
                  <strong>${lineupCount} / 11 selected</strong>
                </div>
              </div>
              <div class="match-lineup-preview">
                <small>Playing XI Preview</small>
                ${
                  lineupPreview.length
                    ? `
                      <div class="match-lineup-chips">
                        ${lineupPreview.map((name) => `<span class="match-lineup-chip">${htmlEscape(name)}</span>`).join('')}
                        ${lineupCount > lineupPreview.length ? `<span class="match-lineup-chip match-lineup-chip-more">+${lineupCount - lineupPreview.length} more</span>` : ''}
                      </div>
                    `
                    : '<p class="record-meta">No players selected yet. Open this match and add the home Playing XI.</p>'
                }
              </div>
              <div class="match-card-actions">
                <button type="button" class="primary-action" data-action="open-lineup-selector" data-id="${match.id}">${lineupCount ? 'Edit Playing XI' : 'Select Playing XI'}</button>
                <button type="button" class="secondary-action" data-action="open-match-poster" data-id="${match.id}">Match Poster</button>
                <button type="button" class="secondary-action" data-action="open-lineup-poster" data-id="${match.id}">Lineup Poster</button>
                <button type="button" class="secondary-action" data-action="edit-match" data-id="${match.id}">Edit</button>
                <button type="button" class="danger-action" data-action="delete-match" data-id="${match.id}">Delete</button>
              </div>
              ${isActiveLineupMatch ? `
                <div class="match-lineup-drawer">
                  <div class="match-lineup-drawer-head">
                    <div>
                      <small>Playing XI Manager</small>
                      <strong>${htmlEscape(homeTeam?.name || 'Home Club')} vs ${htmlEscape(awayTeam?.name || 'Opponent')}</strong>
                    </div>
                    <button type="button" class="secondary-action" data-action="close-lineup-selector" data-id="${match.id}">Close</button>
                  </div>
                  <div class="match-lineup-inline-controls">
                    <label class="field">
                      <span>Registered Player</span>
                      <select data-action="change-inline-lineup-player" data-id="${match.id}">
                        <option value="">${availablePlayers.length ? 'Select available player' : 'No available players this week'}</option>
                        ${availablePlayers.map((player) => `
                          <option value="${player.id}" ${String(state.ui.inlineLineupPlayerId || '') === String(player.id) ? 'selected' : ''}>
                            ${htmlEscape(`${player.name}${player.jersey_number ? ` | #${player.jersey_number}` : ''}${player.player_category ? ` | ${player.player_category}` : ''}`)}
                          </option>
                        `).join('')}
                      </select>
                    </label>
                    <label class="field">
                      <span>Match Role</span>
                      <select data-action="change-inline-lineup-role" data-id="${match.id}">
                        <option value="player" ${state.ui.inlineLineupRole === 'player' ? 'selected' : ''}>Player</option>
                        <option value="captain" ${state.ui.inlineLineupRole === 'captain' ? 'selected' : ''}>Captain</option>
                        <option value="vice_captain" ${state.ui.inlineLineupRole === 'vice_captain' ? 'selected' : ''}>Vice Captain</option>
                        <option value="wicketkeeper" ${state.ui.inlineLineupRole === 'wicketkeeper' ? 'selected' : ''}>Wicketkeeper</option>
                      </select>
                    </label>
                    <button type="button" class="primary-action" data-action="add-inline-lineup" data-id="${match.id}">Add To Playing XI</button>
                  </div>
                  <div class="match-lineup-inline-list">
                    ${lineupEntries.length ? lineupEntries.map((entry, index) => `
                      <div class="record-row lineup-row">
                        <div>
                          <p><strong>${index + 1}. ${htmlEscape(entry.players?.name || 'Player')}</strong></p>
                          <p class="record-meta">${htmlEscape(entry.players?.player_category || entry.players?.role || 'Player')} | ${htmlEscape(getLineupRoleLabel(entry.match_role))}</p>
                        </div>
                        <div class="record-actions">
                          <button type="button" class="danger-action" data-action="delete-lineup" data-id="${entry.id}" data-match-id="${entry.match_id}">Remove</button>
                        </div>
                      </div>
                    `).join('') : '<p class="record-meta">No players selected yet. Add registered home players here and the same XI will be used in results and posters.</p>'}
                  </div>
                </div>
              ` : ''}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
  renderPagination(elements.matchesPagination, 'matches', filteredMatches.length);
};

const renderLineup = () => {
  const matchId = elements.lineupMatch.value;

  if (!matchId) {
    elements.lineupCount.textContent = 'Home XI 0 / 11';
    if (elements.lineupMatchSummary) {
      elements.lineupMatchSummary.textContent = 'Choose a saved match card above, then build its Playing XI from your registered home players.';
    }
    setEmptyState(elements.lineupList, 'Select a match to view its lineup.');
    return;
  }

  const match = findMatch(matchId);
  const homeTeam = match ? findTeam(match.team1_id) : null;
  const awayTeam = match ? findTeam(match.team2_id) : null;
  const venue = match ? findVenue(match.venue_id) : null;
  const homeLineup = getLineupForMatchSide(matchId, 'home');
  elements.lineupCount.textContent = `Home XI ${homeLineup.length} / 11`;
  if (elements.lineupMatchSummary) {
    elements.lineupMatchSummary.innerHTML = `
      <strong>${htmlEscape(homeTeam?.name || 'Home Club')} vs ${htmlEscape(awayTeam?.name || 'Opponent')}</strong>
      <span> | ${htmlEscape(formatDate(match?.match_date))}${match?.match_time ? ` | ${htmlEscape(formatTime(match.match_time))}` : ''}</span>
      <span> | ${htmlEscape(venue?.name || 'Ground not set')}</span>
      <span> | Registered home players feed this same XI into results, match posters, and Playing XI posters.</span>
    `;
  }

  if (!homeLineup.length) {
    setEmptyState(elements.lineupList, 'No players selected for this match yet.');
    return;
  }

  elements.lineupList.innerHTML = `
    <article class="record-card">
      <h3>${htmlEscape(homeTeam?.name || 'Home Club')} | Home XI</h3>
      ${homeLineup.map((entry, index) => `
        <div class="record-row lineup-row">
          <div>
            <p><strong>${index + 1}. ${htmlEscape(entry.players.name)}</strong></p>
            <p class="record-meta">${htmlEscape(entry.players.role)} | ${htmlEscape(getLineupRoleLabel(entry.match_role))}</p>
          </div>
          <div class="record-actions">
            <button type="button" class="danger-action" data-action="delete-lineup" data-id="${entry.id}" data-match-id="${entry.match_id}">Remove</button>
          </div>
        </div>
      `).join('')}
    </article>
  `;
};

const renderResults = () => {
  const query = normaliseQuery(state.filters.results);
  const filteredResults = state.results.filter((result) => {
    const match = findMatch(result.match_id);
    const winner = findTeam(result.winner_team_id);
    const team1 = match ? findTeam(match.team1_id) : null;
    const team2 = match ? findTeam(match.team2_id) : null;

    return matchesFilter(query, [
      winner?.name,
      team1?.name,
      team2?.name,
      result.toss_winner_name,
      result.toss_decision,
      result.summary,
      result.team1_innings_summary,
      result.team2_innings_summary,
      result.player_of_match,
      result.best_scorer_name,
      result.best_bowler_name,
      result.best_score,
    ]);
  });

  if (!filteredResults.length) {
    setEmptyState(elements.resultsList, 'No match results saved yet.');
    elements.resultsPagination.innerHTML = '';
    updateResultPosterOptions();
    return;
  }

  const paginated = getPaginatedItems(filteredResults, 'results');
  elements.resultsList.innerHTML = paginated.items.map((result) => {
    const match = findMatch(result.match_id);
    const winner = findTeam(result.winner_team_id);

    if (!match) return '';

    return `
      <article class="record-card">
        <div class="record-row">
          <div>
            <h3>${htmlEscape(getMatchLabel(match))}</h3>
            <p class="record-meta">
              ${result.team1_score} - ${result.team2_score} | Winner: ${htmlEscape(winner?.name || 'TBD')}
            </p>
            <p>${htmlEscape(result.summary || 'No summary added.')}</p>
            <p class="record-meta">Toss: ${htmlEscape(result.toss_winner_name || 'Not added')}${result.toss_decision ? ` | ${htmlEscape(result.toss_decision)}` : ''}</p>
            <p class="record-meta">Player of the match: ${htmlEscape(result.player_of_match || 'Not added')}</p>
            <p class="record-meta">Player style: ${htmlEscape(getStyleLabel(result.player_of_match_style))}</p>
            <p class="record-meta">Top run scorer: ${htmlEscape(result.best_scorer_name || 'Not added')}</p>
            <p class="record-meta">Top score: ${htmlEscape(result.best_score || 'Not added')}</p>
            <p class="record-meta">Best bowler: ${htmlEscape(result.best_bowler_name || 'Not added')}${result.best_bowler_figures ? ` | ${htmlEscape(result.best_bowler_figures)}` : ''}</p>
            <p class="record-meta">Caption ready for social media after generating the result poster.</p>
          </div>
          <div class="record-actions">
            <button type="button" class="secondary-action" data-action="edit-result" data-id="${result.id}">Edit</button>
            <button type="button" class="danger-action" data-action="delete-result" data-id="${result.id}">Delete</button>
          </div>
        </div>
      </article>
    `;
  }).filter(Boolean).join('');
  renderPagination(elements.resultsPagination, 'results', filteredResults.length);

  updateResultPosterOptions();
};

const populateCoreSelectors = () => {
  syncPlayerHomeClubValue();
  const allMatches = state.matches;
  const resultEligibleMatches = getResultEligibleMatches();
  const posterEligibleMatches = getPreMatchPosterMatches();
  fillSelect(elements.matchTeam1, 'Select home club', getHomeTeams(), (team) => team.name);
  fillSelect(elements.matchTeam2, 'Select opponent club', getOpponentTeams(), (team) => team.name);
  fillSelect(elements.lineupMatch, 'Select match', allMatches, getMatchLabel);
  fillSelect(elements.resultMatch, 'Select no-result match', resultEligibleMatches, getMatchLabel);
  fillSelect(elements.posterMatch, 'Select upcoming / no-result match', posterEligibleMatches, getMatchLabel);
  if (state.lastSavedMatchId) {
    setSelectValueIfPresent(elements.lineupMatch, state.lastSavedMatchId, allMatches);
    setSelectValueIfPresent(elements.resultMatch, state.lastSavedMatchId, resultEligibleMatches);
    setSelectValueIfPresent(elements.posterMatch, state.lastSavedMatchId, posterEligibleMatches);
  }
  if (elements.matchVenueDatalist) fillDatalist(elements.matchVenueDatalist, state.venues, (venue) => venue.name);
  renderPosterMatchChoices();
  updateLineupTeamOptions();
  updateLineupPlayerOptions();
  updateWinnerOptions();
  updateResultPlayerOptions();
  updatePosterVenueImageOptions();
};

const renderPosterMatchChoices = () => {
  const upcomingMatches = getPreMatchPosterMatches();

  if (!upcomingMatches.length) {
    setEmptyState(elements.posterMatchPicker, 'No upcoming or no-result matches are available for pre-match posters yet.');
    return;
  }

  elements.posterMatchPicker.innerHTML = upcomingMatches.map((match) => `
    <label class="selection-chip">
      <input type="checkbox" name="poster-match-choice" value="${match.id}" />
      <span>${htmlEscape(getMatchLabel(match))}</span>
    </label>
  `).join('');
};

const updateLineupPlayerOptions = () => {
  const matchId = elements.lineupMatch.value;
  const allowedPlayers = getAvailableHomePlayersForMatch(matchId);

  const placeholder = matchId
    ? allowedPlayers.length
      ? 'Select available player'
      : 'No available players this week'
    : 'Select player';

  fillSelect(elements.lineupPlayer, placeholder, allowedPlayers, (player) => {
    return `${player.name}${player.jersey_number ? ` | #${player.jersey_number}` : ''}${player.player_category ? ` | ${player.player_category}` : ''}`;
  });
};

const updateWinnerOptions = () => {
  const match = findMatch(elements.resultMatch.value);
  const teams = match ? [findTeam(match.team1_id), findTeam(match.team2_id)].filter(Boolean) : [];
  fillSelect(elements.winnerTeam, 'Select winner', teams, (team) => team.name);
  fillSelect(elements.tossWinner, 'Select toss winner', teams, (team) => team.name);
};

const updateLineupTeamOptions = () => {
  const match = findMatch(elements.lineupMatch.value);
  if (!elements.lineupTeamSide) return;
  elements.lineupTeamSide.value = match ? 'home' : '';
};

const addLineupEntry = async (matchId, playerId, matchRole) => {
  if (!isAdmin()) {
    showMessage('Only admins can change the playing XI and match roles.', 'error');
    return;
  }

  if (!matchId || !playerId || !matchRole) {
    showMessage('Choose a match, player, and match role.', 'error');
    return;
  }

  const matchLineup = getLineupForMatch(matchId);
  const currentSideLineup = getLineupForMatchSide(matchId, 'home');
  if (currentSideLineup.length >= 11) {
    showMessage('Home XI can only contain 11 players.', 'error');
    return;
  }

  if (matchLineup.some((entry) => String(entry.player_id) === String(playerId))) {
    showMessage('That player is already in the lineup.', 'error');
    return;
  }

  if (matchRole !== 'player' && currentSideLineup.some((entry) => entry.match_role === matchRole)) {
    showMessage(`Home XI already has a ${getLineupRoleLabel(matchRole)}.`, 'error');
    return;
  }

  const session = await ensureSession();
  await withRequest(async () => {
    const { error } = await supabase.from('lineups').insert([{
      match_id: matchId,
      player_id: playerId,
      team_side: 'home',
      match_role: matchRole,
      created_by: session.user.id,
    }]);
    if (error) throw error;
    state.ui.inlineLineupPlayerId = '';
    state.ui.inlineLineupRole = 'player';
    elements.lineupPlayer.value = '';
    elements.lineupRole.value = 'player';
    await loadLineups();
  }, `${getLineupRoleLabel(matchRole)} added to the playing XI.`);
};

const getRoleHolder = (matchId, teamSide, roleKey) =>
  getLineupForMatchSide(matchId, teamSide).find((entry) => entry.match_role === roleKey);

const getLineupSummary = (matchId) => {
  const homeCaptain = getRoleHolder(matchId, 'home', 'captain');
  const homeViceCaptain = getRoleHolder(matchId, 'home', 'vice_captain');
  const homeWicketkeeper = getRoleHolder(matchId, 'home', 'wicketkeeper');
  const awayCaptain = getRoleHolder(matchId, 'away', 'captain');
  const awayViceCaptain = getRoleHolder(matchId, 'away', 'vice_captain');
  const awayWicketkeeper = getRoleHolder(matchId, 'away', 'wicketkeeper');

  return {
    homeCaptain: homeCaptain?.players?.name || '',
    homeViceCaptain: homeViceCaptain?.players?.name || '',
    homeWicketkeeper: homeWicketkeeper?.players?.name || '',
    awayCaptain: awayCaptain?.players?.name || '',
    awayViceCaptain: awayViceCaptain?.players?.name || '',
    awayWicketkeeper: awayWicketkeeper?.players?.name || '',
  };
};

const updateResultPlayerOptions = () => {
  const matchId = elements.resultMatch.value;
  const lineup = getLineupForMatch(matchId);
  const players = lineup
    .map((entry) => {
      const player = findPlayer(entry.player_id);
      return {
        id: entry.player_id,
        name: entry.players?.name || player?.name || '',
        matchRole: entry.match_role || 'player',
      };
    })
    .filter((player) => player.name);

  fillSelect(elements.playerOfMatch, 'Select from match XI', players, (player) => `${player.name} | ${getLineupRoleLabel(player.matchRole)}`);
  fillSelect(elements.bestScorerName, 'Select from match XI', players, (player) => `${player.name} | ${getLineupRoleLabel(player.matchRole)}`);
  fillSelect(elements.bestBowlerName, 'Select from match XI', players, (player) => `${player.name} | ${getLineupRoleLabel(player.matchRole)}`);
};

const getWinningCaptainName = (match, result) => {
  if (!match || !result?.winner_team_id) return '';
  const winningTeamSide = String(result.winner_team_id) === String(match.team1_id) ? 'home' : 'away';
  const winningCaptain = getRoleHolder(match.id, winningTeamSide, 'captain');
  return winningCaptain?.players?.name || '';
};

const syncResultPlayerImages = () => {
  const playerOfMatchRecord = findPlayer(elements.playerOfMatch.value);
  const bestScorerRecord = findPlayer(elements.bestScorerName.value);
  const bestBowlerRecord = findPlayer(elements.bestBowlerName.value);

  if (playerOfMatchRecord?.profile_image_url && !document.getElementById('player-image-url').value.trim()) {
    document.getElementById('player-image-url').value = playerOfMatchRecord.profile_image_url;
  }

  if (bestScorerRecord?.profile_image_url && !document.getElementById('best-scorer-image-url').value.trim()) {
    document.getElementById('best-scorer-image-url').value = bestScorerRecord.profile_image_url;
  }

  if (bestBowlerRecord?.profile_image_url && !document.getElementById('best-bowler-image-url').value.trim()) {
    document.getElementById('best-bowler-image-url').value = bestBowlerRecord.profile_image_url;
  }
};

const updateResultPosterOptions = () => {
  const completedMatches = getCompletedPosterMatches();

  fillSelect(elements.resultPosterMatch, 'Select completed match', completedMatches, getMatchLabel);
};

const renderSocialLinkChoices = (container, groupName) => {
  if (!state.socialLinks.length) {
    container.innerHTML = '<div class="empty-state">Save social links in the database first.</div>';
    return;
  }

  container.innerHTML = state.socialLinks.map((link) => `
    <label class="selection-chip">
      <input type="checkbox" name="${groupName}" value="${link.id}" />
      <span>${htmlEscape(link.platform)} | ${htmlEscape(link.label)}</span>
    </label>
  `).join('');
};

const getSelectedSocialLinks = (container) => {
  const checkedIds = [...container.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
  return state.socialLinks.filter((link) => checkedIds.includes(String(link.id)));
};

const getSocialLinkMarkup = (links) =>
  links.length
    ? `
      <div class="poster-social-strip">
        ${links.map((link) => `
          <a href="${htmlEscape(link.url)}" target="_blank" rel="noreferrer" class="poster-social-pill">
            <strong>${htmlEscape(link.platform)}</strong>
            <span>${htmlEscape(link.label)}</span>
          </a>
        `).join('')}
      </div>
    `
    : '<div class="poster-social-empty">Select saved social links to show watch or follow details on the poster.</div>';

const updatePosterVenueImageOptions = () => {
  const match = findMatch(elements.posterMatch.value);
  const venue = match ? findVenue(match.venue_id) : null;
  const images = Array.isArray(venue?.image_urls) ? venue.image_urls : [];
  const currentValue = elements.posterVenueImage.value;

  elements.posterVenueImage.innerHTML = '<option value="">Auto rotate saved pictures</option>';

  images.forEach((url, index) => {
    const option = document.createElement('option');
    option.value = url;
    option.textContent = `Saved picture ${index + 1}`;
    elements.posterVenueImage.appendChild(option);
  });

  if (images.includes(currentValue)) {
    elements.posterVenueImage.value = currentValue;
  }
};

const getPlatformSpec = (platform) => ({
  instagram: { label: 'Instagram', width: 1080, height: 1350 },
  facebook: { label: 'Facebook', width: 1200, height: 1500 },
  whatsapp: { label: 'WhatsApp', width: 1080, height: 1080 },
  x: { label: 'X', width: 1600, height: 900 },
}[platform] || { label: 'Instagram', width: 1080, height: 1350 });

const getVariantThemes = (homeTeam, awayTeam) => {
  const homePrimary = homeTeam?.primary_color || '#d32027';
  const homeSecondary = homeTeam?.secondary_color || '#7f1016';
  const awayPrimary = awayTeam?.primary_color || '#3944a7';
  const awaySecondary = awayTeam?.secondary_color || '#1d2b53';

  return [
    { id: 'electric', name: 'Electric Rivalry', accent: homePrimary, secondary: awayPrimary },
    { id: 'royal', name: 'Royal Fixture', accent: awayPrimary, secondary: homePrimary },
    { id: 'neon', name: 'Neon Night', accent: '#ff4d6d', secondary: awaySecondary },
    { id: 'arena', name: 'Arena Clash', accent: '#d2a52a', secondary: homeSecondary },
    { id: 'heritage', name: 'Heritage Derby', accent: homeSecondary, secondary: awayPrimary },
    { id: 'captains', name: 'Captain Callout', accent: awaySecondary, secondary: homePrimary },
  ];
};

const getSelectedPosterMatchIds = () => {
  const checkedIds = [...elements.posterMatchPicker.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
  if (elements.posterMatch.value && !checkedIds.includes(elements.posterMatch.value)) {
    checkedIds.unshift(elements.posterMatch.value);
  }
  return [...new Set(checkedIds)];
};

const getPrimaryLineupEntries = (matchId) => {
  const homeEntries = getLineupForMatchSide(matchId, 'home');
  if (homeEntries.length) return homeEntries;
  return getLineupForMatchSide(matchId, 'away');
};

const openPosterStudio = (matchId, posterType = 'match') => {
  switchMainTab('poster');
  if (elements.posterMatch) {
    elements.posterMatch.value = String(matchId || '');
  }
  if (elements.posterType) {
    elements.posterType.value = posterType;
  }
  updatePosterVenueImageOptions();
  renderPosterMatchPicker();
  const checkbox = elements.posterMatchPicker?.querySelector(`input[value="${String(matchId)}"]`);
  if (checkbox) checkbox.checked = true;
  renderPoster();
};

const openLineupSelector = (matchId) => {
  switchMainTab('matches');
  if (elements.lineupMatch) {
    elements.lineupMatch.value = String(matchId || '');
  }
  if (elements.lineupTeamSide) {
    elements.lineupTeamSide.value = 'home';
  }
  state.ui.inlineLineupPlayerId = '';
  state.ui.inlineLineupRole = 'player';
  updateLineupTeamOptions();
  updateLineupPlayerOptions();
  renderMatches();
  renderLineup();
  document.querySelector('.match-card-active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const buildFixtureCaption = (match) => {
  const homeTeam = findTeam(match.team1_id);
  const awayTeam = findTeam(match.team2_id);
  const venue = findVenue(match.venue_id);
  const lineupSummary = getLineupSummary(match.id);

  return [
    `${homeTeam?.name || 'Home Team'} vs ${awayTeam?.name || 'Opponent'}`,
    `Fixture day is locked in for ${formatDate(match.match_date)}${match.match_time ? ` at ${formatTime(match.match_time)}` : ''}.`,
    `Venue: ${venue?.name || 'TBD'}${venue?.address ? `, ${venue.address}` : ''}.`,
    lineupSummary.homeCaptain ? `Home XI: Captain ${lineupSummary.homeCaptain}${lineupSummary.homeViceCaptain ? ` | Vice Captain ${lineupSummary.homeViceCaptain}` : ''}${lineupSummary.homeWicketkeeper ? ` | Wicketkeeper ${lineupSummary.homeWicketkeeper}` : ''}.` : '',
    lineupSummary.awayCaptain ? `Away XI: Captain ${lineupSummary.awayCaptain}${lineupSummary.awayViceCaptain ? ` | Vice Captain ${lineupSummary.awayViceCaptain}` : ''}${lineupSummary.awayWicketkeeper ? ` | Wicketkeeper ${lineupSummary.awayWicketkeeper}` : ''}.` : '',
    `Catch all the action and back Grammer Cricket Club AI Manager on matchday.`,
    '#GrammerCricketClub #MatchDay #CricketGraphics',
  ].join('\n');
};

const buildResultCaption = (match, result) => {
  const homeTeam = findTeam(match.team1_id);
  const awayTeam = findTeam(match.team2_id);
  const winner = findTeam(result.winner_team_id);
  const lineupSummary = getLineupSummary(match.id);
  const winningTeamSide = String(result.winner_team_id) === String(match.team1_id) ? 'home' : 'away';
  const winningCaptain = getRoleHolder(match.id, winningTeamSide, 'captain');
  const winningCaptainName = winningCaptain?.players?.name || '';

  return [
    `${homeTeam?.name || 'Home Team'} ${result.team1_score} - ${result.team2_score} ${awayTeam?.name || 'Opponent'}`,
    `${winner?.name || 'The winning side'} take the result on ${formatDate(match.match_date)}.`,
    result.summary || 'Another strong performance for the club.',
    result.toss_winner_name ? `Toss: ${result.toss_winner_name} won the toss and chose to ${result.toss_decision || 'bat'}.` : '',
    lineupSummary.homeCaptain ? `Home XI leadership: Captain ${lineupSummary.homeCaptain}${lineupSummary.homeViceCaptain ? `, Vice Captain ${lineupSummary.homeViceCaptain}` : ''}${lineupSummary.homeWicketkeeper ? `, Wicketkeeper ${lineupSummary.homeWicketkeeper}` : ''}.` : '',
    lineupSummary.awayCaptain ? `Away XI leadership: Captain ${lineupSummary.awayCaptain}${lineupSummary.awayViceCaptain ? `, Vice Captain ${lineupSummary.awayViceCaptain}` : ''}${lineupSummary.awayWicketkeeper ? `, Wicketkeeper ${lineupSummary.awayWicketkeeper}` : ''}.` : '',
    winningCaptainName ? `Winning captain: ${winningCaptainName}.` : '',
    result.team1_innings_summary ? `Home innings: ${result.team1_innings_summary}` : '',
    result.team2_innings_summary ? `Away innings: ${result.team2_innings_summary}` : '',
    result.player_of_match ? `Player of the Match: ${result.player_of_match}.` : '',
    result.best_scorer_name ? `Top Run Scorer: ${result.best_scorer_name}${result.best_score ? ` with ${result.best_score}` : ''}.` : '',
    result.best_bowler_name ? `Best Bowler: ${result.best_bowler_name}${result.best_bowler_figures ? ` with ${result.best_bowler_figures}` : ''}.` : '',
    '#MatchResult #GrammerCricketClub #CricketHighlights',
  ].filter(Boolean).join('\n');
};

const getPosterBackground = (visualMode, venue, theme, variantIndex, selectedImage = '') => {
  const venueImage = selectedImage || (Array.isArray(venue?.image_urls) && venue.image_urls.length ? venue.image_urls[variantIndex % venue.image_urls.length] : '');

  if (visualMode === 'saved' && venueImage) {
    return `
      linear-gradient(160deg, rgba(10, 14, 35, 0.82), rgba(57, 68, 167, 0.54) 45%, rgba(211, 32, 39, 0.5) 100%),
      url('${htmlEscape(venueImage)}') center/cover no-repeat
    `;
  }

  return `
    radial-gradient(circle at 18% 18%, ${theme.secondary}55, transparent 22%),
    radial-gradient(circle at 82% 24%, ${theme.accent}66, transparent 18%),
    linear-gradient(145deg, #11152f 0%, ${theme.secondary} 45%, ${theme.accent} 100%)
  `;
};

const getPosterVenueImage = (venue, variantIndex) => {
  if (elements.posterVenueImage.value) {
    return elements.posterVenueImage.value;
  }

  return Array.isArray(venue?.image_urls) && venue.image_urls.length
    ? venue.image_urls[variantIndex % venue.image_urls.length]
    : '';
};

const getSponsorImages = () =>
  elements.posterSponsorImages.value
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);

const getResultSponsorImages = () =>
  elements.resultPosterSponsorImages.value
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);

const getSponsorMarkup = (images, emptyText) =>
  images.length
    ? images.map((url, index) => `
      <div class="poster-sponsor-slot">
        <img src="${htmlEscape(url)}" alt="Sponsor ${index + 1}" class="poster-sponsor-image" />
      </div>
    `).join('')
    : `<div class="poster-sponsor-empty">${htmlEscape(emptyText)}</div>`;

const renderPoster = () => {
  const matchIds = getSelectedPosterMatchIds();
  if (!matchIds.length) {
    state.activePosterMatchIds = [];
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Choose a match to generate its poster.');
    return;
  }

  const platform = elements.posterPlatform.value;
  const visualMode = elements.posterVisualMode.value;
  const posterType = elements.posterType?.value || 'match';
  const platformSpec = getPlatformSpec(platform);
  const sponsorImages = getSponsorImages();
  const socialLinks = getSelectedSocialLinks(elements.posterSocialLinks);
  const sponsorMarkup = getSponsorMarkup(sponsorImages, 'Add sponsor picture URLs to show partner branding here.');
  const posters = [];
  const captions = [];

  matchIds.forEach((matchId, matchIndex) => {
    const match = findMatch(matchId);
    const venue = match ? findVenue(match.venue_id) : null;
    const team1 = match ? findTeam(match.team1_id) : null;
    const team2 = match ? findTeam(match.team2_id) : null;
    const lineupSummary = match
      ? getLineupSummary(match.id)
      : {
        homeCaptain: '',
        homeViceCaptain: '',
        homeWicketkeeper: '',
        awayCaptain: '',
        awayViceCaptain: '',
        awayWicketkeeper: '',
      };

    if (!match || !team1 || !team2 || !venue) {
      return;
    }

    captions.push(posterType === 'lineup' ? `${buildFixtureCaption(match)}\nPlaying XI locked in for this design.` : buildFixtureCaption(match));

    getVariantThemes(team1, team2).forEach((theme, index) => {
      const sourceMode = visualMode === 'mixed' ? (index < 3 ? 'saved' : 'generated') : visualMode;
      const variantLabel = index < 3 ? 'Venue Based' : 'AI Style';
      const variantKey = `${match.id}-${posterType}-${sourceMode}-${theme.id}`;

      if (posterType === 'lineup') {
        const lineupEntries = getPrimaryLineupEntries(match.id);
        const lineupMarkup = lineupEntries.length
          ? `
            <ol class="poster-xi">
              ${lineupEntries.slice(0, 11).map((entry, playerIndex) => `
                <li>
                  <strong>${playerIndex + 1}. ${htmlEscape(entry.players?.name || 'Player')}</strong>
                  <small>${htmlEscape(getRoleLabel(entry.match_role))}</small>
                </li>
              `).join('')}
            </ol>
          `
          : '<div class="poster-xi poster-xi-empty"><p>Select the playing XI in Match Centre to unlock lineup posters.</p></div>';

        posters.push(`
          <article
            class="poster-card poster-variant lineup-poster-card theme-${theme.id} ${matchIndex === 0 && index === 0 ? 'selected-poster' : ''}"
            data-variant-key="${variantKey}"
            data-match-id="${match.id}"
            style="
              --poster-accent: ${theme.accent};
              --poster-secondary: ${theme.secondary};
              --poster-width: ${platformSpec.width};
              --poster-height: ${platformSpec.height};
              background: ${getPosterBackground(sourceMode, venue, theme, index, getPosterVenueImage(venue, index))};
            "
          >
            <div class="poster-overlay"></div>
            <div class="poster-top lineup-poster-top">
              <div class="lineup-heading">
                <span class="poster-badge">${platformSpec.label} | ${variantLabel}</span>
                <h2 class="poster-title poster-title-lineup">Playing XI</h2>
                <p class="lineup-versus">${htmlEscape(team1.name)} vs ${htmlEscape(team2.name)}</p>
              </div>
              <div class="poster-logos lineup-poster-logos">
                ${team1.logo_url ? `<img src="${htmlEscape(team1.logo_url)}" alt="${htmlEscape(team1.name)} logo" class="poster-logo" />` : ''}
                ${team2.logo_url ? `<img src="${htmlEscape(team2.logo_url)}" alt="${htmlEscape(team2.name)} logo" class="poster-logo" />` : ''}
              </div>
            </div>
            <div class="lineup-meta-row">
              <span>${formatDate(match.match_date)}</span>
              <span>${formatTime(match.match_time)}</span>
              <span>${htmlEscape(venue.name)}</span>
            </div>
            <div class="poster-grid lineup-poster-grid">
              <section class="poster-box lineup-list-box">
                ${lineupMarkup}
              </section>
              <aside class="poster-box poster-visual-box">
                <div
                  class="poster-venue-visual"
                  style="${getPosterVenueImage(venue, index) ? `background-image: linear-gradient(180deg, rgba(8, 15, 13, 0.12), rgba(8, 15, 13, 0.35)), url('${htmlEscape(getPosterVenueImage(venue, index))}');` : ''}"
                ></div>
                <div class="poster-info poster-info-compact">
                  <div>
                    <strong>Home Club</strong>
                    <span>${htmlEscape(team1.name)}</span>
                  </div>
                  <div>
                    <strong>Opponent</strong>
                    <span>${htmlEscape(team2.name)}</span>
                  </div>
                  <div>
                    <strong>Ground</strong>
                    <span>${htmlEscape(venue.name)}</span>
                  </div>
                  <div>
                    <strong>Address</strong>
                    <span>${htmlEscape(venue.address || `${venue.city}, ${venue.country}`)}</span>
                  </div>
                </div>
              </aside>
            </div>
            <section class="poster-box sponsor-box">
              <h3>Partners</h3>
              <div class="poster-sponsor-grid">
                ${sponsorMarkup}
              </div>
            </section>
            <section class="poster-box poster-social-box">
              <h3>Watch And Follow</h3>
              ${getSocialLinkMarkup(socialLinks)}
            </section>
          </article>
        `);
        return;
      }

      posters.push(`
        <article
          class="poster-card poster-variant match-poster-card theme-${theme.id} ${matchIndex === 0 && index === 0 ? 'selected-poster' : ''}"
          data-variant-key="${variantKey}"
          data-match-id="${match.id}"
          style="
            --poster-accent: ${theme.accent};
            --poster-secondary: ${theme.secondary};
            --poster-width: ${platformSpec.width};
            --poster-height: ${platformSpec.height};
            background: ${getPosterBackground(sourceMode, venue, theme, index, getPosterVenueImage(venue, index))};
          "
        >
          <div class="poster-overlay"></div>
          <div class="match-poster-frame"></div>
          <div class="poster-top match-poster-top">
            <div class="match-poster-kicker">Exciting</div>
            <div class="poster-logos lineup-poster-logos">
              ${team1.logo_url ? `<img src="${htmlEscape(team1.logo_url)}" alt="${htmlEscape(team1.name)} logo" class="poster-logo" />` : ''}
              ${team2.logo_url ? `<img src="${htmlEscape(team2.logo_url)}" alt="${htmlEscape(team2.name)} logo" class="poster-logo" />` : ''}
            </div>
          </div>
          <div class="match-poster-hero">
            <div class="match-poster-title-wrap">
              <span class="poster-badge">${platformSpec.label} | ${variantLabel}</span>
              <h2 class="poster-title match-poster-title">Cricket Match</h2>
              <p class="match-poster-subtitle">Upcoming club fixture poster</p>
            </div>
          </div>
          <div class="match-versus-row">
            <div class="match-team-card match-team-home">
              <span class="match-team-label">Home Team</span>
              <strong>${htmlEscape(team1.name)}</strong>
              <small>${htmlEscape(team1.short_name || '')}</small>
            </div>
            <div class="match-versus-badge">VS</div>
            <div class="match-team-card match-team-away">
              <span class="match-team-label">Opponent</span>
              <strong>${htmlEscape(team2.name)}</strong>
              <small>${htmlEscape(team2.short_name || '')}</small>
            </div>
          </div>
          <div class="match-fixture-info">
            <div>
              <strong>Date</strong>
              <span>${formatDate(match.match_date)}</span>
            </div>
            <div>
              <strong>Time</strong>
              <span>${formatTime(match.match_time)}</span>
            </div>
            <div>
              <strong>Venue</strong>
              <span>${htmlEscape(venue.name)}</span>
            </div>
          </div>
          <div class="poster-grid match-poster-grid">
            <aside class="poster-box poster-visual-box">
              <div
                class="poster-venue-visual"
                style="${getPosterVenueImage(venue, index) ? `background-image: linear-gradient(180deg, rgba(8, 15, 13, 0.12), rgba(8, 15, 13, 0.35)), url('${htmlEscape(getPosterVenueImage(venue, index))}');` : ''}"
              ></div>
              <div class="poster-info poster-info-compact">
                <div>
                  <strong>Home Team</strong>
                  <span>${htmlEscape(team1.name)}</span>
                </div>
                <div>
                  <strong>Opponent</strong>
                  <span>${htmlEscape(team2.name)}</span>
                </div>
                <div>
                  <strong>Address</strong>
                  <span>${htmlEscape(venue.address || `${venue.city}, ${venue.country}`)}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team1?.short_name || 'Home')} Captain</strong>
                  <span>${htmlEscape(lineupSummary.homeCaptain || 'Not set')}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team1?.short_name || 'Home')} Vice Captain</strong>
                  <span>${htmlEscape(lineupSummary.homeViceCaptain || 'Not set')}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team1?.short_name || 'Home')} Wicketkeeper</strong>
                  <span>${htmlEscape(lineupSummary.homeWicketkeeper || 'Not set')}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team2?.short_name || 'Away')} Captain</strong>
                  <span>${htmlEscape(lineupSummary.awayCaptain || 'Not set')}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team2?.short_name || 'Away')} Vice Captain</strong>
                  <span>${htmlEscape(lineupSummary.awayViceCaptain || 'Not set')}</span>
                </div>
                <div>
                  <strong>${htmlEscape(team2?.short_name || 'Away')} Wicketkeeper</strong>
                  <span>${htmlEscape(lineupSummary.awayWicketkeeper || 'Not set')}</span>
                </div>
                <div>
                  <strong>Sponsors</strong>
                  <span>${sponsorImages.length || 0}</span>
                </div>
              </div>
            </aside>
            <section class="poster-box sponsor-box">
              <h3>Partners</h3>
              <div class="poster-sponsor-grid">
                ${sponsorMarkup}
              </div>
            </section>
          </div>
          <section class="poster-box poster-social-box">
            <h3>Watch And Follow</h3>
            ${getSocialLinkMarkup(socialLinks)}
          </section>
        </article>
      `);
    });
  });

  if (!posters.length) {
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'This poster needs an upcoming match with saved teams and venue data.');
    return;
  }

  elements.posterHost.innerHTML = posters.join('');
  elements.posterCaptionOutput.value = captions.join('\n\n--------------------\n\n');

  state.activePosterMatchIds = matchIds;
  state.selectedPosterVariantKey = elements.posterHost.querySelector('.poster-variant')?.dataset.variantKey || '';
  elements.posterSelectionLabel.textContent = `Selected: ${elements.posterHost.querySelector('.poster-badge')?.textContent || 'Design'}`;
  toggleHidden(elements.posterSelection, false);
  elements.downloadPoster.disabled = false;
};

const withRequest = async (callback, successMessage) => {
  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  await ensureSession();

  try {
    await callback();
    if (successMessage) showMessage(successMessage);
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Something went wrong.', 'error');
  }
};

const loadProfile = async () => {
  if (!state.session) {
    state.profile = null;
    updateSessionCard();
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', state.session.user.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const fullName = state.session.user.user_metadata?.full_name || state.session.user.user_metadata?.name || '';
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const fallbackProfile = {
      id: state.session.user.id,
      email: state.session.user.email || '',
      full_name: fullName,
      access_level: count === 0 || isBootstrapSuperAdminEmail(state.session.user.email) ? 'super_admin' : 'user',
    };

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .upsert(fallbackProfile)
      .select('*')
      .single();

    if (insertError) throw insertError;
    state.profile = inserted;
  } else {
    state.profile = data;
  }

  if (isBootstrapSuperAdminEmail(state.session.user.email) && state.profile?.access_level !== 'super_admin') {
    const { data: promoted, error: promoteError } = await supabase
      .from('profiles')
      .update({ access_level: 'super_admin' })
      .eq('id', state.session.user.id)
      .select('*')
      .single();

    if (promoteError) throw promoteError;
    state.profile = promoted;
  }

  updateSessionCard();
};

const loadProfiles = async () => {
  if (!isAdmin()) {
    state.profiles = [];
    renderProfiles();
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  state.profiles = data || [];
  renderProfiles();
};

const loadTeams = async () => {
  const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
  if (error) throw error;
  state.teams = data || [];
  renderTeams();
  populateCoreSelectors();
  renderHomeDashboard();
};

const loadVenues = async () => {
  const { data, error } = await supabase.from('venues').select('*').order('name', { ascending: true });
  if (error) throw error;
  state.venues = data || [];
  renderVenues();
  populateCoreSelectors();
  renderHomeDashboard();
};

const loadSocialLinks = async () => {
  const { data, error } = await supabase.from('social_links').select('*').order('platform', { ascending: true });
  if (error) throw error;
  state.socialLinks = data || [];
  renderSocialLinks();
  renderSocialLinkChoices(elements.posterSocialLinks, 'poster-social-link');
  renderSocialLinkChoices(elements.resultPosterSocialLinks, 'result-poster-social-link');
};

const loadPlayers = async () => {
  const { data, error } = await supabase.from('players').select('*').order('name', { ascending: true });
  if (error) throw error;
  state.players = data || [];
  renderPlayers();
  updateLineupPlayerOptions();
  renderHomeDashboard();
};

const loadMatches = async () => {
  const { data, error } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
  if (error) throw error;
  state.matches = data || [];
  renderMatches();
  populateCoreSelectors();
  updatePosterVenueImageOptions();
  renderHomeDashboard();
};

const loadLineups = async () => {
  const { data, error } = await supabase
    .from('lineups')
    .select('id, match_id, player_id, team_side, match_role, players(id, name, role, team_id)')
    .order('id', { ascending: true });

  if (error) throw error;

  state.lineupsByMatch = new Map();
  (data || []).forEach((entry) => {
    const key = String(entry.match_id);
    const current = state.lineupsByMatch.get(key) || [];
    current.push(entry);
    state.lineupsByMatch.set(key, current);
  });

  renderMatches();
  renderLineup();

  if (state.activePosterMatchIds.length) {
    renderPoster();
  }
};

const loadResults = async () => {
  const { data, error } = await supabase.from('results').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  state.results = data || [];
  renderResults();
  renderHomeDashboard();
};

const refreshData = async () => {
  await Promise.all([
    loadTeams(),
    loadVenues(),
    loadSocialLinks(),
    loadPlayers(),
    loadMatches(),
    loadLineups(),
    loadResults(),
    loadProfiles(),
  ]);
};

const resetTeamForm = () => {
  elements.teamForm.reset();
  elements.teamEditId.value = '';
  elements.teamSubmitButton.textContent = 'Save Club';
  toggleHidden(elements.teamCancelEdit, true);
  setValueIfPresent(elements.teamClubType, 'home');
  document.getElementById('team-primary-color').value = '#d32027';
  document.getElementById('team-secondary-color').value = '#3944a7';
  setEditMode('team', '', false);
};

const resetVenueForm = () => {
  elements.venueForm.reset();
  elements.venueEditId.value = '';
  elements.venueSubmitButton.textContent = 'Save Ground';
  toggleHidden(elements.venueCancelEdit, true);
  setEditMode('venue', '', false);
};

const resetPlayerForm = () => {
  elements.playerForm.reset();
  elements.playerEditId.value = '';
  elements.playerSubmitButton.textContent = 'Register Player';
  toggleHidden(elements.playerCancelEdit, true);
  if (elements.playerImageStyleMode) elements.playerImageStyleMode.value = 'original';
  setEditMode('player', '', false);
};

const resetMatchForm = () => {
  elements.matchForm.reset();
  elements.matchEditId.value = '';
  elements.matchSubmitButton.textContent = 'Create Match';
  toggleHidden(elements.matchCancelEdit, true);
  setEditMode('match', '', false);
};

const resetResultForm = () => {
  elements.resultForm.reset();
  elements.resultEditId.value = '';
  elements.resultSubmitButton.textContent = 'Save Result';
  toggleHidden(elements.resultCancelEdit, true);
  setEditMode('result', '', false);
  updateWinnerOptions();
  updateResultPlayerOptions();
};

const startTeamEdit = (team) => {
  if (!team) return;
  elements.teamEditId.value = team.id;
  document.getElementById('team-name').value = team.name || '';
  document.getElementById('team-short-name').value = team.short_name || '';
  elements.teamLogoUrl.value = team.logo_url || '';
  setValueIfPresent(elements.teamClubType, getTeamType(team));
  document.getElementById('team-primary-color').value = team.primary_color || '#d32027';
  document.getElementById('team-secondary-color').value = team.secondary_color || '#3944a7';
  document.getElementById('team-notes').value = team.notes || '';
  elements.teamSubmitButton.textContent = 'Update Club';
  toggleHidden(elements.teamCancelEdit, false);
  setEditMode('team', team.id, true);
  switchMainTab('database');
  switchDatabaseTab('clubs');
};

const startVenueEdit = (venue) => {
  if (!venue) return;
  elements.venueEditId.value = venue.id;
  document.getElementById('venue-name').value = venue.name || '';
  document.getElementById('venue-city').value = venue.city || '';
  document.getElementById('venue-country').value = venue.country || '';
  elements.venueAddress.value = venue.address || '';
  elements.venueImageUrls.value = (venue.image_urls || []).filter((url) => url.startsWith('http')).join('\n');
  document.getElementById('venue-notes').value = venue.notes || '';
  elements.venueSubmitButton.textContent = 'Update Ground';
  toggleHidden(elements.venueCancelEdit, false);
  setEditMode('venue', venue.id, true);
  switchMainTab('database');
  switchDatabaseTab('grounds');
};

const startPlayerEdit = (player) => {
  if (!player) return;
  elements.playerEditId.value = player.id;
  document.getElementById('player-name').value = player.name || '';
  elements.playerTeam.value = String(player.team_id || '');
  document.getElementById('player-jersey-number').value = player.jersey_number || '';
  document.getElementById('player-batting-style').value = player.batsman_type || player.batting_style || '';
  document.getElementById('player-bowling-style').value = player.bowler_type || player.bowling_style || '';
  document.getElementById('player-category').value = player.player_category || player.role || '';
  if (elements.playerImageStyleMode) elements.playerImageStyleMode.value = getPlayerImageMode(player.id);
  elements.playerSubmitButton.textContent = 'Update Player';
  toggleHidden(elements.playerCancelEdit, false);
  setEditMode('player', player.id, true);
  switchMainTab('database');
  switchDatabaseTab('players');
};

const startMatchEdit = (match) => {
  if (!match) return;
  elements.matchEditId.value = match.id;
  elements.matchTeam1.value = String(match.team1_id || '');
  elements.matchTeam2.value = String(match.team2_id || '');
  document.getElementById('match-date').value = match.match_date || '';
  document.getElementById('match-time').value = match.match_time || '';
  elements.matchVenue.value = findVenue(match.venue_id)?.name || '';
  elements.matchSubmitButton.textContent = 'Update Match';
  toggleHidden(elements.matchCancelEdit, false);
  setEditMode('match', match.id, true);
  switchMainTab('matches');
};

const startResultEdit = (result) => {
  if (!result) return;
  elements.resultEditId.value = result.id;
  elements.resultMatch.value = result.match_id || '';
  updateResultPlayerOptions();
  document.getElementById('team1-score').value = result.team1_score ?? '';
  document.getElementById('team2-score').value = result.team2_score ?? '';
  updateWinnerOptions();
  elements.winnerTeam.value = result.winner_team_id || '';
  elements.tossWinner.value = state.teams.find((team) => team.name === result.toss_winner_name)?.id || '';
  document.getElementById('toss-decision').value = result.toss_decision || '';
  document.getElementById('summary').value = result.summary || '';
  document.getElementById('team1-innings-summary').value = result.team1_innings_summary || '';
  document.getElementById('team2-innings-summary').value = result.team2_innings_summary || '';
  const lineup = getLineupForMatch(result.match_id);
  const potmEntry = lineup.find((entry) => entry.players?.name === result.player_of_match);
  const bestScorerEntry = lineup.find((entry) => entry.players?.name === result.best_scorer_name);
  const bestBowlerEntry = lineup.find((entry) => entry.players?.name === result.best_bowler_name);
  elements.playerOfMatch.value = potmEntry?.player_id || '';
  document.getElementById('player-of-match-style').value = result.player_of_match_style || 'hero';
  elements.bestScorerName.value = bestScorerEntry?.player_id || '';
  document.getElementById('best-score').value = result.best_score || '';
  document.getElementById('best-scorer-style').value = result.best_scorer_style || 'batting';
  elements.bestBowlerName.value = bestBowlerEntry?.player_id || '';
  document.getElementById('best-bowler-figures').value = result.best_bowler_figures || '';
  document.getElementById('best-bowler-style').value = result.best_bowler_style || 'bowling';
  document.getElementById('player-image-url').value = result.player_image_url || '';
  document.getElementById('best-scorer-image-url').value = result.best_scorer_image_url || '';
  document.getElementById('best-bowler-image-url').value = result.best_bowler_image_url || '';
  elements.resultSubmitButton.textContent = 'Update Result';
  toggleHidden(elements.resultCancelEdit, false);
  setEditMode('result', result.id, true);
  switchMainTab('results');
};

const exportTeamsCsv = () => {
  const rows = state.teams.map((team) => ({
    name: team.name,
    short_name: team.short_name,
    team_count: team.team_count || 1,
    squad_labels: (team.squad_labels || []).join('|'),
    primary_color: team.primary_color || '#d32027',
    secondary_color: team.secondary_color || '#3944a7',
    logo_url: team.logo_url || '',
    notes: team.notes || '',
  }));

  downloadCsv('clubs-export.csv', CSV_HEADERS.teams, rows);
  showMessage('Clubs exported as CSV.');
};

const exportPlayersCsv = () => {
  const rows = state.players.map((player) => ({
    name: player.name,
    club_name: findTeam(player.team_id)?.name || '',
    jersey_number: player.jersey_number || '',
    player_category: player.player_category || player.role || '',
    batsman_type: player.batsman_type || player.batting_style || '',
    bowler_type: player.bowler_type || player.bowling_style || '',
    profile_image_url: player.profile_image_url || '',
  }));

  downloadCsv('players-export.csv', CSV_HEADERS.players, rows);
  showMessage('Players exported as CSV.');
};

const downloadTeamsTemplate = async () => {
  await createClubTemplateWorkbook();
  showMessage('Club Excel template downloaded with dropdowns.');
};

const downloadPlayersTemplate = async () => {
  await createPlayerTemplateWorkbook();
  showMessage('Player Excel template downloaded with dropdowns.');
};

const handleTeamsImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const rows = await readSpreadsheetRows(file);
  if (!rows.length) {
    showMessage('The club file is empty or invalid.', 'error');
    return;
  }

  const payload = rows
    .filter((row) => row.name && row.short_name)
    .map((row) => ({
      name: row.name.trim(),
      short_name: row.short_name.trim(),
      team_count: Number(row.team_count) || 1,
      squad_labels: withTeamTypeLabel(buildSquadLabels(Number(row.team_count) || 1), row.club_side || 'home'),
      primary_color: row.primary_color || '#d32027',
      secondary_color: row.secondary_color || '#3944a7',
      logo_url: '',
      notes: row.notes || '',
      created_by: state.session.user.id,
    }));

  await withRequest(async () => {
    const { error } = await supabase.from('teams').upsert(payload, { onConflict: 'name' });
    if (error) throw error;
    event.target.value = '';
    await loadTeams();
  }, 'Clubs imported successfully. Add logos later from Edit Club.');
};

const handlePlayersImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const rows = await readSpreadsheetRows(file);
  if (!rows.length) {
    showMessage('The player file is empty or invalid.', 'error');
    return;
  }

  const homeTeam = getHomeTeams()[0];
  const payload = rows
    .map((row) => {
      const team = findTeamByName(row.club_name || '') || homeTeam;
      if (!team || !row.name) return null;
      return {
        name: row.name.trim(),
        team_id: team.id,
        jersey_number: Number(row.jersey_number) || 0,
        role: row.player_category || 'Player',
        batsman_type: row.batsman_type || '',
        bowler_type: row.bowler_type || '',
        batting_style: row.batsman_type || '',
        bowling_style: row.bowler_type || '',
        player_category: row.player_category || 'Player',
        profile_image_url: row.profile_image_url || '',
        created_by: state.session.user.id,
      };
    })
    .filter(Boolean);

  await withRequest(async () => {
    const existingPlayers = state.players.filter((player) => String(player.team_id) === String(homeTeam?.id));
    const existingByKey = new Map(existingPlayers.map((player) => [
      `${String(player.name || '').trim().toLowerCase()}::${Number(player.jersey_number) || 0}`,
      player,
    ]));

    const updates = [];
    const inserts = [];

    payload.forEach((player) => {
      const key = `${String(player.name || '').trim().toLowerCase()}::${Number(player.jersey_number) || 0}`;
      const existing = existingByKey.get(key);
      if (existing) {
        updates.push({ ...player, id: existing.id, profile_image_url: existing.profile_image_url || '' });
      } else {
        inserts.push(player);
      }
    });

    if (updates.length) {
      const { error: updateError } = await supabase.from('players').upsert(updates, { onConflict: 'id' });
      if (updateError) throw updateError;
    }

    if (inserts.length) {
      const { error: insertError } = await supabase.from('players').insert(inserts);
      if (insertError) throw insertError;
    }

    event.target.value = '';
    await loadPlayers();
  }, 'Players imported and updated successfully.');
};

const handleSignup = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const fullName = document.getElementById('signup-name').value.trim();
  const submitButton = elements.signupForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : '';

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
    const alreadyExists = Array.isArray(identities) && identities.length === 0;

    if (alreadyExists) {
      showMessage('This email may already be registered. Try Login or use Forgot password.', 'error');
      return;
    }

    elements.signupForm.reset();

    if (data?.session) {
      showMessage('Account created and signed in successfully.');
      return;
    }

    showMessage('Account created. Please check your email inbox and confirm your email before logging in.');
    switchAuthTab('login');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Signup failed.', 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText || 'Create Account';
    }
  }
};

const handleLogin = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    elements.loginForm.reset();
    showMessage('Signed in successfully.');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Login failed.', 'error');
  }
};

const handlePasswordReset = async (event) => {
  event.preventDefault();

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    return;
  }

  const email = document.getElementById('reset-email').value.trim();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href,
    });
    if (error) throw error;
    elements.resetForm.reset();
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
    clearSavedTabs(state.session);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    switchAuthTab('login');
    showMessage('Signed out successfully.');
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Logout failed.', 'error');
  }
};

const handleTeamSubmit = async (event) => {
  event.preventDefault();

  const session = await ensureSession();
  const editingId = elements.teamEditId.value;
  const uploadedLogo = await uploadImageFile(elements.teamLogoFile.files?.[0], STORAGE_BUCKETS.team, 'logos');
  const payload = {
    name: document.getElementById('team-name').value.trim(),
    short_name: document.getElementById('team-short-name').value.trim(),
    logo_url: uploadedLogo || elements.teamLogoUrl.value.trim(),
    team_count: 1,
    squad_labels: withTeamTypeLabel(findTeam(editingId)?.squad_labels || [], elements.teamClubType.value),
    primary_color: document.getElementById('team-primary-color').value,
    secondary_color: document.getElementById('team-secondary-color').value,
    notes: document.getElementById('team-notes').value.trim(),
    created_by: session.user.id,
  };

  if (!payload.name || !payload.short_name) {
    showMessage('Team name and short name are required.', 'error');
    return;
  }

  await withRequest(async () => {
    const query = editingId
      ? supabase.from('teams').update(payload).eq('id', editingId).select('*').single()
      : supabase.from('teams').insert([payload]).select('*').single();
    const { data, error } = await query;
    if (error) throw error;

    resetListSearch('teams', elements.teamsSearch);

    if (data) {
      state.teams = upsertStateItem(state.teams, data, (team) => team.name);
      renderTeams();
      populateCoreSelectors();
      renderHomeDashboard();
    }

    resetTeamForm();
    switchMainTab('database');
    switchDatabaseTab('clubs');
    await Promise.allSettled([loadTeams(), loadPlayers(), loadMatches(), loadResults(), loadLineups()]);
  }, editingId ? 'Club updated successfully.' : 'Team saved successfully.');
};

const handleVenueSubmit = async (event) => {
  event.preventDefault();

  const session = await ensureSession();
  const editingId = elements.venueEditId.value;
  const existingVenue = editingId ? findVenue(editingId) : null;
  const mergedImages = await mergeStoredImageSources(elements.venueImageUrls.value, elements.venueImageFiles.files, STORAGE_BUCKETS.venue, 'grounds');
  const payload = {
    name: document.getElementById('venue-name').value.trim(),
    city: document.getElementById('venue-city').value.trim(),
    country: document.getElementById('venue-country').value.trim(),
    address: elements.venueAddress.value.trim(),
    image_urls: editingId ? [...new Set([...(existingVenue?.image_urls || []), ...mergedImages])] : mergedImages,
    notes: document.getElementById('venue-notes').value.trim(),
    created_by: session.user.id,
  };

  if (!payload.name || !payload.city || !payload.country) {
    showMessage('Venue name, city, and country are required.', 'error');
    return;
  }

  await withRequest(async () => {
    const query = editingId
      ? supabase.from('venues').update(payload).eq('id', editingId).select('*').single()
      : supabase.from('venues').insert([payload]).select('*').single();
    const { data, error } = await query;
    if (error) throw error;

    resetListSearch('venues', elements.venuesSearch);

    if (data) {
      state.venues = upsertStateItem(state.venues, data, (venue) => venue.name);
      renderVenues();
      populateCoreSelectors();
      renderHomeDashboard();
    }

    resetVenueForm();
    switchMainTab('database');
    switchDatabaseTab('grounds');
    await Promise.allSettled([loadVenues(), loadMatches()]);
  }, editingId ? 'Ground updated successfully.' : 'Venue saved successfully.');
};

const handleSocialLinkSubmit = async (event) => {
  event.preventDefault();

  const session = await ensureSession();
  const payload = {
    platform: document.getElementById('social-link-platform').value,
    label: document.getElementById('social-link-label').value.trim(),
    url: document.getElementById('social-link-url').value.trim(),
    created_by: session.user.id,
  };

  if (!payload.platform || !payload.label || !payload.url) {
    showMessage('Please complete every social link field.', 'error');
    return;
  }

  await withRequest(async () => {
    const { data, error } = await supabase.from('social_links').insert([payload]).select('*').single();
    if (error) throw error;

    if (data) {
      state.socialLinks = upsertStateItem(state.socialLinks, data, (link) => `${link.platform}-${link.label}`);
      renderSocialLinks();
      renderSocialLinkChoices(elements.posterSocialLinks, 'poster-social-link');
      renderSocialLinkChoices(elements.resultPosterSocialLinks, 'result-poster-social-link');
    }

    elements.socialLinkForm.reset();
  }, 'Social link saved successfully.');
};

const handlePlayerSubmit = async (event) => {
  event.preventDefault();

  const session = await ensureSession();
  const editingId = elements.playerEditId.value;
  const existingPlayer = state.players.find((player) => String(player.id) === String(editingId));
  const uploadedProfile = await uploadImageFile(elements.playerProfileFile.files?.[0], STORAGE_BUCKETS.player, 'profiles');
  const payload = {
    name: document.getElementById('player-name').value.trim(),
    team_id: elements.playerTeam.value,
    jersey_number: Number(document.getElementById('player-jersey-number').value),
    role: document.getElementById('player-category').value,
    batsman_type: document.getElementById('player-batting-style').value.trim(),
    bowler_type: document.getElementById('player-bowling-style').value.trim(),
    batting_style: document.getElementById('player-batting-style').value.trim(),
    bowling_style: document.getElementById('player-bowling-style').value.trim(),
    player_category: document.getElementById('player-category').value,
    profile_image_url: uploadedProfile || existingPlayer?.profile_image_url || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.team_id || !payload.jersey_number || !payload.batsman_type || !payload.bowler_type || !payload.player_category) {
    if (!payload.team_id) {
      showMessage('Save at least one Home Club first so players can be linked automatically.', 'error');
      return;
    }
    showMessage('Please complete every player field.', 'error');
    return;
  }

  await withRequest(async () => {
    const query = editingId
      ? supabase.from('players').update(payload).eq('id', editingId).select('*').single()
      : supabase.from('players').insert([payload]).select('*').single();
    const { data, error } = await query;
    if (error) throw error;

    resetListSearch('players', elements.playersSearch);

    if (data) {
      setPlayerImageMode(data.id, elements.playerImageStyleMode?.value || 'original');
      state.players = upsertStateItem(state.players, data, (player) => player.name);
      renderPlayers();
      updateLineupPlayerOptions();
      renderHomeDashboard();
    }

    resetPlayerForm();
    switchMainTab('database');
    switchDatabaseTab('players');
    await Promise.allSettled([loadPlayers(), loadLineups()]);
  }, editingId ? 'Player updated successfully.' : 'Player saved successfully.');
};

const handleMatchSubmit = async (event) => {
  event.preventDefault();

  const session = await ensureSession();
  const editingId = elements.matchEditId.value;
  const homeTeam = findTeam(elements.matchTeam1.value);
  const awayTeam = findTeam(elements.matchTeam2.value);
  const venue = findVenueByName(elements.matchVenue.value);
  const payload = {
    team1_id: homeTeam?.id || '',
    team2_id: awayTeam?.id || '',
    venue_id: venue?.id || '',
    match_date: document.getElementById('match-date').value,
    match_time: document.getElementById('match-time').value,
    created_by: session.user.id,
  };

  if (!payload.team1_id || !payload.team2_id || !payload.venue_id || !payload.match_date || !payload.match_time) {
    showMessage('Please complete every match field.', 'error');
    return;
  }

  if (payload.team1_id === payload.team2_id) {
    showMessage('A match needs two different teams.', 'error');
    return;
  }

  if (!homeTeam || getTeamType(homeTeam) !== 'home' || !awayTeam || getTeamType(awayTeam) !== 'opponent') {
    showMessage('Please choose a Home club and an Opponent club from the dropdowns.', 'error');
    return;
  }

  await withRequest(async () => {
    const query = editingId
      ? supabase.from('matches').update(payload).eq('id', editingId).select('*').single()
      : supabase.from('matches').insert([payload]).select('*').single();
    const { data, error } = await query;
    if (error) throw error;
    state.lastSavedMatchId = String(data?.id || editingId || '');
    resetMatchForm();
    await Promise.all([loadMatches(), loadResults()]);
    populateCoreSelectors();
    renderLineup();
  }, editingId ? 'Match updated successfully.' : 'Match created successfully.');
};

const handleLineupSubmit = async (event) => {
  event.preventDefault();

  const matchId = elements.lineupMatch.value;
  const playerId = elements.lineupPlayer.value;
  const matchRole = elements.lineupRole.value;

  await addLineupEntry(matchId, playerId, matchRole);
};

const handleResultSubmit = async (event) => {
  event.preventDefault();

  const editingId = elements.resultEditId.value;
  const playerImageFile = document.getElementById('player-image-file').files?.[0];
  const bestScorerImageFile = document.getElementById('best-scorer-image-file').files?.[0];
  const bestBowlerImageFile = document.getElementById('best-bowler-image-file').files?.[0];
  const playerOfMatchRecord = findPlayer(elements.playerOfMatch.value);
  const bestScorerRecord = findPlayer(elements.bestScorerName.value);
  const bestBowlerRecord = findPlayer(elements.bestBowlerName.value);

  const payload = {
    match_id: elements.resultMatch.value,
    team1_score: Number(document.getElementById('team1-score').value),
    team2_score: Number(document.getElementById('team2-score').value),
    winner_team_id: elements.winnerTeam.value || null,
    toss_winner_name: findTeam(elements.tossWinner.value)?.name || '',
    toss_decision: document.getElementById('toss-decision').value,
    summary: document.getElementById('summary').value.trim(),
    team1_innings_summary: document.getElementById('team1-innings-summary').value.trim(),
    team2_innings_summary: document.getElementById('team2-innings-summary').value.trim(),
    player_of_match: playerOfMatchRecord?.name || '',
    player_of_match_style: document.getElementById('player-of-match-style').value,
    best_score: document.getElementById('best-score').value.trim(),
    best_scorer_name: bestScorerRecord?.name || '',
    best_scorer_style: document.getElementById('best-scorer-style').value,
    best_bowler_name: bestBowlerRecord?.name || '',
    best_bowler_figures: document.getElementById('best-bowler-figures').value.trim(),
    best_bowler_style: document.getElementById('best-bowler-style').value,
    player_image_url: document.getElementById('player-image-url').value.trim() || playerOfMatchRecord?.profile_image_url || '',
    best_scorer_image_url: document.getElementById('best-scorer-image-url').value.trim() || bestScorerRecord?.profile_image_url || '',
    best_bowler_image_url: document.getElementById('best-bowler-image-url').value.trim() || bestBowlerRecord?.profile_image_url || '',
    created_by: state.session.user.id,
  };

  if (!payload.match_id || Number.isNaN(payload.team1_score) || Number.isNaN(payload.team2_score) || !payload.winner_team_id || !payload.toss_winner_name || !payload.toss_decision || !payload.player_of_match || !payload.best_scorer_name || !payload.best_bowler_name) {
    showMessage('Please complete the required result fields.', 'error');
    return;
  }

  await withRequest(async () => {
    const localPlayerImage = await readLocalImage(playerImageFile);
    const localBestScorerImage = await readLocalImage(bestScorerImageFile);
    const localBestBowlerImage = await readLocalImage(bestBowlerImageFile);

    const query = editingId
      ? supabase.from('results').update(payload).eq('id', editingId)
      : supabase.from('results').upsert(payload, { onConflict: 'match_id' });
    const { error } = await query;
    if (error) throw error;

    state.transientResultMedia.set(String(payload.match_id), {
      playerOfMatchImage: localPlayerImage,
      bestScorerImage: localBestScorerImage,
      bestBowlerImage: localBestBowlerImage,
    });

    resetResultForm();
    await loadResults();
  }, editingId ? 'Result updated successfully.' : 'Result saved successfully.');
};

const renderStyledPlayerCard = ({ title, name, imageUrl, styleKey, fallbackText, accentClass, imageMode = 'original' }) => `
  <aside class="poster-box player-highlight ${accentClass}">
    <div class="player-highlight-top">
      <h3>${htmlEscape(title)}</h3>
      <span class="style-chip">${htmlEscape(getStyleLabel(styleKey))}</span>
    </div>
    <div class="player-image-shell style-${htmlEscape(styleKey || 'hero')} image-mode-${htmlEscape(imageMode)}">
      ${imageUrl ? `<img src="${htmlEscape(imageUrl)}" alt="${htmlEscape(name || title)}" class="player-highlight-image" />` : `<div class="player-placeholder">${htmlEscape(fallbackText)}</div>`}
      ${imageMode === 'white-kit' ? `
        <div class="club-shirt-badge">
          <img src="./logo.svg" alt="Club crest" class="club-shirt-logo" />
        </div>
        <div class="kit-overlay">White Kit</div>
      ` : '<div class="kit-overlay original-photo">Original Photo</div>'}
    </div>
    <p class="player-highlight-name">${htmlEscape(name || 'Not added')}</p>
  </aside>
`;

const renderResultPoster = () => {
  const matchId = elements.resultPosterMatch.value;

  if (!matchId) {
    state.activeResultPosterMatchId = '';
    elements.downloadResultPoster.disabled = true;
    setEmptyState(elements.resultPosterHost, 'Select a completed match to generate its result poster.');
    return;
  }

  const match = findMatch(matchId);
  const result = state.results.find((item) => String(item.match_id) === String(matchId));
  const venue = match ? findVenue(match.venue_id) : null;
  const team1 = match ? findTeam(match.team1_id) : null;
  const team2 = match ? findTeam(match.team2_id) : null;
  const winner = result ? findTeam(result.winner_team_id) : null;
  const lineupSummary = getLineupSummary(matchId);
  const winningCaptainName = getWinningCaptainName(match, result);
  const transientMedia = state.transientResultMedia.get(String(matchId)) || {};
  const sponsorMarkup = getSponsorMarkup(getResultSponsorImages(), 'Add sponsor picture URLs to show partner branding on this result poster.');
  const socialLinks = getSelectedSocialLinks(elements.resultPosterSocialLinks);

  if (!match || !result || !team1 || !team2 || !venue) {
    elements.downloadResultPoster.disabled = true;
    setEmptyState(elements.resultPosterHost, 'This result poster needs a completed match with saved result data.');
    return;
  }

  const playerOfMatchRecord = state.players.find((player) => player.name === result.player_of_match);
  const bestScorerRecord = state.players.find((player) => player.name === result.best_scorer_name);
  const bestBowlerRecord = state.players.find((player) => player.name === result.best_bowler_name);
  const venueImage = Array.isArray(venue.image_urls) && venue.image_urls.length ? venue.image_urls[0] : '';
  const playerOfMatchImage = transientMedia.playerOfMatchImage || result.player_image_url || '';
  const bestScorerImage = transientMedia.bestScorerImage || result.best_scorer_image_url || '';
  const bestBowlerImage = transientMedia.bestBowlerImage || result.best_bowler_image_url || '';
  const playerOfMatchMode = playerOfMatchRecord ? getPlayerImageMode(playerOfMatchRecord.id) : 'original';
  const bestScorerMode = bestScorerRecord ? getPlayerImageMode(bestScorerRecord.id) : 'original';
  const bestBowlerMode = bestBowlerRecord ? getPlayerImageMode(bestBowlerRecord.id) : 'original';
  const winningCaptainName = getWinningCaptainName(match, result);

  elements.resultPosterHost.innerHTML = `
    <article
      class="poster-card result-poster-card"
      id="result-poster-card"
      style="
        --poster-width: 1080;
        --poster-height: 1350;
        background:
          linear-gradient(160deg, rgba(10, 14, 35, 0.84), rgba(57, 68, 167, 0.66) 45%, rgba(211, 32, 39, 0.58) 100%),
          ${venueImage ? `url('${htmlEscape(venueImage)}') center/cover no-repeat,` : ''}
          linear-gradient(135deg, #11152f 0%, #3944a7 48%, #d32027 100%);
      "
    >
      <div class="poster-top">
        <div>
          <span class="poster-badge">Match Result</span>
          <h2 class="poster-title">${htmlEscape(team1.name)}<br />${result.team1_score} - ${result.team2_score}<br />${htmlEscape(team2.name)}</h2>
          <p class="poster-subtitle">${formatDate(match.match_date)} | ${htmlEscape(venue.name)}</p>
        </div>
        <div class="poster-logos">
          ${team1.logo_url ? `<img src="${htmlEscape(team1.logo_url)}" alt="${htmlEscape(team1.name)} logo" class="poster-logo" />` : ''}
          ${team2.logo_url ? `<img src="${htmlEscape(team2.logo_url)}" alt="${htmlEscape(team2.name)} logo" class="poster-logo" />` : ''}
        </div>
      </div>
      <div class="poster-grid result-poster-grid">
        <section class="poster-box">
          <h3>Match Summary</h3>
          <p>${htmlEscape(result.summary || 'No summary added.')}</p>
          <div class="poster-info">
            <div>
              <strong>Winner</strong>
              <span>${htmlEscape(winner?.name || 'TBD')}</span>
            </div>
            <div>
              <strong>Toss</strong>
              <span>${htmlEscape(result.toss_winner_name || 'Not added')}${result.toss_decision ? ` | ${htmlEscape(result.toss_decision)}` : ''}</span>
            </div>
            <div>
              <strong>Top Score</strong>
              <span>${htmlEscape(result.best_score || 'Not added')}</span>
            </div>
            <div>
              <strong>Top Run Scorer</strong>
              <span>${htmlEscape(result.best_scorer_name || 'Not added')}</span>
            </div>
            <div>
              <strong>Best Bowler</strong>
              <span>${htmlEscape(result.best_bowler_name || 'Not added')}</span>
            </div>
            <div>
              <strong>Bowling Figures</strong>
              <span>${htmlEscape(result.best_bowler_figures || 'Not added')}</span>
            </div>
            <div>
              <strong>Ground</strong>
              <span>${htmlEscape(venue.name)}</span>
            </div>
            <div>
              <strong>Home Captain</strong>
              <span>${htmlEscape(lineupSummary.homeCaptain || 'Not set')}</span>
            </div>
            <div>
              <strong>Home Vice Captain</strong>
              <span>${htmlEscape(lineupSummary.homeViceCaptain || 'Not set')}</span>
            </div>
            <div>
              <strong>Home Wicketkeeper</strong>
              <span>${htmlEscape(lineupSummary.homeWicketkeeper || 'Not set')}</span>
            </div>
            <div>
              <strong>Away Captain</strong>
              <span>${htmlEscape(lineupSummary.awayCaptain || 'Not set')}</span>
            </div>
            <div>
              <strong>Away Vice Captain</strong>
              <span>${htmlEscape(lineupSummary.awayViceCaptain || 'Not set')}</span>
            </div>
            <div>
              <strong>Away Wicketkeeper</strong>
              <span>${htmlEscape(lineupSummary.awayWicketkeeper || 'Not set')}</span>
            </div>
            <div>
              <strong>Winning Captain</strong>
              <span>${htmlEscape(winningCaptainName || 'Not set')}</span>
            </div>
            <div>
              <strong>Home Innings</strong>
              <span>${htmlEscape(result.team1_innings_summary || 'Not added')}</span>
            </div>
            <div>
              <strong>Away Innings</strong>
              <span>${htmlEscape(result.team2_innings_summary || 'Not added')}</span>
            </div>
          </div>
        </section>
        <div class="result-player-stack">
          ${renderStyledPlayerCard({
            title: 'Player Of The Match',
            name: result.player_of_match,
            imageUrl: playerOfMatchImage,
            styleKey: result.player_of_match_style || 'hero',
            fallbackText: 'Add or upload a player-of-the-match picture to feature the player here.',
            accentClass: 'player-card-primary',
            imageMode: playerOfMatchMode,
          })}
          ${renderStyledPlayerCard({
            title: 'Top Run Scorer',
            name: `${result.best_scorer_name || 'Not added'}${result.best_score ? ` | ${result.best_score}` : ''}`,
            imageUrl: bestScorerImage,
            styleKey: result.best_scorer_style || 'batting',
            fallbackText: 'Add or upload a best-scorer picture to feature the player here.',
            accentClass: 'player-card-secondary',
            imageMode: bestScorerMode,
          })}
          ${renderStyledPlayerCard({
            title: 'Best Bowler',
            name: `${result.best_bowler_name || 'Not added'}${result.best_bowler_figures ? ` | ${result.best_bowler_figures}` : ''}`,
            imageUrl: bestBowlerImage,
            styleKey: result.best_bowler_style || 'bowling',
            fallbackText: 'Add or upload a best-bowler picture to feature the player here.',
            accentClass: 'player-card-secondary',
            imageMode: bestBowlerMode,
          })}
        </div>
      </div>
      <section class="poster-box sponsor-box result-sponsor-box">
        <h3>Partners</h3>
        <div class="poster-sponsor-grid">
          ${sponsorMarkup}
        </div>
      </section>
      <section class="poster-box poster-social-box result-social-box">
        <h3>Watch And Follow</h3>
        ${getSocialLinkMarkup(socialLinks)}
      </section>
    </article>
  `;

  state.activeResultPosterMatchId = String(matchId);
  elements.resultCaptionOutput.value = buildResultCaption(match, result);
  elements.downloadResultPoster.disabled = false;
};

const downloadResultPoster = async () => {
  const posterCard = document.getElementById('result-poster-card');

  if (!posterCard) {
    showMessage('Generate a result poster before downloading.', 'error');
    return;
  }

  try {
    if (!window.html2canvas) {
      const module = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
      window.html2canvas = module.default;
    }

    const canvas = await window.html2canvas(posterCard, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    const match = findMatch(state.activeResultPosterMatchId);
    const filename = match
      ? `${getMatchLabel(match)}-result-poster`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'result-poster';

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${filename}.png`;
    link.click();
    showMessage('Result poster downloaded as PNG.');
  } catch (error) {
    console.error(error);
    showMessage('Result poster download failed. Please try again.', 'error');
  }
};

const downloadPoster = async () => {
  const posterCard = elements.posterHost.querySelector(`[data-variant-key="${state.selectedPosterVariantKey}"]`) || elements.posterHost.querySelector('.poster-variant');

  if (!posterCard) {
    showMessage('Generate a poster before downloading.', 'error');
    return;
  }

  try {
    if (!window.html2canvas) {
      const module = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
      window.html2canvas = module.default;
    }

    const canvas = await window.html2canvas(posterCard, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    const matchId = posterCard.dataset.matchId;
    const match = findMatch(matchId);
    const filename = match
      ? `${getMatchLabel(match)}-${state.selectedPosterVariantKey}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'match-poster';
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${filename}.png`;
    link.click();
    showMessage('Poster downloaded as PNG.');
  } catch (error) {
    console.error(error);
    showMessage('Poster download failed. Please try again.', 'error');
  }
};

const handlePosterSelection = (event) => {
  const posterCard = event.target.closest('.poster-variant');
  if (!posterCard) return;

  elements.posterHost.querySelectorAll('.poster-variant').forEach((card) => {
    card.classList.remove('selected-poster');
  });

  posterCard.classList.add('selected-poster');
  state.selectedPosterVariantKey = posterCard.dataset.variantKey || '';
  const badge = posterCard.querySelector('.poster-badge');
  elements.posterSelectionLabel.textContent = `Selected: ${badge ? badge.textContent : 'Design'}`;
};

const handleDelete = async (table, id, successMessage, afterLoaders = []) => {
  openConfirmModal('Confirm Delete', 'This action will permanently remove the selected record.', async () => {
    await withRequest(async () => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await Promise.all(afterLoaders.map((loader) => loader()));
    }, successMessage);
  });
};

const handleBulkDelete = async (table, ids, successMessage, afterLoaders = [], selectionKey = '') => {
  if (!ids.length) return;

  openConfirmModal('Confirm Bulk Delete', `Delete ${ids.length} selected record(s)? This cannot be undone.`, async () => {
    await withRequest(async () => {
      const { error } = await supabase.from(table).delete().in('id', ids);
      if (error) throw error;
      if (selectionKey) state.selectedRows[selectionKey].clear();
      await Promise.all(afterLoaders.map((loader) => loader()));
      updateBulkActionState();
    }, successMessage);
  });
};

const handleListActions = async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const { action, id, matchId } = button.dataset;

  if (action === 'change-role') {
    if (!isAdmin()) {
      showMessage('Only admins can change access levels.', 'error');
      return;
    }

    if (!isSuperAdmin() && button.value === 'super_admin') {
      showMessage('Only the super admin can assign the super admin role.', 'error');
      await loadProfiles();
      return;
    }

    await withRequest(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ access_level: button.value })
        .eq('id', id);

      if (error) throw error;
      await Promise.all([loadProfiles(), loadProfile()]);
    }, 'Access level updated.');
    return;
  }

  if (!id) return;

  if (action === 'edit-team') {
    startTeamEdit(findTeam(id));
    return;
  }

  if (action === 'edit-venue') {
    startVenueEdit(findVenue(id));
    return;
  }

  if (action === 'edit-player') {
    startPlayerEdit(state.players.find((player) => String(player.id) === String(id)));
    return;
  }

  if (action === 'open-match-poster') {
    openPosterStudio(id, 'match');
    return;
  }

  if (action === 'open-lineup-selector') {
    openLineupSelector(id);
    return;
  }

  if (action === 'close-lineup-selector') {
    if (elements.lineupMatch) elements.lineupMatch.value = '';
    state.ui.inlineLineupPlayerId = '';
    state.ui.inlineLineupRole = 'player';
    renderMatches();
    renderLineup();
    return;
  }

  if (action === 'change-inline-lineup-player') {
    state.ui.inlineLineupPlayerId = button.value || '';
    renderMatches();
    return;
  }

  if (action === 'change-inline-lineup-role') {
    state.ui.inlineLineupRole = button.value || 'player';
    renderMatches();
    return;
  }

  if (action === 'add-inline-lineup') {
    await addLineupEntry(id, state.ui.inlineLineupPlayerId, state.ui.inlineLineupRole);
    return;
  }

  if (action === 'open-lineup-poster') {
    openPosterStudio(id, 'lineup');
    return;
  }

  if (action === 'edit-match') {
    startMatchEdit(findMatch(id));
    return;
  }

  if (action === 'edit-result') {
    startResultEdit(state.results.find((result) => String(result.id) === String(id)));
    return;
  }

  if (action === 'toggle-player-select') {
    if (button.checked) state.selectedRows.players.add(String(id));
    else state.selectedRows.players.delete(String(id));
    updateBulkActionState();
    return;
  }

  if (action === 'toggle-team-select') {
    if (button.checked) state.selectedRows.teams.add(String(id));
    else state.selectedRows.teams.delete(String(id));
    updateBulkActionState();
    return;
  }

  if (action === 'page-prev' || action === 'page-next') {
    const key = button.dataset.key;
    if (!key) return;
    state.pagination[key] = Math.max(1, state.pagination[key] + (action === 'page-next' ? 1 : -1));
    renderTeams();
    renderVenues();
    renderPlayers();
    renderMatches();
    renderResults();
    return;
  }

  if (action === 'delete-team') {
    await handleDelete('teams', id, 'Team deleted.', [loadTeams, loadPlayers, loadMatches, loadResults, loadLineups]);
  }

  if (action === 'delete-venue') {
    await handleDelete('venues', id, 'Venue deleted.', [loadVenues, loadMatches]);
  }

  if (action === 'delete-player') {
    await handleDelete('players', id, 'Player deleted.', [loadPlayers, loadLineups]);
  }

  if (action === 'delete-social-link') {
    await handleDelete('social_links', id, 'Social link deleted.', [loadSocialLinks]);
  }

  if (action === 'delete-match') {
    await handleDelete('matches', id, 'Match deleted.', [loadMatches, loadLineups, loadResults]);
    if (String(elements.posterMatch.value) === String(id)) {
      state.activePosterMatchIds = [];
      elements.posterMatch.value = '';
      renderPoster();
    }
  }

  if (action === 'delete-lineup') {
    if (!isAdmin()) {
      showMessage('Only admins can change the playing XI and match roles.', 'error');
      return;
    }
    await handleDelete('lineups', id, 'Player removed from playing XI.', [loadLineups]);
    if (matchId && String(elements.posterMatch.value) === String(matchId)) {
      renderPoster();
    }
  }

  if (action === 'delete-result') {
    await handleDelete('results', id, 'Result deleted.', [loadResults]);
  }
};

const setSignedOutState = () => {
  clearSavedTabs();
  state.profile = null;
  state.profiles = [];
  state.teams = [];
  state.venues = [];
  state.socialLinks = [];
  state.players = [];
  state.matches = [];
  state.results = [];
  state.lineupsByMatch = new Map();
  state.transientResultMedia = new Map();
  state.activePosterMatchIds = [];
  state.activeResultPosterMatchId = '';
  state.selectedPosterVariantKey = '';
  if (elements.posterVenueImage) elements.posterVenueImage.innerHTML = '<option value="">Auto rotate saved pictures</option>';
  setValueIfPresent(elements.posterSponsorImages, '');
  setValueIfPresent(elements.resultPosterSponsorImages, '');
  setValueIfPresent(elements.posterCaptionOutput, '');
  setValueIfPresent(elements.resultCaptionOutput, '');
  setValueIfPresent(elements.matchTeam1, '');
  setValueIfPresent(elements.matchTeam2, '');
  setValueIfPresent(elements.matchVenue, '');
  state.filters.players = '';
  state.filters.teams = '';
  state.filters.venues = '';
  state.filters.matches = '';
  state.filters.results = '';
  state.ui.playersCategoryFilter = 'all';
  state.pagination.players = 1;
  state.pagination.teams = 1;
  state.pagination.venues = 1;
  state.pagination.matches = 1;
  state.pagination.results = 1;
  state.selectedRows.players.clear();
  state.selectedRows.teams.clear();
  setValueIfPresent(elements.playersSearch, '');
  setValueIfPresent(elements.teamsSearch, '');
  setValueIfPresent(elements.venuesSearch, '');
  setValueIfPresent(elements.matchesSearch, '');
  setValueIfPresent(elements.resultsSearch, '');
  resetPlayerForm();
  resetTeamForm();
  resetVenueForm();
  resetMatchForm();
  resetResultForm();
  updateBulkActionState();
  setEmptyState(elements.posterSocialLinks, 'Sign in to select saved social links.');
  setEmptyState(elements.resultPosterSocialLinks, 'Sign in to select saved social links.');
  setEmptyState(elements.posterMatchPicker, 'Sign in to select upcoming matches.');
  setEmptyState(elements.statsGrid, 'Sign in to view club stats.');
  setEmptyState(elements.homeUpcomingList, 'Sign in to view upcoming fixtures.');
  setEmptyState(elements.homeResultsList, 'Sign in to view recent results.');
  setEmptyState(elements.homeClubsList, 'Sign in to view saved clubs.');
  setEmptyState(elements.homePlayersList, 'Sign in to view saved players.');
  updateSessionCard();
  renderProfiles();
  renderTeams();
  renderVenues();
  renderSocialLinks();
  renderPlayers();
  renderMatches();
  renderLineup();
  renderResults();
  setEmptyState(elements.posterHost, 'Sign in to work with teams, lineups, results, and posters.');
  setEmptyState(elements.resultPosterHost, 'Sign in to generate result posters from completed matches.');
  switchMainTab(DEFAULT_MAIN_TAB);
  switchDatabaseTab(DEFAULT_DATABASE_TAB);
  switchAuthTab('signup');
  updateAuthAvailability();
};

const bootstrapSession = async (session) => {
  state.session = session;

  if (!session) {
    setSignedOutState();
    return;
  }

  try {
    await loadProfile();
    await refreshData();
    renderHomeDashboard();
    setEmptyState(elements.posterHost, 'Choose a match and click "Generate Poster" to preview it here.');
    setValueIfPresent(elements.posterCaptionOutput, '');
    setValueIfPresent(elements.resultCaptionOutput, '');
    const nextMainTab = getSavedMainTab();
    const nextDatabaseTab = getSavedDatabaseTab();
    switchMainTab(nextMainTab);
    switchDatabaseTab(nextDatabaseTab);
  } catch (error) {
    console.error(error);
    showMessage(error.message || 'Failed to load session data.', 'error');
  }
};

const createSafeWindowHandler = (handler) => (event) => {
  const safeEvent = event && typeof event.preventDefault === 'function'
    ? event
    : { preventDefault() {} };

  Promise.resolve(handler(safeEvent)).catch((error) => {
    console.error(error);
    showMessage(error.message || 'Something went wrong.', 'error');
  });
};

window.__appHandleTeamSubmit = createSafeWindowHandler(handleTeamSubmit);
window.__appHandleVenueSubmit = createSafeWindowHandler(handleVenueSubmit);
window.__appHandlePlayerSubmit = createSafeWindowHandler(handlePlayerSubmit);
window.__appHandleMatchSubmit = createSafeWindowHandler(handleMatchSubmit);

const init = async () => {
  window.__gccAppReady = true;

  window.addEventListener('gcc:refresh-data', async (event) => {
    try {
      await refreshData();
      const matchId = event?.detail?.matchId;
      if (matchId) {
        state.lastSavedMatchId = String(matchId);
        populateCoreSelectors();
        renderLineup();
      }
    } catch (error) {
      console.error(error);
      showMessage(error.message || 'Could not refresh the app data.', 'error');
    }
  });

  if (elements.schemaSql) elements.schemaSql.textContent = schemaSQL;
  updateAuthAvailability();

  addListener(elements.mainTabHome, 'click', () => switchMainTab('home'));
  addListener(elements.mainTabDatabase, 'click', () => switchMainTab('database'));
  addListener(elements.mainTabMatches, 'click', () => switchMainTab('matches'));
  addListener(elements.mainTabResults, 'click', () => switchMainTab('results'));
  addListener(elements.mainTabPoster, 'click', () => switchMainTab('poster'));
  addListener(elements.mainTabAdmin, 'click', () => switchMainTab('admin'));
  addListener(elements.homeActionPlayer, 'click', () => {
    switchMainTab('database');
    switchDatabaseTab('players');
  });
  addListener(elements.homeActionMatch, 'click', () => switchMainTab('matches'));
  addListener(elements.homeActionPoster, 'click', () => switchMainTab('poster'));
  addListener(elements.homeNavSchedule, 'click', () => switchMainTab('matches'));
  addListener(elements.homeNavResults, 'click', () => switchMainTab('results'));
  addListener(elements.homeNavUpcoming, 'click', () => switchMainTab('matches'));
  addListener(elements.homeNavLatestResults, 'click', () => switchMainTab('results'));
  addListener(elements.homeNavClubs, 'click', () => {
    switchMainTab('database');
    switchDatabaseTab('clubs');
  });
  addListener(elements.homeNavPosters, 'click', () => switchMainTab('poster'));
  addListener(elements.databaseTabPlayers, 'click', () => switchDatabaseTab('players'));
  addListener(elements.databaseTabClubs, 'click', () => switchDatabaseTab('clubs'));
  addListener(elements.databaseTabGrounds, 'click', () => switchDatabaseTab('grounds'));
  addListener(elements.databaseTabSocial, 'click', () => switchDatabaseTab('social'));
  addListener(elements.databaseTabSheets, 'click', () => switchDatabaseTab('sheets'));
  addListener(elements.logoutButton, 'click', handleLogout);
  addListener(elements.teamForm, 'submit', handleTeamSubmit);
  addListener(elements.teamCancelEdit, 'click', resetTeamForm);
  addListener(elements.socialLinkForm, 'submit', handleSocialLinkSubmit);
  addListener(elements.venueForm, 'submit', handleVenueSubmit);
  addListener(elements.venueCancelEdit, 'click', resetVenueForm);
  addListener(elements.playerForm, 'submit', handlePlayerSubmit);
  addListener(elements.playerCancelEdit, 'click', resetPlayerForm);
  addListener(elements.matchForm, 'submit', handleMatchSubmit);
  addListener(elements.matchCancelEdit, 'click', resetMatchForm);
  addListener(elements.lineupForm, 'submit', handleLineupSubmit);
  addListener(elements.resultForm, 'submit', handleResultSubmit);
  addListener(elements.resultCancelEdit, 'click', resetResultForm);
  addListener(elements.playersSearch, 'input', (event) => {
    state.pagination.players = 1;
    state.filters.players = event.target.value;
    renderPlayers();
  });
  addListener(elements.playersCategoryFilter, 'change', (event) => {
    state.pagination.players = 1;
    state.ui.playersCategoryFilter = event.target.value || 'all';
    renderPlayers();
  });
  addListener(elements.playersExport, 'click', exportPlayersCsv);
  addListener(elements.playersTemplate, 'click', downloadPlayersTemplate);
  addListener(elements.playersImportFile, 'change', handlePlayersImport);
  addListener(elements.playersViewMode, 'change', (event) => {
    state.ui.playersViewMode = event.target.value;
    renderPlayers();
  });
  addListener(elements.playersSort, 'change', (event) => {
    state.ui.playersSort = event.target.value;
    renderPlayers();
  });
  addListener(elements.playersSelectPage, 'click', () => {
    const query = normaliseQuery(state.filters.players);
    const filteredPlayers = sortByMode(state.players.filter((player) => {
      const team = findTeam(player.team_id);
      return matchesFilter(query, [player.name, player.jersey_number, player.player_category, player.role, player.batsman_type, player.bowler_type, team?.name, team?.short_name]);
    }), state.ui.playersSort, (player, mode) => {
      if (mode.startsWith('jersey')) return Number(player.jersey_number) || 0;
      if (mode.startsWith('club')) return findTeam(player.team_id)?.name || '';
      return player.name || '';
    });
    const paginated = getPaginatedItems(filteredPlayers, 'players');
    paginated.items.forEach((player) => state.selectedRows.players.add(String(player.id)));
    renderPlayers();
  });
  addListener(elements.playersBulkDelete, 'click', () => {
    handleBulkDelete('players', [...state.selectedRows.players], 'Selected players deleted.', [loadPlayers, loadLineups], 'players');
  });
  addListener(elements.teamsSearch, 'input', (event) => {
    state.pagination.teams = 1;
    state.filters.teams = event.target.value;
    renderTeams();
  });
  addListener(elements.teamsExport, 'click', exportTeamsCsv);
  addListener(elements.teamsTemplate, 'click', downloadTeamsTemplate);
  addListener(elements.teamsImportFile, 'change', handleTeamsImport);
  addListener(elements.teamsViewMode, 'change', (event) => {
    state.ui.teamsViewMode = event.target.value;
    renderTeams();
  });
  addListener(elements.teamsSort, 'change', (event) => {
    state.ui.teamsSort = event.target.value;
    renderTeams();
  });
  addListener(elements.teamsSelectPage, 'click', () => {
    const query = normaliseQuery(state.filters.teams);
    const filteredTeams = sortByMode(state.teams.filter((team) => matchesFilter(query, [team.name, team.short_name, team.notes, team.primary_color, team.secondary_color, ...(team.squad_labels || [])])), state.ui.teamsSort, (team, mode) => {
      if (mode.startsWith('count')) return Number(team.team_count) || 0;
      return team.name || '';
    });
    const paginated = getPaginatedItems(filteredTeams, 'teams');
    paginated.items.forEach((team) => state.selectedRows.teams.add(String(team.id)));
    renderTeams();
  });
  addListener(elements.teamsBulkDelete, 'click', () => {
    handleBulkDelete('teams', [...state.selectedRows.teams], 'Selected clubs deleted.', [loadTeams, loadPlayers, loadMatches, loadResults, loadLineups], 'teams');
  });
  addListener(elements.venuesSearch, 'input', (event) => {
    state.pagination.venues = 1;
    state.filters.venues = event.target.value;
    renderVenues();
  });
  addListener(elements.matchesSearch, 'input', (event) => {
    state.pagination.matches = 1;
    state.filters.matches = event.target.value;
    renderMatches();
  });
  addListener(elements.resultsSearch, 'input', (event) => {
    state.pagination.results = 1;
    state.filters.results = event.target.value;
    renderResults();
  });
  addListener(elements.confirmCancel, 'click', closeConfirmModal);
  addListener(elements.confirmModal, 'click', (event) => {
    if (event.target === elements.confirmModal) closeConfirmModal();
  });
  addListener(elements.confirmAccept, 'click', async () => {
    const action = state.pendingConfirm;
    closeConfirmModal();
    if (action) await action();
  });
  addListener(elements.lineupMatch, 'change', () => {
    updateLineupTeamOptions();
    updateLineupPlayerOptions();
    renderMatches();
    renderLineup();
  });
  addListener(elements.lineupTeamSide, 'change', updateLineupPlayerOptions);
  addListener(elements.resultMatch, 'change', () => {
    updateWinnerOptions();
    updateResultPlayerOptions();
    document.getElementById('player-image-url').value = '';
    document.getElementById('best-scorer-image-url').value = '';
    document.getElementById('best-bowler-image-url').value = '';
  });
  addListener(elements.playerOfMatch, 'change', syncResultPlayerImages);
  addListener(elements.bestScorerName, 'change', syncResultPlayerImages);
  addListener(elements.bestBowlerName, 'change', syncResultPlayerImages);
  addListener(elements.resultPosterMatch, 'change', () => {
    state.activeResultPosterMatchId = '';
    elements.downloadResultPoster.disabled = true;
    elements.resultCaptionOutput.value = '';
    setEmptyState(elements.resultPosterHost, 'Click "Generate Result Poster" to build the completed-match graphic.');
  });
  addListener(elements.generateResultPoster, 'click', renderResultPoster);
  addListener(elements.downloadResultPoster, 'click', downloadResultPoster);
  addListener(elements.resultPosterSponsorImages, 'input', () => {
    state.activeResultPosterMatchId = '';
    elements.downloadResultPoster.disabled = true;
    elements.resultCaptionOutput.value = '';
    setEmptyState(elements.resultPosterHost, 'Click "Generate Result Poster" to rebuild the completed-match graphic with the sponsor pictures.');
  });
  addListener(elements.resultPosterSocialLinks, 'change', () => {
    state.activeResultPosterMatchId = '';
    elements.downloadResultPoster.disabled = true;
    elements.resultCaptionOutput.value = '';
    setEmptyState(elements.resultPosterHost, 'Click "Generate Result Poster" to rebuild the completed-match graphic with the selected social links.');
  });
  addListener(elements.posterMatch, 'change', () => {
    state.activePosterMatchIds = [];
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    updatePosterVenueImageOptions();
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to build the match graphic.');
  });
  addListener(elements.posterPlatform, 'change', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to build the match graphic.');
  });
  addListener(elements.posterType, 'change', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to build the selected match graphics.');
  });
  addListener(elements.posterVisualMode, 'change', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to build the match graphic.');
  });
  addListener(elements.posterVenueImage, 'change', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to rebuild the match graphic with the selected venue image.');
  });
  addListener(elements.posterSponsorImages, 'input', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to rebuild the match graphic with the sponsor pictures.');
  });
  addListener(elements.posterSocialLinks, 'change', () => {
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to rebuild the match graphic with the selected social links.');
  });
  addListener(elements.posterMatchPicker, 'change', () => {
    state.activePosterMatchIds = [];
    state.selectedPosterVariantKey = '';
    elements.downloadPoster.disabled = true;
    toggleHidden(elements.posterSelection, true);
    elements.posterCaptionOutput.value = '';
    setEmptyState(elements.posterHost, 'Click "Generate Poster" to build the selected match graphics.');
  });
  addListener(elements.generatePoster, 'click', renderPoster);
  addListener(elements.downloadPoster, 'click', downloadPoster);
  addListener(elements.posterHost, 'click', handlePosterSelection);
  [
    elements.profilesList,
    elements.teamsList,
    elements.venuesList,
    elements.playersList,
    elements.playersPagination,
    elements.matchesList,
    elements.matchesPagination,
    elements.lineupList,
    elements.resultsList,
    elements.resultsPagination,
    elements.socialLinksList,
    elements.teamsPagination,
    elements.venuesPagination,
  ].forEach((container) => addListener(container, 'click', handleListActions));
  addListener(elements.profilesList, 'change', handleListActions);

  if (!SUPABASE_READY || !supabase) {
    showMessage(getConfigMessage(), 'error');
    setSignedOutState();
    return;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    showMessage(error.message || 'Failed to read the current session.', 'error');
    setSignedOutState();
    return;
  }

  await bootstrapSession(data.session);

  supabase.auth.onAuthStateChange(async (_event, session) => {
    await bootstrapSession(session);
  });

};

initAuthUi();

init().catch((error) => {
  console.error(error);
  window.__gccAppReady = true;
  showMessage('Some dashboard features failed to load, but auth is still available. Please try signup or login again.', 'error');
});
