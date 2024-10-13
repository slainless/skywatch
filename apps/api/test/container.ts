import {
  type AMQPChannel,
  AMQPClient,
  type AMQPQueue,
} from "@cloudamqp/amqp-client";
import { MongoKV } from "@skywatch/persistence/mongo-kv";
import { RedisKV } from "@skywatch/persistence/redis-kv";
import { BunContainerOrchestrator, Spawner } from "@skywatch/spawn/container";
import { type Collection, MongoClient } from "mongodb";
import { type RedisClientType, createClient } from "redis";

export const Mongo = () =>
  new BunContainerOrchestrator<{
    client: MongoClient;
    kv: MongoKV;
    key: string;
    collection: Collection;
  }>(Spawner.MongoDB, "skywatch.api.test.mongo")
    .onStart(async (vars) => {
      vars.key = "key";
      vars.client = await new MongoClient("mongodb://localhost:27017");

      vars.collection = vars.client.db("test").collection("kv");
      await vars.collection.createIndex(vars.key, { unique: true });

      vars.kv = new MongoKV(vars.client, vars.collection, {
        idField: vars.key,
      });
    })
    .onStop(async (vars) => {
      await vars.client.close();
    });

export const Redis = () =>
  new BunContainerOrchestrator<{
    client: RedisClientType;
    kv: RedisKV;
  }>(Spawner.Redis, "skywatch.api.test.redis")
    .onStart(async (vars) => {
      vars.client = createClient();
      await vars.client.connect();

      vars.kv = new RedisKV(vars.client);
    })
    .onStop(async (vars) => {
      await vars.client.flushAll();
      await vars.client.disconnect();
    });

export const RabbitMQ = () =>
  new BunContainerOrchestrator<{
    client: AMQPClient;
    emailQueue: AMQPQueue;
    channel: AMQPChannel;
  }>(Spawner.RabbitMQ.bind(null, "mq"), "skywatch.api.test.mq")
    .onStart(async (vars) => {
      vars.client = new AMQPClient("amqp://localhost");
      await vars.client.connect();
      vars.channel = await vars.client.channel();
      vars.emailQueue = await vars.channel.queue("email_queue");
    })
    .onStop(async (vars) => {
      await vars.channel.close();
      await vars.client.close();
    });

export const MailHog = () =>
  new BunContainerOrchestrator(Spawner.Mailhog, "skywatch.api.test.mailhog");
