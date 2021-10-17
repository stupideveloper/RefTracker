export function customFetch (url, params) {
  const signal = params.signal;
  delete params.signal;

  const abortPromise = new Promise((resolve) => {
    if (signal) {
      signal.onabort = resolve
    }
  });

  return Promise.race([abortPromise, fetch(url, params)])
}

export function getFaunaError (error) {

  const {code, description} = error.requestResult.responseContent.errors[0];
  let status;

  switch (code) {
    case 'instance not found':
      status = 404;
      break;
    case 'instance not unique':
      status = 409;
      break;
    case 'permission denied':
      status = 403;
      break;
    case 'unauthorized':
    case 'authentication failed':
      status = 401;
      break;
    default:
      status = 500;
  }

  return {code, description, status};
}
export function MethodNotAllowed(request) {
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    headers: {
      'Allow': 'GET, POST'
    }
  })
}
export function NotFound(request) {
  return new Response(`404 Not Found`, {
    status: 404
  })
}

/* File fetch response */
export async function gatherFileResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}