'use strict'

import XmlStream from 'xml-stream'
import fs from 'graceful-fs'
import sanitize from 'sanitize-html'

class Parser {
  /**
   * @param  {String}
   * @param  {String}
   * @param  {Object}
   * @return {boolean}
   */
  constructor(input, output, config) {

    if (!input || !output) {
      const err = 'Input and output required'
      throw err;
    }

    this.input = input
    this.output = output
    this.config = {
      threshold : config.threshold ? config.threshold : 5,
      type: config.type ? config.type : 0
    }
  }

  _filter(item) {
    const config = this.config
    const type2 = (config.type === 2 && item.PostTypeId === '2')
    const type1 = (config.type === 1 && item.PostTypeId === '1')
    const threshold = (config.threshold >= parseInt(item.Score) || !config.threshold)
    // checking for config pass if threshold but no type
    if (!config || (threshold && config.type === 0)) {
      return true
    }
    // check type
    if (type1 && threshold) {
      return true
    } else if (type2 && threshold) {
      return true
    } else {
      return false
    }
    return false
  }

  start() {
    const rs = fs.createReadStream(this.input)
    const ws = fs.createWriteStream(this.output)
    const xml = new XmlStream(rs);
    var sanitized = ''
    xml.on('endElement: row', (row) => {
      let post = row.$
      //console.log(post.Body)
      if (this._filter(post)) {
        var sanitized = sanitize(post.Body, {allowedTags: []}).trim()
        ws.write(sanitized)
      }
    })
    return true;
  }
}

export
default Parser
