from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def wtf(request):
    context = {"big_info": {"str": "42Boiiii"}}
    return render(request, "polls/index.html", context)
