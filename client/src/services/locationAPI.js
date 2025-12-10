// client/src/services/locationAPI.js
import axios from "axios";

const BASE = "https://countriesnow.space/api/v0.1";

// Returns array of country names (strings)
export async function fetchAllCountries() {
  // endpoint returns lots of data; /countries returns name + iso2 etc. We choose /countries
  const res = await axios.get(`${BASE}/countries`);
  // response: { error, msg, data: [ { country: "Afghanistan", iso2: "AF" }, ... ] }
  // Some endpoints return different shapes; handle defensively:
  const data = res?.data?.data || res?.data || [];
  return data.map((c) => (c.country ? c.country : c.name ? c.name : c));
}

// Given country name string -> returns array of state objects or names
export async function fetchStatesForCountry(countryName) {
  // POST { country: "India" } -> returns { data: { name: "India", states: [ { name: "State1" }, ... ] } }
  const res = await axios.post(`${BASE}/countries/states`, { country: countryName });
  const states = res?.data?.data?.states;
  // states might be array of objects {name: "..."} — convert to array of names
  if (!states) return [];
  return states.map((s) => (typeof s === "string" ? s : s.name ? s.name : s));
}

// Given country + state -> returns array of city names (strings)
export async function fetchCitiesForState(countryName, stateName) {
  // POST { country: "...", state: "..." } -> returns { data: [ "City1", "City2", ... ] }
  const res = await axios.post(`${BASE}/countries/state/cities`, { country: countryName, state: stateName });
  const cities = res?.data?.data || [];
  return cities;
}
