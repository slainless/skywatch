import { Env } from "@skywatch/common";

// biome-ignore format: table view
export function createConfig() {
  return {
    'server.port': Env.positiveInt("API_SERVER_PORT", 7777),
    'server.event.mq_url': Env.string("API_EMAIL_MQ_URL", "amqp://localhost"),
    'server.email.sender': Env.string("API_EMAIL_SENDER", "noreply@localhost"),

    'server.persist.storage.url': Env.string("API_STORAGE_MONGO_URL", "mongodb://localhost:27017"),
    'server.persist.storage.db_name': Env.string("API_STORAGE_MONGO_DB_NAME", "skywatch"),
    'server.persist.storage.collection_name': Env.string("API_STORAGE_MONGO_COLLECTION_NAME", "weather_data"),
    'server.persist.storage.id_field': Env.string("API_STORAGE_MONGO_INDEX_FIELD_NAME", "point"),
    
    'server.persist.cache.url': Env.string("API_CACHE_REDIS_URL", "redis://127.0.0.1:6379/0"),
    'server.persist.cache.prefix': Env.string("API_CACHE_REDIS_PREFIX", "weather_data:"),

    'server.metadata_cache.url': Env.string("API_METADATA_CACHE_REDIS_URL", "redis://127.0.0.1:6379/0"),
    'server.metadata_cache.prefix': Env.string("API_METADATA_CACHE_REDIS_PREFIX", "metadata:"),
  };
}
