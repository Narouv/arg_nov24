from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib.auth import logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
# Create your views here.
def single_page_app(request):
	return render(request, "webclient/app-base.html", {})


class NavView(APIView):
	def get(self, request, type):
		return render(request, "webclient/navbar.html", {})
    
    #def post(self, request, type):
		

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def navbar(request):
	return render(request, "webclient/navbar.html", {})

def logout_view(request):
	logout(request)
	return redirect("/")

def pong(request):
	return render(request, "webclient/pong.html", {})

def register(request):
	form = RegistrationForm()
	context = {"form": form}
	if request.method == 'POST':
		form = RegistrationForm(request.POST)
		if form.is_valid():
			form.save()
		return redirect("/")
	return render(request, "webclient/register.html", context)


from rest_framework.response import Response 
from django.template import TemplateDoesNotExist

def initContextMatchResult(request):
	context = {

	}
	return context

def initContextMatchmakingSelect(request):
	context = {
		
	}
	return context


class SubViewManger(APIView):
	context_init = {
		"match-result": initContextMatchResult,
		"matchmaking-select": initContextMatchmakingSelect,
	}

	def post(self, request, view):
		context = {}
		#if SubViewManger.context_init.get(view):
		#	context = SubViewManger.context_init[view]()

		# if request.user.username == "muhballs" and view == "settings":
		# 	return render(request, "webclient/views/fubu.html", context)
		response = render(request, f"webclient/views/{view}.html", context)
		
		#try:
		#except TemplateDoesNotExist:
		#	return Response({"success": False, "msg": "Invalid view!"})
		return response