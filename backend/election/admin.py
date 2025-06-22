from django.contrib import admin
from .models import Election, Candidate, Vote


class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 1


class ElectionAdmin(admin.ModelAdmin):
    inlines = [CandidateInline]
    list_display = ('name', 'start_time', 'end_time', 'active')


admin.site.register(Election, ElectionAdmin)
admin.site.register(Candidate)
admin.site.register(Vote)
