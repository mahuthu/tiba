from rest_framework import viewsets, status, generics
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view


from django_filters.rest_framework import DjangoFilterBackend


# permissions
from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser,
    IsPatientUser,
    IsReceptionistUser,

)


from customuser.models import CustomUser
from inventory.models import Item
from .models import (
    ContactDetails,
    Patient,
    NextOfKin,
    Appointment,
    Prescription,
    PrescribedDrug,
    PublicAppointment,
    Consultation,
    Referral,
    Triage,
    AttendanceProcess,
)
from .serializers import (
    ContactDetailsSerializer,
    PatientSerializer,
    NextOfKinSerializer,
    AppointmentSerializer,
    PrescriptionSerializer,
    PrescribedDrugSerializer,
    PublicAppointmentSerializer,
    ConsultationSerializer,
    ReferralSerializer,
    TriageSerializer,
    ConvertToAppointmentsSerializer,
    SendConfirmationMailSerializer,
    AttendanceProcessSerializer,
)

# filters
from .filters import (
    AppointmentFilter,
    PatientFilter,
    ConsultationFilter,
    TriageFilter,
    PrescriptionFilter,
    PrescribedDrugFilter
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)

# utils
from .utils import send_appointment_email


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ConsultationFilter
    
    

class ContactDetailsViewSet(viewsets.ModelViewSet):
    queryset = ContactDetails.objects.all()
    serializer_class = ContactDetailsSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PatientFilter


class ConvertToAppointmentAPIView(APIView):

    @extend_schema(
        request=ConvertToAppointmentsSerializer,
        responses=ConvertToAppointmentsSerializer,
    )
    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = ConvertToAppointmentsSerializer(data=data)
        if serializer.is_valid():
            code = serializer.create_patient_appointment()
            if code == 400:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)


