from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
import xmlrpc.client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(env_path, override=True)

from core.models import Category, MenuItem, Orders, OrderItem, Payments
from core.serializers import (
    CategorySerializer, 
    MenuItemSerializer,
    OrdersSerializer,
    OrderItemSerializer,
    PaymentsSerializer
)

ODOO_URL = os.getenv('ODOO_URL')
DB = os.getenv('DB')
USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')

common = xmlrpc.client.ServerProxy(f"{ODOO_URL}/xmlrpc/2/common")
uid = common.authenticate(DB, USERNAME, PASSWORD, {})
models = xmlrpc.client.ServerProxy(f"{ODOO_URL}/xmlrpc/2/object")

# class CategoryView(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

class MenuItemView(viewsets.ModelViewSet):
    queryset = MenuItem.objects.select_related('category')
    serializer_class = MenuItemSerializer

class OrdersView(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        # Use prefetch_related with the correct related_name 'items' from OrderItem model
        return Orders.objects.prefetch_related('items__menu_item')
        
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Orders.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def create_with_items(self, request):
        order_data = {
            'name': request.data['name'],
            'phone_number': request.data['phone_number'],
            'delivery_address': request.data['delivery_address'],
            'payment_method': request.data['payment_method']
        }
        
        # Create order in Django
        order = Orders.objects.create(**order_data)
        
        # Create order items in Django
        items_data = request.data.get('items', [])
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                menu_item_id=item['menu_item_id'],
                quantity=item['quantity']
            )

        # Sync with Odoo
        try:
            order_lines = []
            
            for item in items_data:
                menu_item = MenuItem.objects.get(id=item['menu_item_id'])
                
                # Check if menu item exists in Odoo
                odoo_item = models.execute_kw(
                    DB, uid, PASSWORD,
                    'sharepay.menu_item', 'search_read',
                    [[['id', '=', int(item['menu_item_id'])]]],
                    {'fields': ['id']}
                )
                
                # If not found by ID, try by name
                if not odoo_item:
                    odoo_item = models.execute_kw(
                        DB, uid, PASSWORD,
                        'sharepay.menu_item', 'search_read',
                        [[['name', '=', menu_item.name]]],
                        {'fields': ['id']}
                    )
                
                # Create menu item if it doesn't exist
                if not odoo_item:
                    # Get or create category
                    odoo_category = models.execute_kw(
                        DB, uid, PASSWORD,
                        'sharepay.menu_category', 'search_read',
                        [[['name', '=', menu_item.category.name]]],
                        {'fields': ['id']}
                    )
                    
                    if not odoo_category:
                        category_id = models.execute_kw(
                            DB, uid, PASSWORD,
                            'sharepay.menu_category', 'create',
                            [{'name': menu_item.category.name}]
                        )
                    else:
                        category_id = odoo_category[0]['id']
                    
                    odoo_item_id = models.execute_kw(
                        DB, uid, PASSWORD,
                        'sharepay.menu_item', 'create',
                        [{
                            'id': int(item['menu_item_id']),
                            'name': menu_item.name,
                            'price': float(menu_item.price),
                            'category_id': category_id,
                            'is_available': True
                        }]
                    )
                else:
                    odoo_item_id = odoo_item[0]['id']
                
                order_lines.append((0, 0, {
                    'product_id': int(odoo_item_id),
                    'quantity': float(item['quantity']),
                    'unit_price': float(menu_item.price)
                }))
            
            if not order_lines:
                return Response(
                    {"error": "No valid order items"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create order in Odoo
            order_vals = {
                'name': f"{order.name} - {order.phone_number}",
                'phone_number': order.phone_number,
                'delivery_address': order.delivery_address,
                'payment_method': order.payment_method.lower(),
                'order_status': 'draft',
                'order_line_ids': order_lines
            }
            
            order_id = models.execute_kw(
                DB, uid, PASSWORD,
                'sharepay.order', 'create',
                [order_vals]
            )
            
            # Return the order ID in the response
            return Response(
                {
                    "message": "Order created successfully",
                    "id": order.id,
                    "order_id": order.id  # Include both for backward compatibility
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {"error": f"Failed to sync with Odoo: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
        # Return serialized order with items
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    

class OrderItemView(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentsView(viewsets.ModelViewSet):
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer
