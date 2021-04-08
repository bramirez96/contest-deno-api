import json
import random
import sys


def decode(x):
    return json.JSONDecoder().decode(x)


def encode(x):
    return json.JSONEncoder().encode(x)


submissions = decode(sys.argv[1])


# mock list for trial and error
# ISubItem = [3452, 3647, 3948, 3829, 3928,
#             3726, 3958, 3792, 3190, 3523, 3409, 3822]
# studentid = [93049, 90384, 93740, 94873, 94728,
#              92516, 93647, 92627, 91738, 93782, 93722, 93627]

# randomly shuffle lists 2 and 3
shuffle1 = random.sample(submissions, len(submissions))
shuffle2 = random.sample(shuffle1, len(shuffle1))
shuffle3 = random.sample(shuffle2, len(shuffle2))
# print(encode(shuffle1))
# print(encode(shuffle2))
# print(encode(shuffle3))


equal = True
while equal:
    equal = False
    for i, j, k in zip(shuffle1, shuffle2, shuffle3):
        if i == j or i == k or j == k:
            # random.shuffle(shuffle1)
            random.shuffle(shuffle2)
            random.shuffle(shuffle3)
            equal = True
            break

# creates lists with 1,2,3 combined for use as value pairs for student id key
nested = [[i, j, k] for i, j, k in zip((shuffle1), (shuffle2), (shuffle3))]
# print(encode(nested))

fdbkassigned = []
for user in submissions:
    for value in nested:
        for sub in value:
            fdbkassigned.append(
                {'voterId': user['voterId'], 'submissionId': sub['submissionId']})
        nested.remove(value)
        break

print(encode(fdbkassigned))
