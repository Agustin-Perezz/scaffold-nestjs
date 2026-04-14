import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {IActualizarAutoRepository} from './actualizar-auto.repository.interface';
import {ActualizarAutoRequestDto} from './actualizar-auto.request.dto';
import {ActualizarAutoResponseDto} from './actualizar-auto.response.dto';

@Injectable()
export class ActualizarAutoUseCase {
    constructor(
        @Inject('IActualizarAutoRepository')
        private readonly repository: IActualizarAutoRepository,
    ) {
    }

    async execute(id: string, dto: ActualizarAutoRequestDto): Promise<ActualizarAutoResponseDto> {
        const auto = await this.repository.obtenerPorId(id);
        if (!auto) {
            throw new NotFoundException('Auto no encontrado');
        }

        if (dto.patente) {
            const existePatente = await this.repository.existePorPatente(dto.patente, id);
            if (existePatente) {
                throw new BadRequestException('Ya existe un auto con esa patente');
            }
        }

        if (dto.marca !== undefined || dto.modelo !== undefined) {
            auto.actualizarMarcaYModelo(
                dto.marca ?? auto.marca,
                dto.modelo ?? auto.modelo,
            );
        }
        if (dto.anio !== undefined) {
            auto.actualizarAnio(dto.anio);
        }
        if (dto.patente !== undefined) {
            (auto as any)._patente = dto.patente;
            (auto as any)._updatedAt = new Date();
        }
        if (dto.precioPorHora !== undefined) {
            auto.actualizarPrecio(dto.precioPorHora);
        }
        if (dto.disponible !== undefined) {
            if (dto.disponible) {
                auto.activar();
            } else {
                auto.desactivar();
            }
        }

        const autoActualizado = await this.repository.guardar(auto);

        return new ActualizarAutoResponseDto({
            id: autoActualizado.id,
            marca: autoActualizado.marca,
            modelo: autoActualizado.modelo,
            anio: autoActualizado.anio,
            patente: autoActualizado.patente,
            precioPorHora: autoActualizado.precioPorHora,
            disponible: autoActualizado.disponible,
            createdAt: autoActualizado.createdAt,
            updatedAt: autoActualizado.updatedAt,
        });
    }
}
