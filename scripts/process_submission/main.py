import json
import sys
import squad_score
import transcription
import text_moderation
import google_api


def decode(x):
    return json.JSONDecoder().decode(x)
def encode(x):
    return json.JSONEncoder().encode(x)
input = decode(sys.argv[1])

















#################
const response = encode(functionReturnValue)
print(response)
