import pino, { type Logger } from "pino";
import { createConfig } from "../misc/config";
import { createClient } from "redis";
import { MongoClient } from "mongodb";
import { AMQPClient } from "@cloudamqp/amqp-client";
import { createEmailPusher } from "@skywatch/email/pusher";
import { RedisKVWithTTL } from "@skywatch/persistence/redis-kv";
import { MongoKV } from "@skywatch/persistence/mongo-kv";
import { WeatherRepository } from "../repository/weather";
import { LazyLoadPersistence } from "@skywatch/persistence/lazy-load";
import { CacheMetadataRepository } from "../repository/cache-metadata";
import { EventService } from "../service/event";
import { WeatherService } from "../service/weather";
import { OpenMeteoProvider } from "@skywatch/weather/openmeteo";

export async function bootstrap(logger: Logger) {
  logger.info("Creating clients...");
  const config = createConfig();
  const client = {
    metadataRedis: createClient({
      url: config["server.metadata_cache.url"],
    }),
    weatherRedis: createClient({
      url: config["server.metadata_cache.prefix"],
    }),
    weatherMongo: new MongoClient(config["server.persist.storage.url"]),
    eventMQ: new AMQPClient(config["server.event.mq_url"]),
  };

  logger.info("Connecting to clients...");
  await Promise.all([
    client.metadataRedis
      .connect()
      .then(() => logger.debug("Cache metadata connected")),
    client.weatherRedis
      .connect()
      .then(() => logger.debug("Persistence cache connected")),
    client.weatherMongo.connect().then(() => "Persistence storage connected"),
    client.eventMQ.connect().then(() => "Event MQ connected"),
  ]);

  logger.info("Component initialization...");
  const [storageCollection, eventChannel] = await Promise.all([
    (async () => {
      const collection = client.weatherMongo
        .db(config["server.persist.storage.db_name"])
        .collection(config["server.persist.storage.collection_name"]);

      await collection.createIndex(config["server.persist.storage.id_field"], {
        unique: true,
      });

      logger.debug("Persistence collection initialized");

      return collection;
    })(),
    client.eventMQ.channel().then((channel) => {
      logger.debug("Event MQ channel initialized");
      return channel;
    }),
  ]);

  logger.info("Email pusher initialization...");
  const pusher = await createEmailPusher(
    eventChannel,
    config["server.email.sender"],
  );
  logger.debug("Email pusher initialized");

  const kv = {
    metadata: new RedisKVWithTTL(client.metadataRedis, {
      ttlSeconds: 1200,
    }),
    cache: new RedisKVWithTTL(client.weatherRedis, {
      ttlSeconds: 1200,
    }),
    storage: new MongoKV(client.weatherMongo, storageCollection, {
      idField: config["server.persist.storage.id_field"],
    }),
  };

  const persistence = new LazyLoadPersistence(kv.cache, kv.storage);
  const repo = {
    weather: new WeatherRepository(persistence),
    metadata: new CacheMetadataRepository(kv.metadata),
  };
  const event = new EventService(pusher);
  const provider = new OpenMeteoProvider();
  const service = new WeatherService(repo.weather, event, provider);

  return {
    logger,
    client,
    config,
    collection: {
      weather: storageCollection,
    },
    channel: eventChannel,
    pusher,
    kv,
    persistence,
    repository: repo,
    event,
    provider,
    service,
  };
}
