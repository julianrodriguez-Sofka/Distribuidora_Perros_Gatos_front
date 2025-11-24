export function isAdminUser(user) {
  if (!user) return false;

  const candidates = [];

  if (user.rol) candidates.push(user.rol);
  if (user.role) candidates.push(user.role);
  if (user.roleName) candidates.push(user.roleName);

  // common plural form: roles
  if (user.roles) {
    if (Array.isArray(user.roles)) {
      user.roles.forEach(r => {
        if (!r) return;
        if (typeof r === 'string') candidates.push(r);
        else if (typeof r === 'object') candidates.push(r.name || r.nombre || JSON.stringify(r));
      });
    } else {
      candidates.push(String(user.roles));
    }
  }

  return candidates.some(c => {
    if (!c) return false;
    const s = String(c).toLowerCase();
    return s === 'admin' || s === 'role_admin' || s === 'role:admin' || s.includes('admin');
  });
}

export default isAdminUser;
