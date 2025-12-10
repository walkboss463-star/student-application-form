import axios from "axios";

export async function fetchFlag(countryName) {
  try {
    const res = await axios.get(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
    );
    return res.data[0]?.flags?.svg || null;
  } catch (err) {
    console.error("Flag fetch error:", err);
    return null;
  }
}
