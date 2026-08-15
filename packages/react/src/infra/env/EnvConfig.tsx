import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface EnvKeyStatus {
  envKey: string;
  configured: boolean;
}

export interface EnvConfigProps {
  envKeys?: string;
  keyStatus?: EnvKeyStatus[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function parseEnvKeys(raw: string | undefined): string[] {
  if (!raw) {
    return ['DATABASE_URL', 'API_KEY'];
  }
  return raw.split(',').map((entry) => entry.trim()).filter(Boolean);
}

/** @rosettadash/react/infra/env — infra.env */
export const EnvConfig = forwardRef<HTMLElement, EnvConfigProps>(function EnvConfig(
  props,
  ref,
) {
  const { className, style, children, keyStatus } = props;
  const rootClass = ['rd-env', className].filter(Boolean).join(' ');
  const keys = parseEnvKeys(props.envKeys);
  const statusByKey = new Map(keyStatus?.map((entry) => [entry.envKey, entry.configured]));

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-env">
      <span className="rd-infra__badge">INFRA</span>
      <span className="rd-field__label">Environment config</span>
      {keyStatus?.length ? (
        <ul className="rd-env__keys">
          {keys.map((envKey) => {
            const configured = statusByKey.get(envKey);
            return (
              <li key={envKey} className="rd-env__key-row">
                <code>{envKey}</code>
                <span
                  className={
                    configured === undefined
                      ? 'rd-env__key-state rd-env__key-state--unknown'
                      : configured
                        ? 'rd-env__key-state rd-env__key-state--configured'
                        : 'rd-env__key-state rd-env__key-state--missing'
                  }
                >
                  {configured === undefined ? 'unknown' : configured ? 'configured' : 'missing'}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <code>{props.envKeys ?? 'DATABASE_URL, API_KEY'}</code>
      )}
      {children}
    </section>
  );
});
