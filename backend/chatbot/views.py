from django.shortcuts import render
from rest_framework.views import APIView  # Fix: Separate import statement


# Create your views here.from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services.agent import HospitalDataRetriever
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from typing import Dict, Any
from .serializer import ChatMessageSerializer, ChatResponseSerializer, ExampleQuestionsSerializer
import logging


logger = logging.getLogger(__name__)


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            logger.info("Initializing HospitalDataRetriever")
            self.data_retriever = HospitalDataRetriever()
            logger.info("HospitalDataRetriever initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize HospitalDataRetriever: {str(e)}")
            raise


    def identify_query_type(self, question: str) -> str:
        """Identify the type of query based on keywords in the question"""
        keywords_to_query = {
            "patient_flow": ["patient flow", "waiting", "queue", "track"],
            "doctor_workload": ["doctor", "workload", "consultations", "available"],
            "lab_status": ["lab", "laboratory", "test", "sample"],
            "inventory_status": ["inventory", "stock", "supplies", "items"],
            "billing_summary": ["billing", "payment", "invoice", "revenue"],
            "department_stats": ["department", "performance", "visits"],
            "insurance_claims": ["insurance", "claims", "coverage"],
            "equipment_usage": ["equipment", "machine", "device"]
        }

        question_lower = question.lower()
        for query_type, keywords in keywords_to_query.items():
            if any(keyword in question_lower for keyword in keywords):
                return query_type
        return "custom"

    def post(self, request):  # Fix indentation
        logger.info(f"POST request received from user: {request.user.username}")
        logger.debug(f"Request data: {request.data}")
        
        try:
            serializer = ChatMessageSerializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Invalid request data: {serializer.errors}")

                return Response(serializer.errors, status=400)

            question = serializer.validated_data['question']
            
            # Identify query type
            query_type = self.identify_query_type(question)
            logger.info(f"Identified query type: {query_type}")


            # Get data based on query type
            if query_type != "custom":
                logger.info(f"Executing predefined query type: {query_type}")

                data = self.data_retriever.get_data(query_type)
                response = self.data_retriever.format_response(data, query_type)
            else:
                result = self.data_retriever.get_custom_data(question)
                if isinstance(result, dict) and "error" in result:
                    return Response(result, status=400)
                
                data = result
                response = self.data_retriever.format_response(result, "custom")

            # Prepare visualization hints
            visualization = self.get_visualization_hint(query_type, data)

            response_data = {
                'response': response,
                'structured_data': data,
                'visualization': visualization,
                'query_type': query_type
            }
            logger.debug(f"Preparing response: {response_data}")

            
            response_serializer = ChatResponseSerializer(data=response_data)
            response_serializer.is_valid(raise_exception=True)
            
            return Response(response_serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)

    def get_visualization_hint(self, query_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Provide hints for frontend visualization"""
        visualization_hints = {
            "patient_flow": {
                "type": "bar",
                "x": "track",
                "y": "patient_count",
                "title": "Patient Flow by Department"
            },
            "doctor_workload": {
                "type": "bar",
                "x": "last_name",
                "y": "current_patients",
                "title": "Doctor Workload"
            },
            "lab_status": {
                "type": "pie",
                "values": "total_tests",
                "labels": "test_name",
                "title": "Lab Tests Distribution"
            },
            "inventory_status": {
                "type": "bar",
                "x": "name",
                "y": "quantity_in_stock",
                "title": "Low Stock Items"
            },
            "billing_summary": {
                "type": "pie",
                "values": "total_amount",
                "labels": "payment_category",
                "title": "Revenue by Payment Type"
            },
            "department_stats": {
                "type": "bar",
                "x": "department",
                "y": "total_visits",
                "title": "Department Visit Statistics"
            },
            "insurance_claims": {
                "type": "bar",
                "x": "insurance_company",
                "y": "total_claim_amount",
                "title": "Insurance Claims"
            },
            "equipment_usage": {
                "type": "bar",
                "x": "equipment_name",
                "y": "test_count",
                "title": "Equipment Usage"
            }
        }
        
        return visualization_hints.get(query_type, {"type": "table"})

    @method_decorator(cache_page(60))  # Cache for 1 minute
    def get(self, request):
        """Get available query types and example questions"""
        example_questions = {
            "patient_flow": [
                "How many patients are currently in each department?",
                "What's the average waiting time in triage?"
            ],
            "doctor_workload": [
                "Show me the current doctor workload",
                "How many consultations has each doctor done today?"
            ],
            "lab_status": [
                "What's the status of lab tests today?",
                "How many samples are pending collection?"
            ],
            "inventory_status": [
                "Which items are low in stock?",
                "Show me the inventory status"
            ],
            "billing_summary": [
                "What's today's revenue breakdown?",
                "Show me the payment distribution"
            ],
            "department_stats": [
                "How are departments performing today?",
                "Which department has the most visits?"
            ],
            "insurance_claims": [
                "Show me today's insurance claims",
                "What's the insurance billing status?"
            ],
            "equipment_usage": [
                "How are lab equipment being utilized?",
                "Show equipment usage statistics"
            ]
        }

        return Response({
            'available_queries': example_questions,
            'message': 'Ask any question about the hospital system'
        })
