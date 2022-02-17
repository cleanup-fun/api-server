
export const ERRORS = {
  BAD_FORM: { status: 401, message: "bad form data" },
  ALREADY_EXISTS: { status: 401, message: "the item you want to add already exists"},
  SERVER_ERROR: {
    status: 500, message: "something went wrong internally, someone should have been notified"
  },
  FORBIDDEN: { status: 403, message: "forbidden" },
  NOT_FOUND: { status: 404, message: "not found" },
  TIMEOUT: {
    status: 500, message: "something went wrong internally, someone should have been notified"
  }
}
