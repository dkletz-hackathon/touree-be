class AppError {
	constructor(errCode = ERROR_CODE.ERROR_INTERNAL_SERVER, message = "") {
		this.errCode = errCode;
		this.message = message;
	}
}

const ERROR_CODE = {
	SUCCESS: 0,
	ERROR_INTERNAL_SERVER: 1,
	ERROR_NOT_FOUND: 2,
};

module.exports = {
	AppError,
	ERROR_CODE,
};
