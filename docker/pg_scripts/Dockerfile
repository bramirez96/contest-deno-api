FROM postgres:12

RUN chmod +x docker/pg_scripts/create-multiple-postgresql-databases.sh

COPY create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/create-multiple-postgresql-databases.sh

EXPOSE 5932