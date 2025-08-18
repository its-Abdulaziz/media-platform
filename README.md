# media-platform

A system making the content managers able to store programs and episodes and discovery component let the user's search.

- **CMS Service**: Internal system for content managers to manage programs and episodes.
- **Discovery Service**: Public-facing system that allows users to search for episodes.

## Tech Stack

- [NestJS](https://nestjs.com/) (Node.js Framework)
- [PostgreSQL](https://www.postgresql.org/) (Database with FTS)
- [Redis](https://redis.io/) (Caching layer)
- [Docker Compose](https://docs.docker.com/compose/) (Container orchestration)
- [pgAdmin](https://www.pgadmin.org/) (Database UI)

## Overview

**CMS Service**

* CRUD for `Programs` and `Episodes`
* Authentication for content managers
* Upload media to R2

**Discovery Service**

* Search for episodes using PostgreSQL Full Text Search (FTS)
* Caches frequent queries in Redis for performance

## Development

**Database and Redis:**
~~~
docker compose up
~~~
**Run CMS locally:**
~~~
cd apps/cms-service
npm install
npm run dev:cms
~~~
**Run Discovery locally:**
~~~
cd apps/discovery-service
npm install
npm run dev:discovery
~~~
