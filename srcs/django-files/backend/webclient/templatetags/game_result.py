from django import template
from tpong.models import PongMatch

register = template.Library()

@register.filter
def call_method(obj, args):
    parts = args.split(',')
    method_name = parts[0]
    method_args = parts[1:]
    
    method = getattr(obj, method_name, None)
    if method and callable(method):
        return method(*method_args)
    return None

@register.inclusion_tag("webclient/snippets/result-info.html", takes_context=True)
def display_match_result(context):
    request = context.get("request")
    args = request.data["args"]
    matchId = args.get("matchId")
    try:
        pongMatch = PongMatch.objects.get(pk=matchId)
    except PongMatch.DoesNotExist:
        return { "success": False }
    result = {
        "success": True,
        "match": pongMatch,
        "winner": pongMatch.getWinner(),
    }
    for stat in pongMatch.stats.all():
        result[f"player{ stat.side.title() }"] = stat
    return result
