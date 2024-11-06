
all:

up:
	docker compose -f srcs/docker-compose.yml up -d --build

devo:
#	make -C dev/ watch dir=$(realpath ./)/srcs/django-files/backend/tpong/static/tpong cmd='"make -C $(realpath ./) collectstatic"'
	docker compose -f srcs/docker-compose.yml up --build

down:
	docker compose -f srcs/docker-compose.yml down

collectstatic:
	docker exec -d backend python /var/django-site/manage.py collectstatic --noinput

cleandb:
	rm -rf ./srcs/pgdata
