from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import get_resolver



from billing.views import download_invoice_pdf
from inventory.views import download_requisition_pdf, download_purchaseorder_pdf
from laboratory.views import download_labtestresult_pdf
from patient.views import download_prescription_pdf
from reports.views import get_invoice_items_by_date_range, serve_generated_pdf, serve_sales_by_item_id_pdf

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

def debug_view(request):
    # Get all registered URLs
    resolver = get_resolver()
    urls = []
    def collect_urls(resolver, prefix=''):
        for pattern in resolver.url_patterns:
            if hasattr(pattern, 'url_patterns'):
                collect_urls(pattern, prefix + str(pattern.pattern))
            else:
                urls.append(prefix + str(pattern.pattern))
    collect_urls(resolver)
    
    return JsonResponse({
        'registered_urls': urls,
        'current_path': request.path,
        'method': request.method,
        'headers': dict(request.headers)
    })


urlpatterns = [
    path('announcement/', include('announcement.urls')),
    path('debug/', debug_view),  # Add debug endpoint

    path('admin/', admin.site.urls),
    path('api/patients/', include('patient.urls')),
    path('lab/', include('laboratory.urls')),
    path('billing/', include('billing.urls')),
    path('inventory/', include('inventory.urls')),
    path('authperms/', include('authperms.urls')),
    path('api/customuser/', include('customuser.urls')),
    path('api/users/', include('customuser.urls')),
    path('reports/', include('reports.urls')),
    path('pharmacy/', include('pharmacy.urls')),
    path('company/', include('company.urls')),
    path('api/chatbot/', include('chatbot.urls')),


    # schemas
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc",),  
    path("docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),


    path('download_invoice_pdf/<int:invoice_id>/', download_invoice_pdf, name='download_invoice_pdf'),
    path('download_requisition_pdf/<int:requisition_id>/', download_requisition_pdf, name='download_requisition_pdf'),

    path('download_labtestresult_pdf/<int:labtestresult_id>/', download_labtestresult_pdf, name='download_labtestresult_pdf'),
    path('download_prescription_pdf/<int:prescription_id>/', download_prescription_pdf, name='download_prescription_pdf'),

    path('download_purchaseorder_pdf/<int:purchaseorder_id>/', download_purchaseorder_pdf, name='download_purchaseorder_pdf'),

    # Reports
    path('sale_by_date/', get_invoice_items_by_date_range, name='sale_by_date_pdf'),
    path('sale_by_date/pdf/', serve_generated_pdf, name='serve_generated_pdf'),
    path('serve_sales_by_item_id_pdf/', serve_sales_by_item_id_pdf, name='serve_sales_by_item_id_pdf'),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
