from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # CategoryView,
    MenuItemView,
    OrdersView,
    OrderItemView,
    PaymentsView
)

router = DefaultRouter()
# router.register(r'categories', CategoryView)
router.register(r'menu-items', MenuItemView, basename='menu-items')
router.register(r'orders', OrdersView)
router.register(r'order-items', OrderItemView)
router.register(r'payments', PaymentsView)

urlpatterns = [
    path('', include(router.urls)),
]