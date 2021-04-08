import json
import sys

user = json.JSONDecoder().decode(sys.argv[1])

if not user['id'] or not user['name']:
    KeyError('Missing keys in user')

res = json.JSONEncoder().encode(user)

print(res)
