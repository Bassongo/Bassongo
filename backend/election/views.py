from django.shortcuts import get_object_or_404, render, redirect
from django.db.models import Count
from .models import Election
from .forms import VoteForm


def election_list(request):
    elections = Election.objects.all()
    return render(request, 'election/election_list.html', {'elections': elections})


def election_detail(request, pk):
    election = get_object_or_404(Election, pk=pk)
    form = VoteForm(request.POST or None, election=election)
    voted = False

    if request.method == 'POST' and form.is_valid():
        vote = form.save(commit=False)
        vote.election = election
        vote.save()
        voted = True

    return render(request, 'election/election_detail.html', {
        'election': election,
        'form': form,
        'voted': voted
    })


def election_results(request, pk):
    election = get_object_or_404(Election, pk=pk)
    results = election.candidates.annotate(vote_count=Count('votes'))
    return render(request, 'election/election_results.html', {
        'election': election,
        'results': results
    })