class PatientByUserIdAPIView(APIView):
    def get_object(self, user_id: int):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        responses=PatientSerializer,
    )
    def get(self, request: Request, user_id: int = None, *args, **kwargs):
        user = self.get_object(user_id)

        if user is None:
            return Response({"error_message": f"user id {user_id} doesn't exist"})

        patient = Patient.objects.filter(user_id__pk=user.pk)
        if not patient.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient.first())
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentsByPatientIdAPIView(APIView):
    def get(self, request, *args, **kwargs):
        patient_id = kwargs.get('patient_id')
        try:
            patient = Patient.objects.get(id=patient_id)
            appointments = Appointment.objects.filter(patient=patient)
            
            # Return empty list instead of 404 when no appointments found
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
            
        except Patient.DoesNotExist:
            return Response(
                {"error": f"Patient with ID {patient_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class PrescribedDrugByPatientIdAPIView(APIView):
    def get_prescribed_drugs_by_patient(self, patient_id: int):
        try:
            patient = get_object_or_404(Patient, id=patient_id)
            attendance_processes = AttendanceProcess.objects.filter(patient=patient)
            prescriptions = Prescription.objects.filter(attendanceprocess__in=attendance_processes)
            prescribed_drugs = PrescribedDrug.objects.filter(prescription__in=prescriptions)
            return prescribed_drugs
        except Patient.DoesNotExist:
            return None

    @extend_schema(
        responses=PrescribedDrugSerializer,
    )
    def get(self, request: Request, patient_id: int, *args, **kwargs):
        prescribed_drugs = self.get_prescribed_drugs_by_patient(patient_id)
        if prescribed_drugs is None:
            return Response({"error_message": f"Patient ID {patient_id} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        
        if not prescribed_drugs.exists():
            return Response({"error_message": "No prescribed drugs found for the given patient"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PrescribedDrugSerializer(prescribed_drugs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



'''
Get prescribed drugs by prescription ID
'''
class PrescribedDrugByPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer

    # Override the queryset to filter by prescription_id
    def get_queryset(self):
        prescription_id = self.kwargs.get('prescription_id')
        print(f"Prescription ID: {prescription_id}")
        return PrescribedDrug.objects.filter(prescription__id=prescription_id)


class NextOfKinViewSet(viewsets.ModelViewSet):
    queryset = NextOfKin.objects.all()
    serializer_class = NextOfKinSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = AppointmentFilter

    def create(self, request, *args, **kwargs):
        try:
            # Add debug logging
            print("Received data:", request.data)
            
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            print("Error creating appointment:", str(e))
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        
class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class PublicAppointmentViewSet(viewsets.ModelViewSet):
    queryset = PublicAppointment.objects.all()
    serializer_class = PublicAppointmentSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PrescriptionFilter


class PrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PrescribedDrugFilter


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer


class TriageViewSet(viewsets.ModelViewSet):
    queryset = Triage.objects.all()
    serializer_class = TriageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = TriageFilter

    def get_queryset(self):
        queryset = Triage.objects.all()
        # Get patient_id from query params
        patient_id = self.request.query_params.get('patient', None)
        if patient_id:
            # Filter through the AttendanceProcess relationship
            queryset = queryset.filter(attendanceprocess__patient_id=patient_id)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['attendance_process'] = self.request.query_params.get('attendance_process')
        return context


class SendAppointmentConfirmationAPIView(APIView):
    @extend_schema(
        request=SendConfirmationMailSerializer,
        responses=str,
    )



    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = SendConfirmationMailSerializer(data=data)

        if serializer.is_valid():
            print(serializer.validated_data)
            appointments = serializer.validated_data.get("appointments")
            send_appointment_email(appointments)
            return Response("email sent successfully", status=status.HTTP_200_OK)



'''
This view gets the geneated pdf and downloads it locally
pdf accessed here http://127.0.0.1:8080/download_prescription_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.conf import settings
import os
import logging


from django.template.loader import render_to_string
from weasyprint import HTML
from company.models import Company

logger = logging.getLogger(__name__)

def download_prescription_pdf(request, prescription_id):
    prescription = get_object_or_404(Prescription, pk=prescription_id)
    prescribed_drugs = PrescribedDrug.objects.filter(prescription=prescription)
    company = Company.objects.first()

    # Render the HTML template with the context
    html = render_to_string('prescription.html', {
        'prescription': prescription,
        'prescribed_drugs': prescribed_drugs,
        'company': company
        })

    # Use WeasyPrint to generate the PDF from the rendered HTML
    pdf_file = HTML(string=html).write_pdf()

    # Create the HTTP response with the PDF file
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{prescription.id}.pdf"'
    return response

class AttendanceProcessViewSet(viewsets.ModelViewSet):
    queryset = AttendanceProcess.objects.all().order_by('-id')
    serializer_class = AttendanceProcessSerializer

    def get_object(self):
        """Override get_object to add logging"""
        pk = self.kwargs.get('pk')
        logger.debug(f"Attempting to fetch AttendanceProcess with ID: {pk}")
        
        # Check if the object exists first
        try:
            obj = AttendanceProcess.objects.get(pk=pk)
            logger.debug(f"Found AttendanceProcess: {obj}")
            return obj
        except AttendanceProcess.DoesNotExist:
            logger.error(f"AttendanceProcess with ID {pk} not found")
            raise

    def list(self, request, *args, **kwargs):
        print("Fetching attendance processes")
        queryset = self.get_queryset()
        print(f"Found {queryset.count()} processes")
        serializer = self.get_serializer(queryset, many=True)
        print("Returning data:", serializer.data)
        return Response(serializer.data)


    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()  # This gets the object based on pk from URL
            print(f"Found attendance process: {instance.id}")  # Debug log
            
            # Get the data from request
            track = request.data.get('track')
            triage_data = request.data.get('triage')
            
            # Update track if provided
            if track:
                instance.track = track
            
            # Update triage if provided
            if triage_data and instance.triage:
                triage_serializer = TriageSerializer(
                    instance.triage,
                    data=triage_data,
                    partial=True
                )
                if triage_serializer.is_valid():
                    triage_serializer.save()
                else:
                    return Response(
                        triage_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Save the attendance process
            instance.save()
            
            # Serialize and return the updated data
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
            
        except AttendanceProcess.DoesNotExist:
            return Response(
                {"error": f"Attendance process with id {kwargs.get('pk')} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    
    def get_queryset(self):
        queryset = AttendanceProcess.objects.all().order_by('-id')
        # Add filter for doctor if needed
        doctor_id = self.request.query_params.get('doctor', None)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        return queryset

class AppointmentByDoctorView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        assigned_doctor_id = self.kwargs['assigned_doctor_id']
        return Appointment.objects.filter(assigned_doctor_id=assigned_doctor_id)
    
# @api_view(['PATCH'])
# def update_attendance_process(request, process_id):
#     """
#     Update attendance process and associated triage data
#     """
#     try:
#         # Get the attendance process instance
#         attendance_process = AttendanceProcess.objects.get(id=process_id)
        
#         # Get the data from request
#         track = request.data.get('track')
#         triage_data = request.data.get('triage')

#         # Update track if provided
#         if track:
#             attendance_process.track = track
        
#         # Update triage if provided
#         if triage_data and attendance_process.triage:
#             triage_serializer = TriageSerializer(
#                 attendance_process.triage,
#                 data=triage_data,
#                 partial=True
#             )
#             if triage_serializer.is_valid():
#                 triage_serializer.save()
#             else:
#                 return Response(
#                     triage_serializer.errors,
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#         # Save the attendance process
#         attendance_process.save()
        
#         # Serialize and return the updated data
#         serializer = AttendanceProcessSerializer(attendance_process)
#         return Response(serializer.data)

#     except AttendanceProcess.DoesNotExist:
#         return Response(
#             {"error": "Attendance process not found"},
#             status=status.HTTP_404_NOT_FOUND
#         )
#     except Exception as e:
#         return Response(
#             {"error": str(e)},
#             status=status.HTTP_400_BAD_REQUEST
#         )