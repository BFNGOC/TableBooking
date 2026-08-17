import { Injectable } from '@nestjs/common';

import {
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from './schemas/booking.schema';

import { SearchService } from '../search/elasticsearch.service';

import { SearchSort } from '../search/interfaces/search-options.interface';
import {
  RESTAURANT_BOOKING_SEARCH_INDEX,
  RestaurantBookingSearchDocument,
  toRestaurantBookingSearchDocument,
} from './booking-restaurant-search.document';

@Injectable()
export class RestaurantBookingSearchService {
  constructor(private readonly searchService: SearchService) {}

  async index(booking: BookingDocument) {
    return this.searchService.indexDocument(
      RESTAURANT_BOOKING_SEARCH_INDEX,

      booking._id.toString(),

      toRestaurantBookingSearchDocument(booking),
    );
  }

  async update(booking: BookingDocument) {
    return this.searchService.updateDocument(
      RESTAURANT_BOOKING_SEARCH_INDEX,

      booking._id.toString(),

      toRestaurantBookingSearchDocument(booking),
    );
  }

  async delete(id: string) {
    return this.searchService.deleteDocument(
      RESTAURANT_BOOKING_SEARCH_INDEX,
      id,
    );
  }

  async search(options: {
    restaurantId: string;

    keyword?: string;

    currentPage: number;

    pageSize: number;

    filter?: {
      status?: BookingStatus;

      paymentStatus?: PaymentStatus;

      depositStatus?: DepositStatus;

      fromDate?: string;

      toDate?: string;
    };

    sort?: SearchSort[];
  }) {
    const { restaurantId, keyword, currentPage, pageSize, filter, sort } =
      options;

    return this.searchService.search<RestaurantBookingSearchDocument>(
      RESTAURANT_BOOKING_SEARCH_INDEX,
      {
        keyword,

        fields: ['contactName', 'contactPhone'],

        filter: {
          restaurantId,

          ...filter,
        },

        sort,

        from: (currentPage - 1) * pageSize,

        size: pageSize,
      },
    );
  }
}
