import { SUPABASE_READY, getConfigMessage, supabase } from './supabase.js';

const byId = (id) => document.getElementById(id);

const elements = {
  authScreen: byId('auth-screen'),
  messages: byId('messages'),
  appMessages: byId('app-messages'),
  databaseFeedback: byId('database-feedback'),
  teamForm: byId('team-form'),
  teamEditId: byId('team-edit-id'),
  teamSubmitButton: byId('team-submit-button'),
  teamCancelEdit: byId('team-cancel-edit'),
  teamName: byId('team-name'),
  teamShortName: byId('team-short-name'),
  teamLogoUrl: byId('team-logo-url'),
  teamLogoFile: byId('team-logo-file'),
  teamClubType: byId('team-club-type'),
  teamPrimaryColor: byId('team-primary-color'),
  teamSecondaryColor: byId('team-secondary-color'),
  teamNotes: byId('team-notes'),
  teamsList: byId('teams-list'),
  teamsTemplate: byId('teams-template'),
  teamsImportFile: byId('teams-import-file'),
  homeClubsList: byId('home-clubs-list'),
  playerForm: byId('player-form'),
  playerEditId: byId('player-edit-id'),
  playerSubmitButton: byId('player-submit-button'),
  playerCancelEdit: byId('player-cancel-edit'),
  playerTeam: byId('player-team'),
  playerName: byId('player-name'),
  playerJerseyNumber: byId('player-jersey-number'),
  playerBattingStyle: byId('player-batting-style'),
  playerBowlingStyle: byId('player-bowling-style'),
  playerCategory: byId('player-category'),
  playerProfileFile: byId('player-profile-file'),
  playerImageStyleMode: byId('player-image-style-mode'),
  playersList: byId('players-list'),
  playersExport: byId('players-export'),
  playersTemplate: byId('players-template'),
  playersImportFile: byId('players-import-file'),
  homePlayersList: byId('home-players-list'),
  venueForm: byId('venue-form'),
  venueEditId: byId('venue-edit-id'),
  venueSubmitButton: byId('venue-submit-button'),
  venueCancelEdit: byId('venue-cancel-edit'),
  venueName: byId('venue-name'),
  venueCity: byId('venue-city'),
  venueCountry: byId('venue-country'),
  venueAddress: byId('venue-address'),
  venueImageUrls: byId('venue-image-urls'),
  venueImageFiles: byId('venue-image-files'),
  venueNotes: byId('venue-notes'),
  venuesList: byId('venues-list'),
  matchForm: byId('match-form'),
  matchEditId: byId('match-edit-id'),
  matchSubmitButton: byId('match-submit-button'),
  matchCancelEdit: byId('match-cancel-edit'),
  matchTeam1: byId('match-team1'),
  matchTeam2: byId('match-team2'),
  matchDate: byId('match-date'),
  matchTime: byId('match-time'),
  matchVenue: byId('match-venue'),
  matchVenueDatalist: byId('match-venue-datalist'),
  matchesList: byId('matches-list'),
  lineupMatch: byId('lineup-match'),
  resultMatch: byId('result-match'),
  posterMatch: byId('poster-match'),
};

const PLAYER_TEMPLATE_HEADERS = ['name', 'jersey_number', 'batsman_type', 'bowler_type', 'player_category'];
const CLUB_TEMPLATE_HEADERS = ['name', 'short_name', 'club_side', 'team_count', 'primary_color', 'secondary_color'];
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
const STORAGE_BUCKETS = {
  team: 'club-assets',
  player: 'player-assets',
};

const CLUB_TYPE_PREFIX = 'club_type:';

let teamsCache = [];
let playersCache = [];
let venuesCache = [];
let matchesCache = [];

const buildSquadLabels = (teamCount) => Array.from({ length: Math.max(1, Number(teamCount) || 1) }, (_, index) => `T${index + 1}`);

const toggleHidden = (element, hidden) => {
  if (!element) return;
  element.classList.toggle('hidden', hidden);
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
  const target = !elements.authScreen?.classList.contains('hidden') ? elements.messages : (elements.appMessages || elements.messages);
  if (!target) return;
  target.innerHTML = `<div class="message ${type}">${htmlEscape(text)}</div>`;

  if (elements.databaseFeedback) {
    elements.databaseFeedback.innerHTML = `<div class="message ${type}">${htmlEscape(text)}</div>`;
    elements.databaseFeedback.classList.remove('hidden');
    elements.databaseFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    target.innerHTML = '';
    if (elements.databaseFeedback) {
      elements.databaseFeedback.innerHTML = '';
      elements.databaseFeedback.classList.add('hidden');
    }
  }, 8000);
};

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

