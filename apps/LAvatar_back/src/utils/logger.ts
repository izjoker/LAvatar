import FulguriteLogger from '../core/fulgurite/fulguriteLogger'
import config from './config'

export const logger = FulguriteLogger(null, config.get('log'));
export default logger;