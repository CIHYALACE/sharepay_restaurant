from django.contrib import admin
from .models import *

admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(Orders)
admin.site.register(OrderItem)
admin.site.register(Payments)
