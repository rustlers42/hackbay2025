const API_PORT = 8000;

let host: string;
if (typeof window !== "undefined") {
  host = `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
} else {
  host = "http://localhost:8000";
}

export const BASE_API_URL = host;
