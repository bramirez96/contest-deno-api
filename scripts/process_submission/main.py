import json
import logging
import sys
from os import environ, getenv

import boto3
from dotenv import load_dotenv

from google_api import GoogleAPI
from squad_score import scaler, squad_score


def decode(x):
    return json.JSONDecoder().decode(x)


def encode(x):
    return json.JSONEncoder().encode(x)


input = decode(sys.argv[1])

load_dotenv()
log = logging.getLogger(__name__)
vision = GoogleAPI()

s3 = boto3.client(
    service_name='s3',
    region_name=getenv("S3_REGION"),
    aws_access_key_id=getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=getenv("AWS_SECRET_ACCESS_KEY")
)


async def submission_text(sub: Submission):
    transcriptions = ""
    confidence_scores = []
    for page_num in sub.pages:
        # fetch file from s3 bucket
        filekey = sub.pages[page_num]["filekey"]

        bucket = getenv("S3_BUCKET")
        r = s3.get_object(Bucket=bucket, Key=filekey)
        r_content = r['Body'].read()

        # Vision Transcription
        conf, flagged, trans, rotation = await vision.transcribe(r_content)

        # concat transcriptions together
        transcriptions += trans + "\n"
        # add page to list of confidence flags
        confidence_scores.append(conf)

    # score the transcription using SquadScore algorithm
    score = await squad_score(transcriptions, scaler)

    response = {
        # "submissionId": sub.submissionId,
        # "moderationFlag": flagged,
        "confidence": sum(confidence_scores) / len(confidence_scores),
        "score": score,
        "rotation": rotation,
        "transcription": transcriptions[:3000]
    }

    print(encode(response))

if __name__ == '__main__':
    submission_text(input)
