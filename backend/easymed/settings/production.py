from .base import *
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ["*"]