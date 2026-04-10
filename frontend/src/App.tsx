// This file implements the React UI for creating, listing, editing, and deleting surveys.
// It uses functional components and hooks to satisfy the project's CRUD requirements.
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
      <header className="site-header">
        <div className="site-header-inner">
          <div>
            <p className="site-kicker">SWE 645 Assignment 3</p>
            <h1>Student Survey</h1>
            <p className="site-copy">
              Please complete the survey below. Fields marked with <strong>*</strong> are
              required.
            </p>
          </div>
          <a className="home-link" href="#survey-form">
            Survey Form
          </a>
        </div>
      </header>

      {notice ? <div className={`notice notice-${notice.tone}`}>{notice.text}</div> : null}

      <section className="layout-grid">
        <article className="panel survey-panel" id="survey-form">
          <div className="panel-heading">
            <div>
              <p className="section-label">Student Survey Form</p>
              <h2>{editingId === null ? "Campus Visit Feedback" : `Edit Survey #${editingId}`}</h2>
              <p className="section-copy">
                This form keeps the original survey feel while adding the CRUD workflow required
                for Project 3.
              </p>
            </div>
            {editingId !== null ? (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          <form className="survey-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <div className="section-divider">
                <span>Required Student Information</span>
              </div>

            <div className="field-grid">
              <label>
                First Name *
                <input
                  required
                  value={formData.first_name}
                  onChange={(event) => updateField("first_name", event.target.value)}
                />
              </label>
              <label>
                Last Name *
                <input
                  required
                  value={formData.last_name}
                  onChange={(event) => updateField("last_name", event.target.value)}
                />
              </label>
              <label className="span-2">
                Street Address *
                <input
                  required
                  value={formData.street_address}
                  onChange={(event) => updateField("street_address", event.target.value)}
                />
              </label>
              <label>
                City *
                <input required value={formData.city} onChange={(event) => updateField("city", event.target.value)} />
              </label>
              <label>
                State *
                <input required value={formData.state} onChange={(event) => updateField("state", event.target.value)} />
              </label>
              <label>
                ZIP *
                <input
                  required
                  value={formData.zip_code}
                  onChange={(event) => updateField("zip_code", event.target.value)}
                />
              </label>
              <label>
                Telephone *
                <input
                  required
                  value={formData.telephone}
                  onChange={(event) => updateField("telephone", event.target.value)}
                />
              </label>
              <label>
                E-mail *
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
              <label>
                Date of Survey *
                <input
                  required
                  type="date"
                  value={formData.survey_date}
                  onChange={(event) => updateField("survey_date", event.target.value)}
                />
              </label>
            </div>
            </section>

            <section className="form-section">
              <div className="section-divider">
                <span>Campus Experience</span>
              </div>

            <fieldset className="legacy-fieldset">
              <legend>What did you like most about the campus?</legend>
              <div className="option-grid">
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
            </fieldset>

            <fieldset className="legacy-fieldset">
              <legend>How did you become interested in the university?</legend>
              <div className="option-row">
                {interestSourceOptions.map((option) => (
                  <label className="check-option" key={option}>
                    <input
                      type="checkbox"
                      checked={formData.interest_source.includes(option)}
                      onChange={() => toggleListValue("interest_source", option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            </section>

            <section className="form-section">
              <div className="section-divider">
                <span>Recommendation</span>
              </div>

            <label className="select-label">
              Likelihood of recommending this school
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
            </section>

            <div className="actions">
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : editingId === null ? "Submit Survey" : "Update Survey"}
              </button>
              <button className="secondary-button" onClick={resetForm} type="button">
                Reset
              </button>
            </div>
          </form>
        </article>

        <article className="panel archive-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Recorded Responses</p>
              <h2>Survey Archive</h2>
              <p className="section-copy">
                Project 3 extends the original static survey into a full CRUD application by
                letting us review, edit, and delete submissions.
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
                    <h3>
                      {survey.first_name} {survey.last_name}
                    </h3>
                    <p>
                      {survey.city}, {survey.state}
                    </p>
                  </div>
                  <span className="survey-id">#{survey.id}</span>
                </div>

                <dl>
                  <div>
                    <dt>Address</dt>
                    <dd>{survey.street_address}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{survey.email}</dd>
                  </div>
                  <div>
                    <dt>Telephone</dt>
                    <dd>{survey.telephone}</dd>
                  </div>
                  <div>
                    <dt>Survey Date</dt>
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
    </main>
  );
}

export default App;
