# Generated by Django 5.1.1 on 2025-06-11 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_verificationcode_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verificationcode',
            name='code',
            field=models.CharField(default=441661, max_length=6),
        ),
    ]
