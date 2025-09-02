from django.urls import reverse
from ..models import MenuItem, Category, OrderItem, Orders
from rest_framework.test import APITestCase


class MenuItemTestCase(APITestCase):

    #Arrange
    def setUp(self):
        self.category = Category.objects.create(name='Beef')
        self.menu_item = MenuItem.objects.create(name='Burger', price=10 , description='Tasty' , category=self.category)

    def test_get_menu_items(self):
        #Act
        url = reverse('menu-items-list')
        response = self.client.get(url)
        #Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), MenuItem.objects.count())

    def test_get_menu_item_detail(self):
        #Arrange
        menu_item = MenuItem.objects.first()
        #Act
        url = reverse('menu-items-detail', args=[menu_item.id])
        response = self.client.get(url)
        #Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], menu_item.name)


class OrderTestCase(APITestCase):

    #Arrange
    def setUp(self):
        self.category = Category.objects.create(name='Beef')
        self.menu_item = MenuItem.objects.create(name='Burger', price=10 , description='Tasty' , category=self.category)
        self.order = Orders.objects.create(name='John Doe', phone_number='1234567890', delivery_address='123 Main St', payment_method='cash')
        self.order_item = OrderItem.objects.create(order=self.order, menu_item=self.menu_item, quantity=2)

    def test_create_order(self):
        #Act
        url = reverse('orders-list')
        data = {'name': 'Abdo Youssef', 'phone_number': '01027983379', 'delivery_address': '123 Zagazig St', 'payment_method': 'cash'}
        response = self.client.post(url, data)
        #Assert
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], data['name'])

    def test_get_order_detail(self):
        #Act
        order = Orders.objects.first()
        url = reverse('orders-detail', args=[order.id])
        response = self.client.get(url)
        #Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], order.name)

# The difference in needing a basename for MenuItemView
#  but not for OrdersView in the URL router configuration
#  comes down to how Django REST Framework (DRF) handles
#  the automatic route naming.

# Default Basename Resolution:
# DRF automatically determines the basename from the queryset.model if:
# The queryset is defined at class level (not in methods)
# The queryset is a plain model queryset (not modified with select_related, etc.)

# When basename is Required:
# When using select_related() or other queryset modifications
# When defining get_queryset() method instead of class-level queryset
# When you want a custom URL naming scheme