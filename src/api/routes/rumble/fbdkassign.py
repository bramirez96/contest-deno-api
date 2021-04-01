import random

#mock list for trial and error
ISubItem = [3452, 3647, 3948, 3829, 3928, 3726, 3958, 3792, 3190, 3523, 3409, 3822]
studentid = [93049, 90384, 93740, 94873, 94728, 92516, 93647, 92627, 91738, 93782, 93722, 93627]

submissions = ISubItem #iSubItem, object list

#randomly shuffle lists 2 and 3
shuffle1 = random.sample(submissions, len(submissions))
shuffle2 = random.sample(shuffle1, len(shuffle1))
shuffle3 = random.sample(shuffle2, len(shuffle2))
print('shuffled1:',shuffle1, 'shuffled2:',shuffle2, 'shuffled3:', shuffle3)

#creates lists with 1,2,3 combined for use as value pairs for student id key
nested = [[i,j,k] for i,j,k in zip((shuffle1), (shuffle2), (shuffle3))]
# print(nested)

fdbkassigned = {}
for key in studentid:
    for value in nested:
        fdbkassigned[key] = value
        nested.remove(value)
        break  
print(fdbkassigned)
