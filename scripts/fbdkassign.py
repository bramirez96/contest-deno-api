import random

#mock list for trial and error
ISubItem_id = [3452, 3647, 3948, 3829, 3928, 3726, 3958, 3792, 3190, 3523, 3409, 3822]
ISubItem_userId = [93049, 90384, 93740, 94873, 94728, 92516, 93647, 92627, 91738, 93782, 93627, 94837]
ISubItem_combo = {93049:3452, 90384:3647, 93740:3948, 94873:3829, 94728:3928, 92516:3726, 93647:3958,
                 92627:3792, 91738:3190, 93782:3523,  93627:3409, 94837:3822}
submissions = ISubItem_id #iSubItem, object list

#randomly shuffle lists 2 and 3
shuffle1 = random.sample(submissions, len(submissions))
shuffle2 = random.sample(shuffle1, len(shuffle1))
shuffle3 = random.sample(shuffle2, len(shuffle2))

# print('shuffled1:',shuffle1, 'shuffled2:',shuffle2, 'shuffled3:', shuffle3)    random.sample(shuffle2, len(shuffle2))

equal = True
while equal:
    equal = False
    for i,j,k in zip(shuffle1, shuffle2, shuffle3):
        if i == j or i ==k or j==k:
            print('Wont work')
            #random.shuffle(shuffle1)
            random.shuffle(shuffle2)
            random.shuffle(shuffle3)
            equal = True
            break


print('shuffled1:',shuffle1, 'shuffled2:',shuffle2, 'shuffled3:', shuffle3)

#creates lists with 1,2,3 combined for use as value pairs for student id key
nested = [[i,j,k] for i,j,k in zip((shuffle1), (shuffle2), (shuffle3))]
print(nested)

fdbkassigned = {}
for key in ISubItem_userId:
    for value in nested:
        fdbkassigned[key] = value
        nested.remove(value)
        break  
print(fdbkassigned)
