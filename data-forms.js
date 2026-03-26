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
  venueNotes: byId('venue-notes'),
  venuesList: byId('venues-list'),
  matchTeam1: byId('match-team1'),
  matchTeam2: byId('match-team2'),
};

const PLAYER_TEMPLATE_HEADERS = ['name', 'jersey_number', 'batsman_type', 'bowler_type', 'player_category'];
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

const CLUB_TYPE_PREFIX = 'club_type:';

let teamsCache = [];
let playersCache = [];
let venuesCache = [];

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

const renderTeams = () => {
  if (!elements.teamsList) return;

  if (!teamsCache.length) {
    renderEmptyState(elements.teamsList, 'No clubs saved yet.');
  } else {
    elements.teamsList.innerHTML = teamsCache.map((team) => `
      <article class="record-card">
        <div class="record-row">
          <div>
            <h3>${htmlEscape(team.name)}</h3>
            <p class="record-meta">${htmlEscape(team.short_name)} | ${htmlEscape(getTeamType(team) === 'opponent' ? 'Opponent Club' : 'Home Club')}</p>
            <p class="record-meta">Colors: ${htmlEscape(team.primary_color || '#d32027')} / ${htmlEscape(team.secondary_color || '#3944a7')}</p>
          </div>
          ${team.logo_url ? `<img src="${htmlEscape(team.logo_url)}" alt="${htmlEscape(team.name)} logo" class="list-logo" />` : ''}
          <div class="record-actions">
            <button type="button" class="secondary-action" data-fallback-action="edit-team" data-id="${team.id}">Edit</button>
            <button type="button" class="danger-action" data-fallback-action="delete-team" data-id="${team.id}">Delete</button>
          </div>
        </div>
      </article>
    `).join('');
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
};

const renderPlayers = () => {
  if (!elements.playersList) return;

  if (!playersCache.length) {
    renderEmptyState(elements.playersList, 'No players saved yet.');
  } else {
    elements.playersList.innerHTML = playersCache.map((player) => {
      const team = teamsCache.find((entry) => String(entry.id) === String(player.team_id));
      return `
        <article class="record-card">
          <div class="record-row">
            <div>
              <h3>${htmlEscape(player.name)}</h3>
              <p class="record-meta">${htmlEscape(team?.name || 'Unknown club')} | #${htmlEscape(player.jersey_number || 0)} | ${htmlEscape(player.player_category || player.role || 'Player')}</p>
            </div>
            <div class="record-actions">
              <button type="button" class="secondary-action" data-fallback-action="edit-player" data-id="${player.id}">Edit</button>
              <button type="button" class="danger-action" data-fallback-action="delete-player" data-id="${player.id}">Delete</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  if (elements.homePlayersList) {
    if (!playersCache.length) {
      renderEmptyState(elements.homePlayersList, 'No players saved yet.');
    } else {
      elements.homePlayersList.innerHTML = playersCache.slice(0, 5).map((player) => {
        const team = teamsCache.find((entry) => String(entry.id) === String(player.team_id));
        return `
          <article class="record-card">
            <h3>${htmlEscape(player.name)}</h3>
            <p class="record-meta">${htmlEscape(team?.name || 'Unknown club')} | #${htmlEscape(player.jersey_number || 0)}</p>
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

  elements.venuesList.innerHTML = venuesCache.map((venue) => `
    <article class="record-card">
      <div class="record-row">
        <div>
          <h3>${htmlEscape(venue.name)}</h3>
          <p class="record-meta">${htmlEscape(venue.city)}, ${htmlEscape(venue.country)}</p>
          <p class="record-meta">${htmlEscape(venue.address || 'No address added')}</p>
        </div>
        <div class="record-actions">
          <button type="button" class="secondary-action" data-fallback-action="edit-venue" data-id="${venue.id}">Edit</button>
          <button type="button" class="danger-action" data-fallback-action="delete-venue" data-id="${venue.id}">Delete</button>
        </div>
      </div>
    </article>
  `).join('');
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

const refreshBaseData = async () => {
  await Promise.all([loadTeams(), loadPlayers(), loadVenues()]);
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
  toggleHidden(elements.playerCancelEdit, true);
};

const resetVenueForm = () => {
  elements.venueForm?.reset();
  if (elements.venueEditId) elements.venueEditId.value = '';
  if (elements.venueSubmitButton) elements.venueSubmitButton.textContent = 'Save Ground';
  toggleHidden(elements.venueCancelEdit, true);
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

const handleTeamSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.teamEditId?.value || '');
  const existingTeam = teamsCache.find((team) => String(team.id) === editingId);

  const payload = {
    name: elements.teamName?.value.trim() || '',
    short_name: elements.teamShortName?.value.trim() || '',
    logo_url: elements.teamLogoUrl?.value.trim() || '',
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

const handlePlayerSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.playerEditId?.value || '');
  const homeTeam = getHomeTeams()[0];
  const existingPlayer = playersCache.find((player) => String(player.id) === editingId);

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
    profile_image_url: existingPlayer?.profile_image_url || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.jersey_number || !payload.batsman_type || !payload.bowler_type || !payload.player_category) {
    showMessage('Please complete every player field.', 'error');
    return;
  }

  const query = editingId
    ? supabase.from('players').update(payload).eq('id', editingId)
    : supabase.from('players').insert([payload]);
  const { error } = await query;
  if (error) throw error;

  resetPlayerForm();
  await loadPlayers();
  showMessage(editingId ? 'Player updated successfully.' : 'Player saved successfully.');
};

const handleVenueSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const editingId = String(elements.venueEditId?.value || '');

  const payload = {
    name: elements.venueName?.value.trim() || '',
    city: elements.venueCity?.value.trim() || '',
    country: elements.venueCountry?.value.trim() || '',
    address: elements.venueAddress?.value.trim() || '',
    image_urls: String(elements.venueImageUrls?.value || '').split('\n').map((item) => item.trim()).filter(Boolean),
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

  const table = fallbackAction === 'delete-team'
    ? 'teams'
    : fallbackAction === 'delete-player'
      ? 'players'
      : fallbackAction === 'delete-venue'
        ? 'venues'
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
};

const bindHandlers = () => {
  window.__appHandleTeamSubmit = createSafeHandler(handleTeamSubmit);
  window.__appHandlePlayerSubmit = createSafeHandler(handlePlayerSubmit);
  window.__appHandleVenueSubmit = createSafeHandler(handleVenueSubmit);

  elements.teamSubmitButton?.addEventListener?.('click', window.__appHandleTeamSubmit);
  elements.playerSubmitButton?.addEventListener?.('click', window.__appHandlePlayerSubmit);
  elements.venueSubmitButton?.addEventListener?.('click', window.__appHandleVenueSubmit);
  elements.teamCancelEdit?.addEventListener?.('click', resetTeamForm);
  elements.playerCancelEdit?.addEventListener?.('click', resetPlayerForm);
  elements.venueCancelEdit?.addEventListener?.('click', resetVenueForm);
  elements.playersExport?.addEventListener?.('click', exportPlayersCsv);
  elements.playersTemplate?.addEventListener?.('click', downloadPlayersTemplate);
  elements.playersImportFile?.addEventListener?.('change', (event) => createSafeHandler(handlePlayersImport)(event));
  elements.teamsList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
  elements.playersList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
  elements.venuesList?.addEventListener?.('click', (event) => createSafeHandler(handleListAction)(event));
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
