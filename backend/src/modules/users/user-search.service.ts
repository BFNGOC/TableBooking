import { Injectable } from '@nestjs/common';

import {
  USER_SEARCH_INDEX,
  UserSearchDocument,
  toUserSearchDocument,
} from './user-search.document';

import { UserDocument } from './schemas/user.schema';

import { SearchService } from '../search/elasticsearch.service';

@Injectable()
export class UserSearchService {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Mongo -> Elasticsearch
   */
  async index(user: UserDocument) {
    return this.searchService.indexDocument(
      USER_SEARCH_INDEX,
      user.id,
      toUserSearchDocument(user),
    );
  }

  /**
   * Update document
   */
  async update(user: UserDocument) {
    return this.searchService.updateDocument(
      USER_SEARCH_INDEX,
      user.id,
      toUserSearchDocument(user),
    );
  }

  /**
   * Delete document
   */
  async delete(id: string) {
    return this.searchService.deleteDocument(USER_SEARCH_INDEX, id);
  }

  /**
   * Search User
   */
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

    return this.searchService.search<UserSearchDocument>(
      USER_SEARCH_INDEX,

      {
        keyword,

        fields: ['name', 'email'],

        filter: options?.filter,

        from: (page - 1) * size,

        size,
      },
    );
  }
}