const getHomeTeams = () => teamsCache.filter((team) => getTeamType(team) === 'home');
const getOpponentTeams = () => teamsCache.filter((team) => getTeamType(team) === 'opponent');

const getSession = async () => {
  if (!SUPABASE_READY || !supabase) {
    throw new Error(getConfigMessage());
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data?.session) throw new Error('Please sign in first.');
  return data.session;
};

const renderEmptyState = (element, text) => {
  if (!element) return;
  element.innerHTML = `<div class="empty-state">${htmlEscape(text)}</div>`;
};

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

const toTextList = (value) =>
  String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const mergeStoredImageSources = async (textValue, fileList, bucket, folder) => {
  const uploadedImages = await uploadImageFiles(fileList, bucket, folder);
  return [...toTextList(textValue), ...uploadedImages.filter(Boolean)];
};

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

const renderTeams = () => {
  if (!elements.teamsList) return;

  if (!teamsCache.length) {
    renderEmptyState(elements.teamsList, 'No clubs saved yet.');
  } else {
    elements.teamsList.innerHTML = `
      <div class="club-card-grid">
        ${teamsCache.map((team) => {
          const teamTypeLabel = getTeamType(team) === 'opponent' ? 'Opponent' : 'Home';
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
                <button type="button" class="secondary-action" data-fallback-action="edit-team" data-id="${team.id}">Edit</button>
                <button type="button" class="danger-action" data-fallback-action="delete-team" data-id="${team.id}">Delete</button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  if (elements.homeClubsList) {
    if (!teamsCache.length) {
      renderEmptyState(elements.homeClubsList, 'No clubs saved yet.');
    } else {
      elements.homeClubsList.innerHTML = teamsCache.slice(0, 5).map((team) => `
        <article class="record-card">
          <h3>${htmlEscape(team.name)}</h3>
          <p class="record-meta">${htmlEscape(team.short_name)} | ${htmlEscape(getTeamType(team) === 'opponent' ? 'Opponent Club' : 'Home Club')}</p>
        </article>
      `).join('');
    }
  }

  const currentPlayerTeam = String(elements.playerTeam?.value || '');
  const homeTeams = getHomeTeams();
  if (elements.playerTeam) {
    const keepCurrent = homeTeams.some((team) => String(team.id) === currentPlayerTeam);
    elements.playerTeam.value = keepCurrent ? currentPlayerTeam : String(homeTeams[0]?.id || '');
  }

  if (elements.matchTeam1) {
    const current = String(elements.matchTeam1.value || '');
    elements.matchTeam1.innerHTML = '<option value="">Select home club</option>' + homeTeams.map((team) => `<option value="${team.id}">${htmlEscape(team.name)}</option>`).join('');
    if (homeTeams.some((team) => String(team.id) === current)) elements.matchTeam1.value = current;
  }

  if (elements.matchTeam2) {
    const current = String(elements.matchTeam2.value || '');
    const opponentTeams = getOpponentTeams();
    elements.matchTeam2.innerHTML = '<option value="">Select opponent club</option>' + opponentTeams.map((team) => `<option value="${team.id}">${htmlEscape(team.name)}</option>`).join('');
    if (opponentTeams.some((team) => String(team.id) === current)) elements.matchTeam2.value = current;
  }

  renderMatches();
};

const renderPlayers = () => {
  if (!elements.playersList) return;

  if (!playersCache.length) {
    renderEmptyState(elements.playersList, 'No players saved yet.');
  } else {
    elements.playersList.innerHTML = `
      <div class="player-roster-grid">
        ${playersCache.map((player) => {
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
                <button type="button" class="icon-action player-card-delete" data-fallback-action="delete-player" data-id="${player.id}" aria-label="Delete ${htmlEscape(player.name)}">Delete</button>
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
                <button type="button" class="player-edit-button" data-fallback-action="edit-player" data-id="${player.id}" aria-label="Edit ${htmlEscape(player.name)}">Edit</button>
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

  if (elements.homePlayersList) {
    if (!playersCache.length) {
      renderEmptyState(elements.homePlayersList, 'No players saved yet.');
    } else {
      elements.homePlayersList.innerHTML = playersCache.slice(0, 5).map((player) => {
        return `
          <article class="record-card">
            <h3>${htmlEscape(player.name)}</h3>
            <p class="record-meta">#${htmlEscape(player.jersey_number || 0)} | ${htmlEscape(player.player_category || player.role || 'Player')}</p>
          </article>
        `;
      }).join('');
    }
  }
};

const renderVenues = () => {
  if (!elements.venuesList) return;

  if (!venuesCache.length) {
    renderEmptyState(elements.venuesList, 'No grounds saved yet.');
    return;
  }

  elements.venuesList.innerHTML = `
    <div class="venue-card-grid">
      ${venuesCache.map((venue) => {
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
              <button type="button" class="secondary-action" data-fallback-action="edit-venue" data-id="${venue.id}">Edit</button>
              <button type="button" class="danger-action" data-fallback-action="delete-venue" data-id="${venue.id}">Delete</button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;

  if (elements.matchVenueDatalist) {
    elements.matchVenueDatalist.innerHTML = venuesCache
      .map((venue) => `<option value="${htmlEscape(venue.name)}">${htmlEscape(`${venue.city}, ${venue.country}${venue.address ? ` | ${venue.address}` : ''}`)}</option>`)
      .join('');
  }

  renderMatches();
};

const getTeamName = (id) => teamsCache.find((team) => String(team.id) === String(id))?.name || 'Unknown club';

const getVenueByName = (value) => {
  const query = String(value || '').trim().toLowerCase();
  if (!query) return null;
  return venuesCache.find((venue) => String(venue.name || '').trim().toLowerCase() === query) || null;
};

const getMatchLabel = (match) => {
  const team1Name = getTeamName(match.team1_id);
  const team2Name = getTeamName(match.team2_id);
  const dateLabel = String(match.match_date || '').trim();
  const timeLabel = match.match_time ? ` | ${String(match.match_time).slice(0, 5)}` : '';
  return `${team1Name} vs ${team2Name}${dateLabel ? ` | ${dateLabel}${timeLabel}` : ''}`;
};

const syncMatchSelectors = (preferredMatchId = '') => {
  const resultMatchIds = new Set();
  const lineupCurrent = String(elements.lineupMatch?.value || '');
  const resultCurrent = String(elements.resultMatch?.value || '');
  const posterCurrent = String(elements.posterMatch?.value || '');
  const nextPreferred = String(preferredMatchId || '');

  if (window.__gccAppState?.results?.length) {
    window.__gccAppState.results.forEach((result) => resultMatchIds.add(String(result.match_id)));
  }

  if (elements.lineupMatch) {
    elements.lineupMatch.innerHTML = '<option value="">Select match</option>' + matchesCache.map((match) => `<option value="${match.id}">${htmlEscape(getMatchLabel(match))}</option>`).join('');
    elements.lineupMatch.value = matchesCache.some((match) => String(match.id) === nextPreferred)
      ? nextPreferred
      : (matchesCache.some((match) => String(match.id) === lineupCurrent) ? lineupCurrent : '');
  }

  const resultEligibleMatches = matchesCache.filter((match) => !resultMatchIds.has(String(match.id)));
  if (elements.resultMatch) {
    elements.resultMatch.innerHTML = '<option value="">Select no-result match</option>' + resultEligibleMatches.map((match) => `<option value="${match.id}">${htmlEscape(getMatchLabel(match))}</option>`).join('');
    elements.resultMatch.value = resultEligibleMatches.some((match) => String(match.id) === nextPreferred)
      ? nextPreferred
      : (resultEligibleMatches.some((match) => String(match.id) === resultCurrent) ? resultCurrent : '');
  }

  if (elements.posterMatch) {
    elements.posterMatch.innerHTML = '<option value="">Select upcoming / no-result match</option>' + resultEligibleMatches.map((match) => `<option value="${match.id}">${htmlEscape(getMatchLabel(match))}</option>`).join('');
    elements.posterMatch.value = resultEligibleMatches.some((match) => String(match.id) === nextPreferred)
      ? nextPreferred
      : (resultEligibleMatches.some((match) => String(match.id) === posterCurrent) ? posterCurrent : '');
  }
};

const renderMatches = () => {
  if (!elements.matchesList) return;

  if (!matchesCache.length) {
    renderEmptyState(elements.matchesList, 'No matches saved yet.');
    return;
  }

  elements.matchesList.innerHTML = `
    <div class="match-card-grid">
      ${matchesCache.map((match) => {
        const venue = venuesCache.find((entry) => String(entry.id) === String(match.venue_id));
        const homeTeam = teamsCache.find((entry) => String(entry.id) === String(match.team1_id));
        const awayTeam = teamsCache.find((entry) => String(entry.id) === String(match.team2_id));
        const formatTeamLogo = (team) => team?.logo_url
          ? `<img src="${htmlEscape(team.logo_url)}" alt="${htmlEscape(team.name)} logo" class="match-team-logo" />`
          : `<div class="match-team-logo match-team-logo-fallback"><img src="./logo.svg" alt="Club crest" class="match-team-logo-crest" /></div>`;

        return `
          <article class="match-card">
            <div class="match-card-header">
              <div class="match-team-block">
                ${formatTeamLogo(homeTeam)}
                <span>${htmlEscape(homeTeam?.name || 'Unknown home')}</span>
              </div>
              <div class="match-versus-block">
                <div class="match-status-row">
                  <span class="match-status-pill">Saved Match</span>
                </div>
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
                  <strong>${htmlEscape(match.match_date || '')}${match.match_time ? ` | ${htmlEscape(match.match_time.slice(0, 5))}` : ''}</strong>
                </div>
                <div class="match-meta-item">
                  <small>Venue</small>
                  <strong>${htmlEscape(venue?.name || 'Unknown ground')}</strong>
                </div>
              </div>
              <div class="match-card-actions">
                <button type="button" class="primary-action" data-action="open-lineup-selector" data-id="${match.id}">Select Playing XI</button>
                <button type="button" class="secondary-action" data-action="open-match-poster" data-id="${match.id}">Match Poster</button>
                <button type="button" class="secondary-action" data-action="open-lineup-poster" data-id="${match.id}">Lineup Poster</button>
                <button type="button" class="secondary-action" data-fallback-action="edit-match" data-id="${match.id}">Edit</button>
                <button type="button" class="danger-action" data-fallback-action="delete-match" data-id="${match.id}">Delete</button>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
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

const downloadExcelFile = (filename, sheetName, rows) => {
  if (!window.XLSX) {
    throw new Error('Excel support did not load. Please refresh and try again.');
  }

  const workbook = window.XLSX.utils.book_new();
  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  window.XLSX.writeFile(workbook, filename);
};

const readSpreadsheetRows = async (file) => {
  const fileName = String(file?.name || '').toLowerCase();

  if (fileName.endsWith('.csv')) {
    const text = await file.text();
    const [headerLine, ...lines] = text.split(/\r?\n/).filter((line) => line.trim());
    if (!headerLine) return [];
    const headers = headerLine.split(',').map((value) => value.trim());
    return lines.map((line) => {
      const values = line.split(',').map((value) => value.trim());
      return headers.reduce((record, header, index) => {
        record[header] = values[index] || '';
        return record;
      }, {});
    });
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

const downloadPlayersTemplate = async () => {
  await createPlayerTemplateWorkbook();
  showMessage('Player Excel template downloaded with dropdowns.');
};

const exportPlayersCsv = () => {
  const rows = playersCache.map((player) => {
    const team = teamsCache.find((entry) => String(entry.id) === String(player.team_id));
    return {
      name: player.name || '',
      club_name: team?.name || '',
      jersey_number: player.jersey_number || '',
      player_category: player.player_category || player.role || '',
      batsman_type: player.batsman_type || player.batting_style || '',
      bowler_type: player.bowler_type || player.bowling_style || '',
      profile_image_url: player.profile_image_url || '',
    };
  });

  downloadCsv(
    'players-export.csv',
    ['name', 'club_name', 'jersey_number', 'player_category', 'batsman_type', 'bowler_type', 'profile_image_url'],
    rows,
  );
  showMessage(rows.length ? 'Players CSV exported.' : 'Player export downloaded with headers only.');
};

const loadTeams = async () => {
  const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
  if (error) throw error;
  teamsCache = data || [];
  renderTeams();
};

const loadPlayers = async () => {
  const { data, error } = await supabase.from('players').select('*').order('name', { ascending: true });
  if (error) throw error;
  playersCache = data || [];
  renderPlayers();
};

const loadVenues = async () => {
  const { data, error } = await supabase.from('venues').select('*').order('name', { ascending: true });
  if (error) throw error;
  venuesCache = data || [];
  renderVenues();
};

const loadMatches = async () => {
  const { data, error } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).order('match_time', { ascending: true });
  if (error) throw error;
  matchesCache = data || [];
  syncMatchSelectors();
  renderMatches();
};

const refreshBaseData = async () => {
  await Promise.all([loadTeams(), loadPlayers(), loadVenues(), loadMatches()]);
};

const resetTeamForm = () => {
  elements.teamForm?.reset();
  if (elements.teamEditId) elements.teamEditId.value = '';
  if (elements.teamSubmitButton) elements.teamSubmitButton.textContent = 'Save Club';
  if (elements.teamPrimaryColor) elements.teamPrimaryColor.value = '#d32027';
  if (elements.teamSecondaryColor) elements.teamSecondaryColor.value = '#3944a7';
  if (elements.teamClubType) elements.teamClubType.value = 'home';
  toggleHidden(elements.teamCancelEdit, true);
};

const resetPlayerForm = () => {
  elements.playerForm?.reset();
  if (elements.playerEditId) elements.playerEditId.value = '';
  if (elements.playerSubmitButton) elements.playerSubmitButton.textContent = 'Register Player';
  if (elements.playerImageStyleMode) elements.playerImageStyleMode.value = 'original';
  toggleHidden(elements.playerCancelEdit, true);
};

const resetVenueForm = () => {
  elements.venueForm?.reset();
  if (elements.venueEditId) elements.venueEditId.value = '';
  if (elements.venueSubmitButton) elements.venueSubmitButton.textContent = 'Save Ground';
  toggleHidden(elements.venueCancelEdit, true);
};

const resetMatchForm = () => {
  elements.matchForm?.reset();
  if (elements.matchEditId) elements.matchEditId.value = '';
  if (elements.matchSubmitButton) elements.matchSubmitButton.textContent = 'Create Match';
  toggleHidden(elements.matchCancelEdit, true);
};

const startTeamEdit = (team) => {
  if (!team) return;
  elements.teamEditId.value = String(team.id);
  elements.teamName.value = team.name || '';
  elements.teamShortName.value = team.short_name || '';
  elements.teamLogoUrl.value = team.logo_url || '';
  elements.teamClubType.value = getTeamType(team);
  elements.teamPrimaryColor.value = team.primary_color || '#d32027';
  elements.teamSecondaryColor.value = team.secondary_color || '#3944a7';
  elements.teamNotes.value = team.notes || '';
  elements.teamSubmitButton.textContent = 'Update Club';
  toggleHidden(elements.teamCancelEdit, false);
};

const startPlayerEdit = (player) => {
  if (!player) return;
  elements.playerEditId.value = String(player.id);
  elements.playerName.value = player.name || '';
  elements.playerJerseyNumber.value = player.jersey_number || '';
  elements.playerBattingStyle.value = player.batsman_type || player.batting_style || '';
  elements.playerBowlingStyle.value = player.bowler_type || player.bowling_style || '';
  elements.playerCategory.value = player.player_category || player.role || '';
  if (elements.playerImageStyleMode) elements.playerImageStyleMode.value = getPlayerImageMode(player.id);
  elements.playerSubmitButton.textContent = 'Update Player';
  toggleHidden(elements.playerCancelEdit, false);
};

const startVenueEdit = (venue) => {
  if (!venue) return;
  elements.venueEditId.value = String(venue.id);
  elements.venueName.value = venue.name || '';
  elements.venueCity.value = venue.city || '';
  elements.venueCountry.value = venue.country || '';
  elements.venueAddress.value = venue.address || '';
  elements.venueImageUrls.value = Array.isArray(venue.image_urls) ? venue.image_urls.join('\n') : '';
  elements.venueNotes.value = venue.notes || '';
  elements.venueSubmitButton.textContent = 'Update Ground';
  toggleHidden(elements.venueCancelEdit, false);
};

const startMatchEdit = (match) => {
  if (!match) return;
  const venue = venuesCache.find((entry) => String(entry.id) === String(match.venue_id));
  elements.matchEditId.value = String(match.id);
  elements.matchTeam1.value = String(match.team1_id || '');
  elements.matchTeam2.value = String(match.team2_id || '');
  elements.matchDate.value = match.match_date || '';
  elements.matchTime.value = match.match_time || '';
  elements.matchVenue.value = venue?.name || '';
  elements.matchSubmitButton.textContent = 'Update Match';
  toggleHidden(elements.matchCancelEdit, false);
};

const handleTeamSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.teamEditId?.value || '');
  const existingTeam = teamsCache.find((team) => String(team.id) === editingId);
  const uploadedLogo = await uploadImageFile(elements.teamLogoFile?.files?.[0], STORAGE_BUCKETS.team, 'logos');

  const payload = {
    name: elements.teamName?.value.trim() || '',
    short_name: elements.teamShortName?.value.trim() || '',
    logo_url: uploadedLogo || elements.teamLogoUrl?.value.trim() || existingTeam?.logo_url || '',
    team_count: 1,
    squad_labels: withTeamTypeLabel(existingTeam?.squad_labels || [], elements.teamClubType?.value || 'home'),
    primary_color: elements.teamPrimaryColor?.value || '#d32027',
    secondary_color: elements.teamSecondaryColor?.value || '#3944a7',
    notes: elements.teamNotes?.value.trim() || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.short_name) {
    showMessage('Team name and short name are required.', 'error');
    return;
  }

  const query = editingId
    ? supabase.from('teams').update(payload).eq('id', editingId)
    : supabase.from('teams').insert([payload]);
  const { error } = await query;
  if (error) throw error;

  resetTeamForm();
  await loadTeams();
  showMessage(editingId ? 'Club updated successfully.' : 'Club saved successfully.');
};

const handleTeamsImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const session = await getSession();
  const rows = await readSpreadsheetRows(file);
  if (!rows.length) {
    showMessage('The club file is empty or invalid.', 'error');
    return;
  }

  const payload = rows
    .filter((row) => row.name && row.short_name)
    .map((row) => ({
      name: String(row.name || '').trim(),
      short_name: String(row.short_name || '').trim(),
      team_count: Number(row.team_count) || 1,
      squad_labels: withTeamTypeLabel(buildSquadLabels(Number(row.team_count) || 1), row.club_side || 'home'),
      primary_color: row.primary_color || '#d32027',
      secondary_color: row.secondary_color || '#3944a7',
      logo_url: '',
      notes: row.notes || '',
      created_by: session.user.id,
    }));

  if (!payload.length) {
    showMessage('No valid club rows were found in the file.', 'error');
    return;
  }

  const { error } = await supabase.from('teams').upsert(payload, { onConflict: 'name' });
  if (error) throw error;

  event.target.value = '';
  await loadTeams();
  showMessage('Clubs imported successfully. Add logos later from Edit Club.');
};

const handlePlayerSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.playerEditId?.value || '');
  const homeTeam = getHomeTeams()[0];
  const existingPlayer = playersCache.find((player) => String(player.id) === editingId);
  const uploadedProfile = await uploadImageFile(elements.playerProfileFile?.files?.[0], STORAGE_BUCKETS.player, 'profiles');

  if (!homeTeam) {
    showMessage('Save at least one Home Club first so players can be linked automatically.', 'error');
    return;
  }

  const payload = {
    name: elements.playerName?.value.trim() || '',
    team_id: homeTeam.id,
    jersey_number: Number(elements.playerJerseyNumber?.value) || 0,
    role: elements.playerCategory?.value || '',
    batsman_type: elements.playerBattingStyle?.value.trim() || '',
    bowler_type: elements.playerBowlingStyle?.value.trim() || '',
    batting_style: elements.playerBattingStyle?.value.trim() || '',
    bowling_style: elements.playerBowlingStyle?.value.trim() || '',
    player_category: elements.playerCategory?.value || '',
    profile_image_url: uploadedProfile || existingPlayer?.profile_image_url || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.jersey_number || !payload.batsman_type || !payload.bowler_type || !payload.player_category) {
    showMessage('Please complete every player field.', 'error');
    return;
  }

  const query = editingId
    ? supabase.from('players').update(payload).eq('id', editingId).select('*').single()
    : supabase.from('players').insert([payload]).select('*').single();
  const { data, error } = await query;
  if (error) throw error;
  setPlayerImageMode(data?.id || editingId, elements.playerImageStyleMode?.value || 'original');

  resetPlayerForm();
  await loadPlayers();
  showMessage(editingId ? 'Player updated successfully.' : 'Player saved successfully.');
};

const handleVenueSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.venueEditId?.value || '');
  const existingVenue = venuesCache.find((venue) => String(venue.id) === editingId);
  const mergedImages = await mergeStoredImageSources(
    elements.venueImageUrls?.value || '',
    elements.venueImageFiles?.files,
    'venue-assets',
    'grounds',
  );

  const payload = {
    name: elements.venueName?.value.trim() || '',
    city: elements.venueCity?.value.trim() || '',
    country: elements.venueCountry?.value.trim() || '',
    address: elements.venueAddress?.value.trim() || '',
    image_urls: editingId ? [...new Set([...(existingVenue?.image_urls || []), ...mergedImages])] : mergedImages,
    notes: elements.venueNotes?.value.trim() || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.city || !payload.country) {
    showMessage('Venue name, city, and country are required.', 'error');
    return;
  }

  const query = editingId
    ? supabase.from('venues').update(payload).eq('id', editingId)
    : supabase.from('venues').insert([payload]);
  const { error } = await query;
  if (error) throw error;

  resetVenueForm();
  await loadVenues();
  showMessage(editingId ? 'Ground updated successfully.' : 'Ground saved successfully.');
};

const handleMatchSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.matchEditId?.value || '');
  const homeTeamId = String(elements.matchTeam1?.value || '');
  const opponentTeamId = String(elements.matchTeam2?.value || '');
  const venue = getVenueByName(elements.matchVenue?.value || '');
  const payload = {
    team1_id: homeTeamId,
    team2_id: opponentTeamId,
    venue_id: venue?.id || '',
    match_date: String(elements.matchDate?.value || '').trim(),
    match_time: String(elements.matchTime?.value || '').trim(),
    created_by: session.user.id,
  };

  if (!payload.team1_id || !payload.team2_id || !payload.venue_id || !payload.match_date || !payload.match_time) {
    showMessage('Choose a saved Home Club, Opponent Club, Ground, date, and time before saving the match.', 'error');
    return;
  }

  if (payload.team1_id === payload.team2_id) {
    showMessage('Home Club and Opponent Club must be different.', 'error');
    return;
  }

  const homeTeam = teamsCache.find((team) => String(team.id) === payload.team1_id);
  const opponentTeam = teamsCache.find((team) => String(team.id) === payload.team2_id);
  if (!homeTeam || getTeamType(homeTeam) !== 'home' || !opponentTeam || getTeamType(opponentTeam) !== 'opponent') {
    showMessage('Match Centre only allows saved Home Clubs versus saved Opponent Clubs.', 'error');
    return;
  }

  const query = editingId
    ? supabase.from('matches').update(payload).eq('id', editingId).select('*').single()
    : supabase.from('matches').insert([payload]).select('*').single();
  const { data, error } = await query;
  if (error) throw error;

  resetMatchForm();
  await loadMatches();
  syncMatchSelectors(String(data?.id || editingId || ''));
  window.dispatchEvent(new CustomEvent('gcc:refresh-data', { detail: { matchId: String(data?.id || editingId || '') } }));
  showMessage(editingId ? 'Match updated successfully. Results and posters will use the saved venue pictures from this ground.' : 'Match saved successfully. Results and posters will use the saved venue pictures from this ground.');
};

const handlePlayersImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const rows = await readSpreadsheetRows(file);
  if (!rows.length) {
    showMessage('The player file is empty or invalid.', 'error');
    return;
  }

  const session = await getSession();
  const homeTeam = getHomeTeams()[0];

  if (!homeTeam) {
    showMessage('Save at least one Home Club first so imported players can be linked automatically.', 'error');
    return;
  }

  const payload = rows
    .map((row) => ({
      name: String(row.name || '').trim(),
      team_id: homeTeam.id,
      jersey_number: Number(row.jersey_number) || 0,
      role: row.player_category || 'Player',
      batsman_type: String(row.batsman_type || '').trim(),
      bowler_type: String(row.bowler_type || '').trim(),
      batting_style: String(row.batsman_type || '').trim(),
      bowling_style: String(row.bowler_type || '').trim(),
      player_category: row.player_category || 'Player',
      profile_image_url: '',
      created_by: session.user.id,
    }))
    .filter((player) => player.name && player.jersey_number);

  if (!payload.length) {
    showMessage('No valid player rows were found in the file.', 'error');
    return;
  }

  const existingByKey = new Map(playersCache.map((player) => [
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
  showMessage('Players imported and updated successfully.');
};

const createSafeHandler = (handler) => (event) => {
  Promise.resolve(handler(event)).catch((error) => {
    console.error(error);
    showMessage(error.message || 'Something went wrong.', 'error');
  });
};

const handleListAction = async (event) => {
  const appActionButton = event.target.closest('[data-action]');
  if (appActionButton) {
    const { action, id } = appActionButton.dataset;
    if (!id) return;

    if (action === 'open-lineup-selector' && typeof window.__gccOpenLineupSelector === 'function') {
      window.__gccOpenLineupSelector(id);
      return;
    }

    if (action === 'open-match-poster' && typeof window.__gccOpenPosterStudio === 'function') {
      window.__gccOpenPosterStudio(id, 'match');
      return;
    }

    if (action === 'open-lineup-poster' && typeof window.__gccOpenPosterStudio === 'function') {
      window.__gccOpenPosterStudio(id, 'lineup');
      return;
    }
  }

  const button = event.target.closest('[data-fallback-action]');
  if (!button) return;

  const { fallbackAction, id } = button.dataset;
  if (!id) return;

  if (fallbackAction === 'edit-team') {
    startTeamEdit(teamsCache.find((team) => String(team.id) === String(id)));
    return;
  }

  if (fallbackAction === 'edit-player') {
    startPlayerEdit(playersCache.find((player) => String(player.id) === String(id)));
    return;
  }

  if (fallbackAction === 'edit-venue') {
    startVenueEdit(venuesCache.find((venue) => String(venue.id) === String(id)));
    return;
  }

  if (fallbackAction === 'edit-match') {
    startMatchEdit(matchesCache.find((match) => String(match.id) === String(id)));
    return;
  }

  const table = fallbackAction === 'delete-team'
    ? 'teams'
    : fallbackAction === 'delete-player'
      ? 'players'
      : fallbackAction === 'delete-venue'
        ? 'venues'
        : fallbackAction === 'delete-match'
          ? 'matches'
        : '';

  if (!table) return;

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;

  if (table === 'teams') {
    resetTeamForm();
    await loadTeams();
    showMessage('Club deleted successfully.');
  }

  if (table === 'players') {
    resetPlayerForm();
    await loadPlayers();
    showMessage('Player deleted successfully.');
  }

  if (table === 'venues') {
    resetVenueForm();
    await loadVenues();
    showMessage('Ground deleted successfully.');
  }

  if (table === 'matches') {
    resetMatchForm();
    await loadMatches();
    window.dispatchEvent(new Event('gcc:refresh-data'));
    showMessage('Match deleted successfully.');
  }
};

const bindHandlers = () => {
  window.__appHandleTeamSubmit = createSafeHandler(handleTeamSubmit);
  window.__appHandlePlayerSubmit = createSafeHandler(handlePlayerSubmit);
  window.__appHandleVenueSubmit = createSafeHandler(handleVenueSubmit);
  window.__appHandleMatchSubmit = createSafeHandler(handleMatchSubmit);

  elements.teamSubmitButton?.addEventListener?.('click', window.__appHandleTeamSubmit);
  elements.playerSubmitButton?.addEventListener?.('click', window.__appHandlePlayerSubmit);
  elements.venueSubmitButton?.addEventListener?.('click', window.__appHandleVenueSubmit);
  elements.matchSubmitButton?.addEventListener?.('click', window.__appHandleMatchSubmit);
  elements.teamForm?.addEventListener?.('submit', window.__appHandleTeamSubmit);
  elements.playerForm?.addEventListener?.('submit', window.__appHandlePlayerSubmit);
  elements.venueForm?.addEventListener?.('submit', window.__appHandleVenueSubmit);
  elements.matchForm?.addEventListener?.('submit', window.__appHandleMatchSubmit);
  elements.teamCancelEdit?.addEventListener?.('click', resetTeamForm);
  elements.playerCancelEdit?.addEventListener?.('click', resetPlayerForm);
  elements.venueCancelEdit?.addEventListener?.('click', resetVenueForm);
  elements.matchCancelEdit?.addEventListener?.('click', resetMatchForm);
  elements.playersExport?.addEventListener?.('click', exportPlayersCsv);
  elements.playersTemplate?.addEventListener?.('click', downloadPlayersTemplate);
  elements.teamsTemplate?.addEventListener?.('click', () => createSafeHandler(createClubTemplateWorkbook)());
  elements.teamsImportFile?.addEventListener?.('change', (event) => createSafeHandler(handleTeamsImport)(event));
  elements.playersImportFile?.addEventListener?.('change', (event) => createSafeHandler(handlePlayersImport)(event));
  elements.teamsList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
  elements.playersList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
  elements.venuesList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
  elements.matchesList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
};

const init = async () => {
  bindHandlers();

  window.addEventListener('gcc:refresh-data', () => {
    refreshBaseData().catch((error) => {
      console.error(error);
      showMessage(error.message || 'Could not refresh the local data lists.', 'error');
    });
  });

  if (!SUPABASE_READY || !supabase) return;

  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    await refreshBaseData();
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      await refreshBaseData();
    }
  });
};

init().catch((error) => {
  console.error(error);
  showMessage(error.message || 'Lightweight data forms could not start.', 'error');
});
