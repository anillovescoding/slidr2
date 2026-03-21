migrate((db) => {
  const dao = new Dao(db);

  const sharesCollection = new Collection({
    id: "shares_collection_1",
    name: "shares",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "share_carousel_id",
        name: "carousel_id",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "carousels_collection",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      }
    ],
    indexes: [],
    // Owner can create/delete, but anyone (including unauthenticated) can view
    listRule: null,
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: null,
    deleteRule: "@request.auth.id = carousel_id.user_id",
    options: {}
  });

  dao.saveCollection(sharesCollection);

}, (db) => {
  const dao = new Dao(db);
  try { dao.deleteCollection(dao.findCollectionByNameOrId("shares")); } catch (_) {}
});
