from langchain.tools import BaseTool
from django.db import connection
from typing import Optional, Any
from datetime import datetime, timedelta
from django.db.models import Count, Avg, Sum, F, ExpressionWrapper, fields
from decimal import Decimal
from pydantic import Field

class PatientFlowTool(BaseTool):
    name: str = Field(default="patient_flow_analyzer")
    description: str = Field(default="Analyze patient flow, waiting times, and department loads")

    def _run(self, query: str) -> str:
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH DepartmentStats AS (
                    SELECT 
                        track,
                        COUNT(*) as patient_count,
                        AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/60)::integer as avg_wait_minutes,
                        COUNT(CASE WHEN triage_id IS NOT NULL THEN 1 END) as triaged_count,
                        COUNT(CASE WHEN doctor_id IS NOT NULL THEN 1 END) as with_doctor
                    FROM patient_attendanceprocess
                    WHERE DATE(created_at) = CURRENT_DATE
                    GROUP BY track
                )
                SELECT 
                    track,
                    patient_count,
                    avg_wait_minutes,
                    ROUND((triaged_count::float / NULLIF(patient_count, 0) * 100), 2) as triage_rate,
                    ROUND((with_doctor::float / NULLIF(patient_count, 0) * 100), 2) as doctor_assignment_rate
                FROM DepartmentStats
                ORDER BY patient_count DESC
            """)
            results = cursor.fetchall()
            
            response = "Current Patient Flow Status:\n"
            for row in results:
                response += f"\n🏥 {row[0].title()}:\n"
                response += f"- Patients: {row[1]}\n"
                response += f"- Avg Wait: {row[2]} minutes\n"
                response += f"- Triage Rate: {row[3]}%\n"
                response += f"- Doctor Assignment: {row[4]}%\n"
            
            return response

class InventoryAnalyzerTool(BaseTool):
    name: str = Field(default="inventory_analyzer")
    description: str = Field(default="Analyze inventory levels, stock alerts, and usage patterns")

    def _run(self, query: str) -> str:
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH InventoryAlerts AS (
                    SELECT 
                        i.name,
                        inv.quantity_in_stock,
                        inv.sale_price,
                        i.category,
                        CASE 
                            WHEN inv.quantity_in_stock = 0 THEN 'OUT_OF_STOCK'
                            WHEN inv.quantity_in_stock < 10 THEN 'CRITICAL'
                            WHEN inv.quantity_in_stock < 20 THEN 'LOW'
                            ELSE 'ADEQUATE'
                        END as stock_status
                    FROM inventory_inventory inv
                    JOIN inventory_item i ON inv.item_id = i.id
                )
                SELECT 
                    category,
                    COUNT(*) as total_items,
                    SUM(CASE WHEN stock_status = 'OUT_OF_STOCK' THEN 1 ELSE 0 END) as out_of_stock,
                    SUM(CASE WHEN stock_status = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
                    SUM(CASE WHEN stock_status = 'LOW' THEN 1 ELSE 0 END) as low_stock
                FROM InventoryAlerts
                GROUP BY category
            """)
            results = cursor.fetchall()
            
            response = "Inventory Status Report:\n"
            for row in results:
                response += f"\n📦 {row[0]}:\n"
                response += f"- Total Items: {row[1]}\n"
                if row[2] > 0:
                    response += f"⚠️ Out of Stock: {row[2]} items\n"
                if row[3] > 0:
                    response += f"🚨 Critical Stock: {row[3]} items\n"
                if row[4] > 0:
                    response += f"⚠️ Low Stock: {row[4]} items\n"
            
            return response

