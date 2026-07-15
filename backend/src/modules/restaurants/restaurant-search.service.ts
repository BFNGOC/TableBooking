import { Injectable } from '@nestjs/common';
import {
  RestaurantAdminSearchDocument,
  toRestaurantAdminSearchDocument,
} from './restaurant-admin-search.document';
import { RestaurantDocument } from './schemas/restaurant.schema';
import { SearchService } from '../search/elasticsearch.service';
import { RESTAURANT_SEARCH_INDEX } from './constants/restaurant.constants';

@Injectable()
export class RestaurantSearchService {
  constructor(private readonly searchService: SearchService) {}

  async index(restaurant: RestaurantDocument) {
    return this.searchService.indexDocument(
      RESTAURANT_SEARCH_INDEX,
      restaurant.id,
      toRestaurantAdminSearchDocument(restaurant),
    );
  }

  async update(restaurant: RestaurantDocument) {
    return this.searchService.updateDocument(
      RESTAURANT_SEARCH_INDEX,
      restaurant.id,
      toRestaurantAdminSearchDocument(restaurant),
    );
  }

  async delete(id: string) {
    return this.searchService.deleteDocument(RESTAURANT_SEARCH_INDEX, id);
  }

  async search(
    keyword: string,
    options?: {
      currentPage?: number;
      pageSize?: number;
      filter?: Record<string, unknown>;
    },
  ) {
    const page = options?.currentPage ?? 1;
    const size = options?.pageSize ?? 10;

    return this.searchService.search<RestaurantAdminSearchDocument>(
      RESTAURANT_SEARCH_INDEX,
      {
        keyword,
        fields: [
          'restaurantName',
          'restaurantCode',
          'slug',
          'cuisineTypes',
          'address',
          'representativeName',
          'email',
          'description',
        ],
        filter: options?.filter,
        from: (page - 1) * size,
        size,
      },
    );
  }
}
