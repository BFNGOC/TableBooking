import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TaxService } from './tax.service';

@Module({
  imports: [HttpModule],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
