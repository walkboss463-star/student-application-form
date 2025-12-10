import React, { useEffect, useState } from "react";
import {
  fetchAllCountries,
  fetchStatesForCountry,
  fetchCitiesForState,
} from "../services/locationAPI";
import { fetchFlag } from "../services/flagAPI";
import API from "../services/api";
import "../styles/StudentForm.css";

export default function StudentForm() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [flagUrl, setFlagUrl] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    state: "",
    city: "",
    contactNumber: "",
    gender: "",
    educationType: "",
    pucStream: "",
    diplomaBranch: "",
  });

  // ------------------------------------
  // Load all countries once on mount
  // ------------------------------------
  useEffect(() => {
    fetchAllCountries()
      .then((list) => {
        const sorted = Array.from(new Set(list)).sort((a, b) =>
          a.localeCompare(b)
        );
        setCountries(sorted);
      })
      .catch((err) => console.error("Failed loading countries:", err));
  }, []);

  // -------------------------------------------------
  // When country changes → load states & set flag
  // -------------------------------------------------
  useEffect(() => {
    if (!form.country) {
      setStates([]);
      setCities([]);
      return;
    }

    // Load states
    fetchStatesForCountry(form.country)
      .then((list) => {
        const sorted = Array.isArray(list)
          ? list.sort((a, b) => a.localeCompare(b))
          : [];
        setStates(sorted);

        // Reset state & city if previous state becomes invalid
        if (!sorted.includes(form.state)) {
          setForm((f) => ({ ...f, state: "", city: "" }));
        }
      })
      .catch((err) => {
        console.error("Failed loading states:", err);
        setStates([]);
        setForm((f) => ({ ...f, state: "", city: "" }));
      });

    // Load flag
    fetchFlag(form.country)
      .then((url) => setFlagUrl(url))
      .catch(() => setFlagUrl(null));
  }, [form.country]);

  // -------------------------------------------------
  // When state changes → load cities
  // -------------------------------------------------
  useEffect(() => {
    if (!form.state) {
      setCities([]);
      return;
    }

    fetchCitiesForState(form.country, form.state)
      .then((list) => {
        const sorted = Array.isArray(list)
          ? list.sort((a, b) => a.localeCompare(b))
          : [];
        setCities(sorted);

        // Reset city if previous city becomes invalid
        if (!sorted.includes(form.city)) {
          setForm((f) => ({ ...f, city: "" }));
        }
      })
      .catch((err) => {
        console.error("Failed loading cities:", err);
        setCities([]);
        setForm((f) => ({ ...f, city: "" }));
      });
  }, [form.state]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // -----------------------------------------
  // FORM SUBMIT HANDLER
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strong validation
    if (!form.name || !form.email || !form.country) {
      alert("Please fill Name, Email and Country.");
      return;
    }

    if (!form.state) {
      alert("Please select a State.");
      return;
    }

    if (!form.city) {
      alert("Please select a City.");
      return;
    }

    const payload = { ...form };

    try {
      const res = await API.post("/students", payload);
      window.open(`/submitted/${res.data._id}`, "_blank");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit. Check console.");
    }
  };

  const pucOptions = ["SCIENCE", "COMMERCE", "ARTS"];
  const diplomaBranches = [
    "Civil",
    "Mechanical",
    "Electrical",
    "Computer",
    "Electronics",
    "Automobile",
  ];

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="title">Student Application Form</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* COUNTRY + FLAG */}
          <div className="form-group">
            <label>Country</label>
            <div className="country-flex">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Country --</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {flagUrl ? (
                <img src={flagUrl} alt={form.country} className="flag" />
              ) : (
                <div style={{ width: 48 }} />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              disabled={!states.length}
            >
              <option value="">
                {states.length
                  ? "-- Select State --"
                  : "No states available"}
              </option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              disabled={!cities.length}
            >
              <option value="">
                {cities.length ? "-- Select City --" : "No cities available"}
              </option>
              {cities.map((ci) => (
                <option key={ci} value={ci}>
                  {ci}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="radio-row">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === "male"}
                  onChange={handleChange}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === "female"}
                  onChange={handleChange}
                />{" "}
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Education</label>
            <select
              name="educationType"
              value={form.educationType}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="PUC">PUC</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {form.educationType === "PUC" && (
            <div className="form-group">
              <label>PUC Stream</label>
              <select
                name="pucStream"
                value={form.pucStream}
                onChange={handleChange}
              >
                <option value="">-- Select Stream --</option>
                {pucOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.educationType === "Diploma" && (
            <div className="form-group">
              <label>Diploma Branch</label>
              <select
                name="diplomaBranch"
                value={form.diplomaBranch}
                onChange={handleChange}
              >
                <option value="">-- Select Branch --</option>
                {diplomaBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
