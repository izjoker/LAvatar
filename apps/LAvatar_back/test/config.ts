import config from '../src/utils/config'
import _ from 'lodash'

const mongoConfig = config.get('databases.mongodb.daily');

const url = _.get(mongoConfig, 'url');

const opt = { ..._.get(mongoConfig, 'opts') };
console.log(mongoConfig)

console.log(opt)

