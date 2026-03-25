import { SUPABASE_READY, getConfigMessage, supabase } from './supabase.js';

const byId = (id) => document.getElementById(id);

const elements = {
  authScreen: byId('auth-screen'),
  messages: byId('messages'),
  appMessages: byId('app-messages'),
  teamForm: byId('team-form'),
  teamEditId: byId('team-edit-id'),
  teamSubmitButton: byId('team-submit-button'),
  teamName: byId('team-name'),
  teamShortName: byId('team-short-name'),
  teamLogoUrl: byId('team-logo-url'),
  teamLogoFile: byId('team-logo-file'),
  teamClubType: byId('team-club-type'),
  teamPrimaryColor: byId('team-primary-color'),
  teamSecondaryColor: byId('team-secondary-color'),
  teamNotes: byId('team-notes'),
  teamsList: byId('teams-list'),
  homeClubsList: byId('home-clubs-list'),
  playerForm: byId('player-form'),
  playerEditId: byId('player-edit-id'),
  playerSubmitButton: byId('player-submit-button'),
  playerTeam: byId('player-team'),
  playerName: byId('player-name'),
  playerJerseyNumber: byId('player-jersey-number'),
  playerBattingStyle: byId('player-batting-style'),
  playerBowlingStyle: byId('player-bowling-style'),
  playerCategory: byId('player-category'),
  playerProfileUrl: byId('player-profile-url'),
  playersList: byId('players-list'),
  homePlayersList: byId('home-players-list'),
  venueForm: byId('venue-form'),
  venueEditId: byId('venue-edit-id'),
  venueSubmitButton: byId('venue-submit-button'),
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

const CLUB_TYPE_PREFIX = 'club_type:';

let teamsCache = [];
let playersCache = [];
let venuesCache = [];

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
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    target.innerHTML = '';
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
          <h3>${htmlEscape(player.name)}</h3>
          <p class="record-meta">${htmlEscape(team?.name || 'Unknown club')} | #${htmlEscape(player.jersey_number || 0)} | ${htmlEscape(player.player_category || player.role || 'Player')}</p>
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
      <h3>${htmlEscape(venue.name)}</h3>
      <p class="record-meta">${htmlEscape(venue.city)}, ${htmlEscape(venue.country)}</p>
      <p class="record-meta">${htmlEscape(venue.address || 'No address added')}</p>
    </article>
  `).join('');
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

const handleTeamSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();

  const payload = {
    name: elements.teamName?.value.trim() || '',
    short_name: elements.teamShortName?.value.trim() || '',
    logo_url: elements.teamLogoUrl?.value.trim() || '',
    team_count: 1,
    squad_labels: withTeamTypeLabel([], elements.teamClubType?.value || 'home'),
    primary_color: elements.teamPrimaryColor?.value || '#d32027',
    secondary_color: elements.teamSecondaryColor?.value || '#3944a7',
    notes: elements.teamNotes?.value.trim() || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.short_name) {
    showMessage('Team name and short name are required.', 'error');
    return;
  }

  const { error } = await supabase.from('teams').insert([payload]);
  if (error) throw error;

  elements.teamForm?.reset();
  if (elements.teamPrimaryColor) elements.teamPrimaryColor.value = '#d32027';
  if (elements.teamSecondaryColor) elements.teamSecondaryColor.value = '#3944a7';
  if (elements.teamClubType) elements.teamClubType.value = 'home';
  await loadTeams();
  showMessage('Club saved successfully.');
};

const handlePlayerSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();
  const homeTeam = getHomeTeams()[0];

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
    profile_image_url: elements.playerProfileUrl?.value.trim() || '',
    created_by: session.user.id,
  };

  if (!payload.name || !payload.jersey_number || !payload.batsman_type || !payload.bowler_type || !payload.player_category) {
    showMessage('Please complete every player field.', 'error');
    return;
  }

  const { error } = await supabase.from('players').insert([payload]);
  if (error) throw error;

  elements.playerForm?.reset();
  await loadPlayers();
  showMessage('Player saved successfully.');
};

const handleVenueSubmit = async (event) => {
  event?.preventDefault?.();
  const session = await getSession();

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

  const { error } = await supabase.from('venues').insert([payload]);
  if (error) throw error;

  elements.venueForm?.reset();
  await loadVenues();
  showMessage('Ground saved successfully.');
};

const createSafeHandler = (handler) => (event) => {
  Promise.resolve(handler(event)).catch((error) => {
    console.error(error);
    showMessage(error.message || 'Something went wrong.', 'error');
  });
};

const bindHandlers = () => {
  window.__appHandleTeamSubmit = createSafeHandler(handleTeamSubmit);
  window.__appHandlePlayerSubmit = createSafeHandler(handlePlayerSubmit);
  window.__appHandleVenueSubmit = createSafeHandler(handleVenueSubmit);

  elements.teamSubmitButton?.addEventListener?.('click', window.__appHandleTeamSubmit);
  elements.playerSubmitButton?.addEventListener?.('click', window.__appHandlePlayerSubmit);
  elements.venueSubmitButton?.addEventListener?.('click', window.__appHandleVenueSubmit);
};

const init = async () => {
  bindHandlers();

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
