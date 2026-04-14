import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class OperacionReservaInvalida extends HttpException {
    constructor(message: string) {
        super({ statusCode: HttpStatus.BAD_REQUEST, error: 'Operación Inválida', message }, HttpStatus.BAD_REQUEST);
    }
}

export class ReservaNoEncontrada extends HttpException {
    constructor(id: string) {
        super({ statusCode: HttpStatus.NOT_FOUND, error: 'Reserva No Encontrada', message: `Reserva con id '${id}' no encontrada` }, HttpStatus.NOT_FOUND);
    }
}

export class AutoNoDisponible extends HttpException {
    constructor(message: string) {
        super({ statusCode: HttpStatus.CONFLICT, error: 'Auto No Disponible', message }, HttpStatus.CONFLICT);
    }
}

export class ReservaSolapada extends HttpException {
    constructor(message: string) {
        super({ statusCode: HttpStatus.CONFLICT, error: 'Reserva Solapada', message }, HttpStatus.CONFLICT);
    }
}

export class ClienteNoEncontrado extends HttpException {
    constructor(id: string) {
        super({ statusCode: HttpStatus.NOT_FOUND, error: 'Cliente No Encontrado', message: `Cliente con id '${id}' no encontrado` }, HttpStatus.NOT_FOUND);
    }
}

export class AutoNoEncontrado extends HttpException {
    constructor(id: string) {
        super({ statusCode: HttpStatus.NOT_FOUND, error: 'Auto No Encontrado', message: `Auto con id '${id}' no encontrado` }, HttpStatus.NOT_FOUND);
    }
}

@Catch(OperacionReservaInvalida)
export class OperacionReservaInvalidaFilter implements ExceptionFilter {
    catch(exception: OperacionReservaInvalida, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.BAD_REQUEST).json(exception.getResponse());
    }
}

@Catch(ReservaNoEncontrada)
export class ReservaNoEncontradaFilter implements ExceptionFilter {
    catch(exception: ReservaNoEncontrada, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.NOT_FOUND).json(exception.getResponse());
    }
}

@Catch(AutoNoDisponible)
export class AutoNoDisponibleFilter implements ExceptionFilter {
    catch(exception: AutoNoDisponible, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.CONFLICT).json(exception.getResponse());
    }
}

@Catch(ReservaSolapada)
export class ReservaSolapadaFilter implements ExceptionFilter {
    catch(exception: ReservaSolapada, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.CONFLICT).json(exception.getResponse());
    }
}

@Catch(ClienteNoEncontrado)
export class ClienteNoEncontradoFilter implements ExceptionFilter {
    catch(exception: ClienteNoEncontrado, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.NOT_FOUND).json(exception.getResponse());
    }
}

@Catch(AutoNoEncontrado)
export class AutoNoEncontradoFilter implements ExceptionFilter {
    catch(exception: AutoNoEncontrado, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.NOT_FOUND).json(exception.getResponse());
    }
}
