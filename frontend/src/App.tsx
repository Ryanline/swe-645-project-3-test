// This file implements the React UI for creating, listing, editing, and deleting surveys.
// It preserves the Project 3 functionality while visually following the Assignment 1 architect template.
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { createSurvey, deleteSurvey, fetchSurveys, updateSurvey } from "./api";
import { emptySurvey, type SurveyFormData } from "./types";

const likedMostOptions = ["students", "location", "campus", "atmosphere", "dorm rooms", "sports"];
const interestSourceOptions = ["friends", "television", "Internet", "other"];
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

  function toggleListValue(field: "liked_most" | "interest_source", value: string) {
    setFormData((current) => {
      const nextValues = current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value];

      return {
        ...current,
        [field]: nextValues,
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
      ...survey,
      survey_date: survey.survey_date.slice(0, 10),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="page-shell">
      <div className="top-nav">
        <div className="top-nav-inner">
          <a className="brand-link" href="#home">
            <b>SWE 645</b> Assignment 3
          </a>
          <div className="nav-links">
            <a href="#survey-form">Student Survey</a>
            <a href="#survey-archive">Survey Archive</a>
          </div>
        </div>
      </div>

      <header className="hero-banner" id="home">
        <img
          alt="Architecture"
          className="hero-image"
          src="https://www.w3schools.com/w3images/architect.jpg"
        />
        <div className="hero-overlay">
          <h1>
            <span className="hero-mark">SWE 645</span>
            <span className="hero-title">Project 3</span>
          </h1>
        </div>
      </header>

      <section className="content-section intro-block">
        <h3 className="section-heading">Student Survey</h3>
        <p>
          Please complete the survey below. This Project 3 version keeps the older architect-style
          look while extending the page into a full CRUD web application.
        </p>
      </section>

      {notice ? <div className={`notice notice-${notice.tone}`}>{notice.text}</div> : null}

      <section className="layout-grid">
        <article className="content-section" id="survey-form">
          <div className="panel-header">
            <div>
              <h3 className="section-heading">Student Survey</h3>
              <p className="panel-copy">
                {editingId === null
                  ? "Please complete the survey below. Fields marked with * are required."
                  : `You are editing survey #${editingId}.`}
              </p>
            </div>
            {editingId !== null ? (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          <form className="survey-form-card" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                <b>First Name *</b>
                <input
                  required
                  value={formData.first_name}
                  onChange={(event) => updateField("first_name", event.target.value)}
                />
              </label>
              <label>
                <b>Last Name *</b>
                <input
                  required
                  value={formData.last_name}
                  onChange={(event) => updateField("last_name", event.target.value)}
                />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <b>Street Address *</b>
                <input
                  required
                  value={formData.street_address}
                  onChange={(event) => updateField("street_address", event.target.value)}
                />
              </label>
              <label>
                <b>City *</b>
                <input required value={formData.city} onChange={(event) => updateField("city", event.target.value)} />
              </label>
            </div>

            <div className="field-grid thirds">
              <label>
                <b>State *</b>
                <input required value={formData.state} onChange={(event) => updateField("state", event.target.value)} />
              </label>
              <label>
                <b>ZIP *</b>
                <input
                  required
                  value={formData.zip_code}
                  onChange={(event) => updateField("zip_code", event.target.value)}
                />
              </label>
              <label>
                <b>Date of Survey *</b>
                <input
                  required
                  type="date"
                  value={formData.survey_date}
                  onChange={(event) => updateField("survey_date", event.target.value)}
                />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <b>Telephone *</b>
                <input
                  required
                  value={formData.telephone}
                  onChange={(event) => updateField("telephone", event.target.value)}
                />
              </label>
              <label>
                <b>E-mail *</b>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
            </div>

            <hr />

            <div className="form-block">
              <p>
                <b>What did you like most about the campus?</b>
              </p>
              <div className="option-columns">
                {likedMostOptions.map((option) => (
                  <label className="check-option" key={option}>
                    <input
                      type="checkbox"
                      checked={formData.liked_most.includes(option)}
                      onChange={() => toggleListValue("liked_most", option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr />

            <div className="form-block">
              <p>
                <b>How did you become interested in the university?</b>
              </p>
              <div className="radio-row">
                {interestSourceOptions.map((option) => (
                  <label className="check-option" key={option}>
                    <input
                      type="radio"
                      name="interest_source"
                      checked={formData.interest_source.includes(option)}
                      onChange={() => updateField("interest_source", [option])}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr />

            <label className="select-label">
              <b>Likelihood of recommending this school</b>
              <select
                required
                value={formData.recommendation_likelihood}
                onChange={(event) => updateField("recommendation_likelihood", event.target.value)}
              >
                {recommendationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="actions">
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : editingId === null ? "Submit" : "Update"}
              </button>
              <button className="secondary-button" onClick={resetForm} type="button">
                Cancel
              </button>
            </div>
          </form>
        </article>

        <article className="content-section" id="survey-archive">
          <div className="panel-header">
            <div>
              <h3 className="section-heading">Survey Archive</h3>
              <p className="panel-copy">
                This is the Project 3 addition that turns the old static page into a persistent CRUD
                application.
              </p>
            </div>
            <button className="secondary-button" type="button" onClick={() => void loadSurveys()}>
              Refresh
            </button>
          </div>

          {isLoading ? <p>Loading surveys...</p> : null}

          {!isLoading && surveys.length === 0 ? (
            <div className="empty-state">
              <p>No surveys recorded yet. Submit the first one from the form.</p>
            </div>
          ) : null}

          <div className="survey-list">
            {surveys.map((survey) => (
              <section className="survey-card" key={survey.id}>
                <div className="survey-card-header">
                  <div>
                    <h4>
                      {survey.first_name} {survey.last_name}
                    </h4>
                    <p>
                      {survey.city}, {survey.state}
                    </p>
                  </div>
                  <span className="survey-id">#{survey.id}</span>
                </div>

                <dl>
                  <div>
                    <dt>Street Address</dt>
                    <dd>{survey.street_address}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{survey.email}</dd>
                  </div>
                  <div>
                    <dt>Telephone</dt>
                    <dd>{survey.telephone}</dd>
                  </div>
                  <div>
                    <dt>Date of Survey</dt>
                    <dd>{survey.survey_date}</dd>
                  </div>
                  <div>
                    <dt>Liked Most</dt>
                    <dd>{survey.liked_most.join(", ") || "No selections"}</dd>
                  </div>
                  <div>
                    <dt>Interest Source</dt>
                    <dd>{survey.interest_source.join(", ") || "No selections"}</dd>
                  </div>
                  <div>
                    <dt>Recommendation</dt>
                    <dd>{survey.recommendation_likelihood}</dd>
                  </div>
                </dl>

                <div className="actions">
                  <button className="primary-button" type="button" onClick={() => startEdit(survey)}>
                    Edit
                  </button>
                  <button className="secondary-button danger-button" type="button" onClick={() => void handleDelete(survey.id!)}>
                    Delete
                  </button>
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>

      <footer className="site-footer">
        <p>Powered by React, FastAPI, SQLModel, Kubernetes, and the architect-style Assignment 1 visual theme.</p>
      </footer>
    </main>
  );
}

export default App;
