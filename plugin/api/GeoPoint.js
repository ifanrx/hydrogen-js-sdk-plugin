const _cloneDeep = require('../utils').cloneDeep

class GeoPoint {
  constructor(longitude, latitude) {
    this.longitude = longitude
    this.latitude = latitude
    this.geoJSON = {
      'type': 'Point',
      'coordinates': [this.longitude, this.latitude]
    }
  }

  toGeoJSON() {
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPoint