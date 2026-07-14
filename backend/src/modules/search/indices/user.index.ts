import { ElasticsearchService } from '@nestjs/elasticsearch';
import { USER_SEARCH_INDEX } from '@app/modules/users/user-search.document';

export async function createUserIndex(
  elasticsearchService: ElasticsearchService,
) {
  const exists = await elasticsearchService.indices.exists({
    index: USER_SEARCH_INDEX,
  });

  if (exists) {
    return;
  }

  await elasticsearchService.indices.create({
    index: USER_SEARCH_INDEX,

    settings: {
      max_ngram_diff: 18,

      analysis: {
        filter: {
          name_ngram_filter: {
            type: 'ngram',
            min_gram: 2,
            max_gram: 20,
          },
        },

        analyzer: {
          name_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'asciifolding', 'name_ngram_filter'],
          },
        },
      },
    },

    mappings: {
      properties: {
        id: {
          type: 'keyword',
        },

        name: {
          type: 'text',
          analyzer: 'name_analyzer',
        },

        email: {
          type: 'text',
          analyzer: 'name_analyzer',
        },

        role: {
          type: 'keyword',
        },

        isActive: {
          type: 'boolean',
        },
      },
    },
  });

  console.log('✅ User index created');
}
