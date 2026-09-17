import { Injectable } from '@nestjs/common';

import {
  RESTAURANT_ADMIN_SEARCH_INDEX,
  RestaurantAdminSearchDocument,
  toRestaurantAdminSearchDocument,
} from './restaurant-admin-search.document';

import {
  RestaurantDocument,
  RestaurantStatus,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';

import { SearchService } from '../search/elasticsearch.service';
import { SearchSort } from '../search/interfaces/search-options.interface';

@Injectable()
export class RestaurantSearchService {
  constructor(private readonly searchService: SearchService) {}

  async index(restaurant: RestaurantDocument) {
    return this.searchService.indexDocument(
      RESTAURANT_ADMIN_SEARCH_INDEX,
      restaurant._id.toString(),
      toRestaurantAdminSearchDocument(restaurant),
    );
  }

  async update(restaurant: RestaurantDocument) {
    return this.searchService.updateDocument(
      RESTAURANT_ADMIN_SEARCH_INDEX,
      restaurant._id.toString(),
      toRestaurantAdminSearchDocument(restaurant),
    );
  }

  async delete(id: string) {
    return this.searchService.deleteDocument(RESTAURANT_ADMIN_SEARCH_INDEX, id);
  }

  async search(options: {
    keyword?: string;

    currentPage: number;

    pageSize: number;

    filter?: {
      restaurantCode?: string;

      status?: RestaurantStatus;

      verifyStatus?: RestaurantVerifyStatus;

      taxCode?: string;

      fromDate?: string;

      toDate?: string;
    };
    sort?: SearchSort[];
  }) {
    const { keyword, currentPage, pageSize, filter, sort } = options;

    return this.searchService.search<RestaurantAdminSearchDocument>(
      RESTAURANT_ADMIN_SEARCH_INDEX,
      {
        keyword,

        fields: ['restaurantName', 'representativeName', 'address'],

        filter,

        sort,

        from: (currentPage - 1) * pageSize,

        size: pageSize,
      },
    );
  }
}
