# Generated by Django 5.1.1 on 2024-12-11 13:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0003_cardpurchase'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cardoffer',
            name='offer_price',
        ),
        migrations.RemoveField(
            model_name='cardoffer',
            name='user',
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='auction_end_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='auction_start_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='buy_now_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='offer_type',
            field=models.CharField(choices=[('buy_now', 'Buy Now'), ('auction', 'Auction'), ('buy_now_and_auction', 'Buy Now and Auction')], default='buy_now', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='seller',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='cardoffer',
            name='card',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to='cards.card'),
        ),
        migrations.CreateModel(
            name='UserOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('offer_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_offers', to=settings.AUTH_USER_MODEL)),
                ('card_offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_offers', to='cards.cardoffer')),
            ],
        ),
    ]
