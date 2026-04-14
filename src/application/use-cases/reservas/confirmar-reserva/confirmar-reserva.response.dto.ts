import { ApiProperty } from '@nestjs/swagger';
import { EstadoReserva } from '../../../../domain/entities/reserva.entity';

export class ConfirmarReservaResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    autoId: string;

    @ApiProperty()
    clienteId: string;

    @ApiProperty()
    fechaInicio: Date;

    @ApiProperty()
    fechaFin: Date;

    @ApiProperty()
    estado: EstadoReserva;

    @ApiProperty()
    precioTotal: number;

    @ApiProperty()
    updatedAt: Date;

    constructor(props: {
        id: string;
        autoId: string;
        clienteId: string;
        fechaInicio: Date;
        fechaFin: Date;
        estado: EstadoReserva;
        precioTotal: number;
        updatedAt: Date;
    }) {
        this.id = props.id;
        this.autoId = props.autoId;
        this.clienteId = props.clienteId;
        this.fechaInicio = props.fechaInicio;
        this.fechaFin = props.fechaFin;
        this.estado = props.estado;
        this.precioTotal = props.precioTotal;
        this.updatedAt = props.updatedAt;
    }
}