// This file defines the shared frontend data shapes used by forms and API calls.
// It mirrors the survey payload expected by the FastAPI backend.
export type SurveyFormData = {
  id?: number;
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  telephone: string;
  email: string;
  survey_date: string;
  liked_most: string[];
  interest_source: string[];
  recommendation_likelihood: string;
};

export const emptySurvey: SurveyFormData = {
  first_name: "",
  last_name: "",
  street_address: "",
  city: "",
  state: "",
  zip_code: "",
  telephone: "",
  email: "",
  survey_date: "",
  liked_most: [],
  interest_source: [],
  recommendation_likelihood: "Likely",
};
