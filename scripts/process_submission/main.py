import json
import logging
import sys
from os import environ, getenv

import boto3
from dotenv import load_dotenv
from scripts.process_submission.google_api import GoogleAPI
from scripts.process_submission.squad_score import scaler, squad_score


def decode(x):
    return json.JSONDecoder().decode(x)
def encode(x):
    return json.JSONEncoder().encode(x)
input = decode(sys.argv[1])

log = logging.getLogger(__name__)
vision = GoogleAPI()
{maybe boto3}
load_dotenv()
s3 = boto3.client(
    service_name='s3',
    region_name=getenv("S3_REGION"),
    aws_access_key_id=getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=getenv("AWS_SECRET_ACCESS_KEY")
)
async def submission_text(sub: Submission):
    transcriptions = ""
    confidence_flags = []
    for page_num in sub.Pages: (maybe not for loop if only 1 page):
                # fetch file from s3 bucket
        filekey = sub.Pages[page_num]["filekey"]
        bucket = "storysquad"
        r = s3.get_object(Bucket=getenv("S3_BUCKET"), Key=filekey)
        r_content = r['Body'].read()
        conf_flag, flagged, trans, rotation = await vision.transcribe(r_content)
       # concat transcriptions together
        transcriptions += trans + "\n"
        # add page to list of confidence flags
        confidence_flags.append(conf_flag)
   # score the transcription using SquadScore algorithm
    score = await squad_score(transcriptions, scaler)
    # change this ?? 
    return JSONResponse(
        status_code=200,
        content={
            "SubmissionID": sub.SubmissionID,
            "ModerationFlag": flagged,
            "LowConfidence": True in confidence_flags,
            "Complexity": score,
            "Rotation": rotation,
            "Transcription": transcriptions[:3000]
        },
    )

#################
const response = encode(functionReturnValue)
print(response)
