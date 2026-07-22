/* eslint-disable */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchOptions } from './interfaces/search-options.interface';
import { SearchResult } from './interfaces/search-result.interface';
import { SEARCH_INDICES } from './indices';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    try {
      await this.elasticsearchService.ping();

      this.logger.log('✅ Connected to Elasticsearch');

      for (const createIndex of SEARCH_INDICES) {
        await createIndex(this.elasticsearchService);
      }
    } catch (error) {
      this.logger.warn('⚠️ Elasticsearch is not available', error);
    }
  }

  async indexDocument<T extends object>(
    index: string,
    id: string,
    document: T,
  ): Promise<boolean> {
    try {
      await this.elasticsearchService.index({
        index,
        id,
        document,
        refresh: 'wait_for',
      });

      return true;
    } catch (error) {
      this.logger.warn(`Cannot index document into ${index}`, error);
      return false;
    }
  }

  async updateDocument<T extends object>(
    index: string,
    id: string,
    document: T,
  ): Promise<boolean> {
    try {
      await this.elasticsearchService.update({
        index,
        id,
        doc: document,
        refresh: 'wait_for',
      });

      return true;
    } catch (error) {
      this.logger.warn(`Cannot update document in ${index}`, error);
      return false;
    }
  }

  async deleteDocument(index: string, id: string): Promise<boolean> {
    try {
      await this.elasticsearchService.delete({
        index,
        id,
        refresh: 'wait_for',
      });

      return true;
    } catch (error) {
      this.logger.warn(`Cannot delete document from ${index}`, error);
      return false;
    }
  }

  async search<T extends object>(
    index: string,
    options: SearchOptions,
  ): Promise<SearchResult<T>> {
    try {
      const response: any = await this.elasticsearchService.search({
        index,
        from: options.from ?? 0,
        size: options.size ?? 10,
        query: this.buildQuery(options),
        sort: this.buildSort(options.sort),
      } as any);

      const data = (response.hits.hits ?? []).map((item: any) => ({
        _id: item._id,
        ...item._source,
      })) as T[];

      return {
        data,
        totalItems:
          typeof response.hits.total === 'number'
            ? response.hits.total
            : (response.hits.total?.value ?? 0),
      };
    } catch (error) {
      this.logger.warn(`Search failed for ${index}`, error);

      return {
        data: [],
        totalItems: 0,
      };
    }
  }

  private buildQuery(options: SearchOptions): any {
    const filter = this.buildFilter(options.filter);

    if (!options.keyword?.trim()) {
      return {
        bool: {
          filter,
        },
      };
    }

    return {
      bool: {
        must: [
          {
            multi_match: {
              query: options.keyword,

              fields: options.fields,

              fuzziness: 'AUTO',
            },
          },
        ],

        filter,
      },
    };
  }

  private buildFilter(filter?: Record<string, unknown>): any[] {
    if (!filter) {
      return [];
    }

    const filters: any[] = [];

    Object.entries(filter).forEach(([field, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      // date range
      if (field === 'fromDate' || field === 'toDate') {
        return;
      }

      filters.push({
        term: {
          [field]: value,
        },
      });
    });

    if (filter.fromDate || filter.toDate) {
      const range: any = {};

      if (filter.fromDate) {
        range.gte = filter.fromDate;
      }

      if (filter.toDate) {
        range.lte = filter.toDate;
      }

      filters.push({
        range: {
          onboardingRequestedAt: range,
        },
      });
    }

    return filters;
  }

  private buildSort(sort?: SearchOptions['sort']): any[] | undefined {
    if (!sort?.length) {
      return undefined;
    }

    return sort.map((item) => ({
      [item.field]: {
        order: item.order,
      },
    }));
  }
}
