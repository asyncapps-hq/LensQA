export type LogFields = Record<string, unknown>

export function log(level: 'info' | 'warn' | 'error', message: string, fields: LogFields = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    requestId: fields.requestId,
    ...fields,
  })
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

// ponytail: OTEL exporter hooks in when OTEL_EXPORTER_OTLP_ENDPOINT is set
export function traceEnabled() {
  return Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT)
}
