from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
#from . import consumer

urlpatterns = [
    path("", views.single_page_app, name="app-base"),
	path("views/<str:view>/", views.SubViewManger.as_view(), name="viewMngr"),
	# path("login", auth_views.LoginView.as_view(template_name="webclient/login.html")),
	# path("register", views.register, name="register"),
	path("logout", views.logout_view, name="logout"),
	path("pong", views.pong, name="pong"),

	path("views/navbar/", views.navbar, name="logout"),

	# path("views/login/", views.login, name="login"),

	# path("ws/test/", consumer.SockerConsumer.as_asgi(), name="ws"),
]