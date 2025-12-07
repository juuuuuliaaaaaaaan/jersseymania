const USERS_KEY = 'jm_users';
const CURRENT_KEY = 'jm_current_user';

// Generar un ID único para el dispositivo (basado en localStorage)
function generateDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 20) + '_' + Date.now();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Obtener deviceId actual
function getDeviceId() {
  return generateDeviceId();
}

// Verificar si ya hay usuario registrado en este dispositivo
function getRegisteredUserOnDevice() {
  const deviceId = getDeviceId();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); // usar USERS_KEY en lugar de 'users'
  return users.find(u => u.deviceId === deviceId) || null;
}

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateInviteCode() {
  return 'JM' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const userService = {
  createUser(username, phone = '', inviterCode = null) {
    const deviceId = getDeviceId();
    
    // Verificar si ya existe usuario en este dispositivo
    const existingUser = getRegisteredUserOnDevice();
    if (existingUser) {
      throw new Error(`Ya tienes un usuario registrado: ${existingUser.username}. Un dispositivo solo puede tener un usuario.`);
    }

    const users = readUsers();

    // Validar que el nombre sea único
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Este nombre de usuario ya está registrado');
    }

    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const inviteCode = generateInviteCode();
    const user = { id, username, phone, inviteCode, referrals: 0, referredUsers: [], deviceId };
    users.push(user);

    if (inviterCode) {
      const inviter = users.find(u => u.inviteCode === inviterCode);
      if (inviter && !inviter.referredUsers.includes(id)) {
        inviter.referredUsers.push(id);
        inviter.referrals = inviter.referredUsers.length;
      }
    }

    writeUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    return user;
  },

  loginUserByUsername(username) {
    const users = readUsers();
    const user = users.find(u => u.username === username) || null;
    if (user) localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    return user;
  },

  getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  logout() {
    localStorage.removeItem(CURRENT_KEY);
  },

  refreshCurrent() {
    const current = this.getCurrentUser();
    if (!current) return null;
    const users = readUsers();
    const updated = users.find(u => u.id === current.id);
    if (updated) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  getDiscountPercent(user) {
    if (!user) return 0;
    const referrals = user.referrals || 0;
    if (referrals >= 10) return 10;
    if (referrals >= 5) return 5;
    return 0;
  },

  // helpers (para debug/admin)
  getRegisteredUserOnDevice,
  getDeviceId,
  _getAll: () => readUsers()
};
