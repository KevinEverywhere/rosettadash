import {
  CLIENT_ROUTER_MODE_OPTIONS,
  type ClientRouterMode,
} from '@rosettadash/core';

export function RouterModeSelect({
  mode,
  onChange,
}: {
  mode: ClientRouterMode;
  onChange: (mode: ClientRouterMode) => void;
}) {
  return (
    <label className="da-router-mode">
      <span>Router</span>
      <select
        value={mode}
        onChange={(event) => onChange(event.target.value as ClientRouterMode)}
        aria-label="Client router mode"
      >
        {CLIENT_ROUTER_MODE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
