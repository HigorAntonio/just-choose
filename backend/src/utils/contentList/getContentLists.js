const knex = require('../../database');
const getTimeWindowStartTime = require('../getTimeWindowStartTime');

module.exports = async (options) => {
  const {
    userId,
    getPrivate = false,
    followersIds = [],
    followingIds,
    pageSize,
    page,
    query,
    sortBy,
    timeWindowUnit,
  } = options;

  if (getPrivate && !userId) {
    throw new Error('Can not get private data without a valid user id');
  }

  try {
    const contentListsQuery = knex
      .select(
        'clsq.id',
        'clsq.user_id',
        'clsq.user_name',
        'clsq.profile_image_url',
        'clsq.title',
        'clsq.description',
        'clsq.sharing_option',
        'clsq.thumbnail',
        'content_types',
        knex.raw('COALESCE(likes, 0) AS likes'),
        knex.raw('COALESCE(forks, 0) AS forks'),
        'clsq.created_at',
        'clsq.updated_at'
      )
      .from(function () {
        this.select(
          'cl.id',
          'cl.user_id',
          'u.name as user_name',
          'u.profile_image_url',
          'cl.title',
          'cl.description',
          'cl.sharing_option',
          'cl.thumbnail',
          'cl.created_at',
          'cl.updated_at',
          'cl.document'
        )
          .from('content_lists as cl')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'cl.user_id', 'u.id')
          .union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'u.profile_image_url',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at',
              'cl.document'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .whereIn('u.id', followersIds);
          })
          .as('clsq');
        if (getPrivate) {
          this.union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'u.profile_image_url',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at',
              'cl.document'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'private' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .where({ 'u.id': userId });
          });
        }
      })
      .leftJoin(
        knex
          .select(
            'content_list_id as list_id',
            knex.raw('ARRAY_AGG(ct.name) AS content_types')
          )
          .from('content_list_types')
          .innerJoin('content_types as ct', 'content_type_id', 'ct.id')
          .groupBy('list_id')
          .as('clt'),
        'clt.list_id',
        'clsq.id'
      )
      .leftJoin(
        knex
          .select('content_list_id as list_id', knex.raw('COUNT(*) AS likes'))
          .from('content_list_likes')
          .groupBy('list_id')
          .as('cll'),
        'cll.list_id',
        'clsq.id'
      )
      .leftJoin(
        knex
          .select('original_list_id as list_id', knex.raw('COUNT(*) AS forks'))
          .from('content_list_forks')
          .groupBy('list_id')
          .as('clf'),
        'clf.list_id',
        'clsq.id'
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (sortBy) {
      contentListsQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from(function () {
      this.select()
        .from(function () {
          this.select('cl.id', 'cl.user_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'public' })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.user_id', followersIds);
        })
        .as('count_query');
      if (getPrivate) {
        this.union(function () {
          this.select('cl.id', 'cl.user_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'private' })
            .where('cl.user_id', userId);
        });
      }
    });

    if (followingIds) {
      contentListsQuery.whereIn('user_id', followingIds);
      countObj.whereIn('user_id', followingIds);
    }

    if (userId) {
      contentListsQuery.where({ user_id: userId });
      countObj.where({ user_id: userId });
    }

    if (query) {
      contentListsQuery.where(
        knex.raw('document @@ content_lists_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('document @@ content_lists_plainto_tsquery(:query)', { query })
      );
    }

    if (timeWindowUnit) {
      const startTime = getTimeWindowStartTime(timeWindowUnit);
      contentListsQuery.where('created_at', '>=', startTime);
      countObj.where('created_at', '>=', startTime);
    }

    const contentLists = (await contentListsQuery).map((c) => {
      c.likes = parseInt(c.likes);
      c.forks = parseInt(c.forks);
      return c;
    });
    const [{ count }] = await countObj;

    return { contentLists, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
