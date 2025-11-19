export class BusinessError extends Error{
    constructor(message , status = 400){
        super(message);
        this.status = status;
        this.type ="business";
    }
}

export class ValidationError extends BusinessError {
    constructor(message){
        super(message , 400)
    }
}

export class NotFoundError extends BusinessError{
    constructor(message){
        super(message , 404)
    }
}

export class ForbiddenError extends BusinessError{
    constructor(message){
        super(message , 403)
    }
}
export class UnexpectedError extends BusinessError{
    constructor(message){
        super(message , 500)
    }
}