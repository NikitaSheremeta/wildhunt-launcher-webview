function asTrimmedString(value) {
  if (value == null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => asTrimmedString(item))
      .filter(Boolean)
      .join(', ');
  }

  const stringified = typeof value === 'string' ? value : String(value);

  return stringified.trim();
}

function normalizeHttpMethod(method) {
  const value = asTrimmedString(method);

  return value ? value.toUpperCase() : '';
}

function extractMethod(error) {
  if (!error) {
    return '';
  }

  const methodFromConfig = normalizeHttpMethod(error.config?.method || error.response?.config?.method);

  return methodFromConfig;
}

function extractErrorMessage(error) {
  if (!error) {
    return '';
  }

  const responseMessage = asTrimmedString(error.response?.data?.message);

  if (responseMessage) {
    return responseMessage;
  }

  const fallbackResponse = asTrimmedString(error.response?.data);

  if (fallbackResponse) {
    return fallbackResponse;
  }

  return asTrimmedString(error.message);
}

export function buildResponseErrorMessage({ endpoint, error, method, fallbackMessage } = {}) {
  const preparedMessage = extractErrorMessage(error) || fallbackMessage;

  return preparedMessage;
}
