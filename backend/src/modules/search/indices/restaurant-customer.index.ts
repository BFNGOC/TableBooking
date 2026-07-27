import { RESTAURANT_CUSTOMER_SEARCH_INDEX } from '@app/modules/restaurants/restaurant-customer-search.document';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export async function createRestaurantCustomerIndex(
  elasticsearchService: ElasticsearchService,
) {
  const exists = await elasticsearchService.indices.exists({
    index: RESTAURANT_CUSTOMER_SEARCH_INDEX,
  });

  if (exists) {
    return;
  }

  await elasticsearchService.indices.create({
    index: RESTAURANT_CUSTOMER_SEARCH_INDEX,

    settings: {
      max_ngram_diff: 18,

      analysis: {
        filter: {
          restaurant_ngram_filter: {
            type: 'ngram',
            min_gram: 2,
            max_gram: 20,
          },
        },

        analyzer: {
          restaurant_index_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'asciifolding', 'restaurant_ngram_filter'],
          },

          restaurant_search_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'asciifolding'],
          },
        },
      },
    },

    mappings: {
      properties: {
        restaurantName: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        address: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        cuisineTypes: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        rating: {
          type: 'float',
        },

        priceFrom: {
          type: 'integer',
        },

        priceTo: {
          type: 'integer',
        },

        capacity: {
          type: 'integer',
        },

        status: {
          type: 'keyword',
        },

        isAcceptingBookings: {
          type: 'boolean',
        },
      },
    },
  });

  console.log('✅ Restaurant Customer index created');
}
