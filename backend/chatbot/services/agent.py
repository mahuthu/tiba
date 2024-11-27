from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.chat_models import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from django.db import connection
from datetime import datetime, date
import pandas as pd
from django.conf import settings
from .tools import get_all_tools
from .prompts import QUERY_PROMPT


class HospitalDataRetriever:
    def __init__(self):
        try:
            # Initialize database connection
            database_url = f"postgresql://{settings.DATABASES['default']['USER']}:{settings.DATABASES['default']['PASSWORD']}@{settings.DATABASES['default']['HOST']}:{settings.DATABASES['default']['PORT']}/{settings.DATABASES['default']['NAME']}"
            
            # Initialize LLM and database
            self.db = SQLDatabase.from_uri(database_url)
            self.llm = ChatOpenAI(
                temperature=0,
                model_name="gpt-3.5-turbo",
                api_key=settings.OPENAI_API_KEY
            )
            
            # Initialize tools and prompt template
            self.tools = get_all_tools()
            self.prompt_template = QUERY_PROMPT
            
            # Create SQL agent
            self.agent = create_sql_agent(
                llm=self.llm,
                db=self.db,
                verbose=True
            )

        except Exception as e:
            raise Exception(f"Failed to initialize HospitalDataRetriever: {str(e)}")

    async def get_data(self, query_type: str, params=None):
        """Execute query using appropriate tool or predefined query"""
        try:
            # First try to use specific tools
            for tool in self.tools:
                if tool.name.startswith(query_type):
                    return tool._run("")

            # If no tool matches, use the tool's query execution
            tool_map = {
                "patient_flow": self.tools[0],  # PatientFlowTool
                "inventory_status": self.tools[1],  # InventoryAnalyzerTool
                "lab_status": self.tools[2],  # LabOperationsTool
                "billing_summary": self.tools[3],  # BillingAnalyzerTool
                "doctor_workload": self.tools[4],  # DoctorPerformanceTool
            }

            if query_type in tool_map:
                return tool_map[query_type]._run("")
            
            return {"error": "Query type not found"}

        except Exception as e:
            return {"error": str(e)}

    async def get_custom_data(self, question: str):
        """Handle custom questions using tools and LLM"""
        try:
            # Try to match with specific tools first
            for tool in self.tools:
                keywords = tool.description.lower().split()
                if any(keyword in question.lower() for keyword in keywords):
                    return tool._run(question)

            # If no tool matches, use the LLM with prompt template
            relevant_tables = self.identify_relevant_tables(question)
            prompt = self.prompt_template.format(
                question=question,
                relevant_tables=relevant_tables,
                sql_query="",
                answer=""
            )

            # Use the agent to get response
            response = await self.agent.arun(prompt)
            return response

        except Exception as e:
            return {"error": str(e)}

    def identify_relevant_tables(self, question: str) -> str:
        """Identify relevant tables based on keywords"""
        table_keywords = {
            "patient": ["patient_attendanceprocess", "patient_consultation"],
            "doctor": ["customuser_customuser", "patient_consultation"],
            "lab": ["laboratory_labtestrequest", "laboratory_labtestprofile"],
            "inventory": ["inventory_inventory", "inventory_item"],
            "billing": ["billing_invoice", "billing_invoiceitem"],
            "insurance": ["company_insurancecompany", "billing_paymentmode"],
        }

        relevant_tables = []
        question_lower = question.lower()
        
        for key, tables in table_keywords.items():
            if key in question_lower:
                relevant_tables.extend(tables)

        return "\n".join(f"- {table}" for table in set(relevant_tables))

    def format_response(self, data, query_type: str) -> str:
        """Format the response data"""
        if isinstance(data, dict) and "error" in data:
            return data["error"]

        if isinstance(data, str):
            return data  # Return if already formatted by tool

        # If data is empty or None
        if not data:
            return "No data found for the given query."

        # Return raw data for custom queries
        if query_type == "custom":
            return str(data)

        # For predefined queries, use the response from tools
        return data

    def get_available_queries(self) -> dict:
        """Return available query types and example questions"""
        return {
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
            ]
        }