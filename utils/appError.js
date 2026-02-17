class AppError extends Error {
  constructor(){
    super();
  }

  create(message, code, statusText, data) {
    this.message = message;
    this.code = code;
    this.statusText = statusText;
    this.data = data; 
  }
};

export default AppError;