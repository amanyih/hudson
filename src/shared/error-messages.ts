export enum ErrorMessages {
  //auth
  USER_ALREADY_EXISTS = 'User Already Exists',
  INVALID_CREDENTIALS = 'Invalid Credentials',

  //validation
  INVALID_EMAIL = 'Invalid Email',
  INVALID_PASSWORD = 'Invalid Password',

  //general
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_FOUND = 'Not Found',
  BAD_REQUEST = 'Bad Request',

  //pagination
  PAGE_MUST_BE_A_NUMBER_ERROR = 'page must be a number conforming to the specified constraints',
  LIMIT_MUST_BE_A_NUMBER_ERROR = 'limit must be a number conforming to the specified constraints',
  PAGE_MUST_BE_GREATER_THAN_ZERO = 'page must not be less than 1',
  LIMIT_MUST_BE_GREATER_THAN_ZERO = 'limit must not be less than 1',
}
