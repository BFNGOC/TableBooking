import { RESTAURANT_ADMIN_SEARCH_INDEX } from '@app/modules/restaurants/restaurant-admin-search.document';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export async function createRestaurantAdminIndex(
  elasticsearchService: ElasticsearchService,
) {
  const exists = await elasticsearchService.indices.exists({
    index: RESTAURANT_ADMIN_SEARCH_INDEX,
  });

  if (exists) {
    return;
  }

  await elasticsearchService.indices.create({
    index: RESTAURANT_ADMIN_SEARCH_INDEX,

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
        id: {
          type: 'keyword',
        },

        restaurantName: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        restaurantCode: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        representativeName: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        email: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        taxCode: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        address: {
          type: 'text',
          analyzer: 'restaurant_index_analyzer',
          search_analyzer: 'restaurant_search_analyzer',
        },

        status: {
          type: 'keyword',
        },

        verifyStatus: {
          type: 'keyword',
        },
      },
    },
  });

  console.log('✅ Restaurant Admin index created');
}
