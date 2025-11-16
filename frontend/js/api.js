// Helper to add credentials to all requests
const apiRequest = (config) => {
  return m
    .request({
      ...config,
      // Include cookies in requests
      credentials: "same-origin",
    })
    .catch((err) => {
      // Mithril parses JSON responses automatically
      // On error, err.response contains the parsed JSON body
      if (err.response && err.response.error) {
        // Throw a proper Error object with the error message
        const error = new Error(err.response.error);
        error.code = err.code;
        throw error;
      }
      throw err;
    });
};

// Global error handler for auth failures
const originalRequest = m.request;
m.request = function (options) {
  return originalRequest(options).catch((error) => {
    // If we get a 401, redirect to login
    if (error.code === 401) {
      m.route.set("/login");
    }
    throw error;
  });
};

export const API = {
  // Authentication
  auth: {
    login: (apiKey) =>
      // Use originalRequest to avoid the global 401 redirect
      originalRequest({
        method: "POST",
        url: "/api/auth/login",
        body: { apiKey },
        credentials: "same-origin",
      }).catch((err) => {
        // Mithril parses JSON responses automatically
        // On error, err.response contains the parsed JSON body
        if (err.response && err.response.error) {
          const error = new Error(err.response.error);
          error.error = err.response.error;
          throw error;
        }
        throw err;
      }),
    logout: () =>
      apiRequest({
        method: "POST",
        url: "/api/auth/logout",
      }),
  },

  // Functions
  functions: {
    list: (limit = 20, offset = 0) =>
      apiRequest({
        method: "GET",
        url: `/api/functions?limit=${limit}&offset=${offset}`,
      }),
    get: (id) => apiRequest({ method: "GET", url: `/api/functions/${id}` }),
    create: (data) =>
      apiRequest({ method: "POST", url: "/api/functions", body: data }),
    update: (id, data) =>
      apiRequest({ method: "PUT", url: `/api/functions/${id}`, body: data }),
    delete: (id) =>
      apiRequest({ method: "DELETE", url: `/api/functions/${id}` }),
    updateEnv: (id, env_vars) =>
      apiRequest({
        method: "PUT",
        url: `/api/functions/${id}/env`,
        body: { env_vars },
      }),
  },

  // Versions
  versions: {
    list: (functionId, limit = 20, offset = 0) =>
      apiRequest({
        method: "GET",
        url: `/api/functions/${functionId}/versions?limit=${limit}&offset=${offset}`,
      }),
    get: (functionId, version) =>
      apiRequest({
        method: "GET",
        url: `/api/functions/${functionId}/versions/${version}`,
      }),
    activate: (functionId, version) =>
      apiRequest({
        method: "POST",
        url: `/api/functions/${functionId}/versions/${version}/activate`,
      }),
    diff: (functionId, v1, v2) =>
      apiRequest({
        method: "GET",
        url: `/api/functions/${functionId}/diff/${v1}/${v2}`,
      }),
  },

  // Executions
  executions: {
    list: (functionId, limit = 20, offset = 0) =>
      apiRequest({
        method: "GET",
        url: `/api/functions/${functionId}/executions?limit=${limit}&offset=${offset}`,
      }),
    get: (executionId) =>
      apiRequest({ method: "GET", url: `/api/executions/${executionId}` }),
    getLogs: (executionId, limit = 20, offset = 0) =>
      apiRequest({
        method: "GET",
        url: `/api/executions/${executionId}/logs?limit=${limit}&offset=${offset}`,
      }),
  },

  // Execute function
  execute: (functionId, request) => {
    // Handle query as either string or object
    let queryString = "";
    if (request.query) {
      if (typeof request.query === "string") {
        queryString = request.query.startsWith("?")
          ? request.query
          : "?" + request.query;
      } else {
        const params = new URLSearchParams(request.query);
        queryString = params.toString() ? "?" + params : "";
      }
    }
    const url = `/fn/${functionId}${queryString}`;

    return m.request({
      method: request.method || "GET",
      url: url,
      body: request.body,
      headers: request.headers,
      extract: (xhr) => ({
        status: xhr.status,
        body: xhr.responseText,
        headers: {
          "X-Function-Id": xhr.getResponseHeader("X-Function-Id"),
          "X-Function-Version-Id": xhr.getResponseHeader(
            "X-Function-Version-Id",
          ),
          "X-Execution-Id": xhr.getResponseHeader("X-Execution-Id"),
          "X-Execution-Duration-Ms": xhr.getResponseHeader(
            "X-Execution-Duration-Ms",
          ),
        },
      }),
    });
  },
};
