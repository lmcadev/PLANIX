from django.contrib import admin

from .models import Schedule, ScheduleExceptionDate

admin.site.register(Schedule)
admin.site.register(ScheduleExceptionDate)
