export class CustomError {
    constructor(name, message, code, description) {
        this.name = name;
        this.message = message;
        this.code = code;
        this.description = description;
    }

    static createError({ name, message, code, description }) {
        return new CustomError(name, message, code, description);  
    }
}
