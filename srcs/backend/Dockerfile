FROM python:3.12

#RUN apt-get update && \
#	apt-get install -y apache2 apache2-dev
RUN pip install \
		Django==5.0.3 \
		django-environ \
		djangorestframework \
		psycopg \
		psycopg2-binary \
		channels \
		daphne \
		djangorestframework-simplejwt \
		requests \
		Twisted[tls,http2] \
		Pillow\
		pyotp

COPY nottl.conf /nottl.conf
#CMD [ 	"/var/django-site/manage.py", \
#		"runmodwsgi", \
#		"--reload-on-changes", \
#		"--user=www-data", \
#		"--group=www-data", \
#		"--include-file=/nottl.conf"]
#WORKDIR /var/django-site/
#ENTRYPOINT [ "daphne", "-b", "0.0.0.0", "backend.asgi:application" ]
CMD [  "/var/django-site/manage.py", \
		"runserver" ,\
		"0.0.0.0:8000"]

#ENTRYPOINT [ "tail", "-f" ]