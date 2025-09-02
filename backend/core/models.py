from django.db import models

# Create your models here.

CATEGORY_CHOICES = [
    ('Beef', 'Breef'),
    ('Chicken', 'Chicken'),
    ('Vegan', 'Vegan'),
]


ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('preparing', 'Preparing'),
    ('ready', 'Ready'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]

PAYMENT_METHOD_CHOICES = [
    ('cash', 'Cash'),
    ('card', 'Card'),
    ('online', 'Online'),
]
class Category(models.Model):
    name = models.CharField(max_length=255 , choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name
    

class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    img = models.ImageField(upload_to='images/', null=True, blank=True)

    def __str__(self):
        return self.name


    def __str__(self):
        return f'Order #{self.id} - {self.name}'

    @property
    def total_price(self):
        return sum(item.item_price * item.quantity for item in self.order_items.all())
    


class Orders(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    delivery_address = models.CharField(max_length=255)
    order_status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default='cash')

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

    def __str__(self):
        return f'Order #{self.id} - {self.name}'



class OrderItem(models.Model):
    order = models.ForeignKey('Orders', on_delete=models.CASCADE, related_name='items', null=True)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    item_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.item_price = self.menu_item.price
        super().save(*args, **kwargs)

    @property
    def total_price(self):
        return self.quantity * self.item_price
    
    def __str__(self):
        return f'{self.quantity} x {self.menu_item.name}'

class Payments(models.Model):
    order = models.OneToOneField(Orders, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

