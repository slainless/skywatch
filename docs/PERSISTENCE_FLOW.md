# Persistence Flow

## Participants

- `front`: Frontend server, user-facing service
- `api`: The core/main server which will handle weather request from "front". This participant is capable of fetching new weather data from "weather", sending email event to "broker", and requesting data from "persistence".
- `persistence`: The persistence layer of the system. Manage data persistence and caching of the system.
- `cache`: Caching client. Provides KV interface.
- `database`: Database client. Provides KV interface.
- `weather`: Remote service providing weather API
- `broker`: MQ client.

## Overview

The system adopts *lazy-loaded* caching strategy and "*stale-while-revalidate*" (SWR) strategy. 
Whenever a request came in and data is available in database (or cache), the data should be returned to the client immediately. 
If the data is deemed stale or outdated, system should make use of SWR mechanism to incrementally deliver data: 
  
  - Attaching short interval SWR cache control to stale data.
  - Delivering the stale data and then fetching new data from remote resource in background. 
  - Client that receive the stale response should render the response while attempting revalidation as early as possible to refresh their data.

Data renewal should be handled by main service while cache renewal should be handled by persistence layer. Main service requires no knowledge of the underlying persistence system outside of the provided interface.

## Flow

### Cache hit (fresh)

```mermaid
sequenceDiagram
  front->>+api: Requesting weather

  api->>+persistence: Get weather

  persistence-->>+cache: Check cache
  cache-->cache: Checking weather data
  cache-->>-persistence: Cached weather

  persistence-->>-api: Weather found

  api-->>-front: Returning weather
```

### Cache hit (stale)

```mermaid
sequenceDiagram
  front->>+api: Requesting weather

  api->>+persistence: Get weather

  persistence-->>+cache: Check cache
  cache-->cache: Checking weather data
  cache-->>-persistence: Cached weather

  persistence-->>-api: Weather found
  note left of api: Weather is stale
  note left of api: SWR cache control attached

  api-->>-front: Returning stale weather

  api->>+weather: Get new weather
  weather-->>-api: New weather data


  api--)persistence: Update weather
  activate persistence
  persistence--)cache: Update weather cache
  persistence--)database: Update weather data
  deactivate persistence
  
  api--)broker: Push new weather notification (email)

  front->>+api: Revalidating weather
  note left of api: Process repeating
  note left of api: Weather should be fresh

```

### Cache miss, database hit (fresh)

```mermaid
sequenceDiagram
  front->>+api: Requesting weather

  api->>+persistence: Get weather

  persistence-->>+cache: Check cache
  cache-->cache: Checking weather data
  note right of cache: No cache found
  cache-->>-persistence: No cache found

  persistence-->>+database: Check weather
  database-->database: Checking weather data
  database-->>-persistence: Weather data found

  activate persistence

  persistence--)cache: Populate cache

  persistence-->>-api: Weather found
  deactivate persistence

  api-->>-front: Returning weather
```

### Cache miss, database hit (stale)

```mermaid
sequenceDiagram
  front->>+api: Requesting weather

  api->>+persistence: Get weather

  persistence-->>+cache: Check cache
  cache-->cache: Checking weather data
  note right of cache: No cache found
  cache-->>-persistence: No cache found

  persistence-->>+database: Check weather
  database-->database: Checking weather data
  database-->>-persistence: Weather data found

  activate persistence

  persistence--)cache: Populate cache

  persistence-->>-api: Weather found
  deactivate persistence
  note left of api: Weather is stale
  note left of api: SWR cache control attached

  api-->>-front: Returning stale weather

  
  api->>+weather: Get new weather
  weather-->>-api: New weather data

  api--)persistence: Update weather
  activate persistence
  persistence--)cache: Update weather cache
  persistence--)database: Update weather data
  deactivate persistence
  
  api--)broker: Push new weather notification (email)

  front->>+api: Revalidating weather
  note left of api: Process repeating
  note left of api: Weather should be fresh
```

### Cache miss, database miss

```mermaid
sequenceDiagram
  front->>+api: Requesting weather

  api->>+persistence: Get weather

  persistence-->>+cache: Check cache
  cache-->cache: Checking weather data
  note right of cache: No cache found
  cache-->>-persistence: No cache found

  persistence-->>+database: Check weather
  database-->database: Checking weather data
  note right of database: No weather found
  database-->>-persistence: No weather found

  persistence-->>-api: No weather found


  
  api->>+weather: Get new weather
  weather-->>-api: New weather data

  activate api

  api--)persistence: Update weather
  activate persistence
  persistence--)cache: Update weather cache
  persistence--)database: Update weather data
  deactivate persistence
  
  api--)broker: Push new weather notification (email)

  api-->>-front: Returning fresh weather
  deactivate api
```
