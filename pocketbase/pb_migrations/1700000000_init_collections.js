migrate((db) => {
  const dao = new Dao(db);

  // 1. Profiles Collection
  const profilesCollection = new Collection({
    id: "profiles_collection0",
    name: "profiles",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "prof_user_id",
        name: "user_id",
        type: "relation",
        required: true,
        presentable: false,
        unique: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "prof_brand_name",
        name: "brand_name",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "prof_colors",
        name: "colors",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: { maxSize: 2000000 }
      },
      {
        system: false,
        id: "prof_typography",
        name: "typography",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: { maxSize: 2000000 }
      },
      {
        system: false,
        id: "prof_socials",
        name: "social_handles",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: { maxSize: 2000000 }
      }
    ],
    indexes: [],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id = user_id",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id",
    options: {}
  });

  dao.saveCollection(profilesCollection);

  // 2. Carousels Collection
  const carouselsCollection = new Collection({
    id: "carousels_collection",
    name: "carousels",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "caro_user_id",
        name: "user_id",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "caro_title",
        name: "title",
        type: "text",
        required: true,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "caro_slides",
        name: "slides_data",
        type: "json",
        required: true,
        presentable: false,
        unique: false,
        options: { maxSize: 2000000 }
      },
      {
        system: false,
        id: "caro_status",
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        unique: false,
        options: { maxSelect: 1, values: ["draft", "completed"] }
      }
    ],
    indexes: [],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id = user_id",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id",
    options: {}
  });

  dao.saveCollection(carouselsCollection);

  // 3. API Keys Collection
  const apiKeysCollection = new Collection({
    id: "apikeys_collection_0",
    name: "api_keys",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "api_user_id",
        name: "user_id",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "api_provider",
        name: "provider",
        type: "text",
        required: true,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "api_key_enc",
        name: "encrypted_key",
        type: "text",
        required: true,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      }
    ],
    indexes: [],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id = user_id",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id",
    options: {}
  });

  dao.saveCollection(apiKeysCollection);

}, (db) => {
  const dao = new Dao(db);
  try { dao.deleteCollection(dao.findCollectionByNameOrId("profiles")); } catch (_) {}
  try { dao.deleteCollection(dao.findCollectionByNameOrId("carousels")); } catch (_) {}
  try { dao.deleteCollection(dao.findCollectionByNameOrId("api_keys")); } catch (_) {}
});
