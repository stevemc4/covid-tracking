import provinces from '../data/regions/provinces'
import cities from '../data/regions/cities'
import districts from '../data/regions/districts'

interface Province {
  id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

interface City {
  id: string,
  province_id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

interface District {
  id: string,
  regency_id: string,
  name: string,
  alt_name: string,
  latitude: number,
  longitude: number
}

const getProvinces = (): Province[] => {
  return provinces
}

const getProvince = (id: string): Province => {
  return provinces.find(province => province.id === id)
}

const getCities = (id: string): City[] => {
  return cities.filter(city => city.province_id === id)
}

const getCity = (id: string): City => {
  return cities.find(city => city.id === id)
}

const getDistricts = (id: string): District[] => {
  return districts.filter(district => district.regency_id === id)
}

const getDistrict = (id: string): District => {
  return districts.find(district => district.id === id)
}

export default { getProvinces, getCities, getDistricts, getProvince, getCity, getDistrict }
export { Province, getProvinces, City, getCities, District, getDistricts, getProvince, getCity, getDistrict }
