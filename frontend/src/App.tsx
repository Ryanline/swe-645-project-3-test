// This file renders a React translation of the original Assignment 1 survey page.
// It keeps the older W3.CSS structure while layering in the Project 3 CRUD behavior.
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { createSurvey, deleteSurvey, fetchSurveys, updateSurvey } from "./api";
import { emptySurvey, type SurveyFormData } from "./types";

const likedMostOptions = [
  { value: "students", label: "Students" },
  { value: "location", label: "Location" },
  { value: "campus", label: "Campus" },
  { value: "atmosphere", label: "Atmosphere" },
  { value: "dorm rooms", label: "Dorm Rooms" },
  { value: "sports", label: "Sports" },
];

const interestSourceOptions = [
  { value: "friends", label: "Friends" },
  { value: "television", label: "Television" },
  { value: "Internet", label: "Internet" },
  { value: "other", label: "Other" },
];

const recommendationOptions = ["Very Likely", "Likely", "Unlikely"];

type Notice = {
  tone: "success" | "error";
  text: string;
};

function App() {
  const [formData, setFormData] = useState<SurveyFormData>({
    ...emptySurvey,
    survey_date: new Date().toISOString().slice(0, 10),
  });
  const [surveys, setSurveys] = useState<SurveyFormData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    void loadSurveys();
  }, []);

  async function loadSurveys() {
    setIsLoading(true);
    try {
      const data = await fetchSurveys();
      setSurveys(data);
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to load surveys.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      ...emptySurvey,
      survey_date: new Date().toISOString().slice(0, 10),
    });
  }

  function toggleLikedMost(value: string) {
    setFormData((current) => {
      const nextValues = current.liked_most.includes(value)
        ? current.liked_most.filter((item) => item !== value)
        : [...current.liked_most, value];

      return {
        ...current,
        liked_most: nextValues,
      };
    });
  }

  function updateField<K extends keyof SurveyFormData>(field: K, value: SurveyFormData[K]) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    try {
      if (editingId === null) {
        await createSurvey(formData);
        setNotice({ tone: "success", text: "Survey submitted successfully." });
      } else {
        await updateSurvey(editingId, formData);
        setNotice({ tone: "success", text: "Survey updated successfully." });
      }

      resetForm();
      await loadSurveys();
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to save survey.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this survey?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteSurvey(id);
      if (editingId === id) {
        resetForm();
      }
      setNotice({ tone: "success", text: "Survey deleted successfully." });
      await loadSurveys();
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Unable to delete survey.",
      });
    }
  }

  function startEdit(survey: SurveyFormData) {
    setEditingId(survey.id ?? null);
    setFormData({
      ...emptySurvey,
      ...survey,
      survey_date: survey.survey_date.slice(0, 10),
      raffle: survey.raffle ?? "",
      comments: survey.comments ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="assignment-page">
      <div className="w3-top">
        <div className="w3-bar w3-white w3-wide w3-padding w3-card">
          <a href="#home" className="w3-bar-item w3-button">
            <b>SWE 645</b> Assignment 3
          </a>
          <div className="w3-right w3-hide-small">
            <a href="#home" className="w3-bar-item w3-button">
              Home
            </a>
            <a href="#archive" className="w3-bar-item w3-button">
              Archive
            </a>
          </div>
        </div>
      </div>

      <header className="w3-display-container w3-content w3-wide" style={{ maxWidth: "1500px" }} id="home">
        <img
          className="w3-image"
          src="https://www.w3schools.com/w3images/architect.jpg"
          alt="Architecture"
          width="1500"
          height="800"
        />
        <div className="w3-display-middle w3-margin-top w3-center">
          <h1 className="w3-xxlarge w3-text-white">
            <span className="w3-padding w3-black w3-opacity-min">
              <b>SWE 645</b>
            </span>{" "}
            <span className="w3-hide-small w3-text-light-grey">Assignment 3</span>
          </h1>
        </div>
      </header>

      <div className="w3-content w3-padding" style={{ maxWidth: "1564px" }}>
        <div className="w3-container w3-padding-32" id="survey">
          <h3 className="w3-border-bottom w3-border-light-grey w3-padding-16">Student Survey</h3>
          <p>
            {editingId === null
              ? "Please complete the survey below. Fields marked with * are required."
              : `Please complete the survey below. You are editing survey #${editingId}.`}
          </p>

          {notice ? (
            <div
              className={
                notice.tone === "success"
                  ? "w3-panel w3-pale-green w3-leftbar w3-border-green"
                  : "w3-panel w3-pale-red w3-leftbar w3-border-red"
              }
            >
              <p>{notice.text}</p>
            </div>
          ) : null}

          <form className="w3-container w3-card w3-white w3-padding-16 w3-round-large" onSubmit={handleSubmit}>
            <div className="w3-row-padding">
              <div className="w3-half">
                <label>
                  <b>First Name *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(event) => updateField("first_name", event.target.value)}
                />
              </div>
              <div className="w3-half">
                <label>
                  <b>Last Name *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(event) => updateField("last_name", event.target.value)}
                />
              </div>
            </div>

            <div className="w3-row-padding w3-margin-top">
              <div className="w3-half">
                <label>
                  <b>Street Address *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.street_address}
                  onChange={(event) => updateField("street_address", event.target.value)}
                />
              </div>
              <div className="w3-half">
                <label>
                  <b>City *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                />
              </div>
            </div>

            <div className="w3-row-padding w3-margin-top">
              <div className="w3-third">
                <label>
                  <b>State *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.state}
                  onChange={(event) => updateField("state", event.target.value)}
                />
              </div>
              <div className="w3-third">
                <label>
                  <b>ZIP *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="text"
                  required
                  value={formData.zip_code}
                  onChange={(event) => updateField("zip_code", event.target.value)}
                />
              </div>
              <div className="w3-third">
                <label>
                  <b>Date of Survey *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="date"
                  required
                  value={formData.survey_date}
                  onChange={(event) => updateField("survey_date", event.target.value)}
                />
              </div>
            </div>

            <div className="w3-row-padding w3-margin-top">
              <div className="w3-half">
                <label>
                  <b>Telephone *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="tel"
                  placeholder="e.g., 555-555-5555"
                  required
                  value={formData.telephone}
                  onChange={(event) => updateField("telephone", event.target.value)}
                />
              </div>
              <div className="w3-half">
                <label>
                  <b>E-mail *</b>
                </label>
                <input
                  className="w3-input w3-border"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </div>
            </div>

            <hr className="w3-margin-top w3-margin-bottom" />

            <p>
              <b>What did you like most about the campus?</b>
            </p>
            <div className="w3-row-padding">
              <div className="w3-third">
                {likedMostOptions.slice(0, 2).map((option) => (
                  <label className="survey-choice" key={option.value}>
                    <input
                      className="w3-check"
                      type="checkbox"
                      checked={formData.liked_most.includes(option.value)}
                      onChange={() => toggleLikedMost(option.value)}
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </div>
              <div className="w3-third">
                {likedMostOptions.slice(2, 4).map((option) => (
                  <label className="survey-choice" key={option.value}>
                    <input
                      className="w3-check"
                      type="checkbox"
                      checked={formData.liked_most.includes(option.value)}
                      onChange={() => toggleLikedMost(option.value)}
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </div>
              <div className="w3-third">
                {likedMostOptions.slice(4).map((option) => (
                  <label className="survey-choice" key={option.value}>
                    <input
                      className="w3-check"
                      type="checkbox"
                      checked={formData.liked_most.includes(option.value)}
                      onChange={() => toggleLikedMost(option.value)}
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <hr className="w3-margin-top w3-margin-bottom" />

            <p>
              <b>How did you become interested in the university?</b>
            </p>
            <p>
              {interestSourceOptions.map((option) => (
                <label className="w3-margin-right" key={option.value}>
                  <input
                    className="w3-radio"
                    type="radio"
                    name="interestSource"
                    required={formData.interest_source.length === 0 && option.value === "friends"}
                    checked={formData.interest_source.includes(option.value)}
                    onChange={() => updateField("interest_source", [option.value])}
                  />{" "}
                  {option.label}
                </label>
              ))}
            </p>

            <hr className="w3-margin-top w3-margin-bottom" />

            <label>
              <b>Likelihood of recommending this school</b>
            </label>
            <select
              className="w3-select w3-border w3-margin-top"
              name="recommendation"
              required
              value={formData.recommendation_likelihood}
              onChange={(event) => updateField("recommendation_likelihood", event.target.value)}
            >
              <option value="" disabled>
                Select one
              </option>
              {recommendationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <hr className="w3-margin-top w3-margin-bottom" />

            <label>
              <b>Raffle</b> (Enter at least ten comma-separated numbers from 1-100)
            </label>
            <input
              className="w3-input w3-border w3-margin-top"
              type="text"
              placeholder="Example: 5, 12, 33, 47, 51, 63, 70, 81, 92, 100"
              value={formData.raffle ?? ""}
              onChange={(event) => updateField("raffle", event.target.value)}
            />

            <p className="w3-small w3-text-grey">
              Note: This field is shown to preserve the Assignment 1 layout. It is not currently
              stored in the Project 3 backend.
            </p>

            <label>
              <b>Additional Comments</b>
            </label>
            <textarea
              className="w3-input w3-border w3-margin-top"
              name="comments"
              rows={4}
              placeholder="Optional comments..."
              value={formData.comments ?? ""}
              onChange={(event) => updateField("comments", event.target.value)}
            />

            <div className="w3-margin-top">
              <button className="w3-button w3-black w3-margin-right" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId === null ? "Submit" : "Update"}
              </button>
              <button className="w3-button w3-light-grey w3-border" type="button" onClick={resetForm}>
                {editingId === null ? "Cancel" : "Cancel Edit"}
              </button>
            </div>
          </form>
        </div>

        <div className="w3-container w3-padding-32" id="archive">
          <h3 className="w3-border-bottom w3-border-light-grey w3-padding-16">Survey Archive</h3>
          <div className="archive-toolbar">
            <p className="archive-copy">
              Project 3 adds this persistent archive so we can review, edit, and delete submitted
              surveys.
            </p>
            <button className="w3-button w3-light-grey w3-border" type="button" onClick={() => void loadSurveys()}>
              Refresh
            </button>
          </div>

          {isLoading ? <p>Loading surveys...</p> : null}

          {!isLoading && surveys.length === 0 ? (
            <div className="w3-panel w3-pale-blue w3-leftbar w3-border-blue">
              <p>No surveys recorded yet. Submit the first one from the form.</p>
            </div>
          ) : null}

          {surveys.map((survey) => (
            <section className="w3-card w3-white w3-padding-16 w3-margin-bottom archive-card" key={survey.id}>
              <div className="archive-toolbar">
                <div>
                  <h4 className="archive-name">
                    {survey.first_name} {survey.last_name}
                  </h4>
                  <p className="archive-copy">
                    {survey.city}, {survey.state}
                  </p>
                </div>
                <span className="w3-tag w3-black">#{survey.id}</span>
              </div>

              <div className="w3-row-padding w3-margin-top">
                <div className="w3-half">
                  <p>
                    <b>Street Address</b>
                    <br />
                    {survey.street_address}
                  </p>
                  <p>
                    <b>E-mail</b>
                    <br />
                    {survey.email}
                  </p>
                  <p>
                    <b>Telephone</b>
                    <br />
                    {survey.telephone}
                  </p>
                </div>
                <div className="w3-half">
                  <p>
                    <b>Date of Survey</b>
                    <br />
                    {survey.survey_date}
                  </p>
                  <p>
                    <b>Liked Most</b>
                    <br />
                    {survey.liked_most.join(", ") || "No selections"}
                  </p>
                  <p>
                    <b>Interest Source</b>
                    <br />
                    {survey.interest_source.join(", ") || "No selections"}
                  </p>
                  <p>
                    <b>Recommendation</b>
                    <br />
                    {survey.recommendation_likelihood || "No selection"}
                  </p>
                </div>
              </div>

              <div className="w3-margin-top archive-actions">
                <button className="w3-button w3-black" type="button" onClick={() => startEdit(survey)}>
                  Edit
                </button>
                <button className="w3-button w3-light-grey w3-border" type="button" onClick={() => void handleDelete(survey.id!)}>
                  Delete
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>

      <footer className="w3-center w3-black w3-padding-16">
        <p>
          Powered by{" "}
          <a
            href="https://www.w3schools.com/w3css/default.asp"
            title="W3.CSS"
            target="_blank"
            rel="noreferrer"
            className="w3-hover-text-green"
          >
            w3.css
          </a>
        </p>
      </footer>
    </main>
  );
}

export default App;
