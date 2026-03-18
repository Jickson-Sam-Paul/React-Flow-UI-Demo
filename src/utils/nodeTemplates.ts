import { NodeTemplate } from '../types'

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    kind: 'trigger',
    label: 'HTTP Trigger',
    description: 'Starts on incoming request',
    icon: '⚡',
    defaultConfig: { label: 'HTTP Trigger', description: 'Starts on incoming request', method: 'POST', path: '/webhook' },
  },
  {
    kind: 'trigger',
    label: 'Schedule',
    description: 'Runs on a cron schedule',
    icon: '🕐',
    defaultConfig: { label: 'Schedule', description: 'Runs on a cron schedule', cron: '0 9 * * *' },
  },
  {
    kind: 'trigger',
    label: 'Event Listener',
    description: 'Reacts to system events',
    icon: '📡',
    defaultConfig: { label: 'Event Listener', description: 'Reacts to system events', event: 'user.created' },
  },
  {
    kind: 'action',
    label: 'HTTP Request',
    description: 'Calls an external API',
    icon: '🌐',
    defaultConfig: { label: 'HTTP Request', description: 'Calls an external API', url: 'https://api.example.com', method: 'GET' },
  },
  {
    kind: 'action',
    label: 'Send Email',
    description: 'Sends an email notification',
    icon: '📧',
    defaultConfig: { label: 'Send Email', description: 'Sends an email notification', to: 'user@example.com', subject: 'Notification' },
  },
  {
    kind: 'action',
    label: 'Transform Data',
    description: 'Maps and reshapes data',
    icon: '🔄',
    defaultConfig: { label: 'Transform Data', description: 'Maps and reshapes data', template: '{{input}}' },
  },
  {
    kind: 'action',
    label: 'Database Write',
    description: 'Writes to a database',
    icon: '💾',
    defaultConfig: { label: 'Database Write', description: 'Writes to a database', table: 'users', operation: 'insert' },
  },
  {
    kind: 'condition',
    label: 'If / Else',
    description: 'Branches based on a condition',
    icon: '🔀',
    defaultConfig: { label: 'If / Else', description: 'Branches based on a condition', expression: 'data.status === "active"' },
  },
  {
    kind: 'condition',
    label: 'Filter',
    description: 'Passes only matching items',
    icon: '🔍',
    defaultConfig: { label: 'Filter', description: 'Passes only matching items', field: 'status', value: 'active' },
  },
  {
    kind: 'output',
    label: 'Send Response',
    description: 'Returns data to the caller',
    icon: '📤',
    defaultConfig: { label: 'Send Response', description: 'Returns data to the caller', statusCode: '200' },
  },
  {
    kind: 'output',
    label: 'Log Event',
    description: 'Records to event log',
    icon: '📋',
    defaultConfig: { label: 'Log Event', description: 'Records to event log', level: 'info' },
  },
]

export const KIND_COLORS: Record<string, string> = {
  trigger: '#f97316',
  action: '#7c6af7',
  condition: '#10b981',
  output: '#ec4899',
}

export const KIND_LABELS: Record<string, string> = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  output: 'Output',
}
