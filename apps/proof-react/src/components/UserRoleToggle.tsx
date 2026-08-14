import type { AtlasUserRole } from '../lib/roles';
import { ATLAS_USER_ROLES, roleLabel } from '../lib/roles';

interface Props {
  role: AtlasUserRole;
  onChange: (role: AtlasUserRole) => void;
}

export function UserRoleToggle({ role, onChange }: Props) {
  return (
    <div className="da-role-toggle" role="group" aria-label="Preview as user role">
      <span className="da-role-toggle__label">Role</span>
      <div className="da-role-toggle__options">
        {ATLAS_USER_ROLES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={role === entry.id}
            className={role === entry.id ? 'is-active' : undefined}
            onClick={() => onChange(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <span className="da-role-toggle__hint">Signed in as {roleLabel(role)}</span>
    </div>
  );
}
