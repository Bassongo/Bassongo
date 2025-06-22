from django.db import models


class Election(models.Model):
    name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-start_time']


class Candidate(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='candidates')
    name = models.CharField(max_length=255)
    manifesto = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Vote(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='votes')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='votes')
    voter_name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('election', 'voter_name')

    def __str__(self):
        return f"{self.voter_name} -> {self.candidate.name}"
