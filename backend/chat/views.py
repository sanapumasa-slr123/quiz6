from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import openai
from django.conf import settings

class AIChatbotView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message', '')
        
        if not message:
            return Response(
                {'detail': 'Message is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not settings.OPENAI_API_KEY:
            return Response(
                {'reply': 'OpenAI API key is not configured.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            openai.api_key = settings.OPENAI_API_KEY
            system_prompt = "You are a helpful assistant for a Fence & Deck Services marketplace. Answer only questions about fence and deck services, how to hire experts, pricing, how to become a seller, or how to place orders. Decline anything outside this scope."
            
            response = openai.ChatCompletion.create(
                model='gpt-4o-mini',
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': message}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            reply = response['choices'][0]['message']['content']
            return Response({'reply': reply})
        
        except Exception as e:
            return Response(
                {'detail': f'Error processing request: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
