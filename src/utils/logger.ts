import pino from 'pino'
import pretty from 'pino-pretty'
import moment from 'moment'

// Setup main Logger
export const logger = pino(
  {
    base: {
      pid: false
    },
    timestamp: () => `,"time":"${moment().format()}"`
  },
  pretty()
)

// Create child loggers with specific contexts
export const apiLogger = logger.child({ module: 'API' })
export const warnLogger = logger.child({ module: 'WARN' })
export const errorLogger = logger.child({ module: 'Error' })
