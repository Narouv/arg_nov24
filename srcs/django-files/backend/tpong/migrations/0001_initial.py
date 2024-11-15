# Generated by Django 5.0.3 on 2024-05-09 08:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PongStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playerName', models.CharField(default=0, max_length=15)),
                ('score', models.IntegerField(default=0)),
                ('side', models.CharField(default=0, max_length=15)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PongMatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('type', models.CharField(choices=[('local', 'Local'), ('pvp', 'PvP'), ('tournament', 'Tournament')], default='local', max_length=25)),
                ('mode', models.CharField(choices=[('classic', 'Classic'), ('gravity', 'Gravity')], default='classic', max_length=25)),
                ('status', models.CharField(default='idle', max_length=25)),
                ('maxScore', models.IntegerField(default=3)),
                ('stats', models.ManyToManyField(to='tpong.pongstats')),
            ],
        ),
    ]
