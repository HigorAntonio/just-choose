const knex = require('../../database');
const getTimeWindowStartTime = require('../getTimeWindowStartTime');

module.exports = async (options) => {
  const {
    profileId,
    getPrivate = false,
    followersIds = [],
    followingIds,
    pageSize,
    page,
    query,
    sortBy,
    timeWindowUnit,
  } = options;

  if (getPrivate && !profileId) {
    throw new Error('Can not get private data without a valid profile id');
  }

  try {
    const contentListsQuery = knex
      .select(
        'clsq.id',
        'clsq.profile_id',
        'clsq.profile_name',
        'clsq.profile_display_name',
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
          'cl.profile_id',
          'p.name as profile_name',
          'p.display_name as profile_display_name',
          'p.profile_image_url',
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
          .innerJoin('profiles as p', 'cl.profile_id', 'p.id')
          .union(function () {
            this.select(
              'cl.id',
              'cl.profile_id',
              'p.name as profile_name',
              'p.display_name as profile_display_name',
              'p.profile_image_url',
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
              .innerJoin('profiles as p', 'cl.profile_id', 'p.id')
              .whereIn('p.id', followersIds);
          })
          .as('clsq');
        if (getPrivate) {
          this.union(function () {
            this.select(
              'cl.id',
              'cl.profile_id',
              'p.name as profile_name',
              'p.display_name as profile_display_name',
              'p.profile_image_url',
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
              .innerJoin('profiles as p', 'cl.profile_id', 'p.id')
              .where({ 'p.id': profileId });
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
          this.select('cl.id', 'cl.profile_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'public' })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.profile_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.profile_id', followersIds);
        })
        .as('count_query');
      if (getPrivate) {
        this.union(function () {
          this.select('cl.id', 'cl.profile_id', 'cl.document', 'cl.created_at')
            .from('content_lists as cl')
            .where({ sharing_option: 'private' })
            .where('cl.profile_id', profileId);
        });
      }
    });

    if (followingIds) {
      contentListsQuery.whereIn('profile_id', followingIds);
      countObj.whereIn('profile_id', followingIds);
    }

    if (profileId) {
      contentListsQuery.where({ profile_id: profileId });
      countObj.where({ profile_id: profileId });
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
