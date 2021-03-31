import random

#mock list for trial and error
ISubItem = [3452, 3647, 3948, 3829, 3928, 3726]
studentid = [93049, 90384, 93740, 94873, 94728, 92516]

submissions = ISubItem #iSubItem, object list
results1 = []
results2 = []
results3 = []
#creates 3 seperate sets with 1,2,3 added
for i, j in enumerate(submissions):
    assignid1 = str(submissions[i]) + ('1')
    results1.append(assignid1)
    assignid2 = str(submissions[i]) + ('2')
    results2.append(assignid2)
    assignid3 = str(submissions[i]) + ('3')
    results3.append(assignid3)

# print(results1, results2, results3)


#randomly shuffle lists 2 and 3
shuf_res1 = results1
shuf_res2 = random.sample(results2, len(results2))
shuf_res3 = random.sample(results3, len(results3))
# print(shuf_res1, shuf_res2, shuf_res3)

#creates lists with 1,2,3 combined for use as value pairs for student id key
nested = [[i,j,k] for i,j,k in zip((shuf_res1), (shuf_res2), (shuf_res3))]
# print(nested)


fdbkassigned = {}
for i in studentid:
    for j in nested:
        fdbkassigned[i]=j
print(fdbkassigned)
