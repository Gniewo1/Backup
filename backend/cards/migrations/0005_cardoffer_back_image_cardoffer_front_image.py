# Generated by Django 5.1.1 on 2025-01-02 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0004_remove_cardoffer_offer_price_remove_cardoffer_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cardoffer',
            name='back_image',
            field=models.ImageField(blank=True, null=True, upload_to='card_offer_images/'),
        ),
        migrations.AddField(
            model_name='cardoffer',
            name='front_image',
            field=models.ImageField(blank=True, null=True, upload_to='card_offer_images/'),
        ),
    ]
