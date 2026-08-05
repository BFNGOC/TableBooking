import { RESTAURANT_BOOKING_SEARCH_INDEX } from '@app/modules/bookings/booking-restaurant-search.document';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export async function createRestaurantBookingIndex(
  elasticsearchService: ElasticsearchService,
) {
  const exists = await elasticsearchService.indices.exists({
    index: RESTAURANT_BOOKING_SEARCH_INDEX,
  });

  if (exists) {
    return;
  }

  await elasticsearchService.indices.create({
    index: RESTAURANT_BOOKING_SEARCH_INDEX,

    settings: {
      max_ngram_diff: 18,

      analysis: {
        filter: {
          booking_ngram_filter: {
            type: 'ngram',

            min_gram: 2,

            max_gram: 20,
          },
        },

        analyzer: {
          booking_index_analyzer: {
            type: 'custom',

            tokenizer: 'standard',

            filter: ['lowercase', 'asciifolding', 'booking_ngram_filter'],
          },

          booking_search_analyzer: {
            type: 'custom',

            tokenizer: 'standard',

            filter: ['lowercase', 'asciifolding'],
          },
        },
      },
    },

    mappings: {
      properties: {
        restaurantId: {
          type: 'keyword',
        },

        userId: {
          type: 'keyword',
        },

        contactName: {
          type: 'text',

          analyzer: 'booking_index_analyzer',

          search_analyzer: 'booking_search_analyzer',
        },

        contactPhone: {
          type: 'keyword',
        },

        guestCount: {
          type: 'integer',
        },

        status: {
          type: 'keyword',
        },

        bookingDate: {
          type: 'date',
        },

        startTime: {
          type: 'keyword',
        },

        endTime: {
          type: 'keyword',
        },

        paymentStatus: {
          type: 'keyword',
        },

        depositAmount: {
          type: 'double',
        },

        depositStatus: {
          type: 'keyword',
        },

        finalPrice: {
          type: 'double',
        },

        createdAt: {
          type: 'date',
        },

        updatedAt: {
          type: 'date',
        },
      },
    },
  });

  console.log('✅ Restaurant Booking index created');
}
