import { PartialType } from '@nestjs/swagger';
import { CreateTableAvailabilityDto } from './create-table-availability.dto';

export class UpdateTableAvailabilityDto extends PartialType(CreateTableAvailabilityDto) {}
