from rest_framework.views import APIView
from rest_framework.response import Response

import logging
logger = logging.getLogger(__name__)

class funpass(APIView):
    def post(self, request):
        if input := request.data.get('input'):
            if input == 'GEWONNEN!!!':
                logger.warning(f"input was: {input}")
                logger.warning("True!\n")
                return Response({"success": True})
        logger.warning(f"input was: {input}")
        logger.warning("False!\n")
        return Response({"success": False})