class LabOperationsTool(BaseTool):
    name: str = Field(default="lab_operations_analyzer")
    description: str = Field(default="Analyze laboratory operations, test status, and workload")

    def _run(self, query: str) -> str:
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH LabStats AS (
                    SELECT 
                        ltp.name as test_name,
                        COUNT(*) as total_requests,
                        COUNT(CASE WHEN ltr.has_result THEN 1 END) as completed,
                        COUNT(CASE WHEN ps.is_sample_collected THEN 1 END) as samples_collected,
                        AVG(EXTRACT(EPOCH FROM (NOW() - ltr.requested_on))/3600)::integer as avg_processing_hours
                    FROM laboratory_labtestrequest ltr
                    JOIN laboratory_labtestprofile ltp ON ltr.test_profile_id = ltp.id
                    LEFT JOIN laboratory_patientsample ps ON ps.lab_test_request_id = ltr.id
                    WHERE DATE(ltr.created_on) = CURRENT_DATE
                    GROUP BY ltp.name
                )
                SELECT *,
                    ROUND((completed::float / NULLIF(total_requests, 0) * 100), 2) as completion_rate,
                    ROUND((samples_collected::float / NULLIF(total_requests, 0) * 100), 2) as collection_rate
                FROM LabStats
                ORDER BY total_requests DESC
            """)
            results = cursor.fetchall()
            
            response = "Laboratory Operations Status:\n"
            for row in results:
                response += f"\n🔬 {row[0]}:\n"
                response += f"- Total Requests: {row[1]}\n"
                response += f"- Completed: {row[2]} ({row[5]}%)\n"
                response += f"- Samples Collected: {row[3]} ({row[6]}%)\n"
                response += f"- Avg Processing Time: {row[4]} hours\n"
            
            return response

class BillingAnalyzerTool(BaseTool):
    name: str = Field(default="billing_analyzer")
    description: str = Field(default="Analyze billing information, revenue, and payment patterns")

    def _run(self, query: str) -> str:
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH PaymentStats AS (
                    SELECT 
                        pm.payment_category,
                        COUNT(DISTINCT i.id) as invoice_count,
                        SUM(i.invoice_amount) as total_amount,
                        COUNT(CASE WHEN i.status = 'pending' THEN 1 END) as pending_count,
                        COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_count
                    FROM billing_invoice i
                    JOIN billing_invoiceitem ii ON i.id = ii.invoice_id
                    JOIN billing_paymentmode pm ON ii.payment_mode_id = pm.id
                    WHERE DATE(i.invoice_created_at) = CURRENT_DATE
                    GROUP BY pm.payment_category
                )
                SELECT *,
                    ROUND((paid_count::float / NULLIF(invoice_count, 0) * 100), 2) as payment_rate
                FROM PaymentStats
            """)
            results = cursor.fetchall()
            
            response = "Today's Billing Summary:\n"
            total_revenue = 0
            for row in results:
                total_revenue += row[2]
                response += f"\n💰 {row[0].title()}:\n"
                response += f"- Invoices: {row[1]}\n"
                response += f"- Total Amount: ${row[2]:,.2f}\n"
                response += f"- Pending: {row[3]}\n"
                response += f"- Paid: {row[4]} ({row[5]}%)\n"
            
            response += f"\n📊 Total Revenue: ${total_revenue:,.2f}"
            return response

class DoctorPerformanceTool(BaseTool):
    name: str = Field(default="doctor_performance_analyzer")
    description: str = Field(default="Analyze doctor workload, consultations, and performance metrics")

    def _run(self, query: str) -> str:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    u.first_name,
                    u.last_name,
                    COUNT(DISTINCT ap.id) as total_patients,
                    COUNT(DISTINCT c.id) as consultations,
                    AVG(EXTRACT(EPOCH FROM (c.date_created - ap.created_at))/60)::integer as avg_consultation_minutes
                FROM customuser_customuser u
                LEFT JOIN patient_attendanceprocess ap ON ap.doctor_id = u.id
                LEFT JOIN patient_consultation c ON c.doctor_id = u.id
                WHERE u.role = 'doctor'
                    AND DATE(ap.created_at) = CURRENT_DATE
                GROUP BY u.id, u.first_name, u.last_name
                ORDER BY total_patients DESC
            """)
            results = cursor.fetchall()
            
            response = "Doctor Performance Today:\n"
            for row in results:
                response += f"\n👨‍⚕️ Dr. {row[0]} {row[1]}:\n"
                response += f"- Total Patients: {row[2]}\n"
                response += f"- Consultations: {row[3]}\n"
                if row[4]:
                    response += f"- Avg Consultation Time: {row[4]} minutes\n"
            
            return response

def get_all_tools():
    return [
        PatientFlowTool(),
        InventoryAnalyzerTool(),
        LabOperationsTool(),
        BillingAnalyzerTool(),
        DoctorPerformanceTool()
    ]