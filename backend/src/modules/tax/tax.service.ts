import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TaxCompanyResponse } from './type/tax-company-response-type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaxService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCompanyByTaxCode(taxCode: string): Promise<TaxCompanyResponse> {
    try {
      const url = `${this.configService.get<string>(
        'BUSINESS_API_URL',
      )}/${taxCode}`;

      const { data } = await firstValueFrom(
        this.httpService.get<TaxCompanyResponse>(url),
      );

      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 404) {
          throw new NotFoundException(
            'Không tìm thấy doanh nghiệp với mã số thuế này',
          );
        }
      }

      throw new ServiceUnavailableException(
        'Không thể kết nối đến hệ thống tra cứu mã số thuế',
      );
    }
  }
}
