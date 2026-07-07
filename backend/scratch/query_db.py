import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import db

print("Users:")
for user in db["users"].find():
    print({k: v for k, v in user.items() if k != 'password'})

print("\nNotes:")
for note in db["notes"].find():
    print(note)
