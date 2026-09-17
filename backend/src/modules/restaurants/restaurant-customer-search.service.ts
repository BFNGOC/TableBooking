import { Injectable } from '@nestjs/common';

import {
  RESTAURANT_CUSTOMER_SEARCH_INDEX,
  RestaurantCustomerSearchDocument,
  toRestaurantCustomerSearchDocument,
} from './restaurant-customer-search.document';

import {
  RestaurantDocument,
  RestaurantStatus,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';

import { SearchService } from '../search/elasticsearch.service';
import { SearchSort } from '../search/interfaces/search-options.interface';

@Injectable()
export class RestaurantCustomerSearchService {
  constructor(private readonly searchService: SearchService) {}

  async index(restaurant: RestaurantDocument) {
    return this.searchService.indexDocument(
      RESTAURANT_CUSTOMER_SEARCH_INDEX,
      restaurant._id.toString(),
      toRestaurantCustomerSearchDocument(restaurant),
    );
  }

  async update(restaurant: RestaurantDocument) {
    return this.searchService.updateDocument(
      RESTAURANT_CUSTOMER_SEARCH_INDEX,
      restaurant._id.toString(),
      toRestaurantCustomerSearchDocument(restaurant),
    );
  }

  async delete(id: string) {
    return this.searchService.deleteDocument(
      RESTAURANT_CUSTOMER_SEARCH_INDEX,
      id,
    );
  }

  async search(options: {
    keyword?: string;

    currentPage: number;

    pageSize: number;

    filter?: {
      status?: RestaurantStatus;

      verifyStatus?: RestaurantVerifyStatus;

      isAcceptingBookings?: boolean;

      cuisineTypes?: string[];

      priceFrom?: number;

      priceTo?: number;

      capacity?: number;

      rating?: number;
    };

    sort?: SearchSort[];
  }) {
    const { keyword, currentPage, pageSize, filter, sort } = options;

    return this.searchService.search<RestaurantCustomerSearchDocument>(
      RESTAURANT_CUSTOMER_SEARCH_INDEX,
      {
        keyword,

        fields: ['restaurantName', 'address', 'cuisineTypes'],

        filter: {
          ...filter,
          verifyStatus: RestaurantVerifyStatus.APPROVED,
        },
        sort,

        from: (currentPage - 1) * pageSize,

        size: pageSize,
      },
    );
  }
}
