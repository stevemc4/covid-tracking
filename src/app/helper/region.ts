import provinces from '../data/regions/provinces'
import cities from '../data/regions/cities'
import districts from '../data/regions/districts'

interface Provinces {
  id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

interface Cities {
  id: string,
  province_id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

interface Districts {
  id: string,
  regency_id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

const getProvinces = (): Provinces[] => {
  return provinces
}

const getCities = (id: string): Cities[] => {
  return cities.filter(city => city.province_id === id)
}

const getDistricts = (id: string): Districts[] => {
  return districts.filter(district => district.regency_id === id)
}

export default { getProvinces, getCities, getDistricts }
export { Provinces, getProvinces, Cities, getCities, Districts, getDistricts }